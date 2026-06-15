---
name: lead-researcher
description: "MANDATORY entry point for ALL research tasks. Orchestrates gatherer agents with configurable depth modes (low/medium/high/max). Determines languages, iterations, agent count, and sub-topics — then spawns parallel gatherer agents and synthesizes results. Triggers: any research request, 'research X', 'what's the best', 'compare X vs Y', 'how should I approach', 'evaluate X', 'deep research', 'comprehensive analysis'. ALL research goes through lead-researcher first — never spawn gatherer agents directly. Arguments: [mode] [topic] — e.g. 'high compare auth solutions' or 'max full ecosystem survey of MCP servers'."
---

# Lead Researcher

MANDATORY orchestrator for ALL research. Based on Anthropic's orchestrator-worker pattern.
You plan, decompose, assign (1 language + 1 sub-topic) per agent, then synthesize.

## Arguments

Format: `[mode] [topic]` — mode is optional (default: medium).

```
/lead-researcher high compare auth solutions for Next.js
/lead-researcher max full ecosystem survey of MCP servers
/lead-researcher what's the best ORM for PostgreSQL     ← mode inferred as medium
```

## Modes

| Mode | Languages | Iterations/agent | When |
|------|-----------|-----------------|------|
| **low** | EN + ZH | 2-3 | Quick fact check, single question |
| **medium** | EN + ZH | 3-5 | Standard evaluation, comparison |
| **high** | EN + ZH + RU | 5-8 | Multi-domain, contradictions likely |
| **max** | EN + ZH + RU + any relevant | 8-10 | Comprehensive landscape survey |

**Chinese (ZH) is ALWAYS included** — even in low mode. The difference between modes is iteration depth and additional languages, not whether ZH is included.

### Mode Selection Heuristic

| Signal | Mode |
|--------|------|
| Single fact, version check, yes/no | **low** |
| "best X", "how to", single comparison | **medium** |
| "compare A vs B vs C", multi-domain, "investigate" | **high** |
| "deep research", "comprehensive", "landscape", "all options" | **max** |

## Execution Engine

| Mode | Engine | Why |
|------|--------|-----|
| **low/medium** | Subagents (manual) | Few agents, fast, simple |
| **high/max** | Adaptive Iterate Loop | Agent-gated loop — gatherer agents (hands) + control agent (brain), streaming verify, rate-limited expansion |

### Adaptive Iterate Loop (high/max — the engine)

high/max is **NOT** a fixed decompose → fan-out → merge. It is an **agent-gated iterate loop**: depth is decided each iteration from live coverage, not fixed by mode. This is what fixes the shallow/deep oscillation. Full design: [adaptive-research spec](references/adaptive-research/overview.md).

**Encode this loop in the workflow script:**

```
seed goal-state  (sub-questions × languages, Phase-0 budget ceiling)
while ( !control.stop  &&  gatherBudgetRemaining() > 0 ):
  GATHER   parallel gatherer agents (topic × language × forum)            [model: sonnet]
  VERIFY   pipeline, stream per-finding (NO barrier) + CRITIC refute      [model: sonnet]
  GAUGE    update control panel (links / topics / per-lang sources / new-info-rate / contradictions)
  CONTROL  1 cheap-model agent reads panel → { stop, deepen[], add_forums[], crawl_deeper[], expand_topics[] }
  apply verdict — admission-controlled (control rod: expansion budget, depth cap, damping)
SYNTHESIZE  opus, on a FENCED reserve (never starved) → cited report
GOAL-CHECK  score report vs the ORIGINAL goal (catch drift)
```

| Rule | Detail |
|------|--------|
| **Exit by agent** | Loop stops when the CONTROL agent returns `stop` — NOT a fixed iteration count |
| **Brake (primary)** | `new-info ÷ tokens` declining → stop; works even when `budget.total` is null |
| **Brake (hard)** | fenced synthesis reserve + expansion budget + depth/generation caps → SCRAM to synthesis |
| **Streaming verify** | `pipeline()`, no barrier — a refuted finding lowers coverage *before* CONTROL runs |
| **Dynamic expansion** | topics + forums + crawl-depth, rate-limited so it can't run away |
| **Each step** | 1 or many agents, parallel or sequential — `parallel()` to fan out, `pipeline()` to stream |

The sections below (Source Priority, Model Tiering, Budget Guards, Elite Forum Passthrough, Structured Output) are **components used inside this loop**, not a separate static pipeline.

Detailed refs: [adaptive-depth-loop](references/adaptive-research/adaptive-depth-loop.md) · [control-panel](references/adaptive-research/control-panel.md) · [control-rod](references/adaptive-research/control-rod.md) · [phase-zero-planning](references/adaptive-research/phase-zero-planning.md) · [streaming-verify](references/adaptive-research/streaming-verify.md)

### Source Priority Order (MANDATORY)

When constructing workflow prompts and evaluating findings, rank sources:

| Priority | Source Type | Why |
|----------|-----------|-----|
| 1 | Elite forums (V2EX, Habr, HN, Lobste.rs, etc.) | Practitioner signal, not SEO-optimized |
| 2 | GitHub repos, code, issues | What people actually build |
| 3 | Official docs (Anthropic, vendor sites) | Authoritative but marketing-biased |
| 4 | High-value websites (arXiv, McKinsey, Deloitte) | Data-backed but may lag practice |
| 5 | Blog posts, tutorials | Secondary — verify against above |

**Every workflow prompt MUST include this priority order.** Agents that return only blog/vendor sources are incomplete.

### Model Tiering (MANDATORY for workflows)

| Agent Role | Model | Why |
|-----------|-------|-----|
| Gatherer (search-fetch) | `sonnet` | Mechanical retrieval — Opus is overkill, wastes budget |
| Cross-checker | `sonnet` | Comparison task, not deep reasoning |
| Synthesizer | `opus` | Needs deep reasoning to merge N reports into coherent analysis |

Without tiering, all agents inherit the parent model (usually Opus), consuming ~5x budget before synthesis. This is the #1 cause of incomplete research reports — the synthesis agent never runs.

### Budget Guards (MANDATORY for workflows)

```js
// Before cross-check phase
if (budget.total && budget.remaining() < 80_000) {
  log('Budget low — skipping cross-check, going direct to synthesis')
  // skip to synthesis
}

// Before synthesis phase  
if (budget.total && budget.remaining() < 30_000) {
  log('Budget critically low — synthesis will be done by main loop')
  return { findings: allFindings, crossChecks: null }
}
```

If synthesis agent fails (spend limit), the main loop MUST:
1. Read all agent report files from disk (agents write to `./report/`)
2. Synthesize manually from those files
3. Flag in the final report that cross-check was skipped

### Elite Forum Passthrough (MANDATORY for workflow prompts)

The elite forum table (in Phase 2) MUST be included in every gatherer agent prompt within the workflow script. The table exists in THIS skill but does NOT automatically transfer to workflow agents.

```js
const ELITE_FORUMS = {
  EN: 'Lobste.rs, Hacker News, Indie Hackers, Reddit (r/relevant)',
  ZH: 'V2EX, linux.do, cnblogs.com, SegmentFault, NodeSeek',
  RU: 'Habr, ODS.AI, linux.org.ru, SQL.ru'
}

agent(`...
Source priority: elite forums > GitHub > official docs > blogs.
Elite forums for ${lang.code}: ${ELITE_FORUMS[lang.code]}
Use site: targeting for at least 2 of these forums.
...`, { model: 'sonnet', agentType: 'gatherer' })
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
agent(prompt, { schema: RESEARCH_SCHEMA, model: 'sonnet' })
```

### How to trigger a dynamic workflow

After Phase 1 confirms high/max mode, tell the user:

> "This is a high/max research — I'll run it as a dynamic workflow for better parallelism and cross-checking."

Then describe the research task with the word **"workflow"** in your message to trigger the workflow engine. Include ALL the planning details (sub-topics, languages, iterations, output path) so the workflow script encodes them.

Example trigger prompt (encodes the iterate loop, not a static pipeline):

```
Run a workflow as an ADAPTIVE ITERATE LOOP to research [topic]:

Seed: sub-questions [list] × languages [list]; budget ceiling [Phase-0 value].

Each iteration:
  GATHER  — parallel gatherer agents (1 sub-q + 1 language each), model sonnet
  VERIFY  — pipeline, stream per-finding (no barrier), CRITIC tries to refute key claims
  GAUGE   — update control panel: links / topics / per-language sources / new-info-rate / contradictions
  CONTROL — one cheap-model agent reads the panel and returns:
            { stop, deepen[], add_forums[], crawl_deeper[], expand_topics[] }
            Loop EXIT depends on this agent — not a fixed count.
  Apply the verdict, rate-limited (expansion budget, depth cap, damping).

Stop when CONTROL says stop OR new-info/token collapses OR gather budget hits the fenced
synthesis reserve. Then SYNTHESIZE (opus, fenced reserve) → cited report at [output path],
and GOAL-CHECK the report against the original question.

Language matrix reference: [paste relevant T1/T2 langs from matrix]
Each gatherer agent should use the `gather` skill for search-fetch loop methodology.
```

For **low/medium mode**, skip the workflow engine and use regular subagent spawning (Phase 2-5 below).

## Workflow (Subagent Mode — low/medium)

### Phase 0: Clarity Triage (MANDATORY)

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

**Phase 0 is distinct from Phase 1's AskUserQuestion.** Phase 0 catches "the problem isn't researchable yet." Phase 1 catches "confirm my research plan parameters." Don't blur them.

**Forager detection (BETA):** If the query is open-ended, multi-domain, or likely to need iterative scope expansion (signals: "explore", "investigate", "what should we know about", "deep dive", no clear success criteria), mention: "This might benefit from forager (beta) — iterative research with topic expansion. Want to try it?" Only if user confirms, invoke `Skill("forager")`. Never auto-invoke.

**Pass-through examples** (skip heavy-think, go directly to Phase 1):
- "Compare Next.js vs Remix for SSR performance" — criteria implied (performance), scope bounded
- "What's the latest stable version of React" — single fact, clear target
- "Evaluate Drizzle vs Prisma for type-safe PostgreSQL ORM" — evaluation axes implicit in "type-safe PostgreSQL ORM"

**Fire examples** (route to heavy-think first):
- "Research auth" — auth for what? Security posture? Developer experience? Cost? Different criteria produce different research
- "What's the best approach for our backend" — needs decomposition before any search is meaningful
- "How should I think about caching" — asking for perspective, not information

### Phase 1: Confirm Research Plan with User (MANDATORY)

Before executing, you MUST present the research plan and let the user confirm or adjust. Use `AskUserQuestion` with these questions:

**Question 1 — Mode selection:**
Show the recommended mode (based on heuristic) and let user pick. Include estimated agent count and cost.

```
"Which research depth? I recommend [X] based on your query."
Options:
- low: 2 langs (EN+ZH), 2-3 iterations/agent, ~2-4 agents
- medium: 2 langs (EN+ZH), 3-5 iterations/agent, ~4-6 agents
- high: 3 langs (EN+ZH+RU), 5-8 iterations/agent, ~6-12 agents
- max: 3+ langs, 8-10 iterations/agent, ~9-15+ agents
```

**Question 2 — Sub-topics:**
Show the decomposed sub-topics and let user add/remove/adjust.

```
"I've broken this into [N] sub-topics. Adjust?"
Options:
- Looks good (Recommended)
- [list each sub-topic so user can see what will be researched]
- Let me customize (user types their own breakdown)
```

**Question 3 — Languages:**
Show which languages will be searched, based on the language matrix lookup.

```
"Which languages to search?"
Options:
- [Recommended set based on mode + matrix, e.g. "EN + ZH + RU (Recommended)"]
- EN + ZH only (faster, fewer agents)
- Add [specific T2 language from matrix, e.g. "DE" or "JA"]
- Let me specify
```

After user confirms, proceed to Phase 2 with the confirmed settings.

**Skip Phase 1 ONLY when:** user explicitly specified all parameters (mode + topics) in their original message, e.g. `/lead-researcher high compare A vs B`.

### Phase 2: Plan (YOU do this — don't delegate)

1. **Apply confirmed settings** — use mode, sub-topics, and languages from Phase 1
2. **Read `references/language-matrix.md`** — look up T1/T2 languages for the topic's field (if not already done in Phase 1). This determines which languages to assign beyond the EN+ZH default.
3. **Identify elite forums per language** — see "Elite Forum Targeting" below. Include `site:` targets in agent prompts.
4. **Decompose** — break topic into sub-questions using structured decomposition (see below)
5. **Assign agents** — each agent gets **1 language + 1 sub-topic** (atomic, single responsibility). Use T1 languages from the matrix as primary assignments; add T2 languages in higher modes.
6. **Set iterations** — per confirmed mode
7. **Set output path** — relative to current working directory: `./research/YYMMDD-<topic>/`

**Structured Decomposition (MANDATORY for medium+ modes)**

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

**Agent assignment: 1 language + 1 sub-topic per agent (atomic)**

Each agent has a single, clear job. If you have 2 sub-topics and 3 languages, that's 6 agents — batch into waves of 3.

Example for "compare auth solutions" in high mode:

```
Wave 1 (parallel):
  Agent 1: EN + "OAuth/OIDC providers comparison"
  Agent 2: ZH + "OAuth/OIDC providers comparison"  
  Agent 3: RU + "OAuth/OIDC providers comparison"

Wave 2 (parallel):
  Agent 4: EN + "self-hosted auth libraries"
  Agent 5: ZH + "self-hosted auth libraries"
  Agent 6: RU + "self-hosted auth libraries"
```

For simpler topics (low/medium), fewer sub-topics = fewer agents:

```
Low mode (1 sub-topic, 2 langs):
  Agent 1: EN + the question
  Agent 2: ZH + the question

Medium mode (1-2 sub-topics, 2 langs):
  Agent 1: EN + sub-topic A
  Agent 2: ZH + sub-topic A
  (wave 2 if needed for sub-topic B)
```

### Elite Forum Targeting (MANDATORY for high/max, RECOMMENDED for all)

Generic web search favors SEO-optimized sites over niche/elite communities where real expertise lives. You MUST include elite forum targets in agent prompts.

**How it works:**
1. Read `references/elite-forums/overview.md` for the validated forum reference (or use the table below as quick-reference)
2. For each assigned language, pick 2-4 elite forums relevant to the topic
3. Include them as `site:` search instructions in the agent prompt
4. Also read `references/elite-forums/content-farms.md` to know what to deprioritize
5. The forum list is a **starting point** — agents should discover more via search

**Starting-point forums** (research-validated June 2026 — full details in `research/elite-forums/`):

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

### Phase 3: Delegate (Parallel Subagents — low/medium only)

For high/max mode, use the workflow engine above instead of this phase.

Spawn `gatherer` agents. Each prompt:

```
Research: [1 specific sub-question]
Language: [1 assigned language — search ONLY in this language]
Iterations: [N] (min [X], max [Y] — each = search + fetch + evaluate)
Output: Return findings as structured data, NOT a formatted report

Elite forum targeting: Include at least 2 site:-targeted searches on these forums:
[list 2-4 forums from the table above for this language]
Also discover additional niche forums via "[topic] 论坛 社区 精华" queries.
Prioritize elite/niche communities over content farms.

Scope: ONLY [sub-topic]. Do NOT investigate [other sub-topics].
Report path: [./research/YYMMDD-topic/lang-subtopic.md]

RECOMMENDED SKILLS: gather - use for search-fetch loop methodology
```

**Max 3 agents per wave.** Fire all in a single message.

### Phase 4: Reflect & Deepen (YOU do this after agents return)

After agents return, YOU assess coverage and deepen gaps. This is structured reflection, not ad-hoc checking.

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
| **Contradictions** | Do agents disagree on facts? | Investigate primary source — one is wrong |
| **Non-diagnostic findings** | Does a finding support ALL options equally? | Deprioritize — it doesn't help decide (ACH principle) |
| **Missing failure modes** | Did any agent cover what goes WRONG? | Search GitHub Issues, forums for real-world pain |
| **Recency** | Are recommended tools still maintained? | Check last commit, last release date |
| **Refutation test** | What would DISPROVE the emerging recommendation? | Search for that evidence — if absent, recommendation is robust |
| **Composition** | Do recommendations work together or conflict? | Test the combination, not just individual parts |

**Step 3: Gap-Targeted Deepening**

If coverage assessment shows gaps:
- Spawn 1-2 targeted agents to fill specific gaps (not broad re-search)
- Use refined queries informed by what was already found
- Focus on the failure-mode and refutation checks — these are highest value

This phase separates surface search from real research. NEVER skip.

### Post-Workflow Verification (MANDATORY — workflow mode only)

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

**Citation Format (MANDATORY):**

Every case study and data claim MUST include source URL inline:
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
| More than 3 agents per wave | Batch into waves |
| Researching vague/unscoped requests | Route to heavy-think first (Phase 0 triage) |
| Using heavy-think for every multi-part topic | Only fire when *framing* is contested, not when a clear topic has parts |
| Blurring Phase 0 and Phase 1 | Phase 0 = "is this researchable?" Phase 1 = "confirm my plan parameters" |
| Skipping elite forum targeting | Generic search surfaces content farms. MUST include `site:` targets in agent prompts |
| Dropping contradictions/warnings in synthesis | Extract ALL structured fields (findings + key_insights + contradictions). Shallow extraction = incomplete report |
| All workflow agents on same model | Use `model: 'sonnet'` for gatherers/cross-checkers, `model: 'opus'` ONLY for synthesis |
| Synthesis has 0 citations | Raw reports have URLs → synthesis MUST preserve them inline. 0 citations = failed synthesis |
| No budget guards in workflow | Add `budget.remaining()` checks before cross-check and synthesis phases |
| Elite forums not in workflow prompt | The table is in THIS skill but doesn't auto-transfer — MUST paste forum list into each agent prompt |
| Trusting workflow output without verification | ALWAYS check if synthesis agent actually ran vs returned spend-limit error |

## Related

- [gather skill](../../skills/gather/SKILL.md) — methodology loaded by each agent
- [language-matrix.md](../../skills/gather/references/language-matrix.md) — field-to-language mapping
- [elite-forums overview](references/elite-forums/overview.md) — validated forum reference (161 forums, 8 languages)
- [content-farms](references/elite-forums/content-farms.md) — sites to deprioritize per language
- [landscape-notes](references/elite-forums/landscape-notes.md) — per-language ecosystem insights
- [forager skill](../forager/SKILL.md) — BETA iterative research with goal-directed steering (separate system, not integrated)
- [adaptive-research spec](references/adaptive-research/overview.md) — target redesign: gather/reason split, adaptive-depth loop, control rod, Phase 0 budget
