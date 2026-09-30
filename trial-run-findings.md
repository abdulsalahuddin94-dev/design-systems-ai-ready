# Trial run findings (2026-09-30)

End-to-end trial of the workflow as a first-time user would get it (CLAUDE.md, then Design_System_Intake_Skill from Step 0).
Each entry: where it happened, what was unclear or broken, suggested fix.

## Findings

1. **Step 0 preflight: stale figma-console-mcp servers.** `figma_get_status` reported six other figma-console-mcp instances still running on ports 9223-9228 (some from the day before), so this session fell back to port 9229. It worked, but the Desktop Bridge plugin only talks to one port at a time, so a new user can easily end up with the plugin connected to a different session's server.
   Fix: in intake 0b, when `otherInstances` is not empty, tell the user in one line and show how to close old Claude sessions / kill stale `figma-console-mcp` node processes.

2. **First reply has two competing questions.** CLAUDE.md (and the SessionStart hook) require the Storybook question ("run / update from Figma / skip") in the first reply, while the intake says one question per message and starts with 0.1 project name. The Storybook question is also about the existing Trianglz Web Storybook, which means nothing to a new user starting their own project, and it overlaps with intake question 0.7.
   Fix: make the Storybook notice one informational line (no question) when the job is a new project, and let 0.7 carry the real Storybook question.

3. **"Update it from Figma" has no ready path.** Choosing it needs the Trianglz Web Figma file open with the Desktop Bridge plugin running, but neither the notice nor CLAUDE.md says so; the new user had only their own new file open. Storybook_Design_System_Skill section 5 is a one-line chain (token-extractor, tokens_to_css.py, parity) with no step list, no "which file must be open" check, and no note that the original template is read-only (reading is fine, writing is guarded).
   User feedback: the Storybook question should not come first at all; the user expects to be asked about the project first and about Storybook later in the flow (they stopped the Storybook for this run). This confirms finding 2: drop the first-reply Storybook question and rely on intake 0.7.
   Fix (update path): give "Update from Figma" its own short procedure in section 5: 1) confirm the source Figma file is open in the Desktop Bridge (by file key from memory/references.md), 2) token-extractor, 3) tokens_to_css.py, 4) storybook_stories.py, 5) storybook_parity.py, 6) build + visual check; and tell the user up front which file to open.

4. **Folder question comes before the platform is known.** Intake 0.3 asks for the local folder (default `<Root>\<Project>`) and says "record every answer in Project_Brief.md as you go", but the folder name depends on the platform (`<Project>/` Web, `<Project>_iOS/`, `<Project>_Android/`, `<Project>_Mobile/`), which is only asked in Step 1. So there is no right place to write the brief until after 1.1-1.4.
   Fix: move 0.3 after Step 1 (or make its default platform-aware), and say where answers live before the folder exists (e.g. keep them in the conversation and write the brief right after 0.3).

5. **0.2 does not use what preflight already saw.** The user answered "none" for Figma links, while preflight had just shown a connected file named "NEW PROJECT Design system". The intake has no step that reconciles the two (is the open file the future DS file, or just a scratch file?), so the question reads as if Claude knows nothing.
   Fix: in 0.2, mention the connected file by name and ask whether it is this project's DS file (and store its link), else continue with "none".

6. **No Project_Brief template.** The intake says to record every answer in `Project_Brief.md`, and section 10 lists the file, but there is no template anywhere in the repo (no project has one yet), so every session invents its own layout.
   Fix: add `Design_System_Intake_Skill/templates/Project_Brief.md` with one row per intake question plus the Intake Summary block.

7. **Folder answer given as an absolute path.** The user answered 0.3 with a full machine path (`D:\...\ClinicSoft`), while the rules say never write absolute paths into briefs (a hook blocks them). The skill does not say to convert the answer.
   Fix: in 0.3, say "store it relative to the Root (e.g. `ClinicSoft/`)".

8. **Dark only is offered but nothing downstream handles it.** Intake 0.4 offers "Dark only", yet the Main Skills, checkpoints ("show Light and Dark screenshots"), memory ("screenshot every variant in Light and Dark"), docs-page rule (Light/Dark frames on ➜ Colors), the Storybook quality bar ("all states in Light and Dark") and the contrast rules all assume two modes. No skill says what the single Semantic mode is named, or whether the checkpoints and audits then check Dark only.
   Web_Design_System_Skill also builds Light as the master and adds "dark preview frames" of instances next to each set (section 1), and lists Semantic modes as "Light / Dark" (section 3), neither of which fits a Dark-only system.
   Fix: add a "Single-mode systems" note to each Main Skill: one Semantic mode named after the answer (`Dark`), every Light/Dark requirement becomes "each mode the project has", and contrast is checked against the dark surfaces only.

9. **Font question comes before the platform too.** 0.6 "default" means Poppins, SF Pro or Roboto depending on the platform, which is only asked in Step 1, so the question has to list all three defaults and "default" cannot be resolved yet. Same root cause as finding 4.
   Fix: ask Step 1 (platform) right after 0.1/0.2, then folder, modes, RTL, fonts with platform-specific defaults.

10. **Audit reminder fires on a read-only call.** A read-only `figma_execute` (listing available Poppins styles during intake 0.6) made the Stop hook `audit_reminder.py` claim "Figma was changed in this session" and demand the full section 11 audit, though nothing was built yet.
   Fix: have the hook skip `figma_execute` calls whose code has no write APIs (create*/remove/set*/appendChild/`=` on node props), or only arm it for known write tools.

11. **ui-ux-pro-max output is landing-page shaped.** Intake 3.4 says "derive a style from the industry (use ui-ux-pro-max and Impeccable)", but `search.py --design-system` returns a landing-page pattern ("Horizontal Scroll Journey", CTA placement), and a font pairing (Figtree + Noto Sans) that overrides the font the user just chose in 0.6. Only the Style ("Accessible & Ethical"), the anti-patterns and the dark-palette hint were usable.
   Fix: in 3.4 say which parts to take from ui-ux-pro-max (style, anti-patterns, color mood) and that intake answers (fonts, modes, brand color) always win.

12. **Brand color contrast is not checked at intake.** `#299B48` with white text is 3.57:1 (fails 4.5:1), which decides how every filled button looks. The skill only checks contrast after building Semantics.
   Fix: at 3.3, run a quick contrast check of the brand color against white, black and the mode's base surface and show the result in the direction summary.

13. **Greenfield has no "which Figma file" step.** Brownfield types 1 and 2 ask the user to create `<Project> Design System`; Greenfield 3b-3d never says which file to build in. Here the user had an empty file named "NEW PROJECT Design system" open.
   Fix: add to 3d: "Use the connected empty file or ask the user to create '<Project> Design System'; rename it to match."

14. **Direction approval and Intake Summary are two back-to-back approvals.** 3.4 asks to approve the direction summary, and section 9 then asks "Is this correct?" for the Intake Summary. For a new user that is two yes/no questions in a row about the same plan.
   Fix: fold the direction into the Intake Summary and ask once.

15. **The new user did not recognise the Intake Summary as a question.** After the summary block they asked "what approval you waiting for". The summary reads like a report; the "Is this correct?" line at the end gets lost under a code block and extra notes.
   Fix: lead the summary message with the question ("Before I touch Figma, please confirm this plan: Yes, start / Change something"), then the block, and keep the notes after it to one line.

16. **Required Figma skills target a disconnected tool.** figma-use and figma-generate-library are written for the official `use_figma` tool (the official Figma MCP failed to connect here), while the work runs through figma-console `figma_execute`. Helpers those skills teach (`figma.createAutoLayout`, `node.set`, `node.query`) do not exist in figma-console and fail with "TypeError: not a function".
   Fix: add a short "Using these skills with figma-console" note to the Web/iOS/Android Main Skills: use figma_execute, plain `createFrame` + `layoutMode`, no helper APIs.

17. **figma-generate-library's page skeleton and ceremony conflict with the project layout.** It prescribes Cover, Getting Started, Foundations, Components pages and a "Phase N Checklist" post per phase; the project uses the Trianglz layout (⭐Setup, ⭐ groups, ➜ pages) and a thread status checklist.
   Fix: say in the Main Skills that the Trianglz page layout and the intake checkpoints override the generic skill's skeleton and reporting.

18. **`figma_export_tokens` returned 0 tokens** for a file with 200 variables (even after `figma_get_variables refreshCache`), so Fix on create step 1 could not run as written. Workaround: export through `figma_execute` into the same DTCG shape.
   Fix: ship that export snippet as `tools/export_variables.figma.js` and name it as the fallback in intake 7b and tools/README.

19. **build_tokens.py assumed one base step for every ramp.** A brand color that lands on step 600 was recorded with base 500, which breaks recolor. Fixed: `config.json > ramp.base_steps` per-ramp override (Trianglz output unchanged).

20. **No generator for a new project's ramps.** The tools only read exports; a Greenfield build has to hand-write the ramp math, Semantic mapping and contrast pre-check. Written for this trial as `ClinicSoft/data/source/generate_foundation.py`.
   Fix: move it to `tools/new_foundation.py <folder> --brand <hex> --modes Dark` and call it from intake 3d.

21. **Trianglz typography shrinks body text to 14px on iPad/Mobile.** Web skill copies "iPad/Mobile shrink from sm up", which conflicts with the 16px minimum body text that ui-ux-pro-max and the healthcare direction ask for. Kept 16px on every mode for ClinicSoft.
   Fix: make the Web skill's default keep xs-lg fixed across modes and compress only xl and up.

22. **better-icons `color` parameter corrupts Lucide SVGs.** Passing `color` injects `fill="#000000"` into stroke-only paths and circles, which would render filled shapes. Used the raw path data with `fill="none"` instead.
   Fix: in Main Skill section 5, say to fetch Lucide icons without the `color` parameter.

23. **The Figma file cannot be renamed from the plugin.** Intake says the file is named `<Project> Design System`, but figma_execute cannot rename a file; the user has to do it.
   Fix: add it to the user's to-do list at the Foundation checkpoint.

24. **ds-auditor cannot verify bindings.** Its tool list has no `figma_execute`, and the REST-based tools (styles, file data, parity) failed on an expired Figma token, so it could not read text style, icon stroke or frame padding bindings (3 checks "not verified"). The built-in `figma_audit_design_system_report` also reported "0 variables" for a file with 200. The builder had to close the gaps.
   Fix: give ds-auditor a read-only `figma_execute` (the hook can block write APIs) and ship a binding-check snippet; tell users in intake 0b that the Figma token must be valid for REST-based tools.
