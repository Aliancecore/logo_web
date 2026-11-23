# build/

- **`assemble.py`** — the static-site assembler. Finds every
  `*/page.manifest.json` under `frontend/` (skipping `shared/`, `build/`,
  `public/`), and for each one:
  1. Builds `<head>` from `shared/head/document-head.html` with that page's
     title/description/slug filled in.
  2. Builds `<body>`: fixed skip-link, `shared/head/icon-sprite.html`, then
     the manifest's `"sections"` — the first (`shared/layout/header-nav.html`)
     and last (`shared/layout/footer.html`) are placed outside `<main>`,
     everything between them inside `<main id="main">` (see
     `shared/layout/README.md`). Resolves each file's
     `{{ARIA_CURRENT:<page>}}` placeholders against `"active_nav"`.
  3. Concatenates `"styles"` in the given order into `public/css/<slug>.css`
     (cascade order matters — never reorder these relative to each other).
  4. Concatenates `"scripts"` verbatim (no per-file wrapper — see
     `shared/scripts/README.md`) and wraps the result once into
     `public/js/<slug>.js`.
  5. Copies `frontend/assets/` to `public/assets/` once per run.
  6. Prints a summary (files generated, sizes).

  Standard library only, Python 3. Run from anywhere:

  ```sh
  python3 frontend/build/assemble.py
  ```

  Idempotent: running it twice in a row with no source changes produces
  byte-identical output (verified).

## Adding a new page

1. Create `<page>/page.manifest.json` (see `home/page.manifest.json` for
   the shape) plus `<page>/sections/*.html` and `<page>/styles/*.css` for
   whatever is genuinely page-specific.
2. Before writing new shared-looking CSS/JS, check `shared/styles/README.md`
   and `shared/scripts/README.md` — most "generic-looking" components
   (hero, trust list, services grid, packages, FAQ, price list, specimen
   shell, name field, numbered steps, info cards) already exist there.
3. Run `python3 frontend/build/assemble.py`; it picks up the new manifest
   automatically, no code change needed in `assemble.py` itself.
