---
name: prompt-architect
description: "Creates, improves, or compresses prompts and agent instructions: Claude Code skills (SKILL.md and its reference files), system prompts, agent and persona definitions, Claude Project instructions, CLAUDE.md and rule files, and the criteria a judge or reviewer scores against. Use when the user wants a prompt or skill written, reviewed, fixed, shortened or ported to a newer model, an agent's behavior defined, or evaluation criteria built — including when they paste a prompt with no instruction."
---

# Prompt Architect

Write the shortest prompt that makes the target model do the job well. Ground it in how
practitioners in the domain actually work, and test it before calling it done.

## Principles

- **Output first, length second.** Judge a prompt by what it makes the model produce. Diagnose from real outputs: run it on 2–3 real tasks, read what goes wrong, and fix those failures. Weigh length only after the outputs are as good or better; a shorter prompt with equal output is a cost win, never the goal. When you compare versions, make them differ in what they make the model do: two near-identical prompts measure noise.
- **Claude is already smart.** Add only what it lacks: domain knowledge, the user's context and preferences, the field's standards, and hard constraints. Every line costs tokens on every use, and an always-loaded file (CLAUDE.md, rules, skill descriptions) costs them in every session.
- **Explain why, not MUST.** A reason lets the model generalize to cases you didn't list. ALL-CAPS urgency is a sign a reason is missing. Keep firm rules for real hazards, and still give the reason.
- **Match freedom to fragility.** Judgment work gets lenses and goals. Fragile operations (migrations, file formats, publishing) get exact steps or a script.
- **Lenses over checklists**, with two exceptions: where the field has a written standard for judging work (use it through the criteria block), and fragile operations.
- **Design inside the given environment.** Build the prompt on the tools, data and channels the brief names. When a safe design needs something missing (a signed-in identity, a handoff tool), first make it work with what exists, then list the missing piece as an assumption; don't make the prompt depend on it. Put hard limits where they bite: as preconditions on the tool call they guard, with real values or a clearly marked one to fill in.
- **Preserve domain depth.** Compress only into a term an expert would accept as equivalent. Cut what is stale or what the model already does unprompted.
- **Write for current models.** Don't ask the model to think step by step or to write its reasoning in the response or in tags: thinking is built in, and Opus 5+ may refuse reasoning extraction. A request that only contains such a line can be refused too, even when the job is to edit it, so quote it by description ("the line asking for reasoning in tags"), not verbatim. Don't add blanket "double-check" or verification steps: current models (Opus 5+, GPT-6, Gemini 4) test on their own, and extra checks over-verify. That rule is about the model re-reading itself; a check by a tool outside the model (a test suite, a script, a validator) still belongs in the prompt. When the target model is named, read its vendor's prompting page.
- **Steer the model's lean, which differs by model.** Opus 5+ can widen a task, so state the scope. GPT-6 Astra stops early and asks often, so define "done" and say which actions need no approval. Old "always ask first" text written for over-eager models makes newer models stall. Write the behavior for the model that will read it (`references/building-blocks.md`, Agent harness blocks).
- **Method, not vocabulary.** A role or expert name changes the words, not the work: "models often switch vocabulary without actually switching methods" (Rieseberg). Name the expert's instruments and raw material (a profiler, the raw logs, the regulator's form), and say how to use them.
- **Order for the cache.** Static content first (role, rules, tools, examples), then session context, then the per-call request, date and IDs. A timestamp or ID near the top makes everything after it miss the prompt cache, and that cost is paid on every call.

## Workflow

1. **Classify the target** with the table below, and read its reference.
2. **Clarify.** Ask at most one question, the one that would most change the output. Otherwise state your reading ("I'll assume X; redirect me if wrong") and go on. Never ask what you can infer or find.
3. **Research** when you create anything domain-specific, or when an existing prompt has domain gaps: what practitioners do, how comparable production prompts are built, and, for any judge or reviewer, the field's standard. Use `references/research-guide.md`; it is done when you have findings, not plans. For a real research pass use the `lead-researcher` skill. Skip it for structure-only fixes or when the user gave all the context.
4. **Write the evals first** for anything that will be reused: 2–3 realistic prompts a user would type, and what a good result does. They show what the prompt must fix, and they are the test in step 6. For each assertion, note whether a script can check it.
5. **Build** the target's shape (table), with only the techniques its gaps need (Technique selection). When the prompt's task has a measurable result, give it a target, a judge outside the model ("Don't change this check"), and the line "If you miss, report the miss with the real output; that is a good result." For more depth, use `/ambition rewrite`.
6. **Test.** Run the evals with the new prompt and with a baseline (no prompt, or the old version), in subagents when available, and compare. A script is the judge only for what it measures directly (a validator passes, a test runs, a total matches). Quality that a keyword count only approximates (novelty, writing, judgment, fitness for the user) goes to a blind LLM judge on the strongest model available, shown each pair in both orders, with a verdict counted only when both orders agree. Never your own reading. Report which kind of judge each result came from. For a skill, also run Anthropic's validator (`references/skills.md`). If you can't run them, say so: `Not tested: <why> — risk: <what could break>`.
7. **Deliver.** Put the prompt in one code block, or write the files. Under it, add short notes: assumptions, what changed and why, the test result with its judge, and one **Next rung** line (a prompt → a skill with evals → an agent that runs unattended with a judge), naming the access that rung needs.

## Target types

| Target | Shape | Read |
|--------|-------|------|
| Skill (SKILL.md + references) | Frontmatter whose description says what and when; a concise imperative body that explains why; progressive disclosure | `references/skills.md` |
| CLAUDE.md, rules, Project instructions | Short imperative rules with reasons; loaded every session, so every line must pay | `references/skills.md` (always-loaded files) |
| Agent system prompt | Role sentence, context, goals, tools and autonomy, boundaries; a soul when the agent's judgment needs one | `references/building-blocks.md` |
| Persona or character | Soul and voice | `references/building-blocks.md` |
| Task prompt | Objective, inputs, output spec, examples when the format is unusual | `references/building-blocks.md` |
| Judge, reviewer, grader | Criteria block from the field's standard | `references/criteria.md` |

**When to use a soul.** A soul (identity, tensions, instinct, commitments, boundaries) is for agents and personas whose identity changes their decisions: an autonomous agent that makes judgment calls, an advisor with a point of view, a character. Leave it out of skills, task prompts and rule files. A skill is guidance that the running agent loads, and that agent already has an identity. One role sentence is enough to set focus and tone, and personas alone don't improve accuracy on objective tasks (Zheng et al., arXiv 2311.10054).

## Modes

| Input | Mode | Steps |
|-------|------|-------|
| "Create a prompt/skill for X" | Create | All |
| "Improve this: …", or a pasted prompt alone | Enhance | Run it on 2–3 real tasks first (or ask for real outputs) and list what goes wrong; fix those. Skip 2 if clear; 3 only for domain gaps |
| "Compress/shorten this" | Compress | Compression rules only (`references/expertise-transfer.md`); report each term that replaced text. Check the outputs did not get worse; a recap or checklist that repeats rules can be what holds behavior, so cut it only when the outputs hold without it. The output must be shorter: add no rules, reasons or examples the input lacked, and never invent a reason; put improvements as suggestions under the file, not in it. When evals exist, cut by ablation: remove one group at a time and rerun |
| "Tune this for quality / cost / both" | Tune | Run old and new on the same evals, then decide with the rule in Tune (below) |
| "Port this to <model>" | Migrate | Read the model's prompting page; remove scaffolding it no longer needs; re-tune guardrails to the new model's lean; drop API habits it rejects (`references/building-blocks.md`, Model notes) |
| Unclear | Ask | Step 2 only |

**Tune** decides every comparison, not only Tune requests. Quality first, then cost, and watch the ratio between them.
- **Measure quality** with the blind judge from step 6. **Measure cost** as what a run spends: tokens and tool calls per run (read them from the run's usage report), agents spawned, wall time, and for always-loaded text the characters loaded every session. For an orchestrator, its planned agents and token ceiling are the cost of the run it starts.
- **Goal `quality`** (the default): the better output wins. Cost breaks ties, and a gain that costs 2× or more is reported with the ratio for the user to decide, not shipped.
- **Goal `cost`:** cut cost while quality holds: no lost pair on held-out tasks, judged in both orders.
- **Goal `both`:** keep a change that is no worse on either; when one goes up and the other down, report both numbers and the ratio, and let the user choose.
- The 2× line is a default; use the user's line when they give one.

**In Enhance mode**, keep what works: role, structure, constraints, mental models, domain depth. If the input has a role, the output keeps one.

## Diagnosis

Start from outputs: what does the prompt make the model do wrong on real tasks (wrong size, wrong sources, missed constraints, invented facts)? Each output failure points to a gap below. Text features (length, ALL-CAPS, structure) are suspects, not findings, until an output shows the harm.

Look for these gaps:
- Vague objective: no success criteria.
- Missing boundaries: everything allowed.
- Procedures without insight: steps, no why.
- Generic language ("be professional").
- Over-specified patterns: checklists where judgment is needed.
- Monologic reasoning: competing positions listed, never argued.
- Stale domain knowledge.
- Missing context engineering for long-running or tool-heavy agents.
- Missing grounding: the agent has tools but answers without stating assumptions or checking current facts.
- Missing domain criteria: the agent judges with generic "quality" words while the field has a written standard.
- Legacy scaffolding: step-by-step prose, reasoning in tags, blanket double-checks, ALL-CAPS, "be conservative, only report X" filters that make current models under-report.
- Guardrail drift: "ask first" repeated in many places, no line on which actions are safe, no definition of "done". Newer models stall on these.
- Role without method: an expert title, but no instruments, raw material or outside check.
- Label tone: "friendly", "professional" with no writing choices behind them.
- Cache-hostile order: dates, IDs or user data above the static rules.
- Skill structure: the description lacks "when" or triggers on a whole domain ("anything database"), the body is over 500 lines, references are nested more than one level, or the frontmatter has keys the target platform rejects.

## Technique selection

| Technique | Apply when | Skip when |
|-----------|-----------|-----------|
| Soul (with tensions) | Agent or persona whose identity drives judgment | Skills, task prompts, rule files, tasks with a clear right answer |
| Mental models | Domain judgment needed | Mechanical task |
| Thinking approaches | Decisions with no clear rules | Rule-based task |
| Anti-patterns | High stakes, known failure modes | Low-risk task |
| Criteria | The agent judges, reviews, grades or selects, or must meet a standard | Open creative work, mechanical tasks |
| Few-shot examples | Unusual format or style that is hard to describe | A taxonomy exists, or the format is obvious |
| Taxonomy reference | A standard classification exists | Novel domain |
| Structured output | Output gets parsed | Freeform is fine |
| Context engineering | Long-running, multi-turn, tool-heavy agents | Single-turn prompts |
| Execution phases | Order really matters (confirm jurisdiction before searching case law) | Otherwise state outcome, constraints and how to check; current models plan on their own |
| Step-by-step reasoning prose | Only non-reasoning, non-Claude models | Claude: thinking and effort control depth |

## Design tensions

You resolve your own design choices by argument: let the positions collide, and keep what survives. These come up often. Generate the ones the case in front of you raises.

- **Complete vs. concise.** The completist says missing guidance leaves gaps; the minimalist says every extra word dilutes focus. Resolution: add what the model lacks, cut what it knows, and compress only into an equivalent term.
- **Prescribe vs. enable.** The prescriber says exact steps prevent mistakes; the enabler says checklists fail on unlisted cases. Resolution: transfer how experts think. Prescribe only for fragile operations and written standards.
- **Preserve vs. transform.** The preserver says the user's structure has reasons; the transformer says flawed structure keeps flawed thinking. Resolution: keep what works, fix what doesn't, never delete domain knowledge.
- **One file vs. many models.** The sharer says one instruction file keeps every agent consistent; the tuner says a line that stops one model's over-reach makes another stall. Resolution: two layers. Project facts and hard limits are the same for every model, and limits a hook or deny rule can enforce go there, not in prose. The behavior contract (how eager, when to pause, how to write) is per model, in the file that model's harness reads.

## Output format

Pick the format that fits. Claude system prompts: XML tags for sections, markdown inside. Skills: markdown with YAML frontmatter. GPT: markdown, JSON schemas for structured output. Gemini: one delimiter style used throughout, context first and the question last. Unspecified: XML + markdown. Match the user's format when they give one. No fixed template; invent sections as needed. Vendor-specific rules are in `references/building-blocks.md` (Model notes).

## References

- `references/skills.md`: skill authoring rules, frontmatter limits, always-loaded files, the validator and evals.
- `references/building-blocks.md`: soul, mental models, voice, anti-patterns, context engineering, agent-harness blocks, model notes (Claude, GPT-6, Gemini 4), execution phases, transformations.
- `references/criteria.md`: the criteria block for judges and reviewers.
- `references/expertise-transfer.md`: transfer order, compression rules, worked examples.
- `references/research-guide.md`: what to retrieve and how to synthesize.
- `web/claude-project-instructions.md`: this skill as one file for claude.ai Project instructions. Keep it in sync when this skill changes.

## Tests

Before delivering, check:
- **Expert test:** would a practitioner say "yes, that's how I think"?
- **Token test:** does every line add something the model lacks?
- **Compression test:** did I replace text with an equivalent term, or just delete it?
- **Taxonomy test:** do the examples map to a known classification? Then reference it.
- **Grounding test:** if the agent has tools and serves ambiguous requests, does the prompt say what must be true before it answers?
- **Criteria test:** if it judges work, do its criteria come from the field's standard, with source and version, the standard's scoring method and observable anchors?
- **Current-model test:** no reasoning extraction, no blanket verification, no unexplained ALL-CAPS, scope stated, "done" defined, safe actions named once.
- **Method test:** does each named expert or role come with the instruments and raw material it uses?
- **Skill test:** for a skill, it passes the validator, and its description says what and when.
- **Eval test:** did it beat the baseline on the evals from step 4?
- **Enabler test:** can the agent handle a situation you didn't list?
