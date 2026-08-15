# Category data

The extension ships a static dataset at `data/netflix-categories.json`. Category lists are **never fetched at runtime**.

## How the initial dataset was collected

Researched on **2026-08-15**.

### Primary sources

- [Netflix Tudum: Netflix Secret Codes in 2025](https://www.netflix.com/tudum/articles/netflix-secret-codes-guide) — first-party explanations of genre URLs (`https://www.netflix.com/browse/genre/<code>`) and named collections with codes (90-Minute Movies, Cyberpunk, Twisted Christmas, and others). Featured Collections in the JSON come from this article.

### Secondary sources

- [The Streamable: Complete List of Netflix Category Codes](https://thestreamable.com/news/the-complete-list-of-netflix-category-codes) — compiled public table of 3,000+ name/code pairs, itself attributed to What’s On Netflix’s public category library.
- Cross-checks against widely repeated public genre IDs (for example Action & Adventure `1365`, Anime `7424`, Horror `8711`).

### What was excluded

- Actor/director “Movies starring…” / “Movies directed by…” lists (not useful genre browse groups).
- Physical-media leftovers such as Blu-ray/IMAX rows.
- Private Netflix APIs, cookies, account data, and third-party extension source code.

Conflicting or malformed rows were dropped. Duplicate IDs/codes keep the first normalized name.

**Empty "No titles found" pages are expected.** Netflix's catalog is regional. A public genre code can have titles in the US and none in India (or the reverse), and Netflix can fill or empty a code later. The extension does **not** scrape Netflix to prune those rows. Keep the code unless a public source shows it is retired.

Uncertain items: a few grouping parents (for example Featured Collections landing on Recently Added `1592210`, Niche Collections landing on Biographical `1096`) reuse a real public code as the group URL rather than inventing a fake ID.

## Verify a code

1. While logged into Netflix on the web, open `https://www.netflix.com/browse/genre/<CODE>`.
2. Confirm the page title/row matches the name closely enough to keep.
3. If the page is empty or unrelated, flag the row in a PR instead of guessing a replacement.

## Update the dataset

1. Research new or changed codes from public sources (prefer Tudum).
2. Edit `data/netflix-categories.json`.
3. Set `updatedAt` to today’s `YYYY-MM-DD`.
4. Update this file if sources or methodology changed.
5. Run:

```bash
bun run validate:data
bun run test
bun run build
```

6. Open a PR.

Do not add remote dataset fetching.
