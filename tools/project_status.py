"""Storybook sync status per project, read from each project's CHANGELOG.md (never from Figma).

Usage (from the Root):
  python tools/project_status.py                          list projects with changes not synced to Storybook
  python tools/project_status.py "My Projects/<Project>"   refresh that project's status.json
  python tools/project_status.py "My Projects/<Project>" --mark-synced
                                                           mark every entry "Storybook synced: yes" (after a Storybook update)
  python tools/project_status.py "My Projects/<Project>" --add-design-file <figma url> --name "Web App"
                             [--role screens|source] [--content frames|screenshots|mixed]
                                                           register (or update, by file key) a Design file in status.json > figma

CHANGELOG.md format (newest first):
  ## 2026-09-30 - Components: Button, Input Field
  - Storybook synced: no
  - Changed: ...
"""
import datetime
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
HEAD = re.compile(r"^## (\d{4}-\d{2}-\d{2})\b(.*)$")
SYNC = re.compile(r"^(\s*-\s*Storybook synced:\s*)(yes|no)\b.*$", re.I)


def projects():
    found = [p.parent for p in (ROOT / "My Projects").glob("*/CHANGELOG.md") if p.parent.name != "_Project_Template"]
    found += [p.parent for p in ROOT.glob("*/CHANGELOG.md") if (p.parent / "Project_Brief.md").exists()]
    return sorted(set(found))


def parse(folder):
    entries, cur = [], None
    for line in (folder / "CHANGELOG.md").read_text(encoding="utf-8").splitlines():
        m = HEAD.match(line)
        if m:
            cur = {"date": m.group(1), "title": m.group(2).strip(" -"), "synced": False}
            entries.append(cur)
        elif cur and SYNC.match(line):
            cur["synced"] = SYNC.match(line).group(2).lower() == "yes"
    return entries


def write_status(folder, synced_now=False):
    path = folder / "status.json"
    status = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    entries = parse(folder)
    unsynced = [e for e in entries if not e["synced"]]
    status.update({
        "project": folder.name,
        "has_storybook": (folder / "storybook" / "package.json").exists(),
        "last_change": entries[0]["date"] if entries else None,
        "unsynced_entries": len(unsynced),
        "unsynced_since": min((e["date"] for e in unsynced), default=None),
    })
    if synced_now:
        status["last_storybook_sync"] = datetime.date.today().isoformat()
    status.setdefault("last_storybook_sync", None)
    path.write_text(json.dumps(status, indent=2) + "\n", encoding="utf-8")
    return status, unsynced


def mark_synced(folder):
    path = folder / "CHANGELOG.md"
    lines = path.read_text(encoding="utf-8").splitlines()
    lines = [SYNC.sub(lambda m: m.group(1) + "yes", l) for l in lines]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return write_status(folder, synced_now=True)


def pending():
    """Projects with changelog entries not yet synced to Storybook: [(rel_path, status, unsynced)]."""
    out = []
    for f in projects():
        status, unsynced = write_status(f)
        if unsynced:
            out.append((f.relative_to(ROOT).as_posix(), status, unsynced))
    return out


def library_pending():
    """Design files that have not accepted the latest library publish: [(rel_path, [file names])]."""
    out = []
    for f in projects():
        path = f / "status.json"
        if not path.exists():
            continue
        files = json.loads(path.read_text(encoding="utf-8")).get("figma", {}).get("design_files", [])
        names = [d.get("name") or d.get("file_key") for d in files
                 if d.get("role", "screens") == "screens" and d.get("library_updates_accepted") is False]
        if names:
            out.append((f.relative_to(ROOT).as_posix(), names))
    return out


def storybook_later():
    """Projects whose Storybook plan is Later: [(rel_path, ask_at)]."""
    out = []
    for f in projects():
        path = f / "status.json"
        if not path.exists():
            continue
        st = json.loads(path.read_text(encoding="utf-8"))
        if str(st.get("storybook_plan") or "").lower() == "later":
            out.append((f.relative_to(ROOT).as_posix(), st.get("storybook_ask_at") or "next-session"))
    return out


def file_key(url):
    m = re.search(r"/(?:design|file|proto|board)/([A-Za-z0-9]+)", url)
    if not m:
        raise SystemExit(f"No Figma file key in {url!r} (expected .../design/<key>/...)")
    return m.group(1)


def opt(args, name, default=None):
    return args[args.index(name) + 1] if name in args and args.index(name) + 1 < len(args) else default


def add_design_file(folder, args):
    url = opt(args, "--add-design-file")
    if not url:
        raise SystemExit("--add-design-file needs a Figma URL")
    key = file_key(url)
    path = folder / "status.json"
    status = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    files = status.setdefault("figma", {}).setdefault("design_files", [])
    entry = next((d for d in files if d.get("file_key") == key), None)
    if entry is None:
        entry = {"library_updates_accepted": False}
        files.append(entry)
    entry.update({
        "name": opt(args, "--name", entry.get("name") or key),
        "url": url.split("?")[0],
        "file_key": key,
        "role": opt(args, "--role", entry.get("role", "screens")),
        "content": opt(args, "--content", entry.get("content", "frames")),
    })
    path.write_text(json.dumps(status, indent=2) + "\n", encoding="utf-8")
    return write_status(folder)


def main(args):
    if args:
        folder = ROOT / args[0]
        if "--add-design-file" in args:
            status, _ = add_design_file(folder, args)
            print(json.dumps(status.get("figma", {}), indent=2))
            return 0
        status, unsynced = mark_synced(folder) if "--mark-synced" in args else write_status(folder)
        print(json.dumps(status, indent=2))
        return 0
    rows = pending()
    if not rows:
        print("All projects are synced with Storybook.")
    for rel, status, unsynced in rows:
        titles = "; ".join(f"{e['date']} {e['title']}" for e in unsynced)
        print(f"{rel}: {len(unsynced)} change(s) not in Storybook ({titles})")
    for rel, names in library_pending():
        print(f"{rel}: Design files still need Accept updates for the library: {', '.join(names)}")
    for rel, when in storybook_later():
        print(f"{rel}: Storybook plan is Later (ask again at: {when})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
