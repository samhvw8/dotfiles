# agent-ops: swarm

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Swarm

A swarm sends up to 6 workers down different directions at once, a manager checks their drafts, and
you steer. Use it when a job splits into independent directions and you want many drafts fast: a wide
brainstorm, a design-space sweep, alternative plans. When members must hear and answer each other, use
a live team instead.

| Layer | Role (## Roles, `roles.md`) | Job |
|---|---|---|
| Director | `director`: you, the lead session | Writes the cards, steers, spot-checks, writes the synthesis |
| Manager | `other-family`, one `task new` | Starts the workers, checks each draft against its card, reports one table per round. Never ranks directions |
| Workers | `fast`, up to 6, started by the manager with `task new` | One card each, kept open across rounds with `task send`, so each harness starts once |

Depth: you → manager (1) → workers (2) fits `TERMCTL_MAX_DEPTH=2`, so workers cannot start tasks. The
manager owns the workers, which keeps them inside the 6-tasks-per-owner limit. agy members need the
`command(harness-ops)` rule in agy's settings; check it before using agy roles (`roster.md`). The manager runs
harness-ops itself, so this applies to it.

1. Make a run folder `~/.cache/agent-ops/swarm-<topic>/`. Write `cards-round-1.md`: one card per
   worker (id, direction, what to produce, limits). Make the directions differ in kind, not variants
   of one idea, and add one wildcard card that leaves the obvious frame. Write the output schema
   into the folder too.
2. Copy `worker-brief.md` into the folder and fill in what all workers share (inputs, schema). Fill
   `manager-brief.md` as `manager.md` with the paths, the worker harness and the `fast` command from
   `roster.md`. Use absolute paths everywhere.
3. Start the manager: `harness-ops task new <harness> --command "<other-family command>" --title
   swarm-<topic> --cwd <dir> --brief-file <run folder>/manager.md`. End your turn.
4. **Each round:** the manager's `task done` brings `report-round-<N>.md`: one row per card, with a
   verdict `followed`, `drifted: <how>` or `failed`. Spot-check one draft against its card. When your
   verdict differs from the manager's, check every draft of that round yourself and tell the manager
   what it missed.
5. Decide per direction: keep, kill or merge. Write `cards-round-<N+1>.md` and send it with
   `task send <manager-id> "Round N+1: cards <path>. Close workers: <ids or none>."`.
6. Run 2 to 4 rounds. Then write the synthesis, citing the draft files. Send the manager `Swarm done:
   close every worker, then report`. When it reports, `task accept <manager-id> --close`, and check
   `task ls` and `ls --mine` for anything still open.
