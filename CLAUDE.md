# Design systems Ai Ready

This folder builds, audits and scales AI-ready design systems (Web, iOS, Android) in Figma.

## Storybook (tell the user first)
This repo has a live Storybook of the design system: `Trianglz/storybook/` (Web). In your first reply of every session, say so in one line and ask: "Do you want me to run the Storybook, update it from Figma, or skip it for now?" A SessionStart hook (`.claude/hooks/storybook_notice.py`) reminds you and says whether it is installed and running.
- Run: `npm --prefix Trianglz/storybook install` (ask first), then `npm --prefix Trianglz/storybook run storybook` or the `trianglz-web-storybook` preview in `.claude/launch.json`. Opens http://localhost:6006.
- MCP: `trianglz-web-storybook` in `.mcp.json` (http://localhost:6006/mcp, only while Storybook runs). Use it to read component docs and props before building UI.
- Update from Figma: `Storybook_Design_System_Skill/SKILL.md`.
- Other AI tools get the same notice from `AGENTS.md`, `.cursor/rules/storybook.mdc`, `.github/copilot-instructions.md` and `GEMINI.md`.

## Project memory
Shared facts and Abdul's standing decisions (read before any work; update the matching file when a decision changes):
@memory/MEMORY.md
@memory/decisions.md

## Always start here
Before any other work, load and follow `Design_System_Intake_Skill/SKILL.md`.
It checks the Figma tools first (figma-console-mcp or figma-cli with the Desktop Bridge connected), then asks the user one question at a time and routes to the right path. Do not touch Figma until the intake summary is approved.

## Main Skills (Root)
| Skill | Use for |
|---|---|
| `Design_System_Intake_Skill/SKILL.md` | Entry point for every job: preflight, questions, path, checkpoints |
| `Web_Design_System_Skill/SKILL.md` | Web systems (Tailwind conventions) |
| `iOS_Design_System_Skill/SKILL.md` | iOS systems (Apple HIG) |
| `Android_Design_System_Skill/SKILL.md` | Android systems (Material Design 3) |
| `Storybook_Design_System_Skill/SKILL.md` | Optional: live Storybook (React + Storybook MCP) from a finished DS; names match Figma exactly |

Knowledge base (exact values, read these instead of re-deriving): each DS folder has `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json` and `docs/decisions.md`. Tools in `tools/` (`build_tokens.py`, `recolor.py`).

Subagents (`.claude/agents/`): `ds-auditor` (read-only QA after every build step and for weekly drift), `token-extractor` (Figma variables or screens to `data/tokens.json`), `docs-writer` (skills, registry and usage docs from Figma). Hooks in `.claude/settings.json` block absolute paths in files and remind you to run the audit after Figma changes. Weekly drift audit definition: `.claude/scheduled/weekly-drift-audit.md` (not enabled).

Reference studies of the Trianglz templates: `Trianglz/`, `Trianglz_iOS/`, `Trianglz_Android/` (Foundation_Skill + Component_Skills). Template links: `References.md`.

## Rules
- The full list of prohibitions is `data/rules.json > off_limits` in each DS folder (read it before any build). ds-auditor checks every rule; `.claude/hooks/guard_figma.py` blocks detaching and asks before writing to an original Trianglz template. What each instance swap or slot accepts is in `data/component-registry.json > slots`.
- All paths are relative to this folder. Never write absolute machine paths into skills.
- Each project lives in `<Project>/` (Web), `<Project>_iOS/`, `<Project>_Android/` or `<Project>_Mobile/`, with `Project_Brief.md`, `Inputs/`, `Foundation_Skill/` and `Component_Skills/`.
- Platforms are independent: nothing is shared or merged between Web, iOS and Android.
- Find Figma nodes by name. Node IDs in the Trianglz skills are valid in the original files only.
- Build order: Primitives, Semantics (Light/Dark), Spacing/Radius/Typography variables, styles, icons, components (Atoms, Molecules, Organisms, Patterns), linked docs, audit, project skills.
- Required skills: figma-use + figma-generate-library before building; figma-generate-design + ui-ux-pro-max for screens; audit-design-system at the end of every build.
- Colors are recolor-ready: Semantic tokens only alias Primitives; a color change runs `tools/recolor.py` (full shade scale regenerated, contrast re-checked) and never edits components.
- Fix on create: every problem found while setting up a project from an existing file is fixed in the project's copy (`tools/fix_tokens.py`, then component gaps), without asking first; results are shown at the Foundation checkpoint.
- Never install tools on the user's behalf; show the install steps and let them do it.
