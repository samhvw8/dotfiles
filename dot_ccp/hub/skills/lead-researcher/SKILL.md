---
name: lead-researcher
description: "MANDATORY entry point for ALL research tasks. Orchestrates researcher agents with configurable depth modes (low/medium/high/max). Determines languages, iterations, agent count, and sub-topics — then spawns parallel researcher agents and synthesizes results. Triggers: any research request, 'research X', 'what's the best', 'compare X vs Y', 'how should I approach', 'evaluate X', 'deep research', 'comprehensive analysis'. ALL research goes through lead-researcher first — never spawn researcher agents directly. Arguments: [mode] [topic] — e.g. 'high compare auth solutions' or 'max full ecosystem survey of MCP servers'."
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
| **high/max** | Dynamic Workflow | 16 concurrent agents, cross-checking, resumable, results stay out of context |

### How to trigger a dynamic workflow

After Phase 1 confirms high/max mode, tell the user:

> "This is a high/max research — I'll run it as a dynamic workflow for better parallelism and cross-checking."

Then describe the research task with the word **"workflow"** in your message to trigger the workflow engine. Include ALL the planning details (sub-topics, languages, iterations, output path) so the workflow script encodes them.

Example trigger prompt:

```
Run a workflow to research [topic]:

Phase 1 — Parallel search (per language × sub-topic):
[list each agent assignment: language + sub-topic + iterations]

Phase 2 — Cross-check:
Have independent agents adversarially review each other's findings.
Flag contradictions, unverified claims, and missing sources.

Phase 3 — Synthesize:
Merge verified findings into one report at [output path].
Lead with recommendation, present cross-language tensions, cite sources.

Language matrix reference: [paste relevant T1/T2 langs from matrix]
Each agent should use the `research` skill for search-fetch loop methodology.
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
4. **Decompose** — break topic into sub-questions (use confirmed sub-topics from Phase 1)
5. **Assign agents** — each agent gets **1 language + 1 sub-topic** (atomic, single responsibility). Use T1 languages from the matrix as primary assignments; add T2 languages in higher modes.
6. **Set iterations** — per confirmed mode
7. **Set output path** — relative to current working directory: `./research/YYMMDD-<topic>/`

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
1. For each assigned language, identify 2-4 elite forums relevant to the topic
2. Include them as `site:` search instructions in the agent prompt
3. The forum list is a **starting point** — agents should discover more via search

**Starting-point forums** (not exhaustive — discover more per topic):

| Language | Elite/niche communities | Content farms to deprioritize |
|----------|------------------------|-------------------------------|
| ZH | V2EX, 看雪 (kanxue.com), 52pojie.cn, linux.do, 掘金 (juejin.cn), 知乎专栏 | CSDN reposts, 百家号 |
| RU | Habr, 4pda.to, overclockers.ru, ixbt.com | Zen.yandex reposts |
| EN | Hacker News, lobste.rs, specialized subreddits | Medium clones, content farms |
| VN | tinhte.vn, voz.vn, daynhauhoc.com | |
| JA | Qiita, Zenn, teratail | |
| KO | GeekNews, velog.io, okky.kr | |

**For topics involving reverse engineering, anti-bot, or security:**
Add 看雪 (kanxue.com), 52pojie.cn, Hostloc, NodeSeek for ZH.

### Phase 3: Delegate (Parallel Subagents — low/medium only)

For high/max mode, use the workflow engine above instead of this phase.

Spawn `researcher` agents. Each prompt:

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

RECOMMENDED SKILLS: research - use for search-fetch loop methodology
```

**Max 3 agents per wave.** Fire all in a single message.

### Phase 4: Deepen (YOU do this after agents return)

After agents return, YOU verify and deepen:

| Check | Action |
|-------|--------|
| **Contradictions** | Two agents disagree? Investigate — find the primary source |
| **Unverified claims** | Agent cited a blog? Verify against official docs or source code |
| **Missing user experience** | Search GitHub Issues, Reddit, forums for real-world reports |
| **Recency** | Check last commit, last release — is it maintained? |
| **Composition** | Do recommendations work together or conflict? |

This phase separates surface search from real research. NEVER skip.

### Phase 5: Synthesize

Merge into one report at `./research/YYMMDD-<topic>.md` (relative to cwd):

1. **Lead with recommendation** — what and why
2. **Cross-language tensions** — where communities disagree
3. **Cite primary sources** — every claim links to a fetched URL
4. **List contradictions** — present honestly
5. **Unresolved questions** — what couldn't be answered

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

## Related

- [research skill](../../skills/research/SKILL.md) — methodology loaded by each agent
- [language-matrix.md](../../skills/research/references/language-matrix.md) — conditional languages
