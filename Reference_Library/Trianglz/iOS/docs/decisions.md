# Decisions - Trianglz iOS

A log of why the system is built the way it is. Add a dated entry for every decision, recolor or rule change.

## 2026-09-30 - JSON knowledge base
- **What:** `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`, pulled read-only from the Figma file through the Desktop Bridge. `data/source/` keeps the raw export.
- **Why:** agents read exact values from JSON instead of interpreting prose. The skills point here instead of repeating numbers.
- **How to refresh:** export variables with figma-console `figma_export_tokens` (format dtcg) into `data/source/figma-variables.dtcg.json`, then run `python tools/build_tokens.py Reference_Library/Trianglz/iOS`.

## 2026-09-30 - Recolor-ready rule
- **What:** a color change edits only `Color / Primitive` values. `Color / Brand` and `Color / Semantic` alias them, so every component follows. Shades regenerate from the new base with the ramp's captured OKLCH curve (`tools/recolor.py`, method `oklch`).
- **Why:** Abdul's requirement: changing a color must update every shade cleanly with no manual fixes.
- **Found:** all 41 Brand and Semantic color tokens alias Primitives (0 raw hex): the file is recolor-ready. 9 ramps detected, including `⭐ Brand Palette/Primary Blue` and `Secondary Indigo`.
- **Found:** Primitives have Light and Dark modes with identical values; the recolor script writes both modes. New builds use one mode for Primitives.
- **Already failing before any recolor** (fix by re-pointing aliases, not by recolor): Tertiary Text and Placeholder on Card (Light), status text on status backgrounds, Borders/Strong on Card.

## 2026-09-30 - Dark mode as modes, not variants
- **What:** Light and Dark are Semantic modes. Many Apple-kit parts still carry `Mode=Light|Dark` variants (keyboards, toolbars, activity views); new components must not.
- **Why:** one component per state; recolor and dark changes happen in variables only.

## Open
- No real Icon set yet (SF Symbol text glyphs); build `Icon/<Name>` per `rules.json > icons`.
- Rename `spacnig` -> `spacing` and `Raduis` -> `Radius` when the file is refactored (names are keys in tokens.json, so re-run the builder after).
