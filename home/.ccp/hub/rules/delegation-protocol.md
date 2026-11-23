# Delegation

Act as an orchestrator and verifier: delegate parallel, context-heavy, or
isolated slices (broad multi-module sweeps, research, remote jobs, independent
reviews) to subagents; keep the main session focused on planning, orchestration,
and verification. Keep small single-module reads, targeted edits, quick checks,
and batched `eval` tool calls inline under `rules/context-discipline.md` — a
cold-start subagent loses the main session's prefix cache and re-reads
overlapping files. Never do heavy slice work inline in the main context.
Subagent output is a claim, not proof; verify it yourself. `Agent`/`task`
delegates; `Skill`/`read("skill://<name>")` loads guidance for you to follow
yourself.

- **At most 6 agents in flight, as a rolling pool.** When one finishes, start the
  next queued job; don't wait for a whole batch.
- **A named harness teammate means agent-ops.** When Sam says "agy teammate", "omp
  teammate" or names a team, start it as a visible harness session with `agent-ops`
  (`harness-ops task new`), not as a headless print job (`agy -p`). Headless agy also
  denies every MCP tool.
- **Subagent by default.** Start a live member only when you can name the second
  message you'll send it (debate, council, multi-round hand-off, a reviewer you'll
  consult again). Live members are harness-ops sessions (`agent-ops` skill, "Live
  team"); in `omp`, pass `name` on `task` items and message peers via
  `write agent://<id>` (`agent://all` to broadcast). Start them together, send each
  the roster, close them when done.
- **Equip the agent.** It doesn't know what's installed. Name its tools — web:
  Parallax MCP (`mcp__claude_ai_Parallax__*` via `ToolSearch` in Claude Code; `parallax call` via the `parallax-cli`
  skill plus `web_search`/`read` in `omp`); code: codegraph MCP; browser: `bsk` CLI via
  `browser-skill` (or `omp` `browser` relay / `cua`); GitHub: `gh` CLI — and its
  skills (`lead-researcher`, `code-quality`, `impeccable`, `git-workflow`).
- **Shared machines:** a brief that touches one (the home box) states its safety
  rules up front — run `tmux ls`/`nvidia-smi` before adding load; never reboot or
  switch OS while another session's job runs (`send-home-desktop-cmd busy`). A rule
  sent mid-task arrives too late.
- **Hard limits go in the brief.** A limit from the user (scope, data size, no
  network, no GPU) is in the brief itself, never only in a later message: agents
  read messages only between long tool calls.
- **An unexplained kill means stop.** An agent whose job is killed without an
  explanation stops and asks; it never restarts the job on its own.
- **Research:** read local first (code, config, git history) so you know the terms. Still start broad.
  Then search web and GitHub in parallel, say which approach you picked and why, and
  surface conflicts. Skip it for a known-cause bug or a mechanical change.

## Same session or new session

A session's context is an asset while it is warm and relevant, and a cost on every
turn after that. Decide with three questions, in order. They also cover jobs not
named here.

1. **Must the result be independent?** A verdict on work (a review, a grade, a second
   opinion) goes to a new session that gets the requirements and the files, not the
   author's reasoning. A check a script can judge (tests, a build, a validator) is not
   a verdict: run it in the session that did the work.
2. **Does the session's context still pay?** Reuse the session when the next job needs
   what it already holds (the same files, the same decisions) and it is still warm:
   fixes after a review and follow-ups on the same work go back to their author. Start
   a new one when the job is unrelated or the session sat idle past its cache lifetime,
   because the old history is then paid in full on each turn and helps nothing.
3. **Would the work flood or block this session?** Broad sweeps, research and parallel
   independent slices go to their own sessions; only the conclusion comes back.

Reuse through the harness's follow-up channel: `SendMessage` to a finished subagent in
Claude Code, `task send` in `agent-ops` (`task new --reuse` clears the pane: it keeps
the process, not the context), a named `task` item in `omp`. Cache
lifetime differs by harness and model; when you do not know it, treat an idle session
as cold.
