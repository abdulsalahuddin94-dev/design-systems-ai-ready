@echo off
rem Double-click to open the workflow dashboard in your browser (http://localhost:4777).
rem It runs Claude Code in this folder with the same skills and rules. Keep this window open while you use it.
cd /d "%~dp0dashboard"
where node >nul 2>nul || (echo Node.js is missing. Double-click Setup-Windows.cmd first. & pause & exit /b 1)
if not exist node_modules\@anthropic-ai\claude-agent-sdk (
  echo Installing the dashboard the first time...
  call npm ci --omit=dev --no-audit --no-fund || (echo The install failed. Check the internet connection and try again. & pause & exit /b 1)
)
node server.mjs --open
pause
