import { Move, applyMove } from "./moves";
import { CubeState } from "./cubeState";

const MOVES: Move[] = [
  "U","U'","U2","R","R'","R2","F","F'","F2","L","L'","L2","D","D'","D2","B","B'","B2",
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
