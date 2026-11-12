/* Logos Cloud Edge — landing page behaviour.
   Plain script (no modules) so the page also works when opened from disk. */
(function () {
  'use strict';

  var root = document.documentElement;
  var SALES_EMAIL = 'sales@logoswebsiteservices.com';
  var UGX_PER_USD = 3650; // indicative rate, shown to the visitor
  var KEYS = { theme: 'logos-theme', currency: 'logos-currency' };
  // Browser bar colour = header colour of each theme
  var THEME_COLORS = { light: '#0F172A', dark: '#0A101E' };

  // Domains: yearly list prices in US dollars, before the discount.
  // The discount applies to every domain; every price shown is derived from here.
  var DOMAIN_DISCOUNT = 0.10;
  var TLD_PRICES = { 'co.ug': 30, 'ug': 30, 'com': 13, 'org': 15 };
  var DEFAULT_SLUG = 'yourbusiness';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------------
     Theme toggle
     --------------------------------------------------------------------- */
  var themeBtn = $('[data-theme-toggle]');
  var themeMetas = $$('meta[name="theme-color"]');

  function currentTheme() {
    return root.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light');
  }

  function syncTheme() {
    var theme = currentTheme();
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    if (root.hasAttribute('data-theme')) {
      themeMetas.forEach(function (m) { m.setAttribute('content', THEME_COLORS[theme]); });
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set(KEYS.theme, next);
      syncTheme();
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------------------------------------------------------------------
     Header: shadow on scroll, mobile menu, current section
     --------------------------------------------------------------------- */
  var header = $('[data-header]');
  var navToggle = $('[data-nav-toggle]');
  var navList = $('#nav-list');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setNav(open) {
    if (!navToggle || !header) return;
    navToggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('nav-open', open);
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });
    var desktop = window.matchMedia('(min-width: 820px)');
    var closeOnDesktop = function (e) { if (e.matches) setNav(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
  }

  if ('IntersectionObserver' in window && navList) {
    var links = $$('a[href^="#"]', navList);
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-current'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    ['top', 'services', 'packages', 'week', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

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
  var currencyNote = $('[data-currency-note]');

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
    if (currencyNote) currencyNote.hidden = currency !== 'UGX';
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

  /* ---------------------------------------------------------------------
     Domain search: business name + ending -> address, price, email
     --------------------------------------------------------------------- */
  var form = $('[data-search]');
  var field = $('[data-search-field]');
  var nameInput = $('#biz-name');
  var tldSelect = $('[data-tld-select]');
  var endingBtns = $$('[data-ending]');
  var wasEl = $('[data-price-was]');
  var nowEl = $('[data-price-now]');
  var errorEl = $('[data-search-error]');
  var ctaMail = $('[data-cta-mail]');
  var tld = tldSelect && TLD_PRICES[tldSelect.value] ? tldSelect.value : 'co.ug';

  function discounted(usd) {
    return Math.round(usd * (1 - DOMAIN_DISCOUNT) * 100) / 100;
  }

  function slugify(value) {
    return value
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/['’`]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 63);
  }

  function typedName() {
    return nameInput ? nameInput.value.trim() : '';
  }

  function currentDomain() {
    var slug = slugify(typedName());
    var safe = slug || DEFAULT_SLUG;
    return { slug: safe, full: safe + '.' + tld, typed: slug !== '' };
  }

  // Every ending's price comes from TLD_PRICES, so the HTML values are only a no-JS fallback
  endingBtns.forEach(function (btn) {
    var list = TLD_PRICES[btn.getAttribute('data-ending')];
    var price = $('[data-usd]', btn);
    if (price && list) price.setAttribute('data-usd', String(discounted(list)));
  });

  function renderDomain() {
    var domain = currentDomain();
    var name = typedName();

    root.classList.toggle('no-name', !domain.typed);
    root.style.setProperty('--len', String(domain.slug.length));

    $$('[data-slug]').forEach(function (el) { el.textContent = domain.slug; });
    $$('[data-tld]').forEach(function (el) { el.textContent = '.' + tld; });
    $$('[data-domain]').forEach(function (el) { el.textContent = domain.full; });
    $$('[data-email]').forEach(function (el) {
      // let long addresses wrap after the @ and before the ending, not mid-word
      el.replaceChildren(
        'hello@', document.createElement('wbr'),
        domain.slug, document.createElement('wbr'),
        '.' + tld
      );
    });

    if (wasEl) wasEl.setAttribute('data-usd', String(TLD_PRICES[tld]));
    if (nowEl) nowEl.setAttribute('data-usd', String(discounted(TLD_PRICES[tld])));
    renderPrices();

    if (ctaMail) {
      var subject = domain.typed ? 'Website for ' + name : 'Website for my business';
      var body = domain.typed
        ? 'Hello Logos team,\n\nI would like to put ' + domain.full + ' online. Please call me back about the next steps.\n\nThank you.'
        : 'Hello Logos team,\n\nI would like to put my business online. Please call me back about the next steps.\n\nThank you.';
      ctaMail.href = 'mailto:' + SALES_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    }
  }

  function syncEndings() {
    endingBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-ending') === tld));
    });
  }

  function swapAnimation() {
    $$('[data-tld-swap]').forEach(function (el) {
      el.classList.remove('is-swapping');
      void el.offsetWidth; // restart the animation
      el.classList.add('is-swapping');
    });
  }

  function setTld(next) {
    if (!TLD_PRICES[next] || next === tld) return;
    tld = next;
    if (tldSelect && tldSelect.value !== next) tldSelect.value = next;
    syncEndings();
    renderDomain();
    swapAnimation();
  }

  function showError(message) {
    if (!errorEl || !nameInput) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
    nameInput.setAttribute('aria-invalid', 'true');
    nameInput.setAttribute('aria-describedby', 'search-error search-help');
    if (field) field.classList.add('is-invalid');
  }

  function clearError() {
    if (!errorEl || errorEl.hidden || !nameInput) return;
    errorEl.hidden = true;
    errorEl.textContent = '';
    nameInput.removeAttribute('aria-invalid');
    nameInput.setAttribute('aria-describedby', 'search-help');
    if (field) field.classList.remove('is-invalid');
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      clearError();
      renderDomain();
    });
  }

  if (tldSelect) {
    tldSelect.addEventListener('change', function () { setTld(tldSelect.value); });
  }

  endingBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setTld(btn.getAttribute('data-ending')); });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = typedName();
      var domain = currentDomain();

      if (!name) {
        showError('Type your business name first.');
        nameInput.focus();
        return;
      }
      if (!domain.typed) {
        showError('Use letters or numbers: a domain cannot be made of symbols only.');
        nameInput.focus();
        return;
      }
      clearError();

      var price = formatPrice(discounted(TLD_PRICES[tld]), 'USD');
      var subject = 'Domain request: ' + domain.full;
      var body = 'Hello Logos team,\n\nI would like to register ' + domain.full + ' for ' + name +
        ' (' + price.cur + price.num + ' a year with the ' + Math.round(DOMAIN_DISCOUNT * 100) + '% domain discount).\n' +
        'Please confirm that it is available and send me the next steps.\n\nThank you.';
      window.location.href = 'mailto:' + SALES_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // Links that send the visitor back to the search focus the name field
  $$('[data-focus-name]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (!nameInput) return;
      e.preventDefault();
      nameInput.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
      nameInput.focus({ preventScroll: true });
      nameInput.select();
    });
  });

  /* ---------------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    root.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Start
     --------------------------------------------------------------------- */
  syncEndings();
  renderDomain(); // also renders every price in the saved currency
})();
