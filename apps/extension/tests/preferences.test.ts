import { describe, expect, test } from "bun:test";
import {
  addRecent,
  DEFAULT_PREFERENCES,
  hideCategory,
  markEmpty,
  migratePreferences,
  toggleFavorite,
  unhideCategory,
  unmarkEmpty,
} from "../lib/preferences";

describe("preferences", () => {
  test("defaults experimental menu off and dark theme", () => {
    expect(DEFAULT_PREFERENCES.experimentalHeaderMenuEnabled).toBe(false);
    expect(DEFAULT_PREFERENCES.openBehavior).toBe("reuse-current-tab");
    expect(DEFAULT_PREFERENCES.theme).toBe("dark");
  });

  test("favoriting a hidden category unhides it", () => {
    const hidden = { ...DEFAULT_PREFERENCES, hiddenCategories: ["a"] };
    const next = toggleFavorite(hidden, "a");
    expect(next.favorites).toContain("a");
    expect(next.hiddenCategories).not.toContain("a");
  });

  test("hiding a favorite removes it from favorites", () => {
    const fav = { ...DEFAULT_PREFERENCES, favorites: ["a"] };
    const next = hideCategory(fav, "a");
    expect(next.hiddenCategories).toContain("a");
    expect(next.favorites).not.toContain("a");
  });

  test("unhide restores the id", () => {
    const next = unhideCategory(
      { ...DEFAULT_PREFERENCES, hiddenCategories: ["a", "b"] },
      "a",
    );
    expect(next.hiddenCategories).toEqual(["b"]);
  });

  test("recent is newest first, unique, and bounded", () => {
    let prefs = DEFAULT_PREFERENCES;
    for (let i = 0; i < 12; i += 1) prefs = addRecent(prefs, `id-${i}`);
    prefs = addRecent(prefs, "id-11");
    expect(prefs.recentCategories[0]).toBe("id-11");
    expect(prefs.recentCategories).toHaveLength(10);
    expect(prefs.recentCategories.filter((id) => id === "id-11")).toHaveLength(
      1,
    );
  });

  test("migrate fills missing fields", () => {
    const migrated = migratePreferences({ favorites: ["x"] });
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.favorites).toEqual(["x"]);
    expect(migrated.experimentalHeaderMenuEnabled).toBe(false);
    expect(migrated.theme).toBe("dark");
    expect(migrated.emptyCategories).toEqual([]);
  });

  test("migrate keeps a saved light theme", () => {
    const migrated = migratePreferences({ theme: "light" });
    expect(migrated.theme).toBe("light");
  });

  test("markEmpty prepends unique ids and unmark removes them", () => {
    const first = markEmpty(DEFAULT_PREFERENCES, "a");
    const again = markEmpty(first, "a");
    expect(first.emptyCategories).toEqual(["a"]);
    expect(again.emptyCategories).toEqual(["a"]);
    expect(unmarkEmpty(first, "a").emptyCategories).toEqual([]);
  });
});
