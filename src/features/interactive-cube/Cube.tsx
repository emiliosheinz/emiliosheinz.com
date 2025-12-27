import React, { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
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

type CubeProps = {
  state: CubeState;
  onStateChange: (newState: CubeState) => void;
  disableDrag?: boolean;
};

type Axis = "x" | "y" | "z";

type DragState = {
  position: [Coord, Coord, Coord];
  face: "right" | "left" | "up" | "down" | "front" | "back";
  startPoint: THREE.Vector3;
  faceNormal: THREE.Vector3;
  camera?: THREE.Camera;
};

type RotationState = {
  axis: Axis;
  layer: Coord;
  angle: number;
  startFace: "right" | "left" | "up" | "down" | "front" | "back";
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

export const Cube = ({ state, onStateChange, disableDrag = false }: CubeProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [rotationState, setRotationState] = useState<RotationState>(null);

  const cubiePositions = getCubiePositions();

  const handleDragStart = (info: {
    position: [number, number, number];
    face: "right" | "left" | "up" | "down" | "front" | "back";
    event: ThreeEvent<PointerEvent>;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }) => {
    if (disableDrag) return;
    const [x, y, z] = info.position as [Coord, Coord, Coord];
    console.log(
      `🎯 Drag Start: face=${info.face} pos=[${x},${y},${z}] point=[${info.point.x.toFixed(2)},${info.point.y.toFixed(2)},${info.point.z.toFixed(2)}] normal=[${info.normal.x.toFixed(2)},${info.normal.y.toFixed(2)},${info.normal.z.toFixed(2)}]`
    );
    setDragState({ 
      position: [x, y, z], 
      face: info.face,
      startPoint: info.point.clone(),
      faceNormal: info.normal.clone().normalize(),
      camera: info.event.camera,
    });
    setRotationState(null);
  };

  const handleDrag = (delta: { x: number; y: number; point?: THREE.Vector3 }) => {
    if (!dragState && !rotationState) return;

    const sensitivity = 0.01;

    // First drag movement - determine axis based on drag direction
    if (dragState && !rotationState) {
      const absX = Math.abs(delta.x);
      const absY = Math.abs(delta.y);
      
      // Threshold to avoid jitter
      if (absX < 5 && absY < 5) return;

      const [x, y, z] = dragState.position;
      const faceNormal = dragState.faceNormal;
      
      // Determine rotation axis based on face and drag direction
      // Each face allows rotation on TWO perpendicular axes (not the face normal)
      let axis: Axis;
      let layer: number;
      
      const isHorizontalDrag = absX > absY;
      
      if (Math.abs(faceNormal.y) > 0.9) {
        // Y face (up/down) - horizontal face
        // Horizontal drag → Z axis, Vertical drag → X axis
        if (isHorizontalDrag) {
          axis = "z";
          layer = z;
        } else {
          axis = "x";
          layer = x;
        }
      } else if (Math.abs(faceNormal.x) > 0.9) {
        // X face (right/left) - vertical face on side
        // Horizontal drag → Y axis, Vertical drag → Z axis
        if (isHorizontalDrag) {
          axis = "y";
          layer = y;
        } else {
          axis = "z";
          layer = z;
        }
      } else {
        // Z face (front/back) - vertical face front/back
        // Horizontal drag → Y axis, Vertical drag → X axis
        if (isHorizontalDrag) {
          axis = "y";
          layer = y;
        } else {
          axis = "x";
          layer = x;
        }
      }
      
      // Calculate rotation sign
      const dragMagnitude = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      let sign = 1;
      
      // Determine sign based on axis and drag direction
      if (axis === "y") {
        // Y-axis: horizontal drag controls it
        sign = delta.x > 0 ? 1 : -1;
        // Flip for negative layer
        if (layer < 0) sign *= -1;
      } else if (axis === "x") {
        // X-axis: vertical drag controls it
        sign = delta.y < 0 ? 1 : -1; // Y inverted
        // Flip for negative layer
        if (layer < 0) sign *= -1;
      } else {
        // Z-axis: depends on which type of drag triggered it
        if (isHorizontalDrag) {
          sign = delta.x > 0 ? 1 : -1;
        } else {
          sign = delta.y < 0 ? 1 : -1;
        }
        // Flip for negative layer
        if (layer < 0) sign *= -1;
      }
      
      const angle = dragMagnitude * sensitivity * sign;

      console.log(
        `🔄 Axis Determined: face=${dragState.face} normal=[${faceNormal.x.toFixed(2)},${faceNormal.y.toFixed(2)},${faceNormal.z.toFixed(2)}] pos=[${dragState.position.join(',')}] delta=(${delta.x.toFixed(1)},${delta.y.toFixed(1)}) dragDir=${isHorizontalDrag ? 'H' : 'V'} axis=${axis} layer=${layer} sign=${sign} angle=${angle.toFixed(4)} (${(angle * 180 / Math.PI).toFixed(1)}°)`
      );

      setRotationState({
        axis,
        layer: layer as Coord,
        angle,
        startFace: dragState.face,
      });
      setDragState(null);
      return;
    }

    // Subsequent drags - update rotation angle
    if (rotationState) {
      const absX = Math.abs(delta.x);
      const absY = Math.abs(delta.y);
      const isHorizontalDrag = absX > absY;
      
      const dragMagnitude = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      let sign = 1;
      
      if (rotationState.axis === "y") {
        sign = delta.x > 0 ? 1 : -1;
        if (rotationState.layer < 0) sign *= -1;
      } else if (rotationState.axis === "x") {
        sign = delta.y < 0 ? 1 : -1;
        if (rotationState.layer < 0) sign *= -1;
      } else {
        if (isHorizontalDrag) {
          sign = delta.x > 0 ? 1 : -1;
        } else {
          sign = delta.y < 0 ? 1 : -1;
        }
        if (rotationState.layer < 0) sign *= -1;
      }
      
      const angle = dragMagnitude * sensitivity * sign;

      console.log(
        `↔️ Dragging: axis=${rotationState.axis} layer=${rotationState.layer} delta=(${delta.x.toFixed(1)},${delta.y.toFixed(1)}) angle=${angle.toFixed(4)} (${(angle * 180 / Math.PI).toFixed(1)}°)`
      );

      setRotationState({
        ...rotationState,
        angle,
      });
    }
  };

  const handleDragEnd = () => {
    if (!rotationState) {
      console.log("🛑 Drag End: No rotation (cancelled)");
      setDragState(null);
      return;
    }

    const snapAngle =
      Math.round(rotationState.angle / (Math.PI / 2)) * (Math.PI / 2);

    const quarterTurns = Math.round(snapAngle / (Math.PI / 2));

    const move = getMove(rotationState.axis, rotationState.layer, quarterTurns);

    console.log(
      `✅ Drag End: axis=${rotationState.axis} layer=${rotationState.layer} raw=${rotationState.angle.toFixed(4)} (${(rotationState.angle * 180 / Math.PI).toFixed(1)}°) snap=${snapAngle.toFixed(4)} (${(snapAngle * 180 / Math.PI).toFixed(0)}°) turns=${quarterTurns} move=${move || "none"}`
    );

    if (move) {
      const newState = applyMove(state, move);
      onStateChange(newState);
    }

    setDragState(null);
    setRotationState(null);
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
        // M slice (between L and R)
        if (normalized === 1) return "M";
        if (normalized === 3) return "M'";
      } else if (axis === "y") {
        // E slice (between U and D)
        if (normalized === 1) return "E";
        if (normalized === 3) return "E'";
      } else if (axis === "z") {
        // S slice (between F and B)
        if (normalized === 1) return "S'";
        if (normalized === 3) return "S";
      }
      return null;
    }

    // Standard Rubik's cube notation for outer layers
    if (axis === "y") {
      if (layer === 1) {
        // Top face (U)
        if (normalized === 1) return "U'";
        if (normalized === 3) return "U";
      } else if (layer === -1) {
        // Bottom face (D)
        if (normalized === 1) return "D";
        if (normalized === 3) return "D'";
      }
    } else if (axis === "x") {
      if (layer === 1) {
        // Right face (R)
        if (normalized === 1) return "R'";
        if (normalized === 3) return "R";
      } else if (layer === -1) {
        // Left face (L)
        if (normalized === 1) return "L";
        if (normalized === 3) return "L'";
      }
    } else if (axis === "z") {
      if (layer === 1) {
        // Front face (F)
        if (normalized === 1) return "F'";
        if (normalized === 3) return "F";
      } else if (layer === -1) {
        // Back face (B)
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
