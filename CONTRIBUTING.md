# Contributing

Thanks for helping improve Netflix Categories. This is an unofficial project and is not affiliated with Netflix.

## Development

1. Install [Bun](https://bun.sh) matching `package.json` `packageManager`.
2. `bun install`
3. `bun run dev`

Use Biome (`bun run check`) instead of ESLint/Prettier.

## Category data

See `docs/CATEGORY_DATA.md`. Do not scrape Netflix accounts or private APIs.

## Pull requests

- Keep permissions minimal.
- Add or update tests for domain logic.
- Run the CI commands locally before opening a PR.

## Specs

Product behavior lives in `openspec/`. Use `/opsx:propose` for requirement changes.

Chrome Web Store listing copy, permission justifications, and reviewer notes: `docs/CHROME_WEB_STORE_SUBMISSION.md`. There is no live store listing yet.
