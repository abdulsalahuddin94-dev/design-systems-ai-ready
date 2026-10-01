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

Check the Figma tooling first. Figma work needs **one** of these, plus the Figma Desktop app open:
- **figma-console-mcp** (https://github.com/southleft/figma-console-mcp) - MCP tools named `figma_*` (e.g. `figma_get_status`).
- **figma-cli** (https://github.com/silships/figma-cli) - a local CLI that drives Figma Desktop.

Checks, in order:
1. Look for figma-console-mcp tools in this session (search for `figma_get_status`). If present, call `figma_get_status` and confirm the **Desktop Bridge** shows as connected (active WebSocket transport).
2. If not present, look for figma-cli: a `figma-cli` folder in the user's home directory or a `figma-cli` command on the PATH, and confirm it reports a connection to Figma Desktop.
3. If one of them is installed and connected -> say which one in one line and continue to Step 0 basics. Remember the name and key of the connected file: question 0.2 uses it.
   - **Stale servers:** if `figma_get_status` lists `otherInstances` (other figma-console-mcp servers on ports 9223-9228 from old sessions), tell the user in one line that the Desktop Bridge plugin talks to only one server at a time and can end up connected to an old session. Show the cleanup: close old Claude Code sessions, or end the stale `figma-console-mcp` node processes (Windows: Task Manager > Details > node.exe with `figma-console-mcp` in the command line; macOS/Linux: `pkill -f figma-console-mcp`), then re-run the plugin. Do not kill processes yourself.
   - **Figma token:** the REST-based tools (`figma_get_styles`, `figma_get_file_data`, `figma_check_design_parity`, library reads) need a valid `FIGMA_ACCESS_TOKEN`. If one fails with an auth or expired-token error, tell the user in one line to create a new token and update the MCP config (install step 2-3); plugin-based tools (`figma_execute`, screenshots) keep working meanwhile.
4. If neither is installed, or the Desktop Bridge is not connected -> **stop**. Do not ask intake questions yet. Show the matching install steps below and ask: "Tell me when the tools are installed and connected, and I will check again."

**Never install anything yourself.** The user installs and connects the tools; you only check and show the steps. The user creates the Figma token themselves; never ask them to paste it into the chat.

**figma-console-mcp install steps** (from its README):
1. Prerequisites: Node.js 18+ (`node --version`), Figma Desktop (not the web app), an MCP client such as Claude Code.
2. Create a Figma personal access token (Figma > Settings > Security > Personal access tokens), description `Figma Console MCP`, scopes: File content (Read), File versions (Read), Variables (Read), Comments (Read and write). It starts with `figd_`.
3. Add the server to Claude Code (the user runs this in their own terminal, with their own token):
   `claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest`
   (Claude Desktop / Cursor: add the same `npx -y figma-console-mcp@latest` server with those env values to the client's MCP config file.)
4. Desktop Bridge: in Figma Desktop go to Plugins > Development > Import plugin from manifest..., select `~/.figma-console-mcp/plugin/manifest.json`, then run the plugin inside the file you will work on. It connects over WebSocket.
5. Restart the MCP client and say "Check Figma status"; it should show the Desktop Bridge connected.

**figma-cli install steps** (from its README):
1. Prerequisites: Figma Desktop installed and open, Claude Code (or Cursor), Node.js 18+.
2. The user downloads the project: https://github.com/silships/figma-cli into a folder in their home directory.
3. Inside that folder, the user asks Claude Code to "Set up figma-cli and connect it to my Figma" and follows its setup. It offers three connection modes: Yolo (patches Figma Desktop, default), Browser (Figma in Chromium) and Safe (official Figma plugin, no app changes). Recommend **Safe mode** for company machines.
4. Done when figma-cli says it is connected.

Also recommended (not blocking): the official Figma MCP and the skills figma-use, figma-generate-library, figma-generate-design, audit-design-system, ui-ux-pro-max. If one is missing, say so in one line and continue.

---

## 1. Step 0 - Intake basics

First pick the project (always, before 0.1):

| # | Question (send exactly) | Notes |
|---|---|---|
| 0.0 | "Which project should I work on? <one line per folder in My Projects> / Start a new project" | List the folders in `My Projects\` (skip `_Project_Template` and `README.md`). If there are none, say so and go straight to 0.1. Existing project: read its `Project_Brief.md` and `status.json`, say in one line what is already answered, and ask only what is missing (or continue from its Status). If it has unsynced changelog entries, ask then whether to update its Storybook (open the DS file and the Desktop Bridge first). New project: continue with 0.1. |

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

### Both: native or cross-platform (Abdul, 2026-09-30)

| | **Native** | **Cross-platform (Flutter / React Native custom UI)** |
|---|---|---|
| Figma DS files | `<Project> iOS Design System` (HIG names such as System Background and Label, Dynamic Type, SF Symbols, pt) **and** `<Project> Android Design System` (`md.sys.color`, M3 type scale, state layers, elevation levels, Material Symbols, dp) | One `<Project> Design System` |
| Brand Foundation | Optional `<Project> Brand Foundation` file: Primitives only (no Semantics, styles or components) | Not needed: the one DS holds the Primitives |
| Design files | `<Project> iOS` linked **only** to the iOS DS, `<Project> Android` linked **only** to the Android DS | One `<Project>` Design file |
| Local folders | `<Project>_iOS\` and `<Project>_Android\`, each with its own full skill set and `status.json` (plus `<Project>_Brand\` when the Brand Foundation exists) | One `<Project>_Mobile\` |
| Main Skills | Both, run one after the other; each checkpoint is shown per platform | The base chosen at 1.5 |

Native rules:
- The Brand Foundation is the only thing the two systems have in common, and only as a source of values. Each platform DS **copies** its Primitives into its own local collection (never consumes them as remote library variables, so the audit's 0 remote variables still holds) and builds its own platform Semantics on top. A brand color change goes into the Brand Foundation first, then `tools/recolor.py` runs on each platform folder.
- An iOS Design file never enables the Android library and vice versa. The file check (section 7c) rejects a cross-link.
- Record the choice in each folder's `status.json`: `mobile_setup` (`native` / `cross-platform`), `sibling_project` (the other platform folder) and `figma.brand_foundation` (name, url, file_key, or null).

Platform rules (never mix):
- **Web** = Tailwind conventions, web breakpoints (Desktop 1440 / iPad 768 / Mobile 375), Hover / Focus / Active states, Lucide icons.
- **iOS** = Apple HIG, Dynamic Type, iOS semantic names (System Background, Label...), SF Symbols style icons, pt units.
- **Android** = Material Design 3, `md.sys.color` tokens, state layers, elevation levels, Material Symbols, dp units.
- Each platform is **independent**: its own Figma DS file, its own variables, its own skills folder. Nothing is shared or merged between Web, iOS and Android. "Both" + Native means two full systems (the optional Brand Foundation only supplies Primitive values to copy); "Both" + Cross-platform means one shared system.
- After choosing, load the platform Main Skill **and** its required skills (figma-use + figma-generate-library; figma-swiftui for iOS; figma-code-connect when mapping to code). Until the iOS / Android Main Skills are finished, tell the user and use what exists in them.

---

## 3. Step 2 - Greenfield or Brownfield

| # | Question | Next |
|---|---|---|
| 2.1 | "Is this a new product with nothing designed yet (Greenfield), or does something already exist (Brownfield)? Greenfield / Brownfield" | Greenfield -> section 4. Brownfield -> 2.2 |
| 2.2 | "What already exists? 1) Screens in Figma or screenshots, but no design system / 2) A live product in code, with no Figma at all / 3) A design system exists (possibly imperfect), and the screens follow it only partly or not at all" | 1 -> section 5. 2 -> section 6. 3 -> section 7 |

### Decision tree

```
Tools preflight (0b) -> figma-console-mcp or figma-cli connected? No -> stop, show install steps
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

## 4. Step 3 - Greenfield

### 3a. Existing AI-ready DS
Question 3.1: "Do you already have an AI-ready design system for this project, meaning a Figma DS file plus .md / skill files? Yes / No / Start from a Trianglz template (Web/iOS/Android)"
- **Yes** -> ask "Please share the DS Figma link and the path to the skill files." Then:
  1. Read the skill files (Foundation_Skill, Component_Skills) and the DS file (⭐Setup first, then component groups; screenshot every variant light and dark).
  2. Run a **quick audit** (audit-design-system): remote variables/styles, raw values, unbound tokens, missing states, bad names, dead properties, missing descriptions. Compare against the platform Main Skill section 9 and 10.
  3. Report findings in a short list and ask: "The DS passed / has N issues. Fix the issues first (recommended) / Work from it as it is"
  4. Run **Fix on create** (section 7b) on it, then work from the fixed DS. Skip to the checkpoint that matches what is missing.
- **Start from a Trianglz template** -> 3a-2.
- **No** -> 3b.

### 3a-2. Start from a Trianglz template
Templates are listed in `References.md` in the Root (Web, iOS, Android). Use the template of the platform chosen in Step 1 only.
1. Ask: "Please open the Trianglz <Platform> template from References.md, duplicate it into your own Figma workspace (Duplicate to your drafts, then move it to the project folder), rename it '<Project> Design System', and send me the link."
2. Load the platform's Trianglz skills (`Trianglz/`, `Trianglz_iOS/` or `Trianglz_Android/`: Foundation_Skill first, then the component skills) as the map of what is in the file.
3. **Node IDs change in a duplicate.** Find every page, component set, style and variable by **name**, never by the ids written in those skills (they belong to the original file only).
4. Run the brand steps 3b and 3c to get the project's colors, fonts and direction, then rebrand the copy: update Primitives and Semantics, fonts, radius and spacing per the direction.
5. Run **Fix on create** (section 7b) on the copy: token fixes with `tools/fix_tokens.py`, then the component gaps from each skill's `references/gaps.md` and the platform Main Skill section 9. Then continue with 3d from the first missing layer.

### 3b. Colors from the brand folder
Look in `[Project folder]\Inputs\Brand\` (PDF brand book, logo, images, mood board).
- Files found -> extract brand colors (dominant + accent + neutrals), build hue ramps 50-950 around each, map to Semantics per the platform naming, check contrast (text >= 4.5:1, UI >= 3:1, Light and Dark). Show the palette and the Semantic mapping for approval.
- Folder empty -> Question 3.3: "I found no brand files. What is the primary / brand color (hex)? Add a secondary color too if you have one."
  If the user has none, ask: "Should I propose a palette based on the industry? Yes / No"
- **Brand contrast pre-check (right after the brand color is known):** run `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <modes> --check-only` (or `ds_color.contrast`) and show the brand color against white, black and each mode's base surface. It decides how every filled button looks: e.g. `#299B48` + white text = 3.57:1, fails 4.5:1, so filled buttons need dark text or a darker brand step. Put the result and the chosen fix in the Intake Summary's Direction line.

### 3c. Design direction from the inspiration folder
Look in `[Project folder]\Inputs\Inspiration\` (screenshots, links, Dribbble shots, competitor apps).
Derive and write down: corner style (sharp 0-4 / soft 6-12 / rounded 16+ / pill), density (compact / comfortable / spacious), elevation (flat / subtle shadows / layered), border use, type personality (geometric / humanist / grotesk), icon weight (outline / filled, stroke 1.5 / 2), imagery and illustration style.
- Folder empty -> Question 3.4: "I found no inspiration files. Which industry is the product in? (e.g. fintech, healthcare, e-commerce, education, government, SaaS)"
  Derive a style from the industry (use ui-ux-pro-max and Impeccable for the direction; avoid generic AI-looking UI). From ui-ux-pro-max take only the **style**, the **anti-patterns** and the **color mood** (e.g. a dark-palette hint); ignore its landing-page patterns (hero, scroll journeys, CTA placement) and its font pairing. Intake answers always win: fonts (0.6), modes (0.4), brand color (3.3) and RTL (0.5) are never overridden by a skill's suggestion.
  Do not ask for a separate approval: the direction goes into the Intake Summary (section 9), which is approved once.

### 3d. Build
**Which Figma file:** use the connected file if the user confirmed it at 0.2 as this project's DS file and it is empty; otherwise ask: "Please create a new Figma design file named '<Project> Design System' and send me its link." Register it in `status.json > figma.design_system`. A plugin cannot rename a file: if the connected file has another name, add "Rename the file to '<Project> Design System'" to the user's to-do list at the Foundation checkpoint.
**Foundation generator:** `python tools/new_foundation.py "<Project folder>" --brand "#hex" --modes <Light,Dark | Light | Dark>` writes `data/source/foundation-spec.json` (ramps from the brand color with stored curves, the Semantic mapping per mode, the paired-token check and every contrast pair). Fix every failure it prints (re-point the Semantic alias to another step), then build the Primitives and Semantics in Figma from the spec.
Follow the platform Main Skill build order exactly:
1. Primitives -> 2. Semantics (Light / Dark) -> 3. Spacing, Radius, Typography variables -> 4. Text and effect styles -> 5. Icons -> 6. Components: Atoms -> Molecules -> Organisms -> Patterns -> 7. Linked documentation pages -> 8. Audit + project skills.
Before each component: state its tier, post its atomic structure map, check dependencies exist, build missing lower tiers first.
Colors are built **recolor-ready** (platform Main Skill section 3b): full shade scales generated from one base color with a stored curve, Semantic tokens only alias Primitives, so a later color change regenerates every shade and everything follows.

---

## 5. Step 4 - Brownfield type 1: screens exist, no DS

This path runs in the **reverse direction**: the Design file (the existing screens) is the source, and the Design System file is built from it.
1. Ask: "Please share the Figma link of the Design file with the screens (or put screenshots in <Project folder>\Inputs\Screens\). Are the screens designed Figma frames, screenshots placed in Figma, or both?"
   Register it in `status.json > figma.design_files` with `role: source` and `content: frames | screenshots | mixed`.
   Then ask the user to open that Design file and the plugin (Desktop Bridge), and confirm the connected file key matches the registered one (section 7c) before reading anything.
2. **Read the screens** from the Design file:
   - Designed frames: read the layers (fills, strokes, text properties, auto layout gaps and padding, corner radius, effects) and find repeated elements (same structure or local components used many times) as component candidates.
   - Screenshots (images inside Figma or in `Inputs\Screens\`): export or view them and extract visually (colors by sampling, type sizes and weights by measuring, spacing and radius by measuring, repeated UI patterns).
   Read-only: never edit the source Design file during extraction. Extract every color, font family / size / weight / line height, spacing value, radius, shadow, and recurring UI pattern (buttons, inputs, cards, nav...). Save the raw inventory to `[Project folder]\Inputs\Extracted_Tokens.md` with usage counts.
3. **Merge approval**: show a summary of near-duplicate values (e.g. `#1A73E8` x42 and `#1B74E9` x3 -> merge to one; spacing 15/16 -> 16; radius 7/8 -> 8; font sizes 13/14 -> 14). Ask: "Here are the near-duplicates I suggest merging. Approve all (recommended) / Approve with changes (tell me which) / Keep all as they are"
4. Ask: "Please create a new Figma design file named '<Project> Design System' in the same Figma project folder as the screens, and send me its link." (Do not create it yourself unless the user asks.)
5. **Build the DS** in that file per the platform Main Skill: Primitives from the merged colors (nearest color per value plus full shade scales 50-950), Semantics, spacing / radius / typography variables, text and effect styles, icons, then the component groups from the recurring patterns (Atoms -> Patterns).
6. Register the new DS file in `status.json > figma.design_system`. Ask the user to **publish** the library ("Please publish '<Project> Design System' as a library and enable it in the design file. Tell me when done."), then open the Design file and verify it sees the library (section 7c). The source Design file now becomes a normal `role: screens` file linked to the library.
7. **Screen spec, then map the screens** (section 7f): open every source screen or screenshot at full size and write its screen spec (sections top to bottom, exact texts, icons, counts, full-bleed or gutter, pinned or scrolling). Then list, per section, which DS component / variant / variable covers it and what is missing (the 7e gap table). Show the specs and the map for approval; missing components are built in the DS file first (7e steps 2-3).
8. **Rebuild the screens properly on the DS** (like the PMO-MVP-New project sync work): section by section with DS instances and variables only, no hardcoded values or detached components, keeping the original layout and content exactly as the approved screen spec says. Follow the screen fidelity rules and the visual loop in section 7f for every screen. Load figma-generate-design + figma-use + ui-ux-pro-max. Keep the old screens on an `Archive` page until the user approves the new ones.

## 6. Step 5 - Brownfield type 2: live product, no Figma

1. Ask: "Please share the GitHub repository link and/or the local code path of the product."
2. **Extract tokens from the code first**: `tailwind.config.*`, CSS variables, theme files (`theme.ts`, `colors.ts`, SCSS variables), iOS `Assets.xcassets` / Color and Font extensions, Android `colors.xml`, `themes.xml`, `Theme.kt` / `Color.kt` / `Type.kt`, Flutter `ThemeData`. Also list the existing components and screens / routes grouped by module. Save to `[Project folder]\Inputs\Extracted_Tokens.md` and `Inputs\Code_Inventory.md`.
3. Show the merge summary of near-duplicates (same as type 1, step 3) and get approval. If the code has no tokens, ask for screenshots of the live product and extract from them.
4. Ask: "Please create two Figma design files in the same Figma project folder: '<Project>' (screens) and '<Project> Design System' (library). Send me both links." Register both in `status.json > figma` (section 7c).
5. **Build the full DS** per the platform Main Skill, matching the code token names where they are sensible (and noting the mapping for Code Connect).
6. Ask the user to publish the library and enable it in '<Project>'.
7. **Rebuild the screens** in '<Project>', **one page per module** (e.g. `Auth`, `Dashboard`, `Settings`), assembled only from DS components and variables. Offer figma-code-connect mapping afterwards.

## 7. Step 6 - Brownfield type 3: imperfect DS + Design file (Scenario C)

Use this path when a design system already exists but is not AI-ready (missing scopes, unclear names, no descriptions, gaps) and one or more Design files follow it only partially or not at all. Six steps, in order. Nothing in the Design files is changed before step 5, and nothing new is added to the DS without Abdul's approval. Load audit-design-system for steps 3 and 6, and figma-use + figma-generate-library for DS changes.

**Before step 1:** ask "Please share the design system Figma link and the link of every Design file (each with a name)." Register them in `status.json > figma` (section 7c). Then ask: "Do you have any reference for the tokens: developer token files, docs, a Storybook, a style guide? Share them if so." Any reference found is read first and wins over inference.

### Step 1 - Understand the DS (Variable Map)
1. Study the DS file (⭐Setup or its foundation pages first, then component groups; screenshot every variant in each mode).
2. Read **every variable**: collection, modes, scopes, value per mode (Light / Dark), alias target (which Primitive it points to), description, and **where it is used** inside the DS components (which component, which layer, which property: fill, stroke, text, gap, radius...). Export them first (section 7b step 1) so the data is in `data/source/`.
3. Infer each variable's purpose from, in this order: the user's references, its name and group, its scopes, where DS components use it, and its values across modes.
4. Write the **Variable Map** to `<Project folder>/audits/<date>-variable-map.md`, one row per variable:

   | Variable | Collection / modes | Value (Light / Dark) | Alias | Scopes | Used in (component > layer > property) | Inferred usage | Confidence |
   |---|---|---|---|---|---|---|---|

   Confidence: **high** (name, scope and usage agree), **medium** (two of three agree), **low** (unclear name, no scope, unused or used for conflicting purposes).
5. Show the summary (counts per confidence) and ask Abdul **only about the low-confidence names**, grouped in one message: "What is `<name>` for? <what I found>. My guess: <guess>." Record the answers in the map and in `docs/decisions.md`. Abdul approves the Variable Map before step 2.

### Step 2 - Fix the DS itself (after approval)
1. Propose the DS fixes as one list: missing or wrong **scopes** (from the approved map, e.g. a border color scoped to STROKE_COLOR only), **descriptions** for every variable (its usage from the map) and every component (Purpose, Usage Rules, Accessibility), bad names (section 7b renames), failing contrast pairs, and **gaps** (missing tokens, states or components the Design files will need). Gaps are flagged, never filled silently.
2. Apply the fixes in the DS file only (section 7b steps 2-4), split by risk, because this DS is already used by live Design files:
   - **Fix on create, without asking** (nothing visible changes in the screens): descriptions for variables and components, scopes for **high-confidence** variables, typo / spacing / case renames (bindings are kept), missing states added to components.
   - **Approval first** (can change how existing screens look or break bindings): any change to a value or alias (including contrast fixes), scopes for medium / low-confidence variables, merging or deleting variables or components, renaming a variable to a different meaning.
   Show both lists together; the first is already applied, the second waits for Abdul's yes.
3. Run audit-design-system on the DS, then ask Abdul to **publish** the library (section 7c) and wait for his confirmation.

### Step 3 - Audit the Design file, screen by screen
Run audit-design-system (ds-auditor, `screens` mode) on each Design file, one screen at a time. Per screen, find:
- **Raw values:** hardcoded hex colors, px spacing / radius / sizes, fonts and text properties not using a text style.
- **Misused variables:** a variable used against its scope or its Variable Map purpose (e.g. a border color used as a fill, a text color on a background, a spacing token used as a radius).
- **Detached instances** and local copies of DS components; hand-drawn elements that match a DS component.
- **Frames without Auto Layout** and **default layer names** (Frame 124, Rectangle 23).

Write the report to `<Project folder>/audits/<date>-screens-<file>.md`: per screen, one row per issue with the layer, the current value, the problem and a **proposed fix** (the variable, style or component to use, following step 4). Show totals per screen and per issue type.

### Step 4 - Raw values with no matching Semantic variable
For each raw value the report cannot map directly, decide by this rule and write the decision in the report:
- **Near-miss of an existing token** (e.g. `#1B74E9` next to `color/action/primary` `#1A73E8`, 15px next to `space/4` 16px) -> use the nearest token.
- **Repeated new value** (the same value used on several screens or many layers, with a clear purpose) -> propose a **new Primitive + Semantic** pair (name, value per mode, Primitive it aliases, scope). Never added without Abdul's approval; once approved it is added in the DS file, the library is published, then the screens are bound to it.
- **One-off off-scale value** (e.g. 13px gap, 7px radius) -> snap to the nearest step of the scale.
- **Unsure** -> mark `needs decision` and ask Abdul.
- **Alpha colors** (raw color with opacity < 100%, from the hex alpha or the fill/layer opacity; the single source of this rule, Main Skills point here): find the real background under the layer, flatten `result = color*alpha + bg*(1-alpha)`, and match the result to the nearest opaque Semantic token by OKLCH deltaE. Repeat against the background in the other mode (Light and Dark). Same token in both modes with deltaE < 2 -> bind it (opaque); otherwise `needs decision`. Helper: `python tools/flatten_alpha.py <folder> --color "#RRGGBBAA" --bg <bg token>`. **Exceptions stay transparent:** scrims and overlays over content, elements over images, hover/pressed state layers; bind them to an existing alpha token, or propose a new one (e.g. `overlay/scrim`) only with Abdul's approval.

### Step 5 - Fix the screens (after the report is approved)
1. Abdul approves the report (and any new tokens from step 4). Add approved tokens to the DS file first, publish (section 7c), and have Abdul run **Accept updates** in the Design file before binding.
2. Fix **screen by screen**: bind raw values to variables and styles, replace misused variables, swap detached copies and hand-drawn parts for library instances, add Auto Layout, rename default layers. Missing components are built in the DS file first (by tier, section 7e step 2), never in the Design file.
3. On any ambiguous case not decided in the report, stop and ask Abdul before changing it.
4. **Keep the existing screen sizes** (section 7d Brownfield exception).
5. Re-run the Design file audit after each screen and report the before / after numbers.

### Step 6 - Log, publish, update every Design file
Append the `CHANGELOG.md` entry (Variable Map, DS fixes, tokens added, screens fixed, audit numbers, `Storybook synced: no`), run `tools/project_status.py`, make sure the last DS change is published (section 7c), and list every linked Design file that still needs **Accept updates**; mark each one as Abdul confirms it. Then ask about the Storybook update.

---

## 7b. Fix on create (Abdul's rule: every problem found while setting up a project gets fixed)

Runs automatically, without asking, whenever a project starts from an existing file: a duplicated Trianglz template (3a-2), an existing AI-ready DS (3a), and as the last foundation step of every new build. Work only in the project's own copy, never in an original template.
1. Export the file's variables (figma-console `figma_export_tokens`, format dtcg) into `My Projects/<Project>/data/source/figma-variables.dtcg.json`. If it returns 0 tokens (seen for a file with 200 variables, even after `figma_get_variables refreshCache`), run `tools/export_variables.figma.js` with `figma_execute` instead and save its returned JSON to the same file (same DTCG shape). Copy `data/source/config.json` and `data/rules.json` from the matching Trianglz folder (update collection ids and names), and run `python tools/build_tokens.py "My Projects/<Project>"`. For a Web project, set `rules.json > components.required_states_interactive` to the Web Main Skill table (Pressed and Loading are required on Button only), and add the `action/*/border` pairs to `contrast_pairs` (Web skill section 3).
2. Run `python tools/fix_tokens.py "My Projects/<Project>"`. It builds `data/fixes/<date>-fix-plan.json` and a `.figma.js` script that:
   - normalizes hand-picked palette tones to true tones (Android, `known_fixes.normalize_tones`);
   - recomputes derived tokens (M3 state layers, surface tints) from their role colors;
   - re-points aliases that point to other libraries (`known_fixes.alias_fixes`);
   - fixes every failing contrast pair in `rules.json` by moving the Semantic alias to the nearest passing step of the same ramp (never raw hex);
   - renames bad variable and collection names (typos, double or trailing spaces, `??`, generic ` 2` suffixes, mixed case); renames keep every binding.
3. Apply the script with figma_execute in the project's DS file, re-export, and re-run `build_tokens.py` and `fix_tokens.py` until the plan is empty and `recolor_readiness.ready` is true.
4. Fix the component-level items listed in the plan's `needs_a_person` and in each `references/gaps.md` (missing states, `Property 1` / `Status4` names, `Mode=Light|Dark` variants, text glyph icons, unwired properties, missing text/instance-swap properties), lowest tier first, in the same file.
5. Run audit-design-system (or the ds-auditor agent) and screenshot the affected pages in Light and Dark.
6. Log every fix in `My Projects/<Project>/docs/decisions.md` and show the before/after summary at the Foundation checkpoint (section 8). The fixes are already applied at that point; the user reviews them, they are not asked for permission first.

## 7c. Linked Figma files: registry, publish and file check (every path)

Each project has **one Design System file** and a **list of Design files** (screens), stored in `[Project folder]\status.json > figma`:
- `design_system`: name, url, file_key, last_publish.
- `design_files`: one entry per file: name (e.g. Web App, Admin Dashboard, Marketing Site), url, file_key, role (`screens`, or `source` for Brownfield type 1 before the DS exists), content (`frames`, `screenshots`, `mixed`), library_updates_accepted (true / false).
- `brand_foundation` (Both + Native only, optional): name, url, file_key of `<Project> Brand Foundation`; the same entry is stored in the iOS and the Android folder. It is a value source only, never enabled as a library in a Design file.
- The file key is the part of the Figma URL after `/design/` or `/file/`. Ask for the links once (question 0.2); later sessions read them from `status.json`.

**After any change to the DS file** (variables, styles, components):
1. Ask: "Please publish the '<DS name>' library (Assets > Library > Publish). Tell me when done."
2. When confirmed, set `design_system.last_publish` to today, set every design file's `library_updates_accepted` to false, and log it in `CHANGELOG.md` (`Library published: yes`).
3. List the linked Design files that still need the update: "These files need Accept updates for the library: <names>. Tell me which ones you updated." Set each confirmed file to true and record it in the same changelog entry.

**Before any Figma work (the file check):**
1. Screen work with more than one Design file: ask "Which Design file should I work on? <names>".
2. Ask the user to open that file (or the DS file for DS work) in Figma Desktop and start the plugin (Desktop Bridge).
3. When connected, read the connected file's key (figma_get_status / figma_list_open_files) and compare it with `status.json`. It must be the file registered for this project and the role you need.
4. For screen work, also check that the DS library is enabled in that file and current (its library variables and components are visible, and `library_updates_accepted` is true after the last publish).
5. On any mismatch (a file from another project, an unregistered file, the DS file when screens were expected, the library missing or out of date, or in a Both + Native project an iOS Design file with the Android library enabled or the reverse): **stop, touch nothing**, and tell the user what is connected and what was expected.
6. **Two or more files connected** (e.g. the DS file and a Design file): the Desktop Bridge "active file" follows the user's focus, so node ids from one file get looked up in the other. Before any write or screenshot, pin the target with `figma_navigate` (`lock: true`) and re-pin after switching files.
7. **Screenshots and exports** (`exportAsync`, `figma_capture_screenshot`) also need the target file to be the **visible tab** in Figma Desktop; in a background tab they time out while structural reads still work. Before screen work, ask once: "Please keep '<file name>' as the front tab in Figma until the Screens checkpoint." If a capture times out, ask the user to bring the file to the front, then retry.

## 7d. Screen sizes (Abdul's rule, every path that builds screens)

**Design file audit (Abdul's rule, every time screens are built or changed):** run audit-design-system (ds-auditor, `screens` mode) on that Design file to confirm it really uses the DS: library components only (no local copies, detached instances or hand-drawn parts), library variables and styles only (no raw values, no variables used for the wrong purpose), latest library version. Fix what it finds, save the report in `<Project folder>/audits/`, and log the result in `CHANGELOG.md` (`Design file audit: <numbers>, report <path>`).

- Screens are always **Mobile 375px** and **Desktop 1440px** wide.
- **Brownfield exception:** keep the sizes of the screens that are already designed in the file, so they are not broken.
- If the existing "screens" are only screenshots (images, not designed frames), they do not set the size: use 375 / 1440.

## 7e. Multi-screen flows (Abdul's rule, every request for a flow of two or more screens)

A flow (e.g. sign-up, checkout, booking) always runs in this order. Load figma-generate-design + figma-use + ui-ux-pro-max for the screens, and figma-generate-library + figma-use for any new component.

1. **Flow gap analysis first (no build yet).** When the screens have a visual source (screenshots, existing frames, a mockup), write its screen spec first (section 7f). Split every screen of the flow into sections (e.g. Top Bar, Form, Summary, Button Docked). Produce **one table** for the whole flow: screen, section, element, the DS component that covers it (existing) or `missing`. For each missing component give its tier (Atom / Molecule / Organism) and its atomic structure map (which existing atoms and variables it is built from). Save it in `<Project folder>/audits/<date>-flow-<name>.md` and show it. **Abdul approves the table before anything is built.**
2. **Build the missing components in the DS file, never in the Design file.** Lower tier first, only from existing variables, styles and atoms (Atomic Design golden rule). Each one gets its Figma description (Purpose, Usage Rules, Accessibility), an entry in its group's Component_Skill and `data/component-registry.json`, and an audit (ds-auditor). If a component needs a token that does not exist, **propose it (name, value, Primitive it aliases) and wait for approval**; never add it silently.
3. **Publish and update the Design file.** Ask Abdul to publish the library (section 7c) and wait for his confirmation. Then he runs Accept updates in the Design file; open it, run the file check (section 7c) and **verify the new components appear** in its library before using them.
4. **Build the screens one by one** from library instances and variables only (no local copies, detached instances or raw values), section by section, at the sizes in section 7d (375 / 1440; Brownfield keeps existing sizes). Follow the screen fidelity rules and the visual loop in section 7f. **Audit the Design file after each screen** (ds-auditor, `screens` mode, fidelity checks included) and fix before the next screen.
5. **Log and ask.** Append the entry to `CHANGELOG.md` (components added, library published, Design files updated, Design file audits) with `Storybook synced: no`, run `tools/project_status.py`, then ask whether to update the Storybook now or later.

- Screens that need **no new component** may be built while waiting for the Publish confirmation; screens that use a new component wait for step 3.
- The Screens checkpoint (section 8) shows the whole flow, per mode, with the audit results.

## 7f. Screen fidelity (Abdul's rule, every path that builds or rebuilds screens)

Brownfield trial (2026-09-30): screens built from the text inventory alone, with default instance text and no visual check, passed the DS audit but looked nothing like the source. A screen is done only when it matches its source, not when it only uses the DS.

1. **Look at the source first.** Open every source screenshot or frame at full size (view the image file, or `figma_capture_screenshot` of the frame). `Inputs/Extracted_Tokens.md` is for tokens only; it is never the reference for a screen.
2. **Screen spec** (one file per screen, `<Project folder>/audits/<date>-screen-spec-<screen>.md`), sections top to bottom. Per section: the DS component and variant, every text exactly as shown (keep the original language), icons, item counts (e.g. 8 playlist rows, 3 chips), selected/active states, alignment, full-bleed or inside the gutter, and whether it scrolls, scrolls horizontally or is pinned (status bar, app bar, mini player, bottom navigation), and each bar's width as the source shows it (full-bleed, or inset like a floating mini player). Anything the DS lacks goes in the 7e gap table. The specs are approved together with the gap table, before any build.
3. **Build rules.**
   - Every text, variant, boolean, icon swap and image slot of every instance is set from the spec. No default placeholder text may remain ("Label", "Filter", "Track title", "Title"); two instances only share a text when the source does.
   - Item counts match the spec. A list or rail that continues off screen keeps the visible count plus the partial item the source shows.
   - Screen structure: status bar and top bars at the top; mini player and bottom navigation pinned at the bottom (outside the scrolling content); each bar full-bleed or inset exactly as the spec says (a floating mini player stays inset); the gutter applies to the content only. Horizontal rows clip and scroll; they never overflow the screen or squash their children.
   - Fixed-size instances keep their size (no instance narrower than its component's minimum width). Hug or fill is chosen per the spec, never left to overflow.
   - The screen frame's background, padding and gaps are bound to DS variables, like everything inside it.
   - Build one section per script call and check it before the next; never build a whole screen in one script.
4. **Visual loop (mandatory, every screen).** After each screen: capture it with `figma_capture_screenshot`, place the capture next to the source image, and compare section by section: order, texts, counts, icons, sizes (within 4 px), colors, pinned bars. Fix and repeat, up to 3 rounds; list what still differs and why. If the capture fails, stop and ask the user to bring the Design file to the front in Figma (section 7c.7), then retry. A screen is never reported as done without its side-by-side images.
5. **Fidelity audit.** ds-auditor `screens` mode includes the fidelity checks (placeholder texts left, counts vs spec, overflowing or squashed children, pinned bars, unbound screen frames). `tools/check_screens.figma.js` does the structural part.
6. **Report, never self-approve.** Show every screen next to its source (each mode the project has) with the audit numbers, and set the Screens checkpoint to `Ready for review`. Only the user's reply sets `Approved` (section 8).
7. **Brownfield `screen-templates.json`:** generated from the approved screen specs of the project's real screens, not copied from a Trianglz reference.

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

## 10. Folder conventions

```
<Root>\                                    (Main Skills only)
├─ CLAUDE.md                                (tells Claude to start with this skill)
├─ README.md, References.md                 (setup steps, Trianglz template links)
├─ .claude\skills\                          (slash commands pointing to the Main Skills)
├─ .claude\agents\, hooks\, settings.json   (subagents, QA hooks, permissions)
├─ memory\MEMORY.md                        (shared project memory, imported by CLAUDE.md)
├─ Storybook_Design_System_Skill\SKILL.md  (optional live Storybook)
├─ tools\                                   (build_tokens.py, recolor.py, ds_color.py)
├─ Design_System_Intake_Skill\SKILL.md      (this skill, runs first)
├─ Web_Design_System_Skill\SKILL.md
├─ iOS_Design_System_Skill\SKILL.md
├─ Android_Design_System_Skill\SKILL.md
└─ My Projects\                            (every project; README.md explains how to add one)
   ├─ _Project_Template\                   (copied for each new project, never edited per project)
   └─ <Project>\                           (Web)   | <Project>_iOS\ | <Project>_Android\ | <Project>_Mobile\ (Both, cross-platform) | <Project>_Brand\ (Both native, optional Brand Foundation)
      ├─ Project_Brief.md                      (intake answers, links, decisions)
      ├─ CHANGELOG.md                          (dated Figma changes, each marked Storybook synced yes/no)
      ├─ status.json                           (last change, unsynced count, last Storybook sync; tools/project_status.py)
      ├─ Inputs\
      │  ├─ Brand\                             (brand book PDF, logo, images, mood board)
      │  ├─ Inspiration\                       (reference screenshots, links)
      │  ├─ Screens\                           (screenshots of existing UI)
      │  ├─ Extracted_Tokens.md                (Brownfield types 1 and 2)
      │  └─ Code_Inventory.md                  (Brownfield type 2)
      ├─ data\                                 (tokens.json, component-registry.json, rules.json, screen-templates.json, source\, recolor\)
      ├─ docs\decisions.md                     (why each decision was made; recolor log)
      ├─ audits\                              (ds-auditor reports)
      ├─ storybook\                           (optional live Storybook, section 12)
      ├─ Foundation_Skill\SKILL.md + references\ (variables.md, gaps.md, screens\)
      └─ Component_Skills\
         ├─ Form_Elements_Skill\               (anything the user enters data with)
         ├─ Navigation_Skill\                  (actions, buttons, links, tabs, anything that moves between places)
         └─ Data_Display_Skill\                (anything that displays information)
            each: SKILL.md + references\ (components.md, gaps.md, screens\)
```

- New project folders are copies of `My Projects\_Project_Template\`. Each can become its own private Git repo, separate from the workflow repo (see `My Projects\README.md`); never create or push one without asking.
- Root tools take the project folder relative to the Root, quoted: `python tools/build_tokens.py "My Projects/<Project>"`.
- One folder per platform: "Both" + Native creates `<Project>_iOS\` and `<Project>_Android\`, each with its own full skill set (and `<Project>_Brand\` with `Project_Brief.md`, `status.json` and `data\tokens.json` Primitives when the Brand Foundation is chosen). "Both" + Cross-platform creates one `<Project>_Mobile\`.
- Group routing for new components and pages (Figma and skills): foundations -> ⭐Setup / Foundation_Skill; data entry -> ⭐Form Elements; actions and navigation -> ⭐Navigation; information display -> ⭐Data Display. Create a new `➜` page in the matching group when no page fits.
- Figma file names: `<Project> Design System` for the library, `<Project>` for screens. Both + Native: `<Project> iOS Design System`, `<Project> Android Design System`, `<Project> iOS`, `<Project> Android`, optional `<Project> Brand Foundation`. Page structure follows the platform Main Skill (Cover, ⭐Setup, ⭐ groups with ➜ topic pages).

---

## 11. Step 8 - Always finish with skills and the final audit

1. Run **audit-design-system** on the DS and on every Design file whose screens were built or relinked (section 7d rule): 0 remote variables/styles, 0 raw values, 0 detached components, every property wired, contrast passing in Light and Dark. Fix and re-run until clean, then report the numbers.
2. Screenshot every variant (each mode the project has) into the skills' `references\screens\`.
3. Write / update the project skills (usually through the docs-writer agent, which keeps `data/docs-progress.json` so a run cut off by a rate limit can resume where it stopped):
   - `Foundation_Skill`: variables (names, values per mode, scopes, code syntax), styles, grids, icon rules, direction decisions from the intake.
   - One Component_Skill per group: every component with tier, variants, properties, exact use cases, when not to use, and dependencies.
   - `gaps.md` in each: anything left open.
   - The JSON knowledge base in `My Projects/<Project>/data/`: export variables and run `python tools/build_tokens.py "My Projects/<Project>"` (tokens.json), then write `component-registry.json`, `rules.json`, `screen-templates.json` (copy the Trianglz reference versions as the starting shape) and `docs/decisions.md`.
   - Check `tokens.json > recolor_readiness.ready` is true.
4. Update `Project_Brief.md` with the final state and links, add the `CHANGELOG.md` entry (`Storybook synced: no`), refresh `status.json` with `tools/project_status.py`, and save the key facts to memory.
5. Reply to the user with the audit result, the skill paths and what is left.

---

## 12. Step 9 (optional) - Live Storybook

Runs when 0.7 = Yes, after the Components checkpoint is approved (or whenever the user asks later). When 0.7 = Later, ask again at the trigger in `status.json > storybook_ask_at` and move the trigger forward on each new "Later" (0.7 notes).
1. Load `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
2. Make sure `data/tokens.json` and `data/component-registry.json` reflect the live Figma file (token-extractor subagent if they need a resync).
3. Ask before installing any Node package; show the exact commands.
   - iOS / Android: build the Storybook as web (React + CSS) styled like the native components (Storybook skill, principle 7).
   - Meet the Storybook quality bar (principle 8): working components, sidebar navigation, Figma description and use case per component, every Figma property as a control, all states in Light and Dark. Write each component description in Figma and in Storybook during the build.
4. Build the Storybook in `<platform folder>/storybook/`, one per platform, with names that match Figma exactly.
5. Verify (build, parity check, visual check against Light/Dark screenshots), then offer to register the Storybook MCP for this folder.
6. Record the path, run command and MCP status in `Project_Brief.md`, then mark the changelog synced: `python tools/project_status.py "My Projects/<Project>" --mark-synced`.
