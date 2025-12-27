import React, { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
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
};

type Axis = "x" | "y" | "z";

type RotationState = {
  axis: Axis;
  layer: Coord;
  angle: number;
  startFace: 'right' | 'left' | 'up' | 'down' | 'front' | 'back';
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

export const Cube = ({ state, onStateChange }: CubeProps) => {
  const [rotationState, setRotationState] = useState<RotationState>(null);

  const cubiePositions = getCubiePositions();
  const rotatingCubiePositions = cubiePositions.filter((position) =>
    isCubieInRotationLayer(position, rotationState),
  );
  const staticCubiePositions = cubiePositions.filter(
    (position) => !isCubieInRotationLayer(position, rotationState),
  );

  const handleDragStart = (info: {
    position: [number, number, number];
    face: 'right' | 'left' | 'up' | 'down' | 'front' | 'back';
    event: ThreeEvent<PointerEvent>;
  }) => {
    const [x, y, z] = info.position as [Coord, Coord, Coord];
    let axis: Axis;
    let layer: Coord;

    // Determine axis and layer based on which face was clicked
    switch (info.face) {
      case 'up':
      case 'down':
        axis = 'y';
        layer = y;
        break;
      case 'right':
      case 'left':
        axis = 'x';
        layer = x;
        break;
      case 'front':
      case 'back':
        axis = 'z';
        layer = z;
        break;
    }

    setRotationState({
      axis,
      layer,
      angle: 0,
      startFace: info.face,
    });
  };

  const handleDrag = (delta: { x: number; y: number }) => {
    if (!rotationState) return;

    // Calculate rotation angle based on drag delta
    // Use the dominant direction (x or y) based on the axis
    const sensitivity = 0.01; // Adjust this to change rotation speed
    
    let angle = 0;
    
    // Determine which drag direction to use based on axis and face
    switch (rotationState.axis) {
      case 'y':
        // For Y-axis rotations, use horizontal drag
        angle = delta.x * sensitivity;
        break;
      case 'x':
        // For X-axis rotations, use vertical drag
        angle = -delta.y * sensitivity;
        break;
      case 'z':
        // For Z-axis rotations, use horizontal drag
        angle = delta.x * sensitivity;
        break;
    }

    setRotationState({
      ...rotationState,
      angle,
    });
  };

  const handleDragEnd = () => {
    if (!rotationState) return;

    // Snap to nearest 90 degrees
    const snapAngle = Math.round(rotationState.angle / (Math.PI / 2)) * (Math.PI / 2);
    
    // Determine how many 90-degree turns (0, 1, 2, 3, or negative)
    const quarterTurns = Math.round(snapAngle / (Math.PI / 2));
    
    // Convert to a Move based on axis, layer, and direction
    const move = getMove(rotationState.axis, rotationState.layer, quarterTurns);
    
    if (move) {
      const newState = applyMove(state, move);
      onStateChange(newState);
    }

    // Clear rotation state
    setRotationState(null);
  };

  // Helper function to convert rotation info to a Move
  function getMove(axis: Axis, layer: Coord, quarterTurns: number): Move | null {
    // Normalize quarterTurns to 0, 1, 2, 3
    const normalized = ((quarterTurns % 4) + 4) % 4;
    
    if (normalized === 0) return null; // No rotation
    
    // Map axis + layer + direction to move notation
    if (axis === 'y') {
      if (layer === 1) {
        // Top layer (U)
        if (normalized === 1) return 'U';
        if (normalized === 3) return "U'";
        // Note: U2 would need to be handled differently
      } else if (layer === -1) {
        // Bottom layer (D)
        if (normalized === 1) return 'D';
        if (normalized === 3) return "D'";
      }
    } else if (axis === 'x') {
      if (layer === 1) {
        // Right layer (R)
        if (normalized === 1) return 'R';
        if (normalized === 3) return "R'";
      } else if (layer === -1) {
        // Left layer (L)
        if (normalized === 1) return 'L';
        if (normalized === 3) return "L'";
      }
    } else if (axis === 'z') {
      if (layer === 1) {
        // Front layer (F)
        if (normalized === 1) return 'F';
        if (normalized === 3) return "F'";
      } else if (layer === -1) {
        // Back layer (B)
        if (normalized === 1) return 'B';
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

  return (
    <React.Suspense fallback={null}>
      {staticCubiePositions.map(renderCubie)}
      {!!rotatingCubiePositions.length ? (
        <group
          rotation={[
            rotationState?.axis === "x" ? rotationState.angle : 0,
            rotationState?.axis === "y" ? rotationState.angle : 0,
            rotationState?.axis === "z" ? rotationState.angle : 0,
          ]}
        >
          {rotatingCubiePositions.map(renderCubie)}
        </group>
      ) : null}
    </React.Suspense>
  );
};

Cube.displayName = "Cube";
