# home/styles/

The home page's own CSS — only the parts verified to be unique to this
page. Everything else this page needs (hero, domain search, trust list,
services card grid, packages, week timeline, final CTA, footer, header,
3D tilt engine, browser/phone/site drawing chrome) lives in
`shared/styles/` because at least one other page reuses it verbatim; see
`shared/README.md` and `shared/styles/README.md`.

- **`services.css`** — one rule: `.services { --section-pad-top: ... }`,
  the top-spacing hook between this page's hero and its services section.
  Not reused: hosting.html and digital-marketing.html use the shared
  `.section--after-hero` preset (`shared/styles/utilities.css`) on their
  equivalent section instead of this page-specific hook.

- **`examples-showcase.css`** — the "What goes live under your name"
  showcase grid (`.showcase`, `.cases`, `.case`), its desktop 3-way tilt
  angle overrides, and the 3 sample sites' own colours and hand-drawn
  content (coffee cooperative, beauty salon, fabric shop). Confirmed unique
  to this page (no other of the 8 original pages references `.showcase`,
  `.cases`, `.case__cap`, `.site--coffee` or `.site--shop`).
  **Load order**: must come after `shared/styles/tilt-3d-stage.css` and
  `shared/styles/specimen-shell.css` — `.site--coffee`/`.site--shop`
  override custom properties declared on the shared base `.site` rule, and
  CSS requires the override to appear later in the cascade to win (both
  have equal specificity).

- **`week-photos.css`** — the two photos of Kampala shown beside the "What
  you can count on" sentence. The sentence itself is shared
  (`shared/styles/week.css`, reused without photos by about.html via
  `.assurance--inline`); these two photo rules are not.

No file here was created "to match the example architecture" if it would
have been empty — e.g. there is no `home/styles/packages.css` or
`home/styles/final-cta.css`: those components have zero home-only CSS once
verified against the other 7 pages, so nothing was created for them.
