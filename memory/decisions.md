---
name: decisions
description: Abdul's standing rules for every design system job in this folder (entry flow, build order, atomic tiers, group placement, skill scoping, platforms, tooling)
type: feedback
updated: 2026-09-30
---

# Standing decisions (Abdul)

## Entry flow
- Every job starts with `Design_System_Intake_Skill/SKILL.md`: tools preflight, then one question per message in English, then the platform Main Skill.
- Choice questions everywhere (Abdul, 2026-10-01): every question the user answers by picking, in every skill, step, checkpoint, approval, confirmation and Scenario C decision, uses the AskUserQuestion arrow-key menu (`Ask (choice)` / `Ask (multi)` in the skills): recommended first, explanation in the description, typed answers through Other, `multiSelect` when several answers are valid. Names, links, paths and colors with no default stay typed. Other tools: numbered list. Rules: Intake section 0. No Figma work before the Intake Summary gets a "yes".
- Back on every menu (Abdul, 2026-10-05): every `Ask (choice)` / `Ask (multi)` menu in the whole workflow (intake, steps, quick mode, Main Skills, Storybook, checkpoints, confirmations) gets a last option "Back" that returns to the previous question or step (re-asked with the earlier answer marked current, its recorded answer undone); never on the first question of a flow. Back counts toward the 4-option limit. Jumping to an earlier step is typed in Other. Back never undoes Figma work by itself: it asks "Keep it and go back" / "Undo it, then go back" first. Other tools: "Back" is the last number. Rule: Intake section 0.
- Record answers in `My Projects/<Project>/Project_Brief.md` so later sessions never re-ask.
- Simpler intake (Abdul, 2026-10-05): (1) after the folder, the Inputs files are read and prefill modes, RTL, fonts and brand color, confirmed in one "Use these" question (0.3b option "Don't have inputs" when there are none); (4) the path (2.1) is asked right after the folder and Inputs, before 0.4-0.8; Brownfield and Code to Design take modes, RTL and fonts from the file or code and confirm them at their first read step instead of asking (0.3c); (5) every question shows a progress line in its header (`Intake 3/8`, `Checkpoint 1`, `Screens 2/5`); (6) each checkpoint ends with one numbered to-do list of the user's Figma actions (rename, publish, enable, Accept updates) and one "Is the to-do list done?" question; (7) an existing project opens with a resume line (last changelog entry + Next step) and "Continue" / "Something else". Rules: Intake sections 0, 1 (0.0, 0.3c) and 8.
- One workflow copy in the Root; every project lives in `My Projects/`, created from `My Projects/_Project_Template/`. Intake starts by asking which project or a new one (Abdul, 2026-09-30). Each project may later become its own private repo. ClinicSoft moved there after the trial run (2026-09-30).
- Quick mode (Abdul, 2026-10-01): one specific task on a live file (one component from a live site or captured frames, an audit, one fix) skips the intake questions, the `My Projects/` folder, checkpoints and project skills (`/ds-quick`, `Design_System_Intake_Skill/steps/quick-mode.md`). Preflight, the file check, these rules, atomic tiers, the audit and no self-approval still apply; captured frames are a reference, never the component.
- Approval checkpoints in order: Foundation, Components, Screens. Show Light and Dark screenshots at each.

## Lessons log (Abdul, 2026-10-05)
- Every mistake fixed in a session (reported by Abdul or found by a check) is logged in `memory/lessons.md` in the same session: what broke, the cause, the rule now in the workflow, and the check that catches it. The fix also goes into the matching skill or tool, so it never depends on memory alone.

## Token budget (Abdul, 2026-10-01)
- Trials cost 180-260M tokens per project session (one session of 470-650 turns, context up to 690K). Fixes, same quality gates: the intake is a router plus `Design_System_Intake_Skill/steps/` files loaded per step; Figma skills load at the first build step, not during the intake; one phase per session with a handoff in `Project_Brief.md` / `CHANGELOG.md` / `status.json`; variant screenshots, side-by-side fidelity captures and audits run in ds-auditor, which returns text and numbers; `tools/figma_helpers.figma.js` is pasted once per file per session so scripts stop redefining helpers; names and keys come from `data/*.json` before Figma reads. Details: Intake section 0c.
- The design plugin (Asana, Jira, Linear, Notion, Slack, Intercom) is disabled for this folder in `.claude/settings.json`; stitch, pencil and the official figma MCP server are disabled by Abdul in `/mcp`.

## Figma tool choice (Abdul, 2026-10-01)
- FigCli Yolo is the Recommended tool, and FigCli runs in Yolo mode only (Abdul, 2026-10-04: the FigCli Safe-mode plugin was not stable). Yolo patches the Figma app (`app.asar`, admin) so Figma opens local debugging port 9222; no plugin, Figma can be minimized. The user runs the patch (`node src/index.js connect`) and `unpatch`; Claude never does, and states the risks once per machine (patched app, port 9222 without a password reachable by any local program). After a Figma update: `connect`, then `daemon restart`. The Desktop Bridge is the alternative (also where patching is not allowed); never Safe or Browser mode.
- Yolo file switching: whenever several files are open, every FigCli command sets `FIGMA_FILE` to the exact file name (or a part only that file has, e.g. `"Design System -"` vs `"Design System (Copy)"`); without it commands go to the last connected file, not the one on screen. Check `figma.root.name` before the first write to a file; mismatch -> write nothing.
- Preflight detects installed tools before asking (`tools/figma_tools_check.py`, which also reports whether port 9222 is open). None -> `Figma_Tools/README.md`, help install in the same session after a yes. One -> use it, no question. Both -> intake 0.0t: "FigCli Yolo (Recommended) / Figma Desktop Bridge", saved per file in `status.json > figma` (`design_system.tool`, each Design file's `tool`; `figma.tool` = default/fallback).
- Switching any time, on any file, and mixed setups (FigCli on one file, Desktop Bridge on another) are allowed (Abdul, 2026-10-01). On a switch: re-check the connection and file, save + log it in `CHANGELOG.md`, reload helpers, regenerate the FigCli baseline (also after Desktop Bridge changes and each approved checkpoint). FigCli verifies files by exact name through `FIGMA_FILE`; no writes on a mismatch.
- Yolo is the main tool for all work (Abdul, 2026-10-05): reads, bulk writes, builds, swaps, screenshots (`verify --save`) and audit scripts. The Desktop Bridge is used only for what Yolo cannot do: creating slots (`figma_add_slot_property`, `figma.createSlot` is missing in FigCli), and as the fallback where patching is not allowed. When both are installed, do not ask the user to open the Desktop Bridge plugin for anything Yolo can do. A user who has only the Desktop Bridge installed does all the work with it: never push them to install or patch for FigCli Yolo (Abdul, 2026-10-05); mention Yolo once in the preflight as optional, at most.
- Yolo daemon health: run `daemon status` before a batch. "token mismatch" makes every command fall back to a slow direct connection (60 s timeouts on library imports). Fix: `daemon restart` with the same `FIGMA_FILE` set; a restart without it pins the daemon to no file and the next pinned command restarts it again and breaks the token.
- Before costly steps (full build, full audit, Brownfield extract, multi-screen builds), and only when both are installed, say in 2-3 lines which tool fits and let the user pick (FigCli Yolo by default; the Desktop Bridge only for slots). Tools live outside the Root (`<drive>:\Tools`) and are never copied into the repo. Trial numbers: FigCli check 4/5 defects, about 16 s and 300 tokens; Desktop Bridge audit 5/5, about 52 s and 6-10K tokens. The final audit-design-system stays mandatory.

## Build order (always)
1. Primitives (raw values). 2. Semantic variables aliasing Primitives (Light/Dark). 3. Spacing, Radius, Typography variables. 4. Text and effect styles built from those variables. 5. Icons + the ➜ App Icon page. 6. Components built only on those variables and styles: Atoms, Molecules, Organisms, Patterns. 7. Linked docs pages. 8. Audit. 9. Project skills.

## Atomic design (strict)
- Never build a complex component or screen if its sub-components do not exist yet; build the missing lower tier first as separate main components.
- Before building: state the tier, check dependencies, post the atomic structure map, expose nested booleans, text and instance swaps up the hierarchy.

## App Icon page (Abdul, 2026-10-05)
- Every DS file gets a standard `➜ App Icon` page in ⭐Setup after ➜ Icons, always created with the foundations (Web replaces the reference's `➜ Favicon` in ⭐Data Display). It starts as labeled drop zones plus the platform guidelines; when the user drops an icon, Claude checks it and presents it the platform's standard way: iOS 1024 master with Default/Dark/Tinted, masked previews and the size ladder; Android adaptive layers (108 dp, 66 dp safe zone, Foreground/Background/Monochrome), masks, themed preview and Play Store 512; Web favicon, icon.svg, apple-touch 180, PWA 192/512 and maskable. Previews are instances of an `App Icon` component, every size frame exports its file, docs list where each file goes in code. Storybook gets `Foundations/App Icon` only when the user chose Storybook. Rules: Intake section 7h (`steps/app-icon.md`), platform Main Skill section 5b, `tools/app_icon_specs.json`.

## One docs source per component (Abdul, 2026-10-05, idea from Astryx `*.doc.mjs`)
- Each component's docs live once, in its registry `docs` block (overview, when to use / not use with the alternative, anatomy, do/don't, accessibility rows per part with WCAG criterion, ratio and states, keywords), written while the component is built. The Figma description (`tools/component_docs.py figma` + `tools/apply_descriptions.figma.js`), the `components.md` usage lines (`... skills`) and the Storybook Docs page are generated from it; nobody edits them by hand. `... check` must be 0 missing at the Components checkpoint. Rules: Storybook_Design_System_Skill section 4b.

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

## Scenario C: DS inside the Design file (Abdul, 2026-10-02)
- Intake 2.3 asks where the DS lives. Inside the Design file -> section 7g (`steps/single-file-ds.md`): version first, DS pages picked, Variable Map with "Used in" split between DS and screen pages, then the path is asked per project (2.4). "Split into a library" (recommended): this file stays the DS, is published, and the screens move to a new Design file (trial screen + audit first, `tools/split_library.figma.js` only for what pastes as local, Abdul deletes the old screen pages). "Keep one file": `figma.layout = single-file`, history versions replace Publish/Accept updates, ds-auditor treats `ds_pages` as the library. Alpha, raw-value and fidelity rules unchanged.

## Scenario D: Code to Design (Abdul, 2026-10-05)
- Intake 2.1 offers "Code to Design": a coded app (GitHub repo or local path, e.g. React + Tailwind) is the source and its screens and popups are built in Figma. 2.5 picks the branch; it replaces Brownfield type 2. Rules: Design_System_Intake_Skill section 6 (`steps/code-to-design.md`).
- Read the code first: tokens (Tailwind config, CSS variables, theme files), routes = screens, Dialog / Sheet / Popover / Drawer = popups, every state, exact texts, icons -> `Inputs/Code_Inventory.md` + `Inputs/Extracted_Tokens.md`. The code is the source; a live preview is a visual reference only.
- Branch a, existing DS: the Design file is linked to an existing (often shared) DS. The user names the editable DS page (2.6, `status.json > figma.design_system.editable_pages`); every other DS page is read only and nothing existing in the DS is changed (no Fix on create, no Scenario C step 2; issues go to `audits/<date>-ds-issues.md`). Reuse DS components and variables first; token map code -> DS with the Scenario C step 4 and alpha rules; gap table + screen specs approved; only missing components added on the editable page; new tokens only after approval; ask before each publish. Screens in the Design file from library instances. Respect the user's manual edits (never overwrite an edited node; ask when a change would touch one). Audit after each step, including a count of changes outside the editable page (must be 0).
- Branch b, new DS: tokens extracted from the code -> merge summary -> Primitives + Semantics (the code's Light/Dark) -> build order -> components the code uses -> publish -> screens per module; code -> Figma names recorded for Code Connect.

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
Follow the reference page layout (default Web entry in `references.json`): Cover, ⭐Setup, then ⭐ groups with ➜ topic pages. Foundation docs pages are always linked: ➜ Colors swatches bound to variables (Light/Dark frames use the matching mode), ➜ Typography samples use text styles bound to Typography variables.

## Reference library (Abdul, 2026-10-01)
- The studied design systems are a library, not one brand: `references.json` holds one entry per company and platform (Web, iOS, Android, cross-platform) with a per-platform default. Intake menus, README, skills and examples say "reference design system" and read names from the entry; no company name is hardcoded. Greenfield 3.1 offers "Start from a reference template" and lists the matching entries. Adding a company: `References.md`.

## Platforms
Web (Tailwind conventions), iOS (Apple HIG, Dynamic Type, SF Symbols), Android (Material 3, md.sys tokens). Each platform is fully independent: separate folders, skills, data and Storybook; nothing shared or merged.
- Mobile "Both" (Abdul, 2026-09-30): ask "Native, or cross-platform with one shared design (Flutter/React Native custom UI)?" (intake 1.3). Native -> optional shared `<Project> Brand Foundation` file (Primitives only; each DS copies them locally, never consumes it as a library) + separate iOS DS (HIG names, Dynamic Type, SF Symbols) + separate Android DS (md.sys.color, M3 type, state layers, elevation, Material Symbols) + separate iOS and Android Design files, each linked only to its own DS. Cross-platform -> one DS + one Design file (`<Project>_Mobile/`). Recorded in `status.json > mobile_setup, sibling_project, figma.brand_foundation`.
- Mobile Adaptive (Native, one file) (Abdul, 2026-10-05, after the Native_One_File_Pilot): third option at intake 1.3, not the default. iOS + Android (+ EN/AR) in ONE DS file: collections Primitives / Color (Light, Dark) / Language (EN, AR + Direction) / OS (iOS, Android + Platform booleans) / Component Specific (one mode, aliases OS only; allowed only in this setup). Token first, variant only when the anatomy changes; mode demos only on ⭐Setup > ➜ Platform Preview. Rules: `Design_System_Intake_Skill/steps/mobile-adaptive.md`.

## Quality and verification
- Screenshot every variant in Light and Dark, not structure only (structure missed opacity-based disabled states, dashed borders, variant meanings).
- Real icons always, as instances of an Icon component with a swap property and color bound to icon tokens.
- Audit (ds-auditor / audit-design-system) after every build step; report numbers.
- Impeccable skills guide visual quality; Figma work goes through figma-use / figma-generate-library / figma-generate-design.

## Tooling and repo
- Figma access through figma-cli (FigCli, Yolo mode only, Recommended; never Safe or Browser mode) or figma-console-mcp (Desktop Bridge). Find nodes by name; node IDs are only valid in their original file.
- Never install tools or packages on Abdul's behalf; show the steps or ask first.
- Paths in skills, briefs, memory and data are relative to the Root. A hook blocks absolute machine paths.
- Local git repo only; do not push or create a remote without asking.

## Storybook (2026-09-30)
- Target toolkit: Claude -> MCP -> Figma + Storybook + GitHub, so developers can browse, try and understand the DS.
- Storybook is documentation, not production code, for Web and mobile alike. Default: React + Storybook for all platforms; mobile components styled to look like their iOS/Android counterparts.
- Component, variant, property and token names in Storybook must match Figma exactly.
- Platform names (Abdul, 2026-10-05): an iOS or Android Storybook shows SwiftUI or Jetpack Compose names (and M3 md.sys tokens on Android) for every token, text style and component property, never CSS variables, plus a downloadable DesignTokens.swift / .kt on Foundations › Code (`tools/platform_names.py`). Mobile Adaptive projects get one Storybook with a Platform switch (the Figma OS mode) plus Color and Language switches; every token, text style and component page follows it, code names come from the Figma Code syntax, and Code offers both files (Abdul, 2026-10-05; Storybook skill section 6b).
- Docs pages (Abdul, 2026-10-05): every Storybook opens on a Welcome page (DS summary, product overview, stats, start here, live samples), shows Foundations visually (colors per mode, typography at real size with name and px, sizing, effects, icons) and gives each component a Docs page (use cases, when to use / not, anatomy, variants, sizes, states, do/don't, content, accessibility, properties, playground). Generator: `tools/storybook_docs.py`; rules: `Storybook_Design_System_Skill/SKILL.md` principle 9 and section 4b.
- Optional intake step; skill `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
- First reply (Abdul, 2026-09-30, ClinicSoft trial): the Storybook is mentioned in one line only; the first question is about the project. Storybook questions come at intake 0.7, when a project with pending Storybook work is picked, or on request. A "Later" answer always gets a trigger (`status.json > storybook_ask_at`).
- Sync tracking (Abdul, 2026-09-30): each project has `CHANGELOG.md` (dated Figma changes, `Storybook synced: yes/no`) and `status.json`. Every Figma change session appends an entry; the daily check reads only these files (the Figma plugin is not always running) and asks Abdul whether to open the plugin and update Storybook for projects with unsynced changes. Tool: `tools/project_status.py`. The SessionStart hook is the only daily check; no scheduled chat question (Abdul, 2026-09-30).
- Multi-tool handoff (Abdul, 2026-09-30): Codex, Cursor and Antigravity can work in this repo through `AGENTS.md` (with its own figma-console-mcp setup). They log every change in the project's `CHANGELOG.md` with a `Tool:` line and commit with a `[Tool]` prefix. Claude reads git log and changelogs at session start and audits their work before continuing.
- GitHub (2026-09-30, updated 2026-10-05): the workflow repo abdulsalahuddin94-dev/design-systems-ai-ready (branch master) is Public on purpose, for team use (Abdul, 2026-10-05). Each project in `My Projects/` is its own repo and is git-ignored here, except `_Project_Template/` and `README.md`.
- Publishing a project's docs (Abdul, 2026-10-05): when the user wants developers to get a link, the project repo is public on GitHub and its Storybook deploys to GitHub Pages from `.github/workflows/storybook-pages.yml` (template: `Storybook_Design_System_Skill/templates/storybook-pages.yml`). Asked per project; never published without the user's yes. First one: ClinicSoft.
- Linked Figma files (Abdul, 2026-09-30): `status.json > figma` holds one DS file and a list of named Design files with file keys. Before Figma work: pick the Design file if several, ask to open it and the plugin, verify the file key and that the library is enabled and current; mismatch -> stop and warn. After DS changes: ask to publish, log it, list Design files needing Accept updates. Brownfield without a DS: Design file (frames or screenshots) is the source for building the DS, then relinked to it.
- Storybook MCPs are per machine (Abdul, 2026-10-01): register each project's Storybook MCP with `claude mcp add ... --scope local`; the root `.mcp.json` is git-ignored (template `.mcp.example.json`) so a fresh clone is never prompted to enable servers.
- Future iOS and Android projects: Storybook rendered as web (React + CSS) styled like the native components, as an interim choice (Abdul, 2026-09-30). Not built for the iOS/Android reference entries.
- Quality bar for new Storybooks: working components, sidebar navigation across Foundations and components, Figma description and use case per component, every Figma property as a control, all states in Light and Dark; component descriptions are written during the build in Figma and in Storybook. Not yet applied to the Trianglz Web Storybook (Abdul paused that).
