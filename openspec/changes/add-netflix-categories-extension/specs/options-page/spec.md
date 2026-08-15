## ADDED Requirements

### Requirement: Options SHALL expose experimental toggle and data resets

The Options page SHALL include:

- Appearance: Light and Dark theme controls
- Experimental: toggle for Hidden Categories in the Netflix header, with the Experimental heading visually distinct (accent/red), an explanation of what it does, that it requires Netflix site permission, and that Netflix UI changes can break it
- Data: Clear Recent, Clear Favorites, Restore All Hidden Categories, and Reset All Settings, each with visible success or failure feedback

Options SHALL stay simple. Open-in-tab vs current-tab SHALL be chosen per category row in the popup and mega menu, not as a global Options setting. The experimental feature SHALL remain available here even after the popup promotion is dismissed.

#### Scenario: Restore All Hidden clears hidden IDs

- **WHEN** a user has hidden categories and clicks Restore All Hidden Categories
- **THEN** those categories reappear in normal browsing and Options shows confirmation

#### Scenario: Data actions report completion

- **WHEN** the user clicks Clear Recent, Clear Favorites, Restore All Hidden Categories, or Reset All Settings
- **THEN** the preference change is saved and a confirmation message is shown

#### Scenario: Experimental toggle denied permission stays off

- **WHEN** the user enables the experimental toggle and denies Netflix permission
- **THEN** the setting remains OFF and the popup continues to work
