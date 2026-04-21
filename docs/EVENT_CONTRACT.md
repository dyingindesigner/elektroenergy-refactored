# Electroenergy Scripts Event Contract

## Inputs (from Shoptet/runtime)

- `ShoptetDOMPageContentLoaded`: primary page re-render hook.
- `ShoptetCartUpdated`: cart state changed.
- `ShoptetDataLayerUpdated`: data layer refresh.
- Route changes: `popstate`, `hashchange`, `pushState`, `replaceState` (via `EE_CORE.routeChanged`).

## Script listeners

- `b2b-silent-cart-popup.js`
  - listens: `ShoptetDOMPageContentLoaded`, `ShoptetDataLayerUpdated`, `load`
  - output: none (UI close actions only)

- `b2b-ee.js`
  - listens: `ShoptetDOMPageContentLoaded`, `ShoptetCartUpdated`, `ShoptetDOMAdvancedOrderLoaded`, `ShoptetCartRecalculated`, `load`
  - output: none (price text rendering only)

- `productarrows.js`
  - listens: `ShoptetDOMPageContentLoaded`, `ShoptetDOMSearchResultsLoaded`, `ShoptetDataLayerUpdated`, `ShoptetDOMCartLoaded`, `ShoptetCartUpdated`, `load`
  - output: none

- `badge-ee.js`
  - listens: `ShoptetCartUpdated`, `ShoptetDataLayerUpdated`, `ShoptetDOMCartLoaded`, `ShoptetDOMPageContentLoaded`, `ShoptetDOMSearchResultsLoaded`, `shoptet.cart.updated`, `resize`
  - output: `aria-live` badge counter updates

- `elektroanalytics.js`
  - listens: click/pointer/keyboard/visibility lifecycle + route changes
  - output: analytics payload batches to configured endpoint

- `checkout-notice.js`
  - listens: checkout subtree mutations and initial DOM ready
  - output: single-instance checkout banner mount/unmount

- `atypical-shipping-notice.js`
  - listens: initial DOM + `ShoptetDOMPageContentLoaded`, `ShoptetDOMCartLoaded`, `ShoptetCartUpdated`
  - output: single-instance PDP/cart notice banners

## Rules

- Do not add full-document attribute observers for long-lived scripts.
- Prefer debounced handlers from `EE_CORE`.
- Keep listeners idempotent (safe on repeated event emission).
