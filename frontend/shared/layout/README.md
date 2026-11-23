# shared/layout/

The two structural HTML pieces every page wraps its own content in.

- **`header-nav.html`** — sticky header: brand, main nav (7 links + call
  button), theme toggle, mobile nav toggle. Identical on every page except
  which nav link is "active".
- **`footer.html`** — site footer: brand/mission, contact column, Services
  column (links to the other 6 service pages), Company column, legal line.
  Identical on every page except which Services/Company link matches the
  current page (verified: `about.html`'s own "About us" footer link gets
  `aria-current="page"` too, same mechanism as the header).

## The `{{ARIA_CURRENT:<page>}}` placeholder

Both files mark the "this is the current page" link not with a single
`{{ACTIVE_NAV}}` toggle but with one placeholder **per link**:
`<a href="domains.html"{{ARIA_CURRENT:domains.html}}>`. `build/assemble.py`
reads the page's manifest `"active_nav"` field and replaces every
`{{ARIA_CURRENT:X}}` in these two files with `' aria-current="page"'`
(leading space) when `X == active_nav`, or with nothing otherwise — so the
assembled markup is byte-identical to the hand-written original either way
(no stray space on inactive links).

On the home page (`active_nav: "index.html"`), the header's "Home" link
gets `aria-current="page"` and nothing in the footer does — matching the
current `index.html` exactly (home is not one of the footer's own links).

## In `build/assemble.py`'s output

These two files are listed explicitly in a manifest's `"sections"` array,
first and last respectively (see `home/page.manifest.json`). The build
script recognises them by that exact path, pulls them out of the list, and
wraps everything **between** them in `<main id="main">...</main>` —
matching the original pages' structure (header and footer sit outside
`<main>`). See the `HEADER_SECTION` / `FOOTER_SECTION` constants in
`build/assemble.py`.
