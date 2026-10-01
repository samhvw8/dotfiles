---
name: council
description: "Collaborative brainstorm where perspectives build on each other ('yes, and…'), then you synthesize. Two modes: live (2-4 named teammates cross-pollinating via SendMessage) and full (a file-based session of 5-12 sub-agents dealt lens + technique cards from heavy-think's perspective deck: diverge, cross-pollinate rounds, cluster, blind scoring on a creative or decision rubric, develop and stress-test the shortlist). Use when the user types /council, wants an open question ('how might we…', 'what could we build') explored by compounding perspectives, or asks for a full / creative / big brainstorm. Not for a quick idea list (heavy-think Brainstorm), choosing between options (/debate), finding the single best answer to a task (/arena), or mechanical tasks."
argument-hint: "[full] [--quick | --members N] [--preset P] [--rubric creative|decision] [--seed S] <question>"
---

# Council

The generative "yes, and…" counterpart to `/debate`'s "no, but…" and `/arena`'s "only one survives".
Perspectives meet, build on each other, and you harvest what no single perspective would have
produced. You facilitate. You never add ideas of your own: provocations come from the deck, so your
taste never enters the pool.

What the user typed after `/council`: `$ARGUMENTS`

## Pick the mode

| | Live | Full |
|---|---|---|
| Trigger | `/council <question>` | `/council full <question>`, or "full / creative / big brainstorm" |
| Who | 2-4 named teammates | 5-12 sub-agents (default 8) |
| How they meet | `SendMessage`, live | each other's files, across rounds |
| Needs | main session + `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | nothing special |
| Picks the shortlist | you, in synthesis | judges on a written rubric, blind |
| Survives compaction | no | yes, the state is on disk |
| Cost | ~3-5x one pass | `council.py plan` prints it: 36 calls at the default |

Live wins when ideas need fast back-and-forth between a few minds. Full wins when you want range,
an honest shortlist and a record. If live mode's prerequisites fail, **say so** and offer full mode
rather than quietly simulating a council.

## The deck

The deck lives in the heavy-think skill: `../heavy-think/references/perspectives.json`, dealt by
`../heavy-think/deck.py`. Council needs heavy-think linked beside it. A member's card is one **lens**
(who is looking: 36, in six families: challenger, stakeholder, temporal, systems, craft, wildcard)
plus one **technique** (how they generate: SCAMPER, reverse brainstorm, forced mashup, contradiction
resolution and 31 more, including verbalized sampling and eight TRIZ principles). **Provocations** are the facilitator's sparks. **Presets** are lens sets for
common question shapes, and each names its rubric.

A random deal always seats a challenger, a stakeholder and a temporal lens (plus a wildcard from 4
members up), spreads the families, and prefers lenses that clash with ones already seated. A preset
or `--lenses` is a deliberate choice and is kept: the dealer fills missing families only into empty
seats, and swaps a preset lens only when the preset doubled up a family.

**A lens written for this problem beats any lens in the deck.** Mix them in as `Name: the question it
asks`, for example `--lenses "operator; EU regulator: Would this pass a GDPR review, as built?"` (use
`;` between entries when a question contains a comma).

**Pick the rubric.** `creative` (novelty 30, value 30) for ideation; `decision` (value 35,
feasibility 25, running cost 20, novelty 10) for anything that ships and has to be run. Presets set it;
`--rubric` overrides. Anchors: `../heavy-think/references/rubric.md`. For decision-shaped questions,
consider `--no-technique` too: forced techniques can make technical answers gimmicky.

```bash
COUNCIL = python3 "${CLAUDE_SKILL_DIR}/council.py"
COUNCIL presets                         # preset lens sets and their rubric
COUNCIL deal --members 4 --preset greenfield     # cards only, for a live council
```

If the path looks unexpanded, use the "Base directory for this skill" Claude Code printed above.

## Live mode

The protocol, spawn template and anti-groupthink rules are in
`../heavy-think/references/team-brainstorm.md`. **Read it before spawning.** What the deck adds:

1. Run `COUNCIL deal --members N` (with `--preset` if one fits) and give each teammate its lens
   (name, asks, sees) **and** its technique in the spawn prompt. Name the wildcard.
2. Use the dealt provocations as your Phase 2 sparks, one at a time, when the room goes quiet or
   agrees too fast. That keeps you a facilitator: the spark is the deck's, not yours.
3. In Phase 2, every build names its parent ideas ("builds on Ada's 2 and Lin's 1"). In synthesis,
   keep that lineage. It shows which ideas only exist because two lenses met.

## Full mode

### Step 1: size it, and say what it costs

Run `COUNCIL plan` (add `--quick` or `--members N`). Tell the user in one line, for example "8
members, 2 cross rounds, 3 judges, 4 shortlisted: 36 sub-agent calls", and start. If the user did not
ask for a council and you are proposing it, ask first.

Sub-agents write into `.council/` in the current directory. In the default permission mode that is
one approval per file. Suggest accept-edits mode (Shift+Tab) for the run. Do not change settings
yourself.

### Step 2: write the brief

**Sub-agents cannot see this conversation.** Write `.council/brief.md` so it stands on its own:

- The question, open-ended ("how might we…", "what could we…"), in the user's words where you can.
- Who it is for, the constraints the user stated (budget, team, timeline, stack, what must not change),
  and what already exists. Absolute paths to anything they should read.
- What a great outcome looks like, if the user said.
- Ideas the user already has or has rejected, labelled as such, so members can build on them or avoid
  them.

Do not add constraints the user never gave, and do not write your own favourite idea into it: that
pulls every member toward it.

### Step 3: init

```bash
COUNCIL init --brief-file .council/brief.md [--members N | --quick] [--preset P | --lenses "a; Name: question"] [--rubric creative|decision] [--no-technique] [--seed S]
```

It deals the cards, seats members in a ring where neighbours come from different families, and
writes `council.json`.

### Step 4: the loop

Drive it with `COUNCIL next`. Every sub-agent phase works the same way:

1. `COUNCIL prompts <phase>` writes one brief per job and lists the jobs still to run.
2. Launch them as a **rolling pool**: at most 6 in flight (the run's `parallel` value), and start the
   next queued job as soon as one finishes. Each call is `subagent_type: general-purpose`,
   `description: council <job id>`, `prompt: Read <prompt path> and follow it exactly. It is your
   whole brief.`
3. When the phase is drained, run `COUNCIL next`. A missing output sends you back to the same phase
   and `prompts` lists only what is missing. Re-run those once. If a job fails twice, write `NO
   OUTPUT` into its output file and move on. A judge that fails twice gets a third, fresh run: never
   score anything yourself.

The order: **diverge** (each member alone, through its card) → **cross1 .. crossC** (each member
reads the members k seats away on the ring and builds on them; the last round adds the member straight
across the ring and each member's provocation) → **cluster** (one curator merges everything into a pool
of concepts with lineage, plus up to 3 orphans: odd single ideas kept as written, then
`COUNCIL collect`) → **score** (independent judges score the pool blind on `rubric.md`, then `COUNCIL
collect`, which averages them and fills the shortlist, keeping the last slot for the concept one
judge loved most when the average left it out) → **develop** (one developer per shortlisted concept)
→ **stress** (one red-team and pre-mortem per developed concept) → DONE.

After each phase, give the user one line ("Cross round 1 done: 8 members built on each other").
Never paste ideas, builds or scores into the chat during the run.

### Step 5: harvest and synthesize (you, never delegated)

Run `COUNCIL harvest`. Read only the develop and stress files it lists. Then give the user:

Treat the judges' totals as a sort, not a verdict: LLM judgments of idea quality agree with human
reviewers barely above chance (Si et al., arXiv 2409.04109). Read the developed concepts yourself.

1. **The shortlist**, each as: the concept in two lines, why it matters, the first concrete move, the
   strongest stress-test finding and whether the concept survives it.
2. **Emergent ideas**: which shortlisted concepts exist only because two lenses met (the lineage
   shows it). Name the lenses.
3. **Tensions worth holding**: where concepts pull against each other, not resolved for the user.
4. **The dissent slot and orphans**, if `harvest` flags them: say plainly that a concept split the
   judges, or came from one member alone, and why it might be the most interesting thing in the run.
5. **What to explore next**, and the run folder.

If a concept would change files in the user's project, do not apply it. Ask.

## Rules for the facilitator

- Facilitate, don't generate. Your sparks come from the deck's provocations.
- Diverge before converge. Nobody judges before the score phase.
- Web access is for the developer and the stress test only. Members, the curator and the judges work
  without it: outside material pulls ideas toward the same sources, and diverging works best in isolation.
- Every sub-agent gets the brief byte for byte through `prompts`. Never add a hint for one member.
- Do not read idea, build or score files during the run. `next`, `status` and `harvest` are enough.
- After a compaction: `COUNCIL status`, then `COUNCIL next`.
- Run every command from the directory you ran `init` in.

## The prompt templates

`council.py` fills the `{{placeholders}}` and writes one brief per job. Never edit a brief for one
member.

### Member, diverge

<!-- template:diverge -->
```text
You are member {{member}} of a creative council of {{n}}. Every member got the same brief, word for word. What makes you different is your card: the lens you look through and the technique you generate with. Later rounds, other members will read your ideas and build on them, so range and surprise matter more than polish.

=== THE BRIEF (identical for every member) ===
{{brief}}
=== END OF THE BRIEF ===

=== YOUR CARD ===
Lens: {{lens_name}}. The question you ask: {{lens_asks}}
What this lens sees that others miss: {{lens_sees}}
Its blind spot, which other members will cover: {{lens_misses}}
What your lens must deliver, in your ideas: {{lens_delivers}}
Technique: {{technique_name}}. {{technique_how}}
=== END OF THE CARD ===

How to work:
1. Look ONLY through your lens. You are not trying to be balanced. Find what only this lens reveals.
2. If you have a technique, run it for real, step by step. A generic idea list with the technique's name on top is useless to the council.
3. Write down the first three ideas that come to mind as your Baseline: those are the ones every member will have, and sometimes the obvious answer is right. Then generate past them. Your numbered ideas must not repeat the baseline.
4. Name two assumptions most people make about this brief and say how your lens breaks them.
5. You cannot ask the user anything. Where the brief is ambiguous, pick a reading and say which.
6. Do not create, edit or delete anything outside {{council_dir}}.

Write to {{out}} in this format:

## Baseline (the obvious answers)
- <one line each, three of them>

## Assumptions I broke
- <assumption>: <how the lens breaks it>

## Ideas
### {{member}}.1 <title>
<two to four sentences: the idea, who it is for, why it is not obvious>
### {{member}}.2 <title>
...
(5 to 8 ideas, numbered {{member}}.1, {{member}}.2 and so on, strangest-but-defensible first)

## The provocation I would put to the group
<one sentence that reframes the brief>

When the file is written, reply with this one line and nothing else:
DONE {{member}} <number of ideas>
```
<!-- /template:diverge -->

### Member, cross-pollination round

<!-- template:cross -->
```text
You are member {{member}} of a creative council of {{n}}, in cross-pollination round {{round}}. You have read nobody else's work yet. Now you read the members next to you ({{partners}}) and BUILD on them. This is "yes, and", not critique: nobody is judging yet.

=== THE BRIEF (identical for every member) ===
{{brief}}
=== END OF THE BRIEF ===

=== YOUR CARD ===
Lens: {{lens_name}}. The question you ask: {{lens_asks}}
What this lens sees that others miss: {{lens_sees}}
What your lens must deliver: {{lens_delivers}}
Technique: {{technique_name}}. {{technique_how}}
=== END OF THE CARD ===

Your own latest work: {{own_file}}
Read these, in full:
{{partner_files}}

{{provocation}}

How to build:
1. Learn from the others, through your lens. Take what is strong in their ideas and develop it the way only your lens and technique would. Do not adopt their lens, and do not just restate their idea: every build must ADD something that was not there.
2. Make at least one build that combines an idea of yours with an idea of theirs into something neither had alone. These collisions are the point of the council.
3. Push at least one of their ideas further than they dared: the bolder, stranger or ten times larger version.
4. Name each build's parents by their ids (for example m03.2 + m07.4). A build with no parent is not a build.
5. You may also write one fresh idea of your own that reading them made you see.
6. No judging, no ranking, no "good idea". If an idea has a flaw, build the version without the flaw.
7. Do not create, edit or delete anything outside {{council_dir}}.

Write to {{out}} in this format:

## Builds
### {{member}}.r{{round}}.1 <title>
Builds on: <parent ids>
<two to four sentences: what it is, and what it adds that the parents did not have>
### {{member}}.r{{round}}.2 <title>
...
(4 to 6 builds)

When the file is written, reply with this one line and nothing else:
BUILT {{member}} <number of builds>
```
<!-- /template:cross -->

### Curator, cluster

<!-- template:curator -->
```text
You are the curator of a creative council of {{n}} members. They have generated ideas and built on each other's ideas across several rounds. Your job is to turn all of it into a pool of distinct concepts, without judging which are best: independent judges score the pool after you.

=== THE BRIEF ===
{{brief}}
=== END OF THE BRIEF ===

Read every one of these files in full (some may say NO OUTPUT; skip those):
{{idea_files}}

How to curate:
1. Group ideas and builds that are really the same concept. A concept is a distinct direction, not a feature list.
2. For each concept, write the strongest version the material supports. Prefer the most developed build over its parents, and keep what was surprising: do not sand it down into something safe.
3. Record the lineage: the ids of every idea and build the concept draws on.
4. Keep the odd ones. A strange idea that only one member had is a concept of its own. Do not merge it into something tamer to tidy the pool.
5. At most {{pool_max}} concepts. If there are more, keep the most distinct ones.
6. Orphans: pick up to {{orphan_slots}} single ideas that fit no concept and that you would be tempted to drop because they are odd, not because they are weak. Copy each one's title and text as the member wrote it, without improving it. Number them after the concepts.
7. The members' Baseline sections are context, not ideas: do not turn a baseline into a concept unless a member developed it further.
8. Do not score, rank or recommend. Do not add ideas of your own.
9. Do not create, edit or delete any file except the one below.

Write this JSON, and nothing else, to {{out}}:
{
  "concepts": [
    {"id": "C01", "title": "short name", "pitch": "two or three sentences: what it is, for whom, and what makes it non-obvious", "parents": ["m03.2", "m07.r1.4"], "members": ["m03", "m07"]}
  ],
  "orphans": [
    {"id": "C13", "title": "the member's title", "pitch": "the member's text, as written", "parents": ["m05.6"], "members": ["m05"]}
  ]
}
Ids run C01, C02, and so on, across concepts and orphans.

When the file is written, reply with this one line and nothing else:
POOL <number of concepts>
```
<!-- /template:curator -->

### Judge, score

<!-- template:judge -->
```text
You are judge {{judge}} of a council. Score every concept in the pool against the rubric, using its "{{profile}}" profile: {{criteria}}. Other judges score the same pool independently; their scores and yours are averaged. You do not know who produced any concept and should not guess.

=== THE BRIEF ===
{{brief}}
=== END OF THE BRIEF ===

Read the rubric first: {{rubric}}
Then the pool: {{pool}}

How to judge:
1. Read every concept before scoring any.
2. Score each concept 0 to 10 on each criterion of the {{profile}} profile, using the rubric's anchors and the whole scale.
3. Weigh what the profile weighs. Under creative, do not punish a concept for being bold; under decision, do not reward newness that costs the people who will run it.
4. Set off_brief to true only for a concept that answers a different question or breaks a hard constraint in the brief.
5. Do not create, edit or delete any file except the one below.

Write this JSON, and nothing else, to {{out}}:
{
  "scores": {
    "C01": {{{score_fields}}, "off_brief": false}
  },
  "notes": {"C01": "one line: the decisive thing about this concept"}
}
One entry per concept in the pool.

When the file is written, reply with this one line and nothing else:
SCORED {{judge}} <number of concepts>
```
<!-- /template:judge -->

### Developer, one per shortlisted concept

<!-- template:developer -->
```text
You are developing one concept that a creative council put on its shortlist. Turn it from a pitch into something the person who asked could act on, without losing what made it interesting.

=== THE BRIEF ===
{{brief}}
=== END OF THE BRIEF ===

The concept: {{concept_id}} {{concept_title}}
Pitch: {{concept_pitch}}
It grew from these ideas: {{parents}}
The members' files it came from (read the parent ideas in them):
{{source_files}}

Do this:
1. Keep the core that made it surprising. If developing it makes it ordinary, you have lost it.
2. Make it concrete: who it is for, what it is, how it works, and the very first move someone could make this week.
3. Take the best details from the parent ideas that the pitch dropped.
4. Name what it needs to be true to work, the cheapest test that would show whether it is, and what it would cost to keep running once it exists.
5. Check prior art and facts on the web: search for products, projects or papers that already do this or something close, and for the numbers your feasibility and cost claims rest on. Load the tools with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page (and mcp__parallax__social_search for what users and builders say). If those are not available, use WebSearch and WebFetch. If something close exists, say so plainly and say what is still different. Cite every URL you rely on. Keep it to what the concept needs; this is not a literature review.
6. Do not create, edit or delete anything outside {{council_dir}}.

Write to {{out}}:
## {{concept_id}} {{concept_title}}
## The concept
## How it works
## First move
## What must be true, and the cheapest test
## Prior art (with URLs)
## What it costs to run

When the file is written, reply with this one line and nothing else:
DEVELOPED {{concept_id}}
```
<!-- /template:developer -->

### Stress test, one per developed concept

<!-- template:stress -->
```text
You are stress-testing one concept from a creative council before it goes to the person who asked. Be adversarial and honest: find real weaknesses, not manufactured ones, and say what would fix them.

=== THE BRIEF ===
{{brief}}
=== END OF THE BRIEF ===

The developed concept: {{develop_file}}

Do this:
1. Red team: the three assumptions it depends on, ranked by how fragile they are (solid, shaky or untested).
2. Pre-mortem: it is a year later and it failed quietly. Write what most probably happened, not the most dramatic failure.
3. Who loses if it succeeds, and how they would respond.
4. For each weakness, the smallest change that would fix it, or "no fix: this is the price".
   Ground the attack in reality where you can: search for similar attempts and why they failed or stalled, and check the developer's prior-art and cost claims. Load the tools with ToolSearch first: mcp__parallax__web_search and mcp__parallax__fetch_page (and mcp__parallax__social_search for what users and builders say). If those are not available, use WebSearch and WebFetch. Cite every URL you rely on.
5. Verdict: survives, survives with changes (name them), or does not survive.
6. Do not create, edit or delete any file except the one below.

Write to {{out}}:
## Fragile assumptions
## Pre-mortem
## Who loses
## Fixes
## Verdict

When the file is written, reply with this one line and nothing else:
STRESSED {{concept_id}} <survives|changes|fails>
```
<!-- /template:stress -->

## Related

- [team-brainstorm protocol](../heavy-think/references/team-brainstorm.md): live mode in full
- [heavy-think](../heavy-think/SKILL.md): Brainstorm mode is the cheaper, isolated version
- [debate](../debate/SKILL.md): decide or pressure-test instead of expand
- arena: when the goal is one best answer to a task, not a range of ideas
