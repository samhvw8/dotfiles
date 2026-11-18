---
type: Decision
title: "Live teams run on harness-ops sessions, not Claude Code agent teams"
description: "Why live debate, council, brainstorm and swarm modes use agent-ops (harness-ops) sessions with a board, lead turns and duels; the role roster; the director-manager-worker swarm."
tags: [decision, agent-ops, harness-ops, thinking-skills, live-team, swarm, models]
status: draft
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-15T14:45:00Z }
stale_after: 2027-03-01
sources:
  - id: cc-warning
    resource: Claude Code startup warning, 2026-11-15
    title: "Code Mode (experimental) isn't available: it can't be used together with agent teams yet."
  - id: termctl
    resource: ~/workspace/tools/termctl/README.md
    title: termctl and harness-ops (tasks, spawn, review, limits)
  - id: agent-ops
    resource: home/.ccp/hub/skills/agent-ops/
    title: "agent-ops skill: SKILL.md core (crew); pair.md, live-team.md, swarm.md, roles.md since the 2026-11-18 split"
  - id: harness-map
    resource: ~/workspace/tools/thinking-skills/skills/heavy-think/references/harness.md
    title: thinking-skills harness map (capabilities, model tiers)
---

# Context

Claude Code Code Mode refuses to start while agent teams are on.[^cc-warning] Sam chose Code Mode,
so `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` left the ccp base template. The live modes of `debate`,
`council`, `heavy-think` and `lead-researcher` depended on agent teams. harness-ops already starts,
messages, waits on and closes harness sessions of any harness,[^termctl] and agent-ops already has
pair and group discussion on top of it.[^agent-ops]

# Decision

## One protocol, several transports

The live playbooks describe one protocol. The transport is a row in the harness map:[^harness-map]

| Transport | Where |
|---|---|
| harness-ops sessions (agent-ops skill) | Default for Sam's setup; any harness, any model, visible panes |
| Claude Code agent teams | Still valid for other users; off here because of Code Mode |
| omp named tasks + `agent://` | omp only |

## Three layers of talk

| Layer | What | Rule |
|---|---|---|
| Record | One board file per session; each member appends one block per turn (`## Round N — <name>`, one shell append), never rewriting it | The verdict cites the board |
| Control | Only the lead opens and closes rounds; members send the lead one line (`DONE round N`, or `BLOCKED round N: <reason>`) | No content in messages |
| Duel | The lead opens a direct channel between 2–3 named members for one round | Turn token, 3 messages each, ends with `DUEL DONE` between them; the first-named member appends the outcome; each sends the lead `DONE round N` |

Shape by size: 2 members = duel + board; 3 = lead turns, with an optional duel; 4–6 = lead turns
and board only.

## Roles, never model names

Skills, briefs and protocols name roles. Only the agent-ops roster maps a role to a launch command.

| Role | Means |
|---|---|
| `director` | The strongest model available; writes cards, steers, synthesizes |
| `peer` | The lead's own model; the default live member |
| `other-family` | A strong model from another family; manager, opponent, blind reviewer |
| `fast` | The fastest model that passes the brief check; swarm workers |
| `builder` | Cheap and fast; a task worker whose result a test or build checks (added 2026-11-18) |
| `brain` | The strongest model at high effort; review, managing workers, hard tasks (added 2026-11-18) |
| `open-panel` | A mix of open-weight models; extra diversity |

Diversity setting per live run: `same` (default), `mixed` (automatic for review, cross-model or a
"diverse / tunnel vision" request), `max` (each member a different family).

## Swarm: director → manager → workers

- **Director** (`director`, the lead session): writes direction cards that differ in kind, plus a
  wildcard; reads the manager's report; keeps, kills, merges; writes the next round and the synthesis.
  Spot-checks one draft per round against the manager's verdict.
- **Manager** (`other-family`): dispatches cards, checks each output against its card (followed,
  schema, scope), sends a drift back once, reports one table per round. Never ranks directions.
- **Workers** (`fast`, up to 6): one card each, a tight brief, kept open across rounds with
  `task send` so each harness starts once.
- Depth: lead (director) → manager (1) → workers (2) fits `TERMCTL_MAX_DEPTH=2`.

# Results

| Check (2026-11-15) | Result |
|---|---|
| 2026-11-18: `builder` coding job, two runs each (implement `parse_duration`; pass = hidden tests pass, only `duration.py` changed) | All passed. Claude Sonnet 36/38 s, Haiku 46/49 s, agy Flash medium 61/70 s, omp GLM-5.3-Flash 73/78 s, omp DeepSeek-V4.1-Flash 337/275 s → `builder` = Haiku (a twentieth of Sonnet's price, within 10 s) |
| 2026-11-18: `brain` review job, two runs each, two diffs with planted bugs and drift | Opus high, Fable, Sonnet, Haiku, agy Hydrogen high and omp GLM-5.3 found every planted defect: the check does not separate them. Opus high also found the deeper eviction flaw both runs and ran the code to confirm; Fable matched it, slower → `brain` = Opus high |
| `fast` timing job, one run each, same tight brief | All passed the schema check. agy Flash medium 16 s, Hydrogen low 19 s, Hydrogen medium 27 s, omp GLM-5.3-Flash 27 s, omp DeepSeek-V4.1-Flash 55 s → `fast` = Flash medium |
| Manager planted-drift round (one drifted draft, one schema miss, two clean) | Hydrogen medium 24 s, Hydrogen high 32 s, Carbon medium 49 s, Carbon high 152 s; all four marked both faults and passed the clean drafts → `other-family` = Hydrogen medium |
| omp → lead `harness-ops send` | Works, no prompt |
| agy → lead `harness-ops send`, no rule | The auto-mode reviewer asks a person before every `send` to a session agy did not start |
| agy permission tests, one session each | Session-only `--settings` with `command(harness-ops*)`: still asked. `read_file`/`write_file` on the iTerm2 socket folder: still blocked in the sandbox and asked. Sandbox off + accept-edits + allow list via `--settings`: asked even for `whoami` (agy ignores `--settings` permission rules). Global rule `command(harness-ops)` (agy's "persist" option): plain auto-mode session sent with no prompt, each call run twice (sandbox fail, then allowed retry) |
| Live team, 3 omp members (GLM-5.3, Kimi-K3, DeepSeek-V4-Pro), round 1 + duel + round 2 | Round 1: 3 parallel appends, all whole. Duel: token passed both ways, concessions with evidence, scribe outcome on the board. Found: omp's top-level `bash` refuses `>>`, so one member edited the board in place and broke block order → round 0 append check and a per-harness append method (harness map). Found: members resent `DONE` with `--force` when `send` said "queued" (the lead was busy) → send-once rule in every brief. Found (m3, round 2): long board lines hit omp's 768-character read cap → wrap board lines at about 100 characters |
| Swarm, 1 round: director (lead) → omp GLM-5.3 manager → 3 omp GLM-5.3-Flash workers (2 cards + wildcard) | Manager started the workers at depth 2, all drafts written, report table delivered through `task done`; the director's check of all 3 drafts matched the manager's verdicts; manager closed its workers on request, lead accepted and closed it. agy manager not tested (needs the agy allow rule) |

# Consequences

- Live members are full harness sessions: more memory and start-up time than agent teams, closed at
  the end of each run. Per-token cost only for OpenRouter-routed models.
- Cross-model debate and review become possible.
- agy trusts exact folders only (`trustedWorkspaces` in its `settings.json`); agy members start in a
  trusted folder (`~`) and use absolute board paths.
- agy members need the global rule `command(harness-ops)` in agy's `settings.json` (added on this Mac 2026-11-15): its terminal sandbox cannot reach the iTerm2
  API socket under `~/Library/Application Support`, and its auto-mode reviewer asks a person before
  each `harness-ops send` to a session it did not start. Where the rule is missing, agy roles fall
  back to omp members (`roster.md`). agy trusts exact folders only; a session-only
  `--settings '{"trustedWorkspaces":["<cwd>"]}'` skips the trust prompt for that start and is not saved.
- omp has no preset CLI flag (`/modelpreset switch` works only inside a session), so roster lines use
  `omp --model <provider/model>` taken from the presets in `~/.omp/agent/config.yml`.
- A new interactive Claude Code session showed the Code Mode opt-in screen until Sam answered it
  once. Since then a fresh session in a new `/tmp` folder reaches its input prompt with no screen
  (checked 2026-11-15), so `claude` members no longer stall.
- When models change: update the roster line (or the omp preset), then rerun the roster check.

Runs: nothing in the background; sessions exist only during a live run.
