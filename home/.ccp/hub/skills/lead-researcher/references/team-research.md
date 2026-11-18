# Team Research

Live, **supervised** multi-agent research on **harness-ops sessions** (the `agent-ops` skill). Each gatherer is a `harness-ops task new` worker in its own visible pane. It works in short rounds and reports only to the lead, so the lead steers the flow between rounds instead of only between waves. A shared **sources ledger** stops two gatherers from fetching the same page. The research counterpart to team-debate/team-brainstorm.

## Where the brain goes (read this first)

The forager loop (REASON → EXPAND → CHECK) is the **brain**. The venue decides who runs it:

| Venue | Forager brain runs as | Strategic oversight |
|-------|----------------------|---------------------|
| Inline (simple, focused) | the main agent, inline | same main agent |
| Workflow (complex, multi-domain) | an opus sub-agent per iteration (main asleep) | main agent, GOAL-CHECK after |
| **Team (live)** | **the lead (main session)**, between gatherer rounds | **the lead; Sam watches the panes and redirects through the lead** |

There is no separate steering-lead session. A task worker reports only to the session that started it, and a session in the middle would hide the gatherers from the lead and from Sam. The lead keeps its context small: it reads each round's short summary and opens a report only for a flagged finding.

## The org chart

| Role | Count | Job | Live role |
|------|-------|-----|-----------|
| **Lead** | main session | Plan, start the tasks, run the forager brain each round, route load-bearing claims to the verifier, decide exit, GOAL-CHECK, synthesize, accept and close every task | the session's own model |
| **Gatherer** | 2–3 | deep-gather search-fetch on its topic×language, in rounds; claim each page in the ledger before fetching; obey steering | `peer` (Claude Code): a gatherer needs the Agent tool, the Parallax MCP and the deep-gather and gather-squad skills, which the `fast` roster harnesses lack; it spawns its own source slices as plain subagents per [gather-squad](gather-squad.md), on the gatherer tiers in [workflow-venue](workflow-venue.md#model-tiering-workflows) |
| **Verifier** | 1 | Started on the first load-bearing claim; cross-checks each claim it gets and returns a verdict | `other-family`, so the check does not share the gatherers' blind spots |

Roles map to launch commands only in the agent-ops roster ([roster](../../agent-ops/roster.md)).

## Why live rounds beat fire-and-forget gatherers

| | Direct/Workflow gatherers | Team gatherers |
|---|---|---|
| Findings reach the brain | at end of the wave (batched) | **each short round**, or at once on a flag |
| Flow adapts | between waves | **between rounds, mid-search** |
| Dead ends | run to completion, then pruned | **stopped at the end of the round that shows them** |
| Contradictions | reconciled in synthesis | the lead sees both sides in round summaries and steers both gatherers |
| Duplicate fetches | possible across agents | **none: each page is claimed once in the ledger** |
| Verify | streaming pipeline (workflow) | **on demand**, targeted at load-bearing claims |

Use the team venue when you want to steer live and findings must cross-check as they arrive. For autonomous, deep, budgeted, resumable runs, the **Workflow venue is still better** (it persists STATE and runs while you're away). Team venue does not persist/resume and costs your live attention.

## Prerequisites

- `harness-ops` on `PATH`; load the `agent-ops` skill before the first `task new`. Without it, use Direct or Workflow.
- **Main session only.** Sam must see the panes, and the lead must steer each round. Spawn depth is capped at 2: gatherers and the verifier are depth 1, and their slices are plain subagents, not sessions.
- At most 6 tasks per owner: 3 gatherers + 1 verifier + 1 gap gatherer fits.
- In `omp`, the transport is named `task` items with `write agent://<id>` instead; the rounds, ledger and roles stay the same.

## The lead's playbook

1. **Plan as normal.** Run Phase 0–2 (triage, confirm plan, decompose, language matrix, elite forums). Team venue reuses all of it.
2. **Make the run folder.** Under the research output folder, create `ledger.md` with one header line (`URL | task | status | takeaway`), one report path per gatherer, and one brief per gatherer from the template below. Use absolute paths: sessions do not share your working directory or history.
3. **Start the gatherers** together, one `task new` per assignment, as `peer` (`claude`, no `--command`):
   ```bash
   harness-ops task new claude --title gather-<topic>-<lang> --cwd <run folder> --brief-file <run folder>/brief-<topic>-<lang>.md
   ```
4. **Steer each round.** Block on `harness-ops task wait --any --timeout 900`. Read the summary (`task show <id>`) and the new findings it points to. Run REASON/EXPAND/CHECK, then send the next round: `harness-ops task send <id> "Round N: deepen X | pivot to Y | stop and finish the report"`. Start a gap gatherer if a new sub-topic needs one.
5. **Verify on demand.** On the first load-bearing claim, start the verifier (`task new`, role `other-family`) with its brief and the claim. Send later claims with `task send <verifier-id> "<claim + originating URL>"`.
6. **Exit.** When hypotheses settle, new-info-per-token collapses, or coverage is met, send every gatherer `stop and finish the report` and wait for each final `task done`.
7. **Synthesize + GOAL-CHECK.** Merge into the cited report (Phase 5 format) and score it against the original goal. Then `harness-ops task accept <id> --close` for every task, and run `task ls` to confirm nothing is left open.

Follow the agent-ops rules for a task that fails to start or stops answering: `read` it once, `task close --force <id>`, tell Sam before you start a replacement.

## Task briefs (templates)

**Gatherer** — role `peer`:

```
You are a gatherer on a live research run. The lead (the session that started this
task) steers you between rounds. Load the deep-gather skill and run its search-fetch
loop on YOUR assignment only.

ASSIGNMENT: {1 sub-topic} in {1 language}.   Source stack: {stack}.
Elite forums for {lang}: {forums} — use site: targeting on ≥2.
REPORT: {absolute path}   SOURCES LEDGER: {absolute path}
SLICES: spawn {kept slices + budgets} as plain subagents per {absolute path to
gather-squad.md}. Give each slice the ledger path and the ledger rules below.

Sources ledger (shared by every gatherer, so no page is fetched twice):
- Before you open a URL, grep the ledger for it. If it is there, do not fetch it;
  use the takeaway on that line.
- If it is not there, append `<URL> | {task id} | claimed` first, then fetch. After
  the fetch, append `<URL> | {task id} | GEM|MEH|dead | <one-line takeaway>`.
- Append only, one line per shell `>>` command. Never edit or rewrite the file: other
  gatherers write to it at the same time.

Rounds:
- Add each finding to your report as you find it: claim + source URL + confidence.
- End the round with `task done --status ok` after 3–5 new GEMs, or at once on a
  flag: a contradiction, a load-bearing claim, or a new sub-topic. Summary in at most
  10 lines: the new findings by number in your report, the flags, your next step.
- The next round arrives as a message: deepen, pivot, or stop. Do what it says.
- On stop, finish the report (with UNOPENED LEADS) and report done.

Report only to the lead; do not message other gatherers. Edit only your report and
the ledger. Do not start harness sessions.
```

**Verifier** — role `other-family`:

```
You are the VERIFIER on a live research run. The lead sends you one claim at a time,
with its originating URL. For each claim:
1. Find INDEPENDENT primary/practitioner sources. A source the ledger
   ({absolute path}) already lists for this claim does not count as independent.
2. Verdict: CONFIRMED (≥2 independent) / WEAK (1 / blog-only) / REFUTED (+ the counter-source).
3. Report with `task done --status ok`: verdict + source URLs. The next claim opens
   the next round.
Be brutal and concise. Read the ledger; do not write to it. Edit no files. Do not
start harness sessions.
```

## Coordination rules (make it work, not loop)

- **Short rounds** — a round ends after 3–5 GEMs or on a flag; that is what makes live steering possible.
- **Content in files, control in messages** — findings go in reports and the ledger; round summaries and `task send` carry pointers and orders, not raw dumps. Roll up old knowledge so the lead's context stays bounded.
- **The lead owns exit** — gatherers never stop on their own; the lead decides from the forager exit signals and closes every task it started.
- **Verify only load-bearing claims** — not everything; the verifier is on-demand, or the run drowns in cross-checks.
- **Anti-sycophancy** — the lead pushes gatherers off thin single-source claims; the verifier defaults to WEAK when uncertain.

## Activation

| Path | How |
|------|-----|
| **Explicit** | User says "**team research**" / "research with me" / `/lead-researcher team <topic>` → team venue, skip the toggle |
| **Phase-0 toggle** | A yes/no in Phase 0: *"Run as live Team Research (gatherer and verifier sessions, steered by the lead round by round)?"* |

## Related

- `../SKILL.md` — venues and phase flow; `iterate-loop.md` — Execution Engine venues; `planning.md` — Phase 0 triage, planning phases
- `forager/overview.md` — the brain (REFLECT/STEER = REASON/EXPAND/CHECK)
- `adaptive-research/overview.md` — the batched (workflow) adaptive loop this complements
- `../../deep-gather/SKILL.md` — gatherer search-fetch methodology
- `../../agent-ops/SKILL.md` — harness-ops tasks ("Task or subagent"), "Live team", "Roles"; `../../agent-ops/roster.md` — role to launch command
- `../../heavy-think/references/team-debate.md` · `../../heavy-think/references/team-brainstorm.md` — sibling live protocols
