/**
 * EE favorites (mobile-first, logged-in users only).
 * Separate script: does not mutate existing feature scripts.
 */
(function () {
  "use strict";

  var ROOT_ID = "ee-favorites-root";
  var STACK_ID = "ee-feature-launchers";
  var BTN_ID = "ee-favorites-fab";
  var DRAWER_ID = "ee-favorites-drawer";
  var STYLE_ID = "ee-favorites-style";
  var LS_KEY_PREFIX = "ee_favorites_v1";
  var FLOAT_SOURCE = "favorites";

  if (window.__EE_FAVORITES_BOOTED__) return;
  window.__EE_FAVORITES_BOOTED__ = true;

  var sync = window.EE_FEATURES_SYNC || null;
  var core = window.EE_CORE || null;
  var state = {
    context: null,
    items: [],
    open: false,
  };

  function n(v) {
    return String(v || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      "\n#" + ROOT_ID + "{display:flex;flex-direction:column;align-items:stretch;gap:8px;width:100%;box-sizing:border-box}" +
      "\n#" + BTN_ID + "{height:38px;min-width:44px;padding:0 12px;border-radius:999px;border:1px solid #cbd5e1;background:#111827;color:#fff;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 8px 18px rgba(2,6,23,.22)}" +
      "\n#"+BTN_ID+" .ee-count{background:#ef4444;color:#fff;border-radius:999px;padding:1px 7px;font-size:11px;min-width:18px;text-align:center}" +
      "\n#"+DRAWER_ID+"{position:fixed;left:0;right:0;bottom:0;top:auto;max-height:min(78svh,640px);background:#fff;border-top-left-radius:14px;border-top-right-radius:14px;transform:translateY(106%);transition:transform .2s ease;z-index:2147483645;display:flex;flex-direction:column;border:1px solid #e2e8f0}" +
      "\n#"+ROOT_ID+".open #"+DRAWER_ID+"{transform:translateY(0)}" +
      "\n#"+ROOT_ID+" .ee-overlay{position:fixed;inset:0;background:rgba(2,6,23,.42);opacity:0;pointer-events:none;transition:opacity .2s ease;z-index:2147483644}" +
      "\n#"+ROOT_ID+".open .ee-overlay{opacity:1;pointer-events:auto}" +
      "\n#"+ROOT_ID+" .ee-head{display:flex;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid #e2e8f0}" +
      "\n#"+ROOT_ID+" .ee-title{font-size:16px;font-weight:700;color:#0f172a}" +
      "\n#"+ROOT_ID+" .ee-close{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 10px;font-size:13px;cursor:pointer}" +
      "\n#"+ROOT_ID+" .ee-body{padding:10px;overflow:auto}" +
      "\n#"+ROOT_ID+" .ee-row{display:grid;grid-template-columns:52px 1fr auto;gap:10px;align-items:center;padding:8px 2px;border-bottom:1px solid #f1f5f9}" +
      "\n#"+ROOT_ID+" .ee-row img{width:48px;height:48px;object-fit:contain;background:#f8fafc;border-radius:8px}" +
      "\n#"+ROOT_ID+" .ee-name{font-size:13px;font-weight:600;color:#0f172a;line-height:1.3}" +
      "\n#"+ROOT_ID+" .ee-code{font-size:12px;color:#64748b;margin-top:2px}" +
      "\n#"+ROOT_ID+" .ee-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}" +
      "\n#"+ROOT_ID+" .ee-btn{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:6px 8px;font-size:12px;cursor:pointer}" +
      "\n#"+ROOT_ID+" .ee-btn.primary{background:#16a34a;border-color:#16a34a;color:#fff}" +
      "\n.ee-fav-card-toggle .ee-fav-toggle{border:none;background:transparent;padding:0;cursor:pointer;color:#475569;font-size:18px;line-height:1}" +
      "\n.ee-fav-card-toggle .ee-fav-toggle.is-on{color:#dc2626}" +
      "\n.ee-fav-inline{display:inline-flex;align-items:center;gap:6px}" +
      "\n.ee-fav-host-inline{display:inline-flex;align-items:center;gap:6px}" +
      "\n.product-btn.ee-fav-host-inline{display:flex;align-items:center;gap:6px;width:100%}" +
      "\n.product-btn.ee-fav-host-inline > .ee-fav-card-toggle{flex:0 0 auto}" +
      "\n.product-btn.ee-fav-host-inline > form.pr-action.csrf-enabled{flex:1 1 auto;min-width:0;margin:0}" +
      "\n.product-btn.ee-fav-host-inline > form.pr-action.csrf-enabled .btn-cart{width:100%}" +
      "\n.ee-fav-list-action{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;font-size:18px;line-height:1;color:#475569}" +
      "\n.ee-fav-list-action:hover{border-color:#94a3b8;background:#f8fafc}" +
      "\n.social-buttons-wrapper .link-icons a.link-icon.ee-fav-pdp{cursor:pointer;text-decoration:none;font:inherit;color:inherit}" +
      "\n.social-buttons-wrapper .link-icons a.link-icon.ee-fav-pdp .ee-fav-pdp-label{text-decoration:underline}" +
      "\n.social-buttons-wrapper .link-icons a.link-icon.ee-fav-pdp::before{content:\"♡\";display:inline-block;margin-right:.35em;text-decoration:none !important;font-weight:400}" +
      "\n.social-buttons-wrapper .link-icons a.link-icon.ee-fav-pdp.is-on::before{content:\"❤\";color:#dc2626}" +
      "\n.ee-fav-pdp-fallback-host{position:relative}" +
      "\n.ee-fav-pdp-fallback{position:absolute;right:0;top:0;z-index:2}" +
      "\n.ee-fav-pdp-fallback a.link-icon.ee-fav-pdp{align-self:flex-end}" +
      "\n#"+BTN_ID+", #"+ROOT_ID+" .ee-btn, #"+ROOT_ID+" .ee-close, .ee-fav-card-toggle .ee-fav-toggle, a.link-icon.ee-fav-pdp{touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
      "\n#" + ROOT_ID + ".ee-behind #" + BTN_ID + "{opacity:.86}" +
      "\nhtml[data-ee-floating-open] #shoptet-bulk-entry-host{z-index:1299 !important}" +
      "\nhtml[data-ee-floating-open] #shoptet-bulk-cart-fab{z-index:1299 !important}" +
      "\n@media (min-width: 981px){#" + DRAWER_ID + "{left:auto;right:14px;bottom:168px;top:auto;width:min(420px,calc(100vw - 24px));max-height:min(70vh,620px);border-radius:14px;transform:translateY(12px) scale(.98);opacity:0;pointer-events:none}#" + ROOT_ID + ".open #" + DRAWER_ID + "{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}}" +
      "\n@media (max-width:980px){#" + BTN_ID + "{height:36px;padding:0 10px;font-size:12px}.ee-fav-list-action{width:34px;height:34px;border-radius:9px}}";
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function lsKey() {
    var id = state.context && state.context.localKey ? state.context.localKey : "guest";
    return LS_KEY_PREFIX + "::" + location.hostname + "::" + id;
  }

  function loadLocal() {
    try {
      var parsed = JSON.parse(localStorage.getItem(lsKey()) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (x) {
        return x && typeof x.product_code === "string" && n(x.product_code);
      });
    } catch (_e) {
      return [];
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem(lsKey(), JSON.stringify(state.items));
    } catch (_e) {}
  }

  function setFabCount() {
    var el = document.querySelector("#" + BTN_ID + " .ee-count");
    if (!el) return;
    el.textContent = String(state.items.length || 0);
  }

  function isFav(code) {
    var key = n(code).toUpperCase();
    return state.items.some(function (it) {
      return n(it.product_code).toUpperCase() === key;
    });
  }

  function extractCodeFromNode(node) {
    if (!node) return "";
    var direct = n(node.getAttribute && node.getAttribute("data-product-code"));
    if (direct) return direct;
    var input = node.querySelector && node.querySelector('input[name="productCode"],input[name="product_code"]');
    if (input && n(input.value)) return n(input.value);
    var attrNode = node.querySelector && node.querySelector("[data-product-code]");
    if (attrNode && n(attrNode.getAttribute("data-product-code"))) return n(attrNode.getAttribute("data-product-code"));
    var txt = n(node.textContent || "");
    var m = txt.match(/(?:K[ÓO]D\s*PRODUKTU|K[ÓO]D)\s*[:\-]?\s*([A-Z0-9._\-]{3,})/i);
    return m ? n(m[1]) : "";
  }

  function extractMetaFromNode(node) {
    if (!node) return null;
    var code = extractCodeFromNode(node);
    if (!code) return null;
    var titleNode =
      node.querySelector("h1,h2,h3,.name,.p-name,.product-name,a") ||
      document.querySelector("h1");
    var linkNode = node.querySelector("a[href]") || document.querySelector('link[rel="canonical"]');
    var imgNode = node.querySelector("img[src]");
    return {
      product_code: code,
      product_name: n((titleNode && titleNode.textContent) || ("Produkt " + code)),
      product_url: n((linkNode && (linkNode.href || linkNode.getAttribute("href"))) || location.href),
      product_image: n((imgNode && (imgNode.currentSrc || imgNode.src)) || ""),
      updated_at: new Date().toISOString(),
    };
  }

  function getPdpMeta() {
    var codeInput = document.querySelector('input[name="productCode"], input[name="product_code"]');
    var code = n(codeInput && codeInput.value);
    if (!code) {
      var heading = document.querySelector("h1");
      var scope = document.querySelector(".p-detail-inner, .product-top, #content") || document.body;
      var scan = n((scope && scope.textContent) || "");
      var m = scan.match(/(?:K[ÓO]D\s*PRODUKTU|K[ÓO]D)\s*[:\-]?\s*([A-Z0-9._\-]{2,})/i);
      if (m) code = n(m[1]);
      if (!code && heading) {
        var hm = n(heading.textContent || "").match(/\b([A-Z0-9._\-]{2,})\b$/);
        if (hm) code = n(hm[1]);
      }
    }
    if (!code) return null;
    var title = n((document.querySelector("h1") && document.querySelector("h1").textContent) || ("Produkt " + code));
    var img =
      n(
        (document.querySelector(".p-image img, .product-top img, .p-main-image img, .p-photo img") || {})
          .currentSrc ||
          (document.querySelector(".p-image img, .product-top img, .p-main-image img, .p-photo img") || {}).src
      ) || "";
    return {
      product_code: code,
      product_name: title,
      product_url: location.href,
      product_image: img,
      updated_at: new Date().toISOString(),
    };
  }

  function toggleFavorite(meta, sourceBtn) {
    if (!meta || !meta.product_code) return;
    var idx = state.items.findIndex(function (it) {
      return n(it.product_code).toUpperCase() === n(meta.product_code).toUpperCase();
    });
    if (idx >= 0) {
      state.items.splice(idx, 1);
      if (sync && state.context && state.context.canSync) {
        sync.deleteFavorite(state.context.ownerHash, meta.product_code).catch(function () {});
      }
    } else {
      state.items.unshift(meta);
      if (sync && state.context && state.context.canSync) {
        sync.upsertFavorite(state.context.ownerHash, meta).catch(function () {});
      }
    }
    saveLocal();
    renderDrawerBody();
    setFabCount();
    refreshToggleStates();
    if (sourceBtn) sourceBtn.blur();
  }

  function ascii(v) {
    return n(v || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function findPdpActionInsertTarget() {
    var actionsWrap = document.querySelector(".social-buttons-wrapper .link-icons");
    if (!actionsWrap) return null;
    var askNode = actionsWrap.querySelector("a.link-icon.chat, button.link-icon.chat");
    var watchNode = actionsWrap.querySelector("a.link-icon.watchdog, button.link-icon.watchdog");
    var shareNode = actionsWrap.querySelector("a.link-icon.share, button.link-icon.share");
    if (!askNode || !watchNode || !shareNode) {
      var actions = actionsWrap.querySelectorAll("a,button");
      for (var i = 0; i < actions.length; i++) {
        var txt = ascii(actions[i].textContent || "");
        if (!askNode && txt.indexOf("opytat sa") !== -1) askNode = actions[i];
        if (!watchNode && txt.indexOf("strazit") !== -1) watchNode = actions[i];
        if (!shareNode && txt.indexOf("zdielat") !== -1) shareNode = actions[i];
      }
    }
    if (askNode && shareNode) return { before: askNode, wrap: actionsWrap };
    if (watchNode && shareNode) return { before: watchNode, wrap: actionsWrap };
    if (askNode) return { before: askNode, wrap: actionsWrap };
    if (watchNode) return { before: watchNode, wrap: actionsWrap };
    if (shareNode) return { before: shareNode, wrap: actionsWrap };
    return null;
  }

  function ensurePdpToggle() {
    if (document.querySelector("a.link-icon.ee-fav-pdp")) return;
    var legacyPdp = document.querySelectorAll("a.ee-fav-pdp-action");
    for (var li = 0; li < legacyPdp.length; li++) legacyPdp[li].remove();
    if (!document.querySelector("h1")) return;
    var targetCfg = findPdpActionInsertTarget();
    var meta = getPdpMeta() || extractMetaFromNode(document) || null;
    if (!meta || !meta.product_code) return;
    var anchor = document.createElement("a");
    anchor.href = "#";
    anchor.className = "link-icon ee-fav-pdp";
    anchor.dataset.eeCode = meta.product_code;
    anchor.setAttribute("title", "Obľúbené");
    anchor.innerHTML = '<span class="ee-fav-pdp-label">Obľúbené</span>';
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      toggleFavorite(meta, anchor);
    });
    if (targetCfg && targetCfg.before && targetCfg.before.parentNode) {
      targetCfg.before.parentNode.insertBefore(anchor, targetCfg.before);
      return;
    }
    var fallbackHost = document.querySelector("div.row.product-top");
    if (fallbackHost) {
      fallbackHost.classList.add("ee-fav-pdp-fallback-host");
      var box = document.createElement("div");
      box.className = "ee-fav-pdp-fallback";
      box.appendChild(anchor);
      fallbackHost.appendChild(box);
    }
  }

  function isInTopFeatured(node) {
    return !!(
      node &&
      node.closest &&
      node.closest(".products-top, .products-top-wrapper, #productsTop, .top-products, [data-products-top], [data-testid='productsTop']")
    );
  }

  function findListingActionHost(node) {
    if (!node || !node.querySelector) return null;
    var formNode =
      node.querySelector(".product-btn form.pr-action.csrf-enabled, .product-btn form.pr-action, .p-tools form.pr-action.csrf-enabled, .p-tools form.pr-action") ||
      null;
    var cartBtn = node.querySelector(".btn.btn-cart, .btn-cart, .add-to-cart-button");
    if (formNode && formNode.closest(".product-btn")) {
      return { host: formNode.closest(".product-btn"), formNode: formNode, cartBtn: cartBtn };
    }
    if (cartBtn && cartBtn.closest(".ee-qty-wrap")) {
      return { host: cartBtn.closest(".ee-qty-wrap"), formNode: formNode, cartBtn: cartBtn };
    }
    if (formNode && formNode.parentNode) {
      return { host: formNode.parentNode, formNode: formNode, cartBtn: cartBtn };
    }
    return null;
  }

  function removeToggleNode(node) {
    if (!node || !node.parentNode) return;
    node.parentNode.removeChild(node);
  }

  function ensureListingToggle(node) {
    if (!node) return;
    if (isInTopFeatured(node)) {
      var topExisting = node.querySelector(".ee-fav-card-toggle");
      if (topExisting) removeToggleNode(topExisting);
      return;
    }
    if (node.querySelector("span.product-btn")) {
      var rm = node.querySelector(".ee-fav-card-toggle");
      if (rm) removeToggleNode(rm);
      return;
    }
    var meta = extractMetaFromNode(node);
    if (!meta || !meta.product_code) return;
    var cfg = findListingActionHost(node);
    if (!cfg || !cfg.host) {
      var stale = node.querySelector(".ee-fav-card-toggle");
      if (stale) removeToggleNode(stale);
      return;
    }
    var host = cfg.host;
    var wrap = node.querySelector(".ee-fav-card-toggle");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "ee-fav-inline ee-fav-card-toggle";
      wrap.innerHTML =
        '<button type="button" class="ee-fav-toggle ee-fav-list-action ee-fav-icon-only" aria-label="Obľúbené" title="Obľúbené">♡</button>';
    }
    wrap.classList.add("ee-fav-inline", "ee-fav-card-toggle");
    wrap.removeAttribute("style");
    var btn = wrap.querySelector("button.ee-fav-toggle, button, a.ee-fav-toggle, a");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "♡";
      wrap.appendChild(btn);
    }
    btn.classList.add("ee-fav-toggle", "ee-fav-list-action", "ee-fav-icon-only");
    btn.setAttribute("aria-label", "Obľúbené");
    btn.setAttribute("title", "Obľúbené");
    btn.removeAttribute("style");
    btn.dataset.eeCode = meta.product_code;
    if (!btn.dataset.eeFavBound) {
      btn.dataset.eeFavBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(meta, btn);
      });
    }
    var cartBtn = cfg.cartBtn || host.querySelector(".btn.btn-cart, .btn-cart, .add-to-cart-button");
    var formNode = cfg.formNode || host.querySelector("form.pr-action, form");
    host.classList.add("ee-fav-host-inline");
    if (wrap.parentNode !== host) {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      host.appendChild(wrap);
    }
    if (host.classList.contains("product-btn")) {
      if (formNode && formNode.parentNode === host) host.insertBefore(wrap, formNode);
      else if (cartBtn && cartBtn.parentNode === host) host.insertBefore(wrap, cartBtn);
      else host.appendChild(wrap);
      return;
    }
    if (cartBtn && cartBtn.parentNode === host) host.insertBefore(wrap, cartBtn);
    else if (formNode && formNode.parentNode === host) host.insertBefore(wrap, formNode);
    else host.appendChild(wrap);
  }

  function mountInlineToggles() {
    if (!state.context || !state.context.loggedIn) return;
    var stray = document.querySelectorAll("#products > .product > .ee-fav-card-toggle");
    for (var s = 0; s < stray.length; s++) {
      removeToggleNode(stray[s]);
    }
    var featured = document.querySelectorAll(".products-top .ee-fav-card-toggle, .products-top-wrapper .ee-fav-card-toggle, #productsTop .ee-fav-card-toggle");
    for (var f = 0; f < featured.length; f++) {
      removeToggleNode(featured[f]);
    }
    var listing = document.querySelectorAll("main #products > .product, #products > .product");
    for (var i = 0; i < listing.length; i++) ensureListingToggle(listing[i]);
    ensurePdpToggle();
    refreshToggleStates();
  }

  function refreshToggleStates() {
    var toggles = document.querySelectorAll(".ee-fav-toggle[data-ee-code], a.link-icon.ee-fav-pdp[data-ee-code]");
    for (var i = 0; i < toggles.length; i++) {
      var code = toggles[i].dataset.eeCode;
      var on = isFav(code);
      toggles[i].classList.toggle("is-on", on);
      toggles[i].setAttribute("aria-pressed", on ? "true" : "false");
      if (toggles[i].classList.contains("ee-fav-icon-only")) {
        toggles[i].textContent = on ? "❤" : "♡";
      } else if (!toggles[i].classList.contains("ee-fav-pdp")) {
        var heartNode = toggles[i].querySelector(".ee-heart");
        if (heartNode) heartNode.textContent = on ? "❤" : "♡";
      }
    }
  }

  function addToCart(code) {
    var safeCode = n(code);
    if (!safeCode) return Promise.resolve(false);
    if (window.shoptet && window.shoptet.cartShared && typeof window.shoptet.cartShared.addToCart === "function") {
      try {
        window.shoptet.cartShared.addToCart({ productCode: safeCode, amount: 1 }, true);
        return Promise.resolve(true);
      } catch (_e) {}
    }
    return Promise.resolve(false);
  }

  function renderDrawerBody() {
    var body = document.querySelector("#" + ROOT_ID + " .ee-body");
    if (!body) return;
    if (!state.items.length) {
      body.innerHTML = '<div style="font-size:13px;color:#475569;padding:6px 2px">Zatiaľ nemáte žiadne obľúbené produkty.</div>';
      return;
    }
    body.innerHTML = state.items
      .map(function (it) {
        return (
          '<div class="ee-row" data-code="' +
          String(it.product_code).replace(/"/g, "&quot;") +
          '">' +
          '<img src="' +
          String(it.product_image || "").replace(/"/g, "&quot;") +
          '" alt="">' +
          "<div>" +
          '<div class="ee-name">' +
          String(it.product_name || it.product_code) +
          "</div>" +
          '<div class="ee-code">Kód: ' +
          String(it.product_code) +
          "</div>" +
          "</div>" +
          '<div class="ee-actions">' +
          '<button class="ee-btn primary" data-act="cart">Do košíka</button>' +
          '<button class="ee-btn" data-act="open">Detail</button>' +
          '<button class="ee-btn" data-act="remove">Odstrániť</button>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function ensureRoot() {
    var root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML =
      '<button id="' +
      BTN_ID +
      '" type="button" aria-expanded="false">❤ Obľúbené <span class="ee-count">0</span></button>' +
      '<div class="ee-overlay"></div>' +
      '<div id="' +
      DRAWER_ID +
      '" role="dialog" aria-label="Obľúbené produkty">' +
      '<div class="ee-head"><div class="ee-title">Obľúbené produkty</div><button type="button" class="ee-close">Zavrieť</button></div>' +
      '<div class="ee-body"></div>' +
      "</div>";
    ensureLauncherStack().appendChild(root);

    var fab = root.querySelector("#" + BTN_ID);
    fab.addEventListener("click", function () {
      state.open = !state.open;
      root.classList.toggle("open", state.open);
      fab.setAttribute("aria-expanded", state.open ? "true" : "false");
      setFloatingOwner(state.open);
      if (state.open) renderDrawerBody();
    });
    root.querySelector(".ee-overlay").addEventListener("click", function () {
      state.open = false;
      root.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
      setFloatingOwner(false);
    });
    root.querySelector(".ee-close").addEventListener("click", function () {
      state.open = false;
      root.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
      setFloatingOwner(false);
    });
    root.querySelector(".ee-body").addEventListener("click", function (e) {
      var btn = e.target && e.target.closest("button[data-act]");
      if (!btn) return;
      var row = btn.closest(".ee-row");
      if (!row) return;
      var code = row.getAttribute("data-code");
      var item = state.items.find(function (x) {
        return n(x.product_code).toUpperCase() === n(code).toUpperCase();
      });
      if (!item) return;
      if (btn.dataset.act === "remove") {
        toggleFavorite(item, null);
      } else if (btn.dataset.act === "open") {
        location.href = item.product_url || "/vyhladavanie/?string=" + encodeURIComponent(item.product_code);
      } else if (btn.dataset.act === "cart") {
        addToCart(item.product_code);
      }
    });
    return root;
  }

  function ensureLauncherStack() {
    var host = document.getElementById(STACK_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = STACK_ID;
      document.body.appendChild(host);
    }
    if (window.EE_LAUNCHER_STACK) {
      if (typeof window.EE_LAUNCHER_STACK.ensureStyle === "function") window.EE_LAUNCHER_STACK.ensureStyle();
      if (typeof window.EE_LAUNCHER_STACK.scheduleReorder === "function") window.EE_LAUNCHER_STACK.scheduleReorder();
    }
    return host;
  }

  function syncFloatingLayer() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var current = document.documentElement.getAttribute("data-ee-floating-open");
    var bulkOpen = !!document.querySelector("#shoptet-bulk-cart-root.open");
    root.classList.toggle("ee-behind", bulkOpen || (!!current && current !== FLOAT_SOURCE));
  }

  function setFloatingOwner(open) {
    if (open) document.documentElement.setAttribute("data-ee-floating-open", FLOAT_SOURCE);
    else if (document.documentElement.getAttribute("data-ee-floating-open") === FLOAT_SOURCE)
      document.documentElement.removeAttribute("data-ee-floating-open");
    document.dispatchEvent(new CustomEvent("ee-floating-changed"));
  }

  function mergeByCode(base, incoming) {
    var map = new Map();
    (base || []).forEach(function (it) {
      map.set(n(it.product_code).toUpperCase(), it);
    });
    (incoming || []).forEach(function (it) {
      if (!it || !it.product_code) return;
      var key = n(it.product_code).toUpperCase();
      var prev = map.get(key);
      if (!prev) map.set(key, it);
      else {
        var p = Date.parse(prev.updated_at || 0) || 0;
        var c = Date.parse(it.updated_at || 0) || 0;
        map.set(key, c >= p ? it : prev);
      }
    });
    return Array.from(map.values());
  }

  function syncFromRemote() {
    if (!sync || !state.context || !state.context.canSync) return Promise.resolve();
    return sync
      .listFavorites(state.context.ownerHash)
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        state.items = mergeByCode(state.items, rows);
        saveLocal();
      })
      .catch(function () {});
  }

  function boot() {
    ensureStyle();
    sync
      .getContext()
      .then(function (ctx) {
        state.context = ctx;
        if (!ctx.loggedIn) return;
        state.items = loadLocal();
        ensureRoot();
        syncFloatingLayer();
        setFabCount();
        mountInlineToggles();
        renderDrawerBody();
        return syncFromRemote().then(function () {
          setFabCount();
          renderDrawerBody();
          refreshToggleStates();
        });
      })
      .catch(function () {});
  }

  function scheduleMount() {
    if (core && typeof core.scheduleOnce === "function") {
      core.scheduleOnce("ee-fav-mount", mountInlineToggles, 80);
    } else {
      setTimeout(mountInlineToggles, 80);
    }
  }

  boot();
  document.addEventListener("ee-floating-changed", syncFloatingLayer);
  document.addEventListener("ShoptetDOMPageContentLoaded", scheduleMount);
  document.addEventListener("ShoptetCartUpdated", scheduleMount);
  document.addEventListener("click", function () {
    setTimeout(syncFloatingLayer, 0);
  });
  if (core && typeof core.routeChanged === "function") core.routeChanged(scheduleMount);
  if (document.body && typeof MutationObserver !== "undefined") {
    new MutationObserver(scheduleMount).observe(document.body, { childList: true, subtree: true });
  }

  var _setOpen = function () {
    var root = document.getElementById(ROOT_ID);
    var fab = root && root.querySelector("#" + BTN_ID);
    if (!root || !fab) return;
    var observer = new MutationObserver(function () {
      var isOpen = root.classList.contains("open");
      setFloatingOwner(isOpen);
      fab.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  };
  setTimeout(_setOpen, 0);
})();
