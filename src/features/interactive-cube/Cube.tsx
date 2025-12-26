import React, { useState } from "react";
import { Cubie } from "./Cubie";
import { CubeState } from "./cubeState";
import {
  Coord,
  indexFromXY,
  indexFromXZ,
  indexFromZY,
  renderIndex,
} from "./mapping";

type CubeProps = {
  state: CubeState;
  onStateChange: (newState: CubeState) => void;
};

type RotationState = {
  axis: "x" | "y" | "z";
  layer: Coord;
  angle: number;
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
        onDragStart={({ face, event }) => {
          console.log("Drag started on face:", face, { event });
        }}
        onDrag={({ x: deltaX, y: deltaY }) => {
          console.log("Dragging...", { deltaX, deltaY });
        }}
        onDragEnd={() => {
          console.log("Drag ended");
        }}
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
