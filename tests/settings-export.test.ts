import { describe, expect, test } from "bun:test";
import { getAllCategories } from "../lib/categories";
import { DEFAULT_PREFERENCES } from "../lib/preferences";
import {
  buildSettingsExport,
  parseSettingsImport,
  parseSettingsImportText,
  SETTINGS_EXPORT_KIND,
  settingsExportFilename,
  settingsExportToJson,
} from "../lib/settings-export";

describe("settings export", () => {
  const sample = getAllCategories()[0]!;
  const prefs = {
    ...DEFAULT_PREFERENCES,
    favorites: [sample.id, "not-a-real-id"],
    hiddenCategories: [sample.id],
    emptyCategories: [sample.id],
    theme: "light" as const,
  };

  test("export wraps preferences and drops unknown ids", () => {
    const file = buildSettingsExport(prefs, "2026-08-15T00:00:00.000Z");
    expect(file.kind).toBe(SETTINGS_EXPORT_KIND);
    expect(file.preferences.favorites).toEqual([sample.id]);
    expect(file.preferences.hiddenCategories).toEqual([sample.id]);
    expect(file.preferences.theme).toBe("light");
  });

  test("round-trips through JSON", () => {
    const imported = parseSettingsImportText(settingsExportToJson(prefs));
    expect(imported.favorites).toEqual([sample.id]);
    expect(imported.emptyCategories).toEqual([sample.id]);
    expect(imported.theme).toBe("light");
  });

  test("accepts a bare preferences object", () => {
    const imported = parseSettingsImport({
      favorites: [sample.id],
      hiddenCategories: [sample.id],
    });
    expect(imported.favorites).toEqual([sample.id]);
    expect(imported.schemaVersion).toBe(1);
    expect(imported.emptyCategories).toEqual([]);
  });

  test("rejects garbage", () => {
    expect(() => parseSettingsImportText("not json")).toThrow("valid JSON");
    expect(() => parseSettingsImport({ kind: "other" })).toThrow(
      "settings file",
    );
    expect(() => parseSettingsImport(null)).toThrow("settings file");
  });

  test("names the download with the date", () => {
    expect(settingsExportFilename(new Date("2026-08-15T12:00:00.000Z"))).toBe(
      "netflix-categories-settings-2026-08-15.json",
    );
  });
});
