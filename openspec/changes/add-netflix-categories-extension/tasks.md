## 1. Project initialization

- [x] 1.1 Initialize WXT React + TypeScript with Bun in this existing repo, preserving MIT LICENSE
- [x] 1.2 Set `packageManager` to the exact installed Bun version and commit-ready `bun.lock` (do not git commit until asked)
- [x] 1.3 Configure Tailwind CSS and Biome; add VS Code/Cursor Biome formatter settings if repo settings are created
- [x] 1.4 Add package scripts (`dev`, `build`, `zip`, `typecheck`, `check`, `check:fix`, `format`, `test`, `validate:data`, `postinstall`)
- [x] 1.5 Confirm no ESLint, Prettier, or non-Bun lockfiles

## 2. Category dataset

- [x] 2.1 Research public Netflix category/genre codes, preferring first-party Tudum/Netflix docs
- [x] 2.2 Cross-check, dedupe, normalize names, and organize a useful shallow hierarchy
- [x] 2.3 Write populated `data/netflix-categories.json` with `schemaVersion` and `updatedAt`
- [x] 2.4 Write `docs/CATEGORY_DATA.md` with sources, date, and update workflow
- [x] 2.5 Implement `scripts/validate-categories.ts` and run `bun run validate:data`

## 3. Shared domain layer

- [x] 3.1 Implement category loading, flattening, and lookup by ID
- [x] 3.2 Implement versioned preferences storage and migrate-on-read
- [x] 3.3 Implement Favorites, Hidden (including parent/child rules), and Recent (limit 10)
- [x] 3.4 Implement local search (name, child, code, hidden include option)
- [x] 3.5 Implement `getNetflixCategoryUrl` and `openNetflixCategory` with tab reuse/new-tab behavior

## 4. Popup and Options

- [x] 4.1 Build popup shell (title, search, sections, settings link) at ~440×620
- [x] 4.2 Build hierarchical category list, rows, Favorite, overflow Hide/Copy actions
- [x] 4.3 Build Favorites, Recent, Hidden sections and empty states
- [x] 4.4 Polish dark-first UI, system fonts, Lucide icons, keyboard/accessibility
- [x] 4.5 Build Options (open behavior, experimental toggle copy, data reset actions)
- [x] 4.6 Build dismissible experimental promotion card wired to permission flow

## 5. Experimental Netflix header

- [x] 5.1 Configure optional `scripting` and `https://www.netflix.com/*`; keep core permissions minimal
- [x] 5.2 Implement permission request/disable flow (reject keeps feature OFF)
- [x] 5.3 Implement Netflix DOM adapter with graceful failure and cleanup
- [x] 5.4 Implement content script + Shadow DOM Categories control and mega menu
- [x] 5.5 Connect mega menu to shared search/Favorites/Hidden/Recent and storage events
- [x] 5.6 Handle SPA remounting without duplicates; stop work when disabled
- [x] 5.7 STOP: ask the owner to log into Netflix in the test browser before header verification and mega-menu screenshots

## 6. Tests, CI, docs, and release assets

- [x] 6.1 Add Bun tests for dataset, search, preferences rules, URLs, and experimental default/permission behavior (mock browser APIs)
- [x] 6.2 Add `.github/workflows/ci.yml`, issue templates, PR template, and `CONTRIBUTING.md`
- [x] 6.3 Write README (setup, commands, actual WXT output path, privacy, disclaimer) and store submission guide matching the final manifest
- [x] 6.4 Create original icons (16/32/48/128, no Netflix N)
- [x] 6.5 Run `validate:data`, `check`, `typecheck`, `test`, `build`, and `zip`; inspect the ZIP
- [x] 6.6 Capture popup/search/Favorites/Hidden/Options screenshots; defer Netflix mega-menu shots if login is still unavailable
- [x] 6.7 After owner login, verify header injection, mega menu, sync, SPA, disable behavior, and capture the remaining screenshot

## 7. UI follow-up

- [x] 7.1 Lock popup width, force dark UI, shrink experimental notice, and add per-row Tab/New actions
- [x] 7.2 Rename and highlight Hidden Categories, align mega menu to the control, and fix contrast
- [x] 7.3 Fix Options data actions with confirmation; highlight Experimental; remove global open-behavior setting
- [x] 7.4 Add All/Favorites/Recent/Hidden tabs to the popup and Light/Dark themes
- [x] 7.5 Add Empty tab; move region-empty genre pages there from popup and mega menu
- [x] 7.6 Replace Tab/New with icon+tooltip actions, expand on row click, and match header type to Netflix
- [x] 7.7 Add Options export/import of the full local preference state
