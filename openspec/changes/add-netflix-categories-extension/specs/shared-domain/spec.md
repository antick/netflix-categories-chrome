## ADDED Requirements

### Requirement: Popup and Netflix header SHALL share one domain layer

Category loading, flattening, search, Favorites, Hidden, Recent, settings, Netflix URLs, and navigation SHALL live in shared modules used by both UIs. Domain logic MUST NOT be duplicated between popup and content-script UI.

#### Scenario: Favorite from popup appears in mega menu

- **WHEN** a user favorites a category in the popup while the experimental mega menu is open
- **THEN** the mega menu shows that category in Favorites without a browser restart

### Requirement: Preferences SHALL persist locally with a versioned schema

The extension SHALL store preferences in local extension storage using category IDs, not names. The model SHALL include `schemaVersion`, `favorites`, `hiddenCategories`, `recentCategories`, `emptyCategories`, `experimentalHeaderMenuEnabled`, `experimentalHeaderMenuNoticeDismissed`, `openBehavior` of `"reuse-current-tab"` | `"new-tab"`, and `theme` of `"light"` | `"dark"` (default dark). A small schema-version migration strategy SHALL exist so future shape changes are possible without over-engineering. Missing `emptyCategories` SHALL migrate to `[]`.

#### Scenario: Preferences survive popup close

- **WHEN** the user favorites a category, closes the popup, and reopens it
- **THEN** that category remains in Favorites

### Requirement: Every category SHALL support Favorite and Unfavorite

Favorites SHALL persist locally, appear prominently in popup and mega menu, remain searchable, support direct removal, and show an empty state. Favoriting a hidden category SHALL automatically unhide it.

#### Scenario: Favorite unhides a hidden category

- **WHEN** a hidden category is favorited
- **THEN** it is removed from Hidden and appears in Favorites and normal browsing

### Requirement: Users SHALL be able to hide and restore categories

Hidden categories SHALL disappear from normal browsing, remain listed in a Hidden section with a count, support one-click Unhide and Restore All Hidden, and stay recoverable. Hiding a favorited category SHALL remove it from Favorites. Search MAY optionally include hidden entries.

#### Scenario: Hide removes a favorite

- **WHEN** a favorited category is hidden
- **THEN** it is removed from Favorites and appears only in Hidden during normal browsing

### Requirement: Parent and child hiding SHALL be deterministic

Hiding a parent SHALL remove that parent group from normal browsing. Its children SHALL remain recoverable from Hidden management. Individual children MAY be hidden separately. Unhiding a child MUST NOT silently unhide an explicitly hidden parent. UI SHALL make parent/child context clear.

#### Scenario: Unhiding a child keeps a hidden parent hidden

- **WHEN** a parent is hidden and a user unhides one of its children
- **THEN** the parent group remains hidden from normal browsing and the child is recoverable without implying the parent is visible

### Requirement: Recent categories SHALL track only extension-opened items

Recent SHALL record only categories opened through this extension, MUST NOT read Netflix viewing activity, SHALL keep about 10 items, newest first, without duplicate IDs, persist locally, and provide a clear action. Popup and mega menu SHALL both show Recent.

#### Scenario: Opening a category prepends Recent

- **WHEN** the user opens a category via the extension
- **THEN** that category ID is first in Recent and any previous occurrence is removed

#### Scenario: Recent is bounded

- **WHEN** the user opens more than 10 distinct categories
- **THEN** only the 10 most recent IDs are retained

### Requirement: Search SHALL match names and codes locally

Search SHALL be case-insensitive, trimmed, partial-matching, and MUST match category names, child names, and genre codes with no network request. Child results SHALL include parent context. Keyboard navigation SHALL support Up/Down to select, Enter to open, and Escape to clear. Default search SHALL exclude hidden categories and SHALL provide an Include hidden option. Default search SHALL also exclude categories marked empty unless the Empty tab is active. Hidden results SHALL be visually marked. A fuzzy-search library MUST NOT be added unless standard matching is insufficient.

#### Scenario: Code search finds a child

- **WHEN** the user types a child's genre code
- **THEN** that child is a result and its parent name is shown as context

#### Scenario: Hidden categories are excluded by default

- **WHEN** a category is hidden and Include hidden is off
- **THEN** search results omit that category

### Requirement: Netflix URLs and tab opening SHALL be centralized

`getNetflixCategoryUrl(code)` SHALL return `https://www.netflix.com/browse/genre/<CODE>`. `openNetflixCategory(code, behavior)` SHALL open that URL using `"reuse-current-tab"` or `"new-tab"` chosen per action. If the active tab is Netflix, it SHALL be reused when that behavior is selected; otherwise a Netflix tab SHALL be opened. When the call runs inside a Netflix page (content script), same-tab SHALL navigate the page and new-tab SHALL open a browsing context without requiring a global Options default. Chrome API errors SHALL be handled gracefully. URL construction MUST NOT be duplicated.

#### Scenario: Default reuses a Netflix tab

- **WHEN** open behavior is reuse-current-tab and the active tab is Netflix
- **THEN** that tab navigates to the category URL and no extra tab is created
