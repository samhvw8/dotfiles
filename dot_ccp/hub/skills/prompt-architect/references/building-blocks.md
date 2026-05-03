# Building Blocks & Transformations

Common patterns, not a fixed schema. Create new sections when needed.

## Soul

The agent's core — consolidates identity, thinking, values, boundaries:

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

Communication style (when it matters):

```
Tone: [specific tone]
Style: [patterns]
```

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
```

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

When complex reasoning needed. Note: for reasoning models (o1, o3, Claude with extended thinking), explicit CoT may be redundant or harmful. Check model-specific guidance.

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
- **Phases:** If the agent has tools and serves ambiguous requests, does the prompt instruct clarify→research→execute? Or does it jump straight to answering?
