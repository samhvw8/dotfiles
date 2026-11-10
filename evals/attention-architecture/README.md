# attention-architecture evals

Blind A/B tests of the `attention-architecture` skill (`home/.ccp/hub/skills/attention-architecture/`),
as `home/.ccp/hub/rules/skill-evals.md` requires.

| File | What |
|---|---|
| `tasks/` | Seven user requests. `t1` TikTok hooks (vi), `t2.html` landing page review (vi; the request is the HTML comment at the top), `t3` podcast script audit (vi), `t4` B2B pricing rewrite (en), `t5` YouTube titles, thumbnail and opening (vi), `t6` course checkout rewrite (vi), `t7` meetup talk slides (en) |
| `judge-prompt.md` | The blind judge's instructions |
| `out/<date>/` | Answers per arm, the X/Y pairs with `key.txt`, and each `verdict.json`. Git-ignored |

## Method

- **Arms.** One agent per arm answers each task. A skill arm reads a frozen copy of the skill folder
  and nothing else; the baseline arm uses no skill. No web.
- **Judge.** An Opus agent reads the task and two answers labelled X and Y, and nothing else. Each
  pair is judged twice, once in each order. A pair counts only when both orders pick the same arm.
- **Held-out tasks.** A version is tested on tasks it was not tuned on before it is kept.
- **Limit.** One sample per arm and task, so a single pair can be run-to-run noise. Read the totals.

## Results, 2026-11-10

| Comparison | Tasks | Counted pairs | Result |
|---|---|---|---|
| No skill vs v0 (the 26-gate skill, commit `279486c`) | t1–t3 | 3 | No skill won 3–0 |
| No skill vs v1 (first rebuild, 18 gates, graded rules) | t1–t3 | 3 | No skill won 3–0 |
| No skill vs v2 (the installed skill) | t1–t5 | 5 | v2 won 5–0. t4 and t5 were held out from v2 |
| v2 vs v3 (v2 plus small fixes and a verified Vietnam law row) | t6, t7, both held out | 2 | v2 won 2–0. v3 was dropped |

Every pair had the same winner in both orders.

**Why v0 and v1 lost (judges' reasons):** internal codes and grade labels in the reply, 30–58-row
checklists, unsourced and over-precise statistics given as fact, the skill cited as an authority,
rewrites made of placeholders, and missed real problems (script length, a sponsor that fights the topic).

**Why v2 won:** finished deliverables that use only the user's own facts, assumptions listed once to
confirm, real problems found first (seat cap below the target customer, a hero promise the free plan
does not keep, a script much shorter than the user thought), and no statistic the user cannot check.

**Why v3 lost:** on t6 it stated points of Vietnam's consumer law as fact with no article numbers and
put a statutory "7 working days" into customer-facing copy; the judge could not check them and called
them over-precise. The points had been checked against the law's text, but a reader cannot tell. On
t7 the judges preferred v2's audience question and objection prep, which v3 did not change.

## Open candidate

A verified row for Vietnam's Law 19/2023/QH15 exists in
`out/2026-11-10/candidates/v3-rejected/references/choice-architecture-and-pricing.md`. To try it
again, add it as its own arm together with a rule to cite the article beside each legal point and to
keep statutory numbers out of customer-facing copy, and test it on a new Vietnamese pricing task.
