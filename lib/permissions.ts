export const NETFLIX_HOST_PERMISSION = "https://www.netflix.com/*";
export const OPTIONAL_PERMISSIONS = ["scripting"] as const;
export const CONTENT_SCRIPT_ID = "netflix-header";
export const CONTENT_SCRIPT_FILE = "content-scripts/netflix-header.js";
export const CONTENT_SCRIPT_EXECUTE_FILE = "/content-scripts/netflix-header.js";
export const NETFLIX_TAB_URLS = [
  "https://www.netflix.com/*",
  "https://netflix.com/*",
] as const;

const SCRIPT_DEF = {
  id: CONTENT_SCRIPT_ID,
  js: [CONTENT_SCRIPT_FILE],
  matches: [NETFLIX_HOST_PERMISSION],
  runAt: "document_idle" as const,
  persistAcrossSessions: true,
};

let registrationChain: Promise<void> = Promise.resolve();

function canUseScriptingApi(): boolean {
  return typeof browser.scripting?.unregisterContentScripts === "function";
}

function enqueueRegistration(work: () => Promise<void>): Promise<void> {
  registrationChain = registrationChain.then(work, work);
  return registrationChain;
}

function isDuplicateScriptError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Duplicate script ID");
}

export async function hasNetflixPermission(): Promise<boolean> {
  try {
    return await browser.permissions.contains({
      permissions: [...OPTIONAL_PERMISSIONS],
      origins: [NETFLIX_HOST_PERMISSION],
    });
  } catch (error) {
    console.error("Failed to check Netflix permission", error);
    return false;
  }
}

export async function requestNetflixPermission(): Promise<boolean> {
  try {
    return await browser.permissions.request({
      permissions: [...OPTIONAL_PERMISSIONS],
      origins: [NETFLIX_HOST_PERMISSION],
    });
  } catch (error) {
    console.error("Failed to request Netflix permission", error);
    return false;
  }
}

export async function removeNetflixPermission(): Promise<void> {
  try {
    await unregisterNetflixContentScript();
    await browser.permissions.remove({
      permissions: [...OPTIONAL_PERMISSIONS],
      origins: [NETFLIX_HOST_PERMISSION],
    });
  } catch (error) {
    console.error("Failed to remove Netflix permission", error);
  }
}

export async function registerNetflixContentScript(): Promise<void> {
  if (!canUseScriptingApi()) return;

  await enqueueRegistration(async () => {
    const existing = await browser.scripting
      .getRegisteredContentScripts({ ids: [CONTENT_SCRIPT_ID] })
      .catch(() => []);
    if (!existing.length) {
      try {
        await browser.scripting.registerContentScripts([SCRIPT_DEF]);
      } catch (error) {
        if (!isDuplicateScriptError(error)) throw error;
      }
    }
    await injectIntoOpenNetflixTabs();
  });
}

export async function unregisterNetflixContentScript(): Promise<void> {
  if (!canUseScriptingApi()) return;
  await enqueueRegistration(async () => {
    await browser.scripting
      .unregisterContentScripts({ ids: [CONTENT_SCRIPT_ID] })
      .catch(() => undefined);
  });
}

export async function injectIntoOpenNetflixTabs(): Promise<void> {
  if (!canUseScriptingApi() || typeof browser.tabs?.query !== "function")
    return;

  const tabs = await browser.tabs.query({ url: [...NETFLIX_TAB_URLS] });
  await Promise.all(
    tabs.map((tab) => {
      if (tab.id == null) return Promise.resolve();
      return browser.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: [CONTENT_SCRIPT_EXECUTE_FILE],
        })
        .catch(() => undefined);
    }),
  );
}

export async function enableExperimentalHeader(): Promise<boolean> {
  const granted = await requestNetflixPermission();
  if (!granted) return false;
  await registerNetflixContentScript();
  return true;
}

export async function disableExperimentalHeader(): Promise<void> {
  await unregisterNetflixContentScript();
  await removeNetflixPermission();
}
