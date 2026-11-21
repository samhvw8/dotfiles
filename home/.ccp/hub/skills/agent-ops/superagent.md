# agent-ops: superagent mode

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving). Domain-agnostic: works for **research, writing, business, ops, analysis, and coding**.

Toggle this mode **on** or **off** for the current session without changing `termctl` or paying always-loaded tokens when off.

---

## Toggle

- **ON (`superagent on [small|medium|large]`, default `medium`):**
  1. Write a run policy file using the template at the bottom of this file, filed with `harness-ops note policy` (survives compaction; shown by `harness-ops resume .`).
  2. Current pane becomes **Tier 0 (Receptionist)**.
  3. Attach existing workstream panes as **Area Scopes** (`harness-ops attach <pane> --name <area> --about "policy: <path>" --sub-depth 1`).
  4. For `medium` or `large`, attach or start one **Advisor** (`--sub-depth 1`, role `advisor` from `roster.md`).
- **Status (`superagent status`):** run `harness-ops scope ls --tree` and `harness-ops task ls --tree`, then report active scopes, open tasks, and the `Runtime State` block from `policy.md`.
- **OFF (`superagent off`):**
  1. Write one active-state handoff note (`harness-ops note handoff ...`).
  2. Run `harness-ops detach <scope>` on each attached scope (leaves panes open; stops the 30 s idle watcher immediately). Use `--keep` if you want the scope visible in default `scope ls` later.
  3. Accept/close finished Tier 2 tasks (`task ls`) and return to normal single-agent mode.

---

## Tier ladder & autonomous authority

`termctl` hard-enforces topology via `--sub-depth` (exit 6). Models come from `roster.md` by role and can be overridden mid-run in `policy.md`'s `Runtime State`.

| Tier | Role (`roles.md`) | `--sub-depth` | Mechanism | Safe autonomous actions (no user approval needed) |
|---|---|---|---|---|
| 0 | `receptionist` (current pane) | root | Current pane | Intake, routing, `ls`/`scope ls`/`read`, attaching Area Scopes, `answer`/`deny` on safe in-brief prompts, spawning Workers for clear briefs. |
| 1 | `advisor` (reviewer & drift auditor) | `1` | `attach` (long-running scope) | Planning, specs, quality review, auditing `progress.md` for drift (`KEEP`/`PRUNE`/`EVICT`), spawning `deep` when genuinely blocked. Read-only unless brief grants edits. |
| 1 | Area Scope (workstream lead) | `1` | `attach <pane> --name <area> --sub-depth 1` | Owns one ongoing area (project, research track, client stream, ops queue); spawns Tier 2 Workers/Verifiers; reports milestones via `harness-ops report`. |
| 2 | Worker (`builder` or `fast`) | `0` (leaf) | `task new` | Execute inside `brief.md`'s scope fence (gather, draft, analyze, build, or run procedures); maintain `progress.md`; report via `task done`. |
| 2 | Verifier (`fast` or `builder`) | `0` (leaf) | `task new` / `--reuse` | Run external checks (source/fact checks, rubrics, calculations, schema checks, or tests) on the named slice; report pass/fail with raw output. |
| 2 | `deep` (Advisor-only) | `0` (leaf) | `task new` | Resolve one narrowed deadlock, high-stakes trade-off, or second-family audit. Closed right after verdict. |

**Escalation rules (and why):**
- **Receptionist never spawns `deep` directly:** a cheap router cannot reliably separate a real deadlock from an underspecified brief, and `deep` models cost 10–20× per turn. Route to `advisor` first.
- **Escalate to `advisor`** when direction/strategy is open, the cause or answer is unclear, work needs review before shipping or sending externally, or a Worker fails its external check twice (include the failed attempts).
- **Escalate to the user** only for irreversible or external actions (sending emails/messages to people, publishing, spending money, deleting data, deploys, credentials, folder-trust prompts) or unstated priority/value calls.

---

## Two-file handoff (`brief.md` + `progress.md`)

Use both files for any task running >1 turn or crossing compaction/eviction (skip `progress.md` for 1-turn tasks):

- **`brief.md`** (`harness-ops note` + `--brief-file`): stable for the round — goal, scope fence (what not to touch or chase), inputs, and external acceptance check. Include: *"Park unrelated notes, old TODOs, superseded docs, and side-questions under `Parked` in `progress.md`; never chase or act on them."*
- **`progress.md`** (`~/.cache/agent-ops/<YYMMDD-HHMMSS>-<task>-progress.md`): live active state pruned in place by the Worker:
  - `Active TODOs` (only items tracing to `brief.md`)
  - `Current state` (deliverables updated, sources/facts checked, check results)
  - `Blockers & Parked` (recorded, never acted on unprompted)
- **Prune in place, never append forever:** resolved items and stale notes left in warm prompt caches trigger unprompted detours (+77% tokens, +105% wait time).

---

## Lifecycle, cache & drift-gated eviction

Keep prompt caches warm while context is clean; evict when `advisor` detects drift or the task slice shifts.

| Tier / Role | Lifespan | Cache & eviction rule | `termctl` action |
|---|---|---|---|
| **Tier 0 — Receptionist** | Very long (hours/days) | Never close on a single task. When context grows heavy, flush active state to `note` / `Runtime State` (drop settled items) and compact. | `harness-ops note` + `/compact` |
| **Tier 1 — Advisor & Area Scopes** | Long (whole milestone / area) | Stay attached across plan → execute → verify so domain context stays cached. Checkpoint active decisions and compact or `/clear` only between milestones. | `attach`; `detach` when milestone ends |
| **Tier 2 — Worker** | **Task-dependent** (longer on multi-step work; short on one-offs) | Keep warm across revision rounds (`task send`) to reuse loaded files/sources. Evict only on `advisor` `EVICT` verdict or when switching to an unrelated task. | `task send` (warm); `task new --reuse` (evict / next task) |
| **Tier 2 — Verifier** | Very short (per check slice) | Reuse warm pane (`task send`) for fail → fix → recheck loops on the **same** slice; `/clear` (`task new --reuse`) when the slice changes so stale assumptions cannot hide a miss. | `task send` (same slice); `task new --reuse` (new slice); `task accept --close` when pass |
| **Tier 2 — `deep`** | Short / surgical (1–2 rounds) | Feed only narrowed problem, `progress.md`, and failed attempts. Close immediately after verdict so expensive models never idle. | `task accept --close` |

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
Rules: follow agent-ops `superagent.md` (two-file handoff, drift-gated eviction, Advisor-only `deep` escalation).

## Runtime State
- Mode: medium   # small (no advisor) | medium (advisor + 1–3 scopes) | large (4+ scopes, advisor audits progress.md before final delivery)
- Active scopes: <names>
- Active domains: <e.g., research, writing, business, ops, coding>
- Tree limit (--tree-max): 12 · Per-lead cap: 6
- Model overrides (optional, overrides roster.md on next task new): none
```
