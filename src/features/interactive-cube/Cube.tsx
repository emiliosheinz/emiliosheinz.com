import React, { useState, useRef } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Cubie } from "./Cubie";
import { CubeState } from "./cubeState";
import {
  Coord,
  indexFromXY,
  indexFromXZ,
  indexFromZY,
  renderIndex,
} from "./mapping";
import { applyMove, Move } from "./moves";
import {
  Axis,
  FaceName,
  determineRotation,
  worldToCubeLocal,
  computeRotationAngle,
  snapToQuarterTurn,
} from "./cubeInteraction";

type CubeProps = {
  state: CubeState;
  onStateChange: (newState: CubeState) => void;
  disableDrag?: boolean;
  cubeGroupRef?: React.RefObject<THREE.Group | null>;
};

type DragState = {
  position: [Coord, Coord, Coord];
  face: FaceName;
  startPoint: THREE.Vector3;
  faceNormal: THREE.Vector3;
  camera?: THREE.Camera;
};

type RotationState = {
  axis: Axis;
  layer: Coord;
  angle: number;
  startFace: FaceName;
  sign: number;
  cumulativeAngle: number; // Total rotation accumulated from drag start
} | null;

// Animation state for smooth snap transition after drag ends
type SnapAnimationState = {
  axis: Axis;
  layer: Coord;
  startAngle: number;
  targetAngle: number;
  startTime: number;
  duration: number; // in milliseconds
  onComplete: () => void;
} | null;

function getCubiePositions(): Array<[Coord, Coord, Coord]> {
  const coords: Coord[] = [-1, 0, 1];
  const out: Array<[Coord, Coord, Coord]> = [];
  for (const x of coords) {
    for (const y of coords) {
      for (const z of coords) {
        out.push([x, y, z]);
      }
    }
  }
  return out;
}

function getCurbieOrientation([x, y, z]: [Coord, Coord, Coord]) {
  return {
    isTop: y === 1,
    isBottom: y === -1,
    isLeft: x === -1,
    isRight: x === 1,
    isFront: z === 1,
    isBack: z === -1,
  };
}

function isCubieInRotationLayer(
  position: [Coord, Coord, Coord],
  rotation: RotationState,
): boolean {
  if (!rotation) return false;
  const [x, y, z] = position;
  switch (rotation.axis) {
    case "x":
      return x === rotation.layer;
    case "y":
      return y === rotation.layer;
    case "z":
      return z === rotation.layer;
  }
}

export const Cube = ({ state, onStateChange, disableDrag = false, cubeGroupRef }: CubeProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [rotationState, setRotationState] = useState<RotationState>(null);
  const [snapAnimation, setSnapAnimation] = useState<SnapAnimationState>(null);
  
  // Gesture lock: Prevents endless rotation by committing to a single move per drag gesture.
  // Once cumulative rotation crosses 45°, the gesture is locked and the visual angle is clamped
  // to a maximum of 90° (one quarter turn). The user can continue dragging but the rotation
  // won't exceed this limit until they release and start a new gesture.
  // This mimics the tactile "one move at a time" feel of a physical Rubik's Cube.
  const [moveCommitted, setMoveCommitted] = useState(false);

  const cubiePositions = getCubiePositions();

  // Animation frame loop: interpolate rotation during snap animation
  useFrame(() => {
    if (!snapAnimation) return;

    const now = performance.now();
    const elapsed = now - snapAnimation.startTime;
    const progress = Math.min(elapsed / snapAnimation.duration, 1);

    // Smooth easing function (ease-out cubic for natural deceleration)
    const eased = 1 - Math.pow(1 - progress, 3);

    // Interpolate angle from start to target
    const currentAngle =
      snapAnimation.startAngle +
      (snapAnimation.targetAngle - snapAnimation.startAngle) * eased;

    // Update rotation state with interpolated angle
    setRotationState({
      axis: snapAnimation.axis,
      layer: snapAnimation.layer,
      angle: currentAngle,
      startFace: "front", // Not used during animation
      sign: 1, // Not used during animation
      cumulativeAngle: currentAngle, // Not used during animation
    });

    // Animation complete
    if (progress >= 1) {
      snapAnimation.onComplete();
      setSnapAnimation(null);
    }
  });

  const handleDragStart = (info: {
    position: [number, number, number];
    face: FaceName;
    event: ThreeEvent<PointerEvent>;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }) => {
    if (disableDrag || !cubeGroupRef?.current) return;
    
    const [x, y, z] = info.position as [Coord, Coord, Coord];
    
    console.log(
      `🎯 Drag Start: face=${info.face} pos=[${x},${y},${z}] ` +
      `cubeLocalNormal=[${info.normal.x.toFixed(2)},${info.normal.y.toFixed(2)},${info.normal.z.toFixed(2)}]`
    );
    
    setDragState({ 
      position: [x, y, z], 
      face: info.face,
      startPoint: info.point.clone(),
      faceNormal: info.normal.clone().normalize(), // This is now cube-local normal
      camera: info.event.camera,
    });
    setRotationState(null);
    setMoveCommitted(false); // Reset gesture lock for new drag
  };

  const handleDrag = (delta: { x: number; y: number; point?: THREE.Vector3 }) => {
    if (!dragState && !rotationState) return;
    if (!cubeGroupRef?.current) return;

    // Drag sensitivity: Controls how much rotation per pixel dragged.
    // Lower value = less sensitive, user must drag further for same rotation angle.
    const sensitivity = 0.01;
    const screenDelta = { x: delta.x, y: delta.y };

    // First drag movement - determine axis based on drag direction in cube-local space
    if (dragState && !rotationState) {
      const absX = Math.abs(screenDelta.x);
      const absY = Math.abs(screenDelta.y);
      
      // Threshold to avoid jitter
      if (absX < 5 && absY < 5) return;

      const camera = dragState.camera;
      if (!camera) return;

      // Build world-space drag vector from screen delta
      const cameraRight = new THREE.Vector3();
      const cameraUp = new THREE.Vector3();
      camera.matrixWorld.extractBasis(cameraRight, cameraUp, new THREE.Vector3());
      
      const worldDrag = new THREE.Vector3()
        .addScaledVector(cameraRight, screenDelta.x)
        .addScaledVector(cameraUp, -screenDelta.y);
      
      // Convert world drag to cube-local space
      const localDrag = worldToCubeLocal(worldDrag, cubeGroupRef.current);
      
      console.log(
        `📊 Debug Info:`,
        `\n  Screen Delta: (${screenDelta.x.toFixed(1)}, ${screenDelta.y.toFixed(1)})`,
        `\n  Cube-Local Normal: [${dragState.faceNormal.x.toFixed(2)}, ${dragState.faceNormal.y.toFixed(2)}, ${dragState.faceNormal.z.toFixed(2)}]`,
        `\n  World Drag: [${worldDrag.x.toFixed(2)}, ${worldDrag.y.toFixed(2)}, ${worldDrag.z.toFixed(2)}]`,
        `\n  Local Drag: [${localDrag.x.toFixed(2)}, ${localDrag.y.toFixed(2)}, ${localDrag.z.toFixed(2)}]`,
        `\n  Cube Quaternion: [${cubeGroupRef.current.quaternion.x.toFixed(2)}, ${cubeGroupRef.current.quaternion.y.toFixed(2)}, ${cubeGroupRef.current.quaternion.z.toFixed(2)}, ${cubeGroupRef.current.quaternion.w.toFixed(2)}]`
      );
      
      // Determine rotation - faceNormal is already in cube-local space
      const rotationInfo = determineRotation(
        dragState.faceNormal,  // Cube-local normal (from cubie face direction)
        localDrag,              // Cube-local drag
        dragState.position,
        cubeGroupRef.current,
      );
      
      // Compute initial angle
      const dragMagnitude = Math.sqrt(screenDelta.x * screenDelta.x + screenDelta.y * screenDelta.y);
      const angle = computeRotationAngle(dragMagnitude, rotationInfo.sign, sensitivity);

      console.log(
        `🔄 Rotation Determined:`,
        `\n  Face: ${rotationInfo.faceName} at cubie [${dragState.position.join(',')}]`,
        `\n  LocalNormal: [${rotationInfo.localNormal.x.toFixed(2)}, ${rotationInfo.localNormal.y.toFixed(2)}, ${rotationInfo.localNormal.z.toFixed(2)}]`,
        `\n  LocalDrag: [${rotationInfo.localDragDir.x.toFixed(2)}, ${rotationInfo.localDragDir.y.toFixed(2)}, ${rotationInfo.localDragDir.z.toFixed(2)}]`,
        `\n  LocalRotationAxis: [${rotationInfo.rawCross.x.toFixed(2)}, ${rotationInfo.rawCross.y.toFixed(2)}, ${rotationInfo.rawCross.z.toFixed(2)}]`,
        `\n  Axis: ${rotationInfo.axis} | Layer: ${rotationInfo.layer} | Sign: ${rotationInfo.sign}`,
        `\n  Angle: ${angle.toFixed(4)} rad (${(angle * 180 / Math.PI).toFixed(1)}°)`
      );

      setRotationState({
        axis: rotationInfo.axis,
        layer: rotationInfo.layer,
        angle,
        startFace: rotationInfo.faceName,
        sign: rotationInfo.sign,
        cumulativeAngle: angle, // Initialize cumulative tracking
      });
      setDragState(null);
      return;
    }

    // Subsequent drags - accumulate rotation and check gesture lock
    if (rotationState) {
      const dragMagnitude = Math.sqrt(screenDelta.x * screenDelta.x + screenDelta.y * screenDelta.y);
      const deltaAngle = computeRotationAngle(dragMagnitude, rotationState.sign, sensitivity);
      
      // Smooth out rotation speed by capping maximum angle change per drag event.
      // This prevents jarring, too-fast rotations when dragging quickly.
      const MAX_ANGLE_PER_FRAME = Math.PI / 36; // ~5° max change per frame
      const smoothedDeltaAngle = Math.sign(deltaAngle) * Math.min(Math.abs(deltaAngle), MAX_ANGLE_PER_FRAME);
      
      // Accumulate total rotation from gesture start
      const newCumulativeAngle = rotationState.cumulativeAngle + smoothedDeltaAngle;

      // Gesture lock: Once cumulative rotation crosses the threshold, cap it at one quarter turn.
      // This prevents endless spinning while still allowing the user to continue dragging.
      // The visual angle continues to update but is clamped to prevent going beyond ±90°.
      const MOVE_COMMIT_THRESHOLD = Math.PI / 4; // 45° - commit to discrete move
      const MAX_ROTATION = Math.PI / 2; // 90° - max visual rotation per gesture

      let finalAngle = smoothedDeltaAngle;
      let justCommitted = false;

      // Check if we've crossed the commitment threshold
      if (Math.abs(newCumulativeAngle) >= MOVE_COMMIT_THRESHOLD && !moveCommitted) {
        console.log(`🔒 Move committed at cumulative ${(newCumulativeAngle * 180 / Math.PI).toFixed(1)}° - locking to single quarter turn`);
        setMoveCommitted(true);
        justCommitted = true;
      }

      // If move is committed, clamp the displayed angle to max one quarter turn
      if (moveCommitted || justCommitted) {
        const sign = Math.sign(newCumulativeAngle) || 1;
        const clampedCumulative = Math.sign(newCumulativeAngle) * Math.min(Math.abs(newCumulativeAngle), MAX_ROTATION);
        finalAngle = clampedCumulative - rotationState.angle; // Delta to reach clamped value
        
        console.log(
          `🔒 Gesture locked: cumulative=${(newCumulativeAngle * 180 / Math.PI).toFixed(1)}° ` +
          `clamped=${(clampedCumulative * 180 / Math.PI).toFixed(1)}° ` +
          `finalAngle=${(finalAngle * 180 / Math.PI).toFixed(1)}°`
        );
      } else {
        console.log(
          `↔️ Dragging: axis=${rotationState.axis} layer=${rotationState.layer} ` +
          `deltaAngle=${(smoothedDeltaAngle * 180 / Math.PI).toFixed(1)}° ` +
          `cumulative=${(newCumulativeAngle * 180 / Math.PI).toFixed(1)}°`
        );
      }

      setRotationState({
        ...rotationState,
        angle: rotationState.angle + finalAngle,
        cumulativeAngle: newCumulativeAngle,
      });
    }
  };

  const handleDragEnd = () => {
    if (!rotationState) {
      console.log("🛑 Drag End: No rotation (cancelled)");
      setDragState(null);
      return;
    }

    // Minimum rotation threshold: Ignore tiny accidental movements.
    // User must rotate at least 25° to commit to a move, preventing unintentional turns
    // from small touches or jitters.
    const MIN_ROTATION_THRESHOLD = (5 * Math.PI) / 36; // 25 degrees

    if (Math.abs(rotationState.angle) < MIN_ROTATION_THRESHOLD) {
      console.log(
        `🚫 Rotation too small (${(rotationState.angle * 180 / Math.PI).toFixed(1)}° < ${(MIN_ROTATION_THRESHOLD * 180 / Math.PI).toFixed(0)}°) - cancelling move`
      );
      setDragState(null);
      setRotationState(null);
      setMoveCommitted(false);
      return;
    }

    const { snappedAngle, quarterTurns } = snapToQuarterTurn(rotationState.angle);
    const move = getMove(rotationState.axis, rotationState.layer, quarterTurns);

    console.log(
      `✅ Drag End:`,
      `\n  Axis: ${rotationState.axis} | Layer: ${rotationState.layer}`,
      `\n  Raw angle: ${rotationState.angle.toFixed(4)} rad (${(rotationState.angle * 180 / Math.PI).toFixed(1)}°)`,
      `\n  Snapped: ${snappedAngle.toFixed(4)} rad (${(snappedAngle * 180 / Math.PI).toFixed(0)}°)`,
      `\n  Quarter turns: ${quarterTurns}`,
      `\n  Move: ${move || "none"}`,
      `\n  ✓ Verification: ${rotationState.axis}${rotationState.layer > 0 ? '+' : ''}${rotationState.layer} × ${quarterTurns}qt = ${move || "none"}`
    );

    // Start snap animation: smoothly interpolate from current angle to snapped angle
    // Longer duration for smoother, more deliberate feel
    setSnapAnimation({
      axis: rotationState.axis,
      layer: rotationState.layer,
      startAngle: rotationState.angle,
      targetAngle: snappedAngle,
      startTime: performance.now(),
      duration: 250, // Increased from 150ms to 250ms for smoother snap
      onComplete: () => {
        // Apply the move and clear rotation state after animation completes
        if (move) {
          const newState = applyMove(state, move);
          onStateChange(newState);
        }
        setRotationState(null);
      },
    });

    setDragState(null);
  };

  function getMove(
    axis: Axis,
    layer: Coord | 0,
    quarterTurns: number,
  ): Move | null {
    const normalized = ((quarterTurns % 4) + 4) % 4;

    if (normalized === 0) return null; // No rotation

    // Handle middle layers (layer === 0)
    if (layer === 0) {
      if (axis === "x") {
        // M slice (between L and R), follows L direction
        if (normalized === 1) return "M";
        if (normalized === 3) return "M'";
      } else if (axis === "y") {
        // E slice (between U and D), follows D direction
        if (normalized === 1) return "E";
        if (normalized === 3) return "E'";
      } else if (axis === "z") {
        // S slice (between F and B), follows F direction
        if (normalized === 1) return "S";
        if (normalized === 3) return "S'";
      }
      return null;
    }

    /**
     * STANDARD RUBIK'S CUBE NOTATION vs RIGHT-HAND RULE:
     * 
     * Rubik's notation defines moves by looking AT each face from outside:
     * - R = Right face clockwise (when looking at right face)
     * - U = Top face clockwise (when looking at top face from above)
     * - F = Front face clockwise (when looking at front face)
     * 
     * Right-hand rule with positive axis rotation:
     * - Thumb points along +axis, fingers curl in positive rotation direction
     * - +X rotation: thumb right, fingers curl from +Z to +Y
     * - +Y rotation: thumb up, fingers curl from +X to +Z  
     * - +Z rotation: thumb forward, fingers curl from +Y to +X
     * 
     * KEY INSIGHT: Looking AT a face from outside is OPPOSITE to axis direction!
     * - R face: looking from +X at face means rotation around +X axis INVERTED
     * - When qt=+1 (positive axis rotation), the face appears to turn COUNTER-clockwise
     * - So qt=1 → R', qt=3 → R (all faces inverted)
     * 
     * INVERSION APPLIES TO ALL FACES because notation is always "looking at face from outside"
     */
    
    if (axis === "x") {
      if (layer === 1) {
        // Right face (R): looking at face from +X direction (outside cube)
        // qt=1 (positive +X rotation) appears CCW from outside → R'
        if (normalized === 1) return "R'";
        if (normalized === 3) return "R";
      } else if (layer === -1) {
        // Left face (L): looking at face from -X direction (outside cube)
        // qt=1 (positive +X rotation) appears CW from outside → L
        if (normalized === 1) return "L";
        if (normalized === 3) return "L'";
      }
    } else if (axis === "y") {
      if (layer === 1) {
        // Top face (U): looking down at face from +Y direction (outside cube)
        // qt=1 (positive +Y rotation) appears CCW from outside → U'
        if (normalized === 1) return "U'";
        if (normalized === 3) return "U";
      } else if (layer === -1) {
        // Bottom face (D): looking up at face from -Y direction (outside cube)
        // qt=1 (positive +Y rotation) appears CW from outside → D
        if (normalized === 1) return "D";
        if (normalized === 3) return "D'";
      }
    } else if (axis === "z") {
      if (layer === 1) {
        // Front face (F): looking at face from +Z direction (outside cube)
        // qt=1 (positive +Z rotation) appears CCW from outside → F'
        if (normalized === 1) return "F'";
        if (normalized === 3) return "F";
      } else if (layer === -1) {
        // Back face (B): looking at face from -Z direction (outside cube)
        // qt=1 (positive +Z rotation) appears CW from outside → B
        if (normalized === 1) return "B";
        if (normalized === 3) return "B'";
      }
    }

    return null;
  }

  const renderCubie = ([x, y, z]: [Coord, Coord, Coord]) => {
    const { isTop, isBottom, isLeft, isRight, isFront, isBack } =
      getCurbieOrientation([x, y, z]);
    return (
      <Cubie
        key={`${x},${y},${z}`}
        position={[x, y, z]}
        upColor={
          isTop ? state.U[renderIndex("U", indexFromXZ(x, z))] : undefined
        }
        downColor={
          isBottom ? state.D[renderIndex("D", indexFromXZ(x, z))] : undefined
        }
        leftColor={
          isLeft ? state.L[renderIndex("L", indexFromZY(z, y))] : undefined
        }
        rightColor={
          isRight ? state.R[renderIndex("R", indexFromZY(z, y))] : undefined
        }
        frontColor={
          isFront ? state.F[renderIndex("F", indexFromXY(x, y))] : undefined
        }
        backColor={
          isBack ? state.B[renderIndex("B", indexFromXY(x, y))] : undefined
        }
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
    );
  };

  // Helper to get rotation angles for the outer group
  const getOuterRotation = (): [number, number, number] => {
    if (!rotationState) return [0, 0, 0];
    return [
      rotationState.axis === "x" ? rotationState.angle : 0,
      rotationState.axis === "y" ? rotationState.angle : 0,
      rotationState.axis === "z" ? rotationState.angle : 0,
    ];
  };

  // Helper to get counter-rotation for cubies NOT in the rotating layer
  const getCounterRotation = (): [number, number, number] => {
    if (!rotationState) return [0, 0, 0];
    return [
      rotationState.axis === "x" ? -rotationState.angle : 0,
      rotationState.axis === "y" ? -rotationState.angle : 0,
      rotationState.axis === "z" ? -rotationState.angle : 0,
    ];
  };

  return (
    <React.Suspense fallback={null}>
      {/* 
        All cubies are wrapped in a single rotating group.
        This ensures cubies never unmount/remount during rotation.
      */}
      <group rotation={getOuterRotation()}>
        {cubiePositions.map((position) => {
          const isInRotatingLayer = isCubieInRotationLayer(
            position,
            rotationState,
          );

          return (
            <group
              key={`${position[0]},${position[1]},${position[2]}`}
              rotation={isInRotatingLayer ? [0, 0, 0] : getCounterRotation()}
            >
              {/* 
                Cubies in rotating layer: inherit parent rotation (0 counter-rotation)
                Cubies NOT in rotating layer: cancel parent rotation (negative counter-rotation)
              */}
              {renderCubie(position)}
            </group>
          );
        })}
      </group>
    </React.Suspense>
  );
};

Cube.displayName = "Cube";
