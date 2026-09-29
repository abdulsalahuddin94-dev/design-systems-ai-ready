---
name: references
description: Where the Trianglz reference files, skills and data live, and their known open items
type: reference
updated: 2026-09-30
---

# Trianglz references

| Platform | Figma file key | Skills folder |
|---|---|---|
| Web | `7qsOqckanKwGDbkljD3rb9` | `Trianglz/` |
| iOS | `q5nQHGEGzZ94WN0wilJwLW` | `Trianglz_iOS/` |
| Android (M3) | `JUs2c8IO6ybFcGRZjcQzr9` | `Trianglz_Android/` |

Full links: `References.md`. Never edit the originals; duplicate them.

Each folder has `Foundation_Skill/` and `Component_Skills/{Form_Elements,Navigation,Data_Display}_Skill/` (SKILL.md, references/components.md, gaps.md, screens/), plus `data/` (tokens.json, component-registry.json, rules.json, screen-templates.json, source/). Tools: `tools/build_tokens.py`, `tools/recolor.py` (see `tools/README.md`).

Open items:
- `data/` files were built from the skill reference files, not a live export (`needs_resync: true`). Re-export with figma-console `figma_export_tokens` when the file is open in the Desktop Bridge (token-extractor subagent).
- `gaps.md` in each skill is the refactor backlog for the Trianglz files.

Storybook (Web proof, 2026-09-30): `Trianglz/storybook/` (Storybook 10.6, React + Vite). Run `npm --prefix Trianglz/storybook run storybook` or the `trianglz-web-storybook` preview; MCP at `http://localhost:6006/mcp` (registered in `.mcp.json`). Generators: `tools/tokens_to_css.py`, `tools/storybook_stories.py`, `tools/storybook_parity.py`.
