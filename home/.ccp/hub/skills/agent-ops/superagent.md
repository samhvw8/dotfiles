# agent-ops: superagent mode

Part of the agent-ops skill (`SKILL.md` next to this file has the commands). Superagent mode turns
the current session into a receptionist that routes work to long-term area leads, an optional
advisor, and short-lived workers. It adapts to **workload** (concurrency, quota) and **worktype**
(build, research, writing, ops, or mixed). Toggle it on or off per session; nothing loads when off.

## The superagent note

One file holds the whole run: its rules, the state of each lead, and what waits on Sam. It is the
receptionist's agent note (`memory.md`), so it lives with the other notes:
`~/.local/state/agent-ops/agents/<project>/receptionist.md`.

- **One writer:** only the receptionist edits it. Leads report with `harness-ops report`; you copy
  what matters into the note.
- **A snapshot, not a log.** Replace a lead's section when its state changes. Delete it when its scope
  is detached and accepted. Stay under about 80 lines. History stays in the journal (`harness-ops log`).
- **Update it** after every lead report, every decision you make for Sam, every question to Sam and his
  answer, and before you end a turn with work in flight.
- **Edit `## Runtime State` in place** to change the run (advisor on or off, a role override). Keep the
  top lines fixed, so mid-run edits keep prompt-cache hits. Then tell each active scope:
  `harness-ops send <scope> "Run state changed: re-read <note path> before your next spawn or escalation."`

```markdown
# Superagent — <project>
Rules: agent-ops superagent.md · History: harness-ops log --project .
Updated: <local time>

## Runtime State
- Advisor: active | off
- Areas:
  - <area>: worktype=<build|research|writing|ops> · eviction=<drift-gated|per-slice|1-turn> · verifier=<tests|sources|rubric|none>
- Role command overrides (replace roster.md on the next task new): none

## Waiting on Sam
- <lead>: <question, one line> (asked <time>)   ← empty when nothing waits

## Leads
### <area> — scope <name> · pane <target> · <harness/model>
- Goal: <one line> · Note: <its agent note path>
- Status: working | idle | blocked | done-unaccepted
- Last heard: <time> — <last report, one line>
- Waiting on: Sam | advisor | worker <task id> | nothing
- Decided for Sam: <decision, time> (only within the mandate)
- Next check: <what you expect next, and by when>

## Parked
- <side issue a lead raised; not acted on>
```

## Toggle

- **On (`superagent on [context]`):**
  1. Run `harness-ops resume .` and `scope ls --all`. If a superagent note exists (`resume` shows its
     `policy` pointer), reload it instead of starting a second run.
  2. Otherwise write the superagent note from the template: pick the tiers from the workload and set
     each area's worktype. Then file a pointer to it, so `harness-ops resume .` leads back to it:
     `harness-ops note policy "Superagent note: <note path>"`.
  3. Attach each workstream pane as an area lead:
     `harness-ops attach <pane> --name <area> --about "note: <agent note path>; worktype: <type>" --sub-depth 1`.
     Each area lead and the advisor is a long-term agent with its own agent note (`memory.md`). Reuse an
     area's existing name and note when `scope ls --all` or the notes folder has one.
  4. Start or attach one **advisor** (role `advisor`, `--sub-depth 1`) only for 2+ concurrent areas,
     open design or research, or high-risk delivery. An agy advisor follows `roster.md` (## agy members).
- **Status (`superagent status`):** run `harness-ops scope ls --tree` and `task ls --tree`. Report the
  active scopes, open tasks, `## Runtime State` and `## Waiting on Sam` from the note.
- **After compaction or restart:** run `harness-ops resume .` and `scope ls --tree`, then read the note
  before you route new work. Check each lead's `Last heard` against
  `harness-ops log --scope <name> --since <that time>` and update the note.
- **A lead or the advisor crashed** (`scope <name> (...): pane ... exited/lost`): start a replacement
  from `roster.md`, rebind it with `harness-ops attach <new-pane> --name <name> --about "note: <its note path>" --sub-depth 1`,
  and send it: read your note, then run `harness-ops resume <name>`.
- **Off (`superagent off`):**
  1. File the superagent note as the handoff: `harness-ops note handoff --file <note path>`.
  2. Run `harness-ops detach <scope>` on each attached scope. It leaves the panes open and stops the
     30 s idle watcher. Add `--keep` to keep the scope in the default `scope ls`.
  3. Accept and close finished Tier 2 tasks (`task ls`), then return to normal single-agent mode.

## Adapt by worktype and workload

One run can hold areas of different worktypes. Set each area by its worktype:

| Worktype | Active tiers | Handoff | Worker reuse | External check |
|---|---|---|---|---|
| **Build** (code, data, infra) | Receptionist, area lead, worker, verifier (+ advisor for design or review) | `brief.md`, plus `progress.md` for work over 1 turn | Keep the worker warm across fix rounds (`task send`); advisor audits `progress.md`; short verifier (`--reuse` per diff slice) | Tests, builds, linters, schema validators |
| **Research / analysis** | Receptionist, area lead, advisor, workers | `brief.md` + `progress.md` (questions, sources checked, gaps) | New worker per sub-question (`--reuse`); keep the advisor warm for synthesis | Source and fact checks, rubric |
| **Writing / strategy** | Receptionist, area lead, advisor (+ worker for drafts) | `brief.md` (audience, tone, limits) + the draft | Keep the drafter warm across revisions; advisor reviews against the brief; `deep` only for high-stakes positioning | Rubric, fact check, Sam's sign-off before anything goes out |
| **Ops / triage** | Receptionist, area leads (+ fast leaf workers) | Short `brief.md` only | Short-lived workers; no standing advisor unless a root cause is unclear | Live status or log check; Sam's approval before any change or outward action |

Change `## Runtime State` as the load changes:
- **Low load:** detach the advisor (`detach advisor`); area leads run workers directly.
- **High load or high risk:** attach the advisor and require a `progress.md` drift audit before delivery.
- **Quota or latency pressure:** set a role command override. It applies on the next `task new`.

## Tiers and what each may do alone

termctl enforces the depth through `--sub-depth` (exit 6). Models come from `roster.md` by role.

| Tier | Who | `--sub-depth` | How it starts | Safe actions without Sam |
|---|---|---|---|---|
| 0 | Receptionist: this session, in any harness | root | Never started | Intake, routing, `ls`/`scope ls`/`read`, attaching area leads, `answer`/`deny` on safe in-brief dialogs, workers for clear briefs, `--accept-trust` on every `spawn`/`task new` (it only trusts folders under the user's trust roots) |
| 1 | `advisor` (review and drift audits) | `1` | `attach` | Plans, specs, review, `progress.md` drift audits, spawning `deep` when truly blocked. Read-only unless the brief grants edits |
| 1 | Area lead (one workstream) | `1` | `attach <pane> --name <area> --sub-depth 1` | Owns one area, starts tier 2 workers and verifiers by its worktype, reports milestones with `harness-ops report` |
| 2 | Worker (`builder` or `fast`) | `0` | `task new` | Works inside the brief's scope fence, keeps `progress.md` when required, reports with `task done` |
| 2 | Verifier (`fast` or `builder`) | `0` | `task new` / `--reuse` | Runs the external check on its slice; reports pass or fail with the raw output |
| 2 | `deep` (advisor only) | `0` | `task new` | Settles one narrowed deadlock, high-stakes trade-off, or second-family audit; closed after the verdict |

Escalation:
- **The receptionist never spawns `deep`.** A cheap router cannot tell a real deadlock from a weak
  brief, and `deep` costs 10–20 times more per turn. Route to the advisor first.
- **Go to the advisor** when the direction is open, the cause is unclear, work needs review before it
  ships or goes out, or a worker fails its check twice (send the failed attempts).
- **Go to Sam** only for irreversible or outward actions (messages to people, publishing, spending,
  deleting data, deploys, credentials, a trust prompt outside the trust roots) or an unstated priority.

## Two-file handoff and drift-gated eviction

Multi-turn work gets `brief.md` and `progress.md`. A 1-turn task gets only `brief.md`.

- **`brief.md`** (`harness-ops note`, then `--brief-file`): fixed for the round. Goal, scope fence (what
  not to touch or chase), inputs and the external check. Include: *"Park unrelated notes, old TODOs,
  superseded docs and side questions under `Parked` in `progress.md`; never chase or act on them."*
- **`progress.md`** (`~/.cache/agent-ops/<YYMMDD-HHMMSS>-<task>-progress.md`): the worker's live state
  (`Active TODOs`, `Current state`, `Blockers & Parked`), pruned in place. Never append forever: stale
  items in a warm context cause unprompted detours (+77% tokens, +105% wait time).

**Drift audit** (the advisor, before it keeps a multi-step worker warm): read `brief.md` and
`progress.md` directly, without interrupting the worker. Check every active TODO and touched file
against the brief's goal and scope fence. Return one verdict:
- **`KEEP`:** everything traces to the brief and the checks advance. Continue with `task send`.
- **`PRUNE`:** 1–2 stray items listed but not acted on. Remove them from `progress.md`, continue with `task send`.
- **`EVICT`:** the worker acted on out-of-scope work, used stale state, or failed the same check
  twice. Reset it with `task new --reuse`, booted from `brief.md` and the pruned `progress.md`.
