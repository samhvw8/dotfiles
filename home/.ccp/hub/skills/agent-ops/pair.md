# agent-ops: pairs

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Pair with a peer

A pair is two plain harness sessions working as equals (say Claude Code and omp): two models catch
different mistakes. It is not a task: no one leads, no one runs `task done`. Start a new partner with
`spawn`, never `task new`, or pair with a session that is already running (one Sam opened, or one
`ls` shows idle in the right folder).

A pair is a live team of two in which you are one member, so no one holds the lead. Its rules are
the duel rules (`duel-brief.md`) with a longer limit, 10 messages each, because a pair also builds. To facilitate two
other sessions instead, run a live team of 2 (## Live team, `live-team.md`).

Fill in `pair-brief.md` (next to this file) and file it with `harness-ops note pair-<topic>` (the text on
stdin, or `note --file F pair-<topic>`); it prints the brief's path. The brief already carries the rules below, so the peer
gets them without loading this skill. Then:

```bash
harness-ops spawn omp --cwd <dir> --label pair-<topic> --prompt-file <brief path>   # a new partner
harness-ops send <target> "Pair brief: <brief path>. Your turn: accept or decline"   # a running one
```

| Style | How it runs | Checkout |
|---|---|---|
| Driver / navigator | The driver edits and tests; the navigator reads the diff and the screen and challenges. Swap at each milestone. | One; only the driver edits |
| Solve apart, then merge | Both solve the same problem alone, then compare, argue the differences, keep the better parts. For hard bugs and design calls. | One worktree each |
| Split and sync | Each owns a part (API, UI) and they sync on every interface change. | One worktree each |
| Discuss | Debate (each argues a side), brainstorm (build on each other's ideas) or help each other think. Ends with what survived. | None; no edits |
| Advisor | You keep the work; the peer answers your questions and reads your files, and never edits. | Yours only |

You follow the rules in the brief too. Two more for the one who starts the pair:

- **Wait, don't watch.** After a `Your turn:` message, end your turn. If you spawned the partner,
  you may run one `wait-idle <peer> --timeout 900` in the background as a watchdog: when it ends
  with no reply, `read` the peer once and report to Sam.
- **Its dialogs come to you.** A partner you spawned that stops on a permission dialog sends you a
  `pane <pane> (pair-<topic>) DIALOG <fp>` notice, also while you wait for its turn. Answer it as in
  ## Task or subagent in `SKILL.md` (`answer` or `deny` with the pane), even outside the `Your turn:` rule: the
  partner is stalled until you do. A partner you found running is not yours: its dialogs are Sam's.
- **After `PAIR DONE`,** report the result to Sam. If you spawned the partner, `close` it; a session
  you found running stays open.
