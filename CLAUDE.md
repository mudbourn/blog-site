# CLAUDE.md

## Writing style is binding

Read [WRITING_STYLE.md](WRITING_STYLE.md) before writing or editing any file, and
check the whole file you touch against it before finishing. It governs all code
(TypeScript, JS, HTML, CSS, SQL) and all docs, including this one. Every edit
leaves a file more compliant, never less.

The rules that bite hardest on this project:

- No semicolons and no em-dashes anywhere, in code or prose. TypeScript and JS
  are written semicolon-free, enforced by Prettier with `semi: false`.
- No unicode or copy-pasted symbols anywhere. Plain QWERTY characters only.
- A UI glyph loads an SVG from `ui/svg`, never a unicode character. When the
  glyph is not in `ui/svg`, stop and warn the user, naming the missing icon, so
  they can add it. Do not fall back to the unicode symbol.
- Comments come in only two kinds: a one-line label, or a matched fold-marker
  pair. Everything else is deleted on sight. No why essays, no diff narration,
  no provenance notes.
- No dead code and no commented-out code. Replace a value, never stack a new
  line under the old one.
- A table or object literal with more than one field puts each field on its own
  line. Blank lines separate every distinct block, call, or definition.

## Glyph note for this build

The design spec leans on unicode glyphs for chrome (hamburger, volume bars,
list markers, bracket notation, transport controls, close). Under the style
rule each of these is an SVG in `ui/svg`. The reaction emoji set is content,
admin-configurable data, not chrome, so it stays as stored emoji strings.

## Stack

Next.js App Router, TypeScript, PostgreSQL with Drizzle ORM, hand-written CSS.
The full design and architecture spec lives outside the repo at the Syncopated
Chaos design document the owner supplies.
