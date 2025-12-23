export type Face = "U" | "D" | "L" | "R" | "F" | "B";

export type Sticker = "white" | "yellow" | "red" | "orange" | "green" | "blue";

export type CubeState = Record<Face, Sticker[]>;

export function createSolvedState(): CubeState {
  return {
    U: Array(9).fill("yellow"),
    D: Array(9).fill("white"),
    L: Array(9).fill("red"),
    R: Array(9).fill("orange"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
  };
}
