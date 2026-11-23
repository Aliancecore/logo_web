# about/styles/

The about page's own CSS — only the parts verified to be unique to this
page (checked by grepping all 8 original pages' HTML for each class before
writing its file; see each file's own header comment for the exact
evidence). Everything else this page needs (hero box, inner-page hero
layout, two-column split layout, the reassurance-sentence box, pricing-card
markup/checklist, final CTA, footer, header, readable hero text colour)
lives in `shared/styles/` because at least one other page reuses it
verbatim — see `shared/README.md` and `shared/styles/README.md`.

- **`hero-photo.css`** — the Kampala photo in about's hero (`.hero-photo`
  and children): fixed-ratio image box with rounded corners and its credit
  caption. No other of the 8 pages has a `.hero-photo` element — about.html
  is the only inner page whose hero shows a photo instead of a product
  mockup. **Load order**: must come BEFORE `shared/styles/inner-hero-text.css`
  — both set `color` on `.hero-photo figcaption` at equal specificity, and
  the shared file's `--on-tint` colour must win (matches the original
  stylesheet's own order, where the shared rule comes after this one).

- **`team.css`** — the team grid (`.team`, `.person`, `.person__initials`,
  `.person__name`, `.person__role`). Confirmed unique to about.html (no
  other page references `.team`, `.person` or any `.person__*` class).

- **`clients.css`** — the client-name chip list (`.clients`). Confirmed
  unique to about.html (no other page references `.clients`). In the
  original stylesheet this rule was physically grouped under the same
  comment as the hero-photo rules ("About: hero photo with its credit",
  since the two are unrelated and simply sit next to each other in the
  source) — split out into its own file here by actual role, not by that
  comment grouping.

- **`promise.css`** — one rule, `.assurance--inline`: the tweak that lets
  this page reuse the shared `.assurance` reassurance box
  (`shared/styles/week.css`) as a plain column inside its own `.split`
  layout, instead of as a full-width section below a process timeline like
  home's version. **Load order**: must come AFTER `shared/styles/week.css`
  — `.assurance--inline` overrides `.assurance`'s own margin/padding/border
  at equal specificity (one class each), so it needs to load later to win
  (matches the original stylesheet's own order).

No file here was created "to match the example architecture" if it would
have been empty — e.g. there is no `about/styles/packages.css` or
`about/styles/final-cta.css`: those components have zero about-only CSS
once verified against the other 7 pages, so nothing was created for them.
