# Fix on create

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load when a project starts from an existing file (3a, 3a-2, Scenario C) and at the last foundation step of every new build. Every `Ask (choice)` / `Ask (multi)` here also gets a "Back" option (`SKILL.md` section 0, Back on every menu).

## 7b. Fix on create (Abdul's rule: every problem found while setting up a project gets fixed)

Runs automatically, without asking, whenever a project starts from an existing file: a duplicated reference template (3a-2), an existing AI-ready DS (3a), and as the last foundation step of every new build (Scenario D branch b included). It never runs on a shared DS used in Scenario D branch a: that file is read only outside its editable page, and its problems go to the DS issues report (section 6a). Work only in the project's own copy, never in an original template.
1. Export the file's variables (figma-console `figma_export_tokens`, format dtcg) into `My Projects/<Project>/data/source/figma-variables.dtcg.json`. If it returns 0 tokens (seen for a file with 200 variables, even after `figma_get_variables refreshCache`), run `tools/export_variables.figma.js` with `figma_execute` instead and save its returned JSON to the same file (same DTCG shape). Copy `data/source/config.json` and `data/rules.json` from the matching reference folder (the project's `status.json > reference` entry, else the platform default in `references.json`) (update collection ids and names), and run `python tools/build_tokens.py "My Projects/<Project>"`. For a Web project, set `rules.json > components.required_states_interactive` to the Web Main Skill table (Pressed and Loading are required on Button only), and add the `action/*/border` pairs to `contrast_pairs` (Web skill section 3).
2. Run `python tools/fix_tokens.py "My Projects/<Project>"`. It builds `data/fixes/<date>-fix-plan.json` and a `.figma.js` script that:
   - normalizes hand-picked palette tones to true tones (Android, `known_fixes.normalize_tones`);
   - recomputes derived tokens (M3 state layers, surface tints) from their role colors;
   - re-points aliases that point to other libraries (`known_fixes.alias_fixes`);
   - fixes every failing contrast pair in `rules.json` by moving the Semantic alias to the nearest passing step of the same ramp (never raw hex);
   - renames bad variable and collection names (typos, double or trailing spaces, `??`, generic ` 2` suffixes, mixed case); renames keep every binding.
3. Apply the script with figma_execute in the project's DS file, re-export, and re-run `build_tokens.py` and `fix_tokens.py` until the plan is empty and `recolor_readiness.ready` is true.
4. Fix the component-level items listed in the plan's `needs_a_person` and in each `references/gaps.md` (missing states, `Property 1` / `Status4` names, `Mode=Light|Dark` variants, text glyph icons, unwired properties, missing text/instance-swap properties), lowest tier first, in the same file.
   - **➜ App Icon page:** if the file has none, or keeps a `➜ Favicon` page in another group (Web references), create ➜ App Icon in ⭐Setup per section 7h (`steps/app-icon.md`), moving any favicon art from the old page into its drop zone; the old page is removed from the project's copy only.
5. Run audit-design-system (or the ds-auditor agent) and screenshot the affected pages in Light and Dark.
6. Log every fix in `My Projects/<Project>/docs/decisions.md` and show the before/after summary at the Foundation checkpoint (section 8). The fixes are already applied at that point; the user reviews them, they are not asked for permission first.
