import { CubeState, Sticker } from "./cubeState";

export type Move = "U" | "U'" | "U2" | "R" | "R'" | "R2" | "F" | "F'" | "F2" | "L" | "L'" | "L2" | "D" | "D'" | "D2" | "B" | "B'" | "B2";

function rotateFaceCW(face: Sticker[]) {
  // indices:
  // 0 1 2
  // 3 4 5
  // 6 7 8
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

function cloneState(s: CubeState): CubeState {
  return {
    U: [...s.U],
    D: [...s.D],
    L: [...s.L],
    R: [...s.R],
    F: [...s.F],
    B: [...s.B],
  };
}

// Example: U turn (clockwise looking at U face)
export function applyMove(state: CubeState, move: Move): CubeState {
  if (move === "U") return applyU(state);
  if (move === "U'") return applyU(applyU(applyU(state))); // 3x CW
  if (move === "U2") return applyU(applyU(state));

  // implement the rest similarly
  throw new Error(`Move not implemented: ${move}`);
}

function applyU(state: CubeState): CubeState {
  const s = cloneState(state);

  // rotate U face itself
  s.U = rotateFaceCW(s.U);

  // cycle the top rows of F, R, B, L
  // top row indices are [0,1,2]
  const F = [state.F[0], state.F[1], state.F[2]];
  const R = [state.R[0], state.R[1], state.R[2]];
  const B = [state.B[0], state.B[1], state.B[2]];
  const L = [state.L[0], state.L[1], state.L[2]];

  // U clockwise: L -> F -> R -> B -> L (depending on your chosen orientation)
  // One consistent convention:
  s.R[0] = F[0]; s.R[1] = F[1]; s.R[2] = F[2];
  s.B[0] = R[0]; s.B[1] = R[1]; s.B[2] = R[2];
  s.L[0] = B[0]; s.L[1] = B[1]; s.L[2] = B[2];
  s.F[0] = L[0]; s.F[1] = L[1]; s.F[2] = L[2];

  return s;
}
