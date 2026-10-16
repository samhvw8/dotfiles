# Insight review: the idea, the intuition, then the verdict

The reader wants to understand why the paper works, not only whether to trust it.
Explain each key idea so it clicks, then review it. Keep two questions apart all
the way through: **is the idea good?** and **does the paper show it?** A beautiful
idea with weak evidence is a common, important finding.

## Output shape

Keep each field to 1-3 sentences. Read the appendix tables you cite.

```markdown
Basis: <copy read · tool and version (e.g. ML checks) · could not check: ...>

## The one idea
<the paper's thesis in one sentence a smart outsider would repeat>

## Why this was hard
<what breaks the obvious approach, with a concrete case. The idea only makes sense against this>

## Key ideas
### 1. <name the idea in plain words>
- **Intuition:** <an everyday analogy or picture with the same structure as the mechanism, and the failure it predicts>
- **How it actually works:** <the mechanism; one equation only if it carries the idea, with each symbol named>
- **Why it works:** <the paper's stated reason, quoted with its section; or your own reading, marked "(my reading)"; or "the paper does not explain why">
- **Where the analogy breaks:** <where the picture stops matching the mechanism>
- **When the idea would fail:** <the condition: data, setting, assumption. Should match the failure the analogy predicts>
- **Shown by:** <the experiment that isolates it, quoted or cited with its table and section, its number, and a confidence (the ledger row it supports, or your rating on the same scale). If only the outcome is tested and not the mechanism, say "outcome shown, mechanism not isolated". If nothing tests it, say "not tested">
(2-4 ideas. The ones the paper itself treats as contributions, plus any it relies on without saying.)

## A worked example
<one small, concrete case run through the whole method. Label the block "illustration": its numbers are made up unless cited>

## What changed
<what the field did before this paper, and the exact difference this one makes>

## Found outside the paper
<registration, released code or data, corrections, replications: one line each, with its source; "found, content not examined" when only a title was seen>

## Review
- **Strongest points:** <2-3, each with its evidence>
- **Main concerns:** <2-3, from the ledger's lowest-confidence rows and "Found outside the paper">
- **Verdict:** <is the idea good · is it shown · how far to trust the headline>

## What to borrow
<the transferable lesson: a pattern the reader could use in their own work, and the condition it needs>
```

## Rules for intuition

- **The analogy must share the mechanism, not the mood.** "Several witnesses
  tied to one fact" explains a shared pose across cameras; "a team working
  together" explains nothing. Test it: does the analogy predict the same failure
  the method has?
- **Name where it breaks.** Every analogy stops somewhere. Saying where keeps the
  reader from over-trusting it.
- **Use the paper's own numbers** to make sizes real ("0.35 s per frame set,
  about 3 per second"). Mark anything made up as an illustration.
- **Separate the authors' story from yours.** If the paper gives the intuition,
  quote it. If you supply it, say so.
- **Never invent mechanism.** If the paper does not say why something works,
  write "the paper does not explain why" instead of guessing.
- **Pictures beat paragraphs.** When the output feeds a visual deliverable (an
  explainer, slides, a video), give each key idea the one picture or animation
  that shows its mechanism: one scene per idea.
