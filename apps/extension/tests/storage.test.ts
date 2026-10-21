import { expect, test } from "bun:test";
import { DEFAULT_PREFERENCES, toggleFavorite } from "../lib/preferences";
import { loadPreferences, updatePreferences } from "../lib/storage";

test("preference edits use current storage and a failed read never overwrites it", async () => {
  const originalBrowser = Object.getOwnPropertyDescriptor(
    globalThis,
    "browser",
  );
  const originalLocks = Object.getOwnPropertyDescriptor(navigator, "locks");
  let saved = { ...DEFAULT_PREFERENCES };
  let failRead = false;
  let writes = 0;
  let queue = Promise.resolve();
  Object.defineProperty(globalThis, "browser", {
    configurable: true,
    value: {
      storage: {
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
    await Promise.all([
      updatePreferences((prefs) => toggleFavorite(prefs, "first")),
      updatePreferences((prefs) => toggleFavorite(prefs, "second")),
    ]);
    expect(saved.favorites).toEqual(["second", "first"]);
    failRead = true;
    await expect(loadPreferences()).rejects.toThrow("read failed");
    await expect(updatePreferences(() => DEFAULT_PREFERENCES)).rejects.toThrow(
      "read failed",
    );
    expect(writes).toBe(2);
    expect(saved.favorites).toEqual(["second", "first"]);
  } finally {
    if (originalBrowser)
      Object.defineProperty(globalThis, "browser", originalBrowser);
    else Reflect.deleteProperty(globalThis, "browser");
    if (originalLocks) Object.defineProperty(navigator, "locks", originalLocks);
    else Reflect.deleteProperty(navigator, "locks");
  }
});
