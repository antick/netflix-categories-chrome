import { expect, test } from "bun:test";
import { getAllCategories } from "../lib/categories";
import { DEFAULT_PREFERENCES, toggleFavorite } from "../lib/preferences";
import {
  loadPreferences,
  savePreferences,
  subscribeToPreferences,
  updatePreferences,
} from "../lib/storage";

test("removed categories are cleaned once without losing settings or concurrent edits", async () => {
  const originalBrowser = Object.getOwnPropertyDescriptor(
    globalThis,
    "browser",
  );
  const originalLocks = Object.getOwnPropertyDescriptor(navigator, "locks");
  const [first, second] = getAllCategories()
    .slice(0, 2)
    .map((item) => item.id);
  let saved = { ...DEFAULT_PREFERENCES };
  let failRead = false;
  let writes = 0;
  let queue = Promise.resolve();
  let onChange:
    | Parameters<typeof browser.storage.onChanged.addListener>[0]
    | undefined;
  Object.defineProperty(globalThis, "browser", {
    configurable: true,
    value: {
      storage: {
        onChanged: {
          addListener: (listener: NonNullable<typeof onChange>) => {
            onChange = listener;
          },
          removeListener: () => {
            onChange = undefined;
          },
        },
        local: {
          get: async () => {
            if (failRead) throw new Error("read failed");
            return { preferences: saved };
          },
          set: async ({ preferences }: { preferences: typeof saved }) => {
            saved = preferences;
            writes++;
          },
        },
      },
    },
  });
  Object.defineProperty(navigator, "locks", {
    configurable: true,
    value: {
      request: (_name: string, work: () => Promise<unknown>) => {
        const result = queue.then(work);
        queue = result.then(
          () => undefined,
          () => undefined,
        );
        return result;
      },
    },
  });
  try {
    saved = {
      ...DEFAULT_PREFERENCES,
      theme: "light",
      openBehavior: "new-tab",
      favorites: [first!, "removed-category"],
      hiddenCategories: [second!, "removed-category"],
      recentCategories: [second!, "removed-category", first!],
      emptyCategories: [first!, "removed-category"],
    };
    const cleaned = await loadPreferences();
    expect(cleaned.favorites).toEqual([first!]);
    expect(cleaned.hiddenCategories).toEqual([second!]);
    expect(cleaned.recentCategories).toEqual([second!, first!]);
    expect(cleaned.emptyCategories).toEqual([first!]);
    expect(cleaned.theme).toBe("light");
    expect(cleaned.openBehavior).toBe("new-tab");
    expect(saved).toEqual(cleaned);
    expect(writes).toBe(1);
    await loadPreferences();
    expect(writes).toBe(1);
    await savePreferences({
      ...cleaned,
      hiddenCategories: ["removed-category"],
    });
    expect(saved.hiddenCategories).toEqual([]);
    const updated = await updatePreferences((prefs) => ({
      ...prefs,
      favorites: [first!, "removed-category"],
    }));
    expect(updated.favorites).toEqual([first!]);
    expect(saved.favorites).toEqual([first!]);
    let received = DEFAULT_PREFERENCES;
    const unsubscribe = subscribeToPreferences((prefs) => {
      received = prefs;
    });
    onChange!(
      {
        preferences: {
          newValue: { ...cleaned, hiddenCategories: ["removed-category"] },
        },
      },
      "local",
    );
    expect(received.hiddenCategories).toEqual([]);
    unsubscribe();
    saved = { ...DEFAULT_PREFERENCES, hiddenCategories: ["removed-category"] };
    writes = 0;
    await Promise.all([
      loadPreferences(),
      updatePreferences((prefs) => toggleFavorite(prefs, first!)),
      updatePreferences((prefs) => toggleFavorite(prefs, second!)),
    ]);
    expect(saved.favorites).toEqual([second!, first!]);
    failRead = true;
    await expect(loadPreferences()).rejects.toThrow("read failed");
    await expect(updatePreferences(() => DEFAULT_PREFERENCES)).rejects.toThrow(
      "read failed",
    );
    expect(writes).toBe(3);
    expect(saved.hiddenCategories).toEqual([]);
    expect(saved.favorites).toEqual([second!, first!]);
  } finally {
    if (originalBrowser)
      Object.defineProperty(globalThis, "browser", originalBrowser);
    else Reflect.deleteProperty(globalThis, "browser");
    if (originalLocks) Object.defineProperty(navigator, "locks", originalLocks);
    else Reflect.deleteProperty(navigator, "locks");
  }
});
