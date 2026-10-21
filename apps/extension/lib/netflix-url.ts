const NETFLIX_ORIGIN = "https://www.netflix.com";

export function getNetflixCategoryUrl(code: string): string {
  const trimmed = code.trim();
  if (!/^\d{2,}$/.test(trimmed)) {
    throw new Error(`Invalid Netflix category code: ${code}`);
  }
  return `${NETFLIX_ORIGIN}/browse/genre/${trimmed}`;
}

export function isNetflixTabUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "www.netflix.com" || parsed.hostname === "netflix.com"
    );
  } catch {
    return false;
  }
}
