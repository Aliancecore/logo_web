# logo-design/styles/

The logo design page's own CSS — only the parts verified to be unique to
this page. Everything else this page needs (page hero layout, specimen
wrapper, process timeline, packages chrome, price list, FAQ, final CTA,
footer, header, the wax-print pattern) lives in `shared/styles/` because at
least one other page reuses it verbatim; see `shared/README.md` and
`shared/styles/README.md`.

- **`page-hero-specimen.css`** — the hero specimen: one logo (Nakato
  Prints) drawn on a shop sign, a one-colour receipt and a round social
  profile picture (`.signage`, `.lockup`, `.board`, `.receipt*`,
  `.profile*`). Confirmed unique to `logo-design.html` (no other of the 8
  original pages references `.signage`, `.lockup`, `.board`, `.receipt` or
  `.profile__cover`). Also carries this page's `<480px` mobile tweaks for
  `.signage`/`.receipt`, consolidated here from a different, far-away part
  of the original stylesheet (see the file's own header comment) — the
  same kind of consolidation `home/styles/examples-showcase.css` does for
  home's own rules.
- **`three-logo-styles.css`** — the "Three styles, three businesses" card
  grid (`.logos`, `.logo-card*`, the inline `.emblem` sizing, `.wordmark*`,
  and the 3 `.logo-card__art .lockup*` overrides for the third card).
  Confirmed unique (no other of the 8 original pages references `.logos`,
  `.logo-card`, `.emblem` or `.wordmark`).
- **`delivered-files.css`** — the "Every file you will be asked for" list
  (`.files`, `.file*`). Confirmed unique (no other of the 8 original pages
  references `.files`, `.file__icon`, `.file__name` or `.file__use`).

No file here was created "to match the example architecture" if it would
have been empty — e.g. there is no `logo-design/styles/week.css`,
`packages.css`, `price-list.css` or `faq.css`: those components have zero
logo-design-only CSS once verified against the other 7 pages (see
`shared/styles/README.md`), so nothing was created for them.

## Two rules moved to `shared/styles/` instead of living here

Found while building this page, documented in full in
`shared/styles/print-pattern.css` and `shared/styles/page-hero.css`'s own
header comments (and in `shared/styles/README.md`):

- `.print` / `.print--rings` (behind the hero specimen's profile-picture
  avatar) turned out to already be used, verbatim, by `index.html` too —
  promoted to `shared/styles/print-pattern.css` rather than kept here, to
  avoid a second copy of the same 2 rules.
- The `<480px` full-width rule for `.hero__actions`/`.btn` was added to
  `shared/styles/page-hero.css`, next to `.hero__actions`'s own rule,
  instead of being duplicated per inner page.
