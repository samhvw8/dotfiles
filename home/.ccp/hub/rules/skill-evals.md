# Skill evals

When you test a skill, or whether a change to one is better, an LLM judges the output, not you.

- **Blind LLM judges decide "better".** You wrote or changed the skill, so your own reading
  of its outputs is a self-judge. Script graders check format and cheats; they don't rank quality.
- **Blind means:** arm names stripped, each pair shown in both orders, and a pair counts only
  when both orders pick the same winner.
- **A fix is its own arm.** Run it on tasks it was not tuned on before you claim it helps.
  Keep it only when it wins more counted pairs than it loses.
- **Don't score the feature itself.** A rubric row or a prompt that asks for the new feature
  measures its presence, not quality. Judge the output both arms share, with the feature's
  marks masked; report feature rows apart. Add a same-arm pair as the noise floor.
- **Report the judges' verdicts and reasons**, not your summary of the outputs.

Tooling: `~/workspace/tools/thinking-skills/evals/ambition/` (skills that write); `~/workspace/tools/search-evals/`
(search skills). Both have `run-all.sh` and `judge/`.
