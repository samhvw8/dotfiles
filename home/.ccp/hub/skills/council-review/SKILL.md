---
name: council-review
description: Reviews work with several independent reviewer agents on a model the user names, gives a verdict on every finding by checking it against the code, then fixes only the confirmed ones and re-checks the fixes. Also gives a verdict on a review someone else wrote (a pasted reply, REVIEW.md, PR bot comments). Use when the user asks for a council, panel or N agents to review code, a plan or recent work ("council of 3 sonnet review this then verdict then fix", "review the last 2 days of work", "vedict this review", "check their fix and its quality"). For brainstorming new ideas, use council; for one quick pass over a diff with no fixes, /code-review is cheaper.
---

# Council review

Several independent reviewers find more than one, and a verdict step keeps their
false positives out of the fix list. Run review, verdict and fix as one flow.

## 1. Scope and panel

- **Scope** is what the user named: uncommitted changes, a branch against `main`, a
  commit range, "the last N days" (`git log --since`), a plan file, or the whole
  project. State it with the file and commit counts before spawning anything.
- **Panel:** the number and model the user named; default 3 reviewers on the
  harness's strongest model. In Claude Code, pass the model to the Agent tool
  (`sonnet`, `opus`, `haiku`, `fable`, or a full ID). In omp, use the model ID the
  user gave. Say the agent count up front: each reviewer is a full run.
- **Pasted review** (another agent's reply, `REVIEW.md`, PR comments via
  `gh api repos/{owner}/{repo}/pulls/{n}/comments`): skip the panel and go to step 3
  with its claims as the findings.

## 2. Independent reviews

Give each reviewer only the goal, the scope and how to read it (paths, the diff
command, how to run the tests). Don't pass this session's conclusions or design
rationale: a reviewer who reads them grades the reasoning instead of the code. Give
each a different lens that fits the work: correctness and edge cases, security and
data handling, design and maintainability, performance, and for UI, what a user sees
(screenshots with `bsk`). Ask each for findings as: file:line, what fails and the
concrete input that makes it fail, severity, and confidence. Run them in parallel.

## 3. Verdict

Merge duplicates, then check every finding against the code yourself, or with one
fresh verifier agent for a large set. Use the instruments that settle it: read the
code path, run the tests, write a failing test or a probe that reproduces the claim,
and use `git show`/`git log -S` for "this regressed" claims. Mark each:

| Verdict | Meaning |
|---------|---------|
| CONFIRMED | reproduced, or the code path plainly shows it |
| REJECTED | the evidence shows it can't happen; say why |
| UNSURE | can't settle without access you lack; name it |

Correct the severity when the reviewer misjudged it.

## 4. Fix

Fix the CONFIRMED findings only, worst first. Each fix starts from a failing test
when one can be written. Run the full test suite after the fixes. Then give the fix
diff to one fresh reviewer and ask: does each fix remove the cause, and did it break
anything? Repeat for anything it confirms. Leave UNSURE items unfixed and listed.
Don't commit unless asked. For PR comments, draft the replies, and post them only
when asked.

## Report

One table, one row per finding: source, claim, verdict, evidence, and fix
(commit or diff summary, plus the test that covers it). Under it: the panel (count
and model), the scope, the test results before and after, and what is left.
