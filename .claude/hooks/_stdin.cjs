// Shared helpers for the hooks. Hooks run with Node.js (already required by Claude Code setup,
// FigCli and Storybook), so a machine without Python never sees a hook error.
const fs = require("fs");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}") || {};
  } catch (e) {
    return null;
  }
}

module.exports = { readInput };
