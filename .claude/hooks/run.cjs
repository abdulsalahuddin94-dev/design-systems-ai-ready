// Shell-neutral hook launcher. settings.json runs
//   node -e "require(require('path').resolve(process.env.CLAUDE_PROJECT_DIR||'.','.claude/hooks/run.cjs'))" <hook> [args]
// which works the same in Git Bash and PowerShell (Claude Code on Windows uses PowerShell when Git is
// missing, and PowerShell does not expand "$CLAUDE_PROJECT_DIR"). Under `node -e` the extra words are
// process.argv[1..], so they are moved back to where a hook reads them (process.argv[2..]).
const path = require("path");

// Run directly (`node .claude/hooks/run.cjs <hook> ...`) the words start one place later.
const words = process.argv.slice(1);
if (words[0] && words[0].endsWith("run.cjs")) words.shift();
const [name, ...rest] = words;
if (name && /^[a-z_]+$/.test(name)) {
  const file = path.join(__dirname, name + ".cjs");
  process.argv = [process.argv[0], file, ...rest];
  require(file);
}
