# agent-ops: worktrees

Part of the agent-ops skill (`SKILL.md` next to this file has the commands and the rules for
sending and receiving).

## Give an editing agent its own worktree

Before you start teammates on files, stop any older headless job on the same files, and check with
`pgrep` that it is gone. agy print jobs ignore SIGTERM, so use `kill -9`.

Two agents editing one checkout overwrite each other's files and mix their changes in `git status`.
A worktree prevents that, but it costs a branch, a merge and a cleanup. Decide by the files the new
agent (omp or any other harness) will change:

| The new agent's job | Where it works |
|---|---|
| Read-only (review, research), or a repo nobody else is editing | The repo itself |
| Changes only files nobody else touches (a README, a changelog, one new doc), and runs no build or tests | The repo itself. Name its files in the brief and add: change nothing else; do not commit, stash or switch branch |
| Changes code you or another agent is changing or may change, runs the build or tests on its own edits, or is one of two or more editing workers | Its own worktree and branch |

For its own worktree and branch:

```bash
grep -qx '.claude/worktrees/' <repo>/.git/info/exclude || echo '.claude/worktrees/' >> <repo>/.git/info/exclude
git -C <repo> worktree add <repo>/.claude/worktrees/<task> -b agent/<task>
harness-ops task new omp --title "<task>" --cwd <repo>/.claude/worktrees/<task> --brief "..."
```

- The worktree starts at `HEAD`, without your uncommitted changes: commit what the worker needs
  first, or name the base (`... -b agent/<task> <base>`).
- If `agent/<task>` already exists, pick a new name; reuse an old branch only when you mean to continue
  its work (`git -C <repo> worktree add <path> agent/<task>`).
- A new worktree has no untracked files: say in the brief what to set up there (`mise trust`, the
  project's install task, a copied `.env`).
- Say in the brief that it works on branch `agent/<task>` and commits there.
- **After you accept the task,** merge the branch (commit your own changes to the same files first), then
  `git -C <repo> worktree remove <repo>/.claude/worktrees/<task>` and `git -C <repo> branch -d agent/<task>`.
  If `remove` refuses because files are left, look at them before you add `--force`. For an abandoned
  task, remove the worktree and delete the branch with `-D` only after Sam agrees to drop the work.
