import { describe, expect, test } from "bun:test";
import {
  openNetflixCategory,
  shouldUseInPageNavigation,
} from "../lib/navigation";

describe("category opening", () => {
  test("this-tab navigation needs no URL access or host permission", async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "browser");
    const updates: unknown[] = [];
    const created: unknown[] = [];
    Object.defineProperty(globalThis, "browser", {
      configurable: true,
      value: {
        tabs: {
          query: async () => [{ id: 7 }],
          update: async (...args: unknown[]) => {
            updates.push(args);
          },
          create: async (args: unknown) => {
            created.push(args);
          },
        },
      },
    });
    try {
      await openNetflixCategory("8711", "reuse-current-tab");
      expect(updates).toEqual([
        [7, { url: "https://www.netflix.com/browse/genre/8711" }],
      ]);
      await openNetflixCategory("8711", "new-tab");
      expect(created).toEqual([
        { url: "https://www.netflix.com/browse/genre/8711" },
      ]);
    } finally {
      if (original) Object.defineProperty(globalThis, "browser", original);
      else Reflect.deleteProperty(globalThis, "browser");
    }
  });
  test("uses in-page navigation on Netflix hosts", () => {
    expect(shouldUseInPageNavigation("www.netflix.com")).toBe(true);
    expect(shouldUseInPageNavigation("netflix.com")).toBe(true);
  });

  test("uses extension tab APIs off Netflix", () => {
    expect(shouldUseInPageNavigation("example.com")).toBe(false);
    expect(shouldUseInPageNavigation("")).toBe(false);
  });
});
