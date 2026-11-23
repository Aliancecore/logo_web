# email/styles/

This page's own CSS — only the parts verified to be unique to this page.
Everything else this page needs (hero, page-hero layout, specimen wrapper,
name field, trust list, 2-column split, pricing-plan cards, FAQ, final CTA,
footer, header, motion) lives in `shared/styles/` because at least one
other page reuses it verbatim; see `shared/README.md` and
`shared/styles/README.md`.

- **`two-emails-specimen.css`** — the hero mockup of the same message seen
  from a free Gmail-style address and from an address on the visitor's own
  domain (`.mail`, `.mail__card` and children). Confirmed unique to this
  page: grepping every original `*.html` for `mail__` only matches
  `email.html`. The card's own entrance animation
  (`.mail__card--own { animation: card-in ... }`) is **not** here — it was
  already collected into `shared/styles/inner-motion.css` by the agent that
  built `home/`, alongside every other inner page's specimen animation.

- **`addresses-list.css`** — the `hello@/sales@/accounts@/support@<domain>`
  pill list (`.addresses`, `.address`, `.address__domain`). Confirmed
  unique: no other original page uses `class="address"`.

- **`options-pricing.css`** — the 2-card width variant of the shared
  `.plans` grid (`.plans--2`), used by the Business-email-vs-Microsoft-365
  comparison. Confirmed unique: domains.html uses the 4-card `.plans--4`
  variant, home uses the plain 3-card `.plans` with no modifier, only
  email.html uses `.plans--2`.

No file here duplicates anything already in `shared/styles/`. In
particular, the nested-`.trust`-inside-`.split` layout tweak that lived
next to `.addresses`/`.address` in the original `css/styles.css` ("Email:
one domain, many addresses" comment block) is already in
`shared/styles/trust-list.css` (verified generic by the agent that built
`home/`, against this exact page) — it is loaded via that file, not
repeated here.
