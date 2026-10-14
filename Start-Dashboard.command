#!/bin/bash
# Double-click to open the workflow dashboard in your browser (http://localhost:4777).
# It runs Claude Code in this folder with the same skills and rules. Keep this window open while you use it.
cd "$(dirname "$0")/dashboard" || exit 1
command -v node >/dev/null 2>&1 || { echo "Node.js is missing. Double-click Setup-Mac.command first."; read -r -p "Press Return to close"; exit 1; }
if [ ! -d node_modules/@anthropic-ai/claude-agent-sdk ]; then
  echo "Installing the dashboard the first time..."
  npm ci --omit=dev --no-audit --no-fund || { echo "The install failed. Check the internet connection and try again."; read -r -p "Press Return to close"; exit 1; }
fi
node server.mjs --open
