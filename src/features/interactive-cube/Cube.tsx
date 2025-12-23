import React from "react";
import { Cubie } from "./Cubie";
import { CubeState } from "./cubeState";
import { Coord, indexFromXY, indexFromXZ, indexFromZY } from "./mapping";

export type CubeRef = {};

function positions(): Array<[Coord, Coord, Coord]> {
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

export const Cube = React.forwardRef<CubeRef, { state: CubeState }>(
  ({ state }, ref) => {
    return (
      <React.Suspense fallback={null}>
        {positions().map(([x, y, z]) => (
          <Cubie
            key={`${x},${y},${z}`}
            position={[x, y, z]}
            // U / D faces use (x,z)
            upColor={y === 1 ? state.U[indexFromXZ(x, z)] : undefined}
            downColor={y === -1 ? state.D[indexFromXZ(x, z)] : undefined}
            // L / R faces use (z,y)
            leftColor={x === -1 ? state.L[indexFromXZ(z, y)] : undefined}
            rightColor={x === 1 ? state.R[indexFromZY(z, y)] : undefined}
            // F / B faces use (x,y)
            frontColor={z === 1 ? state.F[indexFromXY(x, y)] : undefined}
            backColor={z === -1 ? state.B[indexFromXY(x, y)] : undefined}
          />
        ))}
      </React.Suspense>
    );
  },
);

Cube.displayName = "Cube";
