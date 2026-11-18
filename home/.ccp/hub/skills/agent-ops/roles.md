# agent-ops: roles

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Roles

Briefs and skills name roles, never models. `roster.md` (next to this file) maps each role to a harness
and a `--command` value, and it is the only file that names models. When a model changes, only
`roster.md` changes.

| Role | Use |
|---|---|
| `director` | The strongest model available: leads a swarm, writes cards, synthesizes |
| `peer` | The lead's own model: the default live member |
| `other-family` | A strong model from another family: swarm manager, debate opponent, blind reviewer |
| `fast` | The fastest model that passes the brief check: swarm workers |
| `builder` | Cheap and fast: build and iterate on a task whose result a test or build can check |
| `brain` | The strongest model at high effort: review, managing workers, hard tasks |
| `open-panel` | Open-weight models, one per member: extra diversity |

Pick a task worker's role by the task:

| Task | Role |
|---|---|
| The spec is clear and a test, build or schema can check the result (scaffold, mechanical edit, make tests pass, a fix with a known cause) | `builder` |
| Open design, a bug with an unknown cause, review, managing other workers, anything costly to get wrong | `brain` |
| A second opinion from another model family, a blind review | `other-family` |
| A short swarm card | `fast` |

A `builder` task whose check fails twice goes to a `brain` worker, with the failed attempts in its brief.

Diversity setting for each live run:

| Setting | Members | When |
|---|---|---|
| `same` | All `peer` | Default |
| `mixed` | At least one `other-family`; the rest `peer` | Automatic for a review, a cross-model ask, or a "diverse" or "tunnel vision" ask |
| `max` | Each member from a different family, from `peer`, `other-family` and `open-panel` | Sam asks for it |
