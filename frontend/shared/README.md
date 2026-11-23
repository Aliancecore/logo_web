# shared/

Everything reused by two or more pages, verbatim: CSS, JS, and the two
HTML layout fragments that wrap every page (header, footer) plus the two
`<head>`-adjacent fragments every page needs (document-head, icon-sprite).

## The rule for "does this belong in shared/?"

**Shared = used verbatim by at least 2 pages.** CSS, JS, or structural HTML
(a layout piece like the header or footer) that two or more pages load
unchanged goes here. Page **content** HTML — the text, headings and
specimens that are specific to one page — never goes here even if its
*structure* happens to look like another page's (e.g. two pages both having
a "hero" section does not make their hero *content* shared; only the
`.hero` CSS box and typography are).

A file stays out of `shared/` only when it is provably used by one page.
When in doubt, it goes in `shared/` with a comment explaining the evidence
(which pages were checked, what was found) — duplicating a shared thing
across pages is the failure mode this architecture exists to prevent.

## Important finding from building this (home) page

The task that produced this tree came with a zone-by-zone guess at what in
the original `css/styles.css` was "home-only" vs shared. That guess was
built by reading `index.html` plus a first pass over `css/styles.css`, and
it undercounted sharing badly: reading all 8 original pages' HTML showed
that `.hero`/`.hero__title`/`.punct`/`.hero__line`/`.hero__accent`,
`.trust`, `.services__grid`/`.service`, `.plans`/`.plan`, `.days`/`.day`,
`.assurance` (text part), `.cta`/`.contact`, and `.site-footer__grid--4` are
**all** used by several of the 8 pages, not just by home — despite living
in zones the brief called "home-only". Each file below documents, in its
own header, exactly which pages were checked and what was found. Treat a
class as page-specific only if its own file says so explicitly.

The one genuinely home-only piece of `css/styles.css`'s old "8b. Examples"
zone is the showcase grid and its 3 hand-drawn sample sites (colours and
content); the 3D tilt engine and the browser/phone/site drawing chrome
underneath them are shared with website-design.html's hero and now live in
`shared/styles/tilt-3d-stage.css` / `shared/styles/specimen-shell.css`.

## Layout

- `head/` — `<head>` template + the icon sprite (see `head/README.md`).
- `layout/` — header and footer HTML fragments (see `layout/README.md`).
- `styles/` — shared CSS, split one concern per file (see `styles/README.md`).
- `scripts/` — shared JS, split one concern per file, **concatenated and
  wrapped once** by `build/assemble.py` (see `scripts/README.md` — read
  this before touching any file in there).

## Unresolved from the original brief

- **`site-footer__grid--4`** was flagged by the brief as possibly a
  page-specific footer variant. Verified: all 8 pages use
  `class="site-footer__grid site-footer__grid--4"` together — it is the
  one and only footer layout, not a variant. Its rules are merged into
  `shared/styles/footer.css`.
- Nothing else from the brief's "unsure, leave untouched" list
  (`.plans--4`/`.plan__name--ext`/`.plan__was` for domains.html,
  `.filters`/`.sitecard*` for website-design.html, the email/logo/marketing
  specimens, about.html's team/photo/promise) was touched — those stay in
  `css/styles.css` only, for the agent building that page.
