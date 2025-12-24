import { CubeState, Sticker } from "./cubeState";

export type Move =
  | "U"
  | "U'"
  | "R"
  | "R'"
  | "F"
  | "F'"
  | "L"
  | "L'"
  | "D"
  | "D'"
  | "B"
  | "B'";

type FaceKey = keyof CubeState;
type Strip = [FaceKey, [number, number, number]];

function rotateFaceCW(face: Sticker[]) {
  return [
    face[6],
    face[3],
    face[0],
    face[7],
    face[4],
    face[1],
    face[8],
    face[5],
    face[2],
  ];
}

function rotateFaceCCW(face: Sticker[]) {
  return [
    face[2],
    face[5],
    face[8],
    face[1],
    face[4],
    face[7],
    face[0],
    face[3],
    face[6],
  ];
}

function cloneState(state: CubeState): CubeState {
  return {
    U: [...state.U],
    D: [...state.D],
    L: [...state.L],
    R: [...state.R],
    F: [...state.F],
    B: [...state.B],
  };
}

function cycleStripsCW(
  state: CubeState,
  strips: [Strip, Strip, Strip, Strip],
): CubeState {
  const nextState = cloneState(state);

  const [firstFace, firstIndexes] = strips[0];
  const [secondFace, secondIndexes] = strips[1];
  const [thirdFace, thirdIndexes] = strips[2];
  const [fourthFace, fourthIndexes] = strips[3];

  const firstValues: Sticker[] = [
    state[firstFace][firstIndexes[0]],
    state[firstFace][firstIndexes[1]],
    state[firstFace][firstIndexes[2]],
  ];

  const secondValues: Sticker[] = [
    state[secondFace][secondIndexes[0]],
    state[secondFace][secondIndexes[1]],
    state[secondFace][secondIndexes[2]],
  ];

  const thirdValues: Sticker[] = [
    state[thirdFace][thirdIndexes[0]],
    state[thirdFace][thirdIndexes[1]],
    state[thirdFace][thirdIndexes[2]],
  ];

  const fourthValues: Sticker[] = [
    state[fourthFace][fourthIndexes[0]],
    state[fourthFace][fourthIndexes[1]],
    state[fourthFace][fourthIndexes[2]],
  ];

  nextState[firstFace][firstIndexes[0]] = secondValues[0];
  nextState[firstFace][firstIndexes[1]] = secondValues[1];
  nextState[firstFace][firstIndexes[2]] = secondValues[2];

  nextState[secondFace][secondIndexes[0]] = thirdValues[0];
  nextState[secondFace][secondIndexes[1]] = thirdValues[1];
  nextState[secondFace][secondIndexes[2]] = thirdValues[2];

  nextState[thirdFace][thirdIndexes[0]] = fourthValues[0];
  nextState[thirdFace][thirdIndexes[1]] = fourthValues[1];
  nextState[thirdFace][thirdIndexes[2]] = fourthValues[2];

  nextState[fourthFace][fourthIndexes[0]] = firstValues[0];
  nextState[fourthFace][fourthIndexes[1]] = firstValues[1];
  nextState[fourthFace][fourthIndexes[2]] = firstValues[2];

  return nextState;
}

function cycleStripsCCW(
  state: CubeState,
  strips: [Strip, Strip, Strip, Strip],
): CubeState {
  return cycleStripsCW(state, [strips[0], strips[3], strips[2], strips[1]]);
}

export function applyMove(state: CubeState, move: Move): CubeState {
  switch (move) {
    case "U":
      return applyUCW(state);
    case "U'":
      return applyUCCW(state);
    case "R":
      return applyRCW(state);
    case "R'":
      return applyRCCW(state);
    case "F":
      return applyFCW(state);
    case "F'":
      return applyFCCW(state);
    case "L":
      return applyLCW(state);
    case "L'":
      return applyLCCW(state);
    case "D":
      return applyDCW(state);
    case "D'":
      return applyDCCW(state);
    case "B":
      return applyBCW(state);
    case "B'":
      return applyBCCW(state);
    default:
      throw new Error(`Move not implemented: ${move}`);
  }
}

function applyUCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.U = rotateFaceCW(nextState.U);

  nextState = cycleStripsCW(nextState, [
    ["F", [0, 1, 2]],
    ["R", [0, 1, 2]],
    ["B", [0, 1, 2]],
    ["L", [0, 1, 2]],
  ]);

  return nextState;
}

function applyUCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.U = rotateFaceCCW(nextState.U);

  nextState = cycleStripsCCW(nextState, [
    ["F", [0, 1, 2]],
    ["R", [0, 1, 2]],
    ["B", [0, 1, 2]],
    ["L", [0, 1, 2]],
  ]);

  return nextState;
}

function applyRCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.R = rotateFaceCW(nextState.R);

  nextState = cycleStripsCW(nextState, [
    ["U", [2, 5, 8]],
    ["F", [2, 5, 8]],
    ["D", [2, 5, 8]],
    ["B", [6, 3, 0]],
  ]);

  return nextState;
}

function applyRCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.R = rotateFaceCCW(nextState.R);

  nextState = cycleStripsCCW(nextState, [
    ["U", [2, 5, 8]],
    ["F", [2, 5, 8]],
    ["D", [2, 5, 8]],
    ["B", [6, 3, 0]],
  ]);

  return nextState;
}

function applyLCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.L = rotateFaceCW(nextState.L);

  nextState = cycleStripsCW(nextState, [
    ["U", [0, 3, 6]],
    ["B", [8, 5, 2]],
    ["D", [0, 3, 6]],
    ["F", [0, 3, 6]],
  ]);

  return nextState;
}

function applyLCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.L = rotateFaceCCW(nextState.L);

  nextState = cycleStripsCCW(nextState, [
    ["U", [0, 3, 6]],
    ["B", [8, 5, 2]],
    ["D", [0, 3, 6]],
    ["F", [0, 3, 6]],
  ]);

  return nextState;
}

function applyFCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.F = rotateFaceCW(nextState.F);

  nextState = cycleStripsCW(nextState, [
    ["U", [6, 7, 8]],
    ["L", [8, 5, 2]],
    ["D", [2, 1, 0]],
    ["R", [0, 3, 6]],
  ]);

  return nextState;
}

function applyFCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.F = rotateFaceCCW(nextState.F);

  nextState = cycleStripsCCW(nextState, [
    ["U", [6, 7, 8]],
    ["L", [8, 5, 2]],
    ["D", [2, 1, 0]],
    ["R", [0, 3, 6]],
  ]);

  return nextState;
}

function applyBCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.B = rotateFaceCW(nextState.B);

  nextState = cycleStripsCW(nextState, [
    ["U", [2, 1, 0]],
    ["R", [8, 5, 2]],
    ["D", [6, 7, 8]],
    ["L", [0, 3, 6]],
  ]);

  return nextState;
}

function applyBCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.B = rotateFaceCCW(nextState.B);

  nextState = cycleStripsCCW(nextState, [
    ["U", [2, 1, 0]],
    ["R", [8, 5, 2]],
    ["D", [6, 7, 8]],
    ["L", [0, 3, 6]],
  ]);

  return nextState;
}

function applyDCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.D = rotateFaceCW(nextState.D);

  nextState = cycleStripsCW(nextState, [
    ["F", [6, 7, 8]],
    ["L", [6, 7, 8]],
    ["B", [6, 7, 8]],
    ["R", [6, 7, 8]],
  ]);

  return nextState;
}

function applyDCCW(state: CubeState): CubeState {
  let nextState = cloneState(state);
  nextState.D = rotateFaceCCW(nextState.D);

  nextState = cycleStripsCCW(nextState, [
    ["F", [6, 7, 8]],
    ["L", [6, 7, 8]],
    ["B", [6, 7, 8]],
    ["R", [6, 7, 8]],
  ]);

  return nextState;
}
