import { getCategoryById } from "./categories";
import { migratePreferences } from "./preferences";
import type { ExtensionPreferences } from "./types";

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
