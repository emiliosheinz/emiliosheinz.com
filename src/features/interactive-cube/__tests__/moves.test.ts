import { createSolvedState, type Sticker } from "../cubeState";
import { applyMove, type Move } from "../moves";

const getInverseMove = (move: Move): Move => {
  return move.endsWith("'") ? (move.slice(0, -1) as Move) : ((move + "'") as Move);
};

const rotateFaceCW = (face: Sticker[]): Sticker[] => {
  return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
};

const rotateFaceCCW = (face: Sticker[]): Sticker[] => {
  return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
};

const testPattern: Sticker[] = [
  "white", "yellow", "red",
  "orange", "green", "blue",
  "white", "yellow", "red",
];

describe("moves", () => {
  describe("applyMove", () => {
    describe("immutability", () => {
      it("should not mutate the input state", () => {
        const state = createSolvedState();
        const originalState = JSON.parse(JSON.stringify(state));

        applyMove(state, "U");

        expect(state).toEqual(originalState);
      });

      it("should return a new state object", () => {
        const state = createSolvedState();
        const newState = applyMove(state, "U");

        expect(newState).not.toBe(state);
      });
    });

    describe("inverse moves", () => {
      it("should return to original state when applying CW then CCW", () => {
        const moves: Move[] = ["U", "R", "F", "L", "D", "B"];
        const state = createSolvedState();

        moves.forEach((move) => {
          const afterMove = applyMove(state, move);
          const afterInverse = applyMove(afterMove, getInverseMove(move));

          expect(afterInverse).toEqual(state);
        });
      });

      it("should return to original state when applying CCW then CW", () => {
        const moves: Move[] = ["U'", "R'", "F'", "L'", "D'", "B'"];
        const state = createSolvedState();

        moves.forEach((move) => {
          const afterMove = applyMove(state, move);
          const afterInverse = applyMove(afterMove, getInverseMove(move));

          expect(afterInverse).toEqual(state);
        });
      });
    });

    describe("four-turn identity", () => {
      it("should restore state after four CW turns for each face", () => {
        const moves: Move[] = ["U", "R", "F", "L", "D", "B"];
        const state = createSolvedState();

        moves.forEach((move) => {
          let currentState = state;
          for (let i = 0; i < 4; i++) {
            currentState = applyMove(currentState, move);
          }

          expect(currentState).toEqual(state);
        });
      });

      it("should restore state after four CCW turns for each face", () => {
        const moves: Move[] = ["U'", "R'", "F'", "L'", "D'", "B'"];
        const state = createSolvedState();

        moves.forEach((move) => {
          let currentState = state;
          for (let i = 0; i < 4; i++) {
            currentState = applyMove(currentState, move);
          }

          expect(currentState).toEqual(state);
        });
      });
    });

    describe("face rotation mechanics", () => {
      describe("clockwise rotation", () => {
        it("should rotate U face stickers 90° CW", () => {
          const state = createSolvedState();
          state.U = [...testPattern];

          const result = applyMove(state, "U");

          expect(result.U).toEqual(rotateFaceCW(testPattern));
        });

        it("should rotate R face stickers 90° CW", () => {
          const state = createSolvedState();
          state.R = [...testPattern];

          const result = applyMove(state, "R");

          expect(result.R).toEqual(rotateFaceCW(testPattern));
        });

        it("should rotate F face stickers 90° CW", () => {
          const state = createSolvedState();
          state.F = [...testPattern];

          const result = applyMove(state, "F");

          expect(result.F).toEqual(rotateFaceCW(testPattern));
        });

        it("should rotate L face stickers 90° CW", () => {
          const state = createSolvedState();
          state.L = [...testPattern];

          const result = applyMove(state, "L");

          expect(result.L).toEqual(rotateFaceCW(testPattern));
        });

        it("should rotate D face stickers 90° CW", () => {
          const state = createSolvedState();
          state.D = [...testPattern];

          const result = applyMove(state, "D");

          expect(result.D).toEqual(rotateFaceCW(testPattern));
        });

        it("should rotate B face stickers 90° CW", () => {
          const state = createSolvedState();
          state.B = [...testPattern];

          const result = applyMove(state, "B");

          expect(result.B).toEqual(rotateFaceCW(testPattern));
        });
      });

      describe("counter-clockwise rotation", () => {
        it("should rotate U face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.U = [...testPattern];

          const result = applyMove(state, "U'");

          expect(result.U).toEqual(rotateFaceCCW(testPattern));
        });

        it("should rotate R face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.R = [...testPattern];

          const result = applyMove(state, "R'");

          expect(result.R).toEqual(rotateFaceCCW(testPattern));
        });

        it("should rotate F face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.F = [...testPattern];

          const result = applyMove(state, "F'");

          expect(result.F).toEqual(rotateFaceCCW(testPattern));
        });

        it("should rotate L face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.L = [...testPattern];

          const result = applyMove(state, "L'");

          expect(result.L).toEqual(rotateFaceCCW(testPattern));
        });

        it("should rotate D face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.D = [...testPattern];

          const result = applyMove(state, "D'");

          expect(result.D).toEqual(rotateFaceCCW(testPattern));
        });

        it("should rotate B face stickers 90° CCW", () => {
          const state = createSolvedState();
          state.B = [...testPattern];

          const result = applyMove(state, "B'");

          expect(result.B).toEqual(rotateFaceCCW(testPattern));
        });
      });
    });

    describe("strip transfers - clockwise moves", () => {
      it("U move should cycle top edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "U");

        expect(result.U.every((color) => color === "yellow")).toBe(true);
        expect(result.F.slice(0, 3).every((color) => color === "orange")).toBe(true);
        expect(result.R.slice(0, 3).every((color) => color === "blue")).toBe(true);
        expect(result.B.slice(0, 3).every((color) => color === "red")).toBe(true);
        expect(result.L.slice(0, 3).every((color) => color === "green")).toBe(true);
      });

      it("R move should cycle right edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "R");

        expect([result.U[2], result.U[5], result.U[8]].every((color) => color === "green")).toBe(true);
        expect([result.F[2], result.F[5], result.F[8]].every((color) => color === "white")).toBe(true);
        expect([result.D[2], result.D[5], result.D[8]].every((color) => color === "blue")).toBe(true);
        expect([result.B[6], result.B[3], result.B[0]].every((color) => color === "yellow")).toBe(true);
      });

      it("F move should cycle front edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "F");

        expect([result.U[6], result.U[7], result.U[8]].every((color) => color === "red")).toBe(true);
        expect([result.L[8], result.L[5], result.L[2]].every((color) => color === "white")).toBe(true);
        expect([result.D[2], result.D[1], result.D[0]].every((color) => color === "orange")).toBe(true);
        expect([result.R[0], result.R[3], result.R[6]].every((color) => color === "yellow")).toBe(true);
      });

      it("L move should cycle left edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "L");

        expect([result.U[0], result.U[3], result.U[6]].every((color) => color === "blue")).toBe(true);
        expect([result.B[8], result.B[5], result.B[2]].every((color) => color === "white")).toBe(true);
        expect([result.D[0], result.D[3], result.D[6]].every((color) => color === "green")).toBe(true);
        expect([result.F[0], result.F[3], result.F[6]].every((color) => color === "yellow")).toBe(true);
      });

      it("D move should cycle bottom edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "D");

        expect([result.F[6], result.F[7], result.F[8]].every((color) => color === "red")).toBe(true);
        expect([result.L[6], result.L[7], result.L[8]].every((color) => color === "blue")).toBe(true);
        expect([result.B[6], result.B[7], result.B[8]].every((color) => color === "orange")).toBe(true);
        expect([result.R[6], result.R[7], result.R[8]].every((color) => color === "green")).toBe(true);
      });

      it("B move should cycle back edge strips clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "B");

        expect([result.U[2], result.U[1], result.U[0]].every((color) => color === "orange")).toBe(true);
        expect([result.R[8], result.R[5], result.R[2]].every((color) => color === "white")).toBe(true);
        expect([result.D[6], result.D[7], result.D[8]].every((color) => color === "red")).toBe(true);
        expect([result.L[0], result.L[3], result.L[6]].every((color) => color === "yellow")).toBe(true);
      });
    });

    describe("strip transfers - counter-clockwise moves", () => {
      it("U' move should cycle top edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "U'");

        expect(result.F.slice(0, 3).every((color) => color === "red")).toBe(true);
        expect(result.L.slice(0, 3).every((color) => color === "blue")).toBe(true);
        expect(result.B.slice(0, 3).every((color) => color === "orange")).toBe(true);
        expect(result.R.slice(0, 3).every((color) => color === "green")).toBe(true);
      });

      it("R' move should cycle right edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "R'");

        expect([result.U[2], result.U[5], result.U[8]].every((color) => color === "blue")).toBe(true);
        expect([result.B[6], result.B[3], result.B[0]].every((color) => color === "white")).toBe(true);
        expect([result.D[2], result.D[5], result.D[8]].every((color) => color === "green")).toBe(true);
        expect([result.F[2], result.F[5], result.F[8]].every((color) => color === "yellow")).toBe(true);
      });

      it("F' move should cycle front edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "F'");

        expect([result.U[6], result.U[7], result.U[8]].every((color) => color === "orange")).toBe(true);
        expect([result.R[0], result.R[3], result.R[6]].every((color) => color === "white")).toBe(true);
        expect([result.D[2], result.D[1], result.D[0]].every((color) => color === "red")).toBe(true);
        expect([result.L[8], result.L[5], result.L[2]].every((color) => color === "yellow")).toBe(true);
      });

      it("L' move should cycle left edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "L'");

        expect([result.U[0], result.U[3], result.U[6]].every((color) => color === "green")).toBe(true);
        expect([result.F[0], result.F[3], result.F[6]].every((color) => color === "white")).toBe(true);
        expect([result.D[0], result.D[3], result.D[6]].every((color) => color === "blue")).toBe(true);
        expect([result.B[8], result.B[5], result.B[2]].every((color) => color === "yellow")).toBe(true);
      });

      it("D' move should cycle bottom edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "D'");

        expect([result.F[6], result.F[7], result.F[8]].every((color) => color === "orange")).toBe(true);
        expect([result.R[6], result.R[7], result.R[8]].every((color) => color === "blue")).toBe(true);
        expect([result.B[6], result.B[7], result.B[8]].every((color) => color === "red")).toBe(true);
        expect([result.L[6], result.L[7], result.L[8]].every((color) => color === "green")).toBe(true);
      });

      it("B' move should cycle back edge strips counter-clockwise", () => {
        const state = createSolvedState();
        const result = applyMove(state, "B'");

        expect([result.U[2], result.U[1], result.U[0]].every((color) => color === "red")).toBe(true);
        expect([result.L[0], result.L[3], result.L[6]].every((color) => color === "white")).toBe(true);
        expect([result.D[6], result.D[7], result.D[8]].every((color) => color === "orange")).toBe(true);
        expect([result.R[8], result.R[5], result.R[2]].every((color) => color === "yellow")).toBe(true);
      });
    });
  });
});
