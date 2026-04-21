(function () {
  "use strict";
  var core = window.EE_CORE || {};
  var OBSERVER_FLAG = "eeCheckoutNoticeObserver";
  var CFG = window.EE_CHECKOUT_NOTICE || {
    title: "Doručujeme iba v rámci Slovenska",
    text: "Objednávky odosielame len na adresy a odberné miesta v SR.",
  };

  function isCheckoutPath() {
    var path = String(window.location.pathname || "").toLowerCase();
    return /\/objednavka|\/order|\/checkout/.test(path);
  }

  if (!isCheckoutPath()) return;

  const style = document.createElement('style');
  style.innerHTML = `
  #shipping-slovakia-only-notice {
    margin-top: 14px !important;
    margin-bottom: 8px !important;
  }

  .shipping-slovakia-only-notice-inner {
    padding: 12px 14px !important;
    border: 1px solid #f1b5b5 !important;
    border-radius: 10px !important;
    background: linear-gradient(180deg, #fff5f5 0%, #ffecec 100%) !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .shipping-slovakia-only-notice-text strong {
    display: block !important;
    font-size: 14px !important;
    line-height: 1.35 !important;
    margin-bottom: 4px !important;
    color: #a61b1b !important;
    font-weight: 700 !important;
  }

  .shipping-slovakia-only-notice-text span {
    display: block !important;
    font-size: 13px !important;
    line-height: 1.45 !important;
    color: #7a2c2c !important;
  }

  @media (max-width: 768px) {
    .shipping-slovakia-only-notice-inner {
      padding: 10px 12px !important;
    }

    .shipping-slovakia-only-notice-text strong {
      font-size: 13px !important;
    }

    .shipping-slovakia-only-notice-text span {
      font-size: 12px !important;
    }
  }

  @media (max-width: 480px) {
    .shipping-slovakia-only-notice-inner {
      padding: 9px 10px !important;
    }

    .shipping-slovakia-only-notice-text strong {
      font-size: 12.5px !important;
    }

    .shipping-slovakia-only-notice-text span {
      font-size: 11.5px !important;
    }
  }
  `;
  document.head.appendChild(style);

  function insertSlovakiaShippingNotice() {
    const shippingBox = document.querySelector('#order-shipping-methods');
    if (!shippingBox) {
      var existing = document.querySelector('#shipping-slovakia-only-notice');
      if (existing) existing.remove();
      return;
    }

    if (document.querySelector('#shipping-slovakia-only-notice')) return;

    const notice = document.createElement('div');
    notice.id = 'shipping-slovakia-only-notice';

    notice.innerHTML = `
      <div class="shipping-slovakia-only-notice-inner">
        <div class="shipping-slovakia-only-notice-text">
          <strong>${CFG.title}</strong>
          <span>${CFG.text}</span>
        </div>
      </div>
    `;

    shippingBox.insertAdjacentElement('afterend', notice);
  }

  function initNotice() {
    insertSlovakiaShippingNotice();
    setTimeout(insertSlovakiaShippingNotice, 300);
    setTimeout(insertSlovakiaShippingNotice, 1000);
  }

  document.addEventListener('DOMContentLoaded', initNotice);

  if (!window[OBSERVER_FLAG]) {
    window[OBSERVER_FLAG] = true;
    const onMutate = core.debounce ? core.debounce(insertSlovakiaShippingNotice, 120) : insertSlovakiaShippingNotice;
    const observer = new MutationObserver(function () {
      onMutate();
    });
    const checkoutRoot = document.querySelector("#checkoutContent, #content, .ordering-process") || document.body || document.documentElement;
    observer.observe(checkoutRoot, {
      childList: true,
      subtree: true
    });
  }

})();
