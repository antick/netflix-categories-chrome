import { describe, expect, test } from "bun:test";
import { shouldUseInPageNavigation } from "../lib/navigation";

describe("category opening", () => {
  test("uses in-page navigation on Netflix hosts", () => {
    expect(shouldUseInPageNavigation("www.netflix.com")).toBe(true);
    expect(shouldUseInPageNavigation("netflix.com")).toBe(true);
  });

  test("uses extension tab APIs off Netflix", () => {
    expect(shouldUseInPageNavigation("example.com")).toBe(false);
    expect(shouldUseInPageNavigation("")).toBe(false);
  });
});
