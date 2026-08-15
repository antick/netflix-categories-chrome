## ADDED Requirements

### Requirement: Options SHALL expose experimental toggle and data resets

The Options page SHALL include:

- Appearance: Light and Dark theme controls
- Experimental: toggle for Hidden Categories in the Netflix header, with the Experimental heading visually distinct (accent/red), an explanation of what it does, that it requires Netflix site permission, and that Netflix UI changes can break it
- Data: Export settings, Import settings, Clear Recent, Clear Favorites, Restore All Hidden Categories, Restore All Empty Categories, and Reset All Settings, each with visible success or failure feedback. Export SHALL download a local JSON file of the current preference state (favorites, hidden, empty, recent, theme, and other settings). Import SHALL replace the current state after confirmation, migrate unknown fields, drop unknown category IDs, and MUST NOT upload the file anywhere.

Options SHALL stay simple. Open-in-tab vs current-tab SHALL be chosen per category row in the popup and mega menu, not as a global Options setting. The experimental feature SHALL remain available here even after the popup promotion is dismissed.

#### Scenario: Export downloads current settings

- **WHEN** the user clicks Export settings
- **THEN** a JSON file of the current local preference state is downloaded and nothing is sent to a server

#### Scenario: Import replaces local settings

- **WHEN** the user confirms Import settings and selects a valid export file
- **THEN** favorites, hidden, empty, recent, theme, and other settings match that file

#### Scenario: Restore All Hidden clears hidden IDs

- **WHEN** a user has hidden categories and clicks Restore All Hidden Categories
- **THEN** those categories reappear in normal browsing and Options shows confirmation

#### Scenario: Data actions report completion

- **WHEN** the user clicks Clear Recent, Clear Favorites, Restore All Hidden Categories, Restore All Empty Categories, or Reset All Settings
- **THEN** the preference change is saved and a confirmation message is shown

#### Scenario: Experimental toggle denied permission stays off

- **WHEN** the user enables the experimental toggle and denies Netflix permission
- **THEN** the setting remains OFF and the popup continues to work
