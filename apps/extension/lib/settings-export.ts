import { getCategoryById } from "./categories";
import { migratePreferences } from "./preferences";
import { MAX_SETTINGS_IMPORT_BYTES } from "./release";
import type { ExtensionPreferences } from "./types";

export const SETTINGS_EXPORT_KIND = "netflix-categories-settings";
export const SETTINGS_EXPORT_VERSION = 1;

export interface SettingsExportFile {
  kind: typeof SETTINGS_EXPORT_KIND;
  exportVersion: number;
  exportedAt: string;
  preferences: ExtensionPreferences;
}

function knownIds(ids: string[]): string[] {
  return ids.filter((id) => Boolean(getCategoryById(id)));
}

export function sanitizePreferences(raw: unknown): ExtensionPreferences {
  const migrated = migratePreferences(raw);
  return {
    ...migrated,
    favorites: knownIds(migrated.favorites),
    hiddenCategories: knownIds(migrated.hiddenCategories),
    recentCategories: knownIds(migrated.recentCategories),
    emptyCategories: knownIds(migrated.emptyCategories),
  };
}

export function buildSettingsExport(
  prefs: ExtensionPreferences,
  exportedAt = new Date().toISOString(),
): SettingsExportFile {
  return {
    kind: SETTINGS_EXPORT_KIND,
    exportVersion: SETTINGS_EXPORT_VERSION,
    exportedAt,
    preferences: sanitizePreferences(prefs),
  };
}

export function settingsExportToJson(prefs: ExtensionPreferences): string {
  return `${JSON.stringify(buildSettingsExport(prefs), null, 2)}\n`;
}

export function settingsExportFilename(now = new Date()): string {
  return `netflix-categories-settings-${now.toISOString().slice(0, 10)}.json`;
}

export function parseSettingsImport(raw: unknown): ExtensionPreferences {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Not a Netflix Categories settings file.");
  }
  const data = raw as Record<string, unknown>;

  if ("kind" in data) {
    if (data.kind !== SETTINGS_EXPORT_KIND) {
      throw new Error("Not a Netflix Categories settings file.");
    }
    if (data.exportVersion !== SETTINGS_EXPORT_VERSION) {
      throw new Error("Unsupported settings export version.");
    }
    if (
      !data.preferences ||
      typeof data.preferences !== "object" ||
      Array.isArray(data.preferences)
    ) {
      throw new Error("Settings file is missing preferences.");
    }
    return sanitizePreferences(data.preferences);
  }

  if (
    "favorites" in data ||
    "hiddenCategories" in data ||
    "emptyCategories" in data ||
    "schemaVersion" in data
  ) {
    return sanitizePreferences(data);
  }

  throw new Error("Not a Netflix Categories settings file.");
}

export function parseSettingsImportText(text: string): ExtensionPreferences {
  if (new TextEncoder().encode(text).length > MAX_SETTINGS_IMPORT_BYTES) {
    throw new Error("Settings file is too large (maximum 1 MB).");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  return parseSettingsImport(parsed);
}
