# Delegation

Act as an orchestrator and verifier: delegate implementation, research, and
multi-file or remote slices to subagents; keep the main session focused on
planning, orchestration, and independent verification. Use an inline tool call
or `eval` cell (`await tool.mcp__*`, `await tool.*`, `workpool`) only for quick
checks, batching MCP/tool calls, and verifying results — never to do heavy
slice work inline in the main context. Subagent output is a claim, not proof;
verify it yourself. `Agent`/`task` delegates; `Skill`/`read("skill://<name>")`
loads guidance for you to follow yourself.

- **At most 6 agents in flight, as a rolling pool.** When one finishes, start the
  next queued job; don't wait for a whole batch.
- **Subagent by default.** Spawn a named teammate only when you can name the second
  message you'll send it (debate, council, multi-round hand-off, a reviewer you'll
  consult again). In Claude Code, teammates need `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`;
  in `omp`, pass `name` on `task` items and message peers via `write agent://<id>`
  (`agent://all` to broadcast). Spawn them in one message, name their counterparts,
  shut them down when done.
- **Equip the agent.** It doesn't know what's installed. Name its tools — web:
  Parallax MCP (`ToolSearch` in Claude Code; `eval` `tool.mcp__parallax_*` or `xd://`
  plus `web_search`/`read` in `omp`); code: codegraph MCP; browser: `bsk` CLI via
  `browser-skill` (or `omp` `browser` relay / `cua`); GitHub: `gh` CLI — and its
  skills (`lead-researcher`, `code-quality`, `impeccable`, `git-workflow`).
- **Shared machines:** a brief that touches one (the home box) states its safety
  rules up front — run `tmux ls`/`nvidia-smi` before adding load; never reboot or
  switch OS while another session's job runs (`send-home-desktop-cmd busy`). A rule
  sent mid-task arrives too late.
- **Research:** read local first (code, config, git history) so queries are precise.
  Then search web and GitHub in parallel, say which approach you picked and why, and
  surface conflicts. Skip it for a known-cause bug or a mechanical change.
