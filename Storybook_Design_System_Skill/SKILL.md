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
6. **Never install without asking.** Show the exact packages and commands and wait for a "yes" before `npm create`, `npm install` or `npx storybook add`.

---

## 2. Inputs

From the platform folder (`<Project>/`, `<Project>_iOS/`, `<Project>_Android/`, or a Trianglz reference folder):
- `data/tokens.json`: every variable with its Figma name (`<Collection>::<name>`), per-mode values and aliases.
- `data/component-registry.json`: components with group, page, tier, variants, properties, use, nests; text and effect styles; icons.
- `data/rules.json`: contrast, touch targets, focus, disabled opacity.
- `Component_Skills/*/references/components.md` and `screens/`: exact use cases and Light/Dark screenshots for visual matching.
- The Figma file link (from `Project_Brief.md` or `References.md`).

If `data/` says `needs_resync: true` and the Figma file is open in the Desktop Bridge, run the **token-extractor** subagent first so the Storybook is built from live names.

---

## 3. Output layout

```
<platform folder>/storybook/
├─ package.json                 (private, scripts: storybook, build-storybook, tokens)
├─ .storybook/
│  ├─ main.ts                   (react-vite, addons: docs, a11y, mcp)
│  ├─ preview.tsx               (imports tokens.css; toolbars for every Figma mode collection)
│  └─ manager.ts                (brand title = "<Project> Design System")
├─ src/
│  ├─ tokens/tokens.css         (generated: one CSS variable per Figma variable, per mode)
│  ├─ tokens/tokens.ts          (generated: Figma name -> CSS variable map, used by docs)
│  ├─ foundations/              (Colors.mdx, Typography.mdx, Spacing.mdx, Radius.mdx, Shadows.mdx, Icons.mdx: live token tables)
│  ├─ components/<Figma component name>/
│  │  ├─ <Name>.tsx             (visual replica, props named exactly like Figma)
│  │  ├─ <Name>.stories.tsx     (one story per variant combination that matters + Playground)
│  │  └─ <Name>.mdx             (usage: tier, use cases, when not to use, nests, tokens, a11y, Figma link)
│  └─ device/DeviceFrame.tsx    (iOS / Android only)
└─ README.md                    (how to run, how to regenerate)
```

Story titles follow the Figma groups: `Foundations/Colors`, `Form Elements/Input / Text`, `Navigation/Button`, `Data Display/Badge`. Sidebar order: Foundations, Form Elements, Navigation, Data Display, Patterns. Inside a group, order by tier (Atoms, Molecules, Organisms).

---

## 4. Build steps

1. **Checkpoint.** Confirm the Components checkpoint in Figma is approved (or the user explicitly wants a Storybook of the current state). State the platform folder and Figma link.
2. **Ask to install.** Show: `npm create storybook@latest` (React + Vite + TS) in `<folder>/storybook/`, then `npx storybook add @storybook/addon-mcp` and `@storybook/addon-a11y`. Optional: `@storybook/addon-designs` (embeds the Figma frame in each story). Wait for "yes".
3. **Tokens.** Run `python tools/tokens_to_css.py <folder>`: writes `src/tokens/tokens.css` and `tokens.ts` from `data/tokens.json`.
   - CSS name rule: take the Figma variable name, lowercase, replace `/` and spaces with `-`, drop other characters, prefix with `--` (e.g. `Semantic::color/text/primary` -> `--color-text-primary`). Collisions are reported, never silently merged.
   - Aliases stay aliases (`var(--gray-900)`), so the Primitive -> Semantic chain is visible.
   - Each mode becomes a selector: `[data-theme="Dark"]`, `[data-typography="Mobile"]`, using the exact Figma mode names.
4. **Foundations docs.** Colors, Typography, Spacing, Radius, Shadows and Icons pages render live from `tokens.ts` (swatch, Figma name, CSS variable, value per mode). Same rule as Figma: docs are linked to tokens, never static.
5. **Components.** For each registry entry, tier by tier (Atoms first, so Molecules reuse them exactly like Figma nesting):
   - `argTypes` keys = Figma property and variant names exactly (`"Show optional"`, `"Leading icon"`, `State`, `Type`, `Size`). Variant options = Figma values exactly. Booleans -> boolean control, TEXT -> text control, INSTANCE_SWAP -> select of icon names.
   - Visuals match the Light and Dark screenshots in `references/screens/`. Use only token variables.
   - Interactive states (Hover, Focus, Pressed, Disabled) also work for real (CSS :hover/:focus-visible), and the `State` control forces them for review.
   - `parameters.design = { type: "figma", url: "<Figma link to the component set>" }` and an "Open in Figma" link at the top of the MDX.
   - MDX usage text comes from the Component_Skill: tier, exact use cases, when not to use, dependencies, tokens used, accessibility.
6. **Mobile (iOS / Android).** Wrap stories in `DeviceFrame` (iOS 393x852, Android 412x915 by default) with the platform's system font stack, safe areas and status bar. iOS: HIG semantic names and Dynamic Type sizes from tokens. Android: md.sys tokens and M3 elevation from tokens.
7. **Verify.**
   - `npm run build-storybook` passes with no errors.
   - Parity check: every registry component has a story file; every Figma variant and property appears in `argTypes` with the identical name (`python tools/storybook_parity.py <folder>`; report any mismatch).
   - Visual check: open the stories in the browser (Playwright or the browser pane) and compare Light and Dark with the Figma screenshots.
   - a11y addon: no contrast or role violations.
8. **MCP.** With Storybook running, the addon serves an MCP endpoint at `http://localhost:6006/mcp`. Ask before registering it in this folder: `claude mcp add --transport http storybook http://localhost:6006/mcp --scope project`. After that, agents can list components, read their docs and props, and preview stories before building UI.
9. **GitHub (only when asked).** Push the Storybook with the repo and publish the static build (`storybook-static/`) with GitHub Pages or Chromatic. Never create a remote or push without the user's word.
10. **Record.** Add the Storybook path, run command and MCP status to `Project_Brief.md` and the Foundation_Skill; the ds-auditor drift mode then also checks Storybook names against Figma.

---

## 5. Keeping it in sync

- Figma changes -> token-extractor re-exports `data/` -> rerun `tools/tokens_to_css.py` -> parity check lists stories to update.
- Never edit `src/tokens/*` by hand; they are generated.
- A rename in Figma is a rename in Storybook (same day), because names must match.

---

## 6. Related tools

- figma-console `figma_ds_*` tools (`figma_ds_analyze`, `figma_ds_scaffold`, `figma_ds_setup_storybook`, `figma_ds_verify`) go the other way: they extract a design system from an existing **code** app into a Storybook workshop. Use them for Brownfield type 2 (live product, no Figma), not for Figma-first systems.
- Storybook MCP docs: https://storybook.js.org/docs/ai/mcp/overview
