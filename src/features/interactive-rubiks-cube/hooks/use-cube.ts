import { create } from "zustand";
import { type CubeState, createSolvedState } from "../logic/cube-state";
import { applyMove, type Move } from "../logic/moves";
import type { RotationState } from "../logic/rotation";
import { scramble } from "../utils/scramble";

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
