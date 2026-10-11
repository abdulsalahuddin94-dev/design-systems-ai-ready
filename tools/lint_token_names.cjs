#!/usr/bin/env node
// Token name linter for a DS folder's data/tokens.json (names exactly as in Figma, keys "<Collection>::<name>").
//
//   node tools/lint_token_names.cjs <DS folder>            errors -> exit 1, warnings listed
//   node tools/lint_token_names.cjs <DS folder> --strict   warnings also exit 1 (CI for Team repos)
//   node tools/lint_token_names.cjs <DS folder> --json     machine-readable findings
//
// Adapted from michaelwnau/figma-design-system-engineering `scripts/lint_token_names.js` (MIT): same idea (one pass,
// errors vs warnings, an exit code for CI), but our names follow each platform's own convention (Tailwind-style on Web,
// HIG names on iOS, md.sys on Android), so instead of one fixed domain.category.variant pattern it checks what holds on
// every platform: clean "/" segments, no duplicates, no abbreviations or typos, Semantic aliases Primitives, one naming
// style per collection, no hue names in Semantic names. Per-platform allowances: tools/token_lint_rules.json.
//
// Original reference templates (references.json) are only reported, never "fixed": Fix on create fixes the project copy.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const asJson = args.includes("--json");
const folder = args.find((a) => !a.startsWith("--"));
if (!folder) {
  console.error("Usage: node tools/lint_token_names.cjs <DS folder> [--strict] [--json]");
  process.exit(2);
}
const file = path.join(folder, "data", "tokens.json");
if (!fs.existsSync(file)) {
  console.error(`No ${file}: run tools/build_tokens.py first.`);
  process.exit(2);
}
const tokens = JSON.parse(fs.readFileSync(file, "utf8"));
const rules = JSON.parse(fs.readFileSync(path.join(__dirname, "token_lint_rules.json"), "utf8"));
const platform = String((tokens.meta && tokens.meta.platform) || "Web").toLowerCase();
const plat = rules.platforms[platform.includes("android") ? "android" : platform.includes("ios") ? "ios" : platform.includes("adaptive") ? "mobile-adaptive" : "web"] || {};
const allowed = new Set([...(rules.allowed_short || []), ...(plat.allowed_short || [])].map((s) => s.toLowerCase()));
const abbreviations = rules.abbreviations || {};
const typos = rules.typos || {};
const hues = new RegExp("(^|[\\s/._-])(" + rules.hue_names.join("|") + ")([\\s/._-]|\\d|$)", "i");

const findings = [];
const add = (severity, rule, name, message) => findings.push({ severity, rule, name, message });

const vars = Object.values(tokens.variables || {});
const roleOf = (col) => ((tokens.collections || {})[col] || {}).role || "";

// Collection names count as names too.
for (const col of Object.keys(tokens.collections || {})) {
  if (col !== col.trim() || /\s{2,}/.test(col)) add("error", "spaces", col, "Collection name has leading, trailing or double spaces.");
  for (const word of col.toLowerCase().split(/[^a-z]+/)) if (typos[word]) add("error", "typo", col, `"${word}" looks like a typo of "${typos[word]}".`);
}

const seen = new Map();
const styles = {};
for (const v of vars) {
  const full = `${v.collection}::${v.name}`;
  const segs = v.name.split("/");
  // errors
  if (segs.some((s) => s.trim() === "")) add("error", "empty-segment", full, "Empty segment (// or a leading / trailing slash).");
  if (segs.some((s) => s !== s.trim())) add("error", "spaces", full, "A segment starts or ends with a space.");
  if (/\s{2,}/.test(v.name)) add("error", "spaces", full, "Double space in the name.");
  const lower = `${v.collection}::${v.name.toLowerCase().replace(/\s+/g, " ")}`;
  if (seen.has(lower)) add("error", "duplicate", full, `Same name as ${seen.get(lower)} apart from case or spaces.`);
  else seen.set(lower, full);
  if (roleOf(v.collection) === "semantic" && v.type === "color") {
    const rawVals = Object.values(v.values || {}).filter((x) => !(x && typeof x === "object" && x.alias));
    // Transparent state layers, scrims and tints may stay raw (decisions.md > Alpha colors): only opaque ones count.
    const opaque = rawVals.filter((x) => !/^#[0-9a-f]{6}(?!ff)[0-9a-f]{2}$/i.test(String(x)));
    if (opaque.length) add("error", "semantic-raw", full, "Semantic color holds a raw value; it must alias a Primitive.");
    else if (rawVals.length) add("warning", "semantic-raw-alpha", full, "Transparent Semantic color holds a raw value; fine for a state layer or scrim, otherwise alias a Primitive.");
  }
  // warnings
  const words = v.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const w of words) {
    if (typos[w]) add("error", "typo", full, `"${w}" looks like a typo of "${typos[w]}".`);
    else if (abbreviations[w] && !allowed.has(w)) add("warning", "abbreviation", full, `"${w}" is an abbreviation; write "${abbreviations[w]}" (rule: no abbreviations).`);
  }
  if (/[^\x00-\x7F]/.test(v.name) && !(plat.allow_non_ascii)) add("warning", "non-ascii", full, "Non-ASCII character (emoji or symbol) in a variable name breaks code syntax; keep it in a group or page name instead.");
  if (roleOf(v.collection) === "semantic" && hues.test(v.name)) add("warning", "hue-in-semantic", full, "Semantic name contains a hue; name the role (primary, success, surface), not the color.");
  // naming style per segment, counted per collection
  for (const s of segs.slice(0, -1).concat(segs.slice(-1))) {
    const st = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) ? "kebab" : /^[a-z]+([A-Z][a-z0-9]*)+$/.test(s) ? "camel" : /^[A-Z0-9][a-z0-9]*( [A-Z0-9][a-z0-9]*)*$/.test(s) ? "Title Case" : /^[A-Z0-9][A-Za-z0-9]*$/.test(s) ? "Pascal" : "mixed";
    ((styles[v.collection] ||= {})[st] ||= []).push(full);
  }
}
for (const [col, byStyle] of Object.entries(styles)) {
  const counts = Object.entries(byStyle).map(([k, list]) => [k, list.length]).sort((a, b) => b[1] - a[1]);
  if (counts.length > 1 && counts[1][1] >= 3) {
    add("warning", "mixed-style", col, `Collection mixes naming styles: ${counts.map(([k, n]) => `${k} ${n}`).join(", ")}. Pick one (the platform Main Skill's) for new names.`);
  }
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warning");
if (asJson) {
  process.stdout.write(JSON.stringify({ platform, variables: vars.length, errors: errors.length, warnings: warnings.length, findings }, null, 2) + "\n");
} else {
  const byRule = {};
  for (const f of findings) (byRule[`${f.severity} ${f.rule}`] ||= []).push(f);
  for (const [k, list] of Object.entries(byRule)) {
    console.log(`${k} (${list.length})`);
    for (const f of list.slice(0, 12)) console.log(`  ${f.name}: ${f.message}`);
    if (list.length > 12) console.log(`  ... ${list.length - 12} more (--json for all)`);
  }
  console.log(`Token names: ${vars.length} variables, ${errors.length} errors, ${warnings.length} warnings (${platform}).`);
}
process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
