# elektroenergy-refactored

Refactored Electroenergy storefront scripts with rollback-safe archive.

## Layout

- `current/` — latest refactored script versions.
- `archive/` — original pre-modernization backups.
- `docs/` — QA report, release notes, event contract, workflow policy.
- `tools/` — sync utility.
- `manifest.json` — source mapping and checksum metadata.
- `IMPLEMENTATION_BACKLOG.md` — completed modernization backlog.

## Rollback

Use files under `archive/pre-modernization-2026-04-21_121002/` as known-good fallback versions.
