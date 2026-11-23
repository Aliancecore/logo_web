# domains/sections/

The domains page's body content, between the shared header and footer,
split one file per `<section>` from the original `domains.html`, in the
order they appear in `domains/page.manifest.json`'s `"sections"` list
(header first, footer last, everything between them gets wrapped in
`<main id="main">` by `build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `hero-domain-search.html` | Headline + domain search form + trust list | `shared/styles/hero.css`, `domain-search.css`, `trust-list.css`, `inner-hero-text.css`; `shared/scripts/business-name-domain.js` |
| `domain-endings-grid.html` | Currency toggle + one plan card per ending (.co.ug/.ug/.com/.org) | `shared/styles/packages.css` + `domains/styles/domain-endings-grid.css`; `shared/scripts/pricing-currency.js`, `business-name-domain.js` |
| `domain-transfer.html` | "Move an existing domain to us": intro + 4-step list | `shared/styles/two-columns.css`, `numbered-steps.css` |
| `faq.html` | 5-question FAQ about domains | `shared/styles/faq.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`domains.html`.

Compare with `home/sections/`: `hero-domain-search.html` and
`final-cta.html` reuse the exact same shared components as home's own
files of the same name, with domains-specific wording (and, for the hero,
different trust-list icons/copy); `domain-endings-grid.html`,
`domain-transfer.html` and `faq.html` have no equivalent on the home page
at all — they use shared components (`packages.css`, `two-columns.css`,
`numbered-steps.css`, `faq.css`) that were extracted and verified generic
while building `home/` but not used there (see
`shared/styles/README.md`'s "Created now, not yet used by home" table).
