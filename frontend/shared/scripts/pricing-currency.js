/* pricing-currency.js — formats every [data-usd] price in US dollars or
   Ugandan shillings and renders the result.
   IMPORTANT: renderPrices() and the "currency" variable declared here are
   called unconditionally by renderDomain() in business-name-domain.js
   (the next fragment), even on pages that show no currency switch in their
   HTML — so this file must be present on every page, not only pages with a
   visible currency toggle.
   - [data-currency] (set on root/<html>): read by shared/styles/packages.css
     to size .plan__amount/.price__cur differently for Shillings. */

  /* ---------------------------------------------------------------------
     Prices: US dollars or Ugandan shillings
     --------------------------------------------------------------------- */
  var usdFmt2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var usdFmt0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  var ugxFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  function formatPrice(usd, currency) {
    if (currency === 'UGX') {
      var ugx = Math.round((usd * UGX_PER_USD) / 100) * 100;
      return { cur: 'UGX', num: ugxFmt.format(ugx), sep: ' ' };
    }
    return { cur: '$', num: (usd % 1 ? usdFmt2 : usdFmt0).format(usd), sep: '' };
  }

  var currency = store.get(KEYS.currency) === 'UGX' ? 'UGX' : 'USD';
  var currencyNotes = $$('[data-currency-note]');

  function renderPrices() {
    root.setAttribute('data-currency', currency);
    $$('[data-usd]').forEach(function (el) {
      var p = formatPrice(parseFloat(el.getAttribute('data-usd')), currency);
      if (el.hasAttribute('data-price-split')) {
        var cur = document.createElement('span');
        cur.className = 'price__cur';
        cur.textContent = p.cur;
        el.replaceChildren(cur, document.createTextNode(p.num));
      } else {
        el.textContent = p.cur + p.sep + p.num;
      }
    });
    currencyNotes.forEach(function (note) { note.hidden = currency !== 'UGX'; });
  }

  $$('input[name="currency"]').forEach(function (input) {
    input.checked = input.value === currency;
    input.addEventListener('change', function () {
      if (!input.checked) return;
      currency = input.value;
      store.set(KEYS.currency, currency);
      renderPrices();
    });
  });
