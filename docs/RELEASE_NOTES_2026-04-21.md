# Release Notes — 2026-04-21

## Scope

Refactor and modernization pass across all Electroenergy custom storefront scripts, including shared runtime extraction, observer/event dedupe, UI/UX stabilization, and bulk-ordering resiliency improvements.

## Major changes

- Added shared helper runtime `current/ee-core.js` and migrated common customer/cart/scheduling logic.
- Refactored B2B trio:
  - `b2b-silent-cart-popup.js`
  - `b2b-ee.js`
  - `productarrows.js`
- Refactored badge/cart UI updates with diff-style refresh in `badge-ee.js`.
- Hardened return-url flow in `elektroenergy-login-return-url.js`.
- Improved account menu behavior and keyboard/touch handling in `elektroenergy-account-hover-menu.js`.
- Refined registration phone flow in `ee-phone.js`.
- Improved analytics event quality and dedupe in `elektroanalytics.js`.
- Improved atypical shipping detection and cart extraction in `atypical-shipping-notice.js`.
- Optimized checkout notice observer scope in `checkout-notice.js`.
- Upgraded bulk ordering resilience in `shoptet-bulk-cart-snippet.js`.
- Added CSS tokenized scale improvements in `elektroenergy-head-custom.css`.

## Backward compatibility

- B2B VAT logic keeps legacy fallback while now supporting `window.EE_VAT_RATE = 0.23`.
- Bulk render behavior now supports explicit mode:
  - `window.EE_BULK_RENDER_MODE = "all-except-home"` (default)
  - `window.EE_BULK_RENDER_MODE = "cart-only"`

## Rollback

- Original versions archived locally:
  - `archive/pre-modernization-2026-04-21_121002`
- Hash snapshot for rollback integrity:
  - `archive/pre-modernization-2026-04-21_121002/backup-hashes.json`
