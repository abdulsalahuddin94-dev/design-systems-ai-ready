# Trianglz - Web Design System: Storybook

Living documentation of the Figma file (link in `figma-links.json`). Documentation only, not production code: components are visual replicas on the design tokens, with Figma names kept exactly.

## Run
```
npm install            # first time only
npm run storybook      # http://localhost:6006  (MCP: http://localhost:6006/mcp)
npm run build-storybook   # static site in storybook-static/
```
Or from Claude in the Root folder: start the `trianglz-web-storybook` preview (`.claude/launch.json`).

## What is where
| Path | Content | Edit? |
|---|---|---|
| `src/tokens/` | CSS variables + token table from `../data/tokens.json` | generated (`npm run tokens`) |
| `src/stories/` | one stories file per Figma component set, from `../data/component-registry.json` | generated (`python tools/storybook_stories.py Reference_Library/Trianglz/Web` from the Root) |
| `src/components/` | React replicas, grouped by Figma group; props = Figma names | by hand |
| `src/styles/text-styles.css` | the 40 Figma text styles as classes (`sm/Semi Bold` -> `.ts-sm-semi-bold`) | by hand |
| `src/styles/effects.css` | Figma effect styles (shadows, focus rings) | by hand, from Figma |
| `src/foundations/` | Introduction, Colors, Typography, Spacing, Radius, Shadows, Icons (live from tokens) | by hand |
| `component-map.json` | Figma component name -> React export | by hand |
| `figma-links.json` | Figma node ids for "Open in Figma" links (original file only) | re-export after duplicating |

## After Figma changes
From the Root: `python tools/tokens_to_css.py Reference_Library/Trianglz/Web`, `python tools/storybook_stories.py Reference_Library/Trianglz/Web`, `python tools/storybook_parity.py Reference_Library/Trianglz/Web`, then update the replica in `src/components/` if the visuals changed.
