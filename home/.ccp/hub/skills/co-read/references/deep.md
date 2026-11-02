# Deep mode

Sam does the generative steps. Claude guides, reviews, recalls and runs
experiments. Each step waits for Sam's input before Claude reveals its own.

## Steps

| Step | Sam must | Claude does | Claude must not |
|------|----------|-------------|-----------------|
| 0 Recall | Answer 2–3 questions on atoms from past cards, without looking | Pick atoms Sam will meet again in this source; give feedback after each answer | Give the answer before Sam tries; run this step when Sam is overloaded |
| 1 Guess | Write 3 lines: what problem they solve, and their bet | Then give the reading map: where gems likely are and why; 3–5 questions to carry; "you own these atoms, skim §X"; "this part is new" | Summarise the source or name its conclusion |
| 2 Read | Mark what is interesting or odd; write hunches | Prepare margin notes, each tagged `[gem: <type>]` with its passage, kept hidden | Show notes before Sam says he is done |
| 3 Compare | Mark each Claude note: agree / disagree / couldn't see | Reveal by the hint ladder; log gems Sam saw that Claude missed; ledger the disagreements | Win a disagreement by authority |
| 4 Card | Write the card (schema `Idea Card`) in his words | Review: roles named by job, quotes present, bet vs result kept apart; link atoms to the bank and flag same-structure atoms under other names | Rewrite the card for him |
| 5 Hands-on | Re-derive one key equation, or type the ~20 core lines of the main atom on toy data | Write loaders, plots, harness; explain errors when asked | Write the core lines |
| 6 Mutation duel | Propose mutations first (aim for 3+) | Propose after, typed by operator; Sam keeps or kills each with a reason; hand the survivors to `idea-forge` | Present a list for Sam to nod at |
| 7 Kill test | Pick one mutation; write a prediction and the pass line | Build and run the cheapest test that could kill it (`paper-replicate`; the home GPU box per Sam's rules when idle); report real numbers | Change the pass line after the run |
| 8 Teach-back | Explain the idea in 5 sentences, as to a colleague | Ask about each gap; note what to revisit | Correct it for him |

**Skim** runs steps 1, 3 and 8 only. Sam still guesses first and teaches back.

## Hint ladder

Sam opens a hint by saying what he tried.

| Level | Example |
|-------|---------|
| 1 | "Something in Methods §3 is worth a second look." |
| 2 | "It is about why they chose X over Y." |
| 3 | The full note: the quote, the atom link, the gem type and why it matters |

Start level comes from `progress.md`: where Sam's unaided gem count is rising,
start at level 1 and wait longer; where he is stuck, start at level 2.

## Disagreement ledger

| Point | Sam's view | Claude's view | How to settle | Status |
|-------|-----------|---------------|---------------|--------|

Prefer "settle by experiment" or "settle by a second source". "Open" is a valid
status. Claude argues the strongest opposite case once per conclusion.

## Kill test rules

- The prediction and the pass line are written in the Reading file before the
  run starts.
- The cheapest test that could kill the idea comes first: a toy dataset, a small
  simulation, a five-minute script.
- Report the miss with the real output. A killed idea is a good result; record it
  in the atom's `kill_tests`.
- Heavy compute: check the home server first (`ssh me.ubuntu.home nvidia-smi`);
  long jobs run in a named tmux session per Sam's rules.
