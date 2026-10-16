# Read it for me: a guide for someone with no science background

The reader is smart but not a scientist. They want three things: what the paper
found, how far to trust it, and how to read it themselves next time. Write in the
reader's language. Short sentences. Explain every term the first time it appears.
Never talk down.

## Output shape

```markdown
## In one sentence
<what they asked, what they found, and how sure we can be — no jargon>

## The story of the paper
- **Why they did it:** <the problem, in everyday terms>
- **What they did:** <the study, as you would tell a friend: who or what was studied, how many, for how long, compared with what>
- **What they found:** <the main result as a real number with its meaning: "out of 100 people, 3 fewer had a heart attack", or "its depth estimates are off by 16% on average, against 21% for the best earlier method">
- **How sure we can be:** <the ledger's confidence for the main claim (high / moderate / low / very low), with the one reason that matters most>
- **What it does NOT show:** <the tempting conclusion the paper does not support>

## What kind of study is this?
<place it on the ladder below, and say what that means for trust>

## Words you'll meet
| Word in the paper | What it means here |
|-------------------|--------------------|
<the 5-10 terms the reader meets most; explain rarer ones inline where they appear>

## How to read this paper yourself
<a reading path through THIS paper: which section, figure or table to look at, in what order, and what to look for in each. Add the general three passes below only when the reader asks how to read papers in general>

## Three things to know before you trust it
<the three caveats from the claim ledger, in plain words>
```

## The ladder of study types

Use the ladder that fits the paper.

**Health and behaviour.** From weakest to strongest evidence for "X causes Y in people":

1. **Opinion, a single story, a case report.** One example is not a pattern.
2. **Lab, cell or animal studies.** They show a mechanism can work. They do not show
   it works in people. Most results in mice do not carry over.
3. **Observational studies** (following people, comparing groups who chose
   differently). They show a link, not a cause: people who drink coffee differ
   from those who don't in many ways.
4. **Randomised controlled trials.** Chance decides who gets what, so the groups
   differ only in the treatment. The best single study for cause and effect.
5. **Systematic reviews and meta-analyses** of good trials. Many studies weighed
   together.

**Methods, ML and engineering.** From weakest to strongest evidence for "this method works":

1. **A demo or a few hand-picked examples.** A single story.
2. **One benchmark** (a standard test set): it beats others on that test.
3. **Several benchmarks, with ablations and repeated runs:** the gain holds across
   tests, each part's share is known, and it is bigger than run-to-run noise.
4. **Independent replication:** another team gets the same result with the code.
5. **Use in the real world:** it works on data nobody tuned it for.

**Mechanism (lab biology, cognition).** Ask how many independent methods show the
same mechanism, and whether it was shown in the system the claim is about (cells,
animals, people).

## Numbers in plain words

| The paper says | Say it as |
|----------------|-----------|
| Relative risk: "risk down 50%" | The absolute change too: "from 2 in 100 to 1 in 100". A 50% cut of a tiny risk is still tiny |
| Number needed to treat (NNT) = 50 | "50 people take it for one to benefit" |
| p < 0.05 | "unlikely to be pure chance if there were no real effect" — not "95% sure it is true", and not "big" |
| 95% confidence interval 1.1 to 3.0 | "the true effect is probably somewhere in this range"; a range that crosses "no effect" means not shown |
| Correlation, association, linked to | "goes together with", not "causes" |
| n = 12 | "only 12 people / samples": small studies swing by chance |
| State of the art (SOTA), outperforms | "scores best on this test, by this margin" — ask how big the margin is |
| Ablation | "they removed one part to see how much it mattered" |
| A score on a benchmark (error, accuracy, a named metric) | What it measures in everyday terms, and which direction is better. Then the margin over the best earlier method |
| A small margin with no repeated runs or error bars | "we can't tell if this gap is real or luck" |
| Results only for people who finished, runs that worked, cases that kept going | "the failures were left out, so the average looks better than reality" |

## Questions to ask about any paper

1. Who or what was studied? People, mice, cells, a computer benchmark?
2. Compared with what? No comparison means no conclusion.
3. How many? How long?
4. How big is the effect, in absolute terms?
5. Has anyone else repeated it?
6. Who paid for it, and does anyone gain from the result?
7. Does the headline (news, press release, abstract) say more than the results?

## How to read any paper (adapted from Keshav's three passes)

1. **Five minutes:** title, abstract, the figures and their captions, the last
   paragraph of the conclusion. Can you say what they claim?
2. **One hour:** the methods (who, how many, compared with what) and the main
   results table or figure. Does the result match the claim?
3. **Only if it matters to you:** the details, the supplement, and what other
   people said about it after publication.

Skip the introduction's history and the equations on the first pass. The
Discussion is the authors' opinion; the Methods and Results are the evidence.
