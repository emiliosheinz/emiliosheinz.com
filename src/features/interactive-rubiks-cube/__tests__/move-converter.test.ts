import { convertToMove } from "../logic/move-converter";

describe("move-converter", () => {
  describe("convertToMove", () => {
    describe("outer layers", () => {
      it("should convert +X layer, 1 quarter turn to R'", () => {
        expect(convertToMove("x", 1, 1)).toBe("R'");
      });

      it("should convert +X layer, 3 quarter turns to R", () => {
        expect(convertToMove("x", 1, 3)).toBe("R");
      });

      it("should convert -X layer, 1 quarter turn to L", () => {
        expect(convertToMove("x", -1, 1)).toBe("L");
      });

      it("should convert -X layer, 3 quarter turns to L'", () => {
        expect(convertToMove("x", -1, 3)).toBe("L'");
      });

      it("should convert +Y layer, 1 quarter turn to U'", () => {
        expect(convertToMove("y", 1, 1)).toBe("U'");
      });

      it("should convert +Y layer, 3 quarter turns to U", () => {
        expect(convertToMove("y", 1, 3)).toBe("U");
      });

      it("should convert -Y layer, 1 quarter turn to D", () => {
        expect(convertToMove("y", -1, 1)).toBe("D");
      });

      it("should convert +Z layer, 1 quarter turn to F'", () => {
        expect(convertToMove("z", 1, 1)).toBe("F'");
      });

      it("should convert -Z layer, 1 quarter turn to B", () => {
        expect(convertToMove("z", -1, 1)).toBe("B");
      });
    });

    describe("middle layers", () => {
      it("should convert M slice clockwise", () => {
        expect(convertToMove("x", 0, 1)).toBe("M");
      });

      it("should convert M slice counter-clockwise", () => {
        expect(convertToMove("x", 0, 3)).toBe("M'");
      });

      it("should convert E slice clockwise", () => {
        expect(convertToMove("y", 0, 1)).toBe("E");
      });

      it("should convert S slice clockwise", () => {
        expect(convertToMove("z", 0, 1)).toBe("S");
      });
    });

    describe("edge cases", () => {
      it("should return null for 0 quarter turns", () => {
        expect(convertToMove("x", 1, 0)).toBe(null);
      });

      it("should return null for 4 quarter turns", () => {
        expect(convertToMove("x", 1, 4)).toBe(null);
      });

      it("should handle negative quarter turns", () => {
        expect(convertToMove("x", 1, -1)).toBe("R");
      });
    });
  });
});
