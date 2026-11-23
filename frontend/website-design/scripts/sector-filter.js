/* sector-filter.js — used ONLY by website-design.html: filters the "Sites
   we have built" grid (website-design/sections/portfolio-by-sector.html)
   by sector. Clicking a [data-filter] chip shows/hides every [data-sector]
   card that does not match, updates aria-pressed on every chip (only one
   is pressed at a time) and announces the new count in the aria-live
   [data-filter-status] element.

   Extracted verbatim from the original js/main.js, lines 386-413 (comment:
   "Websites page: filter the sites we have built by sector"). Not a
   shared/scripts/ fragment, per that folder's own README ("Not created
   yet" section): no other page has a sector filter, so it stays local to
   this page instead of sitting unused in shared/.

   Like every shared/scripts/ fragment, this file has NO IIFE wrapper and
   NO 'use strict' of its own: build/assemble.py concatenates every file in
   the manifest's "scripts" array (this one included) into ONE
   "(function () { 'use strict'; ... })();" wrapper for the whole page (see
   shared/scripts/README.md). Wrapping this file individually would hide
   $/$$ (declared by shared/scripts/constants-and-helpers.js, which must
   load before this file) inside its own scope and break it.
   Must load before shared/scripts/init.js (last fragment) and after
   shared/scripts/constants-and-helpers.js — see page.manifest.json. */

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
