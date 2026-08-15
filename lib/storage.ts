import {
  DEFAULT_PREFERENCES,
  migratePreferences,
  PREFERENCES_KEY,
} from "./preferences";
import type { ExtensionPreferences } from "./types";

function hasStorage(): boolean {
  return typeof browser !== "undefined" && Boolean(browser.storage?.local);
}

export async function loadPreferences(): Promise<ExtensionPreferences> {
  try {
    if (!hasStorage()) return { ...DEFAULT_PREFERENCES };
    const stored = await browser.storage.local.get(PREFERENCES_KEY);
    return migratePreferences(stored[PREFERENCES_KEY]);
  } catch (error) {
    console.error("Failed to load preferences", error);
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function savePreferences(
  prefs: ExtensionPreferences,
): Promise<void> {
  try {
    if (!hasStorage()) return;
    await browser.storage.local.set({ [PREFERENCES_KEY]: prefs });
  } catch (error) {
    console.error("Failed to save preferences", error);
    throw error;
  }
}

export function subscribeToPreferences(
  listener: (prefs: ExtensionPreferences) => void,
): () => void {
  if (typeof browser === "undefined" || !browser.storage?.onChanged) {
    return () => undefined;
  }
  const onChange: Parameters<typeof browser.storage.onChanged.addListener>[0] =
    (changes, area) => {
      if (area !== "local" || !changes[PREFERENCES_KEY]) return;
      listener(migratePreferences(changes[PREFERENCES_KEY].newValue));
    };
  browser.storage.onChanged.addListener(onChange);
  return () => browser.storage.onChanged.removeListener(onChange);
}
