# Specification status

The initial proposal in `changes/add-netflix-categories-extension/` records the earlier experimental design. The 2026-09-22 release review supersedes its permission and header-menu requirements for distribution:

- Only `storage` is requested; current-tab navigation does not read tab URLs.
- Header injection, its background registration, and automatic empty detection stay in source but are excluded from release output using `lib/release.ts`.
- Imports and old preferences cannot enable the integration. Historical empty markers remain restorable.
- The release UI provides no integration switch and does not advertise automatic detection.
- Project code is GPL-3.0-only; bundled dependencies retain their notices and dataset rights require separate verification.

Current release checks and remaining publication requirements are in [RELEASE_REVIEW.md](../docs/RELEASE_REVIEW.md) and [CHROME_WEB_STORE_SUBMISSION.md](../docs/CHROME_WEB_STORE_SUBMISSION.md). Do not treat completed historical proposal tasks as current release acceptance evidence.
