# Workflow venue

Part of the [lead-researcher skill](../SKILL.md). Read this when the brain picks the workflow venue: runtime contract, model tiers, budget guards, elite-forum passthrough, output schema, how to trigger it, and the checks after it finishes.

### Workflow runtime contract (workflow venue)

The loop runs as a background workflow: the JS script orchestrates but **cannot think**, and the main agent is asleep. So:

| Concern | Contract |
|---------|----------|
| **Where the brain runs** | REASONING/EXPAND/CHECK = ONE **opus sub-agent** per iteration (NOT a cheap model). It receives the serialized STATE digest and returns the verdict ([schema](adaptive-research/adaptive-depth-loop.md)). |
| **STATE digest** | Pass `hypotheses[]` + a per-topic knowledge **summary** (not raw findings). Cap ~15k tokens — summarize-and-roll old knowledge so the brain's input stays bounded. |
| **Persistence / resume** | The script has no filesystem access. The Workflow tool journals every `agent()` result; resume a killed run with `resumeFromRunId` (same script + args replays the cached prefix). Files — the report, any STATE snapshot — are written by an agent, not by the script. |
| **Budget self-enforce** | `const CEILING = args.budgetCeiling ?? 200_000` (never undefined → no `NaN`). Guard on `(budget.spent() - start) < CEILING - SYNTH_RESERVE`. Do **NOT** gate on `budget.total` — it is usually null. |
| **Handoff** | Workflow synthesizes internally and writes the report; on completion the main agent reads it and runs GOAL-CHECK. Main agent re-synthesizes ONLY if the workflow's synthesis sub-agent errored (spend limit). |

For **inline venue** none of this applies — the main agent holds STATE in context and reasons directly; no JS, no state.json, no sub-agent brain.

The sections below (Model Tiering, Budget Guards, Elite Forum Passthrough, Structured Output) and Source Priority ([planning](planning.md#source-priority--decided-at-runtime)) are **components used inside this loop**, not a separate static pipeline.

Detailed refs: [adaptive-depth-loop](adaptive-research/adaptive-depth-loop.md) · [control-panel](adaptive-research/control-panel.md) · [control-rod](adaptive-research/control-rod.md) · [phase-zero-planning](adaptive-research/phase-zero-planning.md) · [streaming-verify](adaptive-research/streaming-verify.md) · [forager (the brain)](forager/overview.md)

### Model Tiering (workflows)

| Agent Role | Model | Why |
|-----------|-------|-----|
| Gatherer squad, every language (search-fetch) | `sonnet` lead (whole assignment, no cap) + 3 `haiku` slices at `effort: 'high'` (code 20 calls, social 15, docs 15) + a `haiku` opener (10 calls) | Goal: miss nothing, fast. Slices add about half of all gems; the opener reads the leads they listed but never opened |
| Cross-checker | `sonnet` | Comparison task, not deep reasoning |
| REASONING brain (per iteration) | `opus` | Weighs findings against hypotheses and owns the exit |
| Synthesizer | `opus` | Needs deep reasoning to merge N reports into coherent analysis |

Run every gatherer assignment as a squad: see [gather-squad](gather-squad.md) for members, slice prompts and merge rules. The slices are source slices, so they follow the confirmed source stack: a slice whose sources the user left out is dropped or re-aimed at an in-stack source ([gather-squad](gather-squad.md), Fit the squad to the source stack). Never drop the Sonnet lead for a non-English language: Haiku drifts to English and content-farm sources there. Evidence: `~/workspace/knowledge/topics/ai-agents/small-models-as-subagent-workers.md`.

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

### Post-Workflow Verification (workflow venue only)

After a workflow completes, BEFORE writing the final report:

1. Check if synthesis/cross-check agents returned actual content vs errors (spend limits, timeouts)
2. If any agent failed: spawn Sonnet agents to extract data from agent JSONL transcripts
3. Cross-reference extracted data vs synthesized output — identify dropped findings
4. Fill gaps into the final report before presenting to user

**Never trust workflow output blindly.** The synthesis agent may have run out of budget.
