import { create } from "zustand";
import { scramble } from "../utils/scramble";
import { createSolvedState, CubeState } from "../logic/cube-state";
import { RotationState } from "../logic/rotation";
import { applyMove, Move } from "../logic/moves";

export type CubeStore = {
  cube: CubeState;
  rotation: RotationState | null;
  rotate: (rotation: RotationState | null) => void;
  commitMove: (move: Move) => void;
};

export const useCube = create<CubeStore>((set) => ({
  cube: scramble(createSolvedState()),
  rotation: null,
  rotate: (rotation: RotationState | null) => set({ rotation }),
  commitMove: (move: Move) =>
    set((state) => ({
      rotation: null,
      cube: applyMove(state.cube, move),
    })),
}));
