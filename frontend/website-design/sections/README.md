# website-design/sections/

This page's body content, between the shared header and footer, split one
file per `<section>` from the original `website-design.html`, in the order
they appear in `website-design/page.manifest.json`'s `"sections"` list
(header first, footer last, everything between them gets wrapped in
`<main id="main">` by `build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-specimen.html` | Two-line thesis + lead + 2 CTAs, then a drawn "your website" specimen (browser + phone) under a name field | `shared/styles/hero.css`, `page-hero.css`, `domain-search.css`, `name-field.css`, `inner-hero-text.css`, `tilt-3d-stage.css`, `specimen-shell.css`; `website-design/styles/hero-specimen.css`; `shared/scripts/business-name-domain.js`, `tilt-3d.js` |
| `whats-included.html` | Platforms tag list + "in every website"/"with an online shop" checklists | `shared/styles/utilities.css` (`.section--after-hero`), `two-columns.css` (`.split*`, `.tags`), `packages.css` (`.checklist` base — must load before `two-columns.css`, see that file's header comment) |
| `portfolio-by-sector.html` | 24 real client sites, filterable by sector (8 chips) | `shared/styles/domain-search.css` (`.chip`), `utilities.css` (`.sr-only`, `.icon`); `website-design/styles/portfolio-sites.css`; `website-design/scripts/sector-filter.js` |
| `design-pricing.html` | Currency toggle + 6 design-price rows + link to the yearly packages | `shared/styles/packages.css` (`.packages__top`, `.currency*`), `price-list.css`; `shared/scripts/pricing-currency.js` |
| `how-it-works-week.html` | 5-day process timeline (same component as home, 5 steps, no `.days--3`/`.days--4`) | `shared/styles/week.css` |
| `faq.html` | 4 questions about websites, `<details>`-based | `shared/styles/faq.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`website-design.html`.
