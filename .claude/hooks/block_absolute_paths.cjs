// PreToolUse hook (Write|Edit|MultiEdit): block absolute machine paths in repo files.
//
// Skills, briefs, memory and data must use paths relative to the Root, so the folder
// works on any machine. Exit code 2 blocks the write and shows the reason to Claude.
const { readInput } = require("./_common.cjs");

const ABSOLUTE = new RegExp(
  String.raw`(?:(?<![A-Za-z0-9])[A-Za-z]:[\\/]+[A-Za-z0-9_]` + // D:\Work, C:/Users
  String.raw`|(?<![A-Za-z0-9.:/])/(?:Users|home|mnt/[a-z])/[A-Za-z0-9_])` + // /Users/x, /home/x, /mnt/c/x
  String.raw`[^\s` + "`" + String.raw`'"<>|]{0,40}`,
  "g"
);
const CHECKED = [".md", ".json", ".txt", ".mdx", ".ts", ".tsx", ".js", ".jsx", ".css", ".py", ".yml", ".yaml", ".cjs", ".mjs"];

function texts(ti) {
  const out = [];
  for (const key of ["content", "new_string"]) if (typeof ti[key] === "string") out.push(ti[key]);
  for (const edit of ti.edits || []) if (edit && typeof edit.new_string === "string") out.push(edit.new_string);
  return out;
}

function main() {
  const data = readInput();
  if (!data) return 0;
  const ti = data.tool_input || {};
  const file = String(ti.file_path || "").replace(/\\/g, "/");
  const root = String(data.cwd || "").replace(/\\/g, "/").replace(/\/+$/, "");
  const lower = file.toLowerCase();
  // Only files inside this repo, and never the hook itself or local settings.
  if (!file || (root && !lower.startsWith(root.toLowerCase()))) return 0;
  if (/(block_absolute_paths\.(py|cjs)|settings\.local\.json)$/.test(file) || !CHECKED.some((x) => lower.endsWith(x))) return 0;
  const hits = new Set();
  for (const t of texts(ti)) for (const m of t.matchAll(ABSOLUTE)) hits.add(m[0]);
  if (hits.size) {
    process.stderr.write(
      "Blocked: absolute machine path(s) found: " + [...hits].sort().join(", ") +
      ". Rewrite them relative to the repo Root (the folder with CLAUDE.md), " +
      "e.g. Web_Design_System_Skill/SKILL.md. See CLAUDE.md > Rules.\n"
    );
    return 2;
  }
  return 0;
}

try { process.exitCode = main(); } catch (e) { process.exitCode = 0; }
