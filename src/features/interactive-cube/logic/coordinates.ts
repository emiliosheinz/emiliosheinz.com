/**
 * Coordinate system utilities for the Rubik's Cube.
 * 
 * @module logic/coordinates
 */

import type { Face } from "./cube-state";

export type Coord = -1 | 0 | 1;

/**
 * Converts 2D coordinates to a flat array index (generic for any plane).
 */
function coordToIndex(primary: Coord, secondary: Coord): number {
  const row = primary === 1 ? 0 : primary === 0 ? 1 : 2;
  const col = secondary === -1 ? 0 : secondary === 0 ? 1 : 2;
  return row * 3 + col;
}

/**
 * Converts 2D coordinates to a flat array index for horizontal plane (XY).
 * 
 * @example
 * // Top-left corner of a face viewed from outside
 * indexFromXY(-1, 1) // => 0
 * 
 * // Center sticker
 * indexFromXY(0, 0) // => 4
 */
export function indexFromXY(x: Coord, y: Coord): number {
  return coordToIndex(y, x);
}

/**
 * Converts 2D coordinates to a flat array index for horizontal plane (XZ).
 * 
 * @example
 * // Top face, front-left corner
 * indexFromXZ(-1, 1) // => 6
 */
export function indexFromXZ(x: Coord, z: Coord): number {
  return coordToIndex(z, x);
}

/**
 * Converts 2D coordinates to a flat array index for vertical plane (ZY).
 * 
 * @example
 * // Right face, top-back corner
 * indexFromZY(-1, 1) // => 0
 */
export function indexFromZY(z: Coord, y: Coord): number {
  return coordToIndex(y, z);
}

/**
 * Applies rendering transformation to sticker index based on face orientation.
 * Some faces need mirroring to appear correctly when viewed from outside.
 */
export function renderIndex(face: Face, idx: number): number {
  switch (face) {
    case "B":
    case "R":
      return mirrorX(idx);
    case "U":
      return mirrorY(idx);
    default:
      return idx;
  }
}

function mirrorX(i: number): number {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return r * 3 + (2 - c);
}

function mirrorY(i: number): number {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return (2 - r) * 3 + c;
}

/**
 * Generates all 27 cubie positions in a 3x3x3 cube.
 */
export function getCubiePositions(): Array<[Coord, Coord, Coord]> {
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

/**
 * Determines which cube faces a cubie touches based on its position.
 */
export function getCubieOrientation(position: [Coord, Coord, Coord]) {
  const [x, y, z] = position;
  return {
    isTop: y === 1,
    isBottom: y === -1,
    isLeft: x === -1,
    isRight: x === 1,
    isFront: z === 1,
    isBack: z === -1,
  };
}
