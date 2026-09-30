---
name: decisions
description: Abdul's standing rules for every design system job in this folder (entry flow, build order, atomic tiers, group placement, skill scoping, platforms, tooling)
type: feedback
updated: 2026-09-30
---

# Standing decisions (Abdul)

## Entry flow
- Every job starts with `Design_System_Intake_Skill/SKILL.md`: tools preflight, then one question per message in English, then the platform Main Skill. No Figma work before the Intake Summary gets a "yes".
- Record answers in `My Projects/<Project>/Project_Brief.md` so later sessions never re-ask.
- One workflow copy in the Root; every project lives in `My Projects/`, created from `My Projects/_Project_Template/`. Intake starts by asking which project or a new one (Abdul, 2026-09-30). Each project may later become its own private repo. ClinicSoft moves there after the trial run.
- Approval checkpoints in order: Foundation, Components, Screens. Show Light and Dark screenshots at each.

## Build order (always)
1. Primitives (raw values). 2. Semantic variables aliasing Primitives (Light/Dark). 3. Spacing, Radius, Typography variables. 4. Text and effect styles built from those variables. 5. Icons. 6. Components built only on those variables and styles: Atoms, Molecules, Organisms, Patterns. 7. Linked docs pages. 8. Audit. 9. Project skills.

## Atomic design (strict)
- Never build a complex component or screen if its sub-components do not exist yet; build the missing lower tier first as separate main components.
- Before building: state the tier, check dependencies, post the atomic structure map, expose nested booleans, text and instance swaps up the hierarchy.

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

## Quality and verification
- Screenshot every variant in Light and Dark, not structure only (structure missed opacity-based disabled states, dashed borders, variant meanings).
- Real icons always, as instances of an Icon component with a swap property and color bound to icon tokens.
- Audit (ds-auditor / audit-design-system) after every build step; report numbers.
- Impeccable skills guide visual quality; Figma work goes through figma-use / figma-generate-library / figma-generate-design.

## Tooling and repo
- Figma access through figma-console-mcp (Desktop Bridge) or figma-cli. Find nodes by name; node IDs are only valid in their original file.
- Never install tools or packages on Abdul's behalf; show the steps or ask first.
- Paths in skills, briefs, memory and data are relative to the Root. A hook blocks absolute machine paths.
- Local git repo only; do not push or create a remote without asking.

## Storybook (2026-09-30)
- Target toolkit: Claude -> MCP -> Figma + Storybook + GitHub, so developers can browse, try and understand the DS.
- Storybook is documentation, not production code, for Web and mobile alike. Default: React + Storybook for all platforms; mobile components styled to look like their iOS/Android counterparts.
- Component, variant, property and token names in Storybook must match Figma exactly.
- Optional intake step; skill `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
- Sync tracking (Abdul, 2026-09-30): each project has `CHANGELOG.md` (dated Figma changes, `Storybook synced: yes/no`) and `status.json`. Every Figma change session appends an entry; the daily check reads only these files (the Figma plugin is not always running) and asks Abdul whether to open the plugin and update Storybook for projects with unsynced changes. Tool: `tools/project_status.py`. The SessionStart hook is the only daily check; no scheduled chat question (Abdul, 2026-09-30).
- Multi-tool handoff (Abdul, 2026-09-30): Codex, Cursor and Antigravity can work in this repo through `AGENTS.md` (with its own figma-console-mcp setup). They log every change in the project's `CHANGELOG.md` with a `Tool:` line and commit with a `[Tool]` prefix. Claude reads git log and changelogs at session start and audits their work before continuing.
- GitHub backup of the workflow repo: only after the ClinicSoft trial run is confirmed correct, and only when Abdul says so.
- Linked Figma files (Abdul, 2026-09-30): `status.json > figma` holds one DS file and a list of named Design files with file keys. Before Figma work: pick the Design file if several, ask to open it and the plugin, verify the file key and that the library is enabled and current; mismatch -> stop and warn. After DS changes: ask to publish, log it, list Design files needing Accept updates. Brownfield without a DS: Design file (frames or screenshots) is the source for building the DS, then relinked to it.
- Future iOS and Android projects: Storybook rendered as web (React + CSS) styled like the native components, as an interim choice (Abdul, 2026-09-30). Not built for the Trianglz iOS/Android references.
- Quality bar for new Storybooks: working components, sidebar navigation across Foundations and components, Figma description and use case per component, every Figma property as a control, all states in Light and Dark; component descriptions are written during the build in Figma and in Storybook. Not yet applied to the Trianglz Web Storybook (Abdul paused that).
