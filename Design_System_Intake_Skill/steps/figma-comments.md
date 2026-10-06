# Figma comments: read them and act on them (optional)

Part of `Design_System_Intake_Skill` (section 14; map in `SKILL.md` section 0c). Optional (Abdul, 2026-10-06): load it **only** when the user asks Claude to read a file's comments or act on them. It never runs by default, is never offered or asked about, and never blocks a step. It works in any path (full project, quick mode, Scenario C, screens). Every `Ask (choice)` / `Ask (multi)` here also gets "Back" (`SKILL.md` section 0).

## 14. Figma comments

**The ✅ rule.** A comment with a ✅ reaction (`:white_check_mark:`) is already fixed. Claude puts ✅ on every comment it fixes, and never touches a comment otherwise: no resolve, delete or reply unless the user asks for that.

### 14.1 Read

- Tool: figma-console-mcp `figma_get_comments` with `include_resolved: true` and the file URL. It calls the Figma REST API, so it does not need the Desktop Bridge plugin. FigCli Yolo and the Plugin API cannot read comments.
- Token: `FIGMA_ACCESS_TOKEN` in the figma-console MCP config, with scope `file_comments:read` (`file_comments:write` for the ✅ step). The user creates and edits the token; Claude never writes a token or reads token env vars. The MCP loads it only at Claude Code startup: after a token change, quit Claude Code fully and start a new session. `401 Invalid token` -> the token is wrong or missing the scope; the user replaces it.
- A large file can return more than the tool output limit; the output is saved to a file. Summarize it with a short script, not by reading it whole (section 0c).
- Each comment has `id`, `parent_id` (empty for a thread, the thread id for a reply), `user.handle`, `created_at`, `resolved_at`, `message`, `reactions[]` (`emoji`, `user`) and `client_meta` (`node_id`, `node_offset`, `stable_path`; a region pin adds `region_width`, `region_height`, `comment_pin_corner`).

### 14.2 Fix list

1. Skip a thread when it is resolved or already has a ✅ reaction (from anyone).
2. Group the open threads, with their replies, by screen: map `client_meta.node_id` to page / top frame / layer with one read-only script through the Desktop Bridge (`figma.getNodeByIdAsync`). If the Bridge is not connected, group by node id and say so.
3. Sort each thread into one of three kinds: **fix** (a clear change), **decision** (a question, or a choice for the user or the team) or **info** (no change).
4. Show the fix list: per screen, author, the comment in one line, the proposed change, its kind. Ask (choice): "Fix these?" "Fix all" / "Pick which ones" (description: list ids in Other) / "Don't change anything". Decisions are only listed for the user, never built. No Figma change before this answer.

### 14.3 Fix and mark

- Each fix follows the normal rules of its path: DS components and variables only, atomic tiers, screen fidelity, the file check and the audit (section 7f for screens, ds-auditor for the DS file).
- After the fix is done and the audit passes, add ✅ to that comment: `POST https://api.figma.com/v1/files/<file_key>/comments/<comment_id>/reactions` with body `{"emoji": ":white_check_mark:"}`. Use a tool that sends it with the configured token; never print or copy the token. If no tool can send it, or the token lacks `file_comments:write`, list the fixed comments (author, first words, id) for the user to react ✅ by hand.
- A fix that failed or was only partly done gets no ✅; report it.
- Log it: project `CHANGELOG.md` entry (`Figma comments: <n> fixed, <n> decisions, <n> skipped`), or the chat in quick mode for an unregistered file (13.4).
