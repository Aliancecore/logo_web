#!/usr/bin/env python3
"""assemble.py — regenerates the static pages in frontend/public/ from the
per-page page.manifest.json files, plus the shared/ and <page>/ source
fragments they point at.

Usage (from anywhere; paths are resolved relative to this file):
    python3 frontend/build/assemble.py

What it does, per manifest found:
  1. Reads shared/head/document-head.html and fills {{PAGE_TITLE}},
     {{PAGE_DESCRIPTION}}, {{PAGE_SLUG}}, {{PAGE_CSS}}, {{PAGE_JS}} from the
     manifest, to build <head>...</head>.
  2. Builds <body>: a fixed skip-link, then the page's icon sprite (the
     file at manifest["icon_sprite"], or shared/head/icon-sprite.html by
     default — the 7 inner pages override this to icon-sprite-inner.html,
     see that file's header for why), then every file listed in "sections"
     (in order), with each file's {{ARIA_CURRENT:<page>}} placeholders
     resolved against "active_nav".
  3. Writes the full HTML document to public/<output_file>.
  4. Concatenates "styles" (in the exact order given — CSS cascade order
     matters) into public/css/<slug>.css.
  5. Concatenates "scripts" (in the exact order given, each file's content
     verbatim, no per-file wrapper) and wraps the result ONCE in
     "(function () { 'use strict'; ... })();", written to public/js/<slug>.js.
  6. Copies frontend/assets/ to public/assets/ (fonts, images, favicon),
     once per run, so url()/href paths written as "assets/..." resolve the
     same way from public/ as they do today from frontend/.
  7. Prints a summary of every page generated and the size of each file.

Standard library only — no third-party dependency, matching the project's
"no build tooling" rule for the shipped site; this script is a developer-time
convenience, not something the browser ever loads.
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

FRONTEND = Path(__file__).resolve().parent.parent
PUBLIC = FRONTEND / "public"
HEAD_TEMPLATE = FRONTEND / "shared" / "head" / "document-head.html"

# Which sprite a page gets is NOT a free choice: home and the 7 inner pages
# each originally shipped their own fixed, byte-identical-within-their-group
# sprite (see shared/head/icon-sprite.html and icon-sprite-inner.html's own
# headers for the evidence). Default to home's; a manifest overrides with
# "icon_sprite" when it is one of the 7 inner pages.
DEFAULT_ICON_SPRITE = "shared/head/icon-sprite.html"

# The skip-link is one fixed line, identical on every page (accessibility:
# lets a keyboard/screen-reader visitor jump past the header). It is not
# worth its own fragment file, so it lives here, once, clearly labelled.
SKIP_LINK = '  <a class="skip-link" href="#main">Skip to content</a>'

ARIA_CURRENT_RE = re.compile(r"\{\{ARIA_CURRENT:([^}]+)\}\}")

# Directories that are never searched for a page.manifest.json: shared/ and
# build/ hold infrastructure, not pages, and public/ is generated output.
EXCLUDED_DIRS = {"shared", "build", "public"}

# Every page's "sections" list starts with the shared header and ends with
# the shared footer (see home/page.manifest.json). Everything strictly
# between them is the page's own content and belongs inside <main id="main">,
# matching the original hand-written pages (header and footer sit outside
# <main>). Recognised by exact path so this stays explicit, not a guess.
HEADER_SECTION = "shared/layout/header-nav.html"
FOOTER_SECTION = "shared/layout/footer.html"


def find_manifests() -> list[Path]:
    manifests = []
    for path in sorted(FRONTEND.glob("*/page.manifest.json")):
        if path.parent.name in EXCLUDED_DIRS:
            continue
        manifests.append(path)
    return manifests


def escape_text(value: str) -> str:
    """Minimal HTML-escaping for text that lands inside an element (the <title>)."""
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def escape_attr(value: str) -> str:
    """Minimal HTML-escaping for text that lands inside a quoted attribute
    (the meta description)."""
    return escape_text(value).replace('"', "&quot;")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def resolve_aria_current(text: str, active_nav: str) -> str:
    def repl(match: re.Match) -> str:
        page = match.group(1)
        return ' aria-current="page"' if page == active_nav else ""

    return ARIA_CURRENT_RE.sub(repl, text)


def build_head(manifest: dict, slug: str) -> str:
    head = read(HEAD_TEMPLATE)
    head = head.replace("{{PAGE_TITLE}}", escape_text(manifest["title"]))
    head = head.replace("{{PAGE_DESCRIPTION}}", escape_attr(manifest["description"]))
    head = head.replace("{{PAGE_SLUG}}", slug)
    head = head.replace("{{PAGE_CSS}}", f"css/{slug}.css")
    head = head.replace("{{PAGE_JS}}", f"js/{slug}.js")
    return head


def build_body(manifest: dict, manifest_dir: Path) -> str:
    active_nav = manifest["active_nav"]
    sections = list(manifest["sections"])
    icon_sprite = FRONTEND / manifest.get("icon_sprite", DEFAULT_ICON_SPRITE)

    has_header = bool(sections) and sections[0] == HEADER_SECTION
    has_footer = bool(sections) and sections[-1] == FOOTER_SECTION
    header_rel = sections.pop(0) if has_header else None
    footer_rel = sections.pop(-1) if has_footer else None

    def render(rel_path: str) -> str:
        section_path = FRONTEND / rel_path
        if not section_path.is_file():
            raise FileNotFoundError(
                f"{manifest_dir.name}/page.manifest.json references missing "
                f"section file: {rel_path}"
            )
        return resolve_aria_current(read(section_path).rstrip("\n"), active_nav)

    parts = [SKIP_LINK, "", read(icon_sprite).rstrip("\n")]
    if header_rel:
        parts.append(render(header_rel))

    main_parts = [render(rel_path) for rel_path in sections]
    parts.append('<main id="main">\n' + "\n\n".join(main_parts) + "\n</main>")

    if footer_rel:
        parts.append(render(footer_rel))

    return "\n\n".join(parts)


def build_page_html(manifest: dict, manifest_dir: Path, slug: str) -> str:
    head = build_head(manifest, slug)
    body = build_body(manifest, manifest_dir)
    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        f"{head}\n"
        "</head>\n"
        "\n"
        "<body>\n"
        f"{body}\n"
        "</body>\n"
        "</html>\n"
    )


def build_css(manifest: dict) -> str:
    pieces = []
    for rel_path in manifest["styles"]:
        css_path = FRONTEND / rel_path
        if not css_path.is_file():
            raise FileNotFoundError(f"missing style file: {rel_path}")
        pieces.append(read(css_path).rstrip("\n"))
    return "\n\n".join(pieces) + "\n"


def build_js(manifest: dict) -> str:
    pieces = []
    for rel_path in manifest["scripts"]:
        js_path = FRONTEND / rel_path
        if not js_path.is_file():
            raise FileNotFoundError(f"missing script file: {rel_path}")
        pieces.append(read(js_path).rstrip("\n"))
    body = "\n\n".join(pieces)
    # ONE wrapper for the whole assembled page, never one per fragment — the
    # fragments in shared/scripts/ share a single function scope by design
    # (see shared/scripts/README.md). Re-indent each line by two spaces so
    # the wrapped output reads like a normal single IIFE.
    indented = "\n".join(
        ("  " + line if line.strip() else line) for line in body.splitlines()
    )
    return "(function () {\n" "  'use strict';\n" "\n" f"{indented}\n" "})();\n"


def copy_assets() -> None:
    src = FRONTEND / "assets"
    dst = PUBLIC / "assets"
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def main() -> int:
    manifests = find_manifests()
    if not manifests:
        print("No page.manifest.json found under", FRONTEND, file=sys.stderr)
        return 1

    PUBLIC.mkdir(exist_ok=True)
    (PUBLIC / "css").mkdir(exist_ok=True)
    (PUBLIC / "js").mkdir(exist_ok=True)

    summary = []
    for manifest_path in manifests:
        manifest_dir = manifest_path.parent
        manifest = json.loads(read(manifest_path))
        slug = manifest["slug"]

        html = build_page_html(manifest, manifest_dir, slug)
        out_html = PUBLIC / manifest["output_file"]
        out_html.write_text(html, encoding="utf-8")

        css = build_css(manifest)
        out_css = PUBLIC / "css" / f"{slug}.css"
        out_css.write_text(css, encoding="utf-8")

        js = build_js(manifest)
        out_js = PUBLIC / "js" / f"{slug}.js"
        out_js.write_text(js, encoding="utf-8")

        summary.append((manifest["output_file"], out_html, out_css, out_js))

    copy_assets()

    print("Pages generated:")
    for output_file, out_html, out_css, out_js in summary:
        print(f"  {output_file}")
        print(f"    {out_html.relative_to(FRONTEND)}  ({out_html.stat().st_size:,} bytes)")
        print(f"    {out_css.relative_to(FRONTEND)}  ({out_css.stat().st_size:,} bytes)")
        print(f"    {out_js.relative_to(FRONTEND)}  ({out_js.stat().st_size:,} bytes)")
    print(f"  assets/ copied to {(PUBLIC / 'assets').relative_to(FRONTEND)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
