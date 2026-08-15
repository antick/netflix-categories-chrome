## ADDED Requirements

### Requirement: Required permissions SHALL stay minimal

Core permissions SHALL be limited to what implementation actually needs, expected to be `storage` and `activeTab`. Optional permissions SHALL be `scripting` and host `https://www.netflix.com/*` for the experimental header only. The extension MUST NOT request `<all_urls>`, `cookies`, `history`, or `webRequest` unless an implemented requirement makes one unavoidable, in which case documentation MUST explain why.

#### Scenario: Fresh install does not have Netflix host access

- **WHEN** the extension is installed and experimental menu is off
- **THEN** Netflix host permission has not been granted

### Requirement: The extension SHALL not collect or transmit personal data

There SHALL be no backend, analytics, or telemetry. The extension MUST NOT collect personal data, Netflix credentials, account data, cookies, viewing history, or browser history. Only Favorites, Hidden, Recent, Empty, extension selections, and settings SHALL be stored locally. User-initiated export SHALL write that same local state to a JSON file on disk. Import SHALL read a local file chosen by the user. Neither action SHALL upload settings.

#### Scenario: Privacy statement matches behavior

- **WHEN** a reviewer inspects network activity during popup use
- **THEN** the extension does not transmit personal or Netflix account data

### Requirement: Extension code SHALL be bundled locally with no remote execution

The extension MUST NOT use remote JS, CDN React/Tailwind/icons, `eval`, downloaded executable modules, or remote configuration that acts as executable code. All runtime code SHALL be bundled locally.

#### Scenario: Built ZIP contains no remote script tags

- **WHEN** the production ZIP is inspected
- **THEN** it contains no remote executable script sources and no `.env` secrets
