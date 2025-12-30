/**
 * Cube state model and factory functions.
 * 
 * @module logic/cube-state
 */

export type Face = "U" | "D" | "L" | "R" | "F" | "B";
export type Sticker = "white" | "yellow" | "red" | "orange" | "green" | "blue";
export type CubeState = Record<Face, Sticker[]>;

/**
 * Creates a solved cube state with standard color scheme.
 */
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
