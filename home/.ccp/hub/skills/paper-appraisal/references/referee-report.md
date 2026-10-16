# Scientist review: a referee report

Write the review a careful expert referee would write for the journal or
conference. The claim ledger and "Found outside the paper" are your raw material:
major concerns come from their lowest-confidence rows.

## Criteria

Rate each one: **strong**, **adequate**, **weak** or **can't tell** (not reported).
Every rating cites the sentence, table or figure it rests on.

| Criterion | Ask |
|-----------|-----|
| Question and novelty | Is the question clear? What is new compared with the closest prior work? Name that work. |
| Significance | If the result holds, who changes what they do? |
| Soundness of methods | Does the design answer the question? Right comparison group, controls, sample size, blinding where it matters. Use the design's tool (RoB 2, ROBINS, ML checks) for the detail. |
| Results support the claims | Does each claim in the abstract and conclusion follow from a result in the paper? Flag claims wider than the evidence. |
| Statistics | Effect sizes with intervals, not only p-values. Multiple comparisons, power, variance across runs. |
| Reproducibility and openness | Registration or preregistration, data, code, materials. Could another lab repeat it from the paper? Does what was released match what was reported (no kept bugs, no later changes to data or evaluation)? |
| Related work | Fair to competing work? Missing obvious comparisons or citations? |
| Clarity | Could an expert reproduce the reasoning? Figures readable, terms defined? |
| Limitations and ethics | Are the real limitations stated, not only the safe ones? Ethics approval and consent where people or animals are involved. |

## Report shape

```markdown
## Summary
<3-4 sentences in your own words: the question, what they did, what they found, what they claim>

## Strengths
- <specific, with the section>

## Major concerns
1. <the problem> — <where (section, table)> — <why it matters for the main claim> — <what would resolve it: an analysis, an experiment, a rewording>

## Minor concerns
- <wording, figures, missing details that do not change the conclusion>

## Questions for the authors
- <questions whose answer could change your verdict>

## After publication
- <corrections, replications, code fixes, PubPeer: one line each with its source. For a change seen only by its title, say "found, content not examined">

## Ratings
| Criterion | Rating | Based on |
|-----------|--------|----------|

## Verdict
<the venue's own scale when known (e.g. a conference's accept / borderline / reject plus your confidence), else accept / minor revision / major revision / reject>, with the one or two reasons that decide it. For a published paper, judge it as it stands now, after-publication findings included, and say so.
```

## How a good referee writes

- Specific beats general: "Table 4 omits variance" beats "statistics are weak".
- Separate "this is wrong" from "this is not shown yet". The second asks for
  evidence; the first needs proof.
- Every major concern says what would fix it. A concern with no possible fix is a
  reason for the verdict, not a request.
- Judge the paper the authors wrote, not the paper you would have written.
- For a published paper, add what happened after publication (corrections,
  replications, code fixes): the original referees could not see it.
