# Categories for Netflix — Unofficial

An independent, open-source Chrome extension for searching public Netflix genre codes and keeping local category lists. Not affiliated with, endorsed by, or sponsored by Netflix.

## Release status

**Not yet published in the Chrome Web Store.** See the [release review](docs/RELEASE_REVIEW.md) for remaining store preparation and the category-source review note, and the [submission guide](docs/CHROME_WEB_STORE_SUBMISSION.md) for publishing steps.

## Features

- Search the bundled catalog by name or numeric code, without a remote category API.
- Open a category in the current tab or a new tab; copy its code or URL.
- Save favorites, hide categories, and view your last 10 extension selections.
- Export/import local settings as JSON and reset or restore lists in Options.
- Switch between light and dark themes.
- Restore empty-category markers from earlier settings exports. New empty-page detection is disabled.

The store build uses only the `storage` permission. It does not read Netflix pages, cookies, credentials, viewing history, or account information. Opening a link visits Netflix normally and still requires whatever subscription and regional access Netflix ordinarily requires. This extension does not unlock restricted titles or bypass payment, ads, DRM, or region limits.

## Install and develop

Use Bun **1.4.2**, pinned in `package.json`. WXT's build tools also require Node.js 22 or newer.

```bash
git clone https://github.com/antick/netflix-categories-chrome.git
cd netflix-categories-chrome
bun install --frozen-lockfile
bun run build
```

Open `chrome://extensions`, enable Developer mode, select **Load unpacked**, and choose `.output/chrome-mv3`. Pin the extension to the toolbar. For development, `bun run dev` starts WXT's development browser.

```bash
bun run validate:data
bun run check
bun run typecheck
bun run test
bun run build
bun run validate:release
bun run zip
```

`bun run check:fix` applies safe Biome fixes; `bun run format` formats files. CI runs data validation, formatting/lint checks, type checking, tests, the production build, and the release permission check.

## Retained experimental integration

The injected Netflix header menu, its background registration code, and empty-page detection remain in the source for future consideration. `PAGE_INTEGRATION_ENABLED` in `lib/release.ts` is **false**. WXT excludes those entrypoints from the package, and the manifest includes no host, scripting, or active-tab permission. There is no enable control in the release UI; old stored preferences and imports cannot enable it.

Do not enable this for a store release without resolving Netflix's terms restrictions and repeating the security, permission, privacy, and store review. The current release validation intentionally fails if it is enabled. The experimental code is not certified for use merely because its unit tests pass. Historical images in `docs/screenshots/` show the earlier experimental UI and are not current store assets.

## Data and privacy

The catalog is bundled in `data/netflix-categories.json`. Availability varies by country and over time. See [what the data contains and where it came from](docs/CATEGORY_DATA.md), including the distinction between public category facts and potentially protected compilation material.

Preferences stay in local browser storage. Exports are ordinary unencrypted files on your device. Read the [privacy policy](PRIVACY.md) for data handling, deletion, and external links.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Never submit account cookies, credentials, private exports, or personal screenshots with an issue.

## License

Copyright (c) 2026 Pankaj. Project code is licensed under **GPL-3.0-only**; see [LICENSE](LICENSE). Distributed derivatives must retain notices and provide corresponding source under GPLv3. Compliant commercial forks and competing store listings are allowed. Earlier MIT-licensed copies retain their original permissions.

Third-party components and fonts retain their own licenses; see [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt). The project license does not grant rights to Netflix trademarks or resolve third-party dataset rights. Use distinct branding for forks and do not imply endorsement.
