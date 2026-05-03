# Writing Guide for Claude Skills

## Core Writing Principles

### Only Add What Claude Doesn't Know

Before writing any instruction, ask: "Would a senior developer need this explained?"

```
❌ "PDF (Portable Document Format) files are a common file format..."
✅ "Use pdfplumber for text extraction. For scanned PDFs, use pytesseract."
```

### Explain Why, Not Just What

Claude responds to reasoning better than commands. When you find yourself writing ALWAYS or NEVER in caps, reframe as reasoning about consequences.

```
❌ "ALWAYS use --backup flag. NEVER skip this step."
✅ "The --backup flag creates a rollback point. Without it, a failed migration
    leaves the database in an inconsistent state requiring manual recovery."
```

### Match Freedom to Fragility

**High freedom** — multiple valid approaches, context-dependent:
```
Analyze the code for potential issues. Consider structure, edge cases,
readability, and project conventions.
```

**Medium freedom** — preferred pattern, some variation:
```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data, generate output, optionally include visualizations
```

**Low freedom** — fragile, exact sequence required:
```bash
python scripts/migrate.py --verify --backup
# Do not modify flags or add additional parameters
```

### Use Examples to Illustrate Principles

Examples anchor understanding. Pair each with the principle it demonstrates — don't let examples be the only guidance.

```markdown
## Commit message format

Follow conventional commits — type(scope): description.
The type communicates intent to automated tooling (changelogs, version bumps).

**Example:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication
```

### Structural Patterns

**Output format definitions:**
```markdown
## Report structure
ALWAYS use this template:
# [Title]
## Executive summary
## Key findings
## Recommendations
```

**Domain organization** — when a skill supports multiple variants:
```
cloud-deploy/
├── SKILL.md (workflow + selection logic)
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```
Claude reads only the relevant reference file.

---

## Common Mistakes

### The Encyclopedia
Writing a textbook about the domain instead of giving Claude the delta it needs.
**Fix:** Only add what Claude doesn't already know.

### The Checklist
Rigid step-by-step procedures that break when context varies.
**Fix:** Transfer how experts think — give lenses, not scripts.

### The Timid Description
Vague, short descriptions that don't trigger.
**Fix:** Be pushy. List file types, phrases, edge cases, adjacent tasks.

### The Overfit
Tweaking the skill to handle 3 test cases perfectly while breaking generalization.
**Fix:** Generalize from feedback. Address the underlying principle, not the specific symptom.

### The Monolith
Cramming everything into SKILL.md until it's 800+ lines.
**Fix:** SKILL.md is the router. Heavy content goes in `references/`. Deterministic ops go in `scripts/`.

### The Rigid Captain
ALL CAPS ALWAYS/NEVER commands treating Claude like a rule machine.
**Fix:** Explain reasoning. "The --backup flag prevents unrecoverable state" > "ALWAYS use --backup."

---

## Mental Models for Skill Architects

**Context Window as Public Good**: Your skill shares the window with the system prompt, conversation history, other skills, and the user's request. Every token displaces something else.

**Skill as Onboarding Guide**: Write for a brilliant new team member — general expertise, no context about your specific workflows and conventions.

**Progressive Disclosure as Architecture**: Metadata is the index. SKILL.md is the playbook. Bundled files are the reference library. Design each level independently.

**Description as Search Index**: The description is a search query in reverse — you're writing the terms that should match future user queries. Think like a search engine: what would the user type?

**Degrees of Freedom as Risk Management**: Specificity of instructions should match the cost of getting it wrong. Database migrations get exact scripts. Code reviews get principles.
