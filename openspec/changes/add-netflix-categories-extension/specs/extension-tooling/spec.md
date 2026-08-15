## ADDED Requirements

### Requirement: Project SHALL use Bun, WXT, React, TypeScript, and Manifest V3

The repository SHALL be initialized with the current official WXT React + TypeScript setup and SHALL target Chrome Manifest V3. Bun SHALL be the package manager and command runner. `package.json` SHALL declare the exact Bun version in `packageManager` as `bun@<actual-version>`. The committed lockfile SHALL be `bun.lock`. The repository MUST NOT commit `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.

#### Scenario: Fresh install uses Bun

- **WHEN** a developer runs `bun install` in a clean checkout
- **THEN** dependencies install from `bun.lock` and the WXT prepare step runs

#### Scenario: Non-Bun lockfiles are absent

- **WHEN** the production tree is inspected
- **THEN** no npm, pnpm, or Yarn lockfiles are present

### Requirement: Tooling SHALL use Biome and Tailwind CSS

Formatting, linting, and import organization SHALL use Biome via `biome.json`. ESLint and Prettier MUST NOT be installed. Tailwind CSS SHALL style extension UI. Repository editor settings, if created, SHALL use Biome as the formatter. Lucide React SHALL provide icons. Current stable versions available at implementation time SHALL be used.

#### Scenario: Check script uses Biome

- **WHEN** a developer runs `bun run check`
- **THEN** Biome checks the project and ESLint is not invoked

### Requirement: Package scripts SHALL cover development, verification, and release

`package.json` scripts SHALL include, adjusting only if the installed WXT version requires it:

- `dev`: `wxt`
- `build`: `wxt build`
- `zip`: `wxt zip`
- `typecheck`: `tsc --noEmit`
- `check`: `biome check .`
- `check:fix`: `biome check --write .`
- `format`: `biome format --write .`
- `test`: `bun test`
- `validate:data`: `bun run scripts/validate-categories.ts`
- `postinstall`: `wxt prepare`

#### Scenario: Required scripts exist

- **WHEN** `package.json` is read
- **THEN** each listed script name exists and invokes the corresponding tool

### Requirement: CI SHALL verify the extension on pull requests and main

A GitHub Actions workflow at `.github/workflows/ci.yml` SHALL use Bun and SHALL run `bun install --frozen-lockfile`, `bun run validate:data`, `bun run check`, `bun run typecheck`, `bun run test`, and `bun run build` on pull requests and pushes to `main`.

#### Scenario: CI workflow is present

- **WHEN** the repository is pushed to `main` or a pull request is opened
- **THEN** the workflow runs the frozen-lockfile install and the listed verification commands
