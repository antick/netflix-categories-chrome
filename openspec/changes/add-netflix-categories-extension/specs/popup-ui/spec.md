## ADDED Requirements

### Requirement: Popup SHALL be the stable primary experience

The popup SHALL be usable immediately after installation with real bundled category data. Suggested size is 440px wide and about 620px maximum useful height, subject to Chrome constraints. Layout SHALL include product title, theme toggle, settings access, All / Favorites / Recent / Hidden / Empty tabs matching the Netflix mega menu, search, optional experimental promotion, and the selected tab's list.

#### Scenario: Fresh install shows real categories

- **WHEN** a user opens the popup after installing a production build
- **THEN** a hierarchical All Categories list from the bundled dataset is visible without extra setup

### Requirement: UI SHALL look like a deliberate product

The popup SHALL offer Light and Dark themes. Dark SHALL use elevated warm charcoal surfaces, not pitch black. The chosen theme SHALL persist locally and apply to the popup, Options, and Netflix mega menu. Type SHALL use bundled Figtree (no remote font stylesheet). Category codes SHALL use tabular numerals where useful. Lucide React icons SHALL be used; emoji MUST NOT be core interface icons. The popup document SHALL be sized to the content width (about 440px) so Chrome does not show empty space beside the UI.

#### Scenario: No remote font request

- **WHEN** the popup loads
- **THEN** UI text uses bundled/local fonts and no remote font stylesheet is requested

#### Scenario: Theme toggle switches appearance

- **WHEN** the user selects Light in the popup
- **THEN** the popup uses the light palette and that choice is restored on the next open

### Requirement: Empty categories SHALL move to an Empty tab

When a category opened through this extension shows Netflix's empty-state copy on `/browse/genre/<code>` (for example "No matching titles found" or "No titles found") after the page has settled, that category SHALL move out of All, Favorites, Recent, and Hidden into an Empty tab in both the popup and the mega menu. Presence of title links SHALL unmark it. Users SHALL be able to restore one or all. Detection MUST NOT scrape titles, cookies, or private APIs.

#### Scenario: Opening an empty genre moves it to Empty

- **WHEN** the user opens a category and Netflix shows no matching titles for that genre page
- **THEN** the category disappears from All and appears in the Empty tab

#### Scenario: Restore returns an empty category to the list

- **WHEN** the user restores a category from Empty
- **THEN** it reappears in All (and Favorites if it was still favorited)

### Requirement: Category rows SHALL expose icon open actions plus Favorite

Each category row SHALL include icon controls to open that Netflix category in the current tab or a new tab, with visible tooltips and accessible names. The category name SHALL NOT be the primary open control. If the row has children, activating the name or chevron SHALL expand or collapse that group. A direct Favorite control SHALL be present. Overflow MAY include Hide, Copy code, and Copy URL.

#### Scenario: Current-tab icon opens the category in the current Netflix tab

- **WHEN** the user activates the current-tab icon on a category row
- **THEN** the extension opens `https://www.netflix.com/browse/genre/<code>` in the current/reused Netflix tab

#### Scenario: New-tab icon opens the category in a new tab

- **WHEN** the user activates the new-tab icon on a category row
- **THEN** the extension opens that URL in a new tab

#### Scenario: Name click expands a parent row

- **WHEN** a category has children and the user activates the name area
- **THEN** the child list expands or collapses the same as the chevron

### Requirement: Experimental promotion SHALL be dismissible on fresh install

A compact dismissible card SHALL promote the experimental Netflix header menu on fresh install. Try SHALL start the permission flow. Dismiss SHALL persist until settings reset and MUST NOT nag repeatedly. The card SHALL NOT appear when the experimental menu is already enabled. The feature SHALL remain available in Options.

#### Scenario: Dismiss hides the card permanently

- **WHEN** the user dismisses the experimental card
- **THEN** later popup opens do not show the card unless settings are reset

### Requirement: Popup SHALL be keyboard accessible

Search and lists SHALL support keyboard navigation, visible focus, semantic buttons and inputs, ARIA labels, sufficient contrast, Escape support, and accessible names for icon-only controls. Reduced-motion preferences SHALL be honored.

#### Scenario: Keyboard opens a search result

- **WHEN** the user types a query, moves to a result with arrow keys, and presses Enter
- **THEN** the selected category opens and focus behavior remains usable
