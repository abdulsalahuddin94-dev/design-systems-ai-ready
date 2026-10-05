---
name: storybook-design-system
description: Generates a living Storybook for a finished Figma design system (Web, iOS or Android) so developers can browse every component, try its variants and properties with controls, read its use cases and jump back to Figma. Tokens come from the Figma variables, one story file per component set, controls mirror Figma properties with exactly the same names, and the Storybook MCP addon lets AI agents query it. Documentation only, not production code. Load after the Components checkpoint is approved (or for any existing DS folder with data/ files).
---

# Storybook Design System (Main Skill)

Root: the folder that contains `CLAUDE.md`. All paths are relative to it.
Toolkit: **Claude -> MCP -> Figma + Storybook + GitHub.** Figma is the source of truth; Storybook is the live, browsable documentation that developers and AI agents read; GitHub hosts it when the user asks.

---

## 1. Principles (non-negotiable)

1. **Documentation, not production code.** Components are faithful visual replicas for browsing and trying. No business logic, no data fetching, no app routing.
2. **Names match Figma exactly.** Story titles, component names, variant names and values, property names, and token names are copied from Figma character for character (case, spaces, slashes). Never rename to "clean" code style. Where code cannot hold a character (CSS variable names), the mapping is mechanical and shown next to the Figma name in the docs.
3. **Tokens only.** Every color, space, radius, font value and shadow in a component comes from the generated token CSS. Zero raw hex or px in component styles.
4. **One platform per Storybook.** Web, iOS and Android each get their own Storybook inside their own folder. Nothing shared or merged.
5. **Default stack for every platform: React + Vite + TypeScript + Storybook (latest).** Mobile components are React components styled to look like their iOS / Android counterparts, shown inside a device frame.
6. **Never install without asking.** Show the exact packages and commands, then Ask (choice) (AskUserQuestion, Intake section 0): "Yes, install" / "Not now", before `npm create`, `npm install` or `npx storybook add`.
7. **iOS and Android projects get a web Storybook (for now).** Every new iOS or Android design system gets its own Storybook rendered as web: React + CSS components styled to look like the native iOS (HIG) or Android (Material 3) components, in a device frame, built from that platform's own tokens. Same setup and quality bar as Web. This is the interim choice until a native Storybook (SwiftUI / Compose) is decided; it applies to future projects, not to the Trianglz reference folders.
8. **Quality bar for every new Storybook.**
   - Components really work, not just look right: typing, checking, toggling, opening, closing, selecting and dismissing all behave.
   - The left sidebar navigates Foundations and every component group, in the same order as the Figma ⭐ groups.
   - Each component page shows its Figma component description and its use cases (when to use, when not to).
   - Every property in Figma's right panel (variants, booleans, text, instance swaps) is a control with the same name and the Figma default.
   - Every variant and state can be seen in each mode the project has (Light and Dark, or its single mode; an "All variants" story plus one story per state).
   - The component description is always written during the build: in Figma (the component's description / Component documentation) and in Storybook, with the same text.

---

## 2. Inputs

What to update: the project's `CHANGELOG.md` entries marked `Storybook synced: no` (list them with `python tools/project_status.py`). After the update is verified, run `python tools/project_status.py "<platform folder>" --mark-synced`.

From the platform folder (`My Projects/<Project>/`, `<Project>_iOS/`, `<Project>_Android/`, or a reference folder from `references.json`):
- `data/tokens.json`: every variable with its Figma name (`<Collection>::<name>`), per-mode values and aliases.
- `data/component-registry.json`: components with group, page, tier, variants, properties, use, nests; text and effect styles; icons.
- `data/rules.json`: contrast, touch targets, focus, disabled opacity.
- `Component_Skills/*/references/components.md` and `screens/`: exact use cases and Light/Dark screenshots for visual matching.
- The Figma file link (from `Project_Brief.md` or `References.md`).

If `data/` says `needs_resync: true` and the Figma file is open in the Desktop Bridge, run the **token-extractor** subagent first so the Storybook is built from live names.

---

## 3. Output layout

Reference build: the default Web reference's Storybook (`references.json`, today `Reference_Library/Trianglz/Web/storybook/`, 28 component sets, 2026-09-30). Copy its structure.

```
<platform folder>/storybook/
├─ package.json, tsconfig.json, README.md
├─ component-map.json           (Figma component name -> React export; by hand)
├─ figma-links.json             (Figma file + node ids for "Open in Figma"; export with figma_execute, original file only)
├─ .storybook/
│  ├─ main.ts                   (react-vite; addons: docs, a11y, designs, mcp; telemetry off)
│  ├─ preview.tsx               (imports tokens + styles; toolbars named after Figma collections and modes)
│  ├─ preview-head.html         (web font)
│  └─ manager.ts                (brand title = Figma file name)
└─ src/
   ├─ tokens/tokens.css, tokens.ts   (generated: tools/tokens_to_css.py)
   ├─ styles/text-styles.css         (Figma text styles as classes: "sm/Semi Bold" -> .ts-sm-semi-bold)
   ├─ styles/effects.css             (Figma effect styles: --shadow-*, --focus-ring*)
   ├─ styles/components.css          (component styles, var(--...) only)
   ├─ lib/Icon.tsx                   (the file's icon set, color = currentColor)
   ├─ components/<Group>.tsx         (replicas grouped like the Figma ⭐ groups; props = Figma names)
   ├─ stories/<Group>/<Name>.stories.tsx  (generated: tools/storybook_stories.py)
   └─ foundations/*.mdx + Foundations.tsx (Introduction, Colors, Typography, Spacing, Radius, Shadows, Icons, App Icon; live from tokens.ts)
public/app-icon/                    (App Icon PNG/SVG files exported from the ➜ App Icon size frames; only when the icon is presented)
```
Also in the Root: `.claude/launch.json` (preview entry). The Storybook MCP is registered per machine (local scope, step 8), never in a committed `.mcp.json`.

Story titles follow the Figma groups: `Foundations/Colors`, `Form Elements/Input / Text`, `Navigation/Button`, `Data Display/Badge`. Sidebar order: Foundations, Form Elements, Navigation, Data Display, Patterns. Inside a group, order by tier (Atoms, Molecules, Organisms).

---

## 4. Build steps

1. **Checkpoint.** Confirm the Components checkpoint in Figma is approved (or, if it is not, Ask (choice): "Wait for the checkpoint (Recommended)" / "Build from the current state"). State the platform folder and Figma link.
2. **Ask to install.** Show: `npm create storybook@latest` (React + Vite + TS) in `<folder>/storybook/`, then `npx storybook add @storybook/addon-mcp` and `@storybook/addon-a11y`. Optional: `@storybook/addon-designs` (embeds the Figma frame in each story). Then Ask (choice): "Yes, install (Recommended)" / "Install without the optional addon" / "Not now".
3. **Tokens.** Run `python tools/tokens_to_css.py <folder>`: writes `src/tokens/tokens.css` and `tokens.ts` from `data/tokens.json`.
   - CSS name rule: take the Figma variable name, lowercase, replace `/` and spaces with `-`, drop other characters, prefix with `--` (e.g. `Semantic::color/text/primary` -> `--color-text-primary`). Collisions are reported, never silently merged.
   - Aliases stay aliases (`var(--gray-900)`), so the Primitive -> Semantic chain is visible.
   - Each mode becomes a selector: `[data-theme="Dark"]`, `[data-typography="Mobile"]`, using the exact Figma mode names.
4. **Foundations docs.** Colors, Typography, Spacing, Radius, Shadows and Icons pages render live from `tokens.ts` (swatch, Figma name, CSS variable, value per mode). Same rule as Figma: docs are linked to tokens, never static.
   - **App Icon** (`Foundations/App Icon`, only in a Storybook the user chose to create; Intake section 7h-5): when `status.json > app_icon.status` is `presented`, export each size frame of ➜ App Icon with its own export setting into `storybook/public/app-icon/` (file names from `tools/app_icon_specs.json`), then render the same blocks as the Figma page: the platform's masks and contexts (CSS `border-radius` / `clip-path`, never edited images), the size ladder at real size, each appearance in each mode the project has, and the specs table with the code snippet (Xcode asset catalog, `ic_launcher.xml`, or the `<link>` tags and manifest entries). While it is `waiting`, the page shows the platform guidelines and says the icon is not in Figma yet. The ds-auditor drift mode checks that the exported files match the Figma frames' sizes.
5. **Components.** For each registry entry, tier by tier (Atoms first, so Molecules reuse them exactly like Figma nesting):
   - `argTypes` keys = Figma property and variant names exactly (`"Show optional"`, `"Leading icon"`, `State`, `Type`, `Size`). Variant options = Figma values exactly. Booleans -> boolean control, TEXT -> text control, INSTANCE_SWAP -> select of icon names.
   - Visuals match the Light and Dark screenshots in `references/screens/`. Use only token variables.
   - Interactive states (Hover, Focus, Pressed, Disabled) also work for real (CSS :hover/:focus-visible), and the `State` control forces them for review.
   - `parameters.design = { type: "figma", url: "<Figma link to the component set>" }` and an "Open in Figma" link at the top of the MDX.
   - Usage docs: `tools/storybook_stories.py` writes tier, use, nests, known Figma gaps and the Figma link into each story's docs description from the registry. Add longer "when not to use" guidance to the registry `use` field or an MDX page.
   - Read exact specs first with a read-only `figma_execute` walk (layout, padding, gap, radius, fills/strokes as variable names, text style names, effect styles) of each component set, then write the replica. Screenshots in `references/screens/` are the visual check.
   - Generate the stories: `python tools/storybook_stories.py <folder>` (Playground, one story per value of the main variant property, an "All variants" grid, and an interactive "In use" example when `component-map.json` has one).
6. **Mobile (iOS / Android), rendered as web.** Same React + CSS setup as Web (principle 7). Wrap stories in `DeviceFrame` (iOS 393x852, Android 412x915 by default) with the platform's system font stack, safe areas and status bar. iOS: HIG semantic names and Dynamic Type sizes from tokens. Android: md.sys tokens and M3 elevation from tokens.
7. **Verify.**
   - `npm run build-storybook` passes with no errors.
   - Parity check: every registry component has a story file; every Figma variant and property appears in `argTypes` with the identical name (`python tools/storybook_parity.py <folder>`; report any mismatch).
   - Visual check: open the stories in the browser (Playwright or the browser pane) and compare Light and Dark with the Figma screenshots.
   - a11y addon: no contrast or role violations.
8. **MCP.** With Storybook running, the addon serves an MCP endpoint at `http://localhost:<port>/mcp`. Ask before registering it (Ask (choice): "Register it on this machine (Recommended)" / "Not now"): `claude mcp add --transport http <project>-<platform>-storybook http://localhost:<port>/mcp --scope local` (e.g. `clinicsoft-web-storybook`, port 6007). Local scope stays on this machine and out of git, so people who clone the repo are never prompted to enable it. Never use `--scope project` and never commit a root `.mcp.json` (it is git-ignored; `.mcp.example.json` is the template). Record the server name and port in `Project_Brief.md`. After that, agents can list components, read their docs and props, and preview stories before building UI.
9. **GitHub (only when asked).** Push the Storybook with the repo and publish the static build (`storybook-static/`) with GitHub Pages or Chromatic. Never create a remote or push without the user's word.
10. **Record.** Add the Storybook path, run command and MCP status to `Project_Brief.md` and the Foundation_Skill; the ds-auditor drift mode then also checks Storybook names against Figma.

---

## 5. Keeping it in sync

- Figma changes -> token-extractor re-exports `data/` -> rerun `tools/tokens_to_css.py` -> parity check lists stories to update.

### "Update from Figma" procedure
Tell the user up front which file to open: "Please open '<DS file name>' in Figma Desktop and run the Desktop Bridge plugin in it.", then Ask (choice): "Done, plugin running" / "Not yet". The file is the project's `status.json > figma.design_system` (Trianglz Web: the key in `memory/references.md`). Then:
1. **Confirm the source file:** `figma_get_status` / `figma_list_open_files`; the connected file key must match. If several files are connected, pin it with `figma_navigate` (`lock: true`). An original Trianglz template may be read freely; writing to it is guarded by `guard_figma.py` and never needed here.
2. **Tokens:** run the token-extractor agent (writes `data/source/` and `data/tokens.json`; fallback export: `tools/export_variables.figma.js`).
3. `python tools/tokens_to_css.py "<folder>"` (regenerates `storybook/src/tokens/*`).
4. `python tools/storybook_stories.py "<folder>"` (and, when ➜ App Icon changed, re-export `public/app-icon/` as in section 4 step 4) (stories from `data/component-registry.json`; refresh the registry with docs-writer first if components changed).
5. `python tools/storybook_parity.py "<folder>"` (names must match Figma exactly; fix every mismatch).
6. `npm --prefix "<folder>/storybook" run build-storybook`, then a visual check of the changed components in each mode against the Figma screenshots.
7. `python tools/project_status.py "<folder>" --mark-synced`.
- Never edit `src/tokens/*` by hand; they are generated.
- A rename in Figma is a rename in Storybook (same day), because names must match.

---

## 6. Related tools

- figma-console `figma_ds_*` tools (`figma_ds_analyze`, `figma_ds_scaffold`, `figma_ds_setup_storybook`, `figma_ds_verify`) go the other way: they extract a design system from an existing **code** app into a Storybook workshop. Use them for Brownfield type 2 (live product, no Figma), not for Figma-first systems.
- Storybook MCP docs: https://storybook.js.org/docs/ai/mcp/overview
