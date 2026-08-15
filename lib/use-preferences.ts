import { useCallback, useEffect, useState } from "react";
import {
  addRecent,
  clearEmpty,
  clearFavorites,
  clearRecent,
  hideCategory,
  resetPreferences,
  restoreAllHidden,
  toggleFavorite,
  unhideCategory,
  unmarkEmpty,
} from "./preferences";
import {
  loadPreferences,
  savePreferences,
  subscribeToPreferences,
} from "./storage";
import type {
  ExtensionPreferences,
  OpenBehavior,
  ThemePreference,
} from "./types";

export function usePreferences() {
  const [prefs, setPrefs] = useState<ExtensionPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadPreferences()
      .then((value) => {
        if (active) setPrefs(value);
      })
      .catch(() => {
        if (active) setError("Could not load saved preferences.");
      });
    const unsubscribe = subscribeToPreferences((value) => setPrefs(value));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const update = useCallback(async (next: ExtensionPreferences) => {
    setPrefs(next);
    await savePreferences(next);
  }, []);

  const patch = useCallback(
    async (
      mutator: (current: ExtensionPreferences) => ExtensionPreferences,
    ) => {
      const current = prefs ?? (await loadPreferences());
      await update(mutator(current));
    },
    [prefs, update],
  );

  return {
    prefs,
    error,
    ready: Boolean(prefs),
    toggleFavorite: (id: string) =>
      patch((current) => toggleFavorite(current, id)),
    hide: (id: string) => patch((current) => hideCategory(current, id)),
    unhide: (id: string) => patch((current) => unhideCategory(current, id)),
    restoreHidden: () => patch(restoreAllHidden),
    unmarkEmpty: (id: string) => patch((current) => unmarkEmpty(current, id)),
    clearEmpty: () => patch(clearEmpty),
    rememberRecent: (id: string) => patch((current) => addRecent(current, id)),
    clearRecent: () => patch(clearRecent),
    clearFavorites: () => patch(clearFavorites),
    setOpenBehavior: (openBehavior: OpenBehavior) =>
      patch((current) => ({ ...current, openBehavior })),
    setTheme: (theme: ThemePreference) =>
      patch((current) => ({ ...current, theme })),
    setExperimentalEnabled: (enabled: boolean) =>
      patch((current) => ({
        ...current,
        experimentalHeaderMenuEnabled: enabled,
      })),
    dismissNotice: () =>
      patch((current) => ({
        ...current,
        experimentalHeaderMenuNoticeDismissed: true,
      })),
    resetAll: () => patch(resetPreferences),
    replaceAll: (next: ExtensionPreferences) => patch(() => next),
  };
}
