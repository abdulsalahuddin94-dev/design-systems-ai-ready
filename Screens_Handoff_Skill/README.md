# Screens Handoff Skill (trial: The Live Prototype)

Status: **trial, not part of the workflow yet**. Nothing here is loaded by the intake, the Main Skills or the dashboard until Abdul approves the trial.

Goal: turn the finished screens of a Design file into a live, clickable prototype that a developer can open, built only from the project's own design system (its tokens and its Storybook React components), and carry review comments back into Figma.

Trial project: Music App (Android, Brownfield), flow **Listen**.

## Steps (go / no-go after each)

Each step ends with a report to Abdul and a go / no-go answer. Nothing moves to the next step without his go. No self-approval.

1. **Local prototype from Figma.** `tools/screens_export.figma.js` (read-only) exports each screen of the flow as a tree of DS instances (main component, variant properties, text overrides, auto layout, sizes) plus its prototype reactions (routes, overlays) into `data/screens.json`. `tools/build_prototype.py` generates the screens and routes into a copy of `templates/prototype/` (Vite + React + TypeScript + Tailwind v4, `@theme` from the project's `data/tokens.json`, the project's Storybook components reused, never re-created). Android device frame, Light/Dark and EN/AR toggles, flow list on the left; every element carries `data-figma-node` and `data-component`. Fidelity check: each prototype screen against the Figma export of the same frame, Light and Dark, up to 3 fix rounds. Runs locally only; nothing is published.
2. **Every mode.** All screens of the flow in Light/Dark and EN/AR (RTL), with the prototype interactions from Figma (navigate, overlays, back).
3. **Code handoff.** A Code tab per screen with Jetpack Compose code that uses the real DS names (md.sys tokens, component and property names as in Figma and Storybook).
4. **Comment round trip.** A reviewer comments on an element in the prototype; the comment lands in Figma on the matching node (`data-figma-node`), and a fix in Figma regenerates the prototype.
5. **Decide.** Measure tokens and time, compare with building the same screens by hand, and decide whether this becomes a workflow step (intake, decisions, dashboard).

## Success criteria

- Fidelity **>= 98%** per screen on the Music App Listen screens (prototype vs Figma export, same size and mode).
- Light and Dark, EN and AR (RTL) all render correctly.
- Compose code uses the real DS names, no raw values.
- One comment completes the round trip prototype -> Figma -> prototype.

## How step 1 runs

```
node tools/screens_export.cjs --file "<Design file>" --page <page> --png --out "My Projects/<Project>/prototype/data"
python tools/build_prototype.py "My Projects/<Project>" --flow <flow name>
npm --prefix "My Projects/<Project>/prototype" install      (first time)
npm --prefix "My Projects/<Project>/prototype" run dev       (http://localhost:5190)
node scripts/fidelity.mjs --shots <folder>                   (in the prototype folder, while dev runs)
```

`<Project>/prototype/adapters.json` (optional, project-specific) maps what the Storybook components take beyond the Figma properties (photos, nested texts) and the links between screens when the Figma file has no prototype reactions. Spec language: `tx:<layer>`, `tx*:<layer>` (all numbered copies), `img`, `ni:<layer>.c|v`, `v:<variant>`, `p:<property>`, `w:` / `h:`, `{"eq": [spec, value]}`, `{"const": x}`, `{"zip": {...}}`; events `"screen:<name>"`, `"overlay:<name>"`, `"back"`, `{"by_index": {...}}`; `instances` adapts one layer name.

## Step 1 results (Music App, Listen, 2026-10-22)

8 screens x Light/Dark, 0 components missing from Storybook, 0 raw values, Light and Dark frames identical in structure. Fidelity = matching pixels (pixelmatch, threshold 0.1) on the Figma frame's size:

| Screen | Dark | Light |
|---|---|---|
| Explore - Full | 97.64% | 97.09% |
| Explore - Viewport | 97.65% | 97.31% |
| Search & Discover - Full | 97.95% | 97.99% |
| Search & Discover - Viewport | 97.98% | 97.92% |
| Library - Music | 97.99% | 97.79% |
| Library - Podcasts | 94.42% | 93.97% |
| Now Playing | 98.22% | 98.19% |
| Lyrics | 96.68% | 96.55% |
| **Average** | | **97.21%** |

Round 1 was about 85% (missing photos, Section Header height). Every remaining difference is inside a Storybook component, i.e. the project's Storybook drifted from Figma; the fix belongs in the Storybook, not in the prototype:
1. Player Utility Bar: Figma pads it 24 and aligns items to the top when it is 375 wide; Storybook centres with no padding (Now Playing, Lyrics).
2. Track Metadata and Library Shortcut Tile: Figma wraps titles to 2 lines, Storybook truncates to 1 (Podcasts).
3. Progress Indicator inside Podcast Episode Card: Figma shows the grey track, Storybook the lime fill.
4. Section Header: Storybook min-height 36; Figma hugs to 24 when More is off (the prototype now takes Figma's height for every hugging instance).
5. Top App Bar: no image prop for the profile Avatar.
6. Now Playing title: a larger text style on a nested layer, an override the Storybook component cannot take.

## Lessons from step 1
- FigCli eval output stops at 20,000 characters: big screens are read shallow, then child by child (Explore Full = 14 calls).
- FigCli `export node` hangs on layers inside instances, and every export (FigCli or `exportAsync`) cuts a layer at its clipping parent. Screens rebuilt from screenshots use one source image cropped many times (`scaleMode CROP`): read each layer's hash and transform, fetch each source once by hash, cut the crops locally (Pillow). Never take "the first image paint": hidden paints sit under the visible one.
- A hidden Figma tab (another window on top, or minimized) makes node and image reads fail with "Unable to establish connection to Figma after 10 seconds"; reading image bytes by hash still works. Ask for the tab in front before image work.
- JSX attribute strings take no escapes: strings with quotes go in `{...}`.

## Rules for the trial

- All work happens in this branch's worktree; the Root stays on `master`.
- Generated output for a real project stays outside the repo's tracked files (in the project's own folder under `My Projects/`, or in the git-ignored `.trial/`).
- Figma is read only in step 1 (FigCli Yolo, `FIGMA_FILE` set to the exact file name).
- `memory/decisions.md`, the intake files and the dashboard are not changed until the trial is approved.
