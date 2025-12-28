/**
 * Main Rubik's Cube 3D scene component.
 * Manages layer rotation visualization and gesture handling.
 * 
 * @module components/Cube
 */

import React, { useState, useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Cubie } from "./Cubie";
import { CubeState } from "../logic/cube-state";
import { applyMove } from "../logic/moves";
import {
  Coord,
  indexFromXY,
  indexFromXZ,
  indexFromZY,
  renderIndex,
  getCubiePositions,
  getCubieOrientation,
} from "../logic/coordinates";
import {
  determineRotation,
  worldToCubeLocal,
  computeRotationAngle,
  snapToQuarterTurn,
  FaceName,
  Axis,
} from "../logic/rotation";
import { convertToMove } from "../logic/move-converter";
import { useCubeRotation, RotationState } from "../hooks/useCubeRotation";

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

const DRAG_SENSITIVITY = 0.01;
const MIN_ROTATION_THRESHOLD = (5 * Math.PI) / 36;
const MOVE_COMMIT_THRESHOLD = Math.PI / 4;
const MAX_ROTATION = Math.PI / 2;
const MAX_ANGLE_PER_FRAME = Math.PI / 36;

function isCubieInRotationLayer(
  position: [Coord, Coord, Coord],
  rotation: RotationState | null,
): boolean {
  if (!rotation) return false;
  const [x, y, z] = position;
  switch (rotation.axis) {
    case "x": return x === rotation.layer;
    case "y": return y === rotation.layer;
    case "z": return z === rotation.layer;
  }
}

export const Cube = ({ state, onStateChange, disableDrag = false, cubeGroupRef }: CubeProps) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [moveCommitted, setMoveCommitted] = useState(false);
  const { rotationState, setRotationState, startSnapAnimation, isAnimating } = useCubeRotation();

  const cubiePositions = getCubiePositions();

  const handleDragStart = (info: {
    position: [number, number, number];
    face: FaceName;
    event: ThreeEvent<PointerEvent>;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }) => {
    if (disableDrag || !cubeGroupRef?.current || isAnimating) return;
    
    const [x, y, z] = info.position as [Coord, Coord, Coord];
    
    setDragState({ 
      position: [x, y, z], 
      face: info.face,
      startPoint: info.point.clone(),
      faceNormal: info.normal.clone().normalize(),
      camera: info.event.camera,
    });
    setRotationState(null);
    setMoveCommitted(false);
  };

  const handleDrag = (delta: { x: number; y: number; point?: THREE.Vector3 }) => {
    if (!dragState && !rotationState) return;
    if (!cubeGroupRef?.current || isAnimating) return;

    const screenDelta = { x: delta.x, y: delta.y };

    if (dragState && !rotationState) {
      const absX = Math.abs(screenDelta.x);
      const absY = Math.abs(screenDelta.y);
      
      if (absX < 5 && absY < 5) return;

      const camera = dragState.camera;
      if (!camera) return;

      const cameraRight = new THREE.Vector3();
      const cameraUp = new THREE.Vector3();
      camera.matrixWorld.extractBasis(cameraRight, cameraUp, new THREE.Vector3());
      
      const worldDrag = new THREE.Vector3()
        .addScaledVector(cameraRight, screenDelta.x)
        .addScaledVector(cameraUp, -screenDelta.y);
      
      const localDrag = worldToCubeLocal(worldDrag, cubeGroupRef.current);
      
      const rotationInfo = determineRotation(
        dragState.faceNormal,
        localDrag,
        dragState.position,
      );
      
      const dragMagnitude = Math.sqrt(screenDelta.x * screenDelta.x + screenDelta.y * screenDelta.y);
      const angle = computeRotationAngle(dragMagnitude, rotationInfo.sign, DRAG_SENSITIVITY);

      setRotationState({
        axis: rotationInfo.axis,
        layer: rotationInfo.layer,
        angle,
        startFace: rotationInfo.faceName,
        sign: rotationInfo.sign,
        cumulativeAngle: angle,
      });
      setDragState(null);
      return;
    }

    if (rotationState) {
      const dragMagnitude = Math.sqrt(screenDelta.x * screenDelta.x + screenDelta.y * screenDelta.y);
      const deltaAngle = computeRotationAngle(dragMagnitude, rotationState.sign, DRAG_SENSITIVITY);
      
      const smoothedDeltaAngle = Math.sign(deltaAngle) * Math.min(Math.abs(deltaAngle), MAX_ANGLE_PER_FRAME);
      const newCumulativeAngle = rotationState.cumulativeAngle + smoothedDeltaAngle;

      let finalAngle = smoothedDeltaAngle;
      let justCommitted = false;

      if (Math.abs(newCumulativeAngle) >= MOVE_COMMIT_THRESHOLD && !moveCommitted) {
        setMoveCommitted(true);
        justCommitted = true;
      }

      if (moveCommitted || justCommitted) {
        const clampedCumulative = Math.sign(newCumulativeAngle) * Math.min(Math.abs(newCumulativeAngle), MAX_ROTATION);
        finalAngle = clampedCumulative - rotationState.angle;
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
      setDragState(null);
      return;
    }

    if (Math.abs(rotationState.angle) < MIN_ROTATION_THRESHOLD) {
      setDragState(null);
      setRotationState(null);
      setMoveCommitted(false);
      return;
    }

    const { snappedAngle, quarterTurns } = snapToQuarterTurn(rotationState.angle);
    const move = convertToMove(rotationState.axis, rotationState.layer, quarterTurns);

    startSnapAnimation({
      axis: rotationState.axis,
      layer: rotationState.layer,
      startAngle: rotationState.angle,
      targetAngle: snappedAngle,
      duration: 250,
      onComplete: () => {
        if (move) {
          const newState = applyMove(state, move);
          onStateChange(newState);
        }
        setRotationState(null);
        setMoveCommitted(false);
      },
    });

    setDragState(null);
  };

  const renderCubie = ([x, y, z]: [Coord, Coord, Coord]) => {
    const { isTop, isBottom, isLeft, isRight, isFront, isBack } =
      getCubieOrientation([x, y, z]);
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

  const getOuterRotation = (): [number, number, number] => {
    if (!rotationState) return [0, 0, 0];
    return [
      rotationState.axis === "x" ? rotationState.angle : 0,
      rotationState.axis === "y" ? rotationState.angle : 0,
      rotationState.axis === "z" ? rotationState.angle : 0,
    ];
  };

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
      <group rotation={getOuterRotation()}>
        {cubiePositions.map((position) => {
          const isInRotatingLayer = isCubieInRotationLayer(position, rotationState);

          return (
            <group
              key={`${position[0]},${position[1]},${position[2]}`}
              rotation={isInRotatingLayer ? [0, 0, 0] : getCounterRotation()}
            >
              {renderCubie(position)}
            </group>
          );
        })}
      </group>
    </React.Suspense>
  );
};

Cube.displayName = "Cube";
