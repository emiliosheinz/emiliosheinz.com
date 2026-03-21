import { cn } from "~/lib/utils";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional class names", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should resolve tailwind conflicts keeping the last value", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("should return empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should ignore undefined and null values", () => {
    expect(cn(undefined, null, "foo")).toBe("foo");
  });
});
