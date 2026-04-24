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
  var reorderTimer = null;
  var relayoutTimer = null;
  var proxySyncTimer = null;
  var proxyMutationObserver = null;
  var SLOT_CLASS = "ee-launcher-slot";
  var PROXY_BTN_CLASS = "ee-launcher-proxy-btn";
  var SOURCE_BUTTON_IDS = ["ee-lists-fab", "ee-skuqa-btn", "ee-favorites-fab", "shoptet-bulk-cart-fab"];
  var SLOT_ORDER = [
    { slot: "lists", sourceId: "ee-lists-fab" },
    { slot: "sku", sourceId: "ee-skuqa-btn" },
    { slot: "fav", sourceId: "ee-favorites-fab" },
    { slot: "bulk", sourceId: "shoptet-bulk-cart-fab" },
  ];

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
      " > ." +
      SLOT_CLASS +
      "{flex:1 1 0;min-width:0;display:flex;align-items:stretch}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      "{box-sizing:border-box;width:100%;height:34px;min-width:0;padding:0 20px 0 10px;border-radius:10px;border:none;box-shadow:none;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:6px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:12px;font-weight:700;line-height:1.1;letter-spacing:0;white-space:nowrap;text-overflow:ellipsis;cursor:pointer}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      "[disabled]{opacity:.55;cursor:default}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      ".ee-theme-lists{background:#0f766e;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      ".ee-theme-sku{background:#1d4ed8;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      ".ee-theme-fav{background:#0f172a;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      ".ee-theme-bulk{background:#111827;color:#fff}" +
      "\n#" +
      STACK_ID +
      " #" +
      SOURCE_BUTTON_IDS.join(", #" + STACK_ID + " #") +
      "{display:none !important}" +
      "\n#" +
      STACK_ID +
      " .ee-dock-icon{display:inline-flex;align-items:center;justify-content:center;line-height:1;font-size:12px;flex:0 0 auto;transform:translateY(-.5px)}" +
      "\n#" +
      STACK_ID +
      " .ee-dock-label{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}" +
      "\n#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      " .ee-count, #" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      " .bulk-badge{position:absolute;top:2px;right:3px;display:grid;place-items:center;min-width:16px;height:16px;padding:0 4px;font-size:9px;font-weight:700;line-height:16px;font-family:inherit;font-variant-numeric:tabular-nums;white-space:nowrap;text-align:center;border-radius:999px;z-index:1;margin:0;vertical-align:baseline;box-sizing:border-box}" +
      "\n#" +
      STACK_ID +
      " #ee-favorites-fab, #" +
      STACK_ID +
      " #ee-lists-fab, #" +
      STACK_ID +
      " #ee-skuqa-btn, #" +
      STACK_ID +
      " #shoptet-bulk-cart-fab{box-sizing:border-box;width:100%;height:34px;min-width:0;padding:0 20px 0 10px;border-radius:10px;box-shadow:none;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:6px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:12px;font-weight:700;line-height:1.1;letter-spacing:0;white-space:nowrap;text-overflow:ellipsis}" +
      "\n@media (max-width:980px){#" +
      STACK_ID +
      "{left:8px;right:8px;transform:none;bottom:calc(10px + env(safe-area-inset-bottom, 0px));width:auto;max-width:none;flex-direction:row;align-items:stretch;gap:6px;padding:6px;border-radius:14px;background:rgba(255,255,255,.97);border:1px solid rgba(203,213,225,.95);box-shadow:0 10px 24px rgba(15,23,42,.16);backdrop-filter:blur(6px)}#" +
      STACK_ID +
      " > ." +
      SLOT_CLASS +
      "{flex:1 1 0;min-width:0}#" +
      STACK_ID +
      " ." +
      PROXY_BTN_CLASS +
      "{height:32px;min-width:0;padding:0 20px 0 8px;border-radius:10px;gap:4px;font-size:10.5px;font-weight:700;line-height:1.1;letter-spacing:0}" +
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
    ensureProxySlots(host);
    syncProxyButtons();
  }

  function themeClassForSource(sourceId) {
    if (sourceId === "ee-lists-fab") return "ee-theme-lists";
    if (sourceId === "ee-skuqa-btn") return "ee-theme-sku";
    if (sourceId === "ee-favorites-fab") return "ee-theme-fav";
    return "ee-theme-bulk";
  }

  function ensureProxySlots(host) {
    for (var i = 0; i < SLOT_ORDER.length; i++) {
      var cfg = SLOT_ORDER[i];
      var slotId = STACK_ID + "-slot-" + cfg.slot;
      var slot = document.getElementById(slotId);
      if (!slot) {
        slot = document.createElement("div");
        slot.id = slotId;
        slot.className = SLOT_CLASS;
        slot.dataset.eeLauncherSource = cfg.sourceId;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = PROXY_BTN_CLASS + " " + themeClassForSource(cfg.sourceId);
        btn.dataset.eeLauncherSource = cfg.sourceId;
        btn.disabled = true;
        slot.appendChild(btn);
        host.insertBefore(slot, host.firstChild);
      }
    }
  }

  function syncOneProxy(cfg) {
    var slot = document.getElementById(STACK_ID + "-slot-" + cfg.slot);
    if (!slot) return;
    var proxy = slot.querySelector("." + PROXY_BTN_CLASS);
    if (!proxy) return;
    var source = document.getElementById(cfg.sourceId);
    if (!source) {
      slot.style.display = "none";
      proxy.disabled = true;
      return;
    }
    slot.style.display = "";
    proxy.disabled = false;
    if (proxy.innerHTML !== source.innerHTML) proxy.innerHTML = source.innerHTML;
    var expanded = source.getAttribute("aria-expanded");
    if (expanded != null) proxy.setAttribute("aria-expanded", expanded);
    proxy.onclick = function () {
      try {
        source.click();
      } catch (_e) {}
      setTimeout(syncProxyButtons, 60);
    };
  }

  function syncProxyButtons() {
    for (var i = 0; i < SLOT_ORDER.length; i++) syncOneProxy(SLOT_ORDER[i]);
  }

  function setupProxyObservers() {
    if (proxySyncTimer) return;
    proxySyncTimer = setInterval(syncProxyButtons, 450);
    if (typeof MutationObserver !== "undefined" && !proxyMutationObserver) {
      proxyMutationObserver = new MutationObserver(function () {
        syncProxyButtons();
      });
      proxyMutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["aria-expanded", "style", "class"],
      });
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
  setupProxyObservers();

  window.EE_LAUNCHER_STACK = {
    version: "2026-04-25-launcher-v8",
    STACK_ID: STACK_ID,
    ensureHost: ensureHost,
    ensureStyle: ensureStyle,
    reorder: reorder,
    scheduleReorder: scheduleReorder,
  };
})();
