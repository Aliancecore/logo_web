# website-design/scripts/

This page's own JS — only the one block verified to be unique to this page.
Everything else this page needs (theme toggle, header nav, pricing
currency, business-name/domain sync, scroll reveal, 3D tilt, the final
init call) lives in `shared/scripts/` because every one of those fragments
is either used by this page already as part of the base script set every
page loads, or specifically documented as needed here; see
`shared/scripts/README.md`.

- **`sector-filter.js`** — the "filter the sites we have built by sector"
  behaviour: clicking a `[data-filter]` chip shows/hides the matching
  `[data-sector]` cards, updates `aria-pressed` on every chip, and
  announces the new count in the `[data-filter-status]` `aria-live`
  element. Extracted verbatim from the original `js/main.js`, lines
  386-413. `shared/scripts/README.md`'s own "Not created yet" section
  already earmarked this exact block for this page, with the instruction
  to keep it page-local rather than move it to `shared/scripts/`: no other
  of the 8 original pages has a sector filter, so a shared fragment would
  sit unused everywhere else.

  Like every `shared/scripts/` fragment, this file has **no** `(function
  () { ... })();` wrapper and **no** `'use strict'` of its own — it relies
  on sharing the one function scope `build/assemble.py` wraps the whole
  concatenated `"scripts"` list in (see `shared/scripts/README.md` for why:
  the same reasoning applies to a page-local fragment as to a shared one,
  since `build/assemble.py` concatenates every file in the manifest's
  `"scripts"` array — page-local and shared alike — before wrapping once).
  Wrapping this file individually would hide `$`/`$$` (declared by
  `shared/scripts/constants-and-helpers.js`) inside its own scope and break
  it.

  **Load order** (see `page.manifest.json`): after
  `shared/scripts/constants-and-helpers.js` (needs `$`/`$$`) and, to match
  the original file's own order, right after
  `shared/scripts/business-name-domain.js` and before
  `shared/scripts/scroll-reveal.js` — this is also "after
  constants-and-helpers.js and before init.js", satisfying the broader
  constraint `shared/scripts/README.md` states. It has no dependency on
  `business-name-domain.js` itself; the position just mirrors where this
  block sits in the original `js/main.js`.
