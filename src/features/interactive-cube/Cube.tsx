import React from "react";
import { Cubie } from "./Cubie";
import { CubeState } from "./cubeState";
import {
  Coord,
  indexFromXY,
  indexFromXZ,
  indexFromZY,
  negativeCoord,
  renderIndex,
} from "./mapping";

export type CubeRef = {};

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

export const Cube = React.forwardRef<CubeRef, { state: CubeState }>(
  ({ state }, ref) => {
    return (
      <React.Suspense fallback={null}>
        {getCubiePositions().map(([x, y, z]) => {
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
                isBottom
                  ? state.D[renderIndex("D", indexFromXZ(x, z))]
                  : undefined
              }
              leftColor={
                isLeft
                  ? state.L[renderIndex("L", indexFromZY(z, y))]
                  : undefined
              }
              rightColor={
                isRight
                  ? state.R[renderIndex("R", indexFromZY(z, y))]
                  : undefined
              }
              frontColor={
                isFront
                  ? state.F[renderIndex("F", indexFromXY(x, y))]
                  : undefined
              }
              backColor={
                isBack
                  ? state.B[renderIndex("B", indexFromXY(x, y))]
                  : undefined
              }
            />
          );
        })}
      </React.Suspense>
    );
  },
);

Cube.displayName = "Cube";
