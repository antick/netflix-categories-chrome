import { getNetflixCategoryUrl } from "./netflix-url";
import type { OpenBehavior } from "./types";

export function shouldUseInPageNavigation(
  hostname = typeof location === "undefined" ? "" : location.hostname,
): boolean {
  return hostname === "www.netflix.com" || hostname === "netflix.com";
}

export async function openNetflixCategory(
  code: string,
  behavior: OpenBehavior,
): Promise<void> {
  const url = getNetflixCategoryUrl(code);

  if (shouldUseInPageNavigation()) {
    if (behavior === "new-tab") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    location.assign(url);
    return;
  }

  try {
    if (behavior === "new-tab") {
      await browser.tabs.create({ url });
      return;
    }

    const [active] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (active?.id != null) {
      await browser.tabs.update(active.id, { url });
      return;
    }

    await browser.tabs.create({ url });
  } catch (error) {
    console.error("Failed to open Netflix category", error);
    await browser.tabs.create({ url });
  }
}
