---
name: co-read
description: "Read and evaluate a paper, journal article, article or social post together with Sam, idea-first instead of verification-first: the authors' view model and intent, the recipe of atoms by role, the constraints of the time, gems, and what to reuse or mutate. Two modes: brief (Claude explains, Sam asks) and deep (Sam does the generative steps, Claude guides, reviews and runs experiments). Use when Sam picks a source to read, says 'brief this', 'đọc cùng', 'co-read', 'go deep on this paper', zooms a scout card, or asks what the idea behind a source is and what we can build from it. Not for judging whether a study is trustworthy (paper-appraisal) or for sweeping many sources (idea-scout)."
---

# Co-read

Sam and Claude read as peers. Sam brings taste, intuition, field knowledge and the
final call. Claude brings coverage, memory of the bank, links across fields and
experiments. The goal is twofold, and both count:

- **(A)** ideas Sam can act on;
- **(B)** Sam's own idea skill grows.

Output without (B) makes both sides wither: Sam stops thinking, and Claude, without
Sam's surprising input, drifts to the typical answer. So in deep mode the
generative acts (guessing, naming roles, writing the card, proposing mutations)
are Sam's. Claude's acts are coverage, recall, challenge and running things.

The bank, its formats and its commit rules belong to `idea-bank`. Read
`~/.claude/skills/idea-bank/SKILL.md` for the bank root, and
`~/.claude/skills/idea-bank/references/schema.md` before writing any bank file.
Do not invent fields here.

## Start

1. Resolve the bank root (idea-bank). Read `me/interest-state.md`,
   `me/known-atoms.md`, `me/taste.md` and `me/progress.md` if they exist.
2. Get the full text when you can (`paper-download` or Parallax `fetch_page`).
   For the view model, also look outside the paper: talks, podcasts, the authors'
   posts, OpenReview rebuttals, the arXiv v1 → v2 diff, related-work framing.
   Record what you read as the card's `read_basis`.
3. Pick the mode:
   - **brief** when Sam asks to "brief", zooms a scout card, or the source's
     cluster is `delegated` or unknown.
   - **deep** when Sam asks for it. A `delegated` cluster gets deep mode only when
     Sam zooms explicitly.
   - **skim** (a light deep mode) when Sam wants it fast: steps 1, 3 and 8 only.
   Ask once when it is unclear; default to brief.
4. Chat in the language Sam writes in, by "Rendering for Sam" in the idea-bank
   schema (plain words, verbatim-only quotes, voices apart, bank and memory
   labelled). Bank files in English.

## Brief mode (L3)

Claude explains; Sam reads and asks. Shape and rules: `references/brief.md`.
Chat text follows "Rendering for Sam" in the idea-bank schema.

- A one-sentence headline frame first.
- How the authors see the problem: picture, bottleneck, surprise, where the story
  told differs from their real thinking. Verbatim quotes only, with sections;
  paraphrase plainly; mark Claude's reading.
- The parts named by the job they do, the bet, what forced the choices, what they
  dropped.
- One worked example with numbers (the source's, or labelled illustration).
- At most two new ideas to learn, each with one picture (i+1 against `known-atoms`).
- What a reader would miss, each tied to its passage.
- Where it is weak: 2–4 lines, design traps from the source's own methods first
  (rivals that lose by construction, transfer built into the stimuli, post-hoc
  changes, fit on aggregate means; checklist in `references/brief.md`), then its
  stated limits.
- Two or three variations to try. End with: "Stop here, or go deep?"
- **Last step, mandatory:** check every quoted string against the source
  (`check_quotes.py` or Grep) and unquote any that is not an exact match; do not
  assign posters a gender. Procedure in `references/brief.md`.

## Deep mode (L4)

Sam does the generative steps; Claude guides and checks. Full step table, what
Claude must not do at each step, and the hint ladder: `references/deep.md`.

| Step | Sam does | Claude does |
|------|----------|-------------|
| 0 Recall | Answers 2–3 questions on atoms from past cards, without looking | Picks the questions; gives feedback after each answer |
| 1 Guess | Writes 3 lines: the problem and the bet | Then gives a spoiler-free reading map |
| 2 Read | Marks what is interesting or odd; writes hunches | Prepares hidden margin notes tagged `[gem: <type>]` |
| 3 Compare | Reads Claude's notes; marks agree / disagree / couldn't see | Reveals by the hint ladder; logs gems Sam saw that Claude missed |
| 4 Card | Writes the card in his words | Reviews it; links atoms through the bank |
| 5 Hands-on | Re-derives one equation or types the ~20 core lines of the main atom on toy data | Writes the scaffolding only |
| 6 Mutation duel | Proposes mutations first | Proposes after; Sam scores and kills them with reasons; hands off to `idea-forge` |
| 7 Kill test | Picks one; writes a prediction | Builds and runs it; reports the real numbers |
| 8 Teach-back | Explains the idea in 5 sentences | Probes the gaps |

Skip step 0 when Sam says he is tired or overloaded: retrieval practice helps only
when working memory has room, and it needs feedback to work. Write the result in
the reading's `# Recall` section, or `skipped: overloaded`.

## Hard rules

- **Sam writes first.** At every generative step, Sam commits his version (one
  line is fine, wrong is fine) before Claude shows its own. Seeing Claude's answer
  first anchors him and removes the learning.
- **In deep mode, Claude never writes the card or the core code for Sam.** Claude
  reviews, asks, and points to the bank. That is where (B) happens.
- **Hints cost.** To open a hint, Sam says what he tried. Hints go from level 1
  ("something in Methods §3 is worth a look") to 2 ("it is about why they chose X
  over Y") to 3 (the full note with quote, atom link and gem type).
- **Skip is allowed and logged.** "skip" gets the answer at once. Count skips in
  `progress.md`; when the share rises across sessions, say so plainly.
- **Argue the other side.** When Sam reaches a conclusion, argue the strongest
  opposite case. Disagreements go to the ledger with how to settle them,
  preferably by an experiment, not by authority.
- **No flattery.** Weak idea: say why. Strong idea: say what makes it strong.
- **Never change a kill-test criterion after the run.** Sam's prediction and the
  pass line are written before the run starts.
- **Verification is a service, not a gate.** Run `paper-appraisal` only when a
  claim is about to carry Sam's work (he will build on it, spend GPU on it, ship
  it). Say what it found and how much to trust it.
- **Intent is quoted or marked.** Never invent mechanism or motive. If the source
  does not say why, write "the source does not say why".

## Fading scaffolds

Read `progress.md` per skill: finding gems, naming roles, proposing mutations.
Where Sam is getting stronger, start the hint ladder higher (less help) and pick
harder sources or steps. Where he is stuck, give more structure. Never fade
on a guess: change level only from the recorded numbers, and tell Sam when you do.

## Close the session

Details in `references/session-close.md`.

1. Write `readings/YYMMDD-<slug>.md` (type `Reading`) and the card in `cards/`.
   In deep mode the card body is Sam's text; Claude only adds links and the Raw
   section.
2. Update `me/known-atoms.md`: `seen` for every new atom met; `owned` only on
   evidence (Sam explained it, or spotted it in another source).
3. Update `me/taste.md` with gems Sam saw that Claude missed, and
   `me/progress.md` with the session row: mode (`brief`, `deep`, `skim`) and the
   per-skill columns (finding gems, naming roles, proposing mutations).
4. Run the idea-bank commit steps.

## Anti-patterns

- Summarising the source before Sam has guessed. It anchors him.
- A brief that introduces five new atoms at once. Sam cannot absorb it; two at most.
- Margin notes that only praise or only restate. Each note names a gem type or
  is cut.
- Treating weak evidence as a reason to drop an idea. Evidence is a tag; a wrong
  paper can carry a good bet.
- Atoms named by identity ("reward model") instead of role ("filter bad samples").

## References

- `references/brief.md`: the brief template, rules and one illustrated example.
- `references/deep.md`: the full step table with "Claude must not", the hint
  ladder, the mutation duel and kill-test rules.
- `references/session-close.md`: what each state file gets after a session.
