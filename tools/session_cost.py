"""Tokens and time spent by Claude Code sessions in this folder, for the CHANGELOG `Tokens:` / `Time:` lines.

Reads Claude Code's own local session logs (~/.claude/projects/<folder>/*.jsonl, subagent logs included).
Nothing is sent anywhere. Each model call is counted once (Claude Code may write one call on several lines).

Usage (from the Root):
  python tools/session_cost.py                  # the newest session (the one running now)
  python tools/session_cost.py --since 2026-10-12   # every session with activity since that date (a phase over several sessions)
  python tools/session_cost.py --session <id>   # one session by id (file name without .jsonl)
  python tools/session_cost.py --json           # machine-readable totals
Options: --root <folder> (default: current folder), --idle <minutes> (gap that is not counted as active time, default 5).
"""
import argparse
import glob
import json
import os
import re
import sys
from datetime import datetime, timezone


def projects_dir():
    base = os.environ.get("CLAUDE_CONFIG_DIR") or os.path.join(os.path.expanduser("~"), ".claude")
    return os.path.join(base, "projects")


def log_folder(root):
    # Claude Code names the folder after the absolute path, every non-alphanumeric character -> "-".
    slug = re.sub(r"[^A-Za-z0-9]", "-", os.path.abspath(root))
    return os.path.join(projects_dir(), slug)


def parse_time(value):
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, ValueError):
        return None


def session_files(folder, session_id):
    files = [os.path.join(folder, session_id + ".jsonl")]
    files += glob.glob(os.path.join(folder, session_id, "**", "*.jsonl"), recursive=True)  # subagents
    return [f for f in files if os.path.isfile(f)]


def read_calls(files, since=None):
    calls, times = {}, []
    for path in files:
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                try:
                    d = json.loads(line)
                except ValueError:
                    continue
                t = parse_time(d.get("timestamp"))
                if t is None or (since and t < since):
                    continue
                if d.get("type") in ("user", "assistant") and not d.get("isSidechain"):
                    times.append(t)
                msg = d.get("message") if isinstance(d.get("message"), dict) else {}
                usage = msg.get("usage")
                if d.get("type") != "assistant" or not usage:
                    continue
                key = (msg.get("id"), d.get("requestId"))
                calls[key] = usage  # the last line of a call holds its final usage
    return calls, sorted(times)


def totals(calls):
    out = {"input": 0, "cache_write": 0, "cache_read": 0, "output": 0, "calls": len(calls)}
    for u in calls.values():
        out["input"] += u.get("input_tokens") or 0
        out["cache_write"] += u.get("cache_creation_input_tokens") or 0
        out["cache_read"] += u.get("cache_read_input_tokens") or 0
        out["output"] += u.get("output_tokens") or 0
    out["total"] = out["input"] + out["cache_write"] + out["cache_read"] + out["output"]
    return out


def durations(times, idle_minutes):
    if len(times) < 2:
        return 0, 0
    wall = (times[-1] - times[0]).total_seconds()
    cap = idle_minutes * 60
    active = sum(min((b - a).total_seconds(), cap) for a, b in zip(times, times[1:]))
    return active, wall


def human_tokens(n):
    for size, unit in ((1e9, "B"), (1e6, "M"), (1e3, "K")):
        if n >= size:
            return f"{n / size:.1f}".rstrip("0").rstrip(".") + unit
    return str(n)


def human_time(seconds):
    m = int(round(seconds / 60))
    return f"{m // 60}h {m % 60:02d}m" if m >= 60 else f"{m}m"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=".")
    ap.add_argument("--session")
    ap.add_argument("--since", help="YYYY-MM-DD or an ISO time")
    ap.add_argument("--idle", type=float, default=5)
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    folder = log_folder(a.root)
    mains = sorted(glob.glob(os.path.join(folder, "*.jsonl")), key=os.path.getmtime)
    if not mains:
        print(f"No Claude Code session logs found in {folder}. Run this from the Root, or pass --root.")
        return 1
    since = None
    if a.since:
        since = parse_time(a.since if "T" in a.since else a.since + "T00:00:00+00:00")
        if since and since.tzinfo is None:
            since = since.replace(tzinfo=timezone.utc)
        ids = [os.path.basename(f)[:-6] for f in mains if since is None or
               datetime.fromtimestamp(os.path.getmtime(f), timezone.utc) >= since]
    elif a.session:
        ids = [a.session]
    else:
        ids = [os.path.basename(mains[-1])[:-6]]

    all_calls, active, wall = {}, 0, 0
    for sid in ids:
        calls, times = read_calls(session_files(folder, sid), since)
        all_calls.update(calls)
        act, w = durations(times, a.idle)
        active, wall = active + act, wall + w
    t = totals(all_calls)
    t.update({"sessions": len(ids), "active_seconds": round(active), "wall_seconds": round(wall)})

    if a.json:
        print(json.dumps(t, indent=2))
        return 0
    print(f"- Tokens: {human_tokens(t['total'])} (input {human_tokens(t['input'])}, cache write "
          f"{human_tokens(t['cache_write'])}, cache read {human_tokens(t['cache_read'])}, output "
          f"{human_tokens(t['output'])}; {t['calls']} model calls, {t['sessions']} session(s))")
    print(f"- Time: {human_time(active)} active ({human_time(wall)} from first to last message)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
