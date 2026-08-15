## ADDED Requirements

### Requirement: README SHALL document product, setup, privacy, and disclaimer

README SHALL include title, description, screenshots, features, installation, local development, commands, testing, experimental header feature, updating category data, privacy, permissions, contribution, disclaimer, and license. Local setup SHALL use Bun commands and state the actual WXT output path for Load unpacked. Privacy copy SHALL state that personal data is not collected or transmitted and that preferences are stored locally. Disclaimer SHALL state the project is unofficial and not affiliated with Netflix, that Netflix is a trademark of its owner, and that category availability, codes, and header integration can change.

#### Scenario: README clone instructions work

- **WHEN** a developer follows README setup
- **THEN** the documented commands are `bun install` and `bun run dev` and required Bun version comes from `package.json`

### Requirement: Repository quality files SHALL exist

The repository SHALL include `CONTRIBUTING.md`, MIT `LICENSE` (existing copyright retained), issue templates, a pull request template, CI, `docs/CATEGORY_DATA.md`, and `docs/CHROME_WEB_STORE_SUBMISSION.md`.

#### Scenario: Contribution and store docs are present

- **WHEN** the repository is reviewed for release readiness
- **THEN** CONTRIBUTING, category-data, and Chrome Web Store submission docs exist and match the final project

### Requirement: Chrome Web Store guide SHALL match the final extension

`docs/CHROME_WEB_STORE_SUBMISSION.md` SHALL document actual build/zip commands, ZIP location and inspection, dashboard steps, real permission justifications, experimental reviewer notes, listing copy, listing assets, and update-release steps. Copy MUST NOT claim Netflix affiliation. Automated WXT store publishing MAY be documented as a future option.

#### Scenario: Permission justifications match the manifest

- **WHEN** a store reviewer reads the submission guide
- **THEN** each requested permission is justified consistently with the built manifest

### Requirement: Original icons and local screenshots SHALL be prepared

Original extension branding SHALL be created and MUST NOT use Netflix’s official N. Icons SHALL work at the sizes required by the Chrome manifest/store, including 16, 32, 48, and 128. Popup, search, Favorites, Hidden, and Options screenshots SHALL be captured from the loaded extension. Netflix mega-menu screenshots MAY be deferred if a logged-in Netflix session is unavailable.

#### Scenario: Manifest icons are original

- **WHEN** store/manifest icons are inspected
- **THEN** they are original artwork and do not reproduce Netflix’s official N

### Requirement: Production build and ZIP SHALL pass the verification suite

The following SHALL succeed: `bun install --frozen-lockfile`, `bun run validate:data`, `bun run check`, `bun run typecheck`, `bun run test`, `bun run build`, `bun run zip`. The ZIP SHALL be inspected for secrets, `.env`, test fixtures, credentials, and remote executable code. Required features MUST NOT be left as TODOs.

#### Scenario: Zip command produces an inspectable archive

- **WHEN** `bun run zip` completes
- **THEN** the archive exists at the path documented for the installed WXT version and contains the production extension without secrets
