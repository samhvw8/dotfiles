---
name: project-bootstrap
description: "Creates a new project under ~/workspace, or adopts an existing folder or code into one, set up the user's way: the right category folder, git, mise.toml, .gitignore, AGENTS.md with CLAUDE.md pointing to it, and an OKF bundle, then offers codegraph. Use when the user asks to create, start, extract or move a project (\"create project in ~/workspace for this\", \"init okf and agent md and claude md\", \"move this code into a new project\", \"set up okf for this project from the existing docs\")."
---

# Project bootstrap

Set up a project once, completely, so later sessions start with the layout, the docs
bundle and the agent files already in place.

## 1. Place it

- Follow `~/workspace/CLAUDE.md` for the category: `apps/` (things people use),
  `tools/` (things an agent or the user calls), `libs/`, `clients/`, `notes/`,
  `oss/` (third-party repos and forks), `research/YYMMDD-<topic>/`. Never the
  workspace root. Name the folder in kebab-case.
- When the category or name is unclear, state your pick and go on; the user can say
  move it.
- **Adopting** existing code (a folder elsewhere, files from this session, a scratch
  dir): move or copy it in, keep its git history if it has one (`git mv`, or move the
  whole folder), and leave data that should not be committed out of git (step 2).
- **Moving** a project that already has Claude Code sessions: also rename its session
  folder in `~/.claude/projects/` (the path with every non-alphanumeric character
  replaced by `-`) and its keys in `~/.claude.json`, so history follows it. Delete a
  Python `.venv` after a move; it holds absolute paths.

## 2. Files

Write each from what the project actually is; no placeholder text.

- `git init` (unless adopted with history).
- `.gitignore` for the stack, plus data, caches, `.env*` and large outputs.
- `mise.toml`: pin the tools the stack needs, and add the tasks the project will use
  (`check`, `test`, `dev`, `deploy` when there is a target). Leave out a task that has
  nothing to run yet.
- `AGENTS.md`: the shared agent file. What the project is, its layout, the commands
  (the mise tasks), its rules, and this line: "Project knowledge lives in `.okf/`.
  Update it in the same change as the code it describes, and run the validator."
- `CLAUDE.md` containing only `@AGENTS.md`, so Claude Code and other harnesses read
  one file. If a `CLAUDE.md` already exists, move its content into `AGENTS.md` first.

## 3. OKF bundle

Load the `okf` skill and create the bundle from real content: the purpose, the
architecture or layout, and the decisions made so far in this session. When adopting
a project with docs (README, `docs/`, notes), build the concepts from them instead of
duplicating them. For a long git history, the `backfill` skill reconstructs it. Run
the validator; it must pass.

## 4. Finish

- **codegraph:** ask whether to run `codegraph init` (the user's rule: it is their
  call). Run it only on a yes.
- Don't commit unless the user asked; list the new files instead.
- Give the full path, and the command to continue there: `cd <path> && claude`
  (or `omp`).
- Report in one table: each file or step and its state, plus the validator result.
