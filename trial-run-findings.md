# Trial run findings (2026-09-30)

End-to-end trial of the workflow as a first-time user would get it (CLAUDE.md, then Design_System_Intake_Skill from Step 0).
Each entry: where it happened, what was unclear or broken, suggested fix.

## Status (2026-09-30)

43 of 44 fixed in the Root workflow (intake, Main Skills, Storybook skill, project template, agents, hooks, tools); 1 skipped for Abdul's decision (42). Trianglz templates and ClinicSoft's Figma files were not touched.
New since the trial (Abdul, 2026-09-30): Design file audit after every screen build or change (intake 7d, Main Skills, AGENTS.md, ds-auditor screens mode).

## Findings

1. **Step 0 preflight: stale figma-console-mcp servers.** `figma_get_status` reported six other figma-console-mcp instances still running on ports 9223-9228 (some from the day before), so this session fell back to port 9229. It worked, but the Desktop Bridge plugin only talks to one port at a time, so a new user can easily end up with the plugin connected to a different session's server.
   Fix: in intake 0b, when `otherInstances` is not empty, tell the user in one line and show how to close old Claude sessions / kill stale `figma-console-mcp` node processes.
   Status: **Fixed (2026-09-30)** Intake 0b step 3: stale `otherInstances` note with cleanup steps (the user runs them).

2. **First reply has two competing questions.** CLAUDE.md (and the SessionStart hook) require the Storybook question ("run / update from Figma / skip") in the first reply, while the intake says one question per message and starts with 0.1 project name. The Storybook question is also about the existing Trianglz Web Storybook, which means nothing to a new user starting their own project, and it overlaps with intake question 0.7.
   Fix: make the Storybook notice one informational line (no question) when the job is a new project, and let 0.7 carry the real Storybook question.
   Status: **Fixed (2026-09-30)** First reply only mentions Storybook as information: `storybook_notice.py`, CLAUDE.md, AGENTS.md, GEMINI.md, `.cursor/rules/storybook.mdc`, `.github/copilot-instructions.md`, README, memory/decisions.md; intake section 0 rule. Real question stays at 0.7.

3. **"Update it from Figma" has no ready path.** Choosing it needs the Trianglz Web Figma file open with the Desktop Bridge plugin running, but neither the notice nor CLAUDE.md says so; the new user had only their own new file open. Storybook_Design_System_Skill section 5 is a one-line chain (token-extractor, tokens_to_css.py, parity) with no step list, no "which file must be open" check, and no note that the original template is read-only (reading is fine, writing is guarded).
   User feedback: the Storybook question should not come first at all; the user expects to be asked about the project first and about Storybook later in the flow (they stopped the Storybook for this run). This confirms finding 2: drop the first-reply Storybook question and rely on intake 0.7.
   Fix (update path): give "Update from Figma" its own short procedure in section 5: 1) confirm the source Figma file is open in the Desktop Bridge (by file key from memory/references.md), 2) token-extractor, 3) tokens_to_css.py, 4) storybook_stories.py, 5) storybook_parity.py, 6) build + visual check; and tell the user up front which file to open.
   Status: **Fixed (2026-09-30)** Storybook_Design_System_Skill section 5 has an 'Update from Figma' procedure (open the DS file first, token-extractor, tokens_to_css, storybook_stories, parity, build + visual check, mark synced); CLAUDE.md and AGENTS.md point to it.

4. **Folder question comes before the platform is known.** Intake 0.3 asks for the local folder (default `<Root>\<Project>`) and says "record every answer in Project_Brief.md as you go", but the folder name depends on the platform (`<Project>/` Web, `<Project>_iOS/`, `<Project>_Android/`, `<Project>_Mobile/`), which is only asked in Step 1. So there is no right place to write the brief until after 1.1-1.4.
   Fix: move 0.3 after Step 1 (or make its default platform-aware), and say where answers live before the folder exists (e.g. keep them in the conversation and write the brief right after 0.3).
   Status: **Fixed (2026-09-30)** Intake order is now 0.1, 0.2, platform 1.1-1.4, then 0.3-0.8; 0.3's default carries the platform suffix and the brief is written right after 0.3.

5. **0.2 does not use what preflight already saw.** The user answered "none" for Figma links, while preflight had just shown a connected file named "NEW PROJECT Design system". The intake has no step that reconciles the two (is the open file the future DS file, or just a scratch file?), so the question reads as if Claude knows nothing.
   Fix: in 0.2, mention the connected file by name and ask whether it is this project's DS file (and store its link), else continue with "none".
   Status: **Fixed (2026-09-30)** Intake 0.2 names the connected file from preflight and asks whether it is the project's DS file.

6. **No Project_Brief template.** The intake says to record every answer in `Project_Brief.md`, and section 10 lists the file, but there is no template anywhere in the repo (no project has one yet), so every session invents its own layout.
   Fix: add `Design_System_Intake_Skill/templates/Project_Brief.md` with one row per intake question plus the Intake Summary block.
   Status: **Fixed (2026-09-30)** `My Projects/_Project_Template/Project_Brief.md` now has a row per intake question (incl. 1.2-1.4, 2.2, 3.x, 0.8), direction, the Intake Summary block, checkpoints and a user to-do list.

7. **Folder answer given as an absolute path.** The user answered 0.3 with a full machine path (`D:\...\ClinicSoft`), while the rules say never write absolute paths into briefs (a hook blocks them). The skill does not say to convert the answer.
   Fix: in 0.3, say "store it relative to the Root (e.g. `ClinicSoft/`)".
   Status: **Fixed (2026-09-30)** Intake 0.3: store the folder relative to the Root even when the user gives a full path.

8. **Dark only is offered but nothing downstream handles it.** Intake 0.4 offers "Dark only", yet the Main Skills, checkpoints ("show Light and Dark screenshots"), memory ("screenshot every variant in Light and Dark"), docs-page rule (Light/Dark frames on ➜ Colors), the Storybook quality bar ("all states in Light and Dark") and the contrast rules all assume two modes. No skill says what the single Semantic mode is named, or whether the checkpoints and audits then check Dark only.
   Web_Design_System_Skill also builds Light as the master and adds "dark preview frames" of instances next to each set (section 1), and lists Semantic modes as "Light / Dark" (section 3), neither of which fits a Dark-only system.
   Fix: add a "Single-mode systems" note to each Main Skill: one Semantic mode named after the answer (`Dark`), every Light/Dark requirement becomes "each mode the project has", and contrast is checked against the dark surfaces only.
   Status: **Fixed (2026-09-30)** 'Single-mode systems' note in the Web, iOS and Android Main Skills (one Semantic mode named after the answer; every Light/Dark rule means each mode the project has); intake 0.4, checkpoints, final audit and the Storybook quality bar say 'each mode'.

9. **Font question comes before the platform too.** 0.6 "default" means Poppins, SF Pro or Roboto depending on the platform, which is only asked in Step 1, so the question has to list all three defaults and "default" cannot be resolved yet. Same root cause as finding 4.
   Fix: ask Step 1 (platform) right after 0.1/0.2, then folder, modes, RTL, fonts with platform-specific defaults.
   Status: **Fixed (2026-09-30)** Same reorder as 4; 0.6 names the one default for the chosen platform.

10. **Audit reminder fires on a read-only call.** A read-only `figma_execute` (listing available Poppins styles during intake 0.6) made the Stop hook `audit_reminder.py` claim "Figma was changed in this session" and demand the full section 11 audit, though nothing was built yet.
   Fix: have the hook skip `figma_execute` calls whose code has no write APIs (create*/remove/set*/appendChild/`=` on node props), or only arm it for known write tools.
   Status: **Fixed (2026-09-30)** `audit_reminder.py` no longer arms on `figma_execute` / `use_figma` scripts without write APIs, nor on Agent calls other than ds-auditor.

11. **ui-ux-pro-max output is landing-page shaped.** Intake 3.4 says "derive a style from the industry (use ui-ux-pro-max and Impeccable)", but `search.py --design-system` returns a landing-page pattern ("Horizontal Scroll Journey", CTA placement), and a font pairing (Figtree + Noto Sans) that overrides the font the user just chose in 0.6. Only the Style ("Accessible & Ethical"), the anti-patterns and the dark-palette hint were usable.
   Fix: in 3.4 say which parts to take from ui-ux-pro-max (style, anti-patterns, color mood) and that intake answers (fonts, modes, brand color) always win.
   Status: **Fixed (2026-09-30)** Intake 3.4: take only style, anti-patterns and color mood from ui-ux-pro-max; intake answers (fonts, modes, brand color, RTL) always win.

12. **Brand color contrast is not checked at intake.** `#299B48` with white text is 3.57:1 (fails 4.5:1), which decides how every filled button looks. The skill only checks contrast after building Semantics.
   Fix: at 3.3, run a quick contrast check of the brand color against white, black and the mode's base surface and show the result in the direction summary.
   Status: **Fixed (2026-09-30)** Intake 3b brand contrast pre-check (`tools/new_foundation.py --check-only`), result goes into the summary's Direction line.

13. **Greenfield has no "which Figma file" step.** Brownfield types 1 and 2 ask the user to create `<Project> Design System`; Greenfield 3b-3d never says which file to build in. Here the user had an empty file named "NEW PROJECT Design system" open.
   Fix: add to 3d: "Use the connected empty file or ask the user to create '<Project> Design System'; rename it to match."
   Status: **Fixed (2026-09-30)** Intake 3d 'Which Figma file' step (use the confirmed empty connected file or ask for '<Project> Design System').

14. **Direction approval and Intake Summary are two back-to-back approvals.** 3.4 asks to approve the direction summary, and section 9 then asks "Is this correct?" for the Intake Summary. For a new user that is two yes/no questions in a row about the same plan.
   Fix: fold the direction into the Intake Summary and ask once.
   Status: **Fixed (2026-09-30)** Direction is folded into the Intake Summary (new Direction line); one approval.

15. **The new user did not recognise the Intake Summary as a question.** After the summary block they asked "what approval you waiting for". The summary reads like a report; the "Is this correct?" line at the end gets lost under a code block and extra notes.
   Fix: lead the summary message with the question ("Before I touch Figma, please confirm this plan: Yes, start / Change something"), then the block, and keep the notes after it to one line.
   Status: **Fixed (2026-09-30)** Intake section 9: the message leads with 'Before I touch Figma, please confirm this plan: Yes, start / Change something', then the block, at most one line of notes.

16. **Required Figma skills target a disconnected tool.** figma-use and figma-generate-library are written for the official `use_figma` tool (the official Figma MCP failed to connect here), while the work runs through figma-console `figma_execute`. Helpers those skills teach (`figma.createAutoLayout`, `node.set`, `node.query`) do not exist in figma-console and fail with "TypeError: not a function".
   Fix: add a short "Using these skills with figma-console" note to the Web/iOS/Android Main Skills: use figma_execute, plain `createFrame` + `layoutMode`, no helper APIs.
   Status: **Fixed (2026-09-30)** 'Tools and generic skills (figma-console)' note at the top of the Web, iOS and Android Main Skills.

17. **figma-generate-library's page skeleton and ceremony conflict with the project layout.** It prescribes Cover, Getting Started, Foundations, Components pages and a "Phase N Checklist" post per phase; the project uses the Trianglz layout (⭐Setup, ⭐ groups, ➜ pages) and a thread status checklist.
   Fix: say in the Main Skills that the Trianglz page layout and the intake checkpoints override the generic skill's skeleton and reporting.
   Status: **Fixed (2026-09-30)** Same note: Trianglz page layout and intake checkpoints override figma-generate-library's skeleton and checklist posts.

18. **`figma_export_tokens` returned 0 tokens** for a file with 200 variables (even after `figma_get_variables refreshCache`), so Fix on create step 1 could not run as written. Workaround: export through `figma_execute` into the same DTCG shape.
   Fix: ship that export snippet as `tools/export_variables.figma.js` and name it as the fallback in intake 7b and tools/README.
   Status: **Fixed (2026-09-30)** `tools/export_variables.figma.js` (same DTCG shape, tested through build_tokens.py with a mock file); named in intake 7b, tools/README, token-extractor.

19. **build_tokens.py assumed one base step for every ramp.** A brand color that lands on step 600 was recorded with base 500, which breaks recolor. Fixed: `config.json > ramp.base_steps` per-ramp override (Trianglz output unchanged).
   Status: **Fixed (2026-09-30)** Already fixed during the trial (`config.json > ramp.base_steps`).

20. **No generator for a new project's ramps.** The tools only read exports; a Greenfield build has to hand-write the ramp math, Semantic mapping and contrast pre-check. Written for this trial as `ClinicSoft/data/source/generate_foundation.py`.
   Fix: move it to `tools/new_foundation.py <folder> --brand <hex> --modes Dark` and call it from intake 3d.
   Status: **Fixed (2026-09-30)** `tools/new_foundation.py <folder> --brand <hex> --modes ...` (Light and Dark mappings, single mode, contrast + paired-token checks); called from intake 3d. ClinicSoft's own copy left as is.

21. **Trianglz typography shrinks body text to 14px on iPad/Mobile.** Web skill copies "iPad/Mobile shrink from sm up", which conflicts with the 16px minimum body text that ui-ux-pro-max and the healthcare direction ask for. Kept 16px on every mode for ClinicSoft.
   Fix: make the Web skill's default keep xs-lg fixed across modes and compress only xl and up.
   Status: **Fixed (2026-09-30)** Web skill section 3 Typography: xs-lg fixed across modes, only xl and up compress.

22. **better-icons `color` parameter corrupts Lucide SVGs.** Passing `color` injects `fill="#000000"` into stroke-only paths and circles, which would render filled shapes. Used the raw path data with `fill="none"` instead.
   Fix: in Main Skill section 5, say to fetch Lucide icons without the `color` parameter.
   Status: **Fixed (2026-09-30)** Web skill section 5: fetch Lucide without the `color` parameter.

23. **The Figma file cannot be renamed from the plugin.** Intake says the file is named `<Project> Design System`, but figma_execute cannot rename a file; the user has to do it.
   Fix: add it to the user's to-do list at the Foundation checkpoint.
   Status: **Fixed (2026-09-30)** Intake 3d and checkpoint 1: 'rename the file' goes on the user's to-do list (template brief has a To-do section).

24. **ds-auditor cannot verify bindings.** Its tool list has no `figma_execute`, and the REST-based tools (styles, file data, parity) failed on an expired Figma token, so it could not read text style, icon stroke or frame padding bindings (3 checks "not verified"). The built-in `figma_audit_design_system_report` also reported "0 variables" for a file with 200. The builder had to close the gaps.
   Fix: give ds-auditor a read-only `figma_execute` (the hook can block write APIs) and ship a binding-check snippet; tell users in intake 0b that the Figma token must be valid for REST-based tools.
   Status: **Fixed (2026-09-30)** ds-auditor gets read-only `figma_execute` + `figma_navigate`; `guard_figma.py` denies write APIs in scripts marked `// read-only` or run by read-only agents; binding check `tools/check_bindings.figma.js`; intake 0b explains the token requirement.

25. **`focus-ring-offset` does not render as specified.** The Web skill defines it as spread drop shadows, but Figma only draws spread on a frame that clips content and has a fill. Button Focus variants needed `clipsContent = true`, and Outline/Link Focus needed a `color/bg/primary` fill, before the ring showed.
   Fix: add this to Web skill section 4 (focus-ring-offset) and to the Button recipe.
   Status: **Fixed (2026-09-30)** Web skill section 4: focus-ring-offset needs `clipsContent = true` and a fill (Outline/Link Focus get `color/bg/primary`).

26. **The Button variant matrix is 600 variants as written.** Web skill section 6 says Button = Type (5) × Size (5) × Icon (None/Left/Right/Only) × State (6), while section 6 also says "keep variant matrices sane" and figma-generate-library caps matrices at ~30. Built as Type × Size × State (150) with Show Leading/Trailing Icon booleans and swaps, and icon-only as a separate Icon Button.
   Fix: state this split in the required inventory table.
   Status: **Fixed (2026-09-30)** Web required inventory: Button = Type x Size x State (150) with icon booleans + swaps; separate Icon Button.

27. **Text and swap property defaults overwrite per-variant content.** Binding a TEXT or INSTANCE_SWAP property resets every variant to the property default, so a variant-specific label or icon (Menu Item Danger "Delete", Badge status words, Danger icon) is lost. The skills do not say how to handle it.
   Fix: in the Web skill component conventions, say to pick defaults that suit all variants, or leave a variant-specific layer unbound (like the Button Loading spinner) and document it.
   Status: **Fixed (2026-09-30)** Web skill section 6: property defaults overwrite variant content; pick defaults that suit all variants or leave the layer unbound and document it.

28. **No Photo avatar without an image source.** The Web inventory requires Avatar Type Photo, but there is no approved image asset or image tool step in the workflow, so only Initials and Icon were built.
   Fix: add a placeholder photo asset to the Root (licensed) or tell the builder to ask the user for one at the Components step.
   Status: **Fixed (2026-09-30)** No licensed photo in the Root, so the intake (section 8) asks the user for a sample photo at the Components step; the Web inventory lists Photo as open until then.

29. **Sidebar needs a Nav Item that the inventory does not list.** Web skill section 6 lists Sidebar as an organism but no Nav Item atom/molecule, and no ⭐Navigation page for Top Bar/Sidebar. Following the golden rule, Nav Item was built first and a new page `➜ Navigation Bars` was added.
   Fix: add Nav Item (molecule: Icon + label + Badge) and a `➜ Navigation Bars` page to the Web skill file structure and inventory.
   Status: **Fixed (2026-09-30)** Web skill: Nav Item molecule in the inventory, `➜ Navigation Bars` page under ⭐Navigation; Top bar and Sidebar nest it.

30. **`resize()` silently switches auto-layout sizing to FIXED.** Several components set `primaryAxisSizingMode/counterAxisSizingMode = 'AUTO'` and then called `resize()`, which made Toast/Modal heights fixed and cut text. Had to reset sizing to AUTO afterwards. figma-use mentions it (rule 12c), but the project's component recipes do not.
   Fix: add to the Web skill build notes: call resize() first, then set sizing modes.
   Status: **Fixed (2026-09-30)** Web skill 'Build notes (Plugin API)': call resize() first, then set sizing modes (short version in iOS/Android notes).

31. **Cloning a variant inside a set drops its component property references.** New states added by cloning (Upload Focus, Select Success...) lost their Label/Digit links silently; the dead-property scan still showed 0 because other variants used the property. Needed a per-variant coverage check and a re-link pass.
   Fix: add a "property coverage per variant" check to ds-auditor and a note in the Web skill: after cloning a variant, re-apply `componentPropertyReferences`.
   Status: **Fixed (2026-09-30)** ds-auditor checklist item 6 counts property coverage per variant; `tools/check_bindings.figma.js` reports it; Web skill note to re-apply `componentPropertyReferences` after cloning.

32. **Menu placement rules conflict.** Web skill section 1 puts Menu on the ⭐Form Elements page "Input Fields and Dropdown", while memory/decisions.md (group placement) says actions go to ⭐Navigation. Followed Abdul's rule: new page `➜ Menus` under ⭐Navigation.
   Fix: update the Web skill page list to match decisions.md.
   Status: **Fixed (2026-09-30)** Web skill page list: Menu moved to a new `➜ Menus` page under ⭐Navigation (matches decisions.md).

33. **Pressed state rule conflict.** rules.json says Pressed is required on every interactive component; Web skill section 6 only requires it for Button. Kept the Web skill.
   Fix: align rules.json `required_states_interactive` with the Web skill table.
   Status: **Fixed (2026-09-30)** Web skill states rule (Pressed/Loading on Button only) and intake 7b step 1: set the project's copied `rules.json > required_states_interactive` to match. `Trianglz/data/rules.json` itself was not edited (Trianglz references stay untouched).

34. **The components audit found real defects the build scan missed** (invisible Hover because border/input and border/strong aliased the same gray/500, a faint Outline border at 2.66:1, missing states, unexposed text). Foundation-level token choices only showed up at component level.
   Fix: in generate/foundation checks, require that paired state tokens (input vs strong, default vs hover) alias different steps, and add action/*/border pairs to contrast_pairs by default.
   Status: **Fixed (2026-09-30)** Web skill section 3: paired state tokens must alias different steps, `action/*/border` pairs always in contrast_pairs; `tools/new_foundation.py` checks both.

35. **Greenfield never asks about screens.** Section 8 says Greenfield DS-only paths use checkpoints 1 and 2 "unless the user asks for screens", but no intake question offers screens, so a new user never learns the Screens phase exists. Asked the user directly after the Components checkpoint.
   Fix: add intake question 0.8 "Do you also want example screens built from the DS (e.g. login, list, detail)? Yes after components / No".
   Status: **Fixed (2026-09-30)** New intake question 0.8 (example screens yes/no), in the brief template and the Intake Summary.

36. **Storybook "Later" has no end.** The brief records "Later" and the intake asks again after Components; after a second "Later" there is no rule for when to ask next (the SessionStart hook only lists projects with unsynced changelog entries).
   Fix: record "Later" with a trigger (e.g. "ask when screens are approved" or "next session") and have the hook mention projects with Storybook = Later.
   Status: **Fixed (2026-09-30)** 0.7 Later gets a trigger (`status.json > storybook_plan` / `storybook_ask_at`, moving forward on each Later); `project_status.py` and the SessionStart hook list projects whose plan is Later.

37. **Screens in a separate Design file need a published library, and nothing in Greenfield says so up front.** The user opened a new Design file for the Login screen; `teamLibrary` showed no libraries because the DS had never been published (publishing cannot be done from the plugin). The rule now in CLAUDE.md (status.json > figma, ask to publish) covered it, but the intake Greenfield path and the Components checkpoint never mention publishing, so the user only learns it when screens start.
   Fix: at the Components checkpoint, ask the user to publish the library (and save `last_publish` in status.json); in the screens question, say screens go in a Design file that must enable the library.
   Status: **Fixed (2026-09-30)** Components checkpoint asks to publish the library (and records `last_publish`) when screens or Storybook follow; 0.8 says screens go in a Design file that must enable the library.

38. **status.json design_files has no helper.** Registering the Design file meant hand-editing JSON (name, url, file_key, role, library flags); `project_status.py` only reads it.
   Fix: add `python tools/project_status.py <folder> --add-design-file <url> [--name ...]`.
   Status: **Fixed (2026-09-30)** `python tools/project_status.py <folder> --add-design-file <url> --name ... [--role] [--content]` (tested; updates by file key, no duplicates).

39. **Exports hang in a Figma file that is not the visible tab.** With both the DS file and the Design file connected, every `exportAsync` / `figma_capture_screenshot` in the Design file timed out (even a single text node), while structural reads worked. Screens could not be screenshot-verified until the user brought that tab to the front.
   Update: the real cause was the Desktop Bridge "active file", which follows the user's focus between connected files, so node ids from one file were looked up in the other. `figma_navigate` with `lock: true` pinned the Design file and screenshots worked again.
   Fix: whenever two files are connected, pin the target with `figma_navigate(lock: true)` before any write or screenshot, and note it in intake 7c.
   Status: **Fixed (2026-09-30)** Intake 7c step 6: pin the target with `figma_navigate(lock: true)` whenever two files are connected; also in ds-auditor and the Storybook update procedure.

40. **docs-writer died on a rate limit mid-run** and left the skills half-written (Foundation, Form Elements, Navigation done; Data Display, registry, screen templates missing), with no marker of what was finished. Resumed it with SendMessage.
   Fix: have docs-writer write a `data/docs-progress.json` checklist as it goes so a resumed run (or a new session) knows what is left.
   Status: **Fixed (2026-09-30)** docs-writer keeps `data/docs-progress.json` and resumes from the first `todo` item; intake section 11 mentions it.

41. **Screen-size rule was missing.** Abdul added it during the trial: screens are always Mobile 375 and Desktop 1440; Brownfield keeps the sizes of designed screens, but screenshots do not count. Added as Design_System_Intake_Skill section 7d and to memory/decisions.md. The Login was built at 1440 and a 375 Mobile version was added.
   Status: **Fixed (2026-09-30)** Already added during the trial (intake section 7d, memory/decisions.md).

42. **Radio vs Select option count conflict.** Radio's description allows groups of 2 to 6, Select / Dropdown's says use Radio for 2 to 5 (found by docs-writer). Needs one number in both Figma descriptions and the skills.
   Status: **Skipped (2026-09-30)** Needs Abdul's decision (Radio group limit vs Select: 5 or 6 options). Asked in the thread; the number then goes into both Figma descriptions and the skills.

43. **Both screenshot causes are real.** After pinning the target (finding 39), captures still timed out once the user moved to another Figma tab. Exports need the pinned file AND that file visible in Figma. The final ds-auditor also could not capture live and had to use saved PNGs.
   Fix: in the screens step, ask the user once to keep the Design file as the front tab until the Screens checkpoint.
   Status: **Fixed (2026-09-30)** Intake 7c step 7: ask once to keep the Design file as the front tab until the Screens checkpoint; retry after bringing it to the front.

44. **No Divider component.** The Login "or" divider was drawn by hand; the Web inventory has no Divider atom, so the final audit flagged it and it was removed. Adding a component now would need a DS change and a new publish.
   Fix: add Divider (Horizontal / Vertical, with optional label) to the Web required inventory.
   Status: **Fixed (2026-09-30)** Web required inventory: Divider atom (Horizontal / Vertical, optional label) and a `➜ Dividers` page under ⭐Data Display.
