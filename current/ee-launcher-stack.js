/**
 * Shared launcher dock renderer.
 * Load BEFORE ee-saved-lists.js, ee-sku-quick-add.js, ee-favorites.js, shoptet-bulk-cart-snippet.js
 */
(function () {
  "use strict";

  if (window.__EE_LAUNCHER_STACK_BOOTED__) return;
  window.__EE_LAUNCHER_STACK_BOOTED__ = true;

  var STACK_ID = "ee-feature-launchers";
  var STYLE_ID = "ee-launcher-stack-style";
  var BTN_CLASS = "ee-launcher-btn";
  var SLOT_CLASS = "ee-launcher-slot";
  var SOURCE_BUTTON_IDS = ["ee-lists-fab", "ee-skuqa-btn", "ee-favorites-fab", "shoptet-bulk-cart-fab"];
  var registry = new Map();
  var relayoutTimer = null;
  var renderTimer = null;
  var tickTimer = null;

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
      " > #shoptet-bulk-entry-host{position:absolute !important;left:0 !important;top:0 !important;right:auto !important;bottom:auto !important;z-index:auto !important;width:1px !important;height:1px !important;margin:0 !important;overflow:visible !important;display:block !important;box-sizing:border-box;pointer-events:none}" +
      "\n#" +
      STACK_ID +
      " > ." +
      SLOT_CLASS +
      "{flex:1 1 0;min-width:0;display:flex;align-items:stretch}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      "{box-sizing:border-box;width:100%;height:34px;min-width:0;padding:0 20px 0 10px;border-radius:10px;border:none;box-shadow:none;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:6px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:12px;font-weight:700;line-height:1.1;letter-spacing:0;white-space:nowrap;text-overflow:ellipsis;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      ":hover{transform:translateY(-1px);filter:brightness(1.02)}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      "[disabled]{opacity:.55;cursor:default}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      ".ee-theme-lists{background:#0f766e;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      ".ee-theme-sku{background:#1d4ed8;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      ".ee-theme-fav{background:#0f172a;color:#fff}" +
      "\n#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
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
      BTN_CLASS +
      " .ee-dock-badge{position:absolute;top:2px;right:3px;display:grid;place-items:center;min-width:16px;height:16px;padding:0 4px;font-size:9px;font-weight:700;line-height:16px;font-family:inherit;font-variant-numeric:tabular-nums;white-space:nowrap;text-align:center;border-radius:999px;z-index:1;margin:0;box-sizing:border-box;background:#ef4444;color:#fff}" +
      "\n@media (max-width:980px){#" +
      STACK_ID +
      "{left:8px;right:8px;transform:none;bottom:calc(10px + env(safe-area-inset-bottom, 0px));width:auto;max-width:none;gap:6px;padding:6px}#" +
      STACK_ID +
      " ." +
      BTN_CLASS +
      "{height:32px;min-width:0;padding:0 20px 0 8px;border-radius:10px;gap:4px;font-size:10.5px}}" +
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
      " > #ee-skuqa-root.open .ee-overlay{display:block !important}";
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function toEntries() {
    var arr = Array.from(registry.values());
    arr.sort(function (a, b) {
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
    return arr;
  }

  function renderButtonContent(btn, cfg, badgeValue) {
    var icon = cfg && cfg.icon ? String(cfg.icon) : "";
    var label = cfg && cfg.label ? String(cfg.label) : "";
    btn.innerHTML =
      '<span class="ee-dock-icon" aria-hidden="true">' +
      icon +
      "</span>" +
      '<span class="ee-dock-label">' +
      label +
      "</span>" +
      (badgeValue > 0 ? '<span class="ee-dock-badge">' + badgeValue + "</span>" : "");
  }

  function readBadge(cfg) {
    try {
      if (!cfg || typeof cfg.getBadge !== "function") return 0;
      var v = Number(cfg.getBadge());
      if (!isFinite(v) || v <= 0) return 0;
      return Math.floor(v);
    } catch (_e) {
      return 0;
    }
  }

  function readOpen(cfg) {
    try {
      return !!(cfg && typeof cfg.isOpen === "function" && cfg.isOpen());
    } catch (_e) {
      return false;
    }
  }

  function render() {
    var host = ensureHost();
    var entries = toEntries();
    var used = {};
    for (var i = 0; i < entries.length; i++) {
      var cfg = entries[i];
      var slotId = STACK_ID + "-slot-" + cfg.id;
      used[slotId] = true;
      var slot = document.getElementById(slotId);
      if (!slot) {
        slot = document.createElement("div");
        slot.id = slotId;
        slot.className = SLOT_CLASS;
        slot.dataset.eeLauncherId = cfg.id;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = BTN_CLASS;
        slot.appendChild(btn);
        host.appendChild(slot);
      }
      var btnEl = slot.querySelector("." + BTN_CLASS);
      var theme = "ee-theme-" + String(cfg.theme || "");
      btnEl.className = BTN_CLASS + (cfg.theme ? " " + theme : "");
      var badge = readBadge(cfg);
      renderButtonContent(btnEl, cfg, badge);
      btnEl.setAttribute("aria-expanded", readOpen(cfg) ? "true" : "false");
      btnEl.disabled = !!cfg.disabled;
      btnEl.onclick = function (handler) {
        return function () {
          try {
            if (typeof handler === "function") handler();
          } catch (_e) {}
          requestUpdate();
        };
      }(cfg.onClick);
    }
    var staleSlots = host.querySelectorAll("." + SLOT_CLASS);
    for (var si = 0; si < staleSlots.length; si++) {
      if (!used[staleSlots[si].id]) staleSlots[si].remove();
    }
    scheduleRelayoutEmit();
  }

  function requestUpdate() {
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(function () {
      renderTimer = null;
      render();
    }, 0);
  }

  function registerButton(config) {
    if (!config || !config.id) return;
    registry.set(String(config.id), config);
    requestUpdate();
  }

  function unregisterButton(id) {
    if (!id) return;
    registry.delete(String(id));
    requestUpdate();
  }

  function scheduleReorder() {
    requestUpdate();
  }

  function setupStackResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;
    var host = ensureHost();
    if (!host || host.__eeLauncherResizeObs) return;
    var ro = new ResizeObserver(function () {
      scheduleRelayoutEmit();
    });
    ro.observe(host);
    host.__eeLauncherResizeObs = ro;
  }

  ensureHost();
  ensureStyle();
  requestUpdate();
  setupStackResizeObserver();
  tickTimer = setInterval(requestUpdate, 450);

  window.EE_LAUNCHER_STACK = {
    version: "2026-04-25-launcher-v11",
    STACK_ID: STACK_ID,
    ensureHost: ensureHost,
    ensureStyle: ensureStyle,
    reorder: scheduleReorder,
    scheduleReorder: scheduleReorder,
    registerButton: registerButton,
    unregisterButton: unregisterButton,
    requestUpdate: requestUpdate,
    _tick: tickTimer,
  };
})();
