# EE New Features Release (2026-04-23)

This release adds three new mobile-first features as separate scripts (no edits to existing production scripts):

1. Saved shopping lists
2. SKU quick-add bar
3. Favorites for logged-in users

## New Scripts

- `current/ee-features-sync.js`
- `current/ee-launcher-stack.js` (shared FAB column layout; load before the three feature scripts)
- `current/ee-favorites.js`
- `current/ee-saved-lists.js`
- `current/ee-sku-quick-add.js`

## Supabase Isolation

Analytics tables were not modified.

Feature sync uses separate tables:

- `public.ee_features_favorites`
- `public.ee_features_saved_lists`
- `public.ee_features_saved_list_items`

RLS is enabled on all three with row filtering by:

- request header `x-site-key`
- request header `x-owner-hash`

## Script Include Order

Add these tags in `<head>` (after `ee-core.js` is loaded):

```html
<script defer src="https://cdn.jsdelivr.net/gh/dyingindesigner/elektroenergy-refactored@main/current/ee-features-sync.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/dyingindesigner/elektroenergy-refactored@main/current/ee-launcher-stack.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/dyingindesigner/elektroenergy-refactored@main/current/ee-saved-lists.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/dyingindesigner/elektroenergy-refactored@main/current/ee-sku-quick-add.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/dyingindesigner/elektroenergy-refactored@main/current/ee-favorites.js"></script>
```

## UI Placement Rules

- Desktop:
  - Favorites launcher: left bottom stack
  - Saved lists launcher: above favorites
  - SKU quick-add launcher: above saved lists, intentionally above Bulk area
- Mobile:
  - launchers remain compact
  - opened panel is bottom-sheet
  - when one feature panel opens, other launchers auto-hide to avoid overlap

## Tested Evidence (Playwright)

Post-fix screenshots:

- `scratch/screenshots/pw-ee-features-fix-desktop-favorites-open.png`
- `scratch/screenshots/pw-ee-features-fix-desktop-saved-lists-open.png`
- `scratch/screenshots/pw-ee-features-fix-desktop-sku-panel-open.png`
- `scratch/screenshots/pw-ee-features-fix-mobile-favorites-open.png`
- `scratch/screenshots/pw-ee-features-fix-mobile-saved-lists-open.png`
- `scratch/screenshots/pw-ee-features-fix-mobile-sku-panel-open.png`

## What to Watch During Manual QA

Use this simple checklist while testing:

1. Login state:
   - features appear only for logged-in users
2. Favorites:
   - heart toggle changes state
   - count in launcher updates
   - item appears in favorites drawer
3. Saved lists:
   - save list from SKU lines
   - list row appears with correct item count
   - "Do košíka" action inserts expected quantities
4. SKU quick-add:
   - input format `SKU,qty` works
   - status log reports `Pridané: X | Chyby: Y`
5. Mobile overlap:
   - open favorites, verify lists/sku launchers hide
   - open lists, verify favorites/sku launchers hide
   - open sku, verify favorites/lists launchers hide
6. Sync fallback:
   - if sync temporarily fails, UI still works from local storage

## Known Non-blocking Note

`functions/v1/collect` telemetry calls may occasionally show aborted network requests in browser logs. This is unrelated to new favorites/lists persistence, which was verified as successful in the post-fix pass.
