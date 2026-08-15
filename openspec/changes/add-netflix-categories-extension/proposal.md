## Why

Netflix hides useful genre and category browse pages behind numeric codes that are hard to discover. This repository needs a complete, installable Chrome extension that ships real category data, a polished popup, and an optional in-Netflix header menu—without backends, telemetry, or placeholder content.

## What Changes

- Initialize a Bun + WXT Manifest V3 React/TypeScript extension with Tailwind CSS and Biome.
- Research, normalize, and bundle a substantial public Netflix category/genre-code dataset as static JSON.
- Add a shared domain layer for loading, search, Favorites, Hidden, Recent, settings, and Netflix URL navigation.
- Build the primary popup and an Options page.
- Ship an opt-in experimental Netflix header mega menu using optional host/scripting permissions.
- Add tests, CI, documentation, original branding, production build, and Chrome Web Store submission guidance.
- Replace `PLAN.md` with this OpenSpec change as the source of truth. No existing product code is modified because the repo currently contains only license/readme scaffolding.

## Capabilities

### New Capabilities

- `extension-tooling`: Bun/WXT/React/TypeScript/Tailwind/Biome project setup, scripts, and CI.
- `category-dataset`: Public research, hierarchical JSON dataset, validator, and provenance docs.
- `shared-domain`: Category loading, search, Favorites, Hidden, Recent, preferences/storage, and Netflix navigation.
- `popup-ui`: Dark-first popup for browsing, searching, and opening categories.
- `options-page`: Open-behavior, experimental toggle, and local data-reset controls.
- `experimental-netflix-header`: Opt-in Categories header item, Shadow DOM mega menu, SPA remounting, and permission flow.
- `privacy-and-permissions`: Minimal permissions, no remote code/telemetry, and local-only preferences.
- `documentation-and-release`: README, CONTRIBUTING, store submission guide, icons, build, and ZIP verification.

### Modified Capabilities

- None. This is a greenfield change; `openspec/specs/` has no existing capabilities.

## Impact

- New WXT extension codebase under this repository (entrypoints, shared `lib/`, bundled `data/netflix-categories.json`).
- New Chrome extension APIs: `storage`, `activeTab`, optional `scripting`, optional `https://www.netflix.com/*`.
- New GitHub Actions CI and repository docs.
- Existing MIT `LICENSE` is kept. `PLAN.md` is removed after this change’s artifacts are complete.
- No backend, analytics, or Netflix private-API dependencies.
