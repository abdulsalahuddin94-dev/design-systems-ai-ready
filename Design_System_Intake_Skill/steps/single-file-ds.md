# Scenario C with the DS inside the Design file (single file)

Part of `Design_System_Intake_Skill` (sections keep their original numbers; the map is in `SKILL.md` section 0c). Load when 2.3 = "Inside the Design file", together with `brownfield-3-scenario-c.md`, `figma-files.md`, `fix-on-create.md` and `screens.md`.

## 7g. One Figma file holds both the DS and the screens (Abdul, 2026-10-02)

Some Brownfield files keep their variables, styles and components next to the screens, with no separate library. This is still Scenario C (section 7); only the publish steps and the file roles differ. The path is chosen **per project** (2.4) and recorded in `status.json > figma.layout`.

### Before anything
1. Register the file once in `status.json > figma` as both `design_system` and `design_files[0]` (same url and `file_key`), set `figma.layout` to `single-file` and the design file's `library_updates_accepted` to `null` (not applicable).
2. Ask Abdul to save a version in the Figma history named `Before AI-Ready` (File > Save to version history), then Ask (choice): "Is the version saved?" "Done, saved" / "Not yet". Nothing is changed before it exists; it is the rollback point.
3. **DS pages vs screen pages.** List every page and Ask (multi): "Which pages hold the design system (foundations, components, docs)?" one option per page (guess first: ⭐Setup, ⭐ groups, pages named Components, Foundations, Styles, Tokens, Icons); more than 4 pages: several calls. Save the answer in `status.json > figma.ds_pages` (page names). Every other page is a screen page.
4. Run Scenario C step 1 (Variable Map) as written, with one change: the "Used in" column is split into **DS pages** (which component > layer > property) and **screen pages** (how many layers on which screens). The map is approved before 2.4 is asked, because it shows how much the screens depend on each variable.
5. Count the local components used on screen pages that are **not** on a DS page (copies, one-off components). They are listed in the Variable Map summary as `needs decision`: move to a DS page, replace with an existing DS component, or keep as a screen-only group.

### 2.4 Which path
Ask (choice): "The DS lives inside the Design file. How should I handle it?" with the recommended option first:
- "Split into a library (Recommended)" (description: this file stays the DS file, the screens move to a new Design file as library instances; Publish, Accept updates and the auditor work as usual; screen links, comments and Dev Mode notes do not move)
- "Keep it in one file" (description: no Publish; a history version replaces it; every DS change reaches the screens at once and no other file can use this DS)

Recommend "Keep it in one file" instead only when the project has one small product, no other Design file will ever use the DS and Abdul wants to keep the screen links. Record the answer in `Project_Brief.md` and `docs/decisions.md`.

### Path 1: keep the DS in the same file (`layout: single-file`)
Scenario C runs in full with these changes:
- **Publish and Accept updates (7c) do not apply.** Wherever a step says "publish" or "Accept updates", save a Figma version instead (named after the step, e.g. `DS fixes applied`, `Screens fixed: Home`) and log `Version saved: <name>` in `CHANGELOG.md` instead of `Library published`.
- **The file check (7c) is the same check** (file key, or the exact name with FigCli); it is one file for both roles. DS work writes only on `ds_pages`; screen work writes only on the other pages.
- **Step 2 (DS fixes) lands on the screens at once.** Safe fixes stay Fix on create. For every approval fix (values, aliases, contrast, scopes of medium/low confidence, merges, deletes), list the screens that use it (from the Variable Map) and attach a before/after capture of one affected screen per fix in the Ask (multi).
- **Step 4 (raw values) and the alpha rule do not change.** A new Primitive + Semantic pair is added after approval and bound right away (no publish wait).
- **Step 5:** new components are built on a DS page only, never on a screen page; screens use instances of the DS-page components.
- **Audit:** ds-auditor `screens` mode treats components and variables defined on `ds_pages` as the DS (target 0 local components outside `ds_pages`, 0 raw values, 0 detached instances).
- **Screen fidelity (7f) does not change** (spec, real content, one section per script, side-by-side capture up to 3 rounds, `Ready for review`).
- **Storybook** reads the components on `ds_pages` only.

What breaks or is risky in path 1:
- A component or variable change reaches every screen immediately, with no Accept updates review.
- No other Design file can use this DS; adding one later means running path 2.
- The file grows heavy, and captures and audits slow down.
- The DS has no version history of its own; versions cover the whole file.

### Path 2: split into a library (`layout: separate`, migration in steps)
This file stays the **DS file**, so component keys and variable ids do not change; the screens move to a new Design file. Run it after the Variable Map is approved and before Scenario C step 2.
1. Ask Abdul to save a version named `Before split` (Ask (choice): "Done, saved" / "Not yet").
2. Resolve the `needs decision` local components from "Before anything" step 5: each one moved to a DS page or replaced, as Abdul decided.
3. Ask Abdul to **publish** this file as a library (rename it to `<Project> Design System` first if it has another name; a plugin cannot rename files). Ask (choice): "Is it published?" "Done, published" / "Not yet". Set `design_system.last_publish`.
4. Ask Abdul to create a new Design file named `<Project>`, enable the library in it (Assets > Libraries) and share its link (typed). Register it with `python tools/project_status.py "<folder>" --add-design-file <url> --name "<Project>"`; set `figma.layout` to `separate` and clear `figma.ds_pages` once the split is done.
5. **Trial screen.** Abdul copies one screen from the old file and pastes it into the new Design file (copy/paste between files is a user action in Figma Desktop). With the library published, its instances paste as library instances and its bound variables and styles as library ones. Run ds-auditor `screens` mode on that screen: 0 local components, 0 local variables, 0 local styles, and a side-by-side capture against the original frame with no differences.
6. **Fallback, only for what pasted as local:** paste `tools/split_library.figma.js` into `figma_execute` on the new Design file, run it with `DRY_RUN = true` first and show its counts, then run it for real after Abdul's Ask (choice): "Swap and remap now?" "Swap and remap (Recommended)" / "Stop". It swaps each local instance for the library component with the same name (text, boolean and instance-swap overrides kept), rebinds local variables and styles to the library ones with the same name, and moves explicit variable modes (Light / Dark) on frames to the library collection. Anything with no match is listed, never guessed.
7. Repeat 5-6 for the remaining screens in batches Abdul chooses (all screens of a flow together keeps their prototype links), with the audit and side-by-side after each batch.
8. When every screen passes, Ask (choice): "All screens moved and checked. Remove the old screen pages from the DS file?" "I will remove them (Recommended)" (description: you delete the pages yourself in Figma; I check the file afterwards) / "Keep them for now". Claude never deletes them.
9. Continue Scenario C from step 2 with the normal Publish and Accept updates (section 7c).

What breaks or is risky in path 2:
- **Screen links change** (new file): links sent to developers, Jira or docs need updating.
- **Comments and Dev Mode annotations and statuses** stay in the old file.
- **Prototype links** survive only between screens pasted together; links to frames left behind break.
- **Overrides** can be lost in the fallback swap where layer names differ between a copy and its main component; the script lists those layers.
- **Instance swap preferred values** that point to local components must be reset to the library ones.
- **The reverse split** (this file stays the Design file and the DS moves to a new file) needs a swap and remap of every instance and variable. It is not offered; if Abdul asks for it, warn that it is the riskier direction and run the fallback script on every screen.
