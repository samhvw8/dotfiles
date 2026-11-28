# agent-ops: memory (the journal and agent notes)

Part of the agent-ops skill (`SKILL.md` next to this file has the commands). Two stores keep what a
session forgets at `/clear`, compaction or a crash. Use both before you start, reuse or rebind an agent.

| Store | Holds | Who writes | Where |
|---|---|---|---|
| **Journal** | Every event: messages, spawns, answers, scope and task events, notes. Append-only. | harness-ops, by itself | `~/.local/state/termctl/journal.jsonl` + `projects/<project>/` (harness-ops owns it: read it only with `log`, `resume`; never edit or delete) |
| **Agent note** | What one long-term agent knows: its area, rules, decisions, current state. Edited in place. | The agent itself (its lead writes the first version) | `~/.local/state/agent-ops/agents/<project>/<name>.md` |

`<project>` is the journal's slug of the agent's work folder: the path below `~` with `/` turned into
`-` (`~/workspace/tools/termctl` → `workspace-tools-termctl`; `~` itself → `home`). `<name>` is the
agent's scope name. The journal says *what happened*; the note says *what the agent knows now*. Never
copy journal history into a note: link to `harness-ops log --scope <name>` instead.

## Start from memory

Do this at session start, after compaction or `/clear`, and before you start any lead:

```bash
harness-ops resume .            # open scopes and tasks in this project, notes, last 30 events
harness-ops scope ls --all      # every scope you lead, also detached ones
harness-ops task ls --all
ls ~/.local/state/agent-ops/agents/*/ 2>/dev/null   # long-term agents that have a note
```

Then read the note of each agent the next job touches, and `harness-ops resume <name>` for its timeline.

## Reuse before you start

Work that comes back to the same area (a repo, a product area, an ongoing research line) goes to the
agent that already holds it. Pick the first row that fits:

| What you find | Do |
|---|---|
| Its pane is open and idle | `send <name> "..."` (a scope) or `task send <id> "..."` (a task). The context is warm. |
| Its pane is open and working | `send` anyway: it queues. Never start a second agent for the same area. |
| Its pane is open, idle, and its context is stale or off-track | `send --clear-first <name> "Read your note <path>, then run harness-ops resume <name>. Then: ..."` |
| Its pane is gone, but its note or scope exists | Start a new pane (`roster.md` role), then `attach <new-pane> --name <name> --about "note: <path>; ..."`, then send "Read your note <path> and `harness-ops resume <name>`, then: ...". |
| Nothing matches | Start a new agent. If it will live past one job, attach it as a scope and create its note (below). |

A one-shot job (one brief, then done) stays a task or a subagent and gets no note.

## Create an agent note

When you attach a long-term agent, write its first note, then pass the path in `--about` so
`harness-ops resume <name>` shows it to every later lead:

```bash
mkdir -p ~/.local/state/agent-ops/agents/<project>
# write the template below to ~/.local/state/agent-ops/agents/<project>/<name>.md
harness-ops attach <pane> --name <name> --about "note: ~/.local/state/agent-ops/agents/<project>/<name>.md; <area, one line>" --sub-depth 1
harness-ops send <name> "You are the long-term <area> agent. Your note is <path>: read it now, keep it up to date as it says, and read it first after every /clear or compaction. Reply with agent-ops when you have read it."
```

```markdown
# <name> — <area>
Folder: <work folder> · Harness: <harness/model> · Lead: <lead label or pane>
Updated: <local time>
History: harness-ops log --scope <name>

## Mandate
- Owns: <what this agent is responsible for>
- Not mine: <what it must not touch or chase>
- Report: harness-ops report "<one line>" at each milestone

## Standing rules
- <conventions, commands, checks this area needs; learned the hard way>

## Decisions
- <date> <decision> — <why> (who decided)

## Current state
- <what is in flight, one line each>

## Open threads
- <waiting on whom, for what>

## Lessons
- <a mistake not to repeat, and its cause>
```

## Keep the note (the agent's own job)

- **Update it** at each milestone you `report`, after each decision, before a long tool run, and before
  you end a turn with work in flight. Change `Updated:`.
- **Edit in place, prune hard.** Replace `Current state` and `Open threads`; drop resolved items. Keep
  `Decisions`, `Standing rules` and `Lessons` short and true. Stay under about 100 lines.
- **One writer.** Only the agent edits its own note. A lead that wants a change sends it; the agent
  writes it. Exception: a lead writes the first version, and may fix a note whose agent is gone.
- **Secrets never go in a note.** Name where a secret lives, not its value.
- **After `/clear` or compaction,** read the note, then `harness-ops resume <name>`, before any other step.
- **On detach,** the agent updates the note one last time. The note stays: the next lead of that area
  starts from it. Delete a note only when the user retires that area.
