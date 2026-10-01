"""Detect which Figma tools are installed (Intake section 0b). Read-only, standard library only.

Usage (from the Root):
    python tools/figma_tools_check.py            # human-readable lines
    python tools/figma_tools_check.py --json     # machine-readable

Desktop Bridge = the figma-console-mcp server is configured (project .mcp.json or the user's
~/.claude.json). FigCli = a figma-cli folder with node_modules whose `node src/index.js --version`
works, or a `figma-cli` command on the PATH. Search order for the folder: FIGMA_CLI_DIR, then
a Tools folder at the drive root, next to the Root, inside the Root's parent and in the home folder.
This only checks installation; the live connection is checked in the session (figma_get_status,
or `figma-cli daemon status`).
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def desktop_bridge():
    found = []
    for cfg in (ROOT / ".mcp.json", Path.home() / ".claude.json"):
        try:
            if "figma-console-mcp" in cfg.read_text(encoding="utf-8", errors="ignore"):
                found.append(cfg.name)
        except OSError:
            pass
    plugin = (Path.home() / ".figma-console-mcp" / "plugin" / "manifest.json").exists()
    return {"installed": bool(found), "config": found, "plugin_manifest": plugin}


def cli_dirs():
    env = os.environ.get("FIGMA_CLI_DIR")
    if env:
        yield Path(env)
    bases = [Path(ROOT.anchor) / "Tools", ROOT.parent / "Tools", ROOT.parent.parent / "Tools", Path.home() / "Tools", Path.home()]
    for base in bases:
        if base.is_dir():
            yield from sorted(p for p in base.glob("figma-cli*") if p.is_dir())


def run(cmd, cwd=None):
    try:
        out = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=20)
        return out.returncode == 0, (out.stdout or out.stderr).strip().splitlines()[-1:] or [""]
    except (OSError, subprocess.TimeoutExpired):
        return False, [""]


def figcli():
    seen = set()
    for d in cli_dirs():
        d = d.resolve()
        if d in seen or not (d / "src" / "index.js").exists():
            continue
        seen.add(d)
        if not (d / "node_modules").is_dir():
            return {"installed": False, "folder": str(d), "note": "folder found, run npm install inside it"}
        ok, line = run(["node", "src/index.js", "--version"], cwd=d)
        if ok:
            return {"installed": True, "folder": str(d), "version": line[0], "run": "node src/index.js"}
    exe = shutil.which("figma-cli")
    if exe:
        ok, line = run([exe, "--version"])
        if ok:
            return {"installed": True, "folder": None, "version": line[0], "run": "figma-cli"}
    return {"installed": False, "folder": None}


def main():
    result = {"desktop_bridge": desktop_bridge(), "figcli": figcli()}
    if "--json" in sys.argv:
        print(json.dumps(result, indent=2))
        return 0
    db, fc = result["desktop_bridge"], result["figcli"]
    print("Desktop Bridge (figma-console-mcp):", "installed (" + ", ".join(db["config"]) + ")" if db["installed"] else "not installed",
          "" if db["plugin_manifest"] or not db["installed"] else "- plugin manifest not created yet (start the MCP server once)")
    if fc["installed"]:
        print("FigCli (figma-cli):", "installed", fc["version"], "-", fc["folder"] or "on PATH")
    else:
        print("FigCli (figma-cli):", fc.get("note", "not installed"), fc["folder"] or "")
    return 0


if __name__ == "__main__":
    sys.exit(main())
