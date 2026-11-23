# home/sections/

The home page's body content, between the shared header and footer, split
one file per `<section>` from the original `index.html`, in the order they
appear in `home/page.manifest.json`'s `"sections"` list (header first,
footer last, everything between them gets wrapped in `<main id="main">` by
`build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `hero-domain-search.html` | Headline + domain search form + trust list | `shared/styles/hero.css`, `domain-search.css`, `trust-list.css`, `inner-hero-text.css`; `shared/scripts/business-name-domain.js` |
| `services-overview.html` | 6-card grid linking to the other service pages | `shared/styles/services.css` + `home/styles/services.css` |
| `product-examples-showcase.html` | 3 hand-drawn sample sites on a tilting 3D stage | `shared/styles/tilt-3d-stage.css`, `specimen-shell.css`, `home/styles/examples-showcase.css` (in that order); `shared/scripts/tilt-3d.js` |
| `pricing-packages.html` | Currency toggle + 3 yearly plan cards | `shared/styles/packages.css`; `shared/scripts/pricing-currency.js` |
| `how-it-works-week.html` | 5-day process timeline + reassurance sentence + 2 photos | `shared/styles/week.css`, `home/styles/week-photos.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`index.html`.
