/**
 * Cube scrambling utilities.
 *
 * @module utils/scramble
 */

import type { CubeState } from "../logic/cube-state";
import { applyMove, type Move } from "../logic/moves";

/**
 * Basic moves for scrambling (excludes middle layer moves M, E, S).
 */
const BASIC_MOVES = [
  "U",
  "U'",
  "R",
  "R'",
  "F",
  "F'",
  "L",
  "L'",
  "D",
  "D'",
  "B",
  "B'",
] as const satisfies readonly Move[];

/**
 * Generates a random scramble sequence and applies it to the cube state.
 *
 * @param state - Initial cube state
 * @param length - Number of random moves (default: 26)
 * @returns Scrambled state
 */
export function scramble(state: CubeState, length = 26) {
  let s = state;

  for (let i = 0; i < length; i++) {
    const m = BASIC_MOVES[Math.floor(Math.random() * BASIC_MOVES.length)];
    s = applyMove(s, m);
  }

  return s;
}
