# Decisions - Trianglz Android (M3)

A log of why the system is built the way it is. Add a dated entry for every decision, recolor or rule change.

## 2026-09-30 - JSON knowledge base
- **What:** `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json`, pulled read-only from the Figma file through the Desktop Bridge. `data/source/` keeps the raw export.
- **Why:** agents read exact values from JSON instead of interpreting prose. The skills point here instead of repeating numbers.
- **How to refresh:** export variables with figma-console `figma_export_tokens` (format dtcg) into `data/source/figma-variables.dtcg.json`, then run `python tools/build_tokens.py Reference_Library/Trianglz/Android`.

## 2026-09-30 - Recolor-ready rule
- **What:** a color change edits only `Palettes` tones. `m3` Schemes alias Palettes, so components follow. The new key color becomes tone 40; every other tone keeps its exact L* (M3 tone), with hue and chroma from the new color (`tools/recolor.py`, method `m3-tone`).
- **Why:** Abdul's requirement: changing a color must update every shade cleanly with no manual fixes.
- **Found:** Schemes alias Palettes correctly (good), but `m3::State Layers/*` (165 variables) and `m3::Surfaces/Surface Tint *` hold **raw RGBA**: 330 raw mode values, and 234 of them already no longer match their role color. Figma cannot alias a color with alpha, so these are **derived tokens**: `rules.json > recolor.derived_tokens` tells the recolor script to regenerate them from the role color and the opacity in the name.
- **Found:** `m3::Schemes/Background (Deprecated)/Background` [Dark] points to a variable in another library. Re-point it to a local Palette tone.
- **Found:** role names with typos break automatic matching: `Success/Sucess Container`, `Surface/Surface Variant??`. Mapped in `role_aliases` until renamed.

## 2026-09-30 - Dark mode as modes, not variants
- **What:** Light and Dark are modes of the `m3` collection. Components never get a `Mode=Light|Dark` variant.
- **Why:** one component per state, and a recolor or dark tweak changes one variable instead of every duplicate.

## Open
- No spacing variables exist yet (every padding/gap is raw); add `space/*` per `rules.json > spacing` before building screens.
