# Chrome Web Store submission

Maintainer checklist for listing this extension. **There is no live store listing yet.** The README links here so you are not looking for a store URL.

This guide matches the WXT 0.21 production output of this repository.

## Build checks

```bash
bun install --frozen-lockfile
bun run validate:data
bun run check
bun run typecheck
bun run test
bun run build
bun run zip
```

## ZIP verification

- Archive location: `.output/netflix-categories-chrome-1.0.0-chrome.zip` (version follows `package.json`).
- Inspect with `unzip -l .output/netflix-categories-chrome-1.0.0-chrome.zip`.
- Confirm there are no `.env` files, secrets, test fixtures, credentials, or remote script URLs.
- Runtime JS is bundled locally. Category data is the packaged JSON, not a network fetch.

Unpacked production directory: `.output/chrome-mv3`.

## Store dashboard

1. Create a [Chrome Web Store developer](https://chrome.google.com/webstore/devconsole) account.
2. Create a new item.
3. Upload the ZIP from `bun run zip`.
4. Fill the listing (copy below).
5. Upload icons from `public/icons/` (128px is required; 16/32/48 are in the package).
6. Upload screenshots from `docs/screenshots/` (`popup.png`, `search.png`, `favorites.png`, `options.png`, and `mega-menu.png`).
7. Language: English. Category: Productivity or Entertainment.
8. Homepage: `https://github.com/antick/netflix-categories-chrome`
9. Privacy: single-purpose, local storage only (see below).
10. Justify each permission.
11. Paste reviewer notes.
12. Submit.

Automated WXT store publishing is a future option, not required.

## Permission justifications

### storage

Stores Favorites, Hidden, Empty, Recent, theme, and other settings locally. Users may export or import that JSON from Options. No account and no server.

### activeTab

Used when the user opens a category so the extension can navigate the current tab or open Netflix.

### optional scripting

Used only after the user enables Hidden Categories in the Netflix header, to register the content script.

### optional `https://www.netflix.com/*`

Used only after opt-in, so the content script can attach the Hidden Categories control and notice when a `/browse/genre/<code>` page the user opened is empty in their region. Not requested at install. Does not read cookies, credentials, or viewing history, and does not scrape titles.

## Reviewer notes

This extension helps users browse publicly documented Netflix genre/category URLs of the form `https://www.netflix.com/browse/genre/<code>`.

The experimental header menu is optional and **disabled by default**.

Repro:

1. Install the extension.
2. Open the popup — categories appear with no Netflix permission. Search, Favorite, Hide, Recent, and Empty tabs work locally.
3. Open a genre that Netflix shows as "No titles found" / "No matching titles found" (with header access enabled). After the page settles, that category moves to Empty and leaves All.
4. Options → Export settings downloads local JSON. Import replaces local state after confirmation.
5. Enable **Hidden Categories in Netflix header**.
6. Approve Netflix permission.
7. Open Netflix (logged in) and refresh.
8. A **Hidden Categories** control appears in the header (not Netflix's own nav).
9. Open the mega menu and choose a category. Navigation uses a normal Netflix genre URL.

The injected UI is owned by the extension (Shadow DOM). It does not read cookies, account data, or viewing history, does not call private Netflix APIs, and does not modify playback.

## Listing copy

Paste into the Chrome Web Store dashboard. Character limits still apply; shorten the long description in the console if the form rejects it.

### Short description

Find Netflix hidden genre codes. Favorite, hide, skip empty regional pages, and export your lists. Optional header menu.

### Long description

Netflix Categories is an unofficial, open-source Chrome extension that makes hidden Netflix category and genre codes easy to find — and easy to keep usable.

Netflix publishes thousands of genre URLs (`netflix.com/browse/genre/<code>`), but the app does not let you browse them. This extension ships a bundled public catalog you can search by name or code.

What you can do:

- Open a category in the current tab or a new tab from each row.
- Favorite the codes you actually watch.
- Hide categories you never want in the main list.
- See Recent for categories you opened through the extension (not your Netflix watch history).
- Keep regional dead ends out of the way: if you open a genre and Netflix shows no titles in your country, it moves to an Empty tab and leaves All / Favorites / Recent / Hidden. Restore it if titles appear later. The bundled list is not scraped or geo-filtered up front, because availability differs by country and changes over time.
- Export and import favorites, hidden, empty, recent, theme, and other local settings as a JSON file. Nothing is uploaded.
- Switch light or dark theme.

An optional Hidden Categories control can sit in Netflix's header with the same lists as the popup. It is off by default and asks for Netflix site permission only if you turn it on. Netflix UI changes can break that attachment; the popup still works.

Category data is bundled with the extension. Nothing is collected or sent to a server.

Not affiliated with, endorsed by, or sponsored by Netflix.

### Single-purpose statement

This extension’s single purpose is helping users discover and open Netflix’s publicly documented genre/category browse pages, and keep their own local lists (favorites, hidden, empty, recent) for those pages.

### Privacy disclosure

This extension does not collect or transmit personal data. Favorites, hidden categories, empty categories, recent extension selections, and settings stay in local extension storage. Export writes a file on the user’s disk; import reads a file the user chooses. Optional Netflix access is used only to show an extension-owned menu on netflix.com and to notice empty genre pages the user opened, after they opt in.

### Experimental feature description

Hidden Categories in the Netflix header adds a searchable control to Netflix’s top navigation, with the same All / Favorites / Recent / Hidden / Empty lists as the popup. Netflix UI changes can break this attachment. The popup remains the primary experience.

### Disclaimer

Netflix Categories is an unofficial open-source project and is not affiliated with, endorsed by, or sponsored by Netflix. Netflix is a trademark of its respective owner.

## Update release

1. Bump `version` in `package.json`.
2. Update category data if needed.
3. Run the build checks.
4. Production-test the unpacked build.
5. Upload the new ZIP.
6. Update screenshots in `docs/screenshots/` and listing copy in this file if the UI or features changed.
7. Submit.
