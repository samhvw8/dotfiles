---
name: skills-generator
description: Design, write, and refine Claude Agent Skills — modular SKILL.md packages that extend Claude's capabilities through structured instruction injection. Use this skill whenever the user wants to create a new skill from scratch, improve an existing skill, write or optimize a skill description, structure a skill directory, or turn a workflow into a reusable skill. Also trigger when the user says "make this a skill", "turn this into a skill", "create a skill for X", mentions SKILL.md authoring, or asks about skill architecture, progressive disclosure, or skill triggering. Do NOT use for general prompt engineering that isn't about Claude Skills specifically.
---

# Skills Generator

You design Claude Skills — filesystem-based packages that Claude discovers and loads on demand. Each skill is a context engineering problem: what information does Claude need, when should it load, and how much freedom should the instructions leave?

## Key Principles

1. **Claude is smart** — only add what Claude doesn't already know. Challenge every paragraph: does this justify its token cost?
2. **Explain WHY** — Claude responds to reasoning better than commands. Reframe ALWAYS/NEVER as reasoning about consequences.
3. **Be pushy in descriptions** — Claude undertriggers by default. List contexts, edge cases, and adjacent phrasings explicitly.
4. **Match freedom to fragility** — Exact scripts for dangerous operations. Principles for judgment-based tasks.
5. **Generalize from examples** — Skills run millions of times. Don't overfit to the 3 test cases.

For detailed writing guidance, read `references/writing-guide.md`.
For description optimization, read `references/description-guide.md`.

## Skill Architecture

```
skill-name/
├── SKILL.md          # Required: YAML frontmatter + instructions (<500 lines)
├── scripts/          # Optional: deterministic operations (execute without loading)
├── references/       # Optional: domain docs loaded as needed
└── assets/           # Optional: templates, fonts, icons for output
```

### Progressive Disclosure

| Level | When Loaded | Budget | Contains |
|-------|-------------|--------|----------|
| Metadata | Always | ~100 tokens | `name` + `description` from YAML frontmatter |
| SKILL.md body | When triggered | <5k tokens | Workflows, patterns, decision routing |
| Bundled files | As needed | Unlimited | Scripts, references, templates |

### Frontmatter

```yaml
---
name: lowercase-hyphenated-identifier  # max 64 chars, no "anthropic"/"claude"
description: >
  What it does. When to use it — file types, user phrases, task contexts.
  Edge cases that should still trigger. What it's NOT for if ambiguous.
  # max 1024 chars. This is the PRIMARY trigger mechanism.
---
```

## Creation Workflow

### 1. Capture Intent

Extract from conversation first — if the user says "turn this into a skill," mine the conversation for workflow, tools, corrections, and output format before asking questions.

Ask only what you can't infer:
- What should this skill enable Claude to do?
- When should it trigger?
- What's the expected output?
- Are outputs objectively verifiable or subjective?

### 2. Research the Domain

Before writing instructions, understand how practitioners actually work:
- Current best practices, tools, frameworks
- Common failure modes and edge cases
- Decision heuristics experts use
- Similar existing skills for structural inspiration

### 3. Draft the SKILL.md

Write in this order:
1. **Quick orientation** — one paragraph on what this does and the approach
2. **Core workflow** — structured by decision points, not rigid steps
3. **Patterns and examples** — illustrate principles with concrete cases
4. **Edge cases** — what could go wrong, how to handle it
5. **Reference routing** — pointers to bundled files if needed
6. **Frontmatter** (write LAST) — description is easier after writing the full skill

### 4. Review

Read with fresh eyes:
- **Token audit**: Every paragraph justifies its context cost?
- **Freedom calibration**: Specificity matches fragility?
- **Generalization**: Works for prompts you haven't seen?
- **Smart-Claude check**: Explaining things Claude already knows?
- **Trigger check**: Description covers all intended use cases?

### 5. Test Cases

Create 2-3 realistic, messy prompts — how real users actually type:

```
❌ "Extract text from PDF"
✅ "ok so my boss sent me this xlsx file (its in downloads, called 'Q4 sales 
    final FINAL v2.xlsx') and she wants me to add a profit margin column. 
    Revenue is col C, costs col D i think"
```

Run each test, evaluate: Did it trigger? Right workflow? Good output? Wasted steps?

### 6. Iterate

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
