import { indexFromXY, indexFromXZ, indexFromZY, renderIndex, type Coord } from "../mapping";
import type { Face } from "../cubeState";

describe("mapping", () => {
  describe("indexFromXY", () => {
    it("should map top-left corner correctly", () => {
      expect(indexFromXY(-1 as Coord, 1 as Coord)).toBe(0);
    });

    it("should map center correctly", () => {
      expect(indexFromXY(0 as Coord, 0 as Coord)).toBe(4);
    });

    it("should map bottom-right corner correctly", () => {
      expect(indexFromXY(1 as Coord, -1 as Coord)).toBe(8);
    });

    it("should map all nine positions correctly", () => {
      const positions: Array<[Coord, Coord, number]> = [
        [-1, 1, 0], [0, 1, 1], [1, 1, 2],
        [-1, 0, 3], [0, 0, 4], [1, 0, 5],
        [-1, -1, 6], [0, -1, 7], [1, -1, 8],
      ];

      positions.forEach(([x, y, expectedIndex]) => {
        expect(indexFromXY(x, y)).toBe(expectedIndex);
      });
    });
  });

  describe("indexFromXZ", () => {
    it("should map top-left corner correctly", () => {
      expect(indexFromXZ(-1 as Coord, 1 as Coord)).toBe(0);
    });

    it("should map center correctly", () => {
      expect(indexFromXZ(0 as Coord, 0 as Coord)).toBe(4);
    });

    it("should map bottom-right corner correctly", () => {
      expect(indexFromXZ(1 as Coord, -1 as Coord)).toBe(8);
    });

    it("should map all nine positions correctly", () => {
      const positions: Array<[Coord, Coord, number]> = [
        [-1, 1, 0], [0, 1, 1], [1, 1, 2],
        [-1, 0, 3], [0, 0, 4], [1, 0, 5],
        [-1, -1, 6], [0, -1, 7], [1, -1, 8],
      ];

      positions.forEach(([x, z, expectedIndex]) => {
        expect(indexFromXZ(x, z)).toBe(expectedIndex);
      });
    });
  });

  describe("indexFromZY", () => {
    it("should map top-left corner correctly", () => {
      expect(indexFromZY(-1 as Coord, 1 as Coord)).toBe(0);
    });

    it("should map center correctly", () => {
      expect(indexFromZY(0 as Coord, 0 as Coord)).toBe(4);
    });

    it("should map bottom-right corner correctly", () => {
      expect(indexFromZY(1 as Coord, -1 as Coord)).toBe(8);
    });

    it("should map all nine positions correctly", () => {
      const positions: Array<[Coord, Coord, number]> = [
        [-1, 1, 0], [0, 1, 1], [1, 1, 2],
        [-1, 0, 3], [0, 0, 4], [1, 0, 5],
        [-1, -1, 6], [0, -1, 7], [1, -1, 8],
      ];

      positions.forEach(([z, y, expectedIndex]) => {
        expect(indexFromZY(z, y)).toBe(expectedIndex);
      });
    });
  });

  describe("renderIndex", () => {
    describe("faces with Y-axis mirroring", () => {
      it("should mirror U face vertically", () => {
        expect(renderIndex("U" as Face, 0)).toBe(6);
        expect(renderIndex("U" as Face, 1)).toBe(7);
        expect(renderIndex("U" as Face, 2)).toBe(8);
        expect(renderIndex("U" as Face, 3)).toBe(3);
        expect(renderIndex("U" as Face, 4)).toBe(4);
        expect(renderIndex("U" as Face, 5)).toBe(5);
        expect(renderIndex("U" as Face, 6)).toBe(0);
        expect(renderIndex("U" as Face, 7)).toBe(1);
        expect(renderIndex("U" as Face, 8)).toBe(2);
      });
    });

    describe("faces with X-axis mirroring", () => {
      it("should mirror B face horizontally", () => {
        expect(renderIndex("B" as Face, 0)).toBe(2);
        expect(renderIndex("B" as Face, 1)).toBe(1);
        expect(renderIndex("B" as Face, 2)).toBe(0);
        expect(renderIndex("B" as Face, 3)).toBe(5);
        expect(renderIndex("B" as Face, 4)).toBe(4);
        expect(renderIndex("B" as Face, 5)).toBe(3);
        expect(renderIndex("B" as Face, 6)).toBe(8);
        expect(renderIndex("B" as Face, 7)).toBe(7);
        expect(renderIndex("B" as Face, 8)).toBe(6);
      });

      it("should mirror R face horizontally", () => {
        expect(renderIndex("R" as Face, 0)).toBe(2);
        expect(renderIndex("R" as Face, 6)).toBe(8);
        expect(renderIndex("R" as Face, 4)).toBe(4);
      });
    });

    describe("faces without mirroring", () => {
      it("should not transform F face", () => {
        expect(renderIndex("F" as Face, 0)).toBe(0);
        expect(renderIndex("F" as Face, 4)).toBe(4);
        expect(renderIndex("F" as Face, 8)).toBe(8);
      });

      it("should not transform D face", () => {
        expect(renderIndex("D" as Face, 0)).toBe(0);
        expect(renderIndex("D" as Face, 4)).toBe(4);
        expect(renderIndex("D" as Face, 8)).toBe(8);
      });

      it("should not transform L face", () => {
        expect(renderIndex("L" as Face, 0)).toBe(0);
        expect(renderIndex("L" as Face, 4)).toBe(4);
        expect(renderIndex("L" as Face, 8)).toBe(8);
      });
    });
  });
});
