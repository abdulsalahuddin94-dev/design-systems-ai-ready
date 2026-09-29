# Design systems Ai Ready

Skills that let Claude Code build, audit and scale AI-ready design systems in Figma for Web, iOS and Android: strictly tokenized, componentized and documented so AI agents can build UIs from them.

## What is inside
- `CLAUDE.md`: read by Claude Code automatically; tells it to start every job with the intake.
- `Design_System_Intake_Skill/`: the entry flow (tools check, questions, path, approval checkpoints).
- `Web_Design_System_Skill/`, `iOS_Design_System_Skill/`, `Android_Design_System_Skill/`: platform Main Skills.
- `Trianglz/`, `Trianglz_iOS/`, `Trianglz_Android/`: studies of the Trianglz template files (foundations, components, known gaps).
- `*/data/`: JSON knowledge base per DS (tokens, component registry, rules, screen templates) and `*/docs/decisions.md`.
- `tools/`: `build_tokens.py` (Figma export to tokens.json) and `recolor.py` (change a color and regenerate all its shades). Needs Python 3.
- `References.md`: Trianglz Figma template links and tooling links.
- `.claude/skills/`: slash commands `/design-system-intake`, `/web-design-system`, `/ios-design-system`, `/android-design-system`.

## Setup
1. **Install Claude Code** and Node.js 18+ (`node --version`).
2. **Install Figma Desktop** (the web app is not enough).
3. **Install one Figma bridge** (you install it; Claude will not do it for you):
   - **figma-console-mcp** (recommended): create a Figma personal access token (scopes: File content Read, File versions Read, Variables Read, Comments Read and write), then run
     ```
     claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest
     ```
     In Figma Desktop: Plugins > Development > Import plugin from manifest..., pick `~/.figma-console-mcp/plugin/manifest.json`, and run the plugin in your file. Details: https://github.com/southleft/figma-console-mcp
   - **or figma-cli**: download https://github.com/silships/figma-cli into your home folder, open Claude Code inside it and ask "Set up figma-cli and connect it to my Figma" (Safe mode recommended).
4. **Recommended skills and connectors**: the official Figma MCP / Figma plugin (figma-use, figma-generate-library, figma-generate-design), audit-design-system, ui-ux-pro-max, Impeccable.
5. **Get this folder**: clone the repository (or copy the folder) anywhere on your machine. Paths inside are relative, so any location works.
6. **Templates (optional)**: duplicate the Trianglz file for your platform from `References.md` into your Figma workspace.

## Use
Open the folder in Claude Code and say what you want, or run `/design-system-intake`. Claude checks the Figma bridge, asks one question at a time, then builds with approval checkpoints (Foundation, Components, Screens) and finishes with the project's skills and an audit.

Project work is saved in `<Project>/` (Web), `<Project>_iOS/`, `<Project>_Android/` or `<Project>_Mobile/` next to the Main Skills.
