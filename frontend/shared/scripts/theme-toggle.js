/* theme-toggle.js — light/dark theme switch, persisted in localStorage
   (KEYS.theme) and synced to <meta name="theme-color"> (THEME_COLORS), both
   from constants-and-helpers.js (must run before this file).
   currentTheme()/syncTheme() are local to this fragment's scope; no later
   fragment calls them. */

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
