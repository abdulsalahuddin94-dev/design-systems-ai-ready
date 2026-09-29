---
name: design-system-intake
description: Main entry skill for every use of "Design systems Ai Ready". Runs first, before any other skill or Figma call. Interviews the user one question at a time (in English) to collect the project basics, platform, and whether the work is Greenfield or Brownfield, then routes to the right path (new DS, screens without a DS, live product without Figma, DS with unlinked screens), loads the matching platform Main Skill (Web_Design_System_Skill, iOS_Design_System_Skill, Android_Design_System_Skill), enforces the approval checkpoints (Foundation, Components, Screens) and always ends by writing the project skills and running the final audit.
---

# Design System Intake (Main Skill - runs first, every time)

Root: the folder that contains this skill's parent folder (the repo root, where `CLAUDE.md` lives). All paths below are relative to the Root.
This skill decides **what** to build and **which path** to follow. The platform Main Skills decide **how** to build it.
Never touch Figma while this intake is running. Figma work starts only after the path is chosen and the platform Main Skill plus its required skills are loaded.

---

## 0. Interview rules

- Ask **one question per message**, in English, and wait for the answer. Never send a list of questions at once.
- Use the exact questions below. Offer options on short lines, mark the recommended one, and accept free text.
- Skip a question when the user already answered it (in this conversation, in the project folder's `Project_Brief.md`, or in memory). Say what you reused in one line.
- If the user says "you decide", pick the recommended option, say which, and continue.
- If the user only asks to **change a color** in an existing DS, skip the intake questions: run the Recolor procedure in the platform Main Skill (section 3b) with `tools/recolor.py`.
- After the last intake question, post a short **Intake Summary** (section 9) and get a "yes" before any Figma work.
- Record every answer in `[Project folder]\Project_Brief.md` as you go, so a later session never re-asks.
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
3. If one of them is installed and connected -> say which one in one line and continue to Step 0 basics.
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

Ask in this order:

| # | Question (send exactly) | Notes |
|---|---|---|
| 0.1 | "What is the project name?" | Used for folder and Figma file names. Keep the user's spelling; replace spaces with `_` only in folder names. |
| 0.2 | "Please share the Figma links for this project (design file, design system file, or the Figma project folder). Reply 'none' if there are none yet." | Store each link with its role. |
| 0.3 | "What is the local folder path for this project? (Default: <Root>\<Project>)" | Create the folder structure in section 10 if missing. |
| 0.4 | "Which color modes do you need? Light only / Light and Dark (recommended) / Dark only" | Sets Semantic modes. |
| 0.5 | "Do you need Arabic / RTL support? Yes / No" | If Yes: mirrored layouts, RTL auto layout checks, directional icons (arrows, chevrons, back) get mirrored variants, Arabic font pairing, and text styles tested with Arabic copy. |
| 0.6 | "Which fonts should the system use? Name the Latin font and, if RTL is needed, the Arabic font. Reply 'default' to use the platform default." | Defaults: Web = Poppins (org default) or the brand font; iOS = SF Pro; Android = Roboto / Roboto Flex. Arabic default pairing: IBM Plex Sans Arabic (Web/Android), SF Arabic (iOS). Confirm the fonts are installed / available in Figma. |
| 0.7 | "Do you also want a live Storybook for developers (browse components, try variants and properties, read use cases, link back to Figma)? Yes, after components (recommended when developers will use the DS) / Later / No" | Optional. Yes -> run section 12 after the Components checkpoint. Default stack for every platform: React + Storybook. iOS and Android projects get a web Storybook (React + CSS) styled like the native components. Record the answer in `Project_Brief.md`. |

---

## 2. Step 1 - Platform

| # | Question | Next |
|---|---|---|
| 1.1 | "Which platform is this design system for? Web / Mobile" | Web -> load `Web_Design_System_Skill`. Mobile -> 1.2 |
| 1.2 | "Which mobile platform? iOS / Android / Both (native iOS and Android) / Cross-platform (Flutter or React Native)" | iOS -> `iOS_Design_System_Skill`. Android -> `Android_Design_System_Skill`. Both -> both skills, two independent systems. Cross-platform -> 1.3 |
| 1.3 | "Which framework, and should the app look native on each platform or share one brand look? Flutter shared / React Native shared / Native look on each platform" | Native look -> treat as **Both**. Flutter shared -> `Android_Design_System_Skill` as the base (Flutter widgets are Material 3). React Native shared -> ask 1.4. |
| 1.4 | "Which base should the shared look follow? Material 3 (recommended for one codebase) / Apple HIG" | Load the matching Main Skill as the base. |

Platform rules (never mix):
- **Web** = Tailwind conventions, web breakpoints (Desktop 1440 / iPad 768 / Mobile 375), Hover / Focus / Active states, Lucide icons.
- **iOS** = Apple HIG, Dynamic Type, iOS semantic names (System Background, Label...), SF Symbols style icons, pt units.
- **Android** = Material Design 3, `md.sys.color` tokens, state layers, elevation levels, Material Symbols, dp units.
- Each platform is **independent**: its own Figma DS file, its own variables, its own skills folder. Nothing is shared or merged between Web, iOS and Android. "Both" means two full systems.
- After choosing, load the platform Main Skill **and** its required skills (figma-use + figma-generate-library; figma-swiftui for iOS; figma-code-connect when mapping to code). Until the iOS / Android Main Skills are finished, tell the user and use what exists in them.

---

## 3. Step 2 - Greenfield or Brownfield

| # | Question | Next |
|---|---|---|
| 2.1 | "Is this a new product with nothing designed yet (Greenfield), or does something already exist (Brownfield)? Greenfield / Brownfield" | Greenfield -> section 4. Brownfield -> 2.2 |
| 2.2 | "What already exists? 1) Screens in Figma or screenshots, but no design system / 2) A live product in code, with no Figma at all / 3) A design system exists, but the screens are not linked to it" | 1 -> section 5. 2 -> section 6. 3 -> section 7 |

### Decision tree

```
Tools preflight (0b) -> figma-console-mcp or figma-cli connected? No -> stop, show install steps
Intake basics (0.1-0.6)
└─ Platform (1.1-1.4) -> load platform Main Skill(s)
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
         ├─ Type 1: screens, no DS  -> extract -> merge approval -> "<Project> Design System" file -> build -> publish/link -> rebuild screens
         ├─ Type 2: live code, no Figma -> repo/path -> extract tokens from code -> "<Project>" + "<Project> Design System" files -> build -> rebuild screens per module
         └─ Type 3: DS + unlinked screens -> Scenario C: audit -> relink screens
Every path from an existing file: Fix on create (section 7b)
Every path: checkpoints Foundation -> Components -> Screens (section 8)
Every path ends: write project skills + final audit (section 11)
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

### 3c. Design direction from the inspiration folder
Look in `[Project folder]\Inputs\Inspiration\` (screenshots, links, Dribbble shots, competitor apps).
Derive and write down: corner style (sharp 0-4 / soft 6-12 / rounded 16+ / pill), density (compact / comfortable / spacious), elevation (flat / subtle shadows / layered), border use, type personality (geometric / humanist / grotesk), icon weight (outline / filled, stroke 1.5 / 2), imagery and illustration style.
- Folder empty -> Question 3.4: "I found no inspiration files. Which industry is the product in? (e.g. fintech, healthcare, e-commerce, education, government, SaaS)"
  Derive a style from the industry (use ui-ux-pro-max and Impeccable for the direction; avoid generic AI-looking UI), then show it as a one-screen direction summary for approval.

### 3d. Build
Follow the platform Main Skill build order exactly:
1. Primitives -> 2. Semantics (Light / Dark) -> 3. Spacing, Radius, Typography variables -> 4. Text and effect styles -> 5. Icons -> 6. Components: Atoms -> Molecules -> Organisms -> Patterns -> 7. Linked documentation pages -> 8. Audit + project skills.
Before each component: state its tier, post its atomic structure map, check dependencies exist, build missing lower tiers first.
Colors are built **recolor-ready** (platform Main Skill section 3b): full shade scales generated from one base color with a stored curve, Semantic tokens only alias Primitives, so a later color change regenerates every shade and everything follows.

---

## 5. Step 4 - Brownfield type 1: screens exist, no DS

1. Ask: "Please share the Figma link of the screens, or put the screenshots in <Project folder>\Inputs\Screens\ and tell me when ready."
2. **Read the screens** via Figma MCP / figma-console (layers) or from screenshots. Extract every color, font family / size / weight / line height, spacing value, radius, shadow, and recurring UI pattern (buttons, inputs, cards, nav...). Save the raw inventory to `[Project folder]\Inputs\Extracted_Tokens.md` with usage counts.
3. **Merge approval**: show a summary of near-duplicate values (e.g. `#1A73E8` x42 and `#1B74E9` x3 -> merge to one; spacing 15/16 -> 16; radius 7/8 -> 8; font sizes 13/14 -> 14). Ask: "Here are the near-duplicates I suggest merging. Approve all (recommended) / Approve with changes (tell me which) / Keep all as they are"
4. Ask: "Please create a new Figma design file named '<Project> Design System' in the same Figma project folder as the screens, and send me its link." (Do not create it yourself unless the user asks.)
5. **Build the DS** in that file per the platform Main Skill: Primitives from the merged colors (nearest color per value plus full shade scales 50-950), Semantics, spacing / radius / typography variables, text and effect styles, icons, then the component groups from the recurring patterns (Atoms -> Patterns).
6. Ask the user to **publish** the library ("Please publish '<Project> Design System' as a library and enable it in the design file. Tell me when done.") and verify the design file sees it.
7. **Map the screens**: list every screen and, per screen, which elements map to which DS component / variable, and what is missing. Show the map for approval.
8. **Rebuild the screens properly on the DS** (like the PMO-MVP-New project sync work): section by section with DS instances and variables only, no hardcoded values or detached components, keeping the original layout and content. Load figma-generate-design + figma-use + ui-ux-pro-max. Keep the old screens on an `Archive` page until the user approves the new ones.

## 6. Step 5 - Brownfield type 2: live product, no Figma

1. Ask: "Please share the GitHub repository link and/or the local code path of the product."
2. **Extract tokens from the code first**: `tailwind.config.*`, CSS variables, theme files (`theme.ts`, `colors.ts`, SCSS variables), iOS `Assets.xcassets` / Color and Font extensions, Android `colors.xml`, `themes.xml`, `Theme.kt` / `Color.kt` / `Type.kt`, Flutter `ThemeData`. Also list the existing components and screens / routes grouped by module. Save to `[Project folder]\Inputs\Extracted_Tokens.md` and `Inputs\Code_Inventory.md`.
3. Show the merge summary of near-duplicates (same as type 1, step 3) and get approval. If the code has no tokens, ask for screenshots of the live product and extract from them.
4. Ask: "Please create two Figma design files in the same Figma project folder: '<Project>' (screens) and '<Project> Design System' (library). Send me both links."
5. **Build the full DS** per the platform Main Skill, matching the code token names where they are sensible (and noting the mapping for Code Connect).
6. Ask the user to publish the library and enable it in '<Project>'.
7. **Rebuild the screens** in '<Project>', **one page per module** (e.g. `Auth`, `Dashboard`, `Settings`), assembled only from DS components and variables. Offer figma-code-connect mapping afterwards.

## 7. Step 6 - Brownfield type 3: DS exists, screens unlinked (Scenario C)

1. Ask: "Please share the design system Figma link and the screens Figma link."
2. Study the DS (⭐Setup first, then component groups, screenshots light and dark) and run audit-design-system on the DS itself, then run **Fix on create** (section 7b) on the DS before touching the screens.
3. **Audit the screens**: hardcoded hex / fonts / spacing / radius, detached or local components, missing components, local overrides. Report per page with counts.
4. Ask: "Relink everything automatically where there is an exact or near match (recommended) / Review each page with me first"
5. **Relink**: replace hardcoded values with DS variables and styles, detached copies with DS instances; build any missing components in the DS first (by tier). Document when to use each component.
6. Re-run the audit and report the before / after numbers.

---

## 7b. Fix on create (Abdul's rule: every problem found while setting up a project gets fixed)

Runs automatically, without asking, whenever a project starts from an existing file: a duplicated Trianglz template (3a-2), an existing AI-ready DS (3a), a DS with unlinked screens (Step 6), and as the last foundation step of every new build. Work only in the project's own copy, never in an original template.
1. Export the file's variables (figma-console `figma_export_tokens`, format dtcg) into `<Project>/data/source/`, copy `data/source/config.json` and `data/rules.json` from the matching Trianglz folder (update collection ids and names), and run `python tools/build_tokens.py <Project>`.
2. Run `python tools/fix_tokens.py <Project>`. It builds `data/fixes/<date>-fix-plan.json` and a `.figma.js` script that:
   - normalizes hand-picked palette tones to true tones (Android, `known_fixes.normalize_tones`);
   - recomputes derived tokens (M3 state layers, surface tints) from their role colors;
   - re-points aliases that point to other libraries (`known_fixes.alias_fixes`);
   - fixes every failing contrast pair in `rules.json` by moving the Semantic alias to the nearest passing step of the same ramp (never raw hex);
   - renames bad variable and collection names (typos, double or trailing spaces, `??`, generic ` 2` suffixes, mixed case); renames keep every binding.
3. Apply the script with figma_execute in the project's DS file, re-export, and re-run `build_tokens.py` and `fix_tokens.py` until the plan is empty and `recolor_readiness.ready` is true.
4. Fix the component-level items listed in the plan's `needs_a_person` and in each `references/gaps.md` (missing states, `Property 1` / `Status4` names, `Mode=Light|Dark` variants, text glyph icons, unwired properties, missing text/instance-swap properties), lowest tier first, in the same file.
5. Run audit-design-system (or the ds-auditor agent) and screenshot the affected pages in Light and Dark.
6. Log every fix in `<Project>/docs/decisions.md` and show the before/after summary at the Foundation checkpoint (section 8). The fixes are already applied at that point; the user reviews them, they are not asked for permission first.

## 8. Step 7 - Approval checkpoints (every path)

Stop and ask for approval at each checkpoint. Show screenshots (light and dark) and a short summary, never just a statement.

| Checkpoint | Show | Question |
|---|---|---|
| **1. Foundation** | Colors (Primitives + Semantics, Light/Dark), typography scale, spacing, radius, shadows, icons, contrast results | "Foundation is ready. Approve and move to components / Request changes" |
| **2. Components** | Every component set per group, all variants and states, light and dark previews | "Components are ready. Approve and move to screens / Request changes" |
| **3. Screens** | Every rebuilt or new screen, light and dark, audit result | "Screens are ready. Approve / Request changes" |

- Do not start the next phase before the user approves the current one.
- Save a Figma version in history after each approved checkpoint.
- Paths with no screens (Greenfield DS only) use checkpoints 1 and 2 only, unless the user asks for screens.

---

## 9. Intake Summary (post before any Figma work)

```
Project: <name>            Local folder: <path>
Figma: <links and roles>
Platform: <Web / iOS / Android / Both / Flutter / RN> -> Main Skill(s): <names>
Modes: <Light / Dark>      RTL: <Yes/No>      Fonts: <Latin / Arabic>
Path: <Greenfield 3a/3b-3d | Brownfield type 1/2/3>
Inputs found: Brand <n files / empty>, Inspiration <n / empty>, Screens <n / link>
Storybook: <Yes after components / Later / No>
Next step: <first action>
```
Ask: "Is this correct? Yes, start / Change something"

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
└─ <Project>\                               (Web)   | <Project>_iOS\ | <Project>_Android\ | <Project>_Mobile\ (shared cross-platform look)
   ├─ Project_Brief.md                      (intake answers, links, decisions)
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

- One folder per platform: "Both" creates `<Project>_iOS\` and `<Project>_Android\`, each with its own full skill set.
- Group routing for new components and pages (Figma and skills): foundations -> ⭐Setup / Foundation_Skill; data entry -> ⭐Form Elements; actions and navigation -> ⭐Navigation; information display -> ⭐Data Display. Create a new `➜` page in the matching group when no page fits.
- Figma file names: `<Project> Design System` for the library, `<Project>` for screens. Page structure follows the platform Main Skill (Cover, ⭐Setup, ⭐ groups with ➜ topic pages).

---

## 11. Step 8 - Always finish with skills and the final audit

1. Run **audit-design-system** on the DS and on every screen built or relinked: 0 remote variables/styles, 0 raw values, 0 detached components, every property wired, contrast passing in Light and Dark. Fix and re-run until clean, then report the numbers.
2. Screenshot every variant (light and dark) into the skills' `references\screens\`.
3. Write / update the project skills:
   - `Foundation_Skill`: variables (names, values per mode, scopes, code syntax), styles, grids, icon rules, direction decisions from the intake.
   - One Component_Skill per group: every component with tier, variants, properties, exact use cases, when not to use, and dependencies.
   - `gaps.md` in each: anything left open.
   - The JSON knowledge base in `<Project>/data/`: export variables and run `python tools/build_tokens.py <Project>` (tokens.json), then write `component-registry.json`, `rules.json`, `screen-templates.json` (copy the Trianglz reference versions as the starting shape) and `docs/decisions.md`.
   - Check `tokens.json > recolor_readiness.ready` is true.
4. Update `Project_Brief.md` with the final state and links, and save the key facts to memory.
5. Reply to the user with the audit result, the skill paths and what is left.

---

## 12. Step 9 (optional) - Live Storybook

Runs when 0.7 = Yes, after the Components checkpoint is approved (or whenever the user asks later).
1. Load `Storybook_Design_System_Skill/SKILL.md` (`/storybook-design-system`).
2. Make sure `data/tokens.json` and `data/component-registry.json` reflect the live Figma file (token-extractor subagent if they need a resync).
3. Ask before installing any Node package; show the exact commands.
   - iOS / Android: build the Storybook as web (React + CSS) styled like the native components (Storybook skill, principle 7).
   - Meet the Storybook quality bar (principle 8): working components, sidebar navigation, Figma description and use case per component, every Figma property as a control, all states in Light and Dark. Write each component description in Figma and in Storybook during the build.
4. Build the Storybook in `<platform folder>/storybook/`, one per platform, with names that match Figma exactly.
5. Verify (build, parity check, visual check against Light/Dark screenshots), then offer to register the Storybook MCP for this folder.
6. Record the path, run command and MCP status in `Project_Brief.md`.
