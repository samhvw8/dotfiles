# agent-ops evals

A/B test of two versions of the `agent-ops` skill (`home/.ccp/hub/skills/agent-ops/`), judged
blind, as `home/.ccp/hub/rules/skill-evals.md` requires.

| File | What |
|---|---|
| `arms/old/`, `arms/new/` | The two skill versions. Refresh `new/` from the skill folder before a run |
| `tasks.py` | Six held-out tasks: same-project spawn, a crew of two, a pair, a group brainstorm, replies to four messages, a task that failed to start. Each has what a good answer does (for the judge) and hard checks (for the script) |
| `run.py` | `gen` the answers, `grade` the hard checks, `judge` blind, `report` |

```bash
python3 -I run.py gen -n 3 -j 6 --label <date>     # 6 tasks x 2 arms x 3 samples, Sonnet, headless claude -p
python3 -I run.py grade --label <date>
python3 -I run.py judge -j 6 --label <date>        # Fable, every pair in both orders
python3 -I run.py report --label <date>            # out/<date>/REPORT.md
```

How it stays fair:

- Each run copies its arm into its own `skill/` folder, so a run cannot tell which version it has.
- Answers are plans (commands and briefs). Nothing runs against real panes, so the eval tests what an
  agent decides, not whether harness-ops works; termctl's own tests cover that.
- The judge sees two answers as A and B and judges each pair twice, once in each order. A pair counts
  only when both orders pick the same arm.
- Runs use `--setting-sources project,local`, so user settings and hooks stay out of both arms. With an
  OAuth login the global CLAUDE.md still loads into both.
- The hard checks are proxies for the rules (`--where`, worktrees, closing, reply kinds); the judge
  decides which answer is better.

`out/` is git-ignored.
