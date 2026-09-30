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
- Each project lives in `My Projects/<Project>/` (Web), `<Project>_iOS/`, `<Project>_Android/` or `<Project>_Mobile/`, copied from `My Projects/_Project_Template/` (`Project_Brief.md`, `Inputs/`, `Foundation_Skill/`, `Component_Skills/`). Intake first lists `My Projects/` and asks which project to work on or whether to start a new one. The Root holds only the workflow.
- Platforms are independent: nothing is shared or merged between Web, iOS and Android.
- Find Figma nodes by name. Node IDs in the Trianglz skills are valid in the original files only.
- Build order: Primitives, Semantics (Light/Dark), Spacing/Radius/Typography variables, styles, icons, components (Atoms, Molecules, Organisms, Patterns), linked docs, audit, project skills.
- Required skills: figma-use + figma-generate-library before building; figma-generate-design + ui-ux-pro-max for screens; audit-design-system at the end of every build.
- Colors are recolor-ready: Semantic tokens only alias Primitives; a color change runs `tools/recolor.py` (full shade scale regenerated, contrast re-checked) and never edits components.
- Fix on create: every problem found while setting up a project from an existing file is fixed in the project's copy (`tools/fix_tokens.py`, then component gaps), without asking first; results are shown at the Foundation checkpoint.
- Figma files: each project's `status.json > figma` holds one Design System file and a list of Design files (name, URL, file key). Before any Figma work, confirm the connected file key matches the project and role; on a mismatch stop and warn. After any DS change, ask the user to publish the library, log it in `CHANGELOG.md`, and list which Design files still need Accept updates. Brownfield without a DS runs in reverse: the Design file is the source, the DS file is built from it, then the Design file is linked to the new library (Intake section 7c and Step 4).
- Changelog: every session that changes a project's Figma file appends a dated entry to its `CHANGELOG.md` with `Storybook synced: no` and refreshes `status.json` (`python tools/project_status.py "<folder>"`); a Storybook update runs it with `--mark-synced`. The SessionStart hook (`.claude/hooks/storybook_notice.py`) is the only daily Storybook check (Abdul, 2026-09-30: no separate scheduled question): it lists projects with unsynced entries and Design files needing Accept updates, from these files only (Figma may be closed); mention them in one line and ask whether to open the Figma plugin and update Storybook when the user picks that project.
- Design file audit (Abdul, 2026-09-30): every time screens are built or changed in a Design file, run audit-design-system (ds-auditor, screens mode) on it, save the report in the project's `audits/` and log it in `CHANGELOG.md` (Intake section 7d).
- Never install tools on the user's behalf; show the install steps and let them do it.
