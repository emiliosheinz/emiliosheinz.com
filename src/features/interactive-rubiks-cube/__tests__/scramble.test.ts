import { createSolvedState } from "../logic/cube-state";
import { scramble } from "../utils/scramble";

describe("scramble", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return a state with all six faces", () => {
    const state = createSolvedState();
    const result = scramble(state);

    expect(result).toHaveProperty("U");
    expect(result).toHaveProperty("D");
    expect(result).toHaveProperty("L");
    expect(result).toHaveProperty("R");
    expect(result).toHaveProperty("F");
    expect(result).toHaveProperty("B");
  });

  it("should have 9 stickers per face", () => {
    const state = createSolvedState();
    const result = scramble(state);

    expect(result.U).toHaveLength(9);
    expect(result.D).toHaveLength(9);
    expect(result.L).toHaveLength(9);
    expect(result.R).toHaveLength(9);
    expect(result.F).toHaveLength(9);
    expect(result.B).toHaveLength(9);
  });

  it("should not mutate the input state", () => {
    const state = createSolvedState();
    const original = JSON.parse(JSON.stringify(state));
    scramble(state);

    expect(state).toEqual(original);
  });

  it("should return a state equal to the input when length is 0", () => {
    const state = createSolvedState();
    const result = scramble(state, 0);

    expect(result).toEqual(state);
  });

  it("should apply a U move when Math.random returns 0", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    const state = createSolvedState();
    const result = scramble(state, 1);

    // After a single U move from solved state, F top row becomes orange
    expect(result.F.slice(0, 3).every((color) => color === "orange")).toBe(
      true,
    );
  });

  it("should apply moves the specified number of times", () => {
    const spy = jest.spyOn(Math, "random").mockReturnValue(0);
    const state = createSolvedState();
    scramble(state, 5);

    expect(spy).toHaveBeenCalledTimes(5);
  });
});
