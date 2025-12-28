/**
 * Cube scrambling utilities.
 * 
 * @module utils/scramble
 */

import { Move, applyMove } from "../logic/moves";
import { CubeState } from "../logic/cube-state";

/**
 * Basic moves for scrambling (excludes middle layer moves M, E, S).
 */
const BASIC_MOVES = [
  "U", "U'", "R", "R'", "F", "F'",
  "L", "L'", "D", "D'", "B", "B'",
] as const satisfies readonly Move[];

/**
 * Generates a random scramble sequence and applies it to the cube state.
 * 
 * @param state - Initial cube state
 * @param length - Number of random moves (default: 20)
 * @returns Scrambled state and the move sequence
 */
export function scramble(state: CubeState, length = 20) {
  let s = state;
  const seq: Move[] = [];

  for (let i = 0; i < length; i++) {
    const m = BASIC_MOVES[Math.floor(Math.random() * BASIC_MOVES.length)];
    seq.push(m);
    s = applyMove(s, m);
  }

  return { state: s, sequence: seq };
}
