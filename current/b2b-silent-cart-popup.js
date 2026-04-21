/**
 * Elektroenergy.sk — B2B: potlačenie popupu „Produkt bol pridaný do košíka!“ (Colorbox advanced order).
 *
 * 1) addToCart / updateQuantityInCart — doplnenie silent: true (Shoptet API).
 * 2) Opätovné obalenie, ak Shoptet po načítaní prepíše funkcie na cartShared (nie len prvý patch).
 * 3) Záloha: ak sa modal aj tak otvorí, okamžite ho zatvoriť (B2B).
 *
 * Načítajte PRED productarrows.js a ostatnými skriptami, ktoré volajú košík.
 *
 * @see https://developers.shoptet.com/home/shoptet-tools/editing-templates/how-to-properly-add-product-to-cart-with-javascript/
 */
(function () {
  "use strict";

  var core = window.EE_CORE || {};
  var WRAP_MARK = "__eeB2bSilentWrap";
  var SESSION_KEY = "ee_b2b_session";
  var pollAttempts = 0;
  var maxPolls = 60;
  var closeDebounce = null;

  function n(t) {
    return core.normalizeText ? core.normalizeText(t) : (t || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function isB2B() {
    if (typeof core.isB2B === "function") return core.isB2B();
    return false;
  }

  /** Po jednom rozpoznaní B2B v session zapamätáme (popup môže prísť skôr než groupId v dataLayer). */
  function shouldTreatAsB2BForUi() {
    if (isB2B()) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch (e) {}
      return true;
    }
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (e2) {
      return false;
    }
  }

  function withSilent(opts) {
    if (!isB2B()) return opts;
    if (opts == null || typeof opts !== "object" || Object.prototype.toString.call(opts) !== "[object Object]") return opts;
    if (opts.silent === false) return opts;
    var o = {};
    var k;
    for (k in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, k)) o[k] = opts[k];
    }
    o.silent = true;
    return o;
  }

  /** Obalí funkcie znova, ak Shoptet prepísal referenciu (bez flagu na cartShared). */
  function patchCartShared(cs) {
    if (!cs) return false;
    var touched = false;

    if (typeof cs.addToCart === "function" && !cs.addToCart[WRAP_MARK]) {
      var origAdd = cs.addToCart.bind(cs);
      var wrappedAdd = function (opts) {
        return origAdd(withSilent(opts));
      };
      wrappedAdd[WRAP_MARK] = true;
      cs.addToCart = wrappedAdd;
      touched = true;
    }

    if (typeof cs.updateQuantityInCart === "function" && !cs.updateQuantityInCart[WRAP_MARK]) {
      var origUpd = cs.updateQuantityInCart.bind(cs);
      var wrappedUpd = function (opts) {
        return origUpd(withSilent(opts));
      };
      wrappedUpd[WRAP_MARK] = true;
      cs.updateQuantityInCart = wrappedUpd;
      touched = true;
    }

    return touched;
  }

  function tryPatch() {
    var sh = window.shoptet;
    if (!sh || !sh.cartShared) return false;
    patchCartShared(sh.cartShared);
    return true;
  }

  function schedulePoll() {
    var id = setInterval(function () {
      pollAttempts++;
      var patched = tryPatch();
      if (patched || pollAttempts >= maxPolls) clearInterval(id);
    }, 200);
  }

  function closeAdvancedOrderIfOpen() {
    if (!shouldTreatAsB2BForUi()) return;

    var box = document.getElementById("colorbox");
    if (!box) return;

    var st = window.getComputedStyle(box);
    if (st.display === "none" || st.visibility === "hidden") return;

    var isOrderPopup =
      box.classList.contains("colorbox--order") ||
      !!box.querySelector('[data-testid="popupAdvancedOrder"]') ||
      !!box.querySelector(".advanced-order");

    if (!isOrderPopup) return;

    if (window.jQuery && window.jQuery.colorbox) {
      try {
        window.jQuery.colorbox.close();
      } catch (e0) {}
    }

    var btn = box.querySelector("#cboxClose, .cboxClose--order, button.cboxClose");
    if (btn) {
      try {
        btn.click();
      } catch (e1) {}
    }

    var ov = document.getElementById("cboxOverlay");
    if (ov) {
      try {
        ov.style.display = "none";
      } catch (e2) {}
    }
  }

  function scheduleCloseCheck() {
    clearTimeout(closeDebounce);
    closeDebounce = setTimeout(closeAdvancedOrderIfOpen, 0);
  }

  function bootObserver() {
    if (document.documentElement.dataset.eeB2bCartMo === "1") return;
    document.documentElement.dataset.eeB2bCartMo = "1";
    var installFor = function (node) {
      if (!node || node.dataset.eeB2bObserved === "1") return;
      node.dataset.eeB2bObserved = "1";
      var mo = new MutationObserver(scheduleCloseCheck);
      mo.observe(node, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    };
    installFor(document.getElementById("colorbox"));
    installFor(document.getElementById("cboxOverlay"));

    // Lightweight bootstrap observer until colorbox nodes exist.
    var bootstrap = new MutationObserver(function () {
      installFor(document.getElementById("colorbox"));
      installFor(document.getElementById("cboxOverlay"));
      if (document.getElementById("colorbox") || document.getElementById("cboxOverlay")) {
        bootstrap.disconnect();
      }
    });
    bootstrap.observe(document.body || document.documentElement, { childList: true, subtree: true });
    setTimeout(function () {
      bootstrap.disconnect();
    }, 8000);
  }

  function boot() {
    tryPatch();
    schedulePoll();
    bootObserver();
    scheduleCloseCheck();
  }

  boot();

  document.addEventListener("ShoptetDOMPageContentLoaded", function () {
    tryPatch();
    scheduleCloseCheck();
  });

  document.addEventListener("ShoptetDataLayerUpdated", function () {
    tryPatch();
  });

  window.addEventListener("load", function () {
    tryPatch();
    scheduleCloseCheck();
  });
})();
