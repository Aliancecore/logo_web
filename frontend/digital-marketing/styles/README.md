# digital-marketing/styles/

This page's own CSS — only the part verified to be unique to this page.
Everything else this page needs (page hero, name field, specimen shell,
services grid + info-card variant, week/process list, two-column layout,
pricing-plan card + checklist, final CTA, footer, header, inner-page
motion) lives in `shared/styles/` because at least one other page reuses
it verbatim, or because the home page's build already created it "ahead of
schedule" for the other 7 pages; see `shared/README.md` and
`shared/styles/README.md`.

- **`report-specimen.css`** — the "monthly report" mockup shown in this
  page's hero (`.report`, `.report__head`, `.report__stats`,
  `.report__stat`, `.report__num`, `.report__delta`, `.report__sources`,
  `.source`, `.source__bar`, `.source__val`). Confirmed unique to this
  page: grepped all 7 other original pages for these class names, no
  matches (unlike `.blue-tld`, found one row above it in the original
  stylesheet, which turned out to be shared with 3 other pages — promoted
  to `shared/styles/specimen-shell.css` instead, see
  `digital-marketing/README.md`).
  Depends on `shared/styles/specimen-shell.css` loading first (`.report`
  sits on top of the generic `.sheet` surface it defines).

No file here was created "to match the example architecture" if it would
have been empty — there is no `digital-marketing/styles/hero.css`,
`services.css`, `method.css` or `quote.css`: each of those components has
zero page-only CSS once verified against the other 7 pages and against
`shared/styles/README.md`'s already-created foundation, so nothing was
created for them.
