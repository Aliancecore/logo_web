# digital-marketing/sections/

This page's body content, between the shared header and footer, split one
file per `<section>` from the original `digital-marketing.html`, in the
order they appear in `digital-marketing/page.manifest.json`'s `"sections"`
list (header first, footer last, everything between them gets wrapped in
`<main id="main">` by `build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-specimen.html` | Headline + lead + CTA buttons + monthly-report mockup + namer field | `shared/styles/hero.css`, `page-hero.css`, `inner-hero-text.css`, `domain-search.css`, `name-field.css`, `specimen-shell.css`; `digital-marketing/styles/report-specimen.css`; `shared/scripts/business-name-domain.js` fills `data-slug`/`data-tld` and reads the namer `data-name-input` |
| `marketing-services.html` | 3-card grid: content, SEO, social media | `shared/styles/services.css`, `info-cards.css`, `packages.css` (for `.checklist`) |
| `marketing-method-steps.html` | "Plan / Run / Monitor" 3-step process | `shared/styles/week.css` (the SAME `.days`/`.day` component as the home page's week, via its `.days--3` modifier — not `numbered-steps.css`, see this page's own README) |
| `client-quote.html` | "Priced after a short call": intro text + a quote-request card | `shared/styles/two-columns.css` (`.split`), `packages.css` (`.plan` reused standalone, `.checklist`) |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`digital-marketing.html`.

Note on naming: `client-quote.html` is named after the brief that
commissioned this page split, not after its content — it holds a
quote-*request* card (what the visitor sends us to get a price), not a
client testimonial quote. See the file's own header comment.
