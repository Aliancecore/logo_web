# logo-design/sections/

The logo design page's body content, between the shared header and footer,
split one file per `<section>` from the original `logo-design.html`, in the
order they appear in `logo-design/page.manifest.json`'s `"sections"` list
(header first, footer last, everything between them gets wrapped in
`<main id="main">` by `build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-specimen.html` | Headline + lead + buttons, next to the Nakato Prints shop-sign/receipt/profile specimen | `shared/styles/hero.css`, `inner-hero-text.css`, `page-hero.css`, `specimen-shell.css`, `print-pattern.css`; `logo-design/styles/page-hero-specimen.css`; `shared/scripts/business-name-domain.js` (fills `data-mail-topic` links) |
| `three-logo-styles.html` | 3 logo-style cards: emblem, wordmark, symbol-and-name | `logo-design/styles/three-logo-styles.css` |
| `delivered-files.html` | 7-row list of delivered files | `logo-design/styles/delivered-files.css`; `shared/scripts/business-name-domain.js` fills `data-slug` |
| `design-process-steps.html` | 4-day design process timeline | `shared/styles/week.css` (`.days--4` modifier) |
| `logo-packages-pricing.html` | Currency toggle + 3-row price list + Bronze/Silver/Gold footnote | `shared/styles/packages.css`, `price-list.css`, `utilities.css` (`.section-foot`) |
| `faq.html` | 4-item FAQ list | `shared/styles/faq.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`logo-design.html`.

Unlike `home/sections/final-cta.html`, this page's `final-cta.html` and
`delivered-files.html` link the "not your business name?" / `data-slug`
text to **another page's** search field (`domains.html#biz-name`) rather
than focusing a field on this page — logo-design.html has no domain search
or name field of its own.
