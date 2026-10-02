---
name: arena
description: >-
  Make many versions of Claude fight to the death over one task. Spins up N
  sub-agents (default 16, --quick for 8, --full for 100), gives every one the exact same
  task plus a different strategy card (reasoning mode, workflow, strategy),
  then runs a single-elimination bracket: they attack each other's solutions,
  defend and revise (borrowing from the opponent only what fits their own
  card), and a judge scores every match on a written rubric until one solution
  survives. The champion then studies the strongest competitors it outlasted,
  keeps a ledger of what to learn and what not to, is attacked again, and only
  keeps the rethink if a blind judge prefers it. Use when the user is not satisfied with an answer,
  calls it a bad answer, says try again or do better, says "arena", or asks
  to make them compete.
argument-hint: "[--agents N | --quick | --full] [--seed S] [--no-learn] <task>"
---

# arena

For when Claude keeps giving a bad answer. Instead of asking again and again, this runs a tournament:
N sub-agents get the exact same task, each attacks it with a different reasoning mode, workflow and
strategy, and then they attack each other in a bracket until one solution is left. You are the
orchestrator. You never compete and you never judge.

What the user typed after `/arena`: `$ARGUMENTS`

If that is blank, or still reads like a placeholder, nothing was passed: take the task from the
conversation.

## The tool

Every piece of bookkeeping goes through `bracket.py` in this skill's folder:

```bash
python3 "${CLAUDE_SKILL_DIR}/bracket.py" <command>
```

Below, `ARENA` means exactly that command. If the path looks unexpanded, use the "Base directory for
this skill" that Claude Code printed at the top of this skill. The state lives in
`.arena/<run>/arena.json` in the current directory, and every command after `init` finds it through
`.arena/LATEST`.

## Step 1: size it, and get a yes if nobody asked for it

Read the flags out of the request. Everything that is not a flag is the task.

| flag | meaning |
| --- | --- |
| `--agents N` | N competitors. Default 16, the everyday setting. |
| `--quick` | 8 competitors. |
| `--full` | 100 competitors. Only when the user asks for it by name or by size. |
| `--seed S` | Fixes the cards and the pairings. Default: random, and recorded. |
| `--wave W` | Sub-agents in flight at once, as a rolling pool. Default 6. |
| `--no-learn` | Skip the learn step after the final. |
| `--learn-from K` | How many of the strongest eliminated competitors the champion studies. Default 6. |

No task text at all means: the task is the user's most recent request in this conversation, and your
last answer to it is the baseline to beat.

Run `ARENA plan` with the same size flags. It prints the rounds and the sub-agent calls.

- **The user asked for the arena** (typed `/arena`, said "arena", or asked to make them compete):
  tell them in one line how big it is, for example "16 agents, 4 rounds, 96 sub-agent calls", and
  start.
- **This skill fired because the user is unhappy** ("that's wrong", "try again", "bad answer") and
  never mentioned the arena: ask once before spending anything. Offer three options: the default
  arena (16 agents, 96 calls), `--quick` (8 agents, 48 calls), or an ordinary retry. Wait for the
  answer.

Every arena is expensive: even 16 agents can use up a session's usage limit before the final. Say so
in the same line as the size. Nothing is lost when the limit hits: the whole run is on disk. When
the user comes back, run `ARENA status`, then `ARENA next`, and carry on from there.

Sub-agents write their work into `.arena/` in the current directory. In the default permission mode
that is one approval per file, which is hundreds on a big run. Before the spawn phase, suggest
accept-edits mode (Shift+Tab) for the run. Do not change the user's settings yourself.

## Step 2: write the task file

This is the step that decides the result. **Sub-agents cannot see this conversation.** Every
competitor, attacker and judge knows only what is in the task file, so write `.arena/task.md` to stand
on its own:

- The request, in the user's own words where you can.
- Every requirement and constraint the user stated anywhere in the conversation: audience, length,
  format, tone, stack, deadline, what must not change.
- The context a stranger would need: absolute paths of the files that matter, pasted data, what the
  product is, the conventions in the codebase.
- What "done" looks like, if the user said.
- If there is an answer to beat: what the user disliked about it, in their words.

If the task depends on facts that change or that you are not sure of (versions, current APIs, prices,
laws, recent events, what already exists), research them yourself now, once, with WebSearch or Parallax.
Write what you found, with URLs, into the task file under a heading "Facts gathered for this task".
Competitors do not search the web: one shared set of facts keeps all of them working from the same
ground and costs one search instead of a hundred. Searching per competitor would also pull them all
toward the same top results, which defeats the different cards.

Do not add requirements the user never gave. Do not write your own view of the right answer into it:
that pushes 100 agents the same way, which is the opposite of the point.

If there is an earlier answer the user was not satisfied with, write it word for word to
`.arena/baseline.md`.

## Step 3: init

```bash
ARENA init --agents N --seed S --task-file .arena/task.md --baseline-file .arena/baseline.md
```

Leave out `--baseline-file` when there is nothing to beat, and `--seed` to get a random one. `init`
copies the task into the run folder, deals every competitor a different strategy card with no
repeats, pairs round 1, and writes `arena.json`.

`init` first fits the deck to the task, so a card like "speed" or "fewest moving parts" is not dealt
to a task that does not value it. `bracket.py` picks the scorer and falls back on its own (the
order and the flags are in `ARENA init --help`). `init` prints which scorer it used, what it kept
and why it fell back, and the scores stay in `relevance.json`. Tell the user in one line.

## Step 4: the loop

Always drive it with `ARENA next`. It reads the state on disk and tells you the next step and the
exact command.

Every phase that runs sub-agents works the same way:

1. `ARENA prompts <phase>` writes one brief per job and lists the jobs still to run.
2. Launch them as a **rolling pool**: at most W in flight (default 6), and start the next queued job
   as soon as one finishes, rather than waiting for a whole batch. Each job is one Agent tool call
   (called Task in older Claude Code versions):
   - `subagent_type`: `general-purpose`
   - `description`: `arena <job id>`
   - `prompt`: `Read <prompt path> and follow it exactly. It is your whole brief.`
3. When every job in the phase has finished, run `ARENA next`. If an output is missing it sends you back to the same
   phase, and `prompts` then lists only the missing jobs. Re-run those once. If a job fails twice,
   write the single line `NO OUTPUT` into each of its output files (`ARENA check <phase>` lists
   them) and move on. A missing attack counts as no attacks. A missing solution loses its match. A
   judge that fails twice gets a third, fresh run: never decide a match yourself.

The order `next` takes you through:

- **spawn**, once: every competitor writes its own solution to the task.
- then every round: **attack** (two per match) → **defend** (two per match) → **judge** (one per
  match) → `ARENA collect` → `ARENA advance`.
- **learn**, once there is a champion (skip with `--no-learn`): the champion reads the strongest
  competitors it outlasted and the verdicts that eliminated them, writes a ledger (LEARN: what it
  takes and why it fits its card; DON'T LEARN: what it leaves, as LOST, OFF-VISION, BLOAT, TASTE or
  CLASH), and a rethought solution. Then **probe** (the runner-up and one more eliminated competitor
  attack the rethink, hunting regressions and clashes) → **refine** (the champion concedes, rebuts
  or drops borrowed parts, and revises) → **recheck** (a blind judge compares the original champion
  with the refined version) → `ARENA collect`. The refined version replaces the champion only if it
  wins. Five sub-agent calls.
- **final**, once, only when there is a baseline: a judge compares the champion with the answer the
  user rejected, blind to which is which. Then `ARENA collect`.
- `next` prints DONE: go to step 5.

After each `advance`, give the user one line, such as "Round 2 done: 25 of 100 left." Nothing more.
Never paste pairings, attacks, verdicts or solutions into the chat.

Why a rolling pool of 6: it keeps the machine and the rate limits calm, and a slow agent never holds
up the rest of a batch. Raise `--wave` only if the user asks.

## Step 5: the result

Run `ARENA winner`, then read the champion's solution file at the path it prints, and the learn
ledger if it prints one. If `winner` reports a large scratch folder, offer to delete it with
`ARENA clean`. Those are the only files you read in the whole run. Give the user:

1. **The winning solution**, in full.
2. **Why it won**: the attacks it survived, from `winner`, as a short list. Its card on one line
   (reasoning mode + workflow + strategy).
3. **Rounds**: for example "7 rounds, 100 agents in, 1 left."
4. **What it learned, and what it refused to learn**: from the ledger, the LEARN items in one line
   each (from whom, what), and the DON'T LEARN reasons in a short tally. Then the recheck: whether
   the refined version or the original won, and by how much. If the original won, say the learning
   did not survive scrutiny.
5. **Against the answer you rejected**, if there was one: the final check's scores, honestly. If the
   old answer scored higher, say so plainly and show both.
6. Where the full record lives: the run folder.

If the solution changes files in the user's project, do not apply it. Ask: apply it, or change it?

## Rules for the orchestrator

- You run the tournament. You do not compete, attack or judge, and you never pick a winner.
  `collect` records what the judges decided. `record` is only for fixing bookkeeping when the user
  asks you to.
- Every sub-agent gets the task through its brief, which `prompts` builds from the one task file,
  byte for byte the same for everyone. Never paraphrase the task for one agent or add a hint to one
  agent's call.
- Do not read solutions, attacks or verdicts during the run. There are hundreds of them. The state
  is on disk, and `next`, `status` and `pairings` are all you need. The learn step is the
  champion's own work: never pick what it should learn for it.
- If your context gets compacted mid-run, nothing is lost. Run `ARENA status`, then `ARENA next`,
  and carry on.
- Run every `ARENA` command from the directory you ran `init` in. That is where `.arena/LATEST`
  lives.
- Sub-agents only write inside `.arena/`. If one wrote anywhere else, tell the user.
- Sub-agents never drive a live production site. If the task needs the running product, put a local
  URL or local build in the task file, and say in it that the production URL is off limits.
- The run freezes its own copy of the templates and the rubric at `init`. Editing this file mid-run
  changes the next run, not the one in progress.
- An `arena warn:` or `arena error:` line on stderr is a fault in the tooling, not in the
  competitors' work. Keep going, and at the end run `ARENA log --level warn` and tell the user what
  went wrong in one line each, so the skill can be fixed.
- If the user says stop, stop. `ARENA status` shows where it got to, and `ARENA next` resumes it
  later.

## The prompt templates

`bracket.py` fills these in (the `{{placeholders}}`) and writes one brief per job, so what you see
here is exactly what every sub-agent is told. Never edit a brief for a single agent.

### Competitor, in the spawn phase

<!-- template:competitor -->
```text
You are competitor {{agent}} in an arena of {{n}}. All {{n}} competitors got the exact same task, word for word. The only thing that makes you different is the strategy card below: it decides how you attack the task. Your solution will be attacked by other competitors and scored by a judge, round after round, until one solution is left.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

{{baseline_note}}

=== YOUR STRATEGY CARD ===
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}
=== END OF THE CARD ===

How to work:
1. Use the card for real. Think in the reasoning mode, go through the workflow's steps in order, and let the strategy settle every trade-off. A generic answer with the card's name on top will lose.
2. Meet every requirement the task states. The judge scores you against the task, not against your card.
3. You cannot ask the user anything. Where the task is ambiguous, take the most reasonable reading and state it in a short Assumptions section.
   Do not search the web. The facts you need are in the task and the files it points to. If a fact you need is missing, state your best belief as an assumption, so attackers and judges can check it.
4. Expect attacks: concrete flaws, counterexamples, missed requirements. Close those holes before you submit.
5. Do not create, edit or delete anything outside {{arena_dir}}. Read whatever the task points to. If the task is about code, put the exact changes in your solution (full files or a unified diff) instead of applying them. If your workflow needs scratch space, use {{arena_dir}}/scratch/{{agent}}/, and delete any browser profile or other bulky leftovers there before you finish.
6. Never drive a live production site: no logins, form submissions, load or automated browsing against it. If the task needs the running product, use the local URL or build the task names. If it names none, work from the files.
7. Write at the length the task needs. Longer does not score better, and your strategy's trade-offs decide what to leave out.

Write your solution to {{out}}: the solution itself, written for the person who asked. Leave out your drafts and your working. Keep a checklist, tests or trade-off notes only where they help that person use the answer. Say nothing about the arena, attacks, your card or your competitor number, and do not use your card's names as headings: the judges score the work blind.

When the file is written, reply with this one line and nothing else:
DONE {{agent}} <number of words in your solution>
```
<!-- /template:competitor -->

### Attacker, in every round

<!-- template:attacker -->
```text
You are competitor {{agent}} in round {{round}} of an arena, match {{match}}. Your opponent is {{target}}. Only one of you gets out of this match. Right now your job is to attack your opponent's solution.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Your strategy card is the lens you look for flaws through:
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}

Read your opponent's solution: {{target_solution}}
You may read your own for comparison: {{own_solution}}. Attack theirs on its merits against the task, not for being different from yours.

Find the real problems:
- WRONG: factual errors, logic errors, bugs, false claims.
- MISSING: a requirement the task states that it skips or only half meets. Quote the requirement.
- BREAKS: a concrete input, scenario or edge case where it fails. Give the exact counterexample.
- VAGUE: a place where the user could not act on it without guessing.

Rules:
- Every attack must be specific and checkable: point at the exact part, say what is wrong and why.
- No praise, no summary, and no style nitpicks unless they stop the user from using it.
- Do not invent requirements the task does not state. Do not attack the approach, only what it gets wrong.
- At most 5 attacks, strongest first. If you only find 2 real ones, write 2. Filling the list with weak attacks makes your opponent's answer longer, not better, and a judge discounts them.
- Label each FATAL (wrong or unusable for the task), MAJOR (a real gap) or MINOR.
- If an attack rests on a factual claim the task and its files cannot settle (a version, an API, a number, a date, a rule), you may check it on the web to prove it. Load them with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page. If those are not available, use WebSearch and WebFetch. Search only to prove a specific attack, not to research the task, and put the URL in that attack's Problem line.
- Do not create, edit or delete any file except the one below.

Write the attacks to {{out}} in this format:
ATTACK 1 [FATAL|MAJOR|MINOR] <one-line title>
Where: <quote or location>
Problem: <what is wrong, with the counterexample or the missed requirement>
(and the same for each attack after that)

When the file is written, reply with this one line and nothing else:
ATTACKED {{target}} <number of attacks> (<number that are FATAL> fatal)
```
<!-- /template:attacker -->

### Defender, in every round

<!-- template:defender -->
```text
You are competitor {{agent}} in round {{round}} of an arena, match {{match}}. Your opponent {{attacker}} has attacked your solution. Now you defend it and revise it. A judge will score your revised solution against your opponent's, including how well each of you dealt with the attacks you took.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Your strategy card. Keep your approach: it is why you are still here.
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}

Your current solution ({{own_words}} words): {{own_solution}}
The attacks against it: {{attacks}}
Your opponent's solution, which you may learn from: {{opponent_solution}}
The attacks you made on it: {{own_attacks}}
That is their solution as it was before this round. They are fixing the flaws you found right now, so nothing you attacked in it is borrowable.

Do this:
1. Take every attack in turn and decide honestly. CONCEDE if it is right, and fix it. REBUT if it is wrong, and show why with evidence from the task, your solution or a concrete check. A rebuttal that only insists you are right counts as a concession. Conceding a real flaw and fixing it scores better than defending it. Conceding a wrong attack and "fixing" it makes your answer worse: the judge scores a correct rebuttal the same as a fix.
2. Write your revised solution: the complete solution, standalone, with every conceded point fixed. The judge reads only this file, so never write "see the previous version". Say nothing about the arena or your card.
3. Fix what was attacked and anything the attacks made you notice. Do not start again from scratch. Make each fix the smallest change that closes the attack. Grow only where an attack proves a stated requirement is missing, and cut anything the attacks showed is padding. A revision much longer than {{own_words}} words needs a reason in your defense.
4. Learn from your opponent, but stay yourself. You may BORROW at most two things from their solution, and only where they meet a requirement of the task better than you do, you can check that against the task text, and you can rewrite it in your own reasoning mode and strategy so your solution still reads as one answer. Never take their approach wholesale, never take anything your attacks above point at, and never take something that only adds length. Declare every borrowing in your defense.
5. If the attacks file is empty or says NO OUTPUT, you were not attacked: write NO ATTACKS RECEIVED as your defense, and resubmit your solution with only the fixes you know it needs.
6. Do not create, edit or delete anything outside {{arena_dir}}.

Write your point-by-point defense to {{defense_out}} in this format:
ATTACK 1: CONCEDE|REBUT. <one to three lines>
(one entry per attack)
BORROW 1: <what you took from your opponent>. <how you made it fit your card>
(zero to two entries)

Write your revised solution to {{solution_out}}.

When both files are written, reply with this one line and nothing else:
DEFENDED {{agent}} conceded <n> rebutted <n> borrowed <n>
```
<!-- /template:defender -->

### Judge, one per match

<!-- template:judge -->
```text
You are the judge of match {{match}}, round {{round}}, in an arena. Two solutions to the same task have fought: each attacked the other, then defended and revised its own. Score both against the rubric. The one with the higher score goes through and the other is eliminated.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Read the rubric first: {{rubric}}

Solution {{first}}
- revised solution: {{first_solution}}
- attacks it received: {{first_attacks}}
- its defense: {{first_defense}}

Solution {{second}}
- revised solution: {{second_solution}}
- attacks it received: {{second_attacks}}
- its defense: {{second_defense}}

How to judge:
1. Read both revised solutions in full before you score either one. Then write down, for yourself, the three differences between them that matter most for the task. Score from those.
2. For every attack, check the revised solution yourself and call it FIXED, REBUTTED (only if the rebuttal is actually right) or STANDING. A defense that says "fixed" is not proof. Look.
3. Look for flaws the attackers missed, too.
4. Score each criterion from 0 to 10 using the rubric's anchors. Use the whole scale: where one solution is clearly better on a criterion, the scores must show it. Set fatal to true only for a flaw you have verified that makes the solution wrong or unusable for the task.
5. The winner is the higher weighted total (the weights are in the rubric). A fatal solution cannot beat one that is not fatal. On an exact tie, fewer standing attacks wins, then higher correctness.
6. Judge the work, not the writing about the work. Length is not quality: length the task does not need is a cost, scored under clarity. You do not know either competitor's strategy and should not guess it.
7. If the match turns on a factual claim the task and its files cannot settle, check it on the web before you score it: a cited URL in an attack is a lead, not proof, so open it. Load them with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page. If those are not available, use WebSearch and WebFetch. Search only to settle a claim that could change the winner or the fatal flag, never to research the task, and name the URL in your reason.
8. Each side may have borrowed up to two things from the other, declared in its defense. That is allowed. Judge each revised solution as it stands; a borrowed part that clashes with the rest of its solution is a flaw.
9. Do not create, edit or delete any file except the verdict. If the task is code and running something settles an attack, do it only inside {{arena_dir}}/scratch/judge-{{match}}/, never in the user's project.

Write this JSON, and nothing else, to {{out}}:
{
  "match": "{{match}}",
  "scores": {
    "{{first}}": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false},
    "{{second}}": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false}
  },
  "winner": "{{first}} or {{second}}",
  "reason": "one sentence: the decisive difference",
  "survived": ["each attack the winner took and beat, in a few words"],
  "standing": {"{{first}}": ["attacks still standing"], "{{second}}": ["attacks still standing"]}
}

When the file is written, reply with this one line and nothing else:
WINNER <winner id> <winner total>-<loser total>
```
<!-- /template:judge -->

### Learner, the champion, once after the final

<!-- template:learner -->
```text
You are competitor {{agent}}, the champion of an arena of {{n}}: your solution survived {{rounds}} rounds. Before it goes to the user, you get one chance to learn from the strongest competitors you outlasted. Some of them got things right that you did not. Most of what they did differently is not worth taking. Your job is to tell those apart, and to stay yourself while you do it.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Your strategy card. It is your vision: everything you take must fit it.
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}

Your winning solution: {{own_solution}}
Attacks you survived on the way. Do not undo any of these fixes: {{survived}}

The competitors to learn from, strongest first. For each: their final solution, and the verdict of the match that eliminated them. Its "standing" list holds the attacks they never answered.
{{teachers}}

Do this:
1. Read your solution, then every competitor's solution and verdict in full.
2. Build a ledger. Every real difference worth a decision goes under LEARN or DON'T LEARN.
   LEARN only what passes all four tests:
   - it meets a requirement of the task, or handles a case, better than you do, and you checked that against the task text, not because it sounds good;
   - no attack stood against it in that competitor's matches;
   - you can rewrite it in your own reasoning mode and strategy, so the solution still reads as one coherent answer;
   - it does not reopen an attack you survived.
   DON'T LEARN everything else, with one reason:
   - LOST: it is tied to an attack that stood against them;
   - OFF-VISION: it contradicts your strategy's trade-offs;
   - BLOAT: it adds length or coverage the task does not ask for;
   - TASTE: it is only a different style, not a better answer;
   - CLASH: it would make your solution incoherent.
3. Write the rethought solution: your solution with every LEARN item rewritten your way. The complete solution, standalone. Change nothing the ledger does not justify. If nothing passes, say so in the ledger and resubmit your solution unchanged: that is a legitimate result.
4. Do not create, edit or delete anything outside {{arena_dir}}.

Write the ledger to {{ledger_out}} in this format:
LEARN 1 from <competitor id>: <what>
Why it is better: <the requirement or case, checked>
How I made it mine: <one or two lines>
(one entry per item)
DON'T LEARN 1 from <competitor id>: <what>
Reason: LOST|OFF-VISION|BLOAT|TASTE|CLASH. <one line>
(one entry per item)

Write the rethought solution to {{solution_out}}. Say nothing about the arena, your card or who you learned from: it is judged blind.

When both files are written, reply with this one line and nothing else:
LEARNED {{agent}} took <n> left <n>
```
<!-- /template:learner -->

### Prober, two eliminated competitors, after the learn step

<!-- template:prober -->
```text
You are competitor {{agent}}. You were eliminated from an arena of {{n}}, but you know this task well. The champion has just rethought its solution after studying the competitors it outlasted. Rethinking is where things break: borrowed parts that clash with the rest, fixes that got undone, requirements dropped to make room. Your job is to attack the rethought solution.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Your strategy card is the lens you look for flaws through:
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}

The rethought solution: {{rethink}}
The champion's solution before the rethink: {{original_solution}}
The champion's learning ledger: {{ledger}}

Find the real problems:
- REGRESSION: something the original got right that the rethink broke or dropped. Quote both.
- CLASH: a borrowed part that contradicts the rest of the solution.
- WRONG, MISSING, BREAKS, VAGUE: as in any round. Quote the requirement or give the counterexample.

Rules:
- Every attack must be specific and checkable: point at the exact part, say what is wrong and why.
- Attack the rethought solution on its merits against the task. Do not argue for your own solution, and do not attack something only because it came from you or from someone else.
- At most 7 attacks, strongest first. Label each FATAL, MAJOR or MINOR.
- If an attack rests on a factual claim the task and its files cannot settle (a version, an API, a number, a date, a rule), you may check it on the web to prove it. Load them with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page. If those are not available, use WebSearch and WebFetch. Search only to prove a specific attack, not to research the task, and put the URL in that attack's Problem line.
- Do not create, edit or delete any file except the one below.

Write the attacks to {{out}} in this format:
ATTACK 1 [FATAL|MAJOR|MINOR] [REGRESSION|CLASH|WRONG|MISSING|BREAKS|VAGUE] <one-line title>
Where: <quote or location>
Problem: <what is wrong>

When the file is written, reply with this one line and nothing else:
PROBED {{agent}} <number of attacks> (<number that are FATAL> fatal)
```
<!-- /template:prober -->

### Refiner, the champion, after the probes

<!-- template:refiner -->
```text
You are competitor {{agent}}, the champion. Your rethought solution has been attacked by {{probers_n}} you eliminated. Defend and revise, as in every round. A blind judge will then compare your refined solution with your solution from before the rethink, and keeps whichever is better. Learning only counts if it made the answer better.

=== THE TASK (identical for every competitor) ===
{{task}}
=== END OF THE TASK ===

Your strategy card:
Reasoning mode: {{reasoning_name}}. {{reasoning_how}}
Workflow: {{workflow_name}}. {{workflow_how}}
Strategy: {{strategy_name}}. {{strategy_how}}

Your rethought solution: {{own_solution}}
Your solution before the rethink: {{original_solution}}
Your learning ledger: {{ledger}}
The attacks:
{{attacks}}

Do this:
1. Take every attack in turn. CONCEDE and fix it, REBUT it with evidence, or DROP: if a borrowed part caused a real problem, you may remove it again instead of patching it. Say which.
2. Write the refined solution: complete, standalone, every conceded point fixed. Say nothing about the arena, your card or who you learned from.
3. Do not create, edit or delete anything outside {{arena_dir}}.

Write your defense to {{defense_out}} in this format:
<prober id> ATTACK 1: CONCEDE|REBUT|DROP. <one to three lines>
(one entry per attack)

Write the refined solution to {{solution_out}}.

When both files are written, reply with this one line and nothing else:
REFINED {{agent}} conceded <n> rebutted <n> dropped <n>
```
<!-- /template:refiner -->

### Recheck, one blind judge, after the refine

<!-- template:recheck -->
```text
You are the last check in an arena. Two versions of the same solution to one task are in front of you. One is the solution that won the tournament. The other is that solution after it studied the competitors it beat, took what it judged worth taking, and was attacked and revised again. You are not told which is which. Score what is in front of you. Either can win.

=== THE TASK ===
{{task}}
=== END OF THE TASK ===

Read the rubric first: {{rubric}}

Solution X: {{x_solution}}
Solution Y: {{y_solution}}

How to judge:
1. Read both in full before you score either.
2. Attack both yourself: the strongest concrete flaws in each, the way a hostile expert would. Look especially for parts that do not fit the rest of the solution, and for anything one of them gets right that the other dropped. Score robustness on how each holds up.
3. Score each criterion from 0 to 10 using the rubric's anchors. Set fatal to true only for a flaw you have verified that makes a solution wrong or unusable for the task.
4. The winner is the higher weighted total. A fatal solution cannot beat one that is not fatal.
5. Judge the work, not the writing about the work. Longer is not better: an addition that does not make the answer better for the task is a cost, scored under clarity.
6. If the match turns on a factual claim the task and its files cannot settle, check it on the web before you score it: a cited URL in an attack is a lead, not proof, so open it. Load them with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page. If those are not available, use WebSearch and WebFetch. Search only to settle a claim that could change the winner or the fatal flag, never to research the task, and name the URL in your reason.
7. Do not create, edit or delete any file except the verdict. Read only the files named in this brief and the files the task points to: nothing else in the arena folder.

Write this JSON, and nothing else, to {{out}}:
{
  "scores": {
    "X": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false},
    "Y": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false}
  },
  "winner": "X or Y",
  "reason": "one sentence: the decisive difference"
}

When the file is written, reply with this one line and nothing else:
RECHECK <X or Y> <X total>-<Y total>
```
<!-- /template:recheck -->

### Final check, only when there is an answer to beat

<!-- template:final -->
```text
You are the final check in an arena. {{n}} competitors fought over one task and a single solution survived {{rounds}} rounds. Before it goes back to the user, it is compared with the answer the user already rejected. You are not told which of the two is which. Score what is in front of you. Either one can win.

=== THE TASK ===
{{task}}
=== END OF THE TASK ===

Read the rubric first: {{rubric}}

Solution X: {{x_solution}}
Solution Y: {{y_solution}}

How to judge:
1. Read both in full before you score either.
2. Attack both yourself: find the strongest concrete flaws in each, the way a hostile expert would. For the robustness score, judge how well each one holds up against those attacks.
3. Score each criterion from 0 to 10 using the rubric's anchors. Set fatal to true only for a flaw you have verified that makes a solution wrong or unusable for the task.
4. The winner is the higher weighted total. A fatal solution cannot beat one that is not fatal.
5. Judge the work, not the writing about the work. Length is not quality.
6. If the match turns on a factual claim the task and its files cannot settle, check it on the web before you score it: a cited URL in an attack is a lead, not proof, so open it. Load them with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page. If those are not available, use WebSearch and WebFetch. Search only to settle a claim that could change the winner or the fatal flag, never to research the task, and name the URL in your reason.
7. Do not create, edit or delete any file except the verdict. Read only the files named in this brief and the files the task points to: nothing else in the arena folder.

Write this JSON, and nothing else, to {{out}}:
{
  "scores": {
    "X": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false},
    "Y": {"correctness": 0, "completeness": 0, "specificity": 0, "robustness": 0, "clarity": 0, "fatal": false}
  },
  "winner": "X or Y",
  "reason": "one sentence: the decisive difference",
  "fixed": ["each thing the winner gets right that the other gets wrong, in a few words"]
}

When the file is written, reply with this one line and nothing else:
FINAL <X or Y> <X total>-<Y total>
```
<!-- /template:final -->
