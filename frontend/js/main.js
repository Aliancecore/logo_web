/* Logos Cloud Edge — behaviour shared by every page.
   Plain script (no modules) so the pages also work when opened from disk.
   Each block below only runs if its elements exist on the page. */
(function () {
  'use strict';

  var root = document.documentElement;
  var SALES_EMAIL = 'sales@logoswebsiteservices.com';
  var UGX_PER_USD = 3650; // indicative rate, shown to the visitor
  // theme and currency are preferences (kept); name and ending are what the
  // visitor typed (kept for this tab only, so every page shows their business)
  var KEYS = { theme: 'logos-theme', currency: 'logos-currency', name: 'logos-name', tld: 'logos-tld' };
  // Browser bar colour = header colour of each theme
  var THEME_COLORS = { light: '#0F172A', dark: '#0A101E' };

  // Domains: yearly list prices in US dollars, before the discount.
  // The discount applies to every domain; every first-year price shown is derived from here.
  var DOMAIN_DISCOUNT = 0.10;
  var TLD_PRICES = { 'co.ug': 30, 'ug': 30, 'com': 13, 'org': 15 };
  var DEFAULT_SLUG = 'yourbusiness';
  var DEFAULT_NAME = 'Your business';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function safeStore(area) {
    return {
      get: function (k) { try { return window[area].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[area].setItem(k, v); } catch (e) { /* private mode */ } }
    };
  }
  var store = safeStore('localStorage');
  var session = safeStore('sessionStorage');

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
     Header: shadow on scroll, mobile menu
     The current page is marked in the HTML (aria-current="page").
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
    // same breakpoint as the CSS: from 1024px the seven links sit in the bar
    var desktop = window.matchMedia('(min-width: 1024px)');
    var closeOnDesktop = function (e) { if (e.matches) setNav(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
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

  /* ---------------------------------------------------------------------
     Your business name, on every page
     Typed in the domain search (home, domains) or in the small name field
     under each sample (websites, hosting, email, marketing). Whatever is
     typed fills [data-name], [data-slug], [data-tld], [data-domain],
     [data-email] and [data-initial] on the page, and follows the visitor
     to the next page.
     --------------------------------------------------------------------- */
  var form = $('[data-search]');
  var field = $('[data-search-field]');
  var nameInput = $('#biz-name');          // the domain search field
  var nameInputs = $$('[data-name-input]'); // every field that holds the name
  var tldSelect = $('[data-tld-select]');
  var endingBtns = $$('[data-ending]');
  var wasEl = $('[data-price-was]');
  var nowEl = $('[data-price-now]');
  var errorEl = $('[data-search-error]');

  var savedTld = session.get(KEYS.tld);
  var tld = TLD_PRICES[savedTld] ? savedTld
    : (tldSelect && TLD_PRICES[tldSelect.value] ? tldSelect.value : 'co.ug');
  if (tldSelect) tldSelect.value = tld;

  // The saved name wins over a value the browser may restore on "Back"
  var bizName = session.get(KEYS.name);
  if (bizName === null) bizName = nameInputs.length ? nameInputs[0].value : '';
  nameInputs.forEach(function (input) { input.value = bizName; });

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
    return bizName.trim();
  }

  function currentDomain() {
    var slug = slugify(typedName());
    var safe = slug || DEFAULT_SLUG;
    return { slug: safe, full: safe + '.' + tld, typed: slug !== '' };
  }

  // Every domain price comes from TLD_PRICES, so the HTML values are only a no-JS fallback
  endingBtns.forEach(function (btn) {
    var list = TLD_PRICES[btn.getAttribute('data-ending')];
    var price = $('[data-usd]', btn);
    if (price && list) price.setAttribute('data-usd', String(discounted(list)));
  });
  $$('[data-price-of]').forEach(function (el) {
    var list = TLD_PRICES[el.getAttribute('data-price-of')];
    if (list) el.setAttribute('data-usd', String(discounted(list)));
  });
  $$('[data-list-of]').forEach(function (el) {
    var list = TLD_PRICES[el.getAttribute('data-list-of')];
    if (list) el.setAttribute('data-usd', String(list));
  });

  function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // A pre-filled email to sales; the topic comes from data-mail-topic ("" on the home page)
  function mailHref(topic) {
    var domain = currentDomain();
    var name = typedName();
    var who = domain.typed ? name : 'my business';
    var subject = (topic ? capitalise(topic) : 'Website') + ' for ' + who;
    var ask = topic
      ? 'I would like ' + topic + ' for ' + (domain.typed ? name + ' (' + domain.full + ')' : 'my business') + '.'
      : 'I would like to put ' + (domain.typed ? domain.full : 'my business') + ' online.';
    var body = 'Hello Logos team,\n\n' + ask + ' Please call me back about the next steps.\n\nThank you.';
    return 'mailto:' + SALES_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function renderDomain() {
    var domain = currentDomain();
    var name = typedName();

    root.classList.toggle('no-name', !domain.typed);
    root.style.setProperty('--len', String(domain.slug.length));

    $$('[data-slug]').forEach(function (el) { el.textContent = domain.slug; });
    $$('[data-tld]').forEach(function (el) { el.textContent = '.' + tld; });
    $$('[data-domain]').forEach(function (el) { el.textContent = domain.full; });
    $$('[data-name]').forEach(function (el) { el.textContent = domain.typed ? name : DEFAULT_NAME; });
    $$('[data-initial]').forEach(function (el) {
      el.textContent = (domain.typed ? name : DEFAULT_NAME).charAt(0).toUpperCase();
    });
    $$('[data-email]').forEach(function (el) {
      // let long addresses wrap after the @ and before the ending, not mid-word
      el.replaceChildren(
        (el.getAttribute('data-email') || 'hello') + '@', document.createElement('wbr'),
        domain.slug, document.createElement('wbr'),
        '.' + tld
      );
    });

    if (wasEl) wasEl.setAttribute('data-usd', String(TLD_PRICES[tld]));
    if (nowEl) nowEl.setAttribute('data-usd', String(discounted(TLD_PRICES[tld])));
    renderPrices();

    $$('[data-mail-topic]').forEach(function (link) {
      link.href = mailHref(link.getAttribute('data-mail-topic'));
    });
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
    session.set(KEYS.tld, tld);
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

  nameInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      bizName = input.value;
      session.set(KEYS.name, bizName);
      nameInputs.forEach(function (other) { if (other !== input) other.value = bizName; });
      if (input === nameInput) clearError();
      renderDomain();
    });
  });

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

  function focusField(input) {
    input.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    input.focus({ preventScroll: true });
    input.select();
  }

  // Links that send the visitor to a name field focus it.
  // data-focus-name="" targets the domain search; a value names another field's id.
  // If the field is not on this page, the link simply follows its href.
  $$('[data-focus-name]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById(link.getAttribute('data-focus-name') || 'biz-name');
      if (!target) return;
      e.preventDefault();
      focusField(target);
    });
  });

  // Domains page: a card's button picks its ending, then hands over to the search
  $$('[data-pick-ending]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTld(btn.getAttribute('data-pick-ending'));
      if (nameInput) focusField(nameInput);
    });
  });

  // Arriving from another page on domains.html#biz-name: the field is ready to type in
  if (nameInput && window.location.hash === '#biz-name') {
    window.requestAnimationFrame(function () { nameInput.focus({ preventScroll: true }); });
  }

  /* ---------------------------------------------------------------------
     Websites page: filter the sites we have built by sector
     --------------------------------------------------------------------- */
  var filterBtns = $$('[data-filter]');
  var sectorItems = $$('[data-sector]');
  var filterStatus = $('[data-filter-status]');

  function applyFilter(sector, label) {
    var shown = 0;
    sectorItems.forEach(function (item) {
      var match = sector === 'all' || item.getAttribute('data-sector') === sector;
      item.hidden = !match;
      if (match) shown += 1;
    });
    filterBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === sector));
    });
    if (filterStatus) {
      filterStatus.textContent = shown + (shown === 1 ? ' site' : ' sites') +
        (sector === 'all' ? ', all sectors.' : ' in ' + label + '.');
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.getAttribute('data-filter'), btn.textContent.trim());
    });
  });

  /* ---------------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    root.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in', entry.isIntersecting);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Sample sites: depth on the drawings (home examples, websites hero)
     A mouse or pen tilts the site under it; scrolling gives a slight
     parallax. Only custom properties are set here (--tx, --ty, --sy),
     the CSS turns them into angles. Touch screens keep the fixed lean.
     Nothing runs while the visitor asks for reduced motion.
     --------------------------------------------------------------------- */
  var stages = $$('[data-tilt]');

  if (stages.length) {
    var inView = [];
    var pendingTilt = null; // { stage, x, y }, applied on the next frame
    var depthFrame = 0;

    var paintDepth = function () {
      depthFrame = 0;
      if (reduceMotion.matches) return;
      var vh = window.innerHeight || 1;
      inView.forEach(function (stage) {
        var r = stage.getBoundingClientRect();
        // -1 as the stage enters at the bottom, 0 mid-screen, 1 as it leaves at the top
        var p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        stage.style.setProperty('--sy', Math.max(-1, Math.min(1, p)).toFixed(3));
      });
      if (pendingTilt) {
        pendingTilt.stage.style.setProperty('--tx', pendingTilt.x.toFixed(3));
        pendingTilt.stage.style.setProperty('--ty', pendingTilt.y.toFixed(3));
        pendingTilt = null;
      }
    };

    var queueDepth = function () {
      if (!depthFrame) depthFrame = window.requestAnimationFrame(paintDepth);
    };

    var resetTilt = function (stage) {
      stage.classList.remove('is-tilting');
      stage.style.removeProperty('--tx');
      stage.style.removeProperty('--ty');
      if (pendingTilt && pendingTilt.stage === stage) pendingTilt = null;
    };

    var canTilt = function (e) {
      return e.pointerType !== 'touch' && !reduceMotion.matches;
    };

    stages.forEach(function (stage) {
      stage.addEventListener('pointerenter', function (e) {
        if (canTilt(e)) stage.classList.add('is-tilting');
      });
      stage.addEventListener('pointermove', function (e) {
        if (!canTilt(e)) return;
        var r = stage.getBoundingClientRect();
        pendingTilt = {
          stage: stage,
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5
        };
        queueDepth();
      });
      stage.addEventListener('pointerleave', function () { resetTilt(stage); });
    });

    if ('IntersectionObserver' in window) {
      var depthSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var i = inView.indexOf(entry.target);
          if (entry.isIntersecting && i < 0) inView.push(entry.target);
          if (!entry.isIntersecting && i > -1) inView.splice(i, 1);
        });
        queueDepth();
      });
      stages.forEach(function (stage) { depthSpy.observe(stage); });
    } else {
      inView = stages.slice();
    }

    window.addEventListener('scroll', queueDepth, { passive: true });
    window.addEventListener('resize', queueDepth);

    var onMotionChange = function () {
      if (reduceMotion.matches) {
        stages.forEach(function (stage) {
          resetTilt(stage);
          stage.style.removeProperty('--sy');
        });
      } else {
        queueDepth();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
  }

  /* ---------------------------------------------------------------------
     Start
     --------------------------------------------------------------------- */
  syncEndings();
  renderDomain(); // also renders every price in the saved currency
})();
