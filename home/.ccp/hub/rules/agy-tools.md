---
harness: [agy]
---
# AGY Tool Routing & Sandbox

- **MCP tools:** call via `call_mcp_tool` (for code questions: `ServerName: "codegraph"`, `ToolName: "codegraph_explore"`). For artifacts: `ServerName: "local-secrets_artifact-server"`.
- **Web & social:** use Parallax through its CLI (`parallax-cli` skill) over `search_web`.
- **Delegation:** use `invoke_subagent` for subagents; use `harness-ops` (`agent-ops` skill) for visible cross-harness teammates.
- **Known sandbox blockers:** `harness-ops` (iTerm2 AppleEvents `-600`), `parallax`, `gh`, `ssh`, `bsk`, and shell reads under `~/.gemini/antigravity-cli/brain/` fail inside the macOS terminal sandbox. Keep prep/build/test commands sandboxed and isolate only the blocked command with `BypassSandbox: true`.
