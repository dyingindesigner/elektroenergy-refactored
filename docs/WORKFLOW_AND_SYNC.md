# Workflow and Sync Policy

## Canonical development path

Chosen path: **Option B** from backlog.

- Edit scripts in local mirror:
  - `scratch/elektroenergy-scripts-local/current`
- Validate locally (syntax/lint/manual QA).
- Sync/deploy selected files to source repositories.

## Utility

Use:

- `tools/sync-scripts.ps1 -Action pull`
- `tools/sync-scripts.ps1 -Action diff`
- `tools/sync-scripts.ps1 -Action hash -WriteManifest`

## Deploy policy

- Keep old versions in archive before each release.
- Update `manifest.json` after pull/hash cycle.
- Publish only selected script files; avoid unrelated drift.
