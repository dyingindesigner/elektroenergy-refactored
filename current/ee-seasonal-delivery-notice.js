/* EE seasonal delivery notice. Self-contained; no tracking or external requests. */
(function (root, factory) {
  'use strict';
  var api = factory(["ATM01","ATM02","ATM03","ATM05","ATM07","ATM10","ATM13","CD1","CD2/WX","CD6/WH","CDL20","CDM12","CDM16","CDO1","CDS3","CDX2/WH","CLP50","CMW16","CTH02","DECO5","DLIP8","DLA12W","DLC5M","DLF210/WH","DLF 210/WW","DLF400/WH","DLF400/WW","DLF600/WH","DLF600/WW","DLF200WH","DLF200WW","DLFC600/WH","DLFC600/WW","DLFJ200/WH","DLFJ200/WW","DLFJ200F/WW","DLFJ400/WH","DLFJ400/WW","DLFJ400F/WW","DLI200/WH","DLI 200/WW","DLIC120WH","DLIC120WW","DLT","DRM14","DRM15","DRM16","DRM8","DRM280","G10201","GB 23/RD","KAD01","KAD03","KAD07","KAD07/RD","KAD19PINE","KAD20STAR","KAD27","KAD28","KAD 34","KAD40","KAD45","KAD8","KAF11/WH","KAF 300L 5M","KAF48L","KAF8/F","KAF110WW","KAF200DWH","KAF200DWW","KAF400DWH","KAF400DWW","KAF50DLEDWH","KAF50DLEDWW","KAF50WH","KAF50WW","KAF7WW","KAL02","KBC50","KDA11","KDA30","KDA9","KDC01","KDC02","KDC15/T","KDC 17","KDCA15","KDCA21","KDD31","KDD35","KDD39","KDD45","KDD33","KDD40","KDD42","KDD55","KDD66","KDD76","KID 115","KID211B/WW","KID311","KID312","KID314","KID322","KID323","KID324","KID 331","KID331/WH","KID411","KID412","KID413","KID415","KID502B/M","KID502B/WW","KID503B/M","KID503B/WW","KID65","KID66","KID701","KID701/WW","KID501BWW","KID501WW","KID502M","KID502WW","KID503M","KID503WW","KID507BWW","KID507WW","KII100/M","KII100/P","KII100/T","KII100/WH","KII100/WW","KII100B/M","KII100B/WW","KII200/M","KII200/WH","KII200/WW","KII50/R","KII50B/WW","KIL40C/M","KIN126C/WH","KIN294C/WH","KIN126DWH","KIN126DWW","KIN168DWH","KIN168DWW","KIN210DWH","KIN210DWW","KIN294DWH","KIN294DWW","KIX120LED","KIX80LED","KJL 240","KJL50C","KJL288","KKF158/WH","KKF158/WW","KKF308/M","KKF308/WH","KKF308/WW","KKF608/WH","KKF608/WW","KKF908/WH","KKF908/WW","KKF1200D20M","KKF300D5M","KKF600D10M","KKL200F/WH","KKL200F/WW","KKL1008WH","KKL1008WW","KKL1012DM","KKL1012DWH","KKL1012DWW","KKL508WH","KKL508WW","KKL512DM","KKL512DWH","KKL512DWW","KLG25","KLN160C/WH","KLN240C/WH","KLN240C/WW","KLW21R","KLW21S","KLW32","KLW40","KLW24","KLW25","KMF4/180","KMF7/180","KMF4LED150","KMF4LED180","KMF4LED210","KMF4LED240","KMF60BLED","KMF8LED150","KMF8LED180","KMF8LED210","KMF8LED240","KMF90BLED","KMG270LED","KMK45LED","KMK60LED","KML160","KSF100/WH","KSF200/WH","KSF200/WW","KSF204/WH","KSF204/WW","KSFW200WH","KSFW200WW","KSH5","KSHW5","KSI100/WH","KSI100/WW","KSIW100WH","KSIW100WW","KSIW200WH","KSIW200WW","KT250/BL","KTT5","KTTW","KTTW5","L16KL","L7D","L8E12","LC768/WH","LC768/WW","LED100/A","LED102R/WW/M","LED108C/WH","LED128M","LED128WH","LED128WW","LED158DM","LED158DWH","LED158DWW","LED205WWWH","LED248M","LED248WH","LED248WW","LED305WWWH","LED308DM","LED308DWH","LED308DWW","LED508DM","LED508DWH","LED508DWW","LEDS096V","LEDS108IV-1","LEDS120CV-2","LEDS120DV","LEDS120V-C","LEDS144C-APP","LFF576","LFI240","LFI480","LFI720","LFI960","LFS315","LFS400","LFS410","LKD480TREE","LTN18","MFW120/WW","ML100RGBSMART","ML112RGB","ML120/WW","ML150/WW","ML160/WH","ML160/WW","ML200RGBSMART","ML200/WH","ML200/WW","ML 21/WW","ML23/WW","ML250G/WH","ML250G/WW","ML30/M","ML30/WH","ML30/WW","ML50/M","ML50/WH","ML50/WW","ML80/WH","ML1000WH","ML1000WW","ML1500WH","ML1500WW","ML26M","ML26WH","ML26WW","MLC10/CS","MLC58/M","MLC58/WH","MLC58/WW","MLC20B","MLCS600/M","MLD 20/WW","MLF200/WH","MLF200/WW","MLF240RGBSMART","MLF26/WH","MLF26/WW","MLF300/WW","MLF400/WH","MLF400/WW","MLS6","MRL22/T","MRLC6/S","MRLC6/T","NEON 4","PLM7/T","RLS10WH","RLS10WW","RLS15WH","RLS15WW","RLS5WW","ROPE1","SMF180","TAP10","TRN01","TRN02","TRN04","TRN05","KAF 10/WW","ML 20/WW","KII 100/BL","KII 50/M","KII200B/M","KII50B/M","KII50/BL","KII50/WH","KII50CUBE","KII50/WW","1V001-G","1V04-M","1V04-W","1V04-WW","1V05-M","1V05-W","1V05-WW","1V06-W","1V06-WW","1V07-W","1V07-WW","1V08-RGB","1V09-RGB","1V10","1V11-M","1V11-W","1V11-WW","1V12-WIFI","1V13-WIFI","1V40-WW","1V45-S","1V45-T","1V47","1V50-B","1V50-W","1V50-WW","1V52-B","1V52-W","1V52-WW","1V53-W","1V53-WW","1V54-W","1V54-WW","1V55-W","1V55-WW","1V56-W","1V56-WW","1V57-W","1V57-WW","1V101-M","1V101-W","1V101-WW","1V102-M","1V102-W","1V102-WW","1V110-M","1V110-W","1V110-WW","1V201","1V204","1V215","1V218","1V219","1V220","1V221","1V222","1V223-A","1V224","1V227","1V227-4","1V228","1V232","1V233","1V235","1V236","1V237","1V238","1V239","1V240","1V241","1V244","1V245","1V246","1V248","1V249","1V250","1V251","1V252","1V253","1V255","1V256","1V257","1V258","1V260","1V261","1V262","1V262-G","1V262-S","1V263","1V264","1V265","1V266","1V267","1V268","1V270","1V271","1V272","1V273","1V274","1V275","1V276","1V277","1V278","1V279","1V280","1V281","1V282","1V283","1V284","1V285","1V286","1V287","1V288","1V289","1V290","1V291","1V292","1V293","1V294","1V295","1V296","1V297","1V298","1V299","1V300","1V301","1V302","1V303","1V304","1V305","1V306","1V307","1V308","1V309","1V310","1V311","1V312","1V313","1V401-WW","1V402-CW","1V402-WW","1V403-CW","1V403-WW","1V404-CW","1V404-WW","WL919","WO794","WO794-2","WO795","WO3101","WO3102","WO3103","WO3105","WO3106","WO3107"]);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) api.start(root);
})(typeof window !== 'undefined' ? window : null, function (codes) {
  'use strict';
  var VERSION = '2026-10-30-v1';
  var CLASS = 'ee-seasonal-delivery-notice';
  var MARK = 'data-ee-seasonal-delivery';
  function normalize(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  var known = new Set(codes.map(normalize));
  var patterns = codes.slice().sort(function(a,b){return normalize(b).length-normalize(a).length;}).map(function(code){
    var body=normalize(code).split('').join('[\\s/\\-]*');
    return {code:normalize(code),pattern:new RegExp('(?:^|[^A-Z0-9])'+body+'(?=$|[^A-Z0-9])','i')};
  });
  function knownCode(value) {var n=normalize(value);return known.has(n)?n:null;}
  function codeInText(value) {
    var text=String(value||'');try{text=decodeURIComponent(text);}catch(ignore){}
    for(var i=0;i<patterns.length;i++)if(patterns[i].pattern.test(text))return patterns[i].code;
    return null;
  }
  function schemaSku(value) {
    if(!value||typeof value!=='object')return null;
    var list=Array.isArray(value)?value:(Array.isArray(value['@graph'])?value['@graph']:[value]);
    for(var i=0;i<list.length;i++){
      var p=list[i],type=p&&p['@type'];
      if(type==='Product'||Array.isArray(type)&&type.indexOf('Product')!==-1){if(p.sku||p.mpn)return String(p.sku||p.mpn);}
    }
    return null;
  }
  function directCode(scope) {
    var code=scope.querySelector('.p-code');
    if(code){var text=(code.textContent||'').replace(/^\s*(?:kód(?:\s+produktu)?|sku)\s*:\s*/i,'').trim();if(text)return text;}
    var selectors=['[data-micro="sku"]','meta[itemprop="sku"]','[data-product-code]','[data-sku]','[data-code]'];
    for(var i=0;i<selectors.length;i++){
      var node=scope.querySelector(selectors[i]);if(!node)continue;
      var value=node.getAttribute('data-product-code')||node.getAttribute('data-sku')||node.getAttribute('data-code')||node.getAttribute('content')||node.textContent;
      if(value&&String(value).trim())return String(value).trim();
    }
    return null;
  }
  function pdpCode(scope, doc, dataLayer) {
    var direct=directCode(scope);if(direct)return knownCode(direct);
    var data=Array.isArray(dataLayer)?dataLayer:[];
    for(var i=data.length-1;i>=0;i--){var p=data[i]&&data[i].shoptet&&data[i].shoptet.product;if(p&&p.code)return knownCode(p.code);}
    var scripts=doc.querySelectorAll('script[type="application/ld+json"]');
    for(var j=0;j<scripts.length;j++){try{var sku=schemaSku(JSON.parse(scripts[j].textContent||''));if(sku)return knownCode(sku);}catch(ignore){}}
    return null;
  }
  function start(win) {
    if(win.EE_SEASONAL_DELIVERY_NOTICE){win.EE_SEASONAL_DELIVERY_NOTICE.refresh();return;}
    var doc=win.document,config=win.EE_SEASONAL_DELIVERY_NOTICE_CONFIG||{};
    if(config.enabled===false)return;
    var timer=null,observer=null,stopped=false;
    var events=['ShoptetDOMPageContentLoaded','ShoptetDOMCartLoaded','ShoptetCartUpdated','ShoptetDOMPageMoreProductsLoaded','ShoptetVariantChanged','change'];
    function ensureStyles(){
      if(doc.getElementById('ee-seasonal-delivery-styles'))return;
      var style=doc.createElement('style');style.id='ee-seasonal-delivery-styles';
      style.textContent='.'+CLASS+'{box-sizing:border-box;width:100%;background:#fff8e6;border:1px solid #e6c200;border-radius:6px;padding:12px 14px;margin:12px 0;font-size:14px;line-height:1.5;color:#5c4a00;text-align:left}.'+CLASS+' strong{display:block;margin:0 0 4px;font-size:14px;color:inherit}.'+CLASS+' p{margin:0}.'+CLASS+' ul{margin:8px 0 0;padding-left:20px}';
      doc.head.appendChild(style);
    }
    function clear(context){var n=doc.querySelector('['+MARK+'="'+context+'"]');if(n)n.remove();}
    function notice(context,anchor,message,items){
      var signature=JSON.stringify([message,items||[]]),node=doc.querySelector('['+MARK+'="'+context+'"]');
      if(node&&node.getAttribute('data-ee-signature')===signature){if(node.parentNode!==anchor.parentNode||node.nextElementSibling!==anchor)anchor.parentNode.insertBefore(node,anchor);return;}
      if(node)node.remove();ensureStyles();node=doc.createElement('div');node.className=CLASS;node.setAttribute(MARK,context);node.setAttribute('data-ee-signature',signature);node.setAttribute('role','note');
      var title=doc.createElement('strong');title.textContent=config.title||'Informácia k doručeniu';node.appendChild(title);
      var body=doc.createElement('p');body.textContent=message;node.appendChild(body);
      if(items&&items.length){var list=doc.createElement('ul');items.slice(0,5).forEach(function(item){var li=doc.createElement('li');li.textContent=item.name||item.code;list.appendChild(li);});if(items.length>5){var more=doc.createElement('li');more.textContent='Ďalšie dotknuté produkty: '+(items.length-5);list.appendChild(more);}node.appendChild(list);}
      anchor.parentNode.insertBefore(node,anchor);
    }
    function renderProduct(){
      var scope=doc.querySelector('.p-detail-inner, .p-detail');
      if(!scope){clear('product');return;}
      var code=pdpCode(scope,doc,win.dataLayer);
      var anchor=scope.querySelector('.add-to-cart')||scope.querySelector('[data-testid="buttonAddToCart"]')||scope.querySelector('.price-final');
      if(!code||!anchor||!anchor.parentNode){clear('product');return;}
      notice('product',anchor,config.productMessage||'Doručenie tohto produktu môže trvať 3 až 5 dní.');
    }
    function renderCart(){
      var path=win.location.pathname||'';
      if(!/^\/(?:kosik|cart)(?:\/|$)/i.test(path)){clear('cart');return;}
      var table=doc.querySelector('.cart-table');
      var container=table||doc.querySelector('.cart-content, #cart');
      if(!container){clear('cart');return;}
      var rows=container.querySelectorAll('tr[data-micro="cartItem"], .cart-item, .removeable, tbody tr, .cart-overview-item');
      var found=[],seen=new Set();
      for(var i=0;i<rows.length;i++){
        var row=rows[i],raw=row.getAttribute('data-product-code')||row.getAttribute('data-sku')||row.getAttribute('data-code')||directCode(row),hit=null;
        if(raw)hit=knownCode(raw);
        else {var link=row.querySelector('a[href]');hit=codeInText(link&&link.getAttribute('href'))||codeInText(row.textContent);}
        if(!hit||seen.has(hit))continue;seen.add(hit);
        var name=row.querySelector('.p-name a, a.p-name, .p-name, .main-link')||row.querySelector('a[href]');
        found.push({code:hit,name:name?(name.textContent||'').trim()||hit:hit});
      }
      if(!found.length){clear('cart');return;}
      notice('cart',container,config.cartMessage||'Doručenie niektorých produktov v košíku môže trvať 3 až 5 dní.',found);
    }
    function refresh(){if(stopped)return;renderProduct();renderCart();}
    function schedule(){if(stopped)return;win.clearTimeout(timer);timer=win.setTimeout(refresh,140);}
    function ownMutation(record){
      var element=record.target.nodeType===1?record.target:record.target.parentElement;
      if(element&&(element.closest('['+MARK+']')||element.id==='ee-seasonal-delivery-styles'))return true;
      var nodes=[].slice.call(record.addedNodes||[]).concat([].slice.call(record.removedNodes||[]));
      return nodes.length>0&&nodes.every(function(n){return n.nodeType===1&&(n.hasAttribute(MARK)||n.id==='ee-seasonal-delivery-styles');});
    }
    function boot(){
      if(stopped)return;refresh();
      events.forEach(function(event){doc.addEventListener(event,schedule);});
      win.addEventListener('popstate',schedule);
      if(win.MutationObserver){observer=new win.MutationObserver(function(records){if(records.some(function(r){return !ownMutation(r);}))schedule();});observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-product-code','data-sku','data-code','content']});}
    }
    win.EE_SEASONAL_DELIVERY_NOTICE={version:VERSION,refresh:schedule,destroy:function(){stopped=true;win.clearTimeout(timer);if(observer)observer.disconnect();events.forEach(function(event){doc.removeEventListener(event,schedule);});doc.removeEventListener('DOMContentLoaded',boot);win.removeEventListener('popstate',schedule);clear('product');clear('cart');}};
    if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  }
  return {normalize:normalize,knownCode:knownCode,codeInText:codeInText,schemaSku:schemaSku,pdpCode:pdpCode,start:start,codes:codes.slice()};
});
