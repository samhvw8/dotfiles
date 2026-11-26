# agent-ops: superagent mode

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving). Domain-agnostic: adapts dynamically to **workload** (concurrency, turn
volume, quota) and **worktype** (build, research, writing, ops, or mixed).

Toggle this mode **on** or **off** for the current session without changing `termctl` or paying always-loaded tokens when off.

---

## Toggle

- **ON (`superagent on [context]`):**
  1. **Idempotent check:** run `harness-ops scope ls` first. If scopes are already attached, reload the existing `policy.md` from `harness-ops resume .` instead of creating a duplicate policy.
  2. Otherwise, shape a run `policy.md` from the template at the bottom — picking active tiers from current **workload** and setting per-area rules from each area's **worktype** — and file it with `harness-ops note policy` (survives compaction; shown by `harness-ops resume .`).
  3. Create the overview file `superagent-note.md` (see "Overview note" below) and put its path in `policy.md`'s `Overview:` line, so `harness-ops resume .` leads back to it.
  4. Current pane becomes **Tier 0 (Receptionist)**.
  5. Attach existing workstream panes as **Area Scopes** (`harness-ops attach <pane> --name <area> --about "worktype: <type>; policy: <path>" --sub-depth 1`).
  6. Attach or start one **Advisor** (`--sub-depth 1`, role `advisor` from `roster.md`) only when workload or uncertainty warrants it (2+ concurrent areas, open design/research, or high-risk delivery). For any `agy` member, pass `--cwd ~` with absolute paths and check `command(harness-ops)` in `roster.md`.
- **Status (`superagent status`):** run `harness-ops scope ls --tree` and `harness-ops task ls --tree`, then report active scopes, open tasks, the `Runtime State` block from `policy.md`, and the `Waiting on Sam` list from `superagent-note.md`.
- **After compaction / restart:** run `harness-ops resume .` and `harness-ops scope ls --tree` to reload `policy.md` and active scopes, then read `superagent-note.md` (path in `policy.md`) before routing new work. Check each lead's `Last heard` against `harness-ops log --scope <name> --since <that time>` and update the note.
- **Advisor crash recovery:** on `scope advisor (...): pane ... exited/lost`, start a replacement (`advisor` in `roster.md`), run `harness-ops attach <new-pane> --name advisor --sub-depth 1`, and send it `policy.md` + `harness-ops resume advisor`.
- **OFF (`superagent off`):**
  1. Write one active-state handoff note (`harness-ops note handoff --file <superagent-note.md>`): the overview is the handoff.
  2. Run `harness-ops detach <scope>` on each attached scope (leaves panes open; stops the 30 s idle watcher immediately). Use `--keep` if you want the scope visible in default `scope ls` later.
  3. Accept/close finished Tier 2 tasks (`task ls`) and return to normal single-agent mode.

---

## Adapt by worktype & workload

One superagent session can supervise **mixed worktypes at the same time**. Set each Area Scope's behavior by its worktype rather than using one rigid recipe:

| Worktype | Active tiers | Handoff shape | Worker cache & eviction | External check / verifier |
|---|---|---|---|---|
| **Build** (code, data, infra) | Receptionist + Area Scope + Worker + Verifier (+ Advisor on design/review) | `brief.md` + `progress.md` for >1-turn tasks | Keep Worker warm across fix rounds (`task send`); Advisor audits `progress.md` for drift; short Verifier (`--reuse` per diff slice) | Tests, builds, linters, schema validators |
| **Research / Analysis** | Receptionist + Area Scope + Advisor + Workers | `brief.md` + `progress.md` (questions, sources checked, gaps) | Evict Workers per sub-question (`--reuse`); keep Advisor warm for cross-source synthesis | Source/fact verification, rubric or primary-source check |
| **Writing / Strategy** | Receptionist + Area Scope + Advisor (+ Worker for drafts) | `brief.md` (audience, tone, constraints) + draft file | Keep drafter warm across revision rounds; Advisor reviews against brief; skip `deep` unless high-stakes positioning | Rubric check, factual check, user sign-off before external send |
| **Ops / Triage / Queue** | Receptionist + Area Scopes (+ fast leaf Workers) | Short `brief.md` only (skip `progress.md` for 1-turn checks) | Short-lived Workers; **skip persistent Advisor** unless a root cause is unclear | Live status/log check; user approval before any mutating or external action |

**Scale dynamically with workload (edit `## Runtime State` mid-run):**
- **Low load / routine:** detach Advisor (`detach advisor`) so Area Scopes run Workers directly.
- **High load / high risk:** attach persistent Advisor (`--sub-depth 1`) and require `progress.md` drift audits before final delivery.
- **Quota or latency pressure:** set a role override in `## Runtime State` (takes effect on the next `task new` without restarting existing scopes).

---

## Tier ladder & autonomous authority

`termctl` hard-enforces topology via `--sub-depth` (exit 6). Models come from `roster.md` by role and can be overridden mid-run in `policy.md`'s `Runtime State`.

| Tier | Role (`roles.md`) | `--sub-depth` | Mechanism | Safe autonomous actions (no user approval needed) |
|---|---|---|---|---|
| 0 | `receptionist` (current pane) | root | Current pane | Intake, routing, `ls`/`scope ls`/`read`, attaching Area Scopes, `answer`/`deny` on safe in-brief prompts, spawning Workers for clear briefs. |
| 1 | `advisor` (reviewer & drift auditor) | `1` | `attach` (long-running scope) | Planning, specs, quality review, auditing `progress.md` for drift (`KEEP`/`PRUNE`/`EVICT`), spawning `deep` when genuinely blocked. Read-only unless brief grants edits. |
| 1 | Area Scope (workstream lead) | `1` | `attach <pane> --name <area> --sub-depth 1` | Owns one ongoing area; spawns Tier 2 Workers/Verifiers per its worktype; reports milestones via `harness-ops report`. |
| 2 | Worker (`builder` or `fast`) | `0` (leaf) | `task new` | Execute inside `brief.md`'s scope fence; maintain `progress.md` when required; report via `task done`. |
| 2 | Verifier (`fast` or `builder`) | `0` (leaf) | `task new` / `--reuse` | Run external checks on the named slice; report pass/fail with raw output. |
| 2 | `deep` (Advisor-only) | `0` (leaf) | `task new` | Resolve one narrowed deadlock, high-stakes trade-off, or second-family audit. Closed right after verdict. |

**Escalation rules (and why):**
- **Receptionist never spawns `deep` directly:** a cheap router cannot reliably separate a real deadlock from an underspecified brief, and `deep` models cost 10–20× per turn. Route to `advisor` first.
- **Escalate to `advisor`** when direction/strategy is open, the cause or answer is unclear, work needs review before shipping or sending externally, or a Worker fails its external check twice (include the failed attempts).
- **Escalate to the user** only for irreversible or external actions (sending emails/messages to people, publishing, spending money, deleting data, deploys, credentials, folder-trust prompts) or unstated priority/value calls.

---

## Overview note (`superagent-note.md`)

Compaction drops what you knew about each lead. The journal keeps every event, but a resumed superagent cannot read hundreds of entries to rebuild the picture. Keep one short overview file that answers "where is each lead, and what waits on whom" in one read.

- **Path:** `~/.cache/agent-ops/superagent-<project>-note.md` (`<project>` = the journal's project slug). Not in the repo: it would show in `git status`. Not in the termctl state folder: harness-ops owns it.
- **One writer:** only the superagent (Tier 0) edits it. Leads report through `harness-ops report`; you copy what matters into the note.
- **Edit in place, prune hard.** It is a snapshot, not a log. Replace a lead's section when its state changes; delete a lead's section when its scope is detached and accepted. Keep it under about 80 lines. History lives in the journal (`harness-ops log`), never here.
- **Update it** after every lead report, every decision you make on Sam's behalf, every escalation to Sam and his answer, and before you end a turn with work in flight.
- **Differs from the others:** `policy.md` = rules of the run (static); journal = every event (append-only); `progress.md` = one worker's TODOs; `superagent-note.md` = the current picture across all leads.

```markdown
# Superagent overview — <project>
Updated: <local time> · Policy: <policy.md path>

## Waiting on Sam
- <lead>: <question, one line> (asked <time>)   ← empty when nothing waits

## Leads
### <area> — <scope name> · pane <target> · <harness/model>
- Goal: <one line>
- Status: working | idle | blocked | done-unaccepted
- Last heard: <time> — <last report, one line>
- Waiting on: Sam | advisor | worker <task id> | nothing
- Decided for Sam: <decision, time> (only within the mandate)
- Next check: <what you expect next, and by when>

## Parked
- <side issue a lead raised; not acted on>
```

---

## Two-file handoff & drift-gated eviction

Use `brief.md` + `progress.md` for multi-turn work (skip `progress.md` for 1-turn tasks):

- **`brief.md`** (`harness-ops note` + `--brief-file`): stable for the round — goal, scope fence (what not to touch or chase), inputs, and external acceptance check. Include: *"Park unrelated notes, old TODOs, superseded docs, and side-questions under `Parked` in `progress.md`; never chase or act on them."*
- **`progress.md`** (`~/.cache/agent-ops/<YYMMDD-HHMMSS>-<task>-progress.md`): live active state pruned in place by the Worker (`Active TODOs`, `Current state`, `Blockers & Parked`). **Prune, never append forever:** resolved items and stale notes left in warm prompt caches trigger unprompted detours (+77% tokens, +105% wait time).

**Advisor drift-audit method (before keeping a multi-step Worker warm across rounds):**
Read `brief.md` and `progress.md` directly (zero interruption to the Worker). Check every `Active TODO` and touched deliverable against `brief.md`'s goal and scope fence, then return one verdict:
- **`KEEP`** — all items trace to `brief.md` and checks advance → continue with `task send`.
- **`PRUNE`** — 1–2 stray items listed but not acted on → remove them from `progress.md`, continue with `task send`.
- **`EVICT`** — Worker acted on out-of-scope work, relied on stale state, or failed the same check twice → reset via `task new --reuse` booted from `brief.md` + pruned `progress.md`.

---

## Runtime policy file template

File this with `harness-ops note policy` on `superagent on`. Keep static pointer lines at the top and mutable state at the bottom so mid-run edits preserve prompt-cache hits. After editing `## Runtime State`, notify active scopes:
`harness-ops send <scope> "Policy updated — re-read <policy path> before your next spawn or escalation."`

```markdown
# Run Policy
Rules: follow agent-ops `superagent.md` (worktype-adapted handoff, drift-gated eviction, Advisor-only `deep` escalation).
Overview: ~/.cache/agent-ops/superagent-<project>-note.md (read it after compaction)

## Runtime State
- Advisor: active | off
- Areas:
  - <area-name>: worktype=<build|research|writing|ops> · eviction=<drift-gated|per-slice|1-turn> · verifier=<tests|sources|rubric|none>
- Cap overrides (optional; default termctl caps apply): none
- Role command overrides (optional; overrides roster.md on next task new): none
```
