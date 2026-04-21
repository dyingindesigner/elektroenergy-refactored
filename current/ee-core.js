/**
 * Elektroenergy shared runtime helpers.
 * Keep this file tiny and dependency-free so all other scripts can rely on it.
 */
(function () {
  "use strict";

  if (window.EE_CORE && window.EE_CORE.version) return;
  var scheduleMap = {};

  function normalizeText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function getCustomerState() {
    var state = { groupId: null, loggedIn: false };
    var sources = [
      window.eeCustomer,
      window.customer,
      window.shoptet && window.shoptet.customer,
      window.shoptet && window.shoptet.config && window.shoptet.config.customer,
      window.Shoptet && window.Shoptet.customer,
    ];

    var i;
    var src;
    var groupVal;

    for (i = 0; i < sources.length; i++) {
      src = sources[i];
      if (!src || typeof src !== "object") continue;
      groupVal = Number(src.groupId);
      if (!isNaN(groupVal)) state.groupId = groupVal;
      if (src.registered === true || src.mainAccount === true) state.loggedIn = true;
    }

    if (Array.isArray(window.dataLayer)) {
      for (i = 0; i < window.dataLayer.length; i++) {
        src = window.dataLayer[i] || {};
        var candidates = [
          src,
          src.customer,
          src.shoptet && src.shoptet.customer,
          src.ecommerce && src.ecommerce.customer,
          src.page && src.page.customer,
        ];
        for (var j = 0; j < candidates.length; j++) {
          var c = candidates[j];
          if (!c || typeof c !== "object") continue;
          groupVal = Number(c.groupId);
          if (!isNaN(groupVal)) state.groupId = groupVal;
          if (c.registered === true || c.mainAccount === true) state.loggedIn = true;
        }
      }
    }

    if (!state.loggedIn) {
      var links = document.querySelectorAll("a,button");
      for (i = 0; i < links.length; i++) {
        var t = normalizeText(links[i].textContent);
        if (t === "Môj účet" || t.indexOf("Môj účet") !== -1) {
          state.loggedIn = true;
          break;
        }
      }
    }

    return state;
  }

  function isB2B() {
    var s = getCustomerState();
    return !!s.loggedIn && s.groupId != null && Number(s.groupId) !== 1;
  }

  function getCartArray() {
    if (typeof getShoptetDataLayer === "function") {
      try {
        var cart = getShoptetDataLayer("cart");
        if (Array.isArray(cart)) return cart;
      } catch (_e) {}
    }

    if (Array.isArray(window.dataLayer)) {
      for (var i = window.dataLayer.length - 1; i >= 0; i--) {
        var entry = window.dataLayer[i];
        if (!entry || typeof entry !== "object") continue;
        var sh = entry.shoptet;
        if (sh && Array.isArray(sh.cart)) return sh.cart;
      }
    }
    return [];
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait || 0);
    };
  }

  function throttle(fn, wait) {
    var last = 0;
    var trailing = null;
    return function () {
      var now = Date.now();
      var remaining = (wait || 0) - (now - last);
      var ctx = this;
      var args = arguments;

      if (remaining <= 0) {
        if (trailing) {
          clearTimeout(trailing);
          trailing = null;
        }
        last = now;
        fn.apply(ctx, args);
        return;
      }

      if (!trailing) {
        trailing = setTimeout(function () {
          trailing = null;
          last = Date.now();
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

  function observeScoped(root, options, callback) {
    if (!root || typeof MutationObserver === "undefined") return null;
    var observer = new MutationObserver(callback);
    observer.observe(root, options || { childList: true, subtree: true });
    return observer;
  }

  function scheduleOnce(id, fn, delay) {
    if (!id || typeof fn !== "function") return;
    clearTimeout(scheduleMap[id]);
    scheduleMap[id] = setTimeout(function () {
      delete scheduleMap[id];
      fn();
    }, delay || 0);
  }

  function createScopedObserver(cfg) {
    cfg = cfg || {};
    var root = cfg.root;
    if (!root || typeof MutationObserver === "undefined") return null;
    var options = cfg.options || { childList: true, subtree: true };
    var onMutate = typeof cfg.onMutate === "function" ? cfg.onMutate : function () {};
    var autoDisconnectWhen =
      typeof cfg.autoDisconnectWhen === "function" ? cfg.autoDisconnectWhen : null;

    var observer = new MutationObserver(function (mutations) {
      if (autoDisconnectWhen && autoDisconnectWhen()) {
        observer.disconnect();
        return;
      }
      onMutate(mutations, observer);
    });
    observer.observe(root, options);
    return observer;
  }

  function routeChanged(handler) {
    if (typeof handler !== "function") return function () {};
    var disposed = false;
    var lastHref = location.href;
    function run(reason) {
      if (disposed) return;
      if (location.href === lastHref && reason !== "init") return;
      lastHref = location.href;
      handler({ href: lastHref, reason: reason || "url_change" });
    }
    var onPopState = function () {
      run("popstate");
    };
    var onHashChange = function () {
      run("hashchange");
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);

    var originalPushState = history.pushState;
    var originalReplaceState = history.replaceState;
    history.pushState = function () {
      originalPushState.apply(history, arguments);
      setTimeout(function () {
        run("pushState");
      }, 0);
    };
    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      setTimeout(function () {
        run("replaceState");
      }, 0);
    };

    run("init");
    return function () {
      disposed = true;
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }

  window.EE_CORE = {
    version: "2026-04-21-core-v2",
    normalizeText: normalizeText,
    getCustomerState: getCustomerState,
    isB2B: isB2B,
    getCartArray: getCartArray,
    debounce: debounce,
    throttle: throttle,
    observeScoped: observeScoped,
    scheduleOnce: scheduleOnce,
    createScopedObserver: createScopedObserver,
    routeChanged: routeChanged,
  };
})();
