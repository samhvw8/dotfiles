# Skill Creation Workflow

End-to-end process for creating Claude Agent Skills. Each skill is a context engineering problem: what information does Claude need, when should it load, and how much freedom should the instructions leave?

For writing principles, read `skill-writing-guide.md`.
For description optimization, read `skill-description-guide.md`.

## 1. Capture Intent

Extract from conversation first — if the user says "turn this into a skill," mine the conversation for workflow, tools, corrections, and output format before asking questions.

Ask only what you can't infer:
- What should this skill enable Claude to do?
- When should it trigger?
- What's the expected output?
- Are outputs objectively verifiable or subjective?

## 2. Research the Domain

Before writing instructions, understand how practitioners actually work:
- Current best practices, tools, frameworks
- Common failure modes and edge cases
- Decision heuristics experts use
- Similar existing skills for structural inspiration

## 3. Draft the SKILL.md

Write in this order:
1. **Quick orientation** — one paragraph on what this does and the approach
2. **Core workflow** — structured by decision points, not rigid steps
3. **Patterns and examples** — illustrate principles with concrete cases
4. **Edge cases** — what could go wrong, how to handle it
5. **Reference routing** — pointers to bundled files if needed
6. **Frontmatter** (write LAST) — description is easier after writing the full skill

**Content quality via prompt-architect:** When the skill body requires soul design, tensions, mental models, anti-patterns, or expertise transfer — invoke `Skill("prompt-architect")`. This skill handles STRUCTURE (frontmatter, directory layout, progressive disclosure, description optimization). The prompt-architect handles CONTENT QUALITY within the body — transforming procedures into expert thinking, designing dialectic tensions, and calibrating freedom to fragility.

## 4. Review

Read with fresh eyes:
- **Token audit**: Every paragraph justifies its context cost?
- **Freedom calibration**: Specificity matches fragility? (Exact scripts for fragile/dangerous ops, principles for judgment tasks)
- **Generalization**: Works for prompts you haven't seen?
- **Smart-Claude check**: Explaining things Claude already knows?
- **Trigger check**: Description covers all intended use cases? Include trigger phrases, timing ("when user says X"), and "NOT for Y" disambiguation.
- **Rationalizations to Reject**: Would the LLM shortcut past any step? Add preemptive defense if so — table with Rationalization | Why It's Wrong columns.
- **When NOT to Use**: Does the skill name specific alternatives for near-miss cases?
- **Before/After examples**: Does each key pattern include concrete before/after to anchor understanding?

## 5. Test Cases

Create 2-3 realistic, messy prompts — how real users actually type:

```
❌ "Extract text from PDF"
✅ "ok so my boss sent me this xlsx file (its in downloads, called 'Q4 sales 
    final FINAL v2.xlsx') and she wants me to add a profit margin column. 
    Revenue is col C, costs col D i think"
```

Run each test, evaluate: Did it trigger? Right workflow? Good output? Wasted steps?

## 6. Iterate

- Generalize from feedback — understand the principle, don't add band-aids
- Keep it lean — if Claude wastes time, remove the instructions causing it
- Bundle repeated work — if every test writes the same helper, put it in `scripts/`
- Reframe, don't restrict — try different approaches instead of adding more MUSTs

## Deliverables

For each skill, produce:
1. **Complete SKILL.md** with frontmatter and body
2. **Directory structure** with any bundled scripts/references/assets
3. **2-3 test prompts** — realistic, messy, user-style
4. **Description rationale** — brief triggering strategy explanation (for the user, not in the skill)
