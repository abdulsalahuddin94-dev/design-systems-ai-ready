# Install steps for the Figma tools

Part of `Design_System_Intake_Skill` (sections keep their original numbers, so "section 7c" etc. still resolve; the map is in `SKILL.md` section 0c). Load only when preflight (section 0b) finds no tool or no Desktop Bridge connection.

**figma-console-mcp install steps** (from its README):
1. Prerequisites: Node.js 18+ (`node --version`), Figma Desktop (not the web app), an MCP client such as Claude Code.
2. Create a Figma personal access token (Figma > Settings > Security > Personal access tokens), description `Figma Console MCP`, scopes: File content (Read), File versions (Read), Variables (Read), Comments (Read and write). It starts with `figd_`.
3. Add the server to Claude Code (the user runs this in their own terminal, with their own token):
   `claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest`
   (Claude Desktop / Cursor: add the same `npx -y figma-console-mcp@latest` server with those env values to the client's MCP config file.)
4. Desktop Bridge: in Figma Desktop go to Plugins > Development > Import plugin from manifest..., select `~/.figma-console-mcp/plugin/manifest.json`, then run the plugin inside the file you will work on. It connects over WebSocket.
5. Restart the MCP client and say "Check Figma status"; it should show the Desktop Bridge connected.

**figma-cli install steps** (from its README):
1. Prerequisites: Figma Desktop installed and open, Claude Code (or Cursor), Node.js 18+.
2. The user downloads the project: https://github.com/silships/figma-cli into a folder in their home directory.
3. Inside that folder, the user asks Claude Code to "Set up figma-cli and connect it to my Figma" and follows its setup. It offers three connection modes: Yolo (patches Figma Desktop, default), Browser (Figma in Chromium) and Safe (official Figma plugin, no app changes). Recommend **Safe mode** for company machines.
4. Done when figma-cli says it is connected.
