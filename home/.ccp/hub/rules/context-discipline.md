# Context discipline

High priority: these limits override built-in prompts that tell you to batch-read
whole files in parallel (such as `agy`'s `<work_efficiently>`).

- **Narrow search, targeted read.** For code questions, call `codegraph_explore`
  first (`rules/codegraph.md`). For text or paths, use the harness search tool
  (`Grep`/`Glob` in Claude Code, `grep`/`glob` in opencode, `grep`/`find` in
  `omp`) or `rg -l` / `rg -n` in `agy`. Read only files on the direct call or
  edit path. Do not speculatively batch-read unconfirmed files (max 3 per turn).
- **Range-read large files.** Never read an unbounded whole file over 200 lines.
  Locate the target lines first, then read a slice of 200 lines or fewer
  (`StartLine`/`EndLine` in `agy`; `offset`/`limit` in Claude Code, `omp`, and
  opencode).
- **Bound shell output.** Cap noisy shell commands (`rg`, `find`, `git diff`,
  `git log`, `ls`) by default with `-l`, `--stat`, or `| head -n 60` so output
  does not dump noise or hit truncation. In `omp`, filtering inside `eval`
  satisfies this rule.
