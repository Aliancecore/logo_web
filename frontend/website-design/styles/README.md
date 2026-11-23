# website-design/styles/

This page's own CSS — only the parts verified to be unique to this page.
Everything else this page needs (hero, page hero layout, domain search bar
pill/field, name field, tinted-hero text colour, 3D tilt engine,
browser/phone/site drawing chrome, yearly-plan/checklist component,
two-column layout, price list, week timeline, FAQ, final CTA, footer,
header, inner-page entrance motion) lives in `shared/styles/` because at
least one other page reuses it verbatim; see `shared/README.md` and
`shared/styles/README.md`.

- **`hero-specimen.css`** — the hero's "your website" specimen: its colour
  variant (`.site--yours`) and its content (`.site__mark`, `.yours__hero`,
  `.yours__copy`, `.yours__photo`, `.yours__title` and their `.phone`
  variants). Confirmed unique to this page (no other of the 8 original
  pages references `.site--yours`, `.site__mark` or any `.yours__*` class).
  **Load order**: must come after `shared/styles/tilt-3d-stage.css` and
  `shared/styles/specimen-shell.css` — same reason as home's
  `examples-showcase.css` (documented in both those shared files' own
  header comments): `.site--yours` overrides custom properties declared on
  the shared base `.site` rule, equal specificity, so the override must
  load later to win.

- **`portfolio-sites.css`** — the sector-filter chip row and the 24-card
  site grid (`.filters`, `.sites`, `.sitecard*`). Confirmed unique to this
  page (grepped every `*.html` at the repo root for these classes). This
  was the one item `shared/README.md`'s original brief flagged "unsure,
  leave untouched, for the agent building that page" — now resolved here.
  No load-order dependency: nothing else in the cascade targets these
  classes.

## Found to be shared while building this page (moved out, not duplicated)

- **`.blue-tld`** — used by this page's `.sitecard__url` spans, but also by
  hosting.html, digital-marketing.html and email.html (verified by grep).
  Moved to `shared/styles/utilities.css` instead of being added here or
  re-defined — see that file's own header comment for the proof, and
  `shared/styles/README.md`'s `utilities.css` row.

No file here was created "to match the example architecture" if it would
have been empty — e.g. there is no `website-design/styles/packages.css` or
`website-design/styles/week.css`: those components have zero
website-design-only CSS once verified against the other pages (the week
section here is the plain 5-step `.days`, identical to home's, not a
`.days--3`/`.days--4` variant), so nothing was created for them.
