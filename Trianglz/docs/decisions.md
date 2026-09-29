# Decisions - Trianglz Web

A log of why the system is built the way it is. Add a dated entry for every decision, recolor or rule change.

## 2026-09-30 - JSON knowledge base
- **What:** `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`.
- **Source:** the Web file was not open in the Desktop Bridge, so tokens and the registry were built from `Foundation_Skill/references/variables.md` and the component skills. Both files say `needs_resync: true`.
- **To re-sync:** open the Web file in Figma Desktop with the Desktop Bridge plugin running, export variables with `figma_export_tokens` (format dtcg) into `data/source/figma-variables.dtcg.json`, delete `data/source/variables.from-skill.json`, update the collection ids in `data/source/config.json`, and run `python tools/build_tokens.py Trianglz`. Re-extract components the same way as iOS/Android.

## 2026-09-30 - Recolor-ready rule
- **What:** a color change edits only `Primitives`. `Semantic` tokens alias Primitives, so every component follows. Shades regenerate from the new base with the ramp's captured OKLCH curve (`tools/recolor.py`, method `oklch`).
- **Why:** Abdul's requirement: changing a color must update every shade cleanly with no manual fixes.
- **Found (from the notes):** Semantic tokens alias Primitives; 7 ramps (`blue`, `gray`, `red`, `yellow`, `green`, `purple`, `Orange`) with steps 0-950. `blue` is the brand ramp.
- **Already failing before any recolor:** text/muted and text/placeholder (gray-400), status text on status backgrounds (Light), border/strong. Fix by re-pointing aliases (see Web_Design_System_Skill contrast targets).

## 2026-09-30 - Dark mode as modes, not variants
- Dark = Semantic mode Dark on the frame; dark previews are instances in Dark-mode frames, never duplicate sets.
