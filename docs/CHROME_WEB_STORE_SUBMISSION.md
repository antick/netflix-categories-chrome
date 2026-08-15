# Chrome Web Store submission

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
6. Upload screenshots from `docs/screenshots/` (popup, search, Favorites, Hidden, Options; mega-menu when a logged-in Netflix session is available).
7. Language: English. Category: Productivity or Entertainment.
8. Homepage: `https://github.com/antick/netflix-categories-chrome`
9. Privacy: single-purpose, local storage only (see below).
10. Justify each permission.
11. Paste reviewer notes.
12. Submit.

Automated WXT store publishing is a future option, not required.

## Permission justifications

### storage

Stores Favorites, Hidden categories, Empty categories, Recent extension selections, and settings locally.

### activeTab

Used when the user opens a category so the extension can navigate the current tab or open Netflix.

### optional scripting

Used only after the user enables Experimental Netflix Header Menu, to register the content script.

### optional `https://www.netflix.com/*`

Used only after opt-in, so the content script can attach an extension-owned Categories control on Netflix. Not requested at install.

## Reviewer notes

This extension helps users browse publicly documented Netflix genre/category URLs of the form `https://www.netflix.com/browse/genre/<code>`.

The experimental header menu is optional and **disabled by default**.

Repro:

1. Install the extension.
2. Open the popup — categories appear with no Netflix permission.
3. Enable Experimental Netflix Header Menu.
4. Approve Netflix permission.
5. Open Netflix (logged in) and refresh.
6. A **Categories** item appears in the header.
7. Open the mega menu and choose a category. Navigation uses a normal Netflix genre URL.

The injected UI is owned by the extension (Shadow DOM). It does not read cookies, account data, or viewing history, does not call private Netflix APIs, and does not modify playback.

## Listing copy

### Short description

Browse Netflix hidden categories and genre codes from a popup, with an optional Hidden Categories header menu.

### Long description

Netflix Categories is an unofficial, open-source Chrome extension that makes hidden Netflix category and genre codes easy to find.

Search by name or numeric code, favorite or hide categories, and open `netflix.com/browse/genre/<code>` in your current tab or a new tab. An optional experimental menu can add Categories to Netflix’s top navigation. That feature is off by default and needs Netflix site permission only if you turn it on.

Category data is bundled with the extension. Nothing is collected or sent to a server. Availability of a given category can vary by region, and codes can change.

Not affiliated with, endorsed by, or sponsored by Netflix.

### Single-purpose statement

This extension’s single purpose is helping users discover and open Netflix’s publicly documented genre/category browse pages.

### Privacy disclosure

This extension does not collect or transmit personal data. Favorites, hidden categories, recent category selections, and settings stay in local extension storage. Optional Netflix access is used only to show an extension-owned menu on netflix.com after the user opts in.

### Experimental feature description

Experimental Netflix Header Menu adds a Categories control to Netflix’s top navigation. Netflix UI changes can break this attachment. The popup remains the primary experience.

### Disclaimer

Netflix Categories is an unofficial open-source project and is not affiliated with, endorsed by, or sponsored by Netflix. Netflix is a trademark of its respective owner.

## Update release

1. Bump `version` in `package.json`.
2. Update category data if needed.
3. Run the build checks.
4. Production-test the unpacked build.
5. Upload the new ZIP.
6. Update screenshots/text if the UI changed.
7. Submit.
