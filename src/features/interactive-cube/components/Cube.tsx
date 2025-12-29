/**
 * Main Rubik's Cube 3D scene component.
 * Manages layer rotation visualization and gesture handling.
 *
 * @module components/Cube
 */

import React, { useEffect, useRef, useState } from "react";
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

type DragStart = {
  position: [Coord, Coord, Coord];
  faceNormal: THREE.Vector3;
  camera: THREE.Camera;
  initialPointer: { x: number; y: number };
};

const SMOOTHING_FACTOR = 0.3;
const DRAG_SENSITIVITY = 0.01;
const DRAG_START_THRESHOLD = 5;
const MAX_ROTATION = Math.PI / 2;
const MIN_ROTATION_THRESHOLD = (5 * Math.PI) / 36;
const CUBIE_POSITIONS = getCubiePositions();
const cameraRight = new THREE.Vector3();
const cameraUp = new THREE.Vector3();

function isCubieInRotationLayer(
  position: [Coord, Coord, Coord],
  rotation: RotationState | null,
): boolean {
  if (!rotation) return false;
  return (
    position[rotation.axis === "x" ? 0 : rotation.axis === "y" ? 1 : 2] ===
    rotation.layer
  );
}

export const Cube = ({
  state,
  onStateChange,
  disableDrag = false,
  cubeGroupRef,
}: CubeProps) => {
  /** Stores information about where the drag action started */
  const dragStartRef = useRef<DragStart>(null);
  const { rotationState, setRotationState, startSnapAnimation, isAnimating } =
    useCubeRotation();

  const handleDragStart = (info: {
    position: [number, number, number];
    face: FaceName;
    event: ThreeEvent<PointerEvent>;
    normal: THREE.Vector3;
  }) => {
    if (disableDrag || isAnimating) return;
    dragStartRef.current = {
      faceNormal: info.normal,
      camera: info.event.camera,
      position: info.position as [Coord, Coord, Coord],
      initialPointer: { x: info.event.clientX, y: info.event.clientY },
    };
    setRotationState(null);
  };

  const handleDrag = (pointer: { x: number; y: number }) => {
    /** Checks preconditions to start handling drag action */
    if (!dragStartRef.current && !rotationState) return;
    if (!cubeGroupRef?.current || isAnimating) return;
    if (!dragStartRef.current) return;
    
    const totalDeltaX = pointer.x - dragStartRef.current.initialPointer.x;
    const totalDeltaY = pointer.y - dragStartRef.current.initialPointer.y;
    
    if (
      Math.abs(totalDeltaX) < DRAG_START_THRESHOLD &&
      Math.abs(totalDeltaY) < DRAG_START_THRESHOLD
    )
      return;

    /** Start the rotation */
    if (dragStartRef.current && !rotationState) {
      dragStartRef.current.camera.matrixWorld.extractBasis(
        cameraRight,
        cameraUp,
        new THREE.Vector3(),
      );

      const worldDrag = new THREE.Vector3()
        .addScaledVector(cameraRight, totalDeltaX)
        .addScaledVector(cameraUp, -totalDeltaY);

      const localDrag = worldToCubeLocal(worldDrag, cubeGroupRef.current);
      const rotationInfo = determineRotation(
        dragStartRef.current.faceNormal,
        localDrag,
        dragStartRef.current.position,
      );

      if (!rotationInfo) return;

      const dragMagnitude = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
      const angle = computeRotationAngle(
        dragMagnitude,
        rotationInfo.sign,
        DRAG_SENSITIVITY,
      );

      setRotationState({
        angle,
        axis: rotationInfo.axis,
        layer: rotationInfo.layer,
        sign: rotationInfo.sign,
      });
      return;
    }

    /** Continue the rotation */
    if (rotationState) {
      const dragMagnitude = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
      const targetAngle = computeRotationAngle(
        dragMagnitude,
        rotationState.sign,
        DRAG_SENSITIVITY,
      );

      const clampedTarget = Math.sign(targetAngle) * Math.min(Math.abs(targetAngle), MAX_ROTATION);
      
      const smoothedAngle = rotationState.angle + 
        (clampedTarget - rotationState.angle) * SMOOTHING_FACTOR;

      setRotationState({
        ...rotationState,
        angle: smoothedAngle,
      });
    }
  };

  const handleDragEnd = () => {
    if (!rotationState) {
      dragStartRef.current = null;
      return;
    }

    if (Math.abs(rotationState.angle) < MIN_ROTATION_THRESHOLD) {
      dragStartRef.current = null;
      setRotationState(null);
      return;
    }

    const { snappedAngle, quarterTurns } = snapToQuarterTurn(
      rotationState.angle,
    );
    const move = convertToMove(
      rotationState.axis,
      rotationState.layer,
      quarterTurns,
    );

    startSnapAnimation({
      axis: rotationState.axis,
      layer: rotationState.layer,
      startAngle: rotationState.angle,
      targetAngle: snappedAngle,
      duration: 250,
      onComplete: () => {
        if (!move) return;
        onStateChange(applyMove(state, move));
      },
    });
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
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      />
    );
  };

  const getRotation = (
    axis: Axis,
    angle: number,
    invert = false,
  ): [number, number, number] => {
    const value = invert ? -angle : angle;
    return [
      axis === "x" ? value : 0,
      axis === "y" ? value : 0,
      axis === "z" ? value : 0,
    ];
  };

  const outerRotation = rotationState
    ? getRotation(rotationState.axis, rotationState.angle)
    : ([0, 0, 0] as [number, number, number]);
  const counterRotation = rotationState
    ? getRotation(rotationState.axis, rotationState.angle, true)
    : ([0, 0, 0] as [number, number, number]);

  return (
    <React.Suspense fallback={null}>
      <group rotation={outerRotation}>
        {CUBIE_POSITIONS.map((position) => (
          <group
            key={`${position[0]},${position[1]},${position[2]}`}
            rotation={
              isCubieInRotationLayer(position, rotationState)
                ? [0, 0, 0]
                : counterRotation
            }
          >
            {renderCubie(position)}
          </group>
        ))}
      </group>
    </React.Suspense>
  );
};
