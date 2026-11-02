# Triage cards (L2)

## The i+1 rule

Write in atoms Sam `owns` (`me/known-atoms.md`). A card may add at most two new atoms.
Explain each new atom in two sentences plus one concrete picture with the same
structure as the mechanism. If a source needs more than two new atoms, either explain
only the two that carry the idea and say "needs N more atoms to read deeply", or
leave it for a later batch. Mark atoms that are `seen` but not `owned` as review
chances: "you met this in <card>".

When `known-atoms.md` is empty (the first batches), list the ideas the cards lean
on, in plain words, at the end of the batch and ask Sam which he already knows.
That calibrates the next batch. Never print a guess about what Sam knows.

## Templates (bank file, English)

Core:

```markdown
## <n>. [<gem type>] <one-line idea as a title>
- Cluster: <cluster> · Level: core · Read: <basis>
- Idea: <one sentence>
- Recipe: <owned atom> + <owned atom> + [NEW: <atom>] — operator: <how they combine>
- New atom <name>: <two sentences>. Picture: <one concrete image>.
- Why it is a gem: <the gem, and for unpopular the diagnosed reason>   # hidden at stage >= 2 until Sam guesses
- Why you might care: <tie to a scope or one of Sam's projects>
- Deep read: ~<n> min · needs <k> new atoms · zoom: co-read brief
```

Adjacent, and any cluster with no level yet (never the one-line form): idea, the atom's role ("what it does, when to use it"), one
picture, why it is a gem, why you might care, zoom.

Delegated (one line):

```markdown
- [<gem type>] <field>: <atom> takes <input> → <output>; does <role>; costs <cost>; fails when <condition>. Fits your <scope problem>. zoom?
```

## Chat rendering

Show the cards in the language Sam writes in, by "Rendering for Sam" in the
idea-bank schema. The bank template above is not the chat form: in chat, drop the
Cluster/Level/Read line, the gem-type tag and the bracketed NEW markers. Each card
opens with a plain headline sentence, names any part by the job it does (with a
one-phrase gloss the first time), says in plain words why a reader would miss it,
and why Sam might care. Quote only verbatim text. Keep the same order and
numbering as the file. After the cards, add one line on links between cards (two
cards that share a question), then the vote request:

`Vote each card: up | down | later + one word (e.g. "1 up design, 3 later busy").`

## Worked example (from batch 261102-batch-1, card 1)

```markdown
## 1. [unpopular] Retrieval practice costs working memory
- Cluster: learning · Level: (none yet) · Read: passages
- Idea: the testing effect only helps when working memory has room to spare.
- Recipe: retrieval attempt + [NEW: post-retrieval re-encoding] — both draw on one
  working-memory pool; when the pool runs dry, re-encoding does not happen.
- New atom post-retrieval re-encoding: after you recall correctly, the brain spends
  extra effort to engrave the answer again; that second step is part of why testing
  works. Picture: finding a book on a shelf, then gluing its label on more firmly.
- Why it is a gem: a widely praised technique gets a boundary condition; unpopular
  because the field sells retrieval practice as universal (unfashionable to qualify it).
- Why you might care: our own reading protocol opens with a recall quiz; do it when
  your head is clear, and give feedback after.
- Deep read: ~20 min · needs 1 new atom · zoom: co-read brief
```

Why it works: it uses one new atom, names the operator, diagnoses the unpopularity,
ties to something Sam does, and states the read basis.

The same card in chat:

> **1. Testing yourself only helps when your head has room left.**
> Recalling an answer has two steps: finding it, then engraving it again (the
> second step is the part people forget). Both draw on working memory; when it
> runs out, the engraving step is skipped. Picture: finding a book on the shelf,
> then gluing its label on more firmly. Most advice sells self-testing as
> always good; this study shows when it is not. Why you might care: our reading
> sessions open with a recall quiz, so do it when you are fresh, and check the
> answers after.
