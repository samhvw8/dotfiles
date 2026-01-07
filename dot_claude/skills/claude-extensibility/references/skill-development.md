# Skill Development Guide

## Table of Contents

1. [Skill Structure](#skill-structure)
2. [YAML Frontmatter](#yaml-frontmatter)
3. [Description Best Practices](#description-best-practices)
4. [Tool Access Control](#tool-access-control)
5. [Progressive Disclosure](#progressive-disclosure)
6. [Skill Types](#skill-types)
7. [Testing and Debugging](#testing-and-debugging)
8. [Common Patterns](#common-patterns)

## Skill Structure

Skills are directories containing a required `SKILL.md` file plus optional supporting files:

```
my-skill/
├── SKILL.md (required)
├── references/ (optional - detailed documentation)
│   ├── api-reference.md
│   └── examples.md
├── scripts/ (optional - utility scripts)
│   └── helper.py
└── templates/ (optional - templates)
    └── template.txt
```

### Storage Locations

| Location | Scope | Use Case |
|----------|-------|----------|
| `.claude/skills/{name}/SKILL.md` | Project | Team workflows, shared via git |
| `~/.claude/skills/{name}/SKILL.md` | User | Personal workflows, all projects |
| Plugin `skills/` | Plugin | Bundled with plugins |

## YAML Frontmatter

Required YAML frontmatter with Markdown content:

```yaml
---
name: your-skill-name
description: "Brief description of what this Skill does and when to use it"
allowed-tools: Read, Grep, Glob
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

### Field Requirements

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Lowercase, numbers, hyphens only; max 64 characters |
| `description` | Yes | WHAT + WHEN format; max 1024 characters; wrap in quotes |
| `allowed-tools` | No | Comma-separated list to restrict tool access |

## Description Best Practices

**Critical for discovery** - Skills are model-invoked (Claude autonomously decides when to use them). Description must include BOTH capability AND triggers.

### WHAT + WHEN Format

**Structure:**
```
"[Core purpose]. [Technologies/Stack]. Capabilities: [list]. Actions: [verbs]. Keywords: [triggers]. Use when: [scenarios]."
```

### Section Breakdown

| Section | Purpose | Example |
|---------|---------|---------|
| Core purpose | 1-sentence what it does | "Extract text and tables from PDF files" |
| Technologies | Tools, frameworks, formats | "Formats: .pdf. Tools: pypdf, pdfplumber" |
| Capabilities | What it can do (noun phrases) | "text extraction, form filling, merging" |
| Actions | Trigger verbs (imperative) | "extract, fill, merge PDFs" |
| Keywords | Semantic triggers for discovery | "PDF, form, document, pypdf" |
| Use when | Specific activation scenarios | "working with PDF files, extracting data" |

### Good Examples

```yaml
# PDF Processing
description: "Extract text and tables from PDF files, fill forms, merge documents. Formats: .pdf. Tools: pypdf, pdfplumber. Capabilities: text extraction, form filling, document merging. Actions: extract, fill, merge PDFs. Keywords: PDF, form, document, pypdf, pdfplumber. Use when: working with PDF files, extracting data from documents, filling PDF forms."

# Excel Processing
description: "Excel spreadsheet processing and analysis. Formats: .xlsx, .xlsm, .csv, .tsv. Capabilities: create spreadsheets, formulas (error-free), formatting, data analysis, charts, pivot tables. Actions: create, edit, analyze, visualize spreadsheets. Keywords: Excel, spreadsheet, xlsx, csv, formula, VLOOKUP, SUMIF, pivot table. Use when: creating spreadsheets, editing Excel files, analyzing tabular data."

# Git Commit Messages
description: "Generate clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes."
```

### Bad Examples

```yaml
description: Helps with documents  # Too vague - no keywords, no triggers
description: PDF skill  # Missing capabilities, actions, keywords
description: Excel skill for spreadsheets  # Missing WHEN triggers
```

### Clear Distinction Between Similar Skills

```yaml
# Sales Analysis Skill
description: "Analyze sales data in Excel files and CRM exports. Use for sales reports, pipeline analysis, and revenue tracking."

# System Monitoring Skill
description: "Analyze log files and system metrics data. Use for performance monitoring, debugging, and system diagnostics."
```

## Tool Access Control

Restrict Claude's tool usage with `allowed-tools` for security and focus:

```yaml
---
name: safe-file-reader
description: "Read files without making changes. Use when you need read-only file access."
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
```

### Use Cases for Tool Restriction

| Scenario | Allowed Tools | Benefit |
|----------|---------------|---------|
| Read-only analysis | `Read, Grep, Glob` | Prevents accidental modifications |
| Code review | `Read, Grep, Glob, Bash` | Limited scope |
| Security audit | `Read, Grep` | Minimal attack surface |
| Documentation | `Read, Write` | Only file operations |

## Progressive Disclosure

Claude reads supporting files only when needed. Reference them from SKILL.md:

```markdown
# PDF Processing

## Quick Start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [references/forms.md](references/forms.md).
For detailed API reference, see [references/api.md](references/api.md).

## Requirements
```bash
pip install pypdf pdfplumber
```
```

### Guidelines

- **Main SKILL.md**: <800 lines, core guidance
- **Reference files**: Detailed documentation, examples, edge cases
- **Table of contents**: Add to reference files > 100 lines
- **One level deep**: Don't nest references deeply

## Skill Types

### Domain Skills

**Purpose:** Provide comprehensive guidance for specific technical areas

**Characteristics:**
- Advisory, not mandatory
- Topic or domain-specific
- Best practices documentation

**Examples:**
- `backend-dev-guidelines` - Node.js/Express patterns
- `frontend-dev-guidelines` - React/TypeScript practices
- `database-operations` - SQL/NoSQL patterns

### Guardrail Skills

**Purpose:** Enforce critical best practices that prevent errors

**Characteristics:**
- Enforcement via hooks
- Block operations until verified
- Session-aware

**Examples:**
- `database-verification` - Verify table/column names before queries
- `security-review` - Check for vulnerabilities before deployment

### Tool-Restricted Skills

**Purpose:** Provide capabilities with limited tool access

**Characteristics:**
- `allowed-tools` field set
- Read-only or limited scope
- Security-sensitive workflows

## Testing and Debugging

### Key Question: Does it activate when expected?

### Manual Testing

```bash
# Check if skill triggers on expected prompt
# In Claude Code, type prompts that should trigger the skill:
> "Help me extract text from a PDF"
> "Create an Excel formula for..."
> "Generate a commit message"
```

### Debug Mode

```bash
claude --debug
```

Shows skill loading and activation decisions.

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Never triggers | Vague description | Add specific keywords and "Use when" |
| Too many triggers | Generic terms | Make keywords more specific |
| Wrong skill triggers | Overlapping descriptions | Differentiate with specific use cases |
| Skill doesn't load | Invalid YAML | Check syntax, quotes, indentation |

### Debugging Checklist

- [ ] SKILL.md exists in correct location
- [ ] YAML frontmatter valid (check `---` delimiters)
- [ ] Name is lowercase with hyphens only
- [ ] Description is quoted and < 1024 chars
- [ ] Description includes WHAT + WHEN
- [ ] Content is < 800 lines
- [ ] No tab characters (use spaces)

## Writing Principles

### Voice
- Sound like a practitioner, not documentation
- Direct and confident, not hedging
- Specific and concrete, not abstract

**Before (documentation voice):**
> It is recommended that users consider implementing appropriate error handling.

**After (practitioner voice):**
> Always handle errors explicitly. Silent failures are debugging nightmares.

### Density
- Every sentence should transfer knowledge
- No filler, no redundancy
- If it doesn't change behavior, cut it

### Patterns Over Procedures

Transform procedures to patterns when expertise matters:

**Before (procedure):**
```
1. Open the file
2. Check the format
3. Validate the data
```

**After (pattern):**
```markdown
### Format Recognition
**When you see:** File extension and initial bytes
**This indicates:** Expected structure and parsing approach
**Therefore:** Choose parser before reading content
**Watch out for:** Extension doesn't always match actual format
```

## Common Patterns

### Pattern Format (Use in Skills)

```markdown
### [Pattern Name]
**When you see:** [Observable trigger]
**This indicates:** [Expert insight]
**Therefore:** [Action to take]
**Watch out for:** [Common pitfall]
```

### Simple Skill (Single File)

```yaml
---
name: generating-commit-messages
description: "Generate clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes."
---

# Generating Commit Messages

## Instructions
1. Run `git diff --staged` to see changes
2. Suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best Practices
- Use present tense
- Explain what and why, not how
```

### Skill with Tool Permissions

```yaml
---
name: code-reviewer
description: "Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality."
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## Review Checklist
1. Code organization and structure
2. Error handling
3. Performance considerations
4. Security concerns
5. Test coverage
```

### Multi-File Skill with References

```yaml
---
name: pdf-processing
description: "Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages."
---

# PDF Processing

## Quick Start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [references/forms.md](references/forms.md).
For detailed API reference, see [references/api.md](references/api.md).

## Requirements
```bash
pip install pypdf pdfplumber
```
```

## Best Practices Summary

### Do

✅ Include WHAT + WHEN in description
✅ Keep SKILL.md under 800 lines
✅ Use reference files for detailed content
✅ Include specific keywords for discovery
✅ Test with real prompts before finalizing
✅ Use `allowed-tools` for security-sensitive skills
✅ Document dependencies and requirements

### Don't

❌ Write vague descriptions
❌ Exceed 800 lines without references
❌ Use generic terms that overlap with other skills
❌ Skip testing activation triggers
❌ Forget "Use when" scenarios
❌ Use tabs (use spaces instead)

## Lifecycle

**Create:** Place SKILL.md in correct location
**Update:** Edit SKILL.md directly; changes apply on next Claude Code start
**Remove:** Delete the skill directory and commit changes
**Share:** Commit `.claude/skills/` to git for team access
