/* Logos Cloud Edge — landing page behaviour.
   Plain script (no modules) so the page also works when opened from disk. */
(function () {
  'use strict';

  var root = document.documentElement;
  var SALES_EMAIL = 'sales@logoswebsiteservices.com';
  var UGX_PER_USD = 3650; // indicative rate, shown to the visitor
  var DEFAULT_NAME = "Joy's Beauty Salon";
  var KEYS = { theme: 'logos-theme', currency: 'logos-currency' };

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
    var dark = currentTheme() === 'dark';
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(dark));
    if (root.hasAttribute('data-theme')) {
      themeMetas.forEach(function (m) { m.setAttribute('content', dark ? '#0F131B' : '#EEF1EC'); });
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
     Header: border on scroll, mobile menu, current section
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
     Fit: condense the lettering first, shrink it only if needed.
     Like a signwriter running out of board, the variable "wdth" axis of
     Anybody narrows before the size drops.
     --------------------------------------------------------------------- */
  var fitTargets = $$('[data-fit]');
  root.classList.add('fit-on'); // lettering may now stay on one line: we fit it

  function fit(el, animate) {
    var text = $('[data-fit-text]', el) || el.firstElementChild;
    if (!text) return;

    var maxW = parseFloat(el.getAttribute('data-fit-max')) || 120;
    var minW = parseFloat(el.getAttribute('data-fit-min')) || 60;
    var minScale = parseFloat(el.getAttribute('data-fit-min-scale')) || 0.45;

    var from = {
      w: el.style.getPropertyValue('--wdth'),
      s: el.style.getPropertyValue('--fit')
    };

    el.classList.add('is-measuring');
    el.classList.remove('is-wrapped');

    var avail = el.clientWidth;
    if (!avail) { el.classList.remove('is-measuring'); return; }

    function set(w, s) {
      el.style.setProperty('--wdth', String(w));
      el.style.setProperty('--fit', String(s));
    }
    function width() { return text.getBoundingClientRect().width; }

    var w = maxW;
    var s = 1;
    var wrap = false;

    set(maxW, 1);
    if (width() > avail) {
      set(minW, 1);
      var atMin = width();
      if (atMin > avail) {
        w = minW;
        s = avail / atMin;
        if (s < minScale) { s = minScale; wrap = true; }
      } else {
        var lo = minW;
        var hi = maxW;
        for (var i = 0; i < 7; i++) {
          var mid = (lo + hi) / 2;
          set(mid, 1);
          if (width() <= avail) lo = mid; else hi = mid;
        }
        w = Math.floor(lo * 10) / 10;
      }
    }

    s = Math.floor(s * 1000) / 1000;

    if (animate && !reduceMotion.matches && from.w) {
      set(from.w, from.s || 1);
      void el.offsetWidth; // commit the start values
      el.classList.remove('is-measuring');
      set(w, s);
    } else {
      set(w, s);
      void el.offsetWidth;
      el.classList.remove('is-measuring');
    }
    el.classList.toggle('is-wrapped', wrap);
  }

  var fitQueued = false;
  var fitAnimated = false;
  function requestFit(animate) {
    fitAnimated = fitAnimated || !!animate;
    if (fitQueued) return;
    fitQueued = true;
    window.requestAnimationFrame(function () {
      fitQueued = false;
      var a = fitAnimated;
      fitAnimated = false;
      fitTargets.forEach(function (el) { fit(el, a); });
    });
  }

  // Refit when a box changes width (not height, which the fit itself changes).
  // The CSS keeps these boxes independent of their text; the budget below is
  // a safety net so a layout regression can never turn into a refit loop.
  if ('ResizeObserver' in window) {
    var widths = new WeakMap();
    var budget = { count: 0, since: 0 };
    var ro = new ResizeObserver(function (entries) {
      var changed = false;
      entries.forEach(function (entry) {
        var wNow = Math.round(entry.contentRect.width);
        if (widths.get(entry.target) !== wNow) {
          widths.set(entry.target, wNow);
          changed = true;
        }
      });
      if (!changed) return;
      var now = Date.now();
      if (now - budget.since > 1000) { budget.since = now; budget.count = 0; }
      if (++budget.count > 30) { ro.disconnect(); return; }
      requestFit(false);
    });
    fitTargets.forEach(function (el) { ro.observe(el); });
  } else {
    window.addEventListener('resize', function () { requestFit(false); });
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
      return { cur: 'UGX', num: ugxFmt.format(ugx), sep: ' ' };
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
      requestFit(true);
    });
  });

  /* ---------------------------------------------------------------------
     The signboard: business name -> lettering, slug, domain, email
     --------------------------------------------------------------------- */
  var form = $('[data-checker]');
  var nameInput = $('#biz-name');
  var signName = $('[data-sign-name]');
  var ctaMail = $('[data-cta-mail]');
  var tld = 'co.ug';

  function slugify(value) {
    return value
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/['’`]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 63);
  }

  function currentName() {
    var raw = nameInput ? nameInput.value.trim() : '';
    return raw || 'Your business';
  }

  function currentDomain() {
    var slug = slugify(nameInput ? nameInput.value : '') || 'yourbusiness';
    return { slug: slug, full: slug + '.' + tld };
  }

  function renderName(animate) {
    var name = currentName();
    var domain = currentDomain();

    if (signName) signName.textContent = name;
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

    if (ctaMail) {
      ctaMail.href = 'mailto:' + SALES_EMAIL +
        '?subject=' + encodeURIComponent('Website for ' + name) +
        '&body=' + encodeURIComponent('Hello Logos team,\n\nI would like to put ' + domain.full + ' online. Please call me back about the next steps.\n\nThank you.');
    }
    requestFit(animate);
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () { renderName(true); });
  }

  $$('input[name="tld"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      tld = radio.value;
      $$('.tld').forEach(function (row) {
        row.classList.toggle('is-selected', row.contains(radio));
      });
      renderName(true);
    });
    if (radio.checked) tld = radio.value;
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var domain = currentDomain();
      var subject = 'Domain request: ' + domain.full;
      var body = 'Hello Logos team,\n\nI would like to register ' + domain.full +
        ' for ' + currentName() + '.\nPlease confirm that it is available and send me the next steps.\n\nThank you.';
      window.location.href = 'mailto:' + SALES_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // Links that send the visitor back to the sign focus the name field
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
  renderPrices();
  renderName(false);
  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(function () { requestFit(false); });
    if (document.fonts.addEventListener) {
      document.fonts.addEventListener('loadingdone', function () { requestFit(false); });
    }
  }
})();
