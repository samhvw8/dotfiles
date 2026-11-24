# Instruction-set evals

A/B test of the always-loaded instructions (the profile `CLAUDE.md`, the hub rules linked into
`~/.claude/rules/`, and `~/CLAUDE.local.md`), judged blind, as `home/.ccp/hub/rules/skill-evals.md`
requires.

| File | What |
|---|---|
| `tasks.py` | Eight shared tasks (judge + hard checks) and two feature tasks (hard checks only) |
| `run.py` | `build` the arms, `gen` the answers, `grade` the hard checks, `judge` blind, `report` |

```bash
python3 -I run.py build  --label <date> --base main   # arms: old (base commit), new (working tree), bare (no ~/CLAUDE.local.md)
python3 -I run.py gen    --label <date> -n 2 -j 6     # 10 tasks x 3 arms x 2 samples, Sonnet, headless claude -p
python3 -I run.py grade  --label <date>
python3 -I run.py judge  --label <date> -j 6          # Fable, every pair in both orders, plus an old-vs-old noise pair
python3 -I run.py report --label <date>               # out/<date>/REPORT.md
```

How it stays fair:

- Each run gets its arm through `--append-system-prompt-file`, with `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1`
  and `--setting-sources project,local`. The live `CLAUDE.md`, rules, settings and hooks load into no arm.
- Answers are plans. Runs have no tools, so an arm cannot read the live files.
- The judge sees two answers as A and B. The agent's name is masked. Set `EVAL_OWNER_NAME` to mask the
  user's first name too and to turn on the check that no answer uses it. A pair counts only when
  both orders pick the same arm.
- Feature tasks test a rule the change added, so they never go to the judge.
- The `old` arm cuts `~/CLAUDE.local.md` at `LOCAL_CUT` in `run.py`. Update that marker for a new change.

`out/` is git-ignored. It holds text from `~/CLAUDE.local.md`, so never commit it.
