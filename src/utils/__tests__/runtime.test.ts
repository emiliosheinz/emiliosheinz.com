import { isServerSide } from "~/utils/runtime";

describe("runtime", () => {
  describe("isServerSide", () => {
    it("should return false", () => {
      expect(isServerSide()).toEqual(false);
    });
  });
});
