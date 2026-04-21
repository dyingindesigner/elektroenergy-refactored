# Elektroenergy Scripts Modernization Backlog

Last updated: 2026-04-21  
Scope: GitHub-hosted Electroenergy scripts only (no Google tags)

## Completion status (2026-04-21)

- Backlog implementation: COMPLETE
- Source mirror + archive backup: COMPLETE
- Shared core + script refactors (Wave 1-4): COMPLETE
- QA matrix + regression report: COMPLETE (`docs/QA_MATRIX_REPORT_2026-04-21.md`)
- Release notes: COMPLETE (`docs/RELEASE_NOTES_2026-04-21.md`)
- Event contract documentation: COMPLETE (`docs/EVENT_CONTRACT.md`)
- Workflow/sync policy + utility: COMPLETE (`docs/WORKFLOW_AND_SYNC.md`, `tools/sync-scripts.ps1`)

## 0) Delivery Goal

Bring all custom scripts to a consistent production standard across:
- correctness and edge-case handling,
- UI/UX quality across breakpoints,
- runtime performance under dynamic Shoptet DOM updates,
- maintainability and predictable rollout safety.

Important project note:
- VAT is currently fixed at 23% for all products.
- We still implement VAT as a configurable setting for future-proofing.

---

## 1) Source-of-truth and repository hygiene

### 1.1 Local source mirror (DONE)
- Created local script mirror:
  - `scratch/elektroenergy-scripts-local/current`
- Downloaded all currently deployed GitHub scripts into this folder.
- Created hash manifest:
  - `scratch/elektroenergy-scripts-local/manifest.json`
- Archived old local root bulk file:
  - `scratch/elektroenergy-scripts-local/archive/2026-04-21_1149/shoptet-bulk-cart-snippet.js`

### 1.2 Next hygiene tasks
- Decide canonical development path:
  - Option A: edit directly in source repos (`lightee-scripts`, `shoptet-bulk-order-cdn`)
  - Option B: edit in local mirror + sync script to repo roots
- Add simple sync utility:
  - pull latest from CDN/repo
  - diff local edits
  - push selected files

Acceptance criteria:
- Every modified production script has a local twin in `current`.
- `manifest.json` is updated after each sync/deploy cycle.

---

## 2) Program-level architecture refactor

Priority: P0 (must do first, enables safe changes everywhere)

## 2.1 Shared utility module (`ee-core`)

Create shared utilities for common logic now duplicated across scripts:
- `getCustomerState()`
- `isB2BCustomer()`
- `getCartFromDataLayer()`
- `scheduleOnce(id, fn, delay)`
- `createScopedObserver({root, options, onMutate, autoDisconnectWhen})`
- `routeChanged()` helper

Target scripts to consume this:
- `b2b-silent-cart-popup.js`
- `b2b-ee.js`
- `productarrows.js`
- `badge-ee.js`
- `elektroanalytics.js`

Acceptance criteria:
- No script reimplements customer/cart parsing.
- One canonical B2B decision used across all B2B scripts.

## 2.2 Event governance

Define a small event contract:
- Inputs:
  - `ShoptetDOMPageContentLoaded`
  - `ShoptetCartUpdated`
  - `ShoptetDataLayerUpdated`
  - route changes
- Outputs:
  - custom app events only when needed (documented)

Acceptance criteria:
- Each script declares what it listens to.
- Duplicate handlers removed.

---

## 3) Script-specific backlog

## 3.1 `b2b-silent-cart-popup.js`

### Functional tasks
- Replace fixed interval polling with event-first + bounded fallback.
- Tighten popup close logic to only relevant popup subtree.
- Keep wrap idempotent even if Shoptet reassigns cart methods.

### Edge cases to handle
- cartShared methods replaced after initial wrap.
- popup appears after delayed network response.
- B2B state unavailable at first paint, later available.

### Performance tasks
- Remove full-document observer (`attributes` on whole tree).
- Observe only `#colorbox` + overlay nodes.

Acceptance criteria:
- In B2B mode popup never remains visible after add/update.
- In B2C mode behavior is unchanged.
- No observer running on whole document long-term.

---

## 3.2 `b2b-ee.js`

### Functional tasks
- Keep 23% default VAT, but expose config:
  - `window.EE_VAT_RATE = 0.23` fallback default.
- Move all price parsing to one parser function with test cases.
- Prevent repeated text churn if rendered value unchanged.

### Edge cases to handle
- prices with spaces and comma decimals (`1 234,56`)
- missing unit suffix
- delayed cart recomputation after quantity change
- pages with partial price fragments in DOM

### UX tasks
- Ensure consistent dual display labels:
  - net primary
  - gross secondary (`s DPH`)

Acceptance criteria:
- No malformed price leftovers in rendered text.
- Net/gross swap is stable under repeated DOM refreshes.

---

## 3.3 `productarrows.js`

### Functional tasks
- Add per-`priceId` action queue (last-write-wins).
- Debounce manual input commit (Enter/blur remains supported).
- Add visible error state on failed cart operation.

### Edge cases to handle
- fast repeated clicks +/- while requests in-flight
- item removed externally while editor is open
- mixed decimal step products
- duplicate `priceId` cards visible simultaneously

### UX tasks
- Disable control while single request in-flight (per item).
- Add tiny inline spinner state.
- Show normalized value message when user enters invalid step.

Acceptance criteria:
- Qty never desyncs from cart after burst interactions.
- User always gets deterministic final quantity.

---

## 3.4 `badge-ee.js`

### Functional tasks
- Convert clear-and-rebuild to diff-update strategy.
- Render only when `priceId -> qty` map changed.

### Edge cases to handle
- carousel clones / transformed product cards
- product cards loaded incrementally
- PDP and listing both present in DOM

### UX tasks
- optional `aria-live` update for accessibility
- responsive badge sizing via shared tokens

Acceptance criteria:
- No duplicate badges.
- No unnecessary DOM churn on stable cart state.

---

## 3.5 `elektroenergy-login-return-url.js`

### Functional tasks
- Add structured storage payload:
  - `url`, `ts`, `reason`, `flowId`
- Add one-time redirect guard (avoid loops on edge reloads).
- Improve fallback ordering observability via debug flag.

### Edge cases to handle
- login in one tab, navigation in another
- quick redirects by platform before script fully runs
- direct `/klient` opens while already logged in

Acceptance criteria:
- No redirect loops.
- Return target remains predictable and explainable.

---

## 3.6 `elektroenergy-account-hover-menu.js`

### Functional tasks
- Add touch-friendly mode (click-toggle) for coarse pointers.
- Add viewport collision handling (right-edge clamp).
- Replace extreme z-index with shared token scale.

### Edge cases to handle
- hybrid laptop/tablet devices
- dynamic header height changes
- trigger element re-render after lazy nav updates

### UX tasks
- keyboard navigation inside menu (arrow/esc/tab order).
- consistent open/close animation timing.

Acceptance criteria:
- Menu works on mouse, touch, keyboard.
- No overlap conflicts with modal systems.

---

## 3.7 `ee-phone.js`

### Functional tasks
- Refactor to deterministic state machine:
  - init
  - sync options
  - apply mode (retail/wholesale)
  - bind events
- Scope observer to registration form only.
- Preserve focus and selected country during re-render.

### Edge cases to handle
- form dynamically rebuilt by theme scripts
- original phone select appears late
- wholesale toggle switching repeatedly

### UX tasks
- country-based phone format hint.
- cleaner error text and invalid visual state.

Acceptance criteria:
- No focus jumps.
- No duplicated handlers.
- Correct values synced on submit every time.

---

## 3.8 `elektroanalytics.js` (excluding key exposure topic)

### Functional tasks
- Replace interval route polling with event-driven primary strategy.
- Add pageview dedupe key (`pathname+search+titleHash`).
- Add schema version in payload metadata.
- Add configurable event sampling by event type.

### Edge cases to handle
- pushState + replaceState storms
- tab hidden/visible transitions
- unload keepalive payload limits

### Data quality tasks
- include script version in every payload
- add dropped-event counter for diagnostics

Acceptance criteria:
- No duplicate pageviews on single route state.
- Heartbeat behaves only for active sessions.

---

## 3.9 `atypical-shipping-notice.js`

### Functional tasks
- Add multi-source product code resolution:
  - data attributes
  - structured data
  - URL fallback
- Improve cart line item extraction robustness by selectors map.

### Edge cases to handle
- atypical slug formats without numeric suffix
- cart rows rendered in alternate templates
- code list loading delayed or unavailable

### UX tasks
- include compact list of affected items + contact CTA button
- provide one concise message variant for mobile

Acceptance criteria:
- PDP and cart notices appear only when applicable.
- No duplicate banners after cart rerenders.

---

## 3.10 `checkout-notice.js`

### Functional tasks
- Narrow observer scope to checkout section only.
- Add idempotent mount/unmount contract.
- Convert text content to config object for localization.

### Edge cases to handle
- checkout DOM replaced after shipping method update
- notice location unavailable at first paint

Acceptance criteria:
- Banner remains single-instance and correctly positioned.
- Minimal observer overhead.

---

## 3.11 `elektroenergy-head-custom.css`

### Functional tasks
- Convert to strict CSS-only syntax (remove JS-style comments).
- Reduce `!important` usage by stronger scoped selectors.
- Introduce typography/spacing tokens and `clamp()` scale.

### Edge cases to handle
- theme updates changing header/logo classes
- mobile viewport with very small widths

Acceptance criteria:
- CSS parses cleanly with linter.
- visual behavior stable across breakpoints.

---

## 3.12 `shoptet-bulk-cart-snippet.js`

### Functional tasks
- Keep current improvements and add:
  - search stale-result guard (`searchRequestId`)
  - chunked import validation for large files
  - throttled resize handling
  - explicit render mode config (`cart-only`/`all-except-home`)

### Edge cases to handle
- very large CSV/XLSX imports
- simultaneous modal open + viewport resize/orientation change
- rapid add-to-cart actions with partial failures

### UX tasks
- keyboard navigation in search results
- progress indicator for import validation
- explicit retry/remove actions for invalid rows

Acceptance criteria:
- modal remains stable on all target breakpoints
- no stale search results rendered out-of-order
- import UX remains responsive on large files

---

## 4) QA and test plan

## 4.1 Device matrix
- Desktop: 1920x1080, 1366x768, 1024x768
- Tablet: 834x1112, 768x1024
- Mobile: 430x932, 390x844

## 4.2 User matrix
- Guest
- Logged-in B2C
- Logged-in B2B

## 4.3 Page matrix
- Home
- Category listing
- Product detail
- Cart
- Checkout
- Login
- Client account

## 4.4 Regression checklist (minimum)
- add/update/remove cart operations
- login/logout return flow
- account menu behavior desktop/touch
- phone registration field retail/wholesale
- atypical shipping notices PDP/cart
- checkout shipping notice single-instance
- bulk ordering full flow including import and invalid codes

---

## 5) Rollout strategy

## Wave 1 (low-risk infra refactor)
- Shared utils extraction
- Observer scope reductions
- Init/event dedupe

## Wave 2 (behavioral improvements)
- productarrows queueing
- b2b-ee rendering stabilization
- badge diff rendering

## Wave 3 (UX + heavy features)
- ee-phone state machine
- bulk modal advanced improvements
- account menu accessibility/touch parity

## Wave 4 (data quality polish)
- analytics dedupe and schema fields
- final cleanup and docs

Rollback policy:
- each script version tagged and deployable independently
- maintain previous known-good tag for quick revert

---

## 6) Execution order for implementation (when coding starts)

1. Implement `ee-core` helpers.
2. Refactor B2B trio:
   - `b2b-silent-cart-popup.js`
   - `b2b-ee.js`
   - `productarrows.js`
3. Refactor `badge-ee.js` and `checkout-notice.js`.
4. Refactor `login-return` and `account-hover-menu`.
5. Refactor `ee-phone.js`.
6. Refine `elektroanalytics.js`.
7. Final pass on `atypical-shipping-notice.js`.
8. Final pass on `shoptet-bulk-cart-snippet.js`.
9. CSS normalization pass on `elektroenergy-head-custom.css`.
10. Full matrix QA + screenshot evidence + release notes.

