# Skill evals

When you test a skill, or whether a change to one is better, an LLM judges the output, not you.

- **Blind LLM judges decide "better".** You wrote or changed the skill, so your own reading
  of its outputs is a self-judge. Script graders check format and cheats; they don't rank quality.
- **Blind means:** arm names stripped, each pair shown in both orders, and a pair counts only
  when both orders pick the same winner.
- **A fix is its own arm.** Run it on tasks it was not tuned on before you claim it helps.
  Keep it only when it wins more counted pairs than it loses.
- **Report the judges' verdicts and reasons**, not your summary of the outputs.

Tooling: `~/workspace/tools/thinking-skills/evals/ambition/` (`run-all.sh`, `judge/`).
