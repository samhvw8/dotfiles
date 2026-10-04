# Delegation

An inline tool call beats an agent. Delegate when work is truly parallel, needs a
fresh context, or would flood this one — never to look thorough. `Agent`
delegates; `Skill` loads guidance for you to follow yourself.

- **At most 6 agents in flight, as a rolling pool.** When one finishes, start the
  next queued job; don't wait for a whole batch.
- **Subagent by default.** Spawn a named teammate only when you can name the second
  message you'll send it (debate, council, multi-round hand-off, a reviewer you'll
  consult again). Teammates need `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`; spawn
  them in one message, name their counterparts, shut them down when done.
- **Equip the agent.** It doesn't know what's installed. Name its tools — web:
  Parallax MCP (load via ToolSearch); code: codegraph MCP; browser: `bsk` CLI via
  `browser-skill`; GitHub: `gh` CLI — and its skills (`lead-researcher`,
  `code-quality`, `impeccable`, `git-workflow`).
- **Research:** read local first (code, config, git history) so queries are precise.
  Then search web and GitHub in parallel, say which approach you picked and why, and
  surface conflicts. Skip it for a known-cause bug or a mechanical change.
