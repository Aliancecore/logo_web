# email/sections/

This page's body content, between the shared header and footer, split one
file per `<section>` from the original `email.html`, in the order they
appear in `email/page.manifest.json`'s `"sections"` list (header first,
footer last, everything between them gets wrapped in `<main id="main">` by
`build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-specimen.html` | Headline + actions + the "two emails, same sender" mockup + name field | `shared/styles/hero.css`, `page-hero.css`, `specimen-shell.css`, `domain-search.css` (base `.search__field`/`.search__icon`/`.search__input`, reused by the namer field), `name-field.css`, `inner-hero-text.css`; `email/styles/two-emails-specimen.css`; `shared/scripts/business-name-domain.js` |
| `addresses.html` | `hello@/sales@/accounts@/support@<domain>` list + "works where you work" trust list + "also included" checklist | `shared/styles/two-columns.css`, `trust-list.css`, `packages.css` (base `.checklist`); `email/styles/addresses-list.css` |
| `options.html` | 2-card comparison: Business email vs. Microsoft 365 | `shared/styles/packages.css`; `email/styles/options-pricing.css` |
| `faq.html` | 3-question FAQ about email | `shared/styles/faq.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`email.html`.
