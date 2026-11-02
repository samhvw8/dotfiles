# Documentation

Project knowledge lives in an **OKF bundle** (`.okf/` at the repo root). Load the
`okf` skill before reading or writing one — the spec lives there, not here.
Update the bundle in the same change as the code it describes, and run the
`validate` skill before calling doc work done. READMEs, changelogs and agent
config (CLAUDE.md, SKILL.md, rules) keep their own conventions.

## Check decisions before you decide

Before you choose an architecture, a language, a library, a data flow or a
hardware spec, or add code to a module you have not touched this session, read
the bundle's `decisions/` index and every decision that names the area. Also
check its results (benchmarks, measurements) before running a new one.

- Follow a decision that applies. If it is wrong for the task, say so and ask;
  never work around it silently.
- Extending existing code does not exempt it: code written against a decision
  (a quick MVP) gets flagged, not extended.
- In the reply, name the decisions you checked, or write
  `Not checked: <why> — risk: <what could conflict>`.
