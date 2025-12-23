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
