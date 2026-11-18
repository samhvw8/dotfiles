# agent-ops: live team

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Live team

A live team is 2 to 6 harness sessions that answer one question together: a debate, a council, a
brainstorm or a review. It is the live transport for the `debate`, `council`, `heavy-think` and
`lead-researcher` skills. Their sub-agent modes cost less: use those when the members need no live
exchange. You are the lead: you hold the turns and write the result. You don't do the work and don't
judge the members' ideas while they work.

The team talks on three layers:

| Layer | What | Rule |
|---|---|---|
| Record | One board file; each member appends one block per turn, headed `## Round N — <name>`, never rewriting it | Your result cites the board |
| Control | Only you open and close rounds | Members send you only `DONE round N`, or `BLOCKED round N: <reason>`: no content in messages |
| Duel | You open a direct channel between 2 or 3 named members for one round | Turn token, at most 3 messages each, ends with `DUEL DONE` between them; the first-named member appends the outcome; each sends you `DONE round N` |

Pick the shape by size:

| Members | Shape |
|---|---|
| 2 | Round 1 alone, then each round is a duel between the two, plus the board |
| 3 | Your turns; open a duel when two members disagree on one point |
| 4–6 | Your turns and the board only. No duels: too many messages to follow |

Pick each member's role and the diversity setting (## Roles, `roles.md`), and its launch command from `roster.md`.
agy members need the `command(harness-ops)` rule in agy's settings; check it before using agy roles (`roster.md`).

1. Fill in `group-brief.md` (next to this file) and file it with `harness-ops note group-<topic>`, which
   prints its path. Create the board `~/.cache/agent-ops/group-<topic>-board.md` with one heading per member. Write every path
   in a brief as an absolute path (no `~`): an agy member works in another folder.
2. Start each member with `harness-ops spawn <harness> --cwd <dir> --command "<roster command>"
   --label team-<topic>-<n> --prompt-file <brief>`, or send the brief to a running session with
   `Your turn: accept or decline`. A member you spawned that stops on a permission dialog sends you a
   `pane ... DIALOG` notice: answer it as in ## Task or subagent in `SKILL.md`, whatever round it is. A member you
   found running is not yours to answer: tell Sam.
3. **Round 0, append check:** each member appends `## Round 0 — <name> ready: <method>` and answers
   `DONE round 0`. A missing line means that member has no working append: give it its own file
   (`<board>.<name>.md`) and join it into the board yourself. omp's top-level bash refuses `>>`; its
   working method is `sh` inside `eval`.
4. **Round 1, alone:** send every member `Your turn: round 1`. Each writes under its own heading
   without reading the others, so the first ideas stay independent, then answers `DONE round 1`.
5. **Later rounds, in turn:** send `Your turn: round N` to one member at a time, in a fixed order.
   Each reads the whole board, builds on or challenges the others' entries under its own heading,
   and answers `DONE round N`. At most 3 rounds.
6. **Duel (when the shape allows):** fill in `duel-brief.md` (the point, each side and the scribe, the
   member who starts and writes the outcome) and file it with `harness-ops note duel-<topic>-<N>`.
   Send each duel member `Your turn: duel round N, brief <path>`. A duel counts as that round for its
   members. End your turn: each duel member's `DONE round N` wakes you. Then read the outcome on the board.
7. **Close:** write what survived and what stays disputed at the end of the board, and send every
   member `GROUP DONE: <board path>. No reply needed.` Report the result to Sam. Close the members you
   spawned; sessions you found running stay open.

Outside a duel, only you send `Your turn:`, and members answer only you, so the harnesses never trade
replies in a loop. A member that gives no `DONE` gets one `read` and is then skipped for that round.
For a duel, run one `wait-idle <scribe> --timeout 900` in the background as a watchdog. When it ends
without every `DONE round N`, `read` the duel members once, send each `DUEL DONE: closed by the lead`,
and append what you saw to the board yourself. The rules are the shared live protocol in the
`thinking-skills` repo (`heavy-think/references/live-protocol.md`); this section is its harness-ops form.
