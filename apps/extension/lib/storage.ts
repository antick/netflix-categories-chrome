import { migratePreferences, PREFERENCES_KEY } from "./preferences";
import type { ExtensionPreferences } from "./types";

export async function loadPreferences(): Promise<ExtensionPreferences> {
  const stored = await browser.storage.local.get(PREFERENCES_KEY);
  return migratePreferences(stored[PREFERENCES_KEY]);
}

export async function savePreferences(
  prefs: ExtensionPreferences,
): Promise<void> {
  try {
    await browser.storage.local.set({ [PREFERENCES_KEY]: prefs });
  } catch (error) {
    console.error("Failed to save preferences", error);
    throw error;
  }
}

export async function updatePreferences(
  mutator: (current: ExtensionPreferences) => ExtensionPreferences,
): Promise<ExtensionPreferences> {
  // Popup and Options share an extension origin, so this lock prevents lost edits.
  return navigator.locks.request(PREFERENCES_KEY, async () => {
    const next = migratePreferences(mutator(await loadPreferences()));
    await savePreferences(next);
    return next;
  });
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
