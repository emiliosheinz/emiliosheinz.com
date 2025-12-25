import { Face } from "./cubeState";

export type Coord = -1 | 0 | 1;

export function indexFromXY(x: Coord, y: Coord) {
  const row = y === 1 ? 0 : y === 0 ? 1 : 2;
  const col = x === -1 ? 0 : x === 0 ? 1 : 2;
  return row * 3 + col;
}

export function indexFromXZ(x: Coord, z: Coord) {
  const row = z === 1 ? 0 : z === 0 ? 1 : 2;
  const col = x === -1 ? 0 : x === 0 ? 1 : 2;
  return row * 3 + col;
}

export function indexFromZY(z: Coord, y: Coord) {
  const row = y === 1 ? 0 : y === 0 ? 1 : 2;
  const col = z === -1 ? 0 : z === 0 ? 1 : 2;
  return row * 3 + col;
}

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
