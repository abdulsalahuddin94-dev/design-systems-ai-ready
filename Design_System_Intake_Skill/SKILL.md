---
name: design-system-intake
description: Main entry skill for every use of "Design systems Ai Ready". Runs first, before any other skill or Figma call. Interviews the user one question at a time (in English) to collect the project basics, platform, and whether the work is Greenfield or Brownfield, then routes to the right path (new DS, screens without a DS, live product without Figma, imperfect DS with a Design file that follows it partly or not at all, Scenario C), loads the matching platform Main Skill (Web_Design_System_Skill, iOS_Design_System_Skill, Android_Design_System_Skill), enforces the approval checkpoints (Foundation, Components, Screens) and always ends by writing the project skills and running the final audit.
---

# Design System Intake (Main Skill - runs first, every time)

Root: the folder that contains this skill's parent folder (the repo root, where `CLAUDE.md` lives). All paths below are relative to the Root.
This skill decides **what** to build and **which path** to follow. The platform Main Skills decide **how** to build it.
Never touch Figma while this intake is running. Figma work starts only after the path is chosen and the platform Main Skill plus its required skills are loaded.

---

## 0. Interview rules

- Ask **one question per message**, in English, and wait for the answer. Never send a list of questions at once.
- **The first reply asks about the project, never about Storybook.** The SessionStart notice (Storybook exists, projects with unsynced changes) is passed on as one informational line at most. Storybook questions come at 0.7 for a new project, or right after 0.0 when the user picks an existing project that has unsynced changelog entries or a `later` Storybook plan whose trigger was reached.
- Use the exact questions below. Offer options on short lines, mark the recommended one, and accept free text.
- **Choice questions use arrow-key options (Abdul, 2026-10-01).** Every question with fixed options (the `A / B / C` questions below and in `steps/*.md`, 0.0t, the tool checkpoints, checkpoint approvals) is asked with Claude Code's **AskUserQuestion** tool, never as plain text:
  - one question per call; each option is a separate choice with a label of 1-5 words;
  - the recommended option goes first, with "(Recommended)" at the end of its label;
  - the explanation (for example a tool's biggest advantage) goes in the option's description, not the label;
  - at most 4 options per question; with more (for example 0.0 with many projects), show the 3 most likely and let "Other" take the rest, or split the question;
  - free text is still possible through "Other"; open questions (names, links, colors) stay plain text.
  - Fallback for tools without AskUserQuestion (Cursor, Codex, Antigravity, Gemini, or a remote chat): a numbered list, recommended option first, and the user replies with the number.
- Skip a question when the user already answered it (in this conversation, in the project folder's `Project_Brief.md`, or in memory). Say what you reused in one line.
- If the user says "you decide", pick the recommended option, say which, and continue.
- If the user only asks to **change a color** in an existing DS, skip the intake questions: run the Recolor procedure in the platform Main Skill (section 3b) with `tools/recolor.py`.
- After the last intake question, post a short **Intake Summary** (section 9) and get a "yes" before any Figma work.
- Record every answer in `[Project folder]\Project_Brief.md` as you go, so a later session never re-asks.
- `[Project folder]` is always `My Projects\<Project>` (plus the platform suffix, section 10). Projects never live in the Root; the Root holds only the workflow (Main Skills, rules, hooks, tools).
- **Changelog (every Figma change):** every session that builds or changes anything in the project's Figma file appends one dated entry to the project's `CHANGELOG.md` (what was added, changed or removed) with `Storybook synced: no`, then runs `python tools/project_status.py "My Projects/<Project>"` to refresh `status.json`. A Storybook update marks the entries synced with `--mark-synced`. The daily check (SessionStart hook) reads only these files, never Figma, and asks the user whether to open the Figma plugin and update Storybook for projects with unsynced entries.
- All paths are relative to the Root. Never write absolute machine paths (like `D:\...`) into skills or briefs.
- Refer to Figma nodes by **name** (pages, component sets, variables, styles). Node IDs are only valid in the file they came from.

---

## 0b. Step 0 - Tools preflight (runs before any question)

Figma work needs **one** of two tools, plus the Figma Desktop app open. Guide for new users (what each tool does, where to install, Safe mode, switching): `Figma_Tools/README.md`.
- **Figma Desktop Bridge** (figma-console-mcp, https://github.com/southleft/figma-console-mcp): MCP tools named `figma_*`, plus the Desktop Bridge plugin running in the file.
- **FigCli** (figma-cli, https://github.com/silships/figma-cli): a local CLI (`node src/index.js ...` inside its folder) with the FigCli plugin in **Safe mode** only.

Checks, in order (detect first, ask later):
1. **Installed?** Run `python tools/figma_tools_check.py` (read-only), and search this session for `figma_get_status`. Desktop Bridge counts as installed when the MCP server is configured; FigCli counts when its folder has `node_modules` and `--version` works. Say the result in one line.
2. **None installed** -> **stop**. Do not ask intake questions yet. Point to `Figma_Tools/README.md`, explain that at least one tool is needed and that both is best, and offer to help install in this session. Run a command such as `npm install` inside the tool folder only after the user says yes. The user adds the MCP server and creates the Figma token themselves (`steps/preflight-install.md`). Recommend FigCli **Safe mode**, never Yolo or Browser mode. Then ask: "Tell me when the tools are installed, and I will check again."
3. **One installed** -> no tool question. Say in one line which one was found and that you will use it; mention once that the other can be added later (`Figma_Tools/README.md`). Never offer a tool that is not installed.
4. **Both installed** -> the tool is chosen **per file**. Ask question 0.0t right after 0.0 (the project pick), and again for each file that has no tool saved yet, with AskUserQuestion (section 0): question "Which Figma tool should I use for '<file name>'?"; option 1 label "Figma Desktop Bridge (Recommended)", description "Full build and audit with the Figma skills, catches everything"; option 2 label "FigCli", description "Much faster, about 20-30x fewer tokens for checks, extract and measure". If that file's `tool` is saved in `status.json > figma` (`design_system.tool`, or the Design file entry's `tool`; older projects: `figma.tool` as the fallback) and that tool is still installed, skip the question and say in one line which tool you are reusing. Record the answer on that file entry (`desktop-bridge` or `figcli`) and in `figma.tool` as the default for files without one.
5. **Connected?** Check the chosen tool before any Figma work:
   - Desktop Bridge: call `figma_get_status` and confirm the bridge is connected (active WebSocket transport).
   - FigCli: `node src/index.js daemon status` in its folder, then `node src/index.js eval "figma.root.name"` to read the file name. In Safe mode `fileKey` reads as undefined, so the file check (section 7c step 3) goes by exact name, confirmed with the user, and nothing is written on a mismatch.
   - Not connected -> stop and show what to open: the plugin for that tool in Figma Desktop (Plugins > Development > Figma Desktop Bridge, or FigCli). Figma runs one plugin per file, so close the other tool's plugin first; FigCli talks to only one file, so close it in every other file.
   - Connected -> say which tool and which file in one line and continue. Remember the name (and key, when available) of the connected file: question 0.2 uses it.
   - **Stale servers:** if `figma_get_status` lists `otherInstances` (other figma-console-mcp servers on ports 9223-9228 from old sessions), tell the user in one line that the Desktop Bridge plugin talks to only one server at a time and can end up connected to an old session. Show the cleanup: close old Claude Code sessions, or end the stale `figma-console-mcp` node processes (Windows: Task Manager > Details > node.exe with `figma-console-mcp` in the command line; macOS/Linux: `pkill -f figma-console-mcp`), then re-run the plugin. Do not kill processes yourself.
   - **Figma token:** the REST-based tools (`figma_get_styles`, `figma_get_file_data`, `figma_check_design_parity`, library reads) need a valid `FIGMA_ACCESS_TOKEN`. If one fails with an auth or expired-token error, tell the user in one line to create a new token and update the MCP config (install steps 2-3); plugin-based tools (`figma_execute`, screenshots) keep working meanwhile.

**Tool checkpoints (both tools installed only).** Before a large, time- or token-heavy step (full DS build, full component audit, Brownfield extract, Scenario C variable map, multi-screen builds, a Storybook update from Figma), tell the user in 2-3 lines which tool fits that step better and why, then ask with AskUserQuestion (section 0): option "Continue with <current>" and option "Switch to <other>", the better fit first with "(Recommended)" and the reason in its description When only one tool is installed, skip this and keep going.
- FigCli is better for: full-file extract of tokens and structure, `snapshot` / `rules gen` / `check` regression gates (about 16 s and 300 tokens per file), `verify --measure` of screens (under 1 s and about 500 tokens per frame), and quick re-checks after a fix.
- Desktop Bridge is better for: building variables, components and screens under the figma-use / figma-generate-library / figma-generate-design rules, the `tools/*.figma.js` scripts, screenshots of every variant in Light and Dark, and the final audit-design-system (it scans every variant; FigCli `check` reads strokes, padding and size from one sample variant per set).
- Trial numbers (2026-10-01, ClinicSoft duplicate): FigCli check caught 4 of 5 planted defects (it missed a height change) in about 16 s and 300 tokens; the Desktop Bridge audit caught 5 of 5 in about 52 s and 6-10K tokens. The audit-design-system step at the end of every build stays mandatory whichever tool is chosen.
- Mixed setups are fine (for example FigCli on the DS file for quick checks while the Desktop Bridge builds screens in a Design file). The default tip: builds through the Desktop Bridge, quick regression checks and `verify --measure` through FigCli, the final audit-design-system on the Desktop Bridge.

**Switching any time (Abdul, 2026-10-01).** The user can change tools at any point, on any file, mid-project or days later: they just say so. Nothing in Figma or in the project files belongs to one tool, so a switch never needs rework. On every switch:
1. The user closes the old plugin in that file and opens the new one. Re-run check 5 and the file check (section 7c step 3) with the new tool.
2. Save the new tool on that file entry in `status.json` (and `figma.tool`), and log it in that day's `CHANGELOG.md` entry (`Tool switch: <file>: <old> -> <new>`).
3. Load `tools/figma_helpers.figma.js` again in the new tool before scripts that use `DS.*`.
4. **FigCli baseline:** FigCli `check` compares the file with a saved snapshot (`snapshot` + `rules gen`). After any change made through the Desktop Bridge, after a switch, and after each approved checkpoint, regenerate the baseline before trusting the next `check`. Otherwise intended changes show up as drift.
5. Same scripts in both tools: every `tools/*.figma.js` runs in the Desktop Bridge through `figma_execute` and in FigCli through `node src/index.js eval --file <script>` (tested with `check_bindings.figma.js`). Screenshots: `figma_capture_screenshot` or `node src/index.js verify "<node id>"`. Writes through FigCli `eval` may be blocked by Claude Code auto mode; the user allows the command or runs it.

**Install only with a yes.** You check and show the steps. Run an install command only after the user agrees, and never `npm install -g`. The user creates the Figma token themselves; never ask them to paste it into the chat. Never run `figma-cli init-agent` in the Root (it writes its own `AGENTS.md`).

Install steps: `Figma_Tools/README.md` (both tools) and `steps/preflight-install.md` (MCP client details).

Also recommended (not blocking): the official Figma MCP and the skills figma-use, figma-generate-library, figma-generate-design, audit-design-system, ui-ux-pro-max. If one is missing, say so in one line and continue.

---

## 0c. Loading, sessions and token budget (Abdul, 2026-10-01)

Trials ran one session per project (470-650 turns, context up to 690K tokens, re-read on every turn). These rules keep the same quality gates (audits, fidelity, approvals) at a fraction of the cost.

**Load only what the step needs.** This file is the router. The rest of the intake lives in `Design_System_Intake_Skill/steps/` and keeps its section numbers:

| Section | File | Load when |
|---|---|---|
| 0b install steps | `steps/preflight-install.md`, `Figma_Tools/README.md` | preflight finds no tool installed or none connected |
| 1.3-1.5 detail | `steps/both-native.md` | 1.2 = Both |
| 4 (3a-3d) | `steps/greenfield.md` | 2.1 = Greenfield |
| 5 | `steps/brownfield-1-screens.md` | 2.2 = 1 |
| 6 | `steps/brownfield-2-code.md` | 2.2 = 2 |
| 7 (Scenario C) | `steps/brownfield-3-scenario-c.md` | 2.2 = 3 |
| 7b | `steps/fix-on-create.md` | a project starts from an existing file; last foundation step of a new build |
| 7c | `steps/figma-files.md` | before the first Figma work of every session |
| 7d, 7e, 7f | `steps/screens.md` | screens are built or changed |
| 10 | `steps/folders.md` | question 0.3, or unsure where a file goes |
| 11, 12 | `steps/finish.md` | end of a build, Storybook step |

- The platform Main Skill loads after 1.1 / 1.2. The Figma skills (figma-use, figma-generate-library, figma-generate-design, ui-ux-pro-max) load at the first Figma build step of a session, never during the intake questions; load each once per session.
- Read the knowledge base before Figma: names, keys and values come from `data/tokens.json` and `data/component-registry.json`. Re-read Figma only for what the files do not hold, or when `CHANGELOG.md` shows a Figma change after the last export.

**One phase per session.** Phases: Intake (ends at the approved Intake Summary), Foundation, Components (one session per group if the set is large), Screens (one flow, or up to 3 screens, per session), Storybook. At the end of each phase:
1. Write the handoff: `Project_Brief.md` (Status, Checkpoints, one `Next step:` line with what the next session does first), the `CHANGELOG.md` entry, and `python tools/project_status.py "My Projects/<Project>"`.
2. Tell the user in one line: "Phase done. Please start a new session for <next phase>; it resumes from the project files."
3. A resumed session reads only `Project_Brief.md`, `status.json`, the newest `CHANGELOG.md` entries and the step files of its phase. It does not re-read finished phases, re-export variables or re-screenshot approved work, unless the changelog shows work by another tool (then the CLAUDE.md handoff audit runs first).

**Heavy visual work runs in subagents.** Variant screenshots (Light and Dark), side-by-side fidelity captures (section 7f.4) and audits run in the `ds-auditor` agent (screens mode for screens). It saves the images under the project's `audits/` and returns numbers and a list of differences; the main session fixes from that list. The main session opens an image only to show it to the user at a checkpoint. The rules themselves (every variant in each mode, a side-by-side per screen, up to 3 fix rounds, user-only approval) do not change.

**Short Figma scripts.** Paste `tools/figma_helpers.figma.js` into `figma_execute` once per file per session; it keeps `DS.*` helpers loaded (variable binding, Auto Layout frames, text with styles, icons, instances and properties, a raw-value report). Later scripts call them instead of redefining helpers; still one section per script (section 7f.3). If a script says `DS is not defined`, paste the file again.

---

## 1. Step 0 - Intake basics

First pick the project (always, before 0.1):

| # | Question (send exactly) | Notes |
|---|---|---|
| 0.0 | "Which project should I work on? <one line per folder in My Projects> / Start a new project" | List the folders in `My Projects\` (skip `_Project_Template` and `README.md`). If there are none, say so and go straight to 0.1. Existing project: read its `Project_Brief.md` and `status.json`, say in one line what is already answered, and ask only what is missing (or continue from its Status). If it has unsynced changelog entries, ask then whether to update its Storybook (open the DS file and the Desktop Bridge first). New project: continue with 0.1. |
| 0.0t | Only when both Figma tools are installed (0b check 4) and the file has no saved `tool` (fallback `figma.tool`). AskUserQuestion: "Which Figma tool should I use for '<file name>'?" Options: "Figma Desktop Bridge (Recommended)" (description: full build and audit with the Figma skills, catches everything) / "FigCli" (description: much faster, about 20-30x fewer tokens for checks, extract and measure) | Record the `tool` on that file entry in `status.json > figma` and in `figma.tool` (`desktop-bridge` / `figcli`; for a new project, once its folder exists in 0.1 and the files are registered in 0.2). The user can switch any time (0b, Switching any time). Then run 0b check 5 (connection) with that tool. One tool installed: skip, use it. |

Then ask in this order: **0.1, 0.2, then the platform (Step 1, questions 1.1-1.5), then 0.3-0.8.** The platform comes early because the folder name (section 10) and the default fonts depend on it.
Until the project folder exists (0.3), keep the answers in the conversation; right after 0.3, write them all into `Project_Brief.md` (copied from the template) and keep it updated from then on.

| # | Question (send exactly) | Notes |
|---|---|---|
| 0.1 | "What is the project name?" | Used for folder and Figma file names. Keep the user's spelling; replace spaces with `_` only in folder names. |
| 0.2 | If preflight saw a connected file: "Figma is connected to '<file name>'. Is this the Design System file for <Project>? Yes / No, it is a scratch file. Then share any other Figma links for this project: every Design file with screens (give each a name, e.g. Web App, Admin Dashboard), or 'none'." Otherwise: "Please share the Figma links for this project: the Design System file (one) and every Design file with screens (give each a name, e.g. Web App, Admin Dashboard). Reply 'none' if there are none yet." | Record them in `status.json > figma` (section 7c): one `design_system` and a `design_files` list with name, URL and file key (the part after `/design/` or `/file/`). A connected file the user confirms is registered as the `design_system` (its key from `figma_get_status`; ask for its link). Asked once; later sessions read `status.json`. |

**Now ask Step 1 (platform, section 2), then continue here:**

| # | Question (send exactly) | Notes |
|---|---|---|
| 0.3 | "What is the local folder for this project? (Default: My Projects\<Project folder>)" where `<Project folder>` already carries the platform suffix (section 10), e.g. `My Projects\ClinicSoft` (Web), `My Projects\ClinicSoft_iOS`. | Store the answer **relative to the Root** (e.g. `My Projects/ClinicSoft/`), even when the user replies with a full machine path; never write the absolute path (a hook blocks it). Create the folder by copying `My Projects\_Project_Template\` (never edit the template itself), replace `<Project>` in its files, then write every answer so far into `Project_Brief.md`. |
| 0.4 | "Which color modes do you need? Light only / Light and Dark (recommended) / Dark only" | Sets Semantic modes. One mode only (Light only, Dark only): follow "Single-mode systems" in the platform Main Skill. |
| 0.5 | "Do you need Arabic / RTL support? Yes / No" | If Yes: mirrored layouts, RTL auto layout checks, directional icons (arrows, chevrons, back) get mirrored variants, Arabic font pairing, and text styles tested with Arabic copy. |
| 0.6 | "Which fonts should the system use? Name the Latin font and, if RTL is needed, the Arabic font. Reply 'default' to use <platform default>." | Say the one default for the chosen platform in the question: Web = Poppins (org default) or the brand font; iOS = SF Pro; Android = Roboto / Roboto Flex. Arabic default pairing: IBM Plex Sans Arabic (Web/Android), SF Arabic (iOS). Confirm the fonts are installed / available in Figma (a read-only `figma_execute` of `figma.listAvailableFontsAsync()` is fine). |
| 0.7 | "Do you also want a live Storybook for developers (browse components, try variants and properties, read use cases, link back to Figma)? Yes, after components (recommended when developers will use the DS) / Later / No" | Optional. Yes -> run section 12 after the Components checkpoint. Default stack for every platform: React + Storybook. iOS and Android projects get a web Storybook (React + CSS) styled like the native components. Record the answer in `Project_Brief.md` and in `status.json > storybook_plan` (`yes`, `later`, `no`). **Later** always gets a trigger in `status.json > storybook_ask_at` (default `components-approved`; after a second "Later", `screens-approved`; after a third, `next-session`). Ask again when that point is reached; the SessionStart hook lists projects whose plan is `later`. |
| 0.8 | "Do you also want example screens built from the design system (e.g. login, list, detail)? Yes, after components (recommended) / No, design system only" | Yes -> the Screens phase and checkpoint 3 run. Screens are built in a separate Design file (`<Project>`) that uses the published DS library, so the user will be asked to publish the library at the Components checkpoint (section 8). Skip for Brownfield paths that already rebuild screens. |

---

## 2. Step 1 - Platform (asked right after 0.2)

| # | Question | Next |
|---|---|---|
| 1.1 | "Which platform is this design system for? Web / Mobile" | Web -> load `Web_Design_System_Skill`. Mobile -> 1.2 |
| 1.2 | "Which mobile platform? iOS / Android / Both" | iOS -> `iOS_Design_System_Skill`. Android -> `Android_Design_System_Skill`. Both -> 1.3 |
| 1.3 | "Native, or cross-platform with one shared design (Flutter/React Native custom UI)? Native (two systems, each app looks native) / Cross-platform (one shared design)" | Native -> 1.4. Cross-platform -> 1.5. See "Both: native or cross-platform" below. |
| 1.4 | Native only: "Do you want a shared Brand Foundation file (brand Primitives only: color ramps, font families, raw values) that both systems copy from? Yes (recommended when one brand drives both apps) / No" | Yes -> create `<Project> Brand Foundation` (Primitives only). Then load **both** `iOS_Design_System_Skill` and `Android_Design_System_Skill`, two independent systems. |
| 1.5 | Cross-platform only: "Which framework, and which base should the shared design follow? Flutter / React Native, then Material 3 (recommended for one codebase) / Apple HIG / Custom brand UI on a Material 3 structure" | Load the matching Main Skill as the base (Material 3 or custom -> `Android_Design_System_Skill`; Apple HIG -> `iOS_Design_System_Skill`). One DS, one Design file, folder `<Project>_Mobile\`. |

Both: native vs cross-platform rules (DS files, Brand Foundation, Design files, folders, `status.json` fields): `steps/both-native.md`.

Platform rules (never mix):
- **Web** = Tailwind conventions, web breakpoints (Desktop 1440 / iPad 768 / Mobile 375), Hover / Focus / Active states, Lucide icons.
- **iOS** = Apple HIG, Dynamic Type, iOS semantic names (System Background, Label...), SF Symbols style icons, pt units.
- **Android** = Material Design 3, `md.sys.color` tokens, state layers, elevation levels, Material Symbols, dp units.
- Each platform is **independent**: its own Figma DS file, its own variables, its own skills folder. Nothing is shared or merged between Web, iOS and Android. "Both" + Native means two full systems (the optional Brand Foundation only supplies Primitive values to copy); "Both" + Cross-platform means one shared system.
- After choosing, load the platform Main Skill. Its required skills (figma-use + figma-generate-library; figma-swiftui for iOS; figma-code-connect when mapping to code) load at the first Figma build step of the session (section 0c), not during the intake questions. Until the iOS / Android Main Skills are finished, tell the user and use what exists in them.

---

## 3. Step 2 - Greenfield or Brownfield

| # | Question | Next |
|---|---|---|
| 2.1 | "Is this a new product with nothing designed yet (Greenfield), or does something already exist (Brownfield)? Greenfield / Brownfield" | Greenfield -> section 4. Brownfield -> 2.2 |
| 2.2 | "What already exists? 1) Screens in Figma or screenshots, but no design system / 2) A live product in code, with no Figma at all / 3) A design system exists (possibly imperfect), and the screens follow it only partly or not at all" | 1 -> section 5. 2 -> section 6. 3 -> section 7 |

### Decision tree

```
Tools preflight (0b) -> which tools are installed? None -> stop, Figma_Tools/README.md; both -> tool question 0.0t after 0.0; then connected? No -> stop
Intake basics 0.0-0.2 -> Platform (1.1-1.5) -> load platform Main Skill(s) -> basics 0.3-0.8
   └─ Greenfield or Brownfield? (2.1)
      ├─ Greenfield
      │  ├─ Existing AI-ready DS (Figma DS + .md skills)? (3.1)
      │  │  ├─ Yes -> read files -> quick audit -> fix gaps -> work from it
      │  │  ├─ Start from a Trianglz template (3.2) -> user duplicates Web/iOS/Android template -> rebrand -> fix known gaps
      │  │  └─ No
      │  │     ├─ Brand folder has files? -> derive Primitives/Semantics
      │  │     │  └─ empty -> ask brand color (3.3)
      │  │     ├─ Inspiration folder has files? -> set design direction
      │  │     │  └─ empty -> ask industry (3.4) -> derive style
      │  │     └─ Build per platform Main Skill build order
      └─ Brownfield (2.2)
         ├─ Type 1: screens, no DS  -> register the Design file as the source -> open it -> extract (frames or screenshots) -> merge approval -> "<Project> Design System" file -> build -> publish -> link the Design file to the library -> rebuild screens
         ├─ Type 2: live code, no Figma -> repo/path -> extract tokens from code -> "<Project>" + "<Project> Design System" files -> build -> rebuild screens per module
         └─ Type 3: imperfect DS + Design file -> Scenario C: Variable Map -> fix DS + publish -> audit screens -> approve report -> fix screens -> log + Accept updates
Every path from an existing file: Fix on create (section 7b)
Every path: linked Figma files, publish and file check (section 7c)
Every path: checkpoints Foundation -> Components -> Screens (section 8)
Every path ends: write project skills + final audit (section 11)
Optional (0.8 = Yes): screens in a Design file after the Components checkpoint (publish first, section 8)
Optional (0.7 = Yes): Storybook after the Components checkpoint (section 12)
```

---

## 4-7f. Path steps and shared rules

Sections 4 (Greenfield), 5-7 (Brownfield types 1-3), 7b (Fix on create), 7c (linked Figma files), 7d-7f (screens) live in `steps/` (map in section 0c). Load the file of the chosen path, plus the shared files it names.

---

## 8. Step 7 - Approval checkpoints (every path)

Stop and ask for approval at each checkpoint. Show screenshots of each mode the project has (Light and Dark, or the single mode) and a short summary, never just a statement.

| Checkpoint | Show | Question |
|---|---|---|
| **1. Foundation** | Colors (Primitives + Semantics, per mode), typography scale, spacing, radius, shadows, icons, contrast results, Fix on create before/after, **user to-do list** (e.g. rename the Figma file to '<Project> Design System', which a plugin cannot do) | "Foundation is ready. Approve and move to components / Request changes" |
| **2. Components** | Every component set per group, all variants and states, per-mode previews; anything left out and why (e.g. Avatar Photo when no photo was supplied) | "Components are ready. Approve and move to screens / Request changes". If screens will follow (0.8 = Yes) or Storybook is due, add in the same message: "Before screens, please publish '<Project> Design System' as a library (Assets > Library > Publish) and tell me when done. Screens go in a separate Design file that must enable this library." Save `design_system.last_publish` in `status.json` when confirmed. |
| **3. Screens** | Every rebuilt or new screen next to its source (screen spec and side-by-side captures, section 7f), per mode, and the Design file audit result with the fidelity checks (section 7d) | "Screens are ready. Approve / Request changes" |

- Do not start the next phase before the user approves the current one.
- Only the user's reply approves a checkpoint. An agent (any tool) writes `Ready for review` in `Project_Brief.md > Checkpoints` and never `Approved`, `Passed` or `Completed` on its own.
- Save a Figma version in history after each approved checkpoint.
- Paths with no screens (0.8 = No) use checkpoints 1 and 2 only; if the user asks for screens later, ask 0.8's publish step first.
- **Avatar Photo** and any other image content: there is no approved image asset in the Root. At the Components step ask once: "Avatar Photo needs a sample photo you are allowed to use. Share one, or I build Initials and Icon only for now." Never pull random photos from the web.

---

## 9. Intake Summary (post before any Figma work)

One approval covers the whole plan, including the design direction (3.4 is not approved separately). Lead the message with the question, then the block, then at most one line of notes:

"Before I touch Figma, please confirm this plan: **Yes, start / Change something**"

```
Project: <name>            Local folder: <path>
Figma: <links and roles>
Platform: <Web / iOS / Android / Both native (+ Brand Foundation yes/no) / Both cross-platform (Flutter / RN, base)> -> Main Skill(s): <names>
Modes: <Light / Dark>      RTL: <Yes/No>      Fonts: <Latin / Arabic>
Path: <Greenfield 3a/3b-3d | Brownfield type 1/2/3>
Inputs found: Brand <n files / empty>, Inspiration <n / empty>, Screens <n / link>
Direction: <style, corner/density/elevation, brand contrast result and fix>
Screens: <Yes after components (Design file, needs published library) / No>
Storybook: <Yes after components / Later (ask at: <trigger>) / No>
Next step: <first action>
```

---

## 10-12. Folder conventions, finish, Storybook

Section 10 (folder conventions): `steps/folders.md`. Sections 11 (always finish with skills and the final audit) and 12 (optional live Storybook): `steps/finish.md`.
