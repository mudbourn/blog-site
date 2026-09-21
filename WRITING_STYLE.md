# Mudscript Writing Style

Lua examples. Every rule applies to all code (Lua, JS, HTML/CSS) and to docs.
Read the whole file you touch against this style before you finish, not only
your own lines. Every edit leaves the file more compliant, never less. When a
region you touch already breaks a rule, fix it as part of the same edit.

## Comments: only two kinds exist

A code file may carry exactly two kinds of comment. Anything else is deleted on
sight, including comments already there before you.

**1. One-liner label.** One short line naming the thing directly below it.

```lua
-- Clears the cache
function ms.cache.flush() ... end
```

**2. Section marker.** A matched OPEN and END pair using the language's own
comment characters on both sides, body indented one level deeper so it folds.
This is the only reason to write a section comment. See
[Section markers](#section-markers) for the exact shape.

Everything else is banned, however you frame it. A short note is still a why
essay. Catch yourself writing any of these and do not write them:

- Rationale or why essays of any length. Reasoning lives in the commit and PR.
- Diff narration justifying a line you just changed.
- Keep-in-sync notes asking a human to mirror another place. Enforce that in
  lint or code, not prose.
- Provenance notes (moved, migrated, staged from, source for phase-N).

When you edit a region holding a banned comment, delete it. Do not preserve,
reword, or move it into a companion doc. It is not allowed just because it was
already there.

## No dead code

Changing a value means replacing the old line, not stacking a new one under it.
Two declarations with the last winning is a defect. No commented-out code.

## Section markers

Fold markers organise code so it collapses in editors like Zed. A marker counts
only as a matched pair whose body sits one indent deeper. An OPEN with no END,
or a marker at the same indent as its code, is a decorative label. Banned.

```lua
-- Parent Section --
    -- Child --
        ...code...
    -- END --

    -- Child --
        ...code...
    -- END --
-- END Parent Section --
```

Rules:

- OPEN carries the label. END may drop it. Deep children may use bare `-- END --`.
- No blank line between an OPEN and its first child, between a child END and
  the parent END, or between a section's last code line and its END.
- Blank lines separate SIBLING sections only.
- In flat lists and table literals, siblings share one indent, so you cannot
  nest a subset under a bare label. Either promote it to a real closed nested
  section, or drop the marker and separate with a blank line. Never the
  half-state of an OPEN with no END and an unindented body.

## Multi-field tables

A table literal with more than one field puts each field on its own line. Call
arguments, locals, returns, array entries, all the same. No inline packing.

Good:

```lua
ms.settings.define({
    type = "groupLabel",
    label = "Slide Setup",
    section = "calibration"
})
```

Bad:

```lua
ms.settings.define({ type = "groupLabel", label = "Slide Setup" })
```

A single-field table may stay on one line:

```lua
ms.settings.define({ type = "divider", section = "calibration" })
local origin = { x = 0 }
```

## Blank lines

Every distinct call, block, or definition gets a blank line around it. Do not
stack calls against each other.

```lua
ms.bind.define("jumpHigh", fn, { label = "Jump High", mod = "v" })

ms.bind.define("jumpLow", fn, { label = "Jump Low", mod = "x" })
```

## Field alignment

Column-aligning fields is optional. Prefer consistency within one block over
strict alignment across blocks.

## Docs

Docs state what is true now, directly. No meta-commentary about the docs
themselves, no provenance, no notes that content was moved or extracted.

## Symbols and wording

Plain QWERTY characters only. No em-dashes, no semicolons, and no unicode or
copy-pasted symbols anywhere in code or prose. Reduce fringe or field-specific
words.

A UI that needs a glyph (check mark, chevron, close, drag handle) loads an SVG
from `ui/svg`, never a unicode character. When the icon you need is not in
`ui/svg`, do not reach for the unicode symbol as a fallback. Stop and warn the
user of the SVG gap, naming the missing icon so they can add it, then wire the
SVG once it lands.
