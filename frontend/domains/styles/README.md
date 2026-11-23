# domains/styles/

The domains page's own CSS — only the part verified to be unique to this
page. Everything else this page needs (hero, domain search, trust list,
packages card grid + currency toggle, two-column split layout, numbered
step list, FAQ list, final CTA, footer, header, motion) lives in
`shared/styles/` because at least one other page reuses it verbatim, or
(for the two-column/numbered-steps/FAQ components) because it was already
extracted as generic while building `home/` even though home itself never
uses it; see `shared/README.md` and `shared/styles/README.md`.

- **`domain-endings-grid.css`** — the 4-column layout for the plan-card
  grid (`.plans--4`), the bigger heading size for a bare ending like
  ".co.ug" (`.plan__name--ext`), and the struck-through "was" price
  (`.plan__was`). Confirmed unique to this page: grepped all 8 original
  pages' HTML for these 3 class names, each appears only in `domains.html`.

  These rules sit in the original `css/styles.css` under one comment,
  `/* ----- Domains: one card per ending (the plan card) ----- */`
  (lines 4169-4215), alongside a 4th class, `.plans--2`, which is **not**
  included here: grepping the 8 pages shows `.plans--2` is used by
  `email.html`, not by `domains.html` at all. It is not domains-only (so it
  does not belong here) and not shared either, since only one page uses it
  (the `shared/README.md` rule is "used verbatim by **2 or more** pages").
  It is left untouched in `css/styles.css` for whoever builds `email.html`.

  **Load order**: must load after `shared/styles/packages.css` in a
  manifest's `"styles"` list. `.plan__name--ext` and `.plans--4` are each a
  single class, the same specificity as the `.plan__name` and `.plans`
  rules already declared in `packages.css` that they override (font-size,
  and grid-template-columns at the 900px breakpoint, respectively) — CSS
  gives an equal-specificity tie to whichever rule is later in the
  cascade, so this file has to come after `packages.css` for the ending
  cards to render 4-per-row with the bigger heading, matching the original
  stylesheet (where this block sits physically after the packages zone).

No file here was created "to match the example architecture" if it would
have been empty — e.g. there is no `domains/styles/two-columns.css` or
`domains/styles/faq.css`: those components have zero domains-only CSS,
they are used exactly as `shared/styles/two-columns.css` and
`shared/styles/faq.css` already define them.
