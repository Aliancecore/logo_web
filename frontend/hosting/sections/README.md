# hosting/sections/

The hosting page's body content, between the shared header and footer,
split one file per `<section>` from the original `hosting.html`, in the
order they appear in `hosting/page.manifest.json`'s `"sections"` list
(header first, footer last, everything between them gets wrapped in
`<main id="main">` by `build/assemble.py` — see `shared/layout/README.md`).

| File | Section | Needs (beyond the base shared styles/scripts every page loads) |
|---|---|---|
| `page-hero-specimen.html` | Headline + copy/action buttons + the hosting control-panel specimen + the standalone name field under it | `shared/styles/page-hero.css`, `domain-search.css` (base `.search__field`/`.search__input`), `name-field.css`, `specimen-shell.css` (`.specimen`/`.sheet` + `.blue-tld`), `hosting/styles/specimen-hosting-panel.css`; `shared/scripts/business-name-domain.js` |
| `whats-looked-after.html` | 6-card grid of included care, cards that do not link anywhere | `shared/styles/services.css` + `shared/styles/info-cards.css` (`.service--info`) |
| `hosting-plans-pricing.html` | Currency toggle + one-row-per-cloud-provider price list (DigitalOcean, Linode, Vultr, Google Cloud, AWS) | `shared/styles/packages.css` (`.packages__top`/`.currency`) + `shared/styles/price-list.css` (`.pricelist`); `shared/scripts/pricing-currency.js` |
| `faq.html` | 4-item FAQ about hosting and domains | `shared/styles/faq.css` |
| `final-cta.html` | Closing call-to-action panel | `shared/styles/final-cta.css`; `shared/scripts/business-name-domain.js` fills the domain text |

Every file's own header comment repeats its specific dependencies. None of
these files should be split further or merged — each corresponds exactly
to one `<!-- ===== Name ===== -->`-delimited section in the original
`hosting.html`.

Unlike home, this page's hero uses the `.page-hero` layout (title, then
copy and a specimen side by side from 1024px) rather than the domain
search form — hosting has no domain search of its own, only the small
"see it with your business name" field under the specimen.
