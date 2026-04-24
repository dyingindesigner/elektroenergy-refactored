/**
 * Shared floating launcher column for EE feature scripts (lists, SKU+, favorites).
 * Load BEFORE ee-saved-lists.js, ee-sku-quick-add.js, ee-favorites.js so layout is single-source.
 */
(function () {
  "use strict";

  if (window.__EE_LAUNCHER_STACK_BOOTED__) return;
  window.__EE_LAUNCHER_STACK_BOOTED__ = true;

  var STACK_ID = "ee-feature-launchers";
  var STYLE_ID = "ee-launcher-stack-style";
  /** Clearance above the bulk FAB (px); paired with shoptet-bulk-cart syncFloatingClearance. */
  var BULK_CLEAR_PX = 88;
  var reorderTimer = null;
  var relayoutTimer = null;

  function emitLauncherRelayout() {
    try {
      document.dispatchEvent(new CustomEvent("ee-launcher-relayout", { bubbles: false }));
    } catch (_e) {}
  }

  function scheduleRelayoutEmit() {
    if (relayoutTimer) clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(function () {
      relayoutTimer = null;
      emitLauncherRelayout();
    }, 40);
  }

  function ensureHost() {
    var host = document.getElementById(STACK_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = STACK_ID;
      document.body.appendChild(host);
    }
    return host;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      "\n#" +
      STACK_ID +
      "{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom, 0px));display:flex;flex-direction:row;align-items:stretch;gap:6px;z-index:1320;width:min(calc(100vw - 28px), 860px);padding:6px;border-radius:14px;background:rgba(255,255,255,.97);border:1px solid rgba(203,213,225,.95);box-shadow:0 10px 24px rgba(15,23,42,.16);backdrop-filter:blur(6px);box-sizing:border-box;pointer-events:none}" +
      "\n#" +
      STACK_ID +
      " > *{pointer-events:auto}" +
      "\n#" +
      STACK_ID +
      " > #ee-favorites-root, #" +
      STACK_ID +
      " > #ee-lists-root, #" +
      STACK_ID +
      " > #ee-skuqa-root, #" +
      STACK_ID +
      " > #shoptet-bulk-entry-host{position:static !important;left:auto !important;right:auto !important;top:auto !important;bottom:auto !important;z-index:auto !important;width:100% !important;margin:0 !important;display:flex !important;flex-direction:column !important;align-items:stretch !important;gap:8px;box-sizing:border-box;flex:1 1 0;min-width:0}" +
      "\n#" +
      STACK_ID +
      " #ee-favorites-fab, #" +
      STACK_ID +
      " #ee-lists-fab, #" +
      STACK_ID +
      " #ee-skuqa-btn, #" +
      STACK_ID +
      " #shoptet-bulk-cart-fab{box-sizing:border-box;width:100%;height:34px;min-width:0;padding:0 20px 0 10px;font-size:12px;font-weight:700;border-radius:10px;box-shadow:none;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:6px;line-height:1;white-space:nowrap;text-overflow:ellipsis}" +
      "\n@media (max-width:980px){#" +
      STACK_ID +
      "{left:8px;right:8px;transform:none;bottom:calc(10px + env(safe-area-inset-bottom, 0px));width:auto;max-width:none;flex-direction:row;align-items:stretch;gap:6px;padding:6px;border-radius:14px;background:rgba(255,255,255,.97);border:1px solid rgba(203,213,225,.95);box-shadow:0 10px 24px rgba(15,23,42,.16);backdrop-filter:blur(6px)}#" +
      STACK_ID +
      " > #ee-favorites-root, #" +
      STACK_ID +
      " > #ee-lists-root, #" +
      STACK_ID +
      " > #ee-skuqa-root, #" +
      STACK_ID +
      " > #shoptet-bulk-entry-host{flex:1 1 0;min-width:0}#" +
      STACK_ID +
      " #ee-favorites-fab, #" +
      STACK_ID +
      " #ee-lists-fab, #" +
      STACK_ID +
      " #ee-skuqa-btn, #" +
      STACK_ID +
      " #shoptet-bulk-cart-fab{height:32px;min-width:0;padding:0 20px 0 8px;font-size:10.5px;font-weight:700;border-radius:10px;gap:4px}" +
      "\n#" +
      STACK_ID +
      " .ee-dock-icon{display:inline-flex;align-items:center;justify-content:center;line-height:1;font-size:12px;flex:0 0 auto;transform:translateY(-.5px)}" +
      "\n#" +
      STACK_ID +
      " .ee-dock-label{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}" +
      "\n#" +
      STACK_ID +
      " #ee-favorites-fab .ee-count, #" +
      STACK_ID +
      " #shoptet-bulk-cart-fab .bulk-badge{position:absolute;top:2px;right:3px;display:inline-flex;align-items:center;justify-content:center;min-width:14px;height:14px;padding:0 3px;font-size:9px;line-height:1;border-radius:999px;z-index:1;margin-left:0;vertical-align:baseline}" +
      "\n#" +
      STACK_ID +
      " > #ee-favorites-root:not(.open) #ee-favorites-drawer, #" +
      STACK_ID +
      " > #ee-favorites-root:not(.open) .ee-overlay, #" +
      STACK_ID +
      " > #ee-lists-root:not(.open) #ee-lists-panel, #" +
      STACK_ID +
      " > #ee-lists-root:not(.open) .ee-overlay, #" +
      STACK_ID +
      " > #ee-skuqa-root:not(.open) #ee-skuqa-panel, #" +
      STACK_ID +
      " > #ee-skuqa-root:not(.open) .ee-overlay{display:none !important}" +
      "\n#" +
      STACK_ID +
      " > #ee-favorites-root.open #ee-favorites-drawer{display:flex !important}" +
      "\n#" +
      STACK_ID +
      " > #ee-lists-root.open #ee-lists-panel{display:flex !important}" +
      "\n#" +
      STACK_ID +
      " > #ee-skuqa-root.open #ee-skuqa-panel{display:grid !important}" +
      "\n#" +
      STACK_ID +
      " > #ee-favorites-root.open .ee-overlay, #" +
      STACK_ID +
      " > #ee-lists-root.open .ee-overlay, #" +
      STACK_ID +
      " > #ee-skuqa-root.open .ee-overlay{display:block !important}}";
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function reorder() {
    var host = document.getElementById(STACK_ID);
    if (!host) return;
    var ids = ["ee-lists-root", "ee-skuqa-root", "ee-favorites-root", "shoptet-bulk-entry-host"];
    for (var i = 0; i < ids.length; i++) {
      var n = document.getElementById(ids[i]);
      if (n && n.parentNode === host) host.appendChild(n);
    }
  }

  function scheduleReorder() {
    if (reorderTimer) clearTimeout(reorderTimer);
    reorderTimer = setTimeout(function () {
      reorderTimer = null;
      reorder();
      scheduleRelayoutEmit();
    }, 0);
  }

  function setupStackResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;
    var host = document.getElementById(STACK_ID);
    if (!host || host.__eeLauncherResizeObs) return;
    var ro = new ResizeObserver(function () {
      scheduleRelayoutEmit();
    });
    ro.observe(host);
    host.__eeLauncherResizeObs = ro;
  }

  ensureHost();
  ensureStyle();
  scheduleReorder();
  setupStackResizeObserver();

  window.EE_LAUNCHER_STACK = {
    version: "2026-04-25-launcher-v6",
    STACK_ID: STACK_ID,
    ensureHost: ensureHost,
    ensureStyle: ensureStyle,
    reorder: reorder,
    scheduleReorder: scheduleReorder,
  };
})();
