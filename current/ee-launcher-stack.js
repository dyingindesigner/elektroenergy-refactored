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
  var BULK_CLEAR_PX = 56;
  var reorderTimer = null;

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
    var b = BULK_CLEAR_PX;
    var css =
      "\n#" +
      STACK_ID +
      "{position:fixed;left:14px;bottom:calc(" +
      b +
      "px + max(12px, env(safe-area-inset-bottom, 0px)));display:flex;flex-direction:column;align-items:stretch;gap:10px;z-index:1320;width:min(calc(100vw - 28px), 320px);box-sizing:border-box;pointer-events:none}" +
      "\n#" +
      STACK_ID +
      " > *{pointer-events:auto}" +
      "\n#" +
      STACK_ID +
      " > #ee-favorites-root, #" +
      STACK_ID +
      " > #ee-lists-root, #" +
      STACK_ID +
      " > #ee-skuqa-root{position:static !important;left:auto !important;right:auto !important;top:auto !important;bottom:auto !important;z-index:auto !important;width:100% !important;margin:0 !important;display:flex !important;flex-direction:column !important;align-items:stretch !important;gap:8px;box-sizing:border-box}" +
      "\n#" +
      STACK_ID +
      " #ee-favorites-fab, #" +
      STACK_ID +
      " #ee-lists-fab, #" +
      STACK_ID +
      " #ee-skuqa-btn{box-sizing:border-box;width:100%;justify-content:center}";
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function reorder() {
    var host = document.getElementById(STACK_ID);
    if (!host) return;
    var ids = ["ee-lists-root", "ee-skuqa-root", "ee-favorites-root"];
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
    }, 0);
  }

  ensureHost();
  ensureStyle();
  scheduleReorder();

  window.EE_LAUNCHER_STACK = {
    version: "2026-04-25-launcher-v1",
    STACK_ID: STACK_ID,
    ensureHost: ensureHost,
    ensureStyle: ensureStyle,
    reorder: reorder,
    scheduleReorder: scheduleReorder,
  };
})();
