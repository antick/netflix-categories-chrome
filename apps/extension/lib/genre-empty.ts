export function extractGenreCodeFromPath(pathname: string): string | null {
  const match = pathname.match(/\/browse\/genre\/(\d+)/);
  return match?.[1] ?? null;
}

export type GenrePageStatus = "loading" | "empty" | "ready";

const EMPTY_COPY = /no matching titles found|no titles found/i;

export const EMPTY_PAGE_SETTLE_MS = 1800;

export function classifyGenrePage(
  doc: Document = document,
  pathname = typeof location === "undefined" ? "" : location.pathname,
): GenrePageStatus {
  if (!extractGenreCodeFromPath(pathname)) return "loading";
  if (doc.querySelector('a[href*="/watch/"]')) return "ready";
  const text = doc.body?.innerText ?? doc.body?.textContent ?? "";
  if (EMPTY_COPY.test(text)) return "empty";
  return "loading";
}
