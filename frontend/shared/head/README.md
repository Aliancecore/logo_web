# shared/head/

Fragments that belong near the top of every page's document, before any
page content.

- **`document-head.html`** — the `<head>...</head>` content (not the tags
  themselves — `build/assemble.py` adds those). Placeholders:
  `{{PAGE_TITLE}}`, `{{PAGE_DESCRIPTION}}` — filled from the page's
  `page.manifest.json`. `{{PAGE_CSS}}` / `{{PAGE_JS}}` — filled with
  `css/<slug>.css` / `js/<slug>.js`. `{{PAGE_SLUG}}` — filled with the
  manifest's `slug`; reserved for a future `<link rel="canonical">`/`og:url`
  (commented out in the file) since the current site has neither and this
  refactor must not add new functionality.
  Includes the inline anti-flash-of-wrong-theme script and the font
  preloads, copied verbatim from the current `index.html`.

- **`icon-sprite.html`** — the inline `<svg class="sprite">` of `<symbol>`
  icon definitions, placed right after the skip-link in every page's
  `<body>`. **Not** inside `<head>` despite the folder name — kept here
  because, like the head template, it is "always there, never listed per
  page" infrastructure.
  **Important**: verified NOT byte-identical across the current 8 pages —
  home's copy (extracted here) only has the symbols home's own markup uses.
  The 7 inner pages currently each ship their own larger, hand-curated
  sprite. Whoever builds the next page should **add** that page's missing
  `<symbol>`s to this shared file (symbols are inert until referenced by
  `<use>`, so extra ones are harmless) rather than create a page-local
  sprite. See the file's own header comment for the exact symbol names
  found on the other 7 pages but not yet added here.

Both files are read directly by `build/assemble.py` for every page (they
are not listed in any `page.manifest.json`'s `"sections"` — they are part
of the fixed document skeleton the script always emits).
