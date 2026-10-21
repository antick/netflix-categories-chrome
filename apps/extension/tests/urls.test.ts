import { describe, expect, test } from "bun:test";
import { getNetflixCategoryUrl, isNetflixTabUrl } from "../lib/netflix-url";

describe("netflix urls", () => {
  test("builds a genre URL", () => {
    expect(getNetflixCategoryUrl("1365")).toBe(
      "https://www.netflix.com/browse/genre/1365",
    );
  });

  test("rejects invalid codes", () => {
    expect(() => getNetflixCategoryUrl("abc")).toThrow();
    expect(() => getNetflixCategoryUrl("")).toThrow();
  });

  test("detects Netflix tabs", () => {
    expect(isNetflixTabUrl("https://www.netflix.com/browse")).toBe(true);
    expect(isNetflixTabUrl("https://example.com")).toBe(false);
    expect(isNetflixTabUrl(undefined)).toBe(false);
  });
});
