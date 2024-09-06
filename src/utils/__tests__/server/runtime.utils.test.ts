import { isServerSide } from "~/utils/runtime.utils";

describe("runtime.utils", () => {
  describe("isServerSide", () => {
    it("should return false", () => {
      expect(isServerSide()).toEqual(true);
    });
  });
});
