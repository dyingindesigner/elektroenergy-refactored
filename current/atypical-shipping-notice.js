/**
 * Soft notice: atypická doprava (feed: ATYPICAL_SHIPPING=1).
 * Vložiť do Shoptet: Vzhľad a obsah → Editor → HTML kód → Pätička.
 *
 * Konfigurácia (pred načítaním tohto súboru alebo hneď po):
 *   window.EE_ATYPICAL_SHIPPING = {
 *     codes: ['178816','283031', ...],  // povinné pole kódov
 *     messageTitle: '...',
 *     messageBody: '...',
 *     debug: false
 *   };
 *
 * Alternatíva: načítať kódy z JSON (po nahratí na FTP /user/documents/):
 *   window.EE_ATYPICAL_SHIPPING_JSON_URL = 'https://cdn.myshoptet.com/.../atypical-shipping-codes.json';
 *   (očakáva sa tvar { "codes": ["..."] } alebo pole z extract skriptu)
 */
(function () {
  'use strict';
  var core = window.EE_CORE || {};
  // EE-only additions; the existing shared JSON list remains unchanged.
  var EXTRA_CODES = ["LKD480TREE","KMF4LED240","KMF8LED240","KMF4LED210","KMF8LED210","KMF4/180","KMF7/180","KMF4LED180","KMF8LED180","SMF180","KMF4LED150","KMF8LED150"];
  function normalizeSku(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function codeFromText(value, set) {
    var text=String(value||'');try{text=decodeURIComponent(text);}catch(ignore){}
    var ordered=Array.from(set).sort(function(a,b){return b.length-a.length;});
    for(var i=0;i<ordered.length;i++){var pattern='(?:^|[^A-Z0-9])'+ordered[i].split('').join('[\\s/\\-]*')+'(?=$|[^A-Z0-9])';if(new RegExp(pattern,'i').test(text))return ordered[i];}
    return null;
  }

  var CFG = window.EE_ATYPICAL_SHIPPING || {};
  var NOTICE_CLASS = 'ee-atypical-shipping-notice';
  var DATA_ATTR = 'data-ee-atyp-notice';
  var LAST_PDP_PATH = null;
  var CONTACT_PHONE = CFG.contactPhone || '+421908134795';
  var CONTACT_EMAIL = CFG.contactEmail || 'info@elektroenergy.sk';

  function log() {
    if (CFG.debug) {
      console.log.apply(console, ['[EE atyp]'].concat([].slice.call(arguments)));
    }
  }

  function normalizeCodes(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === 'object' && Array.isArray(raw.codes)) return raw.codes.map(String);
    return [];
  }

  function codeSet() {
    return new Set(normalizeCodes(CFG.codes).map(normalizeSku));
  }

  function currentPath() {
    if (window.__EE_TEST_PATH__ !== undefined && window.__EE_TEST_PATH__ !== null) {
      return String(window.__EE_TEST_PATH__);
    }
    return window.location.pathname || '';
  }

  function extractCodeFromPathname(path) {
    var m = path.match(/(?:^|\/)([A-Za-z]{2}-\d+|\d{5,})(?:\/|$|\?|#)/);
    if (m) return m[1];
    m = path.match(/-(\d{5,})\/?$/);
    return m ? m[1] : null;
  }

  function isAtypicalCode(code, set) {
    if (!code || !set.size) return false;
    return set.has(normalizeSku(code));
  }

  function ensureStyles() {
    if (document.getElementById('ee-atyp-shipping-styles')) return;
    var s = document.createElement('style');
    s.id = 'ee-atyp-shipping-styles';
    s.textContent =
      '.' +
      NOTICE_CLASS +
      '{background:#fff8e6;border:1px solid #e6c200;border-radius:6px;padding:12px 14px;margin:12px 0;font-size:14px;line-height:1.45;color:#5c4a00;}' +
      '.' +
      NOTICE_CLASS +
      ' strong{display:block;margin-bottom:4px;}' +
      '.' +
      NOTICE_CLASS +
      ' a{color:#5c4a00;text-decoration:underline;}' +
      '.' +
      NOTICE_CLASS +
      ' ul{margin:8px 0 0 18px;padding:0;}';
    document.head.appendChild(s);
  }

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function normalizePhoneForHref(phone) {
    return String(phone || '').replace(/[^\d+]/g, '');
  }

  function contactLinksHtml() {
    var telHref = normalizePhoneForHref(CONTACT_PHONE);
    return (
      '<a href="tel:' +
      escapeHtml(telHref) +
      '">' +
      escapeHtml(CONTACT_PHONE) +
      '</a> alebo <a href="mailto:' +
      escapeHtml(CONTACT_EMAIL) +
      '">' +
      escapeHtml(CONTACT_EMAIL) +
      '</a>'
    );
  }

  function defaultProductBody() {
    var compact = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
    if (compact) {
      return 'Atypická doprava. Cena a spôsob doručenia na dohode (' + contactLinksHtml() + ').';
    }
    return (
      'Tento produkt má atypickú dopravu. Spôsob a cena doručenia sú na dohode (' +
      contactLinksHtml() +
      ').'
    );
  }

  function buildNotice(bodyHtml, attrValue) {
    var div = document.createElement('div');
    div.className = NOTICE_CLASS;
    div.setAttribute(DATA_ATTR, attrValue || '1');
    div.innerHTML =
      '<strong>' +
      (CFG.messageTitle || 'Upozornenie k doprave') +
      '</strong>' +
      (bodyHtml || CFG.messageBody || defaultProductBody()) +
      '<div style="margin-top:8px"><a href="/kontakty" style="display:inline-block;padding:7px 11px;border:1px solid #b89200;border-radius:6px;text-decoration:none">Kontaktovať obchod</a></div>';
    return div;
  }

  function productCodeFromStructuredData() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      try {
        var text = scripts[i].textContent || "";
        if (!text) continue;
        var obj = JSON.parse(text);
        var list = Array.isArray(obj) ? obj : [obj];
        for (var j = 0; j < list.length; j++) {
          var item = list[j] || {};
          var sku = item.sku || item.productID || item.mpn;
          if (sku) return String(sku).trim();
        }
      } catch (e) {}
    }
    return null;
  }

  function productCodeFromDataAttributes(scope) {
    scope=scope||document.querySelector('.p-detail-inner, .p-detail')||document;
    var label=scope.querySelector('.p-code');
    if(label){var direct=(label.textContent||'').replace(/^\s*(?:kód(?:\s+produktu)?|sku)\s*:\s*/i,'').trim();if(direct)return direct;}
    var attrs=['meta[itemprop="sku"]','[data-micro="sku"]','[data-product-code]','[data-sku]','[data-code]'];
    for(var i=0;i<attrs.length;i++){
      var el=scope.querySelector(attrs[i]);if(!el)continue;
      var value=el.getAttribute('data-product-code')||el.getAttribute('data-sku')||el.getAttribute('data-code')||el.getAttribute('content')||el.textContent;
      if(value&&String(value).trim())return String(value).trim();
    }
    return null;
  }

  function initPDP(set) {
    var pathKey = currentPath();

    var code =
      productCodeFromDataAttributes() ||
      productCodeFromStructuredData() ||
      extractCodeFromPathname(currentPath()) ||
      (function () {
        var el = document.querySelector('.detail-parameters th');
        var nodes = document.querySelectorAll('th, td, .dkLabFavouriteProductDetailParameterName, .parameter-name');
        for (var i = 0; i < nodes.length; i++) {
          var t = (nodes[i].textContent || '').trim();
          if (/kód produktu/i.test(t)) {
            var row = nodes[i].closest('tr');
            if (row) {
              var td = row.querySelector('td');
              if (td) return (td.textContent || '').trim();
            }
          }
        }
        return null;
      })();
    log('PDP code', code);
    var oldNote=document.querySelector('['+DATA_ATTR+'="pdp"]');
    if (!isAtypicalCode(code,set)){if(oldNote)oldNote.remove();return;}
    var key=pathKey+'|'+normalizeSku(code);
    if(LAST_PDP_PATH===key&&oldNote)return;
    if(oldNote)oldNote.remove();

    var anchor =
      document.querySelector('.p-detail-inner .add-to-cart') ||
      document.querySelector('.add-to-cart .add-to-cart-button') ||
      document.querySelector('.add-to-cart button[type="submit"]') ||
      document.querySelector('button[data-testid="buttonAddToCart"]') ||
      document.querySelector('.dkLabAddProductDetailToCart') ||
      document.querySelector('button[type="submit"][name*="amount"]') ||
      document.querySelector('.price-final');

    ensureStyles();
    var note = buildNotice(null, 'pdp');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(note, anchor);
    } else {
      var wrap = document.querySelector('.p-detail-inner') || document.querySelector('main') || document.body;
      wrap.insertBefore(note, wrap.firstChild);
    }
    LAST_PDP_PATH = key;
  }

  function collectCartAtypicalItems(container,set) {
    var rows=container.querySelectorAll((CFG.cartRowSelectors||['tr[data-micro="cartItem"]','.cart-item','.removeable','.cart-table tbody tr','.cart-overview-item','[data-testid="cartWidgetProduct"]']).join(','));
    if(!rows.length)rows=container.querySelectorAll('tbody tr');
    var items=[],seen=new Set();
    for(var i=0;i<rows.length;i++){
      var row=rows[i],link=row.querySelector('.p-name a, a.p-name, .main-link, a[href]');
      var href=link?link.getAttribute('href')||'':'';
      var raw=row.getAttribute('data-product-code')||row.getAttribute('data-sku')||row.getAttribute('data-code')||productCodeFromDataAttributes(row);
      var hit=raw?(isAtypicalCode(raw,set)?normalizeSku(raw):null):codeFromText(href,set)||codeFromText(row.textContent,set);
      if(!hit||seen.has(hit))continue;seen.add(hit);
      items.push({code:hit,name:link?(link.textContent||'').trim():raw||hit,href:href});
    }
    return items;
  }

  function buildCartBody(items) {
    var intro =
      items.length === 1
        ? 'V košíku máte produkt s atypickou dopravou:'
        : 'V košíku máte produkty s atypickou dopravou:';
    var list = '<ul>';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var safeName = escapeHtml(item.name || item.code);
      if (item.href) {
        list += '<li><a href="' + escapeHtml(item.href) + '">' + safeName + '</a></li>';
      } else {
        list += '<li>' + safeName + '</li>';
      }
    }
    list += '</ul>';
    return intro + list + 'Spôsob a cena doručenia sú na dohode (' + contactLinksHtml() + ').';
  }

  function initCart(set) {
    var oldBanner=document.querySelector('['+DATA_ATTR+'="cart"]');
    var container =
      document.querySelector('.cart-table') ||
      document.querySelector('.cart-content') ||
      document.querySelector('#cart') ||
      document.body;
    var items = collectCartAtypicalItems(container, set);
    if(!items.length){if(oldBanner)oldBanner.remove();return;}
    var signature=JSON.stringify(items);
    if(oldBanner&&oldBanner.getAttribute('data-ee-atyp-items')===signature)return;
    if(oldBanner)oldBanner.remove();

    ensureStyles();
    var banner = buildNotice(CFG.cartMessageBody || buildCartBody(items), 'cart');
    banner.setAttribute('data-ee-atyp-items',signature);
    var summary = document.querySelector('.cart-summary, .co-box, .cart-buttons');
    if (summary && summary.parentNode) {
      summary.parentNode.insertBefore(banner, summary);
    } else {
      container.insertBefore(banner, container.firstChild);
    }
  }

  function run(set) {
    var path = currentPath();
    if (/\/kosik\/?$/i.test(path) || /\/cart\/?$/i.test(path)) {
      initCart(set);
    } else if (/\/detail\//i.test(path) || /-\d{5,}\/?$/i.test(path) || document.querySelector('.type-product')) {
      initPDP(set);
    }
  }

  function scheduleRun(set) {
    var fn = function () {
      run(set);
    };
    return core.debounce ? core.debounce(fn, 140) : fn;
  }

  function startWithCodes(codes) {
    CFG.codes = normalizeCodes(codes).concat(EXTRA_CODES,normalizeCodes(CFG.extraCodes));
    var set = codeSet();
    log('codes loaded', set.size);
    if (!set.size) {
      log('no codes, skip');
      return;
    }
    var runNow = scheduleRun(set);
    runNow();
    document.addEventListener('ShoptetDOMPageContentLoaded', runNow);
    document.addEventListener('ShoptetDOMCartLoaded', runNow);
    document.addEventListener('ShoptetCartUpdated', runNow);
  }

  function loadJsonThen(cb) {
    var url = window.EE_ATYPICAL_SHIPPING_JSON_URL;
    if (!url) {
      cb([]);
      return;
    }
    fetch(url, { credentials: 'omit', mode: 'cors' })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var codes = normalizeCodes(data);
        cb(codes);
      })
      .catch(function (e) {
        log('fetch json failed', e);
        cb([]);
      });
  }

  window.EE_initAtypicalShippingNotice = function () {
    if (normalizeCodes(CFG.codes).length) {
      startWithCodes(CFG.codes);
      return;
    }
    loadJsonThen(function (codes) {
      startWithCodes(codes);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.EE_initAtypicalShippingNotice);
  } else {
    window.EE_initAtypicalShippingNotice();
  }
})();
