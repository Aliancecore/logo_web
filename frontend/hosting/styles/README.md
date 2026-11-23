# hosting/styles/

The hosting page's own CSS — only the part verified to be unique to this
page. Everything else this page needs (hero layout, name field, services
card grid, the non-linking card variant, packages toggle, price list,
FAQ, final CTA, footer, header, the generic specimen wrapper, motion)
lives in `shared/styles/` because at least one other page reuses it
verbatim; see `shared/README.md` and `shared/styles/README.md`.

- **`specimen-hosting-panel.css`** — the hero specimen: the hosting
  control-panel mockup (`.console`, `.console__*`, `.status`, `.bars`).
  Confirmed unique to hosting.html (grepped `class="console`,
  `console__`, `class="status`, `class="bars` across all 7 other original
  pages: no hits).

One rule that physically lived inside this same original CSS block —
`.blue-tld`, which colours a domain's ending blue inside the panel's
`.console__site` text — is **not** here: it turned out, while building
this page, to also be used by website-design.html, email.html and
digital-marketing.html, so it has been promoted to
`shared/styles/specimen-shell.css` (see that file's own header comment
for the grep evidence). Loading `shared/styles/specimen-shell.css` is
required for this page for that reason, not only for the generic
`.specimen`/`.sheet` wrapper.

No file was created here "to match the example architecture" if it would
have been empty — e.g. there is no `hosting/styles/page-hero.css` or
`hosting/styles/final-cta.css`: those components have zero hosting-only
CSS once verified against the other original pages (see
`shared/styles/README.md`'s two tables), so nothing was created for them.
