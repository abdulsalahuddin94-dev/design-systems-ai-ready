# Design systems Ai Ready

This folder builds, audits and scales AI-ready design systems (Web, iOS, Android) in Figma.

## Storybook (mention it, ask later)
This repo has a live Storybook of the design system: `Trianglz/storybook/` (Web). In your first reply of every session, mention it in one line as information only; the first question is always about the project (intake 0.0). Ask about Storybook at intake 0.7 (new project), when the user picks a project with unsynced changes or a `later` Storybook plan, or when the user asks (Abdul's feedback from the ClinicSoft trial). A SessionStart hook (`.claude/hooks/storybook_notice.py`) says whether it is installed and running and which projects have pending Storybook work.
- Run: `npm --prefix Trianglz/storybook install` (ask first), then `npm --prefix Trianglz/storybook run storybook` or the `trianglz-web-storybook` preview in `.claude/launch.json`. Opens http://localhost:6006.
- MCP: `trianglz-web-storybook` in `.mcp.json` (http://localhost:6006/mcp, only while Storybook runs). Use it to read component docs and props before building UI.
- Update from Figma: `Storybook_Design_System_Skill/SKILL.md` section 5 (open the DS file with the Desktop Bridge first; for Trianglz Web that is the file key in `memory/references.md`).
- Other AI tools get the same notice from `AGENTS.md`, `.cursor/rules/storybook.mdc`, `.github/copilot-instructions.md` and `GEMINI.md`.

## Project memory
Shared facts and Abdul's standing decisions (read before any work; update the matching file when a decision changes):
@memory/MEMORY.md
@memory/decisions.md

## Handoff from other tools (check at session start)
Other tools (Codex, Cursor, Antigravity...) may work here between Claude sessions; they follow `AGENTS.md`, log each change in the project's `CHANGELOG.md` with a `Tool:` line and commit with a `[Tool]` prefix. At the start of every session:
1. Read `git log` since the last Claude commit and the `CHANGELOG.md` of each project in `My Projects/` for entries from other tools.
2. If there are any, tell the user in one line what was done and by which tool, then run the ds-auditor (audit-design-system) on that work before building on it, and fix or report what it finds.
3. Uncommitted changes from another tool: ask the user before committing or discarding them.

## Always start here
Before any other work, load and follow `Design_System_Intake_Skill/SKILL.md`.
It checks which Figma tools are installed first (Figma Desktop Bridge = figma-console-mcp, FigCli = figma-cli in Safe mode; `python tools/figma_tools_check.py`). With both installed, it asks which one to use per file (saved in `status.json > figma`), allows switching any time, and suggests the better one before costly steps; new users get `Figma_Tools/README.md`. Then it asks (fixed-option questions through the AskUserQuestion arrow-key menu, Intake section 0) the user one question at a time and routes to the right path. Do not touch Figma until the intake summary is approved.

## Main Skills (Root)
| Skill | Use for |
|---|---|
| `Design_System_Intake_Skill/SKILL.md` | Entry point for every job: preflight, questions, path, checkpoints |
| `Web_Design_System_Skill/SKILL.md` | Web systems (Tailwind conventions) |
| `iOS_Design_System_Skill/SKILL.md` | iOS systems (Apple HIG) |
| `Android_Design_System_Skill/SKILL.md` | Android systems (Material Design 3) |
| `Storybook_Design_System_Skill/SKILL.md` | Optional: live Storybook (React + Storybook MCP) from a finished DS; names match Figma exactly |

Knowledge base (exact values, read these instead of re-deriving or re-reading Figma): each DS folder has `data/tokens.json`, `data/component-registry.json`, `data/rules.json`, `data/screen-templates.json` and `docs/decisions.md`. Tools in `tools/` (`build_tokens.py`, `recolor.py`).

Subagents (`.claude/agents/`): `ds-auditor` (read-only QA after every build step and for weekly drift), `token-extractor` (Figma variables or screens to `data/tokens.json`), `docs-writer` (skills, registry and usage docs from Figma). Hooks in `.claude/settings.json` block absolute paths in files and remind you to run the audit after Figma changes. Weekly drift audit definition: `.claude/scheduled/weekly-drift-audit.md` (not enabled).

Reference studies of the Trianglz templates: `Trianglz/`, `Trianglz_iOS/`, `Trianglz_Android/` (Foundation_Skill + Component_Skills). Template links: `References.md`.

## Rules
Abdul's standing rules live in one place: `memory/decisions.md` (imported above). This list holds only what is not there.
- The full list of prohibitions is `data/rules.json > off_limits` in each DS folder (read it before any build). ds-auditor checks every rule; `.claude/hooks/guard_figma.py` blocks detaching and asks before writing to an original Trianglz template. What each instance swap or slot accepts is in `data/component-registry.json > slots`.
- Colors are recolor-ready: Semantic tokens only alias Primitives; a color change runs `tools/recolor.py` (full shade scale regenerated, contrast re-checked) and never edits components.
- Fix on create: every problem found while setting up a project from an existing file is fixed in the project's copy (`tools/fix_tokens.py`, then component gaps), without asking first; results are shown at the Foundation checkpoint.
- Brownfield without a DS runs in reverse: the Design file is the source, the DS file is built from it, then the Design file is linked to the new library (Intake section 5).
- Token budget: load only the intake step file you need, one phase per session, image-heavy checks in ds-auditor, `tools/figma_helpers.figma.js` for short Figma scripts (Intake section 0c).
