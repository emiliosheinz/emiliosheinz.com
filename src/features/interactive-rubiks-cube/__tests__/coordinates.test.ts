import {
  getCubieOrientation,
  getCubiePositions,
  indexFromXY,
  indexFromXZ,
  indexFromZY,
  renderIndex,
} from "../logic/coordinates";

describe("coordinates", () => {
  describe("indexFromXY", () => {
    it("should return 4 for center (0, 0)", () => {
      expect(indexFromXY(0, 0)).toBe(4);
    });

    it("should return 0 for top-left corner (-1, 1)", () => {
      expect(indexFromXY(-1, 1)).toBe(0);
    });

    it("should return 2 for top-right corner (1, 1)", () => {
      expect(indexFromXY(1, 1)).toBe(2);
    });

    it("should return 6 for bottom-left corner (-1, -1)", () => {
      expect(indexFromXY(-1, -1)).toBe(6);
    });

    it("should return 8 for bottom-right corner (1, -1)", () => {
      expect(indexFromXY(1, -1)).toBe(8);
    });
  });

  describe("indexFromXZ", () => {
    it("should return 4 for center (0, 0)", () => {
      expect(indexFromXZ(0, 0)).toBe(4);
    });

    it("should return 0 for (−1, 1)", () => {
      expect(indexFromXZ(-1, 1)).toBe(0);
    });

    it("should return 8 for (1, -1)", () => {
      expect(indexFromXZ(1, -1)).toBe(8);
    });

    it("should return 2 for (1, 1)", () => {
      expect(indexFromXZ(1, 1)).toBe(2);
    });
  });

  describe("indexFromZY", () => {
    it("should return 4 for center (0, 0)", () => {
      expect(indexFromZY(0, 0)).toBe(4);
    });

    it("should return 0 for top-back corner (-1, 1)", () => {
      expect(indexFromZY(-1, 1)).toBe(0);
    });

    it("should return 8 for bottom-front corner (1, -1)", () => {
      expect(indexFromZY(1, -1)).toBe(8);
    });

    it("should return 2 for top-front corner (1, 1)", () => {
      expect(indexFromZY(1, 1)).toBe(2);
    });
  });

  describe("renderIndex", () => {
    it("should mirror X axis for face B", () => {
      expect(renderIndex("B", 0)).toBe(2);
      expect(renderIndex("B", 2)).toBe(0);
      expect(renderIndex("B", 4)).toBe(4);
    });

    it("should mirror X axis for face R", () => {
      expect(renderIndex("R", 0)).toBe(2);
      expect(renderIndex("R", 2)).toBe(0);
      expect(renderIndex("R", 4)).toBe(4);
    });

    it("should mirror Y axis for face U", () => {
      expect(renderIndex("U", 0)).toBe(6);
      expect(renderIndex("U", 6)).toBe(0);
      expect(renderIndex("U", 4)).toBe(4);
    });

    it("should return the index unchanged for face F", () => {
      expect(renderIndex("F", 0)).toBe(0);
      expect(renderIndex("F", 4)).toBe(4);
      expect(renderIndex("F", 8)).toBe(8);
    });

    it("should return the index unchanged for face D", () => {
      expect(renderIndex("D", 3)).toBe(3);
      expect(renderIndex("D", 7)).toBe(7);
    });

    it("should return the index unchanged for face L", () => {
      expect(renderIndex("L", 1)).toBe(1);
      expect(renderIndex("L", 5)).toBe(5);
    });
  });

  describe("getCubiePositions", () => {
    it("should return exactly 27 positions", () => {
      expect(getCubiePositions()).toHaveLength(27);
    });

    it("should include the center position (0, 0, 0)", () => {
      const positions = getCubiePositions();
      expect(positions).toContainEqual([0, 0, 0]);
    });

    it("should include all 8 corner positions", () => {
      const positions = getCubiePositions();
      const corners: [number, number, number][] = [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
      ];
      corners.forEach((corner) => {
        expect(positions).toContainEqual(corner);
      });
    });

    it("should only contain coordinates in {-1, 0, 1}", () => {
      const valid = new Set([-1, 0, 1]);
      getCubiePositions().forEach(([x, y, z]) => {
        expect(valid.has(x)).toBe(true);
        expect(valid.has(y)).toBe(true);
        expect(valid.has(z)).toBe(true);
      });
    });
  });

  describe("getCubieOrientation", () => {
    it("should return all false for center cubie (0, 0, 0)", () => {
      expect(getCubieOrientation([0, 0, 0])).toEqual({
        isTop: false,
        isBottom: false,
        isLeft: false,
        isRight: false,
        isFront: false,
        isBack: false,
      });
    });

    it("should return isTop true for (0, 1, 0)", () => {
      const orientation = getCubieOrientation([0, 1, 0]);
      expect(orientation.isTop).toBe(true);
      expect(orientation.isBottom).toBe(false);
    });

    it("should return isBottom true for (0, -1, 0)", () => {
      const orientation = getCubieOrientation([0, -1, 0]);
      expect(orientation.isBottom).toBe(true);
      expect(orientation.isTop).toBe(false);
    });

    it("should return isLeft true for (-1, 0, 0)", () => {
      const orientation = getCubieOrientation([-1, 0, 0]);
      expect(orientation.isLeft).toBe(true);
      expect(orientation.isRight).toBe(false);
    });

    it("should return isRight true for (1, 0, 0)", () => {
      const orientation = getCubieOrientation([1, 0, 0]);
      expect(orientation.isRight).toBe(true);
      expect(orientation.isLeft).toBe(false);
    });

    it("should return isFront true for (0, 0, 1)", () => {
      const orientation = getCubieOrientation([0, 0, 1]);
      expect(orientation.isFront).toBe(true);
      expect(orientation.isBack).toBe(false);
    });

    it("should return isBack true for (0, 0, -1)", () => {
      const orientation = getCubieOrientation([0, 0, -1]);
      expect(orientation.isBack).toBe(true);
      expect(orientation.isFront).toBe(false);
    });

    it("should set multiple flags for a corner cubie (1, 1, 1)", () => {
      expect(getCubieOrientation([1, 1, 1])).toEqual({
        isTop: true,
        isBottom: false,
        isLeft: false,
        isRight: true,
        isFront: true,
        isBack: false,
      });
    });
  });
});
