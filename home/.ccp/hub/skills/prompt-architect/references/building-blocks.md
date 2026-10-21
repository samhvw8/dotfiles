# Building Blocks & Transformations

Common patterns, not a fixed schema. Create new sections when needed.

## Contents
- Soul (agents and personas only)
- Mental models, thinking approaches, voice, anti-patterns
- Context engineering
- Agent harness blocks (scope, autonomy, hard limits, escalation, done, long runs, priority, instruments)
- Model notes (Claude, GPT-6 Astra, Gemini 4 Argon)
- Execution phases
- Few-shot examples, chain-of-thought, custom sections
- Key transformations
- Validation

## Soul

For agents and personas whose identity drives their decisions. Not for skills, task prompts or rule files: there, a one-line purpose or role is enough. The soul consolidates identity, thinking, values and boundaries:

```xml
<soul>
<identity>
You are [specific identity].
</identity>

<thinking_style>
You think by [how the agent processes decisions].
</thinking_style>

<tensions>
Generate tensions dynamically based on domain. Each tension:
- 2-5 personas with genuine opposing positions
- The collision: insight that emerges from argument

**[Tension Name]**
- [Persona A]: [Position] — [reasoning]
- [Persona B]: [Counter-position] — [reasoning]
- [Persona C...]: [Additional poles when needed]
- The collision: [Insight from argument]
</tensions>

<instinct>
[The principle that guides when rules don't apply]
</instinct>

<commitments>
Always: [must do]
Never: [must not]
When [condition]: [behavior]
</commitments>

<boundaries>
Handles: [what this role owns]
Escalates: [what exceeds scope]
</boundaries>
</soul>
```

## Mental Models

How experts SEE — lenses, not checklists:

```
**[Model Name]**: [Conceptual frame]
- Reveals: [what becomes visible]
- Tension: [fundamental tradeoff]
```

## Thinking Approaches

How experts REASON — questions, not procedures:

```
- [Question]: [why it matters]
```

## Voice

Communication style (when it matters). Describe the writing choices, not a label: "friendly" and "empathetic" mean different things to different models.

```
Tone: [what the writing does: how directly it states the answer, when it acknowledges a problem, whether reassurance or a sign-off belongs]
Style: [patterns]
Short answers keep: [the facts, decision, caveat and next step that must survive]; cut first: [intro, repetition, generic reassurance]
```

Length targets ("write 2,000 words") are followed loosely, and Gemini 4 ignores them. Ask for named sections, each with its own limit.

## Anti-Patterns

Traps to avoid (when mistakes are costly):

```
**[Mistake Name]**
The trap: [why smart people fall in]
The correction: [principle]
```

## Context Engineering

When agents need to manage their information environment:

```
**Token Budget**: [how the agent should manage context window]
**Memory Strategy**: [what to persist vs. discard across turns]
**Tool Context**: [how tool outputs feed back into reasoning]
**Retrieval Triggers**: [when to fetch external knowledge vs. reason from context]
**Cache Order**: static first (role, rules, tool list in a fixed order, examples), then session context, then per-call data (request, date, IDs)
```

Prompt caching matches the prompt from its start, so anything that changes per call (a timestamp, a user ID) placed early makes everything after it miss the cache. Gemini 4 Argon has only implicit caching, so order is the whole cache strategy there. To check: run the same call twice and read the cached-token count in the usage data.

## Agent Harness Blocks

Behaviors that current models need steering on. Add a block only when the target model and the use case call for it, and adapt the wording. Sources: Anthropic's prompting docs, OpenAI's "Using GPT-6" guide, Google's Gemini 4 Argon developer guide; re-check the target model's page. Write each rule once, in one place: repeating "ask first" in several sections makes a model ask before safe actions too.

**Scope** (Opus 5+ can widen a task):
```
Deliver what was asked, at the scope intended. Make routine judgment calls yourself, and check in only when different readings of the request would lead to materially different work. If the request seems mistaken, say so in a sentence and continue with the task as asked.
```

**Autonomy by request type** (one compact policy instead of scattered "ask first" lines):
```
For requests to answer, explain, review, diagnose or plan: inspect what's relevant and report. Don't implement unless asked.
For requests to change, build or fix: make the in-scope local changes and run the relevant non-destructive checks without asking.
Confirm first only for: external writes, destructive or hard-to-reverse actions, purchases, and a material expansion of scope. Do the preparation first, so the approval is for a concrete, reviewable result.
```
Name the safe local actions for the environment (read files, inspect logs, edit in-scope code, run the local tests). Never bypass a safety check to get past an obstacle.

**Hard limits on a tool** (refunds, deletes, sends): write the limit as a precondition of that tool call, with real values: "Call issue_refund only when the order is found, the amount ≤ the paid total and ≤ <limit>, and the customer confirmed this order and amount in this conversation."

**Escalation and sensitive data** (customer-facing agents): list the concrete triggers, not one catch-all line ("hand off when: the customer asks for a human; a legal or safety threat; a refund above <limit>; the same issue fails twice"). Name the data the agent must never ask for or repeat (passwords, OTP codes, full card numbers, CVV), and say what to do when a user offers it.

**Definition of done** (GPT-6 Astra stops at a first draft; long runs in general):
```
Done means: the change is implemented, it runs, you inspected the result, and you fixed what failed. Don't stop for review after a first version unless the task says so. Stop and ask only for: [the decisions that are really the user's].
```

**Before a long run** (Gemini 4 Argon, unattended agents): agree on the goal, edge cases and the success check first; confirm the needed tools and docs are reachable; then run to the agreed target without turn-by-turn prompting. When no check exists, have the model write one (a script that records a baseline score) and loop against it.

**Instruction priority** (many skills and rule files loaded):
```
The user's explicit instructions take precedence over a skill's guidance.
```
To find silent conflicts once (an audit prompt, not a standing rule): "If a skill or rule file makes you pause, ask, or diverge from the request, quote the exact line and file, and say whether it is an explicit requirement or your reading of it."

**Instruments and raw material** (any prompt with an expert role):
```
Work from [the raw source: logs, exports, the regulator's text], not summaries of it.
Use [the field's instruments: a profiler, a statistical test, the official checklist], and show each one's output.
```
Test: if you delete the role sentence, does the work the prompt asks for change? If not, the role was vocabulary only.

**Length** (Opus 5 writes long by default; effort doesn't shorten visible text):
```
Keep responses focused and brief; spend most of the response on the main answer.
```

**Progress updates** (agentic runs; Opus 5 narrates a lot, Fable 5.1 too little):
```
Before your first tool call, say in one sentence what you're about to do. While working, update only when you find something important or change direction. When done, lead with the outcome.
```

**Subagents** (Opus 5 delegates readily):
```
Delegate only large, independent, parallel work. Do work you can finish in a few tool calls yourself, and don't use subagents to double-check your own work.
```

**Reviews** (the model follows "only report high-severity" literally and under-reports):
```
Report every issue you find, with a severity and your confidence; filtering happens later.
```

Don't add: "think step by step", reasoning written in the response or in tags (may be refused as `reasoning_extraction`), "double-check your answer" (over-verification), or ALL-CAPS urgency.

## Model Notes

Each model leans a different way. Write the behavior contract for the model that reads it.

| Model | Leans toward | Steer with | API habits it rejects |
|-------|-------------|-----------|-----------------------|
| Claude Opus 5+ | Widening scope, long answers, delegating readily | Scope, Length, Subagents blocks | Reasoning written in tags; prefill on some models |
| GPT-6 Astra | Asking and pausing, stopping at a first version, heavy markdown and stock phrases, under-delegating; very literal about skill and AGENTS.md text | Autonomy policy, Definition of done, Instruction priority, a prose style line, when to use subagents | `temperature`, `top_p`, `top_logprobs` with reasoning on; tool calls outside the Responses API |
| Gemini 4 Argon | Long autonomous runs once aligned; strong orchestrator | Before a long run, a verification loop, context first and the question last | `temperature`, `top_p`, `top_k` (ignored); `thinking_budget` (use `thinking_level`); prefilled model turns (use `response_schema`); explicit caching |

Don't import one vendor's fix everywhere. OpenAI's "no unsolicited warnings or approval flows" cures Astra's caution, but on a model that already over-reaches it removes useful pauses. Google's older Gemini 3 template ends with "think step-by-step"; don't carry that into Claude or Argon prompts.

## Execution Phases

When the output prompt's agent should clarify, research, then act — instead of jumping straight to output:

```xml
<execution_phases>

## Phase 1: Clarify
Before acting, surface assumptions that would change your output.
- If the user's request has ambiguity that would fork your approach, ask ONE focused question
- If you can infer the most likely interpretation, state it and proceed: "I'll assume X—redirect me if wrong"
- Skip this phase when the user's intent and constraints are unambiguous

## Phase 2: Research & Ground
Before applying your expertise, retrieve current knowledge using available tools.
- Use web search, documentation lookup, or knowledge retrieval to ground your response in current facts
- Search iteratively: first-round results inform follow-up queries
- [Customize: specify which tools, what domains to search, how many queries, what sources to prioritize]
- Skip this phase when the task requires only your existing knowledge and no current/external data

## Phase 3: Execute
Apply your core expertise with the clarity from Phase 1 and the grounded knowledge from Phase 2.
- [This is where the agent's soul, mental models, thinking approaches, and domain logic operate]
- Integrate retrieved knowledge into your reasoning—don't just append it
- Flag when retrieved information conflicts with your domain knowledge

</execution_phases>
```

**When to inject into output prompts:**
- The agent has access to tools (web search, APIs, databases, retrieval systems)
- The agent's domain involves rapidly changing information (legal, tech, market, medical)
- The agent operates on tasks where wrong assumptions compound (strategy, architecture, planning)
- The agent serves users who often underspecify their needs

**When to skip:**
- Pure creative/generative tasks (write a poem, design a logo)
- Mechanical transformations (format this CSV, translate this text)
- The agent has no tools available
- Tasks where speed matters more than groundedness

**Customization:** Phase 2 is the most domain-variable. Specify:
- Which tools the agent should use (web search, internal docs, code analysis, database queries)
- How many search rounds (1 for fact checks, 3-6 for research tasks)
- What sources to prioritize (official docs vs. community, primary vs. secondary)
- When to stop researching and start executing

## Few-Shot Examples

When format is unusual AND no standard taxonomy exists:

```xml
<examples>
Input: [example input]
Output: [example output]
</examples>
```

If examples map to known taxonomy/ontology (HTTP codes, sentiment, OWASP, design patterns, SOLID, cognitive biases, logical fallacies, REST maturity model, data classification levels), reference the taxonomy instead.

## Chain-of-Thought

Only for models without built-in reasoning. Claude models think on their own; depth is set by the effort setting. Asking a current Claude model to write its reasoning in the response (or in `<thinking>` or scratchpad tags) is redundant and may be refused. To steer thinking, give a general instruction ("reflect on tool results before the next step"), or a worked example: problem, method, answer.

## Custom Sections

Invent as needed. The building blocks above are common patterns, not constraints.

---

## Key Transformations

**Procedure → Expert Thinking:**
```
Before: 1. Check auth 2. Check validation 3. Check permissions

After:
**Trust Boundaries**: Where the system decides to believe a claim
- Reveals: Where can claims be forged or escalated?
- Tension: Usability vs. verification rigor
```

**Enumeration → Dialectic:**
```
Before: Consider business perspective... technical perspective... balance them.

After:
**Ship vs. Perfect**
- Builder: "Working software now beats perfect software never."
- Craftsman: "Technical debt compounds into 3am debugging sessions."
- The collision: Which shortcuts create learning vs. traps?
```

**Generic → Specific:**
```
Before: "Be professional"
After: Tone: Direct, confident, not hedging | Style: Short sentences, active voice
```

**Verbose → Domain Term (only when equivalent exists):**
```
Before: "Check if the user is who they claim to be, then check if they have permission"
After: "Authenticate, then authorize"
→ Domain terms exist, meaning preserved

Before: Unix 17 Laws with detailed explanations
After: Keep as-is
→ No single term captures this depth
```

**Few-Shot → Taxonomy/Ontology (when standard classification exists):**
```
Before: 4 examples mapping HTTP error codes to user guidance
After: Follow HTTP status code semantics:
  4xx: Client error → Guide user to fix request
  5xx: Server error → Escalate to logs/monitoring
→ Standard taxonomy exists, examples become reference
```

**Flat Instructions → Phased Execution:**
```
Before: 
You are a legal research assistant. Search for relevant case law, analyze 
the user's question, and provide a comprehensive answer with citations.

After:
<execution_phases>
## Phase 1: Clarify
Confirm: jurisdiction, area of law, purpose (academic, litigation, compliance).
If unambiguous from context, state assumption and proceed.

## Phase 2: Research & Ground
Search 3-5 targeted queries: legal issue + jurisdiction, then narrow by 
statutes or landmark cases. Prioritize court databases, legal publishers, 
government sites. Fetch full text when a case is central.

## Phase 3: Execute
Synthesize into structured legal memorandum. Distinguish binding vs. 
persuasive authority. Flag unsettled law or jurisdiction splits.
</execution_phases>
→ Clarifies before wasting research on wrong jurisdiction, grounds in 
  current law instead of hallucinating citations, then applies expertise
```

**Static Prompt → Context-Aware Prompt:**
```
Before: A monolithic system prompt with all instructions front-loaded

After:
- Core identity and constraints: always in system prompt
- Domain knowledge: loaded on-demand via retrieval or skills
- Task-specific instructions: injected per-turn based on user intent
- Tool schemas: included only when tools are relevant to current task
→ Modular context assembly beats monolithic prompts for complex agents
```

## Validation

- **Structure:** Every section earns its place. No redundancy.
- **Content:** Sounds like practitioner, not observer.
- **Soul:** Tensions generated for the specific domain, not copied. Personas actually argue. Collision produces insight.
- **Preservation:** Domain knowledge depth maintained. Detailed frameworks/laws/principles kept intact. Only compressed if equivalent term exists.
- **Research grounding:** Mental models, anti-patterns, and tensions informed by Phase 2 findings, not invented from generic assumptions.
- **Grounding:** If the agent has tools and serves ambiguous requests, does the prompt say what must be true before it answers? Phases are scripted only where order matters.
