## ADDED Requirements

### Requirement: Experimental header menu SHALL ship off by default

The experimental Netflix header integration SHALL be part of this release and MUST default to OFF. The user MUST explicitly enable it. Helper text SHALL explain that the menu may stop working when Netflix updates its interface. The feature MUST NOT be presented as dangerous and MUST NOT show legal warnings in the popup.

#### Scenario: Fresh install does not inject into Netflix

- **WHEN** the extension is installed and the user visits Netflix without enabling the feature
- **THEN** no Categories header item or mega menu is injected

### Requirement: Enabling SHALL request optional permissions then inject

When enabled, the extension SHALL briefly explain the site permission, request required optional permission(s) including Netflix host access (`https://www.netflix.com/*`) and scripting if needed, then save enabled state and inject the menu if accepted. If rejected, the setting SHALL stay OFF, a concise explanation SHALL be shown, and the popup SHALL remain fully functional. When disabled, future injection SHALL stop, injected UI SHALL be removed where practical, runtime scripts SHALL unregister if applicable, and host permission MAY be released if cleanly supported.

#### Scenario: Permission granted injects Categories

- **WHEN** the user enables the feature and accepts Netflix permission, then loads a Netflix browse page with a header
- **THEN** a Hidden Categories item appears in the top navigation without removing Netflix items

#### Scenario: Permission denied keeps popup working

- **WHEN** the user rejects the optional Netflix permission
- **THEN** the experimental setting stays OFF and popup category browsing still works

### Requirement: Content script SHALL be narrowly scoped

The Netflix content script MAY locate navigation, mount extension-owned Categories UI, open/close the mega menu, read extension local storage, navigate to `/browse/genre/<CODE>`, observe navigation/header remounts, and clean itself up. It MUST NOT read Netflix cookies, credentials, or account data; call private APIs; inspect internal app state; scrape titles; alter playback, DRM, geo, household, or subscription behavior.

#### Scenario: Content script does not read cookies

- **WHEN** the experimental menu is enabled on Netflix
- **THEN** the extension does not read Netflix cookies or account data

### Requirement: Injected UI SHALL use Shadow DOM and a Netflix DOM adapter

Injected UI SHALL use WXT’s current Shadow DOM approach to isolate styles, prevent Tailwind from styling Netflix globally, and prevent Netflix CSS from breaking extension UI. Host sizing SHALL use predictable CSS if page `rem` is unreliable. All Netflix selectors and mounting rules SHALL live in `lib/netflix-dom.ts` (or current equivalent). Mounting SHALL fail gracefully, never create duplicates, avoid aggressive polling, use a narrowly scoped MutationObserver, and clean up the observer.

#### Scenario: Duplicate Categories buttons are not created

- **WHEN** Netflix rerenders the header while the feature is enabled
- **THEN** exactly one Categories control is present

### Requirement: Injected UI SHALL survive SPA navigation where appropriate

The script SHALL remount exactly once when the injected host disappears, avoid duplicate observers and buttons, and stop work when disabled. It SHALL mount only where a Netflix header/navigation is appropriate (for example browse), not on playback or other states where the main nav is absent.

#### Scenario: Browse navigation remounts once

- **WHEN** the user client-side navigates between Netflix browse routes with the feature enabled
- **THEN** Categories remains available without duplicate buttons

### Requirement: Mega menu SHALL reuse shared search and library sections

The Hidden Categories control SHALL be accessible, keyboard-capable, use `aria-expanded`, close on outside click and Escape, and restore focus. The label SHALL be "Hidden Categories" and visually distinct from Netflix's own nav (bold and accent color) with spacing from Search. The mega menu SHALL open aligned to that control (typically under it on the right), include All, Favorites, Recent, and Hidden, use the shared search engine, clamp to the viewport, scroll internally, and avoid page-level horizontal overflow. Suggested size is about 440px wide and `max-height: min(72vh, 640px)`. Injected UI MUST stay dark with readable light text regardless of OS color scheme.

#### Scenario: Escape closes an empty-search menu

- **WHEN** the mega menu is open with an empty query and the user presses Escape
- **THEN** the menu closes and focus returns to the Categories control

### Requirement: Header attachment failure SHALL not break Netflix

If Netflix changes its header, the extension SHALL fail quietly with no uncaught exceptions, infinite observer loops, or broken placeholders. The popup SHALL stay usable. Options MAY report that the menu could not attach to the current Netflix layout.

#### Scenario: Missing header fails closed

- **WHEN** the Netflix header cannot be found
- **THEN** Netflix remains usable and no broken Categories placeholder is shown
