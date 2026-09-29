# Decisions - Trianglz Web

A log of why the system is built the way it is. Add a dated entry for every decision, recolor or rule change.

## 2026-09-30 - JSON knowledge base
- **What:** `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`.
- **Source:** pulled read-only from the Figma file through the Desktop Bridge (re-synced 2026-09-30; the first draft was built from the skill notes).
- **How to refresh:** export variables with figma-console `figma_export_tokens` (format dtcg) into `data/source/figma-variables.dtcg.json`, then run `python tools/build_tokens.py Trianglz`.
- **The live file is ahead of the study notes:** components already use the refactored names (Input / Text, OTP / Cell, Radio, Menu / Item, Select / Dropdown, Breadcrumb, Toast, Button Type=Danger), 42 local `Icon/*` components, `color/icon/*` and `color/border/input` tokens, `alpha/black-50|70` primitives, 13 effect styles and 3 grid styles. Where the component skills disagree, trust `data/component-registry.json`.

## 2026-09-30 - Recolor-ready rule
- **What:** a color change edits only `Primitives`. `Semantic` tokens alias Primitives, so every component follows. Shades regenerate from the new base with the ramp's captured OKLCH curve (`tools/recolor.py`, method `oklch`).
- **Why:** Abdul's requirement: changing a color must update every shade cleanly with no manual fixes.
- **Found:** all 79 Semantic tokens alias Primitives (0 raw hex): recolor-ready. 7 ramps (`blue`, `gray`, `red`, `yellow`, `green`, `purple`, `Orange`) with steps 0-950. `blue` is the brand ramp.
- **Already failing before any recolor:** text/muted and text/placeholder (gray-400), status text on status backgrounds (Light), border/strong. Fix by re-pointing aliases (see Web_Design_System_Skill contrast targets).

## 2026-09-30 - Dark mode as modes, not variants
- Dark = Semantic mode Dark on the frame; dark previews are instances in Dark-mode frames, never duplicate sets.
