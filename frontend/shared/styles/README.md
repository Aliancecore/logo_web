# shared/styles/

CSS split one concern per file, extracted verbatim from `css/styles.css`.
**Load order matters**: list these in a `page.manifest.json`'s `"styles"`
array in the same relative order they are listed below (which matches their
relative order in the original stylesheet) — a few rules rely on a later
rule in the cascade winning a tie between two same-specificity selectors
(documented in the files involved: `home/styles/examples-showcase.css`
depends on `specimen-shell.css` loading first, `shared/styles/week.css`'s
`.days`/`.day` base must load before an inner page's own `.days--3` /
`.days--4` modifier).

| File | Role | Used by (verified) |
|---|---|---|
| `fonts.css` | `@font-face` (self-hosted, SIL OFL) | every page |
| `tokens.css` | colour/type/space/shape/motion custom properties, light+dark theme | every page |
| `base.css` | element reset | every page |
| `utilities.css` | `.wrap`, `.sr-only`, `.icon`, `.section`/`.section--alt`, `.section--after-hero`/`.section--flush-top`, `.section-foot`/`.text-link`, `.blue-tld` | every page (`.text-link` is used by home itself, "See the 24 real sites…"); `.blue-tld` specifically: hosting, digital-marketing, email, website-design (found while building website-design.html, see the file's own header comment; the only canonical location — a duplicate briefly existed in `specimen-shell.css` from two agents making the same discovery concurrently, removed) |
| `typography.css` | `.h2`, `.lead`, `.section-head*`, `.tag`, `.badge` | every page |
| `buttons.css` | `.btn` + variants, `.icon-btn` | every page |
| `header.css` | sticky header chrome | every page |
| `hero.css` | `.hero` box/typography + the home/domains `.hero__grid`/`.hero__intro` layout | all 8 pages (base); home + domains.html (grid) |
| `domain-search.css` | the domain search bar + live result preview + ending list (`.search*`, `.result*`, `.endings`, `.ending`/`.chip`) | home, domains.html |
| `trust-list.css` | `.trust` reassurance list, incl. nested-in-`.split` variant | home, domains.html, email.html |
| `inner-hero-text.css` | readable text colour on the tinted `.hero` background (`--on-tint`) | all 8 pages (the rule also targets 3 inner-page-only selectors, harmless where they don't match) |
| `services.css` | services card grid (`.services__grid`, `.service*`) | home, hosting.html, digital-marketing.html |
| `tilt-3d-stage.css` | the 3D perspective "stage/rig" engine (`.case__stage`, `.case__rig`) | home's examples, website-design.html's hero specimen |
| `specimen-shell.css` | browser/phone/site drawing chrome (`.browser*`, `.phone*`, `.site`, `.site__*`) + the generic `.specimen`/`.sheet`/`.tag--plain` wrapper | home's examples, website-design.html's hero specimen, every inner-page specimen |
| `print-pattern.css` | the wax-print swatch (`.print` base + `.print--rings` only) | home's "Examples" showcase (`shop__item`/`shop__hero`/`shop__swatches` fabric swatches) **and** logo-design.html (the hero specimen's `.profile__cover` avatar background). Classified "home-only" in the original zone split (css/styles.css lines ~2121-2150, physically inside home's showcase zone); verification against logo-design.html showed otherwise for these 2 rules specifically. `.print--zigzag`/`--diamonds`/`--dots` and the `.shop__item .print`/`.shop__swatches .print` wrapper overrides stay home-only, in `home/styles/examples-showcase.css`, loaded right after this file so the home-only variants still win where they override anything (they don't overlap: different class names). |
| `packages.css` | yearly plan cards + currency toggle (`.packages__top`, `.currency*`, `.plans`, `.plan*`, `.checklist`) | home, domains.html, hosting.html, email.html, logo-design.html, website-design.html; `.plan`/`.checklist` reused standalone (outside a `.plans` grid) by digital-marketing.html's quote card |
| `week.css` | process timeline (`.days`, `.day*`) + reassurance sentence text (`.assurance*`, text only) | `.days`: home, website-design.html, logo-design.html, digital-marketing.html. `.assurance`: home, about.html |
| `final-cta.css` | closing call-to-action panel (`.contact`, `.cta*`) | all 8 pages |
| `footer.css` | site footer, incl. the 4-column layout (used on every page, not a variant) | every page |
| `motion.css` | page-load fade-up, generic scroll-reveal engine, global `prefers-reduced-motion` reset | every page (every selector it animates turned out to be shared once verified) |

### Created now, not yet used by home (foundation for the other 7 pages)

These were found while reading the "inner pages" zone of the original
stylesheet and verified generic (no page-only value baked in), per the
task's instruction to lay groundwork for the agents building those pages.
**Not** listed in `home/page.manifest.json`.

| File | Role | Verified used by |
|---|---|---|
| `page-hero.css` | the 6 inner "service" pages' hero layout (`.page-hero__grid`, `.hero__actions`, incl. the `<480px` full-width `.hero__actions`/`.btn` rule — added by the logo-design.html agent, moved here from css/styles.css's "Motion on inner pages" media query since `.hero__actions` is already shared) | website-design, hosting, email, logo-design, digital-marketing, about |
| `name-field.css` | the small standalone "type your business name" field (`.namer`) under a specimen | website-design, hosting, email, digital-marketing |
| `price-list.css` | one-row-per-offer price list (`.pricelist`) | confirmed: logo-design.html's packages-pricing section (standalone logo / startup / SME offers); also hosting.html's "Choose the cloud your site runs on" (one row per cloud provider) |
| `faq.css` | `<details>`-based FAQ list (`.faq*`) | confirmed: logo-design.html's "Questions about logos and branding" section; also hosting.html's "Questions about hosting" section |
| `two-columns.css` | text-one-side/details-other-side layout (`.split*`, `.tags`) | email.html at least (confirmed via `.split .trust`, see `trust-list.css`); also digital-marketing.html (`.split`, its "Priced after a short call" section) |
| `numbered-steps.css` | vertical numbered process list (`.steps`, `.step*`) | (generic) |
| `info-cards.css` | non-linking services variant (`.service--info`) + 3-col grid preset, extends `services.css` | digital-marketing.html (confirmed: its 3-card "content/SEO/social media" grid); also hosting.html's "What we look after" (`.service--info` only, its grid has 6 cards so the base `.services__grid` is used, not the 3-col preset) |
| `inner-motion.css` | entrance animation for inner-page-only specimens (hosting bars, marketing source bars, email card) | digital-marketing.html confirmed for `.hero__actions`, `.page-hero__media` and `.source__bar i` (its report's traffic-source bars); hosting.html confirmed for `.hero__actions`, `.page-hero__media` and `.bars i` (its uptime chart, the component this rule was named after) |

If you are building one of the other 7 pages: check this table and the
table above **before** writing new CSS for a card grid, hero, FAQ, price
list, step list, or specimen shell — it is very likely already here.
