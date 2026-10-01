---
name: decisions
description: Abdul's standing rules for every design system job in this folder (entry flow, build order, atomic tiers, group placement, skill scoping, platforms, tooling)
type: feedback
updated: 2026-09-30
---

# Standing decisions (Abdul)

## Entry flow
- Every job starts with `Design_System_Intake_Skill/SKILL.md`: tools preflight, then one question per message in English (fixed-option questions through the AskUserQuestion arrow-key menu, Abdul 2026-10-01), then the platform Main Skill. No Figma work before the Intake Summary gets a "yes".
- Record answers in `My Projects/<Project>/Project_Brief.md` so later sessions never re-ask.
- One workflow copy in the Root; every project lives in `My Projects/`, created from `My Projects/_Project_Template/`. Intake starts by asking which project or a new one (Abdul, 2026-09-30). Each project may later become its own private repo. ClinicSoft moved there after the trial run (2026-09-30).
- Quick mode (Abdul, 2026-10-01): one specific task on a live file (one component from a live site or captured frames, an audit, one fix) skips the intake questions, the `My Projects/` folder, checkpoints and project skills (`/ds-quick`, `Design_System_Intake_Skill/steps/quick-mode.md`). Preflight, the file check, these rules, atomic tiers, the audit and no self-approval still apply; captured frames are a reference, never the component.
- Approval checkpoints in order: Foundation, Components, Screens. Show Light and Dark screenshots at each.

## Token budget (Abdul, 2026-10-01)
- Trials cost 180-260M tokens per project session (one session of 470-650 turns, context up to 690K). Fixes, same quality gates: the intake is a router plus `Design_System_Intake_Skill/steps/` files loaded per step; Figma skills load at the first build step, not during the intake; one phase per session with a handoff in `Project_Brief.md` / `CHANGELOG.md` / `status.json`; variant screenshots, side-by-side fidelity captures and audits run in ds-auditor, which returns text and numbers; `tools/figma_helpers.figma.js` is pasted once per file per session so scripts stop redefining helpers; names and keys come from `data/*.json` before Figma reads. Details: Intake section 0c.
- The design plugin (Asana, Jira, Linear, Notion, Slack, Intercom) is disabled for this folder in `.claude/settings.json`; stitch, pencil and the official figma MCP server are disabled by Abdul in `/mcp`.

## Figma tool choice (Abdul, 2026-10-01)
- Preflight detects installed tools before asking (`tools/figma_tools_check.py`). None -> `Figma_Tools/README.md`, help install in the same session after a yes. One -> use it, no question. Both -> intake 0.0t: "Figma Desktop Bridge (full build and audit with the Figma skills, catches everything) / FigCli (much faster, with about 20-30x fewer tokens for checks, extract and measure)", saved per file in `status.json > figma` (`design_system.tool`, each Design file's `tool`; `figma.tool` = default/fallback).
- Switching any time, on any file, and mixed setups (FigCli on one file, Desktop Bridge on another) are allowed (Abdul, 2026-10-01). On a switch: re-check the connection and file, save + log it in `CHANGELOG.md`, reload helpers, regenerate the FigCli baseline (also after Desktop Bridge changes and each approved checkpoint). FigCli Safe mode verifies files by exact name with the user; no writes on a mismatch.
- Before costly steps (full build, full audit, Brownfield extract, multi-screen builds), and only when both are installed, say in 2-3 lines which tool fits better and let the user pick. Tools live outside the Root (`<drive>:\Tools`) and are never copied into the repo. Trial numbers: FigCli check 4/5 defects, about 16 s and 300 tokens; Desktop Bridge audit 5/5, about 52 s and 6-10K tokens. The final audit-design-system stays mandatory.

## Build order (always)
1. Primitives (raw values). 2. Semantic variables aliasing Primitives (Light/Dark). 3. Spacing, Radius, Typography variables. 4. Text and effect styles built from those variables. 5. Icons. 6. Components built only on those variables and styles: Atoms, Molecules, Organisms, Patterns. 7. Linked docs pages. 8. Audit. 9. Project skills.

## Atomic design (strict)
- Never build a complex component or screen if its sub-components do not exist yet; build the missing lower tier first as separate main components.
- Before building: state the tier, check dependencies, post the atomic structure map, expose nested booleans, text and instance swaps up the hierarchy.

## Radio vs Select (Abdul, 2026-09-30)
- Radio groups hold 2 to 6 options; 7 or more use Select / Dropdown. Both component descriptions state the same number.

## Design file audit (Abdul, 2026-09-30)
- Every time screens are built or changed in a Design file, run audit-design-system (ds-auditor, screens mode) on that file to confirm it uses the DS (library components, variables, styles; no raw values, detached instances or misused variables). Save the report in the project's `audits/` and log it in `CHANGELOG.md`.

## Multi-screen flows (Abdul, 2026-09-30)
- Flow gap analysis table first (existing vs missing components, tier + atomic map), approved before any build; missing components built in the DS file only; missing tokens proposed and approved; publish, Accept updates, verify; screens one by one from library instances with a Design file audit after each; changelog + Storybook question. Screens needing no new component may be built while waiting for publish. Details: Design_System_Intake_Skill section 7e.

## Screen fidelity (Abdul, 2026-09-30)
- Brownfield trial: Antigravity built 5 screens from the text inventory without opening the screenshots; they used the DS but did not look like the source. Rule: every source screenshot is opened and turned into a screen spec (sections, exact texts, icons, counts, pinned/scrolling), approved with the gap table; every instance gets its real content (no placeholder text); one section per script; each screen is captured next to its source and fixed (up to 3 rounds, stop if capture fails); `tools/check_screens.figma.js` and ds-auditor fidelity checks must be 0. Agents never self-approve a checkpoint (`Ready for review` until Abdul replies). Details: Design_System_Intake_Skill section 7f.

## Scenario C: imperfect DS + Design file (Abdul, 2026-09-30)
- Variable Map first (every variable: scopes, modes, alias, usage in DS components, confidence; references first; ask only on low confidence), approved; DS fixes: safe ones (descriptions, high-confidence scopes, typo renames, missing states) as Fix on create, anything that changes live screens (values, aliases, contrast, low-confidence scopes, merges/deletes) after approval; then publish; Design file audited screen by screen with a proposed fix per issue; raw values: near-miss -> nearest token, repeated -> propose Primitive + Semantic (approval, DS, publish, bind), one-off -> nearest scale step, unsure -> needs decision; screens fixed only after the report is approved, keeping existing sizes; changelog, publish, Accept updates. Details: Design_System_Intake_Skill section 7.

## Alpha colors (Abdul, 2026-10-01)
- A raw color with alpha < 100% is flattened on its real background (color*alpha + bg*(1-alpha)), matched to the nearest opaque Semantic by OKLCH deltaE, rechecked in the other mode; same token in both modes with deltaE < 2 -> bind, else `needs decision`. Scrims/overlays, elements over images and hover/pressed state layers stay transparent; a new alpha token needs approval. Rule: Design_System_Intake_Skill section 7 step 4; helper `tools/flatten_alpha.py`.

## Screen sizes (Abdul, 2026-09-30)
- Screens are Mobile 375px and Desktop 1440px wide. Brownfield: keep the sizes of screens already designed in the file; if the existing screens are only screenshots, use 375 / 1440. Details: Design_System_Intake_Skill section 7d.

## Group placement (Figma pages and skill files)
- Foundations -> ⭐Setup / Foundation_Skill.
- Anything the user enters data with -> ⭐Form Elements / Form_Elements_Skill.
- Actions, buttons, links, tabs, anything that moves between places -> ⭐Navigation / Navigation_Skill.
- Anything that displays information -> ⭐Data Display / Data_Display_Skill.
- A component skill documents only its own group; foundation and build rules live in Foundation_Skill.

## File structure
Follow the Trianglz page layout: Cover, ⭐Setup, then ⭐ groups with ➜ topic pages. Foundation docs pages are always linked: ➜ Colors swatches bound to variables (Light/Dark frames use the matching mode), ➜ Typography samples use text styles bound to Typography variables.

## Platforms
Web (Tailwind conventions), iOS (Apple HIG, Dynamic Type, SF Symbols), Android (Material 3, md.sys tokens). Each platform is fully independent: separate folders, skills, data and Storybook; nothing shared or merged.
- Mobile "Both" (Abdul, 2026-09-30): ask "Native, or cross-platform with one shared design (Flutter/React Native custom UI)?" (intake 1.3). Native -> optional shared `<Project> Brand Foundation` file (Primitives only; each DS copies them locally, never consumes it as a library) + separate iOS DS (HIG names, Dynamic Type, SF Symbols) + separate Android DS (md.sys.color, M3 type, state layers, elevation, Material Symbols) + separate iOS and Android Design files, each linked only to its own DS. Cross-platform -> one DS + one Design file (`<Project>_Mobile/`). Recorded in `status.json > mobile_setup, sibling_project, figma.brand_foundation`.

## Quality and verification
- Screenshot every variant in Light and Dark, not structure only (structure missed opacity-based disabled states, dashed borders, variant meanings).
- Real icons always, as instances of an Icon component with a swap property and color bound to icon tokens.
- Audit (ds-auditor / audit-design-system) after every build step; report numbers.
- Impeccable skills guide visual quality; Figma work goes through figma-use / figma-generate-library / figma-generate-design.

## Tooling and repo
- Figma access through figma-console-mcp (Desktop Bridge) or figma-cli (FigCli, Safe mode only, never Yolo or Browser). Find nodes by name; node IDs are only valid in their original file.
- Never install tools or packages on Abdul's behalf; show the steps or ask first.
- Paths in skills, briefs, memory and data are relative to the Root. A hook blocks absolute machine paths.
- Local git repo only; do not push or create a remote without asking.

## Storybook (2026-09-30)
- Target toolkit: Claude -> MCP -> Figma + Storybook + GitHub, so developers can browse, try and understand the DS.
- Storybook is documentation, not production code, for Web and mobile alike. Default: React + Storybook for all platforms; mobile components styled to look like their iOS/Android counterparts.
- Component, variant, property and token names in Storybook must match Figma exactly.
- Optional intake step; skill `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
- First reply (Abdul, 2026-09-30, ClinicSoft trial): the Storybook is mentioned in one line only; the first question is about the project. Storybook questions come at intake 0.7, when a project with pending Storybook work is picked, or on request. A "Later" answer always gets a trigger (`status.json > storybook_ask_at`).
- Sync tracking (Abdul, 2026-09-30): each project has `CHANGELOG.md` (dated Figma changes, `Storybook synced: yes/no`) and `status.json`. Every Figma change session appends an entry; the daily check reads only these files (the Figma plugin is not always running) and asks Abdul whether to open the plugin and update Storybook for projects with unsynced changes. Tool: `tools/project_status.py`. The SessionStart hook is the only daily check; no scheduled chat question (Abdul, 2026-09-30).
- Multi-tool handoff (Abdul, 2026-09-30): Codex, Cursor and Antigravity can work in this repo through `AGENTS.md` (with its own figma-console-mcp setup). They log every change in the project's `CHANGELOG.md` with a `Tool:` line and commit with a `[Tool]` prefix. Claude reads git log and changelogs at session start and audits their work before continuing.
- GitHub (2026-09-30): the workflow is pushed to the private repo abdulsalahuddin94-dev/design-systems-ai-ready (branch master). Each project in `My Projects/` is its own private repo and is git-ignored here, except `_Project_Template/` and `README.md`.
- Linked Figma files (Abdul, 2026-09-30): `status.json > figma` holds one DS file and a list of named Design files with file keys. Before Figma work: pick the Design file if several, ask to open it and the plugin, verify the file key and that the library is enabled and current; mismatch -> stop and warn. After DS changes: ask to publish, log it, list Design files needing Accept updates. Brownfield without a DS: Design file (frames or screenshots) is the source for building the DS, then relinked to it.
- Future iOS and Android projects: Storybook rendered as web (React + CSS) styled like the native components, as an interim choice (Abdul, 2026-09-30). Not built for the Trianglz iOS/Android references.
- Quality bar for new Storybooks: working components, sidebar navigation across Foundations and components, Figma description and use case per component, every Figma property as a control, all states in Light and Dark; component descriptions are written during the build in Figma and in Storybook. Not yet applied to the Trianglz Web Storybook (Abdul paused that).
