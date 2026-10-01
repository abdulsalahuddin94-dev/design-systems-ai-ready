# Figma tools: Desktop Bridge and FigCli

This workflow reaches Figma Desktop through one of two tools. **A new user needs at least one.** Installing both lets Claude use the cheaper tool for each step.

| Tool | Biggest advantage | Best for |
|---|---|---|
| **Figma Desktop Bridge** (figma-console-mcp + its Figma plugin) | Full build and audit with the Figma skills, and it catches everything | Building variables, components and screens (figma-use, figma-generate-library, figma-generate-design rules), screenshots of every variant, the final audit-design-system (5 of 5 planted defects caught in the 2026-10-01 trial) |
| **FigCli** (figma-cli, Safe mode) | Much faster, with about 20–30× fewer tokens for checks, extract and measure | Full-file extract (tokens 100%), `snapshot` / `rules gen` / `check` regression gates (about 16 s and 300 tokens per file), `verify --measure` on screens (under 1 s and about 500 tokens per frame) |

Trial details (2026-10-01, ClinicSoft DS duplicate):
- **FigCli `check`** caught 4 of 5 defects. Across all variants it checks only fill binding and the variant matrix; strokes, padding and size are checked on one sample variant per set, so it missed a Button height change. The extract also skips standalone components that are not component sets.
- **Desktop Bridge** scans every variant. It took about 52 s and 6–10K tokens, with one false positive that was dismissed after a second read.
- FigCli has no knowledge of the official Figma skills. Our skills and data files still apply to it.

Check what is installed (read-only):
```
python tools/figma_tools_check.py
```

## Where to install
Install both tools **outside this workflow folder**, in a `Tools` folder at the root of a drive (`<drive>:\Tools`, for example on drive D), so every workflow copy and every project can use them. Keep each tool's folder name: `figma-cli...` and `figma-console-mcp...`. The check script also finds a `Tools` folder next to the workflow, a `Tools` folder in your home folder, or a folder set in the `FIGMA_CLI_DIR` environment variable.

Do not copy either tool into this repo. Update them from their GitHub pages:
- figma-console-mcp: https://github.com/southleft/figma-console-mcp
- figma-cli: https://github.com/silships/figma-cli

Claude only installs after you say yes, and you can do it in the same session as the intake. Restart Claude Code after adding an MCP server, so its tools load.

## Install the Figma Desktop Bridge (figma-console-mcp)
1. You need Node.js 18+ (`node --version`) and Figma Desktop (the web app is not enough).
2. Create a Figma personal access token (Figma > Settings > Security > Personal access tokens) with these scopes: File content (Read), File versions (Read), Variables (Read), Comments (Read and write). Never paste the token into the chat.
3. Add the server yourself, in your own terminal:
   `claude mcp add figma-console -s user -e FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE -e ENABLE_MCP_APPS=true -- npx -y figma-console-mcp@latest`
   For other AI tools, see `AGENTS.md` > Figma setup for other tools.
4. In Figma Desktop, go to Plugins > Development > Import plugin from manifest... and pick `~/.figma-console-mcp/plugin/manifest.json` (it is created the first time the server starts). If you downloaded the source into `Tools`, pick its `figma-desktop-bridge/manifest.json` instead.
5. Restart Claude Code, run the **Figma Desktop Bridge** plugin in your file, and say "Check Figma status".

## Install FigCli (figma-cli), Safe mode only
1. You need Node.js 18+ and Figma Desktop.
2. Download or clone https://github.com/silships/figma-cli into `<drive>:\Tools\figma-cli`.
3. Inside that folder run `npm install`. **Never `npm install -g`.**
4. Check it: `node src/index.js --version`.
5. Connect in **Safe mode**: `node src/index.js connect --safe`. Then in Figma Desktop go to Plugins > Development > **FigCli** and keep that plugin open while you work. `node src/index.js daemon status` should report it running.
6. Do **not** run `figma-cli init-agent` inside this workflow folder, because it writes its own `AGENTS.md` and Cursor rules over ours. Do **not** install its Claude Code plugin (`/plugin install figma-cli...`). Our skills drive it.

**Use Safe mode, never Yolo or Browser mode:**
- **Yolo** patches the Figma Desktop app (`app.asar`) and opens an unauthenticated debugging port (9222) on your machine. Any local program can drive Figma through it, and company IT policies usually forbid that.
- **Browser** runs Figma in a separate Chromium browser over the same open debugging port, outside the Figma Desktop app this workflow uses.
- **Safe** uses an ordinary Figma development plugin and changes nothing in the app. All modes run the same commands.

## Switching any time
- You can use either tool on any file at any time: mid-project, days later, or one tool per file (for example FigCli on the DS file and the Desktop Bridge on a Design file). Just tell Claude.
- Claude saves the tool used on each file in the project's `status.json`, logs every switch in `CHANGELOG.md`, re-checks the connection and the file, and reloads its helper script.
- Nothing in Figma or in the project files belongs to one tool, so switching never needs rework. The one thing that gets refreshed is FigCli's saved baseline (`snapshot` + `rules gen`): Claude regenerates it after a switch, after changes made through the Desktop Bridge, and after each approved checkpoint, so `check` does not report your own changes as drift.
- File check: the Desktop Bridge confirms the file by its key. FigCli in Safe mode only knows the name, so Claude confirms the exact name with you and writes nothing if it does not match.
- Steps that touch two files (publish, Accept updates, checking the library) need both files connected, each with its own tool.

## Switching plugins in Figma
- Both plugins show in Figma Desktop under Plugins > Development: **Figma Desktop Bridge** and **FigCli**.
- Figma runs one plugin at a time per file, so only one tool is connected at a time. Close one plugin before you open the other.
- FigCli talks to only **one** file. If FigCli is open in several files, close it everywhere except the file you work on.
- Claude Code auto mode may block `figma-cli eval` commands that write. Allow the command when asked, or run it yourself.
- After a switch, Claude re-checks the connection and confirms the file name before any work.
