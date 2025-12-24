import { Move, applyMove } from "./moves";
import { CubeState } from "./cubeState";

const MOVES: Move[] = [
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
];

export function scramble(state: CubeState, length = 20) {
  let s = state;
  const seq: Move[] = [];

  for (let i = 0; i < length; i++) {
    const m = MOVES[Math.floor(Math.random() * MOVES.length)];
    seq.push(m);
    s = applyMove(s, m);
  }

  return { state: s, sequence: seq };
}
