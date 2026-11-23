/* business-name-domain.js — the business name/domain the visitor typed,
   kept in sync across every [data-slug]/[data-tld]/[data-domain]/[data-name]/
   [data-initial]/[data-email] element on the page, and carried to the next
   page via sessionStorage (KEYS.name/KEYS.tld from constants-and-helpers.js).
   Depends on renderPrices()/currency from pricing-currency.js (previous
   fragment). init.js (last fragment) calls syncEndings() and renderDomain(),
   both defined here, to do the first render on page load.
   - --len (set on root by renderDomain()): the typed slug's length in
     characters; read by shared/styles/domain-search.css (.result__address)
     and shared/styles/final-cta.css (.cta__domain) to size the domain text
     to fit its container. */

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
