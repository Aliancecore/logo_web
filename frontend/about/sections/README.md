# about/sections/

The about page's body content, between the shared header and footer, split
one file per `<section>` from the original `about.html`, in the order they
appear in `about/page.manifest.json`'s `"sections"` list (header first,
footer last, everything between them gets wrapped in `<main id="main">` by
`build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-photo.html` | Headline + intro copy + Kampala photo | `shared/styles/hero.css`, `page-hero.css`, `about/styles/hero-photo.css`, `inner-hero-text.css` (in that order — see `about/styles/hero-photo.css`'s header comment) |
| `our-story-and-promise.html` | "From ideas to revenue." story copy, beside the shared reassurance-sentence box | `shared/styles/two-columns.css`, `week.css`; `about/styles/promise.css` (must load after `week.css`) |
| `team-grid.html` | 5-person team grid | `about/styles/team.css` |
| `clients-marketplace.html` | Named-clients list beside a "Sell on our marketplace" plan card | `shared/styles/two-columns.css`, `packages.css`; `about/styles/clients.css` |
| `final-cta.html` | Closing call-to-action panel (about's own note text, otherwise identical shape to home's) | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`about.html`.

One file intentionally covers two of the original's visual "halves" at
once: `our-story-and-promise.html` is a single `<section id="story">` in
the source — its right-hand column just happens to be the same shared
`.assurance` reassurance box home uses, so it is not split into a second
file (that would break the `.split` two-column grid, which needs both
halves as direct children of the same section).
