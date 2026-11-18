# Planning phases 0-2

Part of the [lead-researcher skill](../SKILL.md). Read this when you triage a request, pick the venue, write the Phase 1 plan message, choose the source stack, or decompose the topic.

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

**Open-ended / iterative-expansion queries** (signals: "explore", "investigate", "what should we know about", "deep dive", no clear success criteria) are handled **natively** by the loop's CONTROL brain ([forager](forager/overview.md)), which runs full reflect + steer + topic expansion for them.

Single-fact lookups ("what's the latest stable React", "is Y deprecated") are not research — answer them with one web search (Parallax `web_search`: `mcp__claude_ai_Parallax__web_search` in Claude Code, `parallax call web_search` in `omp` and agy; or `web_search` / `WebSearch`) and leave this skill.

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
| User said "team research" / "research with me" / `team` arg | → **Team venue** ([team-research](team-research.md)) — skip the question |
| Researchable, and live steering would help (exploratory, multi-step) | Ask one yes/no: *"Run as **live Team Research** — 2–3 gatherers and a verifier work in visible sessions while I steer them round by round and you watch and redirect? Or run it normally?"* |
| Otherwise | Inline or Workflow venue, as the brain picks |

Yes → Team venue (still do Phase 1 planning first). Run it from the main session, so Sam sees the sessions and the lead steers them. Transport: harness-ops sessions through the `agent-ops` skill; in `omp`, named `task` items with `write agent://<id>`.

### Phase 1: Confirm Research Plan with User

Before executing, present your research plan and let the user confirm or adjust. Keep it lightweight — one message, not 4 separate questions. Write it after the Phase 2 decomposition, language assignment ([language-choice](language-choice.md)) and sizing ([sizing](sizing.md)), so the message shows the plan you would actually run:

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
- The Size line's arithmetic is right (squad members summed over assignments = agents; the estimate comes from the formula in [Size the plan](sizing.md#size-the-plan-to-the-decision)), and the ceiling is not below the estimate.
- The message and the internal plan use the same numbers: agents, ceiling, saturation threshold, languages.
- The Sources line matches the squads: if GitHub is out, no slice searches it and the lead prompts drop the `gh search` line.
- Every assignment's language has a reason, and every sub-topic traces to the request.

**Skip Phase 1 ONLY when:** user explicitly specified the target and sub-topics clearly, e.g. "compare Prisma vs Drizzle for PostgreSQL ORM."

### Phase 2: Plan (YOU do this — don't delegate)

1. **Apply confirmed settings** — use sub-topics, languages, and source stack from Phase 1
2. **Read `references/language-matrix.md`** — look up T1/T2 languages for the topic's field (if not already done in Phase 1). This determines which languages to assign beyond the EN + ZH + ZH-TW default.
3. **Identify elite forums per language** — see [Elite Forum Targeting](elite-forum-targeting.md). Include `site:` targets in agent prompts.
4. **Decompose** — break topic into sub-questions using structured decomposition (see below). Every sub-question stays inside the request (Scope, below)
5. **Assign agents** — each assignment gets **1 language + 1 sub-topic** (atomic, single responsibility) and runs as a squad. Put a language only on the sub-questions where it has evidence to add ([Language per sub-question](language-choice.md#language-per-sub-question)). Use T1 languages from the matrix as primary assignments; add T2 languages when the topic is broad or T1 coverage comes back thin.
6. **Size and budget** — check the assignment count against the decision, and compute the ceiling from it ([Size the plan](sizing.md#size-the-plan-to-the-decision))
7. **Iterations** — none preset; the brain stops on saturation (Phase 4)
8. **Set output path** — relative to current working directory: `./research/YYMMDD-<topic>/`

Steps 4–6 ([language-choice](language-choice.md), [sizing](sizing.md)) come before the Phase 1 message, because that message shows their result; after the user replies, apply what they changed.

**Terms used below:** an **assignment** is 1 sub-question × 1 language. A **squad** is the agents that run one assignment: a full squad is 5 (sonnet lead, 3 haiku slices, haiku opener; [gather-squad](gather-squad.md)). **Agents** = the sum of squad members. Keep the three apart in the plan; mixing them up is how a plan ends up with a ceiling for 12 agents and 60 agents to run.

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

### Source Priority — Decided at Runtime

Do **NOT** hardcode which sources to use (no "always GitHub" rule). The source stack — **including whether GitHub is searched at all** — is chosen at runtime and **confirmed with the user** in Phase 1 (the Sources line of the plan). Recommend a stack based on the topic, but the user decides.

What stays constant regardless of stack: rank practitioner/primary signal above SEO content farms — 1) elite forums / practitioner communities ([elite-forums](elite-forums/overview.md)) → 2) primary/official sources → 3) high-value analysis → 4) blogs/tutorials (verify) → deprioritize 5) content farms.

The menu of source types to pick from (with how to query each): [source-types](source-types.md).

**Inject the user-confirmed source stack into every workflow prompt** — workflow agents can't see Phase 1. Agents returning only blog/vendor sources are incomplete.
