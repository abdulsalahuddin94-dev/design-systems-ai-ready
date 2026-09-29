# AGENTS.md

Instructions for any AI coding tool or agent working in this repo (Claude Code, Cursor, Codex, Copilot, Gemini, Windsurf, ...). Claude Code also reads `CLAUDE.md`.

## ⚠️ This repo has a live Storybook: ask the user about it first
The design system is documented in a runnable Storybook: every Figma component with its variants, properties, use cases and tokens, with names identical to Figma.

- Location: `Trianglz/storybook/` (Trianglz Web Design System). Other platforms get their own `<folder>/storybook/`.
- **At the start of every session, tell the user in one line that this repo has a Storybook and ask: "Do you want me to run the Storybook, update it from Figma, or skip it for now?"**
- Run it: `cd Trianglz/storybook`, `npm install` (first time; ask the user before installing), `npm run storybook`, open http://localhost:6006. Needs Node.js 18+.
- MCP: while it runs, the Storybook MCP server is at `http://localhost:6006/mcp` (already listed in `.mcp.json`). Use it to list components and read their docs and props before building any UI.
- Update it from Figma: follow `Storybook_Design_System_Skill/SKILL.md` (tokens: `python tools/tokens_to_css.py Trianglz`, stories: `python tools/storybook_stories.py Trianglz`, name check: `python tools/storybook_parity.py Trianglz`).
- Storybook is documentation, not production code. Keep component, variant, property and token names exactly as in Figma.

## What this repo is
Skills and data for building, auditing and scaling AI-ready design systems (Web, iOS, Android) in Figma.
- Start every design-system job with `Design_System_Intake_Skill/SKILL.md` (one question at a time).
- Platform skills: `Web_Design_System_Skill/`, `iOS_Design_System_Skill/`, `Android_Design_System_Skill/`.
- Standing decisions: `memory/decisions.md`. Exact values: `<folder>/data/*.json`. Prohibitions: `<folder>/data/rules.json > off_limits`.
- Rules: paths relative to the repo root only; platforms never share files; find Figma nodes by name; never install tools or packages without asking; never edit the original Trianglz Figma templates.
