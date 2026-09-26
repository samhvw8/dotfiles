# Documentation Convention

Project knowledge is written as **OKF (Open Knowledge Format)** bundles: a
directory of markdown files with typed YAML frontmatter, `.okf/` at the repo root
by default. This replaces the old `docs/` tree house style.

The `okf` skill is the how, and the only place OKF rules live. This file is the
why. The `okf-docs` SessionStart hook is the per-repo pointer: it names the
bundle and hands over its `index.md`, or notes that none exists yet. The
`okf-stop` Stop hook is the backstop: once per repo per session, it stops you when
a repo you touched has changes outside its bundle and none inside.

| Do | Don't |
|----|-------|
| Load the `okf` skill before reading or writing a bundle | Write OKF from memory; the skill carries the spec |
| Update the bundle in the same change as the code it describes | Leave docs for a later pass, where they rot |
| Run the `validate` skill before calling doc work done | Eyeball conformance |

**Out of scope:** READMEs, changelogs, issue templates, and agent config
(CLAUDE.md, SKILL.md, these rule files) keep their own conventions.

## Related

- [surgical-changes.md](surgical-changes.md) — scope discipline
- [se.md](se.md) — verifiable goals
