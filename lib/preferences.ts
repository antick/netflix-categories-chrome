import type {
  ExtensionPreferences,
  OpenBehavior,
  ThemePreference,
} from "./types";

export const PREFERENCES_KEY = "preferences";
export const CURRENT_PREFERENCE_SCHEMA = 1;
export const RECENT_LIMIT = 10;

export const DEFAULT_PREFERENCES: ExtensionPreferences = {
  schemaVersion: CURRENT_PREFERENCE_SCHEMA,
  favorites: [],
  hiddenCategories: [],
  recentCategories: [],
  experimentalHeaderMenuEnabled: false,
  experimentalHeaderMenuNoticeDismissed: false,
  openBehavior: "reuse-current-tab",
  theme: "dark",
};

function uniqueIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (typeof id !== "string" || !id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

export function migratePreferences(raw: unknown): ExtensionPreferences {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PREFERENCES };
  const input = raw as Partial<ExtensionPreferences> & {
    schemaVersion?: number;
  };
  const openBehavior: OpenBehavior =
    input.openBehavior === "new-tab" ? "new-tab" : "reuse-current-tab";
  const theme: ThemePreference = input.theme === "light" ? "light" : "dark";

  return {
    schemaVersion: CURRENT_PREFERENCE_SCHEMA,
    favorites: uniqueIds(input.favorites),
    hiddenCategories: uniqueIds(input.hiddenCategories),
    recentCategories: uniqueIds(input.recentCategories).slice(0, RECENT_LIMIT),
    experimentalHeaderMenuEnabled: Boolean(input.experimentalHeaderMenuEnabled),
    experimentalHeaderMenuNoticeDismissed: Boolean(
      input.experimentalHeaderMenuNoticeDismissed,
    ),
    openBehavior,
    theme,
  };
}

export function toggleFavorite(
  prefs: ExtensionPreferences,
  id: string,
): ExtensionPreferences {
  const isFavorite = prefs.favorites.includes(id);
  const favorites = isFavorite
    ? prefs.favorites.filter((item) => item !== id)
    : [id, ...prefs.favorites.filter((item) => item !== id)];
  const hiddenCategories = isFavorite
    ? prefs.hiddenCategories
    : prefs.hiddenCategories.filter((item) => item !== id);
  return { ...prefs, favorites, hiddenCategories };
}

export function hideCategory(
  prefs: ExtensionPreferences,
  id: string,
): ExtensionPreferences {
  if (prefs.hiddenCategories.includes(id)) return prefs;
  return {
    ...prefs,
    hiddenCategories: [...prefs.hiddenCategories, id],
    favorites: prefs.favorites.filter((item) => item !== id),
  };
}

export function unhideCategory(
  prefs: ExtensionPreferences,
  id: string,
): ExtensionPreferences {
  return {
    ...prefs,
    hiddenCategories: prefs.hiddenCategories.filter((item) => item !== id),
  };
}

export function restoreAllHidden(
  prefs: ExtensionPreferences,
): ExtensionPreferences {
  return { ...prefs, hiddenCategories: [] };
}

export function addRecent(
  prefs: ExtensionPreferences,
  id: string,
): ExtensionPreferences {
  const recentCategories = [
    id,
    ...prefs.recentCategories.filter((item) => item !== id),
  ].slice(0, RECENT_LIMIT);
  return { ...prefs, recentCategories };
}

export function clearRecent(prefs: ExtensionPreferences): ExtensionPreferences {
  return { ...prefs, recentCategories: [] };
}

export function clearFavorites(
  prefs: ExtensionPreferences,
): ExtensionPreferences {
  return { ...prefs, favorites: [] };
}

export function resetPreferences(): ExtensionPreferences {
  return { ...DEFAULT_PREFERENCES };
}
