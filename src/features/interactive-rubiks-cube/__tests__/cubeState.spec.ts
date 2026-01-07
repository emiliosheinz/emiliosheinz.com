import { createSolvedState } from "../logic/cube-state";

describe("cubeState", () => {
  describe("createSolvedState", () => {
    it("should create a cube with 9 stickers per face", () => {
      const state = createSolvedState();

      expect(state.U).toHaveLength(9);
      expect(state.D).toHaveLength(9);
      expect(state.L).toHaveLength(9);
      expect(state.R).toHaveLength(9);
      expect(state.F).toHaveLength(9);
      expect(state.B).toHaveLength(9);
    });

    it("should have correct colors for each face in solved state", () => {
      const state = createSolvedState();

      expect(state.U.every((color) => color === "yellow")).toBe(true);
      expect(state.D.every((color) => color === "white")).toBe(true);
      expect(state.L.every((color) => color === "red")).toBe(true);
      expect(state.R.every((color) => color === "orange")).toBe(true);
      expect(state.F.every((color) => color === "green")).toBe(true);
      expect(state.B.every((color) => color === "blue")).toBe(true);
    });

    it("should return new arrays on each call", () => {
      const stateA = createSolvedState();
      const stateB = createSolvedState();

      expect(stateA).not.toBe(stateB);
      expect(stateA.U).not.toBe(stateB.U);
      expect(stateA.D).not.toBe(stateB.D);
      expect(stateA.L).not.toBe(stateB.L);
      expect(stateA.R).not.toBe(stateB.R);
      expect(stateA.F).not.toBe(stateB.F);
      expect(stateA.B).not.toBe(stateB.B);
    });

    it("should have all six faces defined", () => {
      const state = createSolvedState();

      expect(state).toHaveProperty("U");
      expect(state).toHaveProperty("D");
      expect(state).toHaveProperty("L");
      expect(state).toHaveProperty("R");
      expect(state).toHaveProperty("F");
      expect(state).toHaveProperty("B");
    });
  });
});
