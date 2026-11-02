# Brief mode

Claude explains a source so Sam can decide whether to go deep. Sam reads and asks
questions. Budget: Sam should finish it in 5–10 minutes.

## Template

Write the chat text by "Rendering for Sam" in the idea-bank schema: a headline
frame first, plain words, verbatim-only quotes, three voices kept apart, and bank
or memory content labelled. The headings below are for Claude; write them in
plain words in Sam's language.

```markdown
<one-sentence headline frame: the whole idea as a sharp picture>

<source title, type, date, and in plain words how much of it was read>

## How the authors see the problem
<3-5 short lines: their picture, what they think the real bottleneck is, what
surprised them, where the paper's story differs from their talks or posts.
Each line carries a verbatim quote with its section, a plain paraphrase with
its section, or "(my reading)".>

## The parts and the bet
The bet: if <X is the real bottleneck>, then <Y> should work (<section> or (my reading)).

| Part (the job it does) | What fills it here | Why they chose it |
|------------------------|--------------------|-------------------|
How the parts combine: <one line>. What forced their choices then: <one line>.
What they tried and dropped: <verbatim quote, or "none mentioned">.

## A worked example
<one small concrete case run through the idea, with numbers. Use the source's
numbers when it has them; otherwise label the block "illustration, numbers made
up".>

## New ideas to learn (at most 2)
<for each: two sentences and one everyday picture with the same structure, plus
where the picture breaks>

## What a reader would miss
- <one line each, with the passage it rests on: post-hoc changes, footnote
  hedges, hypotheses the authors rejected, a gap a tool from another field fits>

## Where it is weak
<2-4 lines. Design traps first, read from the source's own methods (checklist
below), then the source's stated limits, then (my reading).>

## What you could try
- <two or three one-line variations>

Stop here, or go deep?
```

## Where it is weak: design-trap checklist

Check the methods for these before writing the section; report the ones present,
each with its section. Skip the ones absent; never list the checklist itself.

- **Rivals that lose by construction:** a baseline or ablation that lacks an input
  or tuning the main model gets, or is built so it cannot fit the pattern tested.
- **Missing rival:** the obvious competing explanation that was never modelled.
- **Transfer built into the stimuli:** the "new" test set shares structure with
  the training or fitting set, so transfer is partly guaranteed.
- **Post-hoc changes:** weights, exclusions, outcomes or model terms added after
  seeing the data or residuals.
- **Fit on aggregates:** fit measured on condition or group means, which hides
  individual-level misfit and inflates r.
- **Survivors only:** averages over completers, runs that did not fail, posts
  that got replies.
- **Surrogate outcome:** the headline claim rests on a measure that does not test it.

## Last step: check every quote (mandatory)

Do this after the brief is written and before you send it. Fewer quotes are fine;
an unchecked quote is not.

1. List every string inside quotation marks in the brief.
2. Confirm each one is an exact match in the source text: run
   `~/.claude/skills/idea-mine/scripts/check_quotes.py <brief-file> <source-text>`,
   or Grep the source for the exact string (allow only whitespace and line breaks
   to differ).
3. For every string that is not an exact match, remove the quotation marks and
   write it as a paraphrase with its section, or replace it with the exact text.
   A near match is a paraphrase ("splits" quoted as "a split" is not verbatim).
4. Illustrative or example sentences you wrote never use quotation marks.
5. For a social source, confirm each point is attributed to the poster who
   actually wrote it, by username. Do not give a poster a gender ("he", "she")
   unless the source states it; use the username or "they".

When the source text is not on disk (only fetched passages), quote only from the
passages you hold, and check against them.

## Rules

- **i+1.** Explain with atoms Sam owns (`me/known-atoms.md`). Introduce at most two
  new atoms. When the source needs more, say "this source needs N new atoms; I
  taught the two that carry the idea" and list the rest by name.
- **Delegated clusters** get the interface form for their atoms: input, output,
  role, cost, when it fails. No internals.
- **Quote or mark.** Every line about the authors' view and the bet carries a
  verbatim quote with its section, a plain paraphrase with its section, or "(my
  reading)". Check quotes before output (Rendering for Sam, rule 3). Weakness is
  shown in "Where it is weak"; it never removes an idea.
- **What a reader would miss is specific.** Each line names the passage. For an
  unpopular idea, say in plain words why it is unpopular (the schema's reasons).
  The gem type goes in the card, not in chat.
- **No per-idea template.** One table for the parts, one worked example. Do not
  repeat intuition / mechanism / why / where it breaks for every idea: judges
  read that as padding.
- **Social sources:** name the poster for every idea from a comment, by username
  and without assumed gender, and keep the original post's claims apart from
  replies.
- **Answer Sam's questions from the source first,** then from the bank, then from
  general knowledge, and label each: "(from your bank: ...)", "(from memory,
  unchecked)".
- **Write the card** after a brief (Claude may write it in brief mode), so the bank
  grows even when Sam stops here. Mark it `read_basis` honestly.

## Worked example (illustration: invented source, made-up numbers)

Climbing moves set overnight like concrete: train less, sleep on it, and the move sticks.

A blog post by a climbing coach, read in full.

**How the coach sees the problem**
- He pictures it as "your fingers remember overnight, not during the session" (Section 2).
- He thinks the bottleneck is recovery time between sessions, not training volume (my reading).
- What surprised him: "my best students trained less" (Section 4). He had expected volume to win.

**The parts and the bet**
The bet: if the body needs time between sessions to lock a move in, short spaced
sessions beat long ones (Section 2).

| Part (the job it does) | What fills it here | Why they chose it |
|------------------------|--------------------|-------------------|
| Spread practice over time | three 20-minute bouts across a week | long sessions "burned people out" (Section 3) |
| Lock the change in after practice | sleep between bouts | his students improved after rest days (Section 4) |

How the parts combine: a loop of practise, sleep, practise.

**A worked example** (illustration, numbers made up): one hour on Saturday
against three 20-minute bouts on Monday, Wednesday and Friday. Same 60 minutes;
the spaced plan gets three nights of lock-in instead of one.

**New idea to learn: lock-in after practice.** Practice leaves a fragile trace,
and a later offline phase, often sleep, turns it into a stable change. Picture:
wet concrete that sets overnight. Where the picture breaks: some skills change
during practice and need no offline phase.

**What a reader would miss**
- Spacing is standard in memory research and almost unused in coaching movement
  (Section 1 names only climbing sources).

**Where it is weak**
- Survivors only: he counts the students who stayed with him, not those who quit
  (Section 4 lists current students).
- No comparison group trained the same minutes in one block (Section 4).
- He never says how he measured improvement (my reading).

**What you could try**
- The same bet for posture habits at a desk.
- Replace a night's sleep with a short nap as the lock-in step.

Stop here, or go deep?
