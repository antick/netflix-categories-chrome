# Netflix Categories

Unofficial, open-source Chrome extension for browsing Netflix's hidden categories and secret genre codes.

![Popup](docs/screenshots/popup.png)

![Search](docs/screenshots/search.png)

![Favorites](docs/screenshots/favorites.png)

![Options](docs/screenshots/options.png)

![Mega menu](docs/screenshots/mega-menu.png)

Not affiliated with, endorsed by, or sponsored by Netflix. Netflix is a trademark of its respective owner.

## Features

- **Search the bundled catalog** by category name or numeric genre code. No network fetch; the list ships inside the extension.
- **Open in this tab or a new tab** from each row (window icon / arrow-up-right icon). The name expands groups; it does not navigate.
- **Favorites** pin the codes you actually use. They get their own tab in the popup and in the Netflix menu.
- **Hidden** lets you remove noise from All. Restore one row or restore all from Options.
- **Recent** remembers the last 10 categories you opened through this extension (not your Netflix watch history).
- **Empty** keeps regional dead ends out of your way. Netflix catalog is per country, so hundreds of public codes show "No titles found" for you. Open one of those pages and after a couple of seconds it **moves to the Empty tab** and disappears from All, Fav, Recent, and Hidden. Restore it if titles show up later. This is local marking, not a scrape of Netflix's catalog.
- **Export / import** your whole local state (favorites, hidden, empty, recent, theme, and other settings) as a JSON file from Options. Nothing is uploaded.
- **Light and dark themes** for the popup, Options, and the Netflix menu.
- **Optional Hidden Categories control** in Netflix's header (off by default). Same search and lists as the popup. Needs Netflix site permission only if you turn it on.
- **Private by design:** no account, cookies, analytics, or remote category API.

## Installation

There is **no Chrome Web Store listing yet**. Use the unpacked production build:

1. `bun run build`
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click **Load unpacked**
5. Select `.output/chrome-mv3`

To publish later, follow **[Chrome Web Store submission](docs/CHROME_WEB_STORE_SUBMISSION.md)** (listing copy, permissions, reviewer notes, ZIP checks). That doc is not linked from a live store page; it is the maintainer checklist for when you submit.

## Local development

Required Bun version is in `package.json` (`packageManager`).

```bash
git clone https://github.com/antick/netflix-categories-chrome.git
cd netflix-categories-chrome
bun install
bun run dev
```

WXT starts a development browser with the extension loaded. Edit popup/options/content scripts and they reload.

### Commands

```bash
bun run dev
bun run build
bun run zip
bun run check
bun run check:fix
bun run format
bun run typecheck
bun run test
bun run validate:data
```

### Testing

```bash
bun run test
```

Manual checks: load the unpacked build, open the popup, search a name and a code, favorite/hide a category, open an empty genre and confirm it moves to Empty, export/import from Options.

### Experimental Netflix header

1. Load the extension.
2. Open the popup or Options.
3. Enable **Hidden Categories in Netflix header** (or Try in the popup notice).
4. Approve the Netflix site permission.
5. Visit or hard-refresh Netflix while logged in.
6. Confirm **Hidden Categories** in the top navigation, left of Search.
7. Use the same All / Fav / Recent / Hidden / Empty lists as the popup.
8. Disable the feature and confirm the header control goes away.

If Netflix's header cannot be found, the popup still works. This integration can break after Netflix UI updates.

If the header still shows a plain white **Categories** label jammed against Search, another Netflix secret-codes extension is injecting it. Disable that extension, then reload this one and hard-refresh Netflix.

## Updating category data

1. Research codes from public sources (prefer [Tudum](https://www.netflix.com/tudum/articles/netflix-secret-codes-guide)).
2. Verify names and codes.
3. Edit `data/netflix-categories.json`.
4. Update `updatedAt`.
5. Update [docs/CATEGORY_DATA.md](docs/CATEGORY_DATA.md) if sources change.
6. Run `bun run validate:data`, `bun run test`, and `bun run build`.
7. Open a PR.

## Privacy

This extension does not collect or transmit personal data. Favorites, hidden, empty, recent, and settings stay in local extension storage. Export writes a JSON file on your disk; import reads a file you choose. Neither leaves your machine.

Optional Netflix permission is requested only if you enable the header menu. It is used to attach an extension-owned menu on `netflix.com` and to notice when a genre page you opened is empty. The extension does not read cookies, credentials, viewing history, or account data, and does not scrape titles.

## Permissions

- `storage` — Favorites, Hidden, Recent, Empty, settings
- `activeTab` — open a category from a user click
- optional `scripting` + `https://www.netflix.com/*` — header menu and empty-page detection only after you opt in

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Store listing and reviewer copy: [docs/CHROME_WEB_STORE_SUBMISSION.md](docs/CHROME_WEB_STORE_SUBMISSION.md).

## Disclaimer

Netflix Categories is an unofficial open-source project and is not affiliated with, endorsed by, or sponsored by Netflix.

- Netflix is a trademark of its respective owner.
- Category availability can vary by region.
- Category codes can change.
- Experimental header integration can break after Netflix UI updates.

## License

MIT. See [LICENSE](LICENSE).
