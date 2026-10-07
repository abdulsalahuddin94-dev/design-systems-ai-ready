@echo off
rem Double-click to install everything this workflow needs (Node.js, Python 3, Git, Figma Desktop).
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\setup_windows.ps1"
