# Trial run findings (2026-09-30)

End-to-end trial of the workflow as a first-time user would get it (CLAUDE.md, then Design_System_Intake_Skill from Step 0).
Each entry: where it happened, what was unclear or broken, suggested fix.

## Findings

1. **Step 0 preflight: stale figma-console-mcp servers.** `figma_get_status` reported six other figma-console-mcp instances still running on ports 9223-9228 (some from the day before), so this session fell back to port 9229. It worked, but the Desktop Bridge plugin only talks to one port at a time, so a new user can easily end up with the plugin connected to a different session's server.
   Fix: in intake 0b, when `otherInstances` is not empty, tell the user in one line and show how to close old Claude sessions / kill stale `figma-console-mcp` node processes.

2. **First reply has two competing questions.** CLAUDE.md (and the SessionStart hook) require the Storybook question ("run / update from Figma / skip") in the first reply, while the intake says one question per message and starts with 0.1 project name. The Storybook question is also about the existing Trianglz Web Storybook, which means nothing to a new user starting their own project, and it overlaps with intake question 0.7.
   Fix: make the Storybook notice one informational line (no question) when the job is a new project, and let 0.7 carry the real Storybook question.
