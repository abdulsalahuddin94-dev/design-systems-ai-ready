---
name: references
description: Reference library of studied design systems (references.json): entries, Figma file keys, folders, known open items
type: reference
updated: 2026-10-01
---

# Reference library

Studied design systems live in one library indexed by `references.json` (Root): one entry per company and platform (`web`, `ios`, `android`, `cross-platform`), with folder, Figma file key and link, Storybook and a per-platform `default`. Skills, intake and docs read the entry and never hardcode a company name (Abdul, 2026-10-01: more companies' systems, for all three platforms and cross-platform, will be studied later). Human list and "how to add one": `References.md`. Never edit the originals; duplicate them.

Current entries (one company today, Trianglz, default for all three platforms):

| Entry id | Figma file key | Folder |
|---|---|---|
| `trianglz-web` | `7qsOqckanKwGDbkljD3rb9` | `Reference_Library/Trianglz/Web/` |
| `trianglz-ios` | `q5nQHGEGzZ94WN0wilJwLW` | `Reference_Library/Trianglz/iOS/` |
| `trianglz-android` | `JUs2c8IO6ybFcGRZjcQzr9` | `Reference_Library/Trianglz/Android/` |

Each folder has `Foundation_Skill/` and `Component_Skills/{Form_Elements,Navigation,Data_Display}_Skill/` (SKILL.md, references/components.md, gaps.md, screens/), plus `data/` (tokens.json, component-registry.json, rules.json, screen-templates.json, source/). Tools: `tools/build_tokens.py`, `tools/recolor.py` (see `tools/README.md`). New companies go in `Reference_Library/<Company>/<Platform>/` (`tools/add_reference.py`); the Trianglz folders moved there on 2026-10-01 (Abdul).

Open items:
- `data/` files were built from the skill reference files, not a live export (`needs_resync: true`). Re-export with figma-console `figma_export_tokens` when the file is open in the Desktop Bridge (token-extractor subagent).
- `gaps.md` in each skill is the refactor backlog for that entry's file.

Storybook (Web proof, 2026-09-30): `trianglz-web` entry, `Reference_Library/Trianglz/Web/storybook/` (Storybook 10.6, React + Vite). Run `npm --prefix Reference_Library/Trianglz/Web/storybook run storybook` or the `trianglz-web-storybook` preview; MCP at `http://localhost:6006/mcp` (registered per machine, local scope; root `.mcp.json` is git-ignored since 2026-10-01). Generators: `tools/tokens_to_css.py`, `tools/storybook_stories.py`, `tools/storybook_parity.py`.
