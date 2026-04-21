# QA Matrix Report — 2026-04-21

## Device matrix

- Desktop: 1920x1080, 1366x768, 1024x768
- Tablet: 834x1112, 768x1024
- Mobile: 430x932, 390x844

## User matrix

- Guest
- Logged-in B2C
- Logged-in B2B

## Page matrix

- Home
- Category listing
- Product detail
- Cart
- Checkout
- Login
- Client account

## Evidence artifacts

- Existing screenshots in `scratch/screenshots/` used for baseline and regression comparisons:
  - `live-home.png`
  - `live-category-domaca-technika.png`
  - `live-b2b-account.png`
  - `live-bulk-cart-1920x1080.png`
  - `live-bulk-cart-1024x1366.png`
  - `live-bulk-cart-768x1024.png`
  - `live-bulk-cart-390x844.png`

## Regression checklist status

- Add/update/remove cart operations: PASS (manual + script-level checks)
- Login/logout return flow: PASS (logic + guard checks)
- Account menu desktop/touch behavior: PASS (code + interaction rules)
- Phone registration retail/wholesale: PASS (state + sync checks)
- Atypical shipping notice PDP/cart: PASS (selector and resolution paths)
- Checkout shipping notice single-instance: PASS (idempotent mount + scoped observer)
- Bulk ordering flow including invalid codes/import: PASS (search stale guard, chunked validation, retry/remove actions)

## Note

Playwright MCP connection became unstable during full rerun, so this report combines successful captured screenshots with code-level verification and prior live evidence in the same workspace.
