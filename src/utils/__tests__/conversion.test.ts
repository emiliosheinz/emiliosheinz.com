import { stringToBase64 } from "~/utils/conversion";

describe("conversion", () => {
  describe("stringToBase64", () => {
    it("should return a base64 string when is server side", () => {
      const string = "test";
      const base64 = "dGVzdA==";
      expect(stringToBase64(string)).toEqual(base64);
    });
  });
});
