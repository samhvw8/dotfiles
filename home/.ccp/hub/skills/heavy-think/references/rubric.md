# The idea rubric

Used to score ideas and concepts: by the judges of a full council, and by you in heavy-think Brainstorm
before you rank. A review (Perspectives mode, ASK review) scores findings, not ideas, with the `review` profile below. The
weights live in `perspectives.json` under `rubrics`, so there is one source of truth; this page holds
the criteria and their anchors.

## Pick the profile

| profile | use it for | weights |
| --- | --- | --- |
| `creative` | Ideation: open questions, naming, product ideas, "how might we" | novelty 30, value 30, feasibility 20, specificity 10, emergence 10 |
| `decision` | Choosing a direction that ships and has to be run: architecture, strategy, prioritization, migration, policy | value 35, feasibility 25, running cost 20, novelty 10, specificity 10 |
| `review` | Ranking findings on an existing artifact (Perspectives mode with ASK review, the `*-review` presets). Not for council judges | impact 45, confidence 35, actionability 20 |

A preset names its profile. When in doubt: if someone will have to operate the result, use `decision`.
Under `creative`, a cheap-to-run boring idea loses to a new one; under `decision`, it should not.

Weighted total = the sum of (score x weight) / 10, a number from 0 to 100.

## The criteria

Each is scored 0 to 10. Use the whole scale. A 7 is not a polite default.

**Novelty**: would a competent person in this field have come up with this on their own in an afternoon?
- 10: surprising even to an expert, yet obviously right once said.
- 7: a fresh angle on a known idea, or a known idea from another field applied here for the first time.
- 4: the standard answer with a twist.
- 0 to 2: the first thing anyone would say.

**Value**: if it works, how much does it matter to the people in the brief?
- 10: changes the outcome the brief cares about most, for most of the people it names.
- 7: a real improvement for a clear group.
- 4: nice to have.
- 0 to 2: solves a problem nobody in the brief has.

**Feasibility**: could the people in the brief actually start it, within their stated constraints?
- 10: the first step could start this week with what the brief says exists.
- 7: needs one thing that does not exist yet, and it is obtainable.
- 4: needs several things that do not exist, or one hard breakthrough.
- 0 to 2: breaks a hard constraint in the brief.

**Running cost** (`running_cost`, decision profile): once it exists, how cheap is it to keep alive? Higher is cheaper.
- 10: nothing new to pay for, watch, tune or page anyone about. Or it deletes an existing running cost.
- 7: a small recurring cost or one new thing to monitor.
- 4: a new metered dependency, a sync step, a second source of truth, or a knob that needs re-tuning as it grows.
- 0 to 2: a standing operational burden: on-call load, quota ceilings, a cost that grows faster than the value.

**Specificity**: is it a concrete concept someone could act on, or a theme?
- 10: who, what, and the first concrete move are all clear.
- 7: clear concept, the first move needs a guess.
- 4: a direction, not a concept.
- 0 to 2: a slogan.

**Emergence** (creative profile): does it combine ideas that were stronger together than apart?
- 10: the concept exists only because two different ideas collided, and the combination is the point.
- 5: builds visibly on one earlier idea and improves it.
- 0: a single idea with nothing added.

## The review criteria

The `review` profile scores a finding, not an idea. Severity (in `perspectives-prompt.md`) sorts first; this
total orders findings within a severity.

**Impact**: if this is left as is, how much does it cost the people the artifact is for, against its bar?
- 10: the artifact fails its purpose, or causes harm that is hard to undo.
- 7: a path that will be taken goes wrong, or a reader acts on something false.
- 4: an edge path, or a cost that arrives later.
- 0 to 2: polish.

**Confidence**: how sure are we the finding is real?
- 10: verified against the artifact: the line, the failing input, the source that contradicts the claim.
- 7: concrete evidence, not yet verified, or two lenses found it independently.
- 4: plausible, with one gap in the evidence.
- 0 to 3: a hunch. This is a gate, not a score: verify it or move it to Suspicions. It never ranks.

**Actionability**: does the author know what to change?
- 10: the location and the fix direction are both clear.
- 5: the problem is clear, the fix needs a decision.
- 0 to 2: "this feels off".

## The off-brief rule

Set `off_brief` to true only when a concept answers a different question from the brief, or breaks a
hard constraint the brief states. An off-brief concept cannot make the shortlist when a majority of
judges mark it so, whatever its total. Bold is not off-brief. Unusual is not off-brief.

## What is not rewarded

- **Safety** (creative profile). A safe idea is not a good idea. Feasibility is a score, not a veto.
- **Novelty for its own sake** (decision profile). New is worth 10 points there, not 30.
- **Polish.** A rough concept with a real insight beats a polished restatement of the obvious.
- **Length.** More words are not more idea.
- **Talking about quality.** "This innovative, robust concept" earns nothing.
- **The judge's own taste** where the brief does not ask for it.
