# shared/scripts/

JS split one logical block per file, extracted verbatim from `js/main.js`.

## Read this before editing any file here

These fragments are **not** individually-wrapped scripts. The original
`js/main.js` is one single IIFE —
`(function () { 'use strict'; ...everything... })();` — because later
blocks call functions and read variables declared by earlier blocks in that
one shared scope (e.g. `pricing-currency.js`'s `renderPrices()`/`currency`
are called directly by `business-name-domain.js`'s `renderDomain()`;
`init.js` calls `syncEndings()`/`renderDomain()` from
`business-name-domain.js`).

To preserve that single scope after splitting the code across files, each
file below contains **only its block's code** — no `(function () {...})();`
wrapper, no `'use strict';`. `build/assemble.py` concatenates the files
listed in a manifest's `"scripts"` array, **in that exact order**, and
wraps the whole concatenation **once**:

```js
(function () {
  'use strict';

  ...every fragment's code, concatenated...
})();
```

**Do not** add a wrapper or `'use strict'` to an individual file — it would
hide that file's names from every fragment after it and break the page.
Do not reorder fragments without checking the dependency notes below.

## Files, in required load order

| File | Declares (read by later fragments) | Requires |
|---|---|---|
| `constants-and-helpers.js` | `root`, `SALES_EMAIL`, `UGX_PER_USD`, `KEYS`, `THEME_COLORS`, `DOMAIN_DISCOUNT`, `TLD_PRICES`, `DEFAULT_SLUG`, `DEFAULT_NAME`, `reduceMotion`, `darkQuery`, `store`, `session`, `$`, `$$` | — (must load first) |
| `theme-toggle.js` | — | `constants-and-helpers.js` |
| `header-nav.js` | — | `constants-and-helpers.js` |
| `pricing-currency.js` | `renderPrices()`, `currency` (called by the next file, even on pages with no visible currency switch — see its header comment) | `constants-and-helpers.js` |
| `business-name-domain.js` | `syncEndings()`, `renderDomain()` (called by `init.js`) | `constants-and-helpers.js`, `pricing-currency.js` |
| `scroll-reveal.js` | — | `constants-and-helpers.js` |
| `tilt-3d.js` | — | `constants-and-helpers.js` |
| `init.js` | — (calls `syncEndings()`/`renderDomain()`) | must load **last**, after `business-name-domain.js` |

## Not created yet

`sector-filter.js` — the "filter the sites we have built by sector" block
(original `js/main.js` lines 386-413) is used **only** by
website-design.html. It was intentionally left in `js/main.js` rather than
extracted here: no other page needs it, and the agent building
website-design.html should extract it then, placing it (not needed on any
other page) in a page-local script rather than here.
