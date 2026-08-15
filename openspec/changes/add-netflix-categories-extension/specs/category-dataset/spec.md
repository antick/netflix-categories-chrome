## ADDED Requirements

### Requirement: Category data SHALL be bundled locally and never fetched at runtime

The extension SHALL ship a populated dataset at `data/netflix-categories.json` and MUST bundle it into the extension. Runtime category lists MUST come from that bundled file through a shared TypeScript data layer. The extension MUST NOT fetch the category list from the internet at runtime and MUST NOT use a backend or remote database for categories.

#### Scenario: Popup loads without network category fetch

- **WHEN** the popup opens with network disabled
- **THEN** the bundled dataset still loads and categories are available for browse and search

### Requirement: Dataset SHALL use a versioned hierarchical JSON schema

The dataset SHALL contain `schemaVersion`, `updatedAt` as `YYYY-MM-DD`, and a `categories` array. Each category SHALL have a stable `id`, human-readable `name`, and `code` stored as a string. Children MAY be nested in `children`. Hierarchy SHALL be shallow and useful for browsing. User preferences MUST NOT be stored in this JSON.

#### Scenario: Valid category record shape

- **WHEN** a category object is read from the dataset
- **THEN** it has non-empty `id`, `name`, and string `code`, and optional `children` is an array of the same shape

### Requirement: Dataset SHALL contain researched real category codes

The implementer SHALL research currently documented Netflix hidden categories and genre codes from public sources, preferring first-party Netflix/Tudum documentation when available, then reputable public sources. Conflicting codes SHALL be cross-checked. Obvious duplicates SHALL be removed. Names SHALL be normalized. The dataset MUST be substantially populated and MUST NOT be placeholder-only sample data. If research is impossible, implementation MUST stop and report `BLOCKER: Unable to research and populate the required Netflix category dataset` instead of shipping sample data.

#### Scenario: Production dataset is not demo-sized

- **WHEN** the committed dataset is validated
- **THEN** it contains a broad useful category list rather than a handful of example entries

#### Scenario: Research sources are documented

- **WHEN** maintainers open `docs/CATEGORY_DATA.md`
- **THEN** primary and secondary sources, collection method, and last research date are recorded

### Requirement: Data collection SHALL stay on public documented sources

Research MUST NOT reverse-engineer Netflix private APIs, scrape Netflix account or session data, require login credentials, use Netflix cookies, or copy executable code from third-party extensions. Publicly documented genre/category URL data MAY be used.

#### Scenario: Collection constraints are followed

- **WHEN** the dataset is assembled
- **THEN** no private Netflix endpoint, cookie, or credential is used

### Requirement: A validator SHALL reject invalid category data

`scripts/validate-categories.ts` SHALL validate JSON structure, schema version, duplicate IDs, empty IDs, duplicate records, empty names, empty or malformed codes, invalid child arrays, duplicate children, and invalid object shapes. `bun run validate:data` SHALL fail with useful messages. CI SHALL run the validator.

#### Scenario: Duplicate IDs fail validation

- **WHEN** two categories share the same `id`
- **THEN** `bun run validate:data` exits non-zero and names the duplicate ID

#### Scenario: Malformed codes fail validation

- **WHEN** a category `code` is empty or not a well-formed numeric genre code string
- **THEN** validation fails with a message identifying the record

### Requirement: Maintainers SHALL have a documented update workflow

`docs/CATEGORY_DATA.md` SHALL explain how to verify new codes, edit `data/netflix-categories.json`, update `updatedAt`, update provenance when sources change, and run the validator. This version MUST NOT implement automatic remote dataset fetching.

#### Scenario: Update docs mention validator and updatedAt

- **WHEN** a maintainer follows `docs/CATEGORY_DATA.md`
- **THEN** the documented steps include editing the JSON, updating `updatedAt`, and running `bun run validate:data`
