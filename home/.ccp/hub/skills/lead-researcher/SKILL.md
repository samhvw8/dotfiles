---
name: lead-researcher
description: "Entry point for all multi-source research — comparing options, evaluating tools, surveying an ecosystem, deep or 'team research' (live supervised agent-team venue). Orchestrates gatherer agents; the brain sizes the plan to the decision and picks agent count, languages (default EN + ZH + ZH-TW, assigned per sub-question), iterations, and depth from the question. Never spawn gatherer agents directly — they go through this skill. Not for single-fact lookups ('what version is X', 'is Y deprecated') — those are one WebSearch."
---

# Lead Researcher

MANDATORY orchestrator for ALL research. Based on Anthropic's orchestrator-worker pattern.
You plan, decompose, assign (1 language + 1 sub-topic) per agent, then synthesize.

## Arguments

Format: `[topic]` — everything else (agents, languages, depth) is decided by the brain at runtime.

```
/lead-researcher compare auth solutions for Next.js
/lead-researcher full ecosystem survey of MCP servers
/lead-researcher what's the best ORM for PostgreSQL
/lead-researcher team compare auth solutions            ← live Team venue (supervised)
```

## Defaults

| Parameter | Default | Override |
|-----------|---------|----------|
| **Languages** | EN + ZH + ZH-TW as the candidate set | User specifies; brain adds languages the topic needs, and leaves a language off a sub-question it has nothing to add to, with the reason in the plan ([Language per sub-question](#language-per-sub-question)) |
| **Agent count** | Brain sizes it to the decision ([Size the plan](#size-the-plan-to-the-decision)) | No fixed limit: big, contested, multi-source questions get big plans; a small pick gets a small one |
| **Iterations** | Brain decides — stop when saturated | No preset count |
| **Depth** | Brain decides — shallow for simple, deep for complex | Saturation curve, not a mode setting |
| **Venue** | Inline (brain = main agent) or workflow (brain = opus sub-agent) | Brain picks based on expected complexity |

**The brain (forager) decides everything.** No modes, no preset agent counts, no fixed iterations. The only default is the language set: EN + ZH + ZH-TW when nothing is specified. It is a set to choose from per sub-question, not a multiplier applied to every sub-question.

## Execution Engine

**Same brain, three execution venues.** The brain picks the venue based on expected complexity — no preset modes:

| Venue | When brain picks it | Brain runs as |
|-------|-------------------|---------------|
| **Inline** | Simple/focused questions, quick lookups | Main agent itself — free, no delegation |
| **Workflow** | Complex multi-domain, deep investigation | Opus sub-agent per iteration (background) |
| **Team** (opt-in) | Live co-research, user wants to steer | Steering-Lead teammate (opus), live streaming. See [team-research](references/team-research.md) |

**`forager` is the brain.** Its fused REFLECT/STEER methodology ([forager](references/forager/overview.md)) = REASONING/EXPAND/CHECK. See [gatherer-vs-forager](references/adaptive-research/gatherer-vs-forager.md).

### Adaptive Iterate Loop (the engine — all modes; workflow venue shown)

A **hypothesis-driven** loop, not a fixed decompose → fan-out → merge. State carries **hypotheses, topics, and accumulated knowledge** — and grows each iteration. Depth is decided by the brain from live evidence, not fixed by mode. Full design: [adaptive-research spec](references/adaptive-research/overview.md).

**Encode this loop in the workflow script:**

```
seed STATE = { hypotheses, topics, knowledge }   (+ Phase-0 budget ceiling)
while ( !check.stop  &&  gatherBudgetRemaining() > 0 ):
  GATHER DATA  deep-gather from internet — parallel gatherer agents (topic × language × source)  [each assignment = squad: sonnet lead + 3 capped haiku slices]
               + stream per-finding verify (no barrier) + CRITIC refute
  REASONING    brain weighs new data vs each hypothesis: support / refute / new insight           [opus — forager brain]
  EXPAND       grow STATE — add/refine hypotheses, add topics, accumulate knowledge        (admission-controlled: control rod)
  CHECK        condition met? hypothesis settled · saturation (new-info/token) · coverage · budget · depth
  → continue (next iteration uses the expanded STATE)   OR   exit
SYNTHESIZE   opus, on a FENCED reserve (never starved) → answer + evidence + knowledge, cited
GOAL-CHECK   score the answer vs the ORIGINAL goal (catch drift)
```

| Step | What it does | Who |
|------|--------------|-----|
| **GATHER DATA** | collect from the internet for current topics/hypotheses | `deep-gather` skill (gatherer agents) |
| **REASONING** | weigh new data against hypotheses — confirm / refute / discover | forager brain (opus) |
| **EXPAND** | mutate STATE: new/refined hypotheses, new topics, kept knowledge | brain + control rod |
| **CHECK** | decide continue vs stop | the brain owns the exit |

| Rule | Detail |
|------|--------|
| **Exit by agent** | The CHECK/brain decides `stop` — NOT a fixed iteration count |
| **Hypothesis-driven** | every gather serves confirming/refuting a hypothesis; findings accumulate into knowledge |
| **Brake (primary)** | `new-info ÷ tokens` declining → stop; works even when `budget.total` is null |
| **Brake (hard)** | fenced synthesis reserve + expansion budget + depth/generation caps → SCRAM to synthesis |
| **Streaming verify** | `pipeline()`, no barrier — a refuted finding updates knowledge *before* REASONING runs |
| **Expansion** | hypotheses + topics + knowledge grow, rate-limited so it can't run away |
| **Each step** | 1 or many agents, parallel or sequential — `parallel()` to fan out, `pipeline()` to stream |

Inline venue runs this loop directly (main agent is the brain). Workflow venue runs it as the background script below.

### Workflow runtime contract (workflow venue)

The loop runs as a background workflow: the JS script orchestrates but **cannot think**, and the main agent is asleep. So:

| Concern | Contract |
|---------|----------|
| **Where the brain runs** | REASONING/EXPAND/CHECK = ONE **opus sub-agent** per iteration (NOT a cheap model). It receives the serialized STATE digest and returns the verdict ([schema](references/adaptive-research/adaptive-depth-loop.md)). |
| **STATE digest** | Pass `hypotheses[]` + a per-topic knowledge **summary** (not raw findings). Cap ~15k tokens — summarize-and-roll old knowledge so the brain's input stays bounded. |
| **Persistence / resume** | The script has no filesystem access. The Workflow tool journals every `agent()` result; resume a killed run with `resumeFromRunId` (same script + args replays the cached prefix). Files — the report, any STATE snapshot — are written by an agent, not by the script. |
| **Budget self-enforce** | `const CEILING = args.budgetCeiling ?? 200_000` (never undefined → no `NaN`). Guard on `(budget.spent() - start) < CEILING - SYNTH_RESERVE`. Do **NOT** gate on `budget.total` — it is usually null. |
| **Handoff** | Workflow synthesizes internally and writes the report; on completion the main agent reads it and runs GOAL-CHECK. Main agent re-synthesizes ONLY if the workflow's synthesis sub-agent errored (spend limit). |

For **inline venue** none of this applies — the main agent holds STATE in context and reasons directly; no JS, no state.json, no sub-agent brain.

The sections below (Source Priority, Model Tiering, Budget Guards, Elite Forum Passthrough, Structured Output) are **components used inside this loop**, not a separate static pipeline.

Detailed refs: [adaptive-depth-loop](references/adaptive-research/adaptive-depth-loop.md) · [control-panel](references/adaptive-research/control-panel.md) · [control-rod](references/adaptive-research/control-rod.md) · [phase-zero-planning](references/adaptive-research/phase-zero-planning.md) · [streaming-verify](references/adaptive-research/streaming-verify.md) · [forager (the brain)](references/forager/overview.md)

### Source Priority — Decided at Runtime

Do **NOT** hardcode which sources to use (no "always GitHub" rule). The source stack — **including whether GitHub is searched at all** — is chosen at runtime and **confirmed with the user** in Phase 1 (the Sources line of the plan). Recommend a stack based on the topic, but the user decides.

What stays constant regardless of stack: rank practitioner/primary signal above SEO content farms — 1) elite forums / practitioner communities ([elite-forums](references/elite-forums/overview.md)) → 2) primary/official sources → 3) high-value analysis → 4) blogs/tutorials (verify) → deprioritize 5) content farms.

The menu of source types to pick from (with how to query each): [source-types](references/source-types.md).

**Inject the user-confirmed source stack into every workflow prompt** — workflow agents can't see Phase 1. Agents returning only blog/vendor sources are incomplete.

### Model Tiering (workflows)

| Agent Role | Model | Why |
|-----------|-------|-----|
| Gatherer squad, every language (search-fetch) | `sonnet` lead (whole assignment, no cap) + 3 `haiku` slices at `effort: 'high'` (code 20 calls, social 15, docs 15) + a `haiku` opener (10 calls) | Goal: miss nothing, fast. Slices add about half of all gems; the opener reads the leads they listed but never opened |
| Cross-checker | `sonnet` | Comparison task, not deep reasoning |
| REASONING brain (per iteration) | `opus` | Weighs findings against hypotheses and owns the exit |
| Synthesizer | `opus` | Needs deep reasoning to merge N reports into coherent analysis |

Run every gatherer assignment as a squad: see [gather-squad](references/gather-squad.md) for members, slice prompts and merge rules. The slices are source slices, so they follow the confirmed source stack: a slice whose sources the user left out is dropped or re-aimed at an in-stack source ([gather-squad](references/gather-squad.md), Fit the squad to the source stack). Never drop the Sonnet lead for a non-English language: Haiku drifts to English and content-farm sources there. Evidence: `~/workspace/knowledge/topics/ai-agents/small-models-as-subagent-workers.md`.

Without tiering, all agents inherit the parent model (usually Opus), consuming ~5x budget before synthesis. This is the #1 cause of incomplete research reports — the synthesis agent never runs.

### Budget Guards (workflows)

**Primary guard = the self-enforced ceiling from the runtime contract** (`(budget.spent() - start) ≥ CEILING - SYNTH_RESERVE`), because `budget.total` is usually null. The checks below are a *secondary* guard for when the user DID set a `+Nk` target — they no-op (correctly) when `total` is null:

```js
const used = budget.spent() - start          // works even when budget.total is null
if (used >= GATHER_CEILING) {                 // GATHER_CEILING = CEILING - SYNTH_RESERVE
  log('Gather ceiling hit — SCRAM to synthesis on the fenced reserve')
  return synthesize(state)                     // synthesis reserve is never spent by gather
}
// optional secondary (only fires if user set +Nk):
if (budget.total && budget.remaining() < 30_000) return { findings: state, crossChecks: null }
```

If synthesis agent fails (spend limit), the main loop MUST:
1. Read all agent report files from disk (the report paths assigned in Phase 3, under `./research/YYMMDD-<topic>/`)
2. Synthesize manually from those files
3. Flag in the final report that cross-check was skipped

### Elite Forum Passthrough (workflow prompts)

Include the elite forum table in every gatherer agent prompt within the workflow script — workflow agents don't load this skill, so the table doesn't reach them otherwise.

```js
const ELITE_FORUMS = {
  EN: 'Lobste.rs, Hacker News, Indie Hackers, Reddit (r/relevant)',
  ZH: 'V2EX, linux.do, cnblogs.com, SegmentFault, NodeSeek',
  'ZH-TW': 'PTT (Soft_Job, Programmer boards), iThome 鐵人賽 (ithelp.ithome.com.tw)',
  RU: 'Habr, ODS.AI, linux.org.ru, SQL.ru'
}
const SQUAD = [   // references/gather-squad.md
  { role: 'lead',   model: 'sonnet', slice: null },
  { role: 'code',   model: 'haiku', effort: 'high', calls: 20, reserve: 5, slice: 'GitHub issues/discussions and X only' },
  { role: 'social', model: 'haiku', effort: 'high', calls: 15, slice: 'Reddit and social platforms for the language; one Reddit call at a time' },
  { role: 'docs',   model: 'haiku', effort: 'high', calls: 15, slice: 'official docs, changelogs, vendor blogs, tech media' },
]
// exact slice/opener prompt lines: references/gather-squad.md
const sliceRule = m => m.slice ? `\nYOUR SLICE: ${m.slice}. Other agents cover the rest.\nHARD BUDGET: at most ${m.calls} tool calls in total, then stop and report.${m.reserve ? `\nReserve the last ${m.reserve} calls: stop searching and open the best issues you saw but did not open.` : ''}\nAt the end add UNOPENED LEADS: up to 10 URLs you saw but did not open.` : ''
// after the three slices return: one opener agent (haiku, effort high, 10 calls) on the union of their UNOPENED LEADS

const prompt = `...
Source stack (user-confirmed in Phase 1): ${SOURCE_STACK}
Elite forums for ${lang.code}: ${ELITE_FORUMS[lang.code]}
Use site: targeting for at least 2 of these forums.
...`
SQUAD.map(m => agent(prompt + sliceRule(m), { model: m.model, effort: m.effort, agentType: 'gatherer', label: `${task}:${lang.code}:${m.role}` }))
```

### Structured Output Schema (RECOMMENDED for workflows)

Use workflow `schema` option to get structured output from gatherers — eliminates lossy free-text extraction:

```js
const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    tools: { type: 'array', items: { type: 'object', properties: {
      name: {type:'string'}, price: {type:'string'}, url: {type:'string'}, metric: {type:'string'}
    }}},
    cases: { type: 'array', items: { type: 'object', properties: {
      company: {type:'string'}, result: {type:'string'}, source_url: {type:'string'}
    }}},
    tips: { type: 'array', items: { type: 'string' } },
    sources: { type: 'array', items: { type: 'string' } },
    unresolved: { type: 'array', items: { type: 'string' } }
  }
}
SQUAD.map(m => agent(prompt + sliceRule(m), { schema: RESEARCH_SCHEMA, model: m.model, effort: m.effort }))
```

### How to trigger the workflow

After Phase 1 confirms the plan, if brain picks workflow venue, tell the user:

> "I'll run this as a dynamic workflow (adaptive iterate loop)."

Then describe the research task with the word **"workflow"** in your message to trigger the workflow engine. Include ALL the planning details (sub-topics, the assignment table with its languages and squad members, budget ceiling, output path) so the workflow script encodes them. Pass the confirmed ceiling as `args.budgetCeiling`: the `200_000` fallback covers only about 2 full-squad assignments (150k gather ÷ ~75k per squad), so a larger plan left on the fallback SCRAMs before most squads report.

Example trigger prompt (encodes the iterate loop, not a static pipeline):

```
Run a workflow as an ADAPTIVE ITERATE LOOP to research [topic]:

Seed STATE = { hypotheses [list], topics [list], knowledge [] }; languages [list]; CEILING = [value].

Each iteration:
  GATHER DATA — parallel gatherer agents (1 topic + 1 language each), each assignment run as a squad (sonnet lead + 3 haiku slices capped at 15 tool calls; references/gather-squad.md), using deep-gather
                + stream per-finding verify (no barrier); CRITIC refutes load-bearing claims
  REASONING   — ONE opus sub-agent reads the STATE digest + new findings, weighs each hypothesis,
                returns: { stop, hypotheses[{h,status}], add_topics[], knowledge[], reason }
                Loop EXIT depends on this agent — not a fixed count.
  EXPAND      — apply verdict: add/refine hypotheses, add topics, accumulate knowledge
                (rate-limited: expansion budget, depth cap)

Stop when REASONING says stop OR new-info/token collapses OR (spent - start) ≥ CEILING - SYNTH_RESERVE.
Then SYNTHESIZE (opus, fenced reserve) → cited report at [output path]; main agent GOAL-CHECKs vs the goal.

Budget: const CEILING = args.budgetCeiling ?? 200_000   (do NOT gate on budget.total — usually null)
Languages: [default EN + ZH + ZH-TW, or as specified]
Each gatherer agent uses the `deep-gather` skill.
```

Phases map to loop steps: Phase 0-2 = plan, Phase 3 = GATHER DATA, Phase 4 = REASONING/EXPAND/CHECK (the forager brain), Phase 5 = SYNTHESIZE. Inline venue runs these directly; workflow venue runs them as the script above.

## Phase Skip Prevention

Every phase runs on EVERY research task. The brain scales depth/breadth freely, but the phase sequence is fixed:

| Phase | Skippable? |
|-------|-----------|
| **Phase 0** (Triage) | **NEVER** — catches ambiguous terms, wrong targets |
| **Phase 1** (Confirm plan) | ONLY if user specified all params explicitly |
| **Phase 2** (Plan) | **NEVER** |
| **Phase 3** (Gather) | **NEVER** — brain decides how many agents |
| **Phase 4** (Brain — REFLECT + gem extraction) | **NEVER** — even a quick research runs 1 REFLECT pass |
| **Phase 5** (Synthesize) | **NEVER** |

**"Quick/nhanh/fast" = shallower depth, NOT skip phases.** A quick research still triages, confirms, gathers, reflects, and synthesizes — the brain just does each step once.

**Failure pattern:** interpreting "quick" as "skip ceremony" → gatherers search wrong target → user must manually correct multiple times → MORE tokens burned than if Phase 0/1 ran. Skipping phases is never faster.

## Planning & Execution Phases (all modes)

### Phase 0: Clarity Triage

Before planning research, assess whether the request is **researchable as stated**. This prevents wasting compute on poorly-scoped queries.

**Triage decision:**

| Signal | Verdict | Route |
|--------|---------|-------|
| Goal named, success criteria absent — "research auth" (for what? security vs DX vs cost?) | **NOT researchable** | → `heavy-think` |
| "Best X" where evaluation axes are unstated and would conflict | **NOT researchable** | → `heavy-think` |
| User asking *what* to research, not researching a known thing — "how should I approach..." | **NOT researchable** | → `heavy-think` |
| Scope spans domains that need decomposition before search is meaningful | **NOT researchable** | → `heavy-think` |
| Bounded question with implied criteria — "compare Postgres vs MySQL for OLTP" | **Researchable** | → Phase 1 |
| User supplied mode + topic + sub-structure explicitly | **Researchable** | → Phase 1 |
| Known options, user just needs to pick parameters | **Researchable** | → Phase 1 (AskUserQuestion) |

**When routing to heavy-think:**

1. Invoke `Skill("heavy-think")` — it will classify the thinking mode (brainstorm/decompose/unstick/analyze)
2. After heavy-think produces a clear, bounded research question with success criteria → return here at Phase 1
3. State: "The research question wasn't clear enough to scope. After thinking through it, the researchable question is: [X]"

**Target Verification (part of Phase 0):**

Before advancing to Phase 1, do 2-3 quick inline web searches to verify that named entities (tools, projects, frameworks, companies, concepts) actually exist as stated. User-provided terms are hypotheses, not facts — they may be approximate, misremembered, or from a different domain than assumed.

| Signal | What's wrong | Action |
|--------|--------------|--------|
| No results for the exact term | Misspelled or doesn't exist | Try variants, check what search redirects to |
| Results consistently point to a different name | User used an approximation | Follow the scent — the redirect IS the target |
| Results exist but in a different domain than user implied | Domain mismatch (e.g., user said "crawler" but it's an agent framework) | Clarify with user before proceeding |
| Multiple unrelated projects share the name | Ambiguous target | Disambiguate — ask which one |
| Term existed but is now renamed/superseded | Outdated reference | Note the current name, confirm with user |

**Cost calculus:** 2-3 inline searches = near-zero cost. Spawning agents with wrong terms = entire research wasted + user must correct + redo. Always verify first.

**Rule:** NEVER proceed to Phase 1 with unverified proper nouns. If you can't confirm the target exists as named within 3 searches, present what you found and ask the user.

**Phase 0 is distinct from Phase 1's AskUserQuestion.** Phase 0 catches "the problem isn't researchable yet" AND "the search target isn't what you think." Phase 1 catches "confirm my research plan parameters." Don't blur them.

**Open-ended / iterative-expansion queries** (signals: "explore", "investigate", "what should we know about", "deep dive", no clear success criteria) are handled **natively** by the loop's CONTROL brain ([forager](references/forager/overview.md)), which runs full reflect + steer + topic expansion for them.

Single-fact lookups ("what's the latest stable React", "is Y deprecated") are not research — answer them with one WebSearch and leave this skill.

**Pass-through examples** (skip heavy-think, go directly to Phase 1):
- "Compare Next.js vs Remix for SSR performance" — criteria implied (performance), scope bounded
- "Evaluate Drizzle vs Prisma for type-safe PostgreSQL ORM" — evaluation axes implicit in "type-safe PostgreSQL ORM"

**Fire examples** (route to heavy-think first):
- "Research auth" — auth for what? Security posture? Developer experience? Cost? Different criteria produce different research
- "What's the best approach for our backend" — needs decomposition before any search is meaningful
- "How should I think about caching" — asking for perspective, not information

**Venue toggle — Team Research (opt-in, after triage passes):**

| Path | Action |
|------|--------|
| User said "team research" / "research with me" / `team` arg | → **Team venue** ([team-research](references/team-research.md)) — skip the question |
| Researchable, and live steering would help (exploratory, multi-step) | Ask one yes/no: *"Run as **live Team Research** — you supervise while a steering-lead brain + 2–3 gatherers + a verifier work and adapt in real time? Or run it normally?"* |
| Otherwise | Inline or Workflow venue, as the brain picks |

Yes → Team venue (still do Phase 1 planning first). Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` + main session (no nested teams).

### Phase 1: Confirm Research Plan with User

Before executing, present your research plan and let the user confirm or adjust. Keep it lightweight — one message, not 4 separate questions. Write it after the Phase 2 decomposition, language assignment and sizing (below), so the message shows the plan you would actually run:

```
"Here's my research plan:
- Target: [what I understand you're asking about — disambiguate if needed]
- Sub-topics: [list — each one traces to something you asked or a criterion your decision turns on]
- Languages: [per sub-topic, with a short reason for each language; default languages left off, and why]
- Sources: [recommended stack for this topic; say whether GitHub is in]
- Size: [N assignments ≈ M agents, ceiling ≈ X tokens]. Smaller option: [what it drops → N′ assignments, ≈ X′]. [Larger option, when the question could use more depth: what it adds → X″]
[- Not included unless you want it: adjacent angles you think could matter]

Adjust anything, or good to go?"
```

The brain still decides iterations, gap-fill agents and when to stop; the user does not approve agents one by one. But the **size** is shown, because it is the cost of the run and only the user knows what the decision is worth. Recommend one size; always offer a smaller one that names what it gives up.

**What IS confirmed:** the research TARGET (most important — catches wrong search terms), sub-topics, languages, source priority, and size.

**Check that the plan holds together before you send it** (each of these went wrong in real runs):
- The Size line's arithmetic is right (squad members summed over assignments = agents; the estimate comes from the formula in [Size the plan](#size-the-plan-to-the-decision)), and the ceiling is not below the estimate.
- The message and the internal plan use the same numbers: agents, ceiling, saturation threshold, languages.
- The Sources line matches the squads: if GitHub is out, no slice searches it and the lead prompts drop the `gh search` line.
- Every assignment's language has a reason, and every sub-topic traces to the request.

**Skip Phase 1 ONLY when:** user explicitly specified the target and sub-topics clearly, e.g. "compare Prisma vs Drizzle for PostgreSQL ORM."

### Phase 2: Plan (YOU do this — don't delegate)

1. **Apply confirmed settings** — use sub-topics, languages, and source stack from Phase 1
2. **Read `references/language-matrix.md`** — look up T1/T2 languages for the topic's field (if not already done in Phase 1). This determines which languages to assign beyond the EN + ZH + ZH-TW default.
3. **Identify elite forums per language** — see "Elite Forum Targeting" below. Include `site:` targets in agent prompts.
4. **Decompose** — break topic into sub-questions using structured decomposition (see below). Every sub-question stays inside the request (Scope, below)
5. **Assign agents** — each assignment gets **1 language + 1 sub-topic** (atomic, single responsibility) and runs as a squad. Put a language only on the sub-questions where it has evidence to add ([Language per sub-question](#language-per-sub-question)). Use T1 languages from the matrix as primary assignments; add T2 languages when the topic is broad or T1 coverage comes back thin.
6. **Size and budget** — check the assignment count against the decision, and compute the ceiling from it ([Size the plan](#size-the-plan-to-the-decision))
7. **Iterations** — none preset; the brain stops on saturation (Phase 4)
8. **Set output path** — relative to current working directory: `./research/YYMMDD-<topic>/`

Steps 4–6 come before the Phase 1 message, because that message shows their result; after the user replies, apply what they changed.

**Terms used below:** an **assignment** is 1 sub-question × 1 language. A **squad** is the agents that run one assignment: a full squad is 5 (sonnet lead, 3 haiku slices, haiku opener; [gather-squad](references/gather-squad.md)). **Agents** = the sum of squad members. Keep the three apart in the plan; mixing them up is how a plan ends up with a ceiling for 12 agents and 60 agents to run.

**Structured Decomposition** (any topic with more than one part)

Don't just split by obvious keywords. Apply these lenses:

| Lens | Question | What it catches |
|------|----------|-----------------|
| **Stakeholder** | Who uses/builds/maintains this? | Different communities have different answers |
| **Temporal** | What's the current state vs trajectory? | Avoids recommending dying tech |
| **Failure mode** | What goes wrong? What are the pitfalls? | Catches "works in tutorial, breaks in prod" |
| **Alternative framing** | What if the obvious answer is wrong? | Prevents confirmation bias in sub-topic selection |

Example — "compare auth solutions for Next.js":
```
Naive decomposition: [OAuth providers, self-hosted libraries] — misses failure modes
Structured decomposition:
  1. "OAuth/OIDC providers" (stakeholder: teams wanting managed auth)
  2. "Self-hosted auth libraries" (stakeholder: teams wanting control)
  3. "Auth failure modes and migration pain" (failure mode lens)
  4. "Auth at scale — what breaks beyond 10K users" (temporal + failure lens)
```

The failure mode lens is the most commonly skipped and highest value.

**Scope: every sub-question traces to the request**

A sub-question is in scope when it answers something the user named, or a criterion their decision turns on ("tight budget" makes real monthly cost a sub-question; "some unmaintained modules" makes legacy-module breakage one). The lenses sharpen those sub-questions: the failure modes of the options asked about, the stakeholders who already use them, an alternative framing of the same decision ("neither: a $5 VPS"). They do not add a new population, market or product the user did not ask about. Asked about Vietnamese small businesses, "Chinese-owned firms in Vietnam" is a new population, and inventing it to give a default language something to do is padding. An adjacent angle you think matters goes in the plan's "Not included unless you want it" line, where the user can add it.

When two sub-questions would send gatherers to the same sources (pricing traps and real bills; lock-in and vendor trajectory), merge them: one well-covered sub-question beats two thin ones, and each costs a squad per language.

#### Language per sub-question

EN + ZH + ZH-TW is the candidate set. Put a language on a sub-question when that language's community holds evidence the others don't: practitioner experience written in it, a local market, local vendors or local law. Leave it off when:
- the sub-question is answered by primary documents in another language (release notes, version support policy, vendor pricing pages, a statute): a ZH squad there re-reads the EN docs;
- the topic is local to a place outside the set (Vietnamese e-invoicing: VI primary, EN for analysis; ZH only with a concrete reason);
- your Phase 0 scan already found the language only relays news from elsewhere. Give it the one sub-question where it is most likely to hold something (usually practitioner pain or failure modes), and let REASONING add more if it surprises you. A language you expect to be thin does not get a squad on every sub-question.

Add languages the same way: DE for an evidence question whose main researchers publish in German, JA where a key case is Japanese. Each language in the plan carries a short reason; each default language you left off is listed with why, so the user can put it back.

**Agent assignment: 1 language + 1 sub-topic per assignment (atomic)**

Each assignment has a single, clear job and runs as a squad. With 2 sub-topics, EN on both, ZH on one and ZH-TW on none, that's 3 assignments, about 15 agents. Run them as a rolling pool, ≤6 in flight; when one returns, launch the next queued agent immediately.

Example for "compare auth solutions" (provider docs are EN; ZH practitioners have self-hosting experience):

```
Assignments:
  A1: EN + "OAuth/OIDC providers comparison"
  A2: EN + "self-hosted auth libraries"
  A3: ZH + "self-hosted auth libraries"
  (ZH-TW left off: thin community for this topic; REASONING may add it)

In flight (≤6): A1 lead + its 3 slices, A2 lead + A2 code slice
Queued (each starts the moment any slot frees): the rest of A2, then A3, then the openers
  (brain may add follow-up assignments as early results land)
```

### Size the plan to the decision

The plan's cost is its assignments: each full squad is about 5 × ~15k = 75k tokens per wave. A plan is the right size when every assignment could change the answer if it came back surprising. Read three things from the request:

| Signal | Points smaller | Points larger |
|--------|----------------|---------------|
| What is decided | A pick among a few named options; reversible; small stakes in the user's own words ("small SaaS", "tight budget", "quick") | A survey of an ecosystem; "what does the evidence say"; a migration that is costly to undo |
| Where the evidence lives | Mostly primary documents (pricing pages, release notes, the law) | Dispersed practitioner experience, contested studies, several countries or communities |
| How contested | Sources agree | Sources contradict each other, or vendor SEO buries the signal |

Starting points, not caps:

| Question shape | Assignments in wave 1 | Example |
|----------------|----------------------|---------|
| Focused pick among named options | 3–5 (15–25 agents) | "Turso vs D1 vs Neon for a small SaaS on a tight budget" |
| Decision with real switching cost, or one market with several kinds of evidence | 5–8 | "Move our RN app to the New Architecture? 40 native modules"; "what Vietnamese small businesses use for e-invoicing" |
| Survey, evidence review, multi-country, contested literature | 8–15 | "Full ecosystem survey of MCP servers"; "does productivity hold on a 4-day week" |

Size up when the question earns it: do not starve a survey or a contested evidence question to hit a small number. Within any size, put the depth where the decision is: the sub-question that carries a contested, load-bearing claim gets more languages or an early gap-fill; the sub-question primary docs settle gets one assignment. Phase 4 gap-fill is how a plan grows where gaps show up, which is cheaper than front-loading thin assignments.

**Budget follows the plan, never the other way round:**
- gather_est = agents × ~15k × expected waves (1 + the gap-fill share you expect); estimate = max(gather_est + 50k, gather_est ÷ 0.8), so that after the script fences its 20% synthesis reserve the gather ceiling still covers the gather you listed. This is the [phase-zero formula](references/adaptive-research/phase-zero-planning.md), counting every squad member as an agent.
- The ceiling is at least the estimate. Never set it below your own estimate: the gather ceiling then SCRAMs to synthesis before the squads you listed report, and the plan says one thing while the run does another.
- If the user's budget, or the preset they choose, is lower than the estimate, cut assignments until the estimate fits, and say what you cut.
- If you think ~15k per agent is wrong for this plan (for example, mostly docs-only squads), change the unit in the formula and show it. Do not discount it silently.
- The smaller option in Phase 1 is a smaller plan (fewer assignments, languages or squad members), with its own estimate. A plan that is already 1–2 assignments can offer an inline single-pass run instead.

### Elite Forum Targeting

Generic web search favors SEO-optimized sites over niche/elite communities where real expertise lives, so include elite forum targets in every gatherer prompt.

**How it works:**
1. Read `references/elite-forums/overview.md` for the validated forum reference (or use the table below as quick-reference)
2. For each assigned language, pick 2-4 elite forums relevant to the topic
3. Include them as `site:` search instructions in the agent prompt
4. Also read `references/elite-forums/content-farms.md` to know what to deprioritize
5. The forum list is a **starting point** — agents should discover more via search

**Starting-point forums** (research-validated June 2026 — full details in `references/elite-forums/`):

| Lang | Elite forums (use `site:` targeting) | Content farms (deprioritize) |
|------|--------------------------------------|------------------------------|
| ZH | V2EX, 看雪 (kanxue.com), linux.do, 博客园 (cnblogs.com), SegmentFault, NodeSeek, w2solo | CSDN, Juejin (post-ByteDance), 51CTO, 百家号, 简书 |
| RU | Habr, wasm.in, Codeby, ODS.AI, linux.org.ru, SQL.ru, Infostart | sky.pro/wiki, proglib.io, skillbox.ru/media |
| EN | Lobste.rs, Hacker News, Indie Hackers, EEVblog, MLOps Community | GeeksforGeeks, TutorialsPoint, Javatpoint, Dev.to |
| VN | Viblo, VOZ, WhiteHat.vn, Dạy Nhau Học, devops.vn | TopDev/TechTalk/TechBlog (Applancer — stolen content), VN-Zoom |
| JA | Zenn, AtCoder, JAWS-UG, connpass (activity proxy) | 侍エンジニア, TechAcademy Magazine, Qiita (declining) |
| KO | GeekNews (news.hada.io), Dreamhack, IAMROOT, Disquiet, OKKY | DC Inside, generic Naver/Tistory blogs |
| DE | Mikrocontroller.net, Administrator.de, CCC ecosystem, c-plusplus.net | Gutefrage.net, CHIP.de (dead) |
| FR | Developpez.com, Root-Me, ZenK-Security, Hackropole (ANSSI), LinuxFr.org | OpenClassrooms Forums, CommentCaMarche |

**For reverse engineering / security / anti-bot topics:**
ZH: T00ls, 看雪, 先知社区 (xz.aliyun.com), 52pojie. RU: wasm.in, Codeby. EN: 0x00sec, HackTheBox, Tuts4You. VN: WhiteHat.vn, Viblo CTF. JA: SECCON. KO: Dreamhack, CODEGATE, webhacking.kr. FR: Root-Me, ZenK-Security, Hackropole.

### Phase 3: GATHER (the loop's gather step)

This is the GATHER step of the iterate loop — spawn gatherer agents for the current sub-questions. Brain decides how many agents.

Spawn `gatherer` agents as plain subagents (no `name`). Spawn each assignment as a squad in one message: a `model: "sonnet"` lead with the prompt below, plus three `model: "haiku", effort: "high"` slices (code, social, docs) with the slice and budget lines from [gather-squad](references/gather-squad.md). When the three slices return, spawn one opener on their `UNOPENED LEADS`. Give each member its own report path. Spawn the squad the plan confirmed: a slice dropped or re-aimed for the source stack stays that way, and when there is no code slice (GitHub out of the stack) or no social slice, delete the lead-prompt line that hands that work to the missing helper. Each prompt:

```
Research: [1 specific sub-question]
Language: [1 assigned language — search ONLY in this language]
Output: Return findings as structured data, NOT a formatted report. Search until you find gems or exhaust the topic.

PARALLEL: in each turn, send several independent tool calls at once, spread across different sites. Fetch pages in batches with batch_fetch (up to 10 URLs per call). Do not call Reddit; the social helper owns it. Do not run `gh search`; the code helper owns the GitHub search quota. Speed comes from parallel calls, never from stopping early: keep going until new searches stop turning up gems.
COVERAGE PASS (before you stop): list the sub-areas named in the research question. For each sub-area with fewer than 3 GEMs, run at least 2 more searches on it with different keywords or different sites, and open the best results. Stop only when one full coverage pass adds no new GEM. Put the final per-sub-area GEM counts in the report.

Elite forum targeting: Include at least 2 site:-targeted searches on these forums:
[list 2-4 forums from the table above for this language]
Also discover additional niche forums via "[topic] 论坛 社区 精华" queries.
Prioritize elite/niche communities over content farms.

Scope: ONLY [sub-topic]. Do NOT investigate [other sub-topics].
Report path: [./research/YYMMDD-topic/lang-subtopic.md]

Tag each finding as GEM/MEH/NOISE:
- GEM: a number, a named incident, an exact error, or a working workaround — from practitioner experience, on a page you actually fetched. A search snippet or issue title you did not open is MEH at most. A restatement of vendor docs is MEH unless it contradicts a practitioner report.
- MEH: partial signal, some specifics but also generic
- NOISE: generic praise, listicles, no downsides, undated, affiliate links, keyword stuffing
List each incident once, even if several sources repeat it (cite them together). Prioritize GEM findings. Report NOISE count but don't expand on them.

RECOMMENDED SKILLS: deep-gather - use for search-fetch loop methodology
```

**Max 6 agents in flight — rolling, not waves.** Fire the first batch (up to 6) in a single message; as each completes, launch the next queued agent without waiting for the rest.

### Phase 4: CONTROL — Reflect & Steer (the forager brain)

This is the loop's **CONTROL** step — the fused **forager** brain. After GATHER returns, the control agent runs REFLECT (assess coverage) → STEER (deepen / expand / stop). Full methodology: [forager](references/forager/overview.md). The checks below are the REFLECT pass; STEER then decides the next iteration or exit.

**Step 1: Coverage Assessment**

For each sub-question from Phase 2, assess:

| Sub-question | Status | Sources | Confidence |
|---|---|---|---|
| [sub-q 1] | gap / partial / covered | count | low / medium / high |
| [sub-q 2] | ... | ... | ... |

Confidence levels: **high** = 3+ independent sources agree. **medium** = 2 sources or single authoritative source. **low** = 1 source or blog-only.

**Step 2: Structured Checks**

| Check | Question | Action if YES |
|-------|----------|---------------|
| **Intent-data mismatch** | Does the data answer what the user ACTUALLY asked? User implied X is real/used, but data says "doesn't exist"? | **HIGHEST PRIORITY** — you may be searching for the wrong thing. Re-examine the search term. Ask user to clarify OR pivot search target. NEVER relay "it doesn't exist" without checking if YOU misidentified the target |
| **Scent redirect** | Did search results consistently redirect to a DIFFERENT term/project? (e.g., searching "OpenCrawl" but all results point to "OpenClaw") | Follow the scent — this IS the signal. The user likely means the thing search redirects to |
| **Contradictions** | Do agents disagree on facts? | Investigate primary source — one is wrong |
| **Non-diagnostic findings** | Does a finding support ALL options equally? | Deprioritize — it doesn't help decide (ACH principle) |
| **Missing failure modes** | Did any agent cover what goes WRONG? | Search GitHub Issues, forums for real-world pain |
| **Recency** | Are recommended tools still maintained? | Check last commit, last release date |
| **Refutation test** | What would DISPROVE the emerging recommendation? | Search for that evidence — if absent, recommendation is robust |
| **Composition** | Do recommendations work together or conflict? | Test the combination, not just individual parts |
| **Data accuracy** | Are specific numbers (costs, stars, dates) verified from primary sources, or just repeated from one blog? | Cross-check load-bearing claims against primary source (GitHub, official docs, actual invoices). Unverified numbers must be flagged |
| **Distribution** | Is the data representative or just outliers/cherry-picked? What's the spread? | Report range (min-median-max), not just one data point. Flag if sample size is too small to generalize |

**Step 3: Gem Extraction** (gather is the small step; this is where value lives)

Gather collects raw data. YOUR job is to find **gems** — real practitioner insights buried under SEO noise. Apply [gem-detection](references/forager/gem-detection.md) scoring:

| Tag | Criteria | Action |
|-----|----------|--------|
| **GEM** | Specific numbers + pain/failure + verifiable (code, config, error logs) | Keep, cite prominently in synthesis |
| **MEH** | Partial signal — some specifics but also generic | Use only if no gem available |
| **NOISE** | SEO patterns: generic praise, listicles, no downsides, undated, affiliate | **Drop from synthesis** |

**Rule: a synthesis built from NOISE is worse than saying "insufficient data."** 2 gems > 20 noise items.

**Step 4: Gap-Targeted Deepening**

If coverage assessment shows gaps:
- Spawn 1-2 targeted agents to fill specific gaps (not broad re-search)
- Use refined queries informed by what was already found
- Focus on the failure-mode and refutation checks — these are highest value
- If gem count is 0 after gather → the search target may be wrong. Re-examine before deepening

This phase separates surface search from real research. NEVER skip.

### Post-Workflow Verification (workflow venue only)

After a workflow completes, BEFORE writing the final report:

1. Check if synthesis/cross-check agents returned actual content vs errors (spend limits, timeouts)
2. If any agent failed: spawn Sonnet agents to extract data from agent JSONL transcripts
3. Cross-reference extracted data vs synthesized output — identify dropped findings
4. Fill gaps into the final report before presenting to user

**Never trust workflow output blindly.** The synthesis agent may have run out of budget.

### Phase 5: Synthesize

Merge into one report at `./research/YYMMDD-<topic>/` (relative to cwd, split per doc rules):

1. **Lead with recommendation** — what and why
2. **Cross-language tensions** — where communities disagree
3. **Cite primary sources** — every claim links to a fetched URL
4. **List contradictions** — present honestly
5. **Unresolved questions** — what couldn't be answered

**Citation Format:**

Every case study and data claim carries its source URL inline:
- Case study: `Novo Nordisk: 90% reduction ([anthropic.com](URL))`
- Stat: `79% of top performers use AI ([Salesforce](URL))`
- Tool claim: `60min/day savings ([53ai.com](URL))`

Reports without inline citations are INCOMPLETE — do not finalize. If agents returned 333 URLs but the synthesis has 0, the synthesis failed.

## Anti-Patterns

| Trap | Fix |
|------|-----|
| Agent assigned multiple languages | 1 lang per agent — atomic |
| Agent assigned multiple sub-topics | 1 sub-topic per agent — single responsibility |
| Spawning without plan | MUST decompose first |
| Skipping Phase 4 | Phase 4 = real research. NEVER skip. |
| Hardcoded output path | Use cwd-relative paths |
| More than 6 agents in flight, or waiting for a whole batch before launching more | Rolling pool: ≤6 running, refill a slot as soon as one frees |
| Researching vague/unscoped requests | Route to heavy-think first (Phase 0 triage) |
| Using heavy-think for every multi-part topic | Only fire when *framing* is contested, not when a clear topic has parts |
| Blurring Phase 0 and Phase 1 | Phase 0 = "is this researchable?" Phase 1 = "confirm my plan parameters" |
| Skipping elite forum targeting | Generic search surfaces content farms. MUST include `site:` targets in agent prompts |
| Dropping contradictions/warnings in synthesis | Extract ALL structured fields (findings + key_insights + contradictions). Shallow extraction = incomplete report |
| All workflow agents on same model | Run each gatherer assignment as a squad (sonnet lead + capped haiku slices), use `model: 'sonnet'` for cross-checkers, `model: 'opus'` only for the REASONING brain and synthesis |
| Synthesis has 0 citations | Raw reports have URLs → synthesis MUST preserve them inline. 0 citations = failed synthesis |
| No budget guards in workflow | Guard on `(budget.spent() - start) < CEILING - SYNTH_RESERVE` before cross-check and synthesis — `budget.remaining()` is `Infinity` when no target is set |
| Elite forums not in workflow prompt | The table is in THIS skill but doesn't auto-transfer — MUST paste forum list into each agent prompt |
| Trusting workflow output without verification | ALWAYS check if synthesis agent actually ran vs returned spend-limit error |
| Interpreting "quick/nhanh/fast" as skip phases | "Quick" = shallower depth (fewer iterations), NOT skip Phase 0/1/4. Skipping phases burns MORE tokens (wrong target → user corrects → redo) |
| Relaying gatherer data without REFLECT pass | YOU are the brain, not a relay station. Even low mode: 1 REFLECT pass checking intent-data match, scent redirect, data accuracy |
| "It doesn't exist" without questioning your search term | If user implies X is real but data says nothing → YOU likely searched for the wrong thing. Follow search redirects, ask user, or pivot |
| Reporting single data points without distribution | Report range (min-median-max), flag small sample sizes, note if data is from one source vs cross-verified |
| Spawning agents with unverified proper nouns | MUST do 2-3 inline searches in Phase 0 to verify targets exist as named. User terms are hypotheses — approximate, misremembered, wrong domain. Wrong search terms = entire research wasted |
| Every default language on every sub-question | A language goes where its community has evidence to add, with the reason in the plan. Primary-doc sub-questions get the docs' language; a language expected to be thin gets one sub-question, not all |
| Inventing a sub-topic or population the user did not ask about (often to give a default language work) | Sub-questions trace to the request; adjacent angles go in the "Not included unless you want it" line |
| A plan sized by the cross product, not the decision; the user never sees the size | Size the plan to the decision; show the Size line with a smaller option |
| A ceiling below your own estimate, or too small for the squads listed | Ceiling ≥ estimate. If the budget is lower, cut assignments and say what was cut |
| Sources line says "no GitHub" while squads keep a GitHub code slice | Drop or re-aim the slice and remove its lead-prompt line ([gather-squad](references/gather-squad.md)) |
| Skipping Target Verification on "quick" research | Target Verification is NEVER skippable — 2-3 searches (~free) vs N wasted agent spawns (~expensive). Quick reduces depth, not verification |

## Related

- [deep-gather skill](../../skills/deep-gather/SKILL.md) — methodology loaded by each agent
- [language-matrix.md](../../skills/deep-gather/references/language-matrix.md) — field-to-language mapping
- [elite-forums overview](references/elite-forums/overview.md) — validated forum reference (161 forums, 8 languages)
- [content-farms](references/elite-forums/content-farms.md) — sites to deprioritize per language
- [landscape-notes](references/elite-forums/landscape-notes.md) — per-language ecosystem insights
- [forager (the brain)](references/forager/overview.md) — REFLECT/STEER methodology, the loop's CONTROL step
- [adaptive-research spec](references/adaptive-research/overview.md) — target redesign: gather/reason split, adaptive-depth loop, control rod, Phase 0 budget
- [team-research](references/team-research.md) — live supervised agent-team venue: steering-lead brain + gatherers + verifier, exchanging via SendMessage
