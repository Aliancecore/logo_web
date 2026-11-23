/* header-nav.js — header shadow on scroll, and the mobile nav panel
   open/close/escape/resize behaviour. The current page's active link is
   marked in the HTML itself (aria-current="page", written by
   shared/layout/header-nav.html via its per-link {{ARIA_CURRENT:...}}
   placeholders), not by this script. */

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
