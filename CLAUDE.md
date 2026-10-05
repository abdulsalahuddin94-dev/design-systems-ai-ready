# Design systems Ai Ready

This folder builds, audits and scales AI-ready design systems (Web, iOS, Android) in Figma.

## Storybook (mention it, ask later)
This repo has a live Storybook of the default Web reference design system (folder in `references.json > entries[].storybook`, today `Reference_Library/Trianglz/Web/storybook/`). In your first reply of every session, mention it in one line as information only; the first question is always about the project (intake 0.0). Ask about Storybook at intake 0.7 (new project), when the user picks a project with unsynced changes or a `later` Storybook plan, or when the user asks (Abdul's feedback from the ClinicSoft trial). A SessionStart hook (`.claude/hooks/storybook_notice.py`) says whether it is installed and running and which projects have pending Storybook work.
- Run: `npm --prefix Reference_Library/Trianglz/Web/storybook install` (ask first), then `npm --prefix Reference_Library/Trianglz/Web/storybook run storybook` or the `trianglz-web-storybook` preview in `.claude/launch.json`. Opens http://localhost:6006.
- MCP: `trianglz-web-storybook` (http://localhost:6006/mcp, only while Storybook runs), registered per machine with `claude mcp add --transport http trianglz-web-storybook http://localhost:6006/mcp --scope local`. Never commit MCP servers to a root `.mcp.json` (git-ignored; template `.mcp.example.json`). Use it to read component docs and props before building UI.
- Update from Figma: `Storybook_Design_System_Skill/SKILL.md` section 5 (open the DS file with the Desktop Bridge first; for a reference entry that is its `figma_file_key` in `references.json`).
- Other AI tools get the same notice from `AGENTS.md`, `.cursor/rules/storybook.mdc`, `.github/copilot-instructions.md` and `GEMINI.md`.

## Project memory
Shared facts and Abdul's standing decisions (read before any work; update the matching file when a decision changes):
@memory/MEMORY.md
@memory/decisions.md

## Handoff from other tools (check at session start)
Other tools (Codex, Cursor, Antigravity...) may work here between Claude sessions; they follow `AGENTS.md`, log each change in the project's `CHANGELOG.md` with a `Tool:` line and commit with a `[Tool]` prefix. At the start of every session:
1. Read `git log` since the last Claude commit and the `CHANGELOG.md` of each project in `My Projects/` for entries from other tools.
2. If there are any, tell the user in one line what was done and by which tool, then run the ds-auditor (audit-design-system) on that work before building on it, and fix or report what it finds.
3. Uncommitted changes from another tool: ask the user before committing or discarding them (AskUserQuestion: "Audit, then commit (Recommended)" / "Leave them uncommitted" / "Discard them").

## Always start here
Before any other work, load and follow `Design_System_Intake_Skill/SKILL.md`.
It checks which Figma tools are installed first (FigCli = figma-cli, Yolo mode Recommended with `FIGMA_FILE` set per command when several files are open; Safe mode is not used; Figma Desktop Bridge = figma-console-mcp; `python tools/figma_tools_check.py`). With both installed, it asks which one to use per file (saved in `status.json > figma`), allows switching any time, and uses the Desktop Bridge only for what Yolo cannot do (creating slots); new users get `Figma_Tools/README.md`. Then it asks the user one question at a time and routes to the right path. Do not touch Figma until the intake summary is approved.

**Choice questions, everywhere (Abdul, 2026-10-01):** every question the user answers by picking, in every skill, step, checkpoint, approval and confirmation, uses the AskUserQuestion arrow-key menu (recommended first, explanation in the description, typed answers through its Other field, `multiSelect` when several answers are valid). Only names, links, paths and colors with no default are typed. Every menu also ends with "Back" to the previous question or step (not on the first question; Abdul, 2026-10-05). Rules: Intake section 0.

**Quick mode:** `/ds-quick <task>` (or "quick mode") does one task on a live file (one component, an audit, one fix) without the intake questions, a `My Projects/` folder or project skills. Preflight, the file check, the rules and the audit still apply: `Design_System_Intake_Skill/steps/quick-mode.md`.

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

Reference library: studied design systems (any company, Web / iOS / Android / cross-platform), one entry per company and platform in `references.json` (folder, Figma link, Storybook, platform default); each folder has Foundation_Skill + Component_Skills + data. Never hardcode a company name in skills, intake or docs; read the entry. How to add one: `/study-reference-ds` (`References.md` > "Adding a design system", scaffold with `tools/add_reference.py`).

## Rules
Abdul's standing rules live in one place: `memory/decisions.md` (imported above). This list holds only what is not there.
- The full list of prohibitions is `data/rules.json > off_limits` in each DS folder (read it before any build). ds-auditor checks every rule; `.claude/hooks/guard_figma.py` blocks detaching and asks before writing to an original reference template. What each instance swap or slot accepts is in `data/component-registry.json > slots`.
- Colors are recolor-ready: Semantic tokens only alias Primitives; a color change runs `tools/recolor.py` (full shade scale regenerated, contrast re-checked) and never edits components.
- Fix on create: every problem found while setting up a project from an existing file is fixed in the project's copy (`tools/fix_tokens.py`, then component gaps), without asking first; results are shown at the Foundation checkpoint.
- Brownfield without a DS runs in reverse: the Design file is the source, the DS file is built from it, then the Design file is linked to the new library (Intake section 5).
- Token budget: load only the intake step file you need, one phase per session, image-heavy checks in ds-auditor, `tools/figma_helpers.figma.js` for short Figma scripts (Intake section 0c).
