# attention-architecture evals

Blind A/B tests of the `attention-architecture` skill (`home/.ccp/hub/skills/attention-architecture/`),
as `home/.ccp/hub/rules/skill-evals.md` requires.

| File | What |
|---|---|
| `tasks/` | Eight user requests. `t1` TikTok hooks (vi), `t2.html` landing page review (vi; the request is the HTML comment at the top), `t3` podcast script audit (vi), `t4` B2B pricing rewrite (en), `t5` YouTube titles, thumbnail and opening (vi), `t6` course checkout rewrite (vi), `t7` meetup talk slides (en), `t8` subscription checkout decision, US and Germany (en) |
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

## Results, 2026-11-11: country law removed (v5)

The owner asked for a skill with no country-specific law. v5 is v2 without the legal table by market,
without the rule on how to cite a law, and with one "honest-selling floor" argued from trust.

| Comparison | Tasks | Counted pairs | Result |
|---|---|---|---|
| v2 vs v5 | t4, t6, t8 (t8 new) | 3 | v2 won 2 (t4, t6), v5 won 1 (t8). Confidence 2-3 on every verdict |

**Judges' reasons.** t4: v2 found that the 10-50 person segment overflows the 15-user plan cap; v5
missed it. t6: v2 caught the Facebook in-app browser payment handoff and wrote an FAQ block; one judge
also listed "no legal flag" as a v5 defect. t8: v5 stated the German rules and their consequences in
the main body and gave German button strings; v2 hedged the same rules as unverified.

v5 did not win more pairs than it lost. It is installed because the owner decided the scope; the eval
does not show it is better. Without the table the model still names laws from its own knowledge when a
task names a market (t8), so those points are no longer checked by the skill.

## Results, 2026-11-11: full re-run of the installed version (v6)

v6 is the installed skill (v5 plus a description edit). Fresh v6 answers on all 8 tasks, against the
stored v2 answers (one sample per task, so a v2 answer that won before can win again for the same reason).

| Comparison | Tasks | Counted pairs | Result |
|---|---|---|---|
| v2 vs v6 | t1-t8 | 4 | v2 won 3 (t2, t4, t7), v6 won 1 (t8). 4 splits (t1, t3, t5, t6). Confidence 2-3, t8 up to 4 |

**Judges' reasons.** t2: v2 shipped full CSS for the pricing cards; v6 styled only the hero. t4: v2
found the 15-user cap that blocks the 10-50 person segment (the same v2 sample as before). t7: v2
raised the selection-effect objection and plain words for the non-technical half. t8: v6 put the
German cancel-button and renewal rules into the recommendation with German strings; v2 hedged them.

Two of v2's three wins (t4, t7) rest on points that have nothing to do with law, and half the tasks
split, so most of the gap is run-to-run variation. v6 still did not win more pairs than it lost.
