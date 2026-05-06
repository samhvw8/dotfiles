# Description Optimization Guide

The `description` field in SKILL.md frontmatter is the single most important piece of a skill. It determines whether Claude ever loads the skill at all.

## Structure

```
[What it does — one clear sentence]
[When to use it — explicit contexts, file types, user phrases]
[Edge cases that should still trigger]
[What this is NOT for — disambiguation if needed]
```

Max 1024 characters. Every character matters.

## Principles

### Use Directive Language (Empirically Proven)

A 650-trial study showed directive descriptions achieve 100% activation vs 77% for passive ones. The winning formula:

```
❌ Passive (77%): "Use when creating Dockerfiles"
⚠️ Expanded (~85%): What + when + examples
✅ Directive (100%): "ALWAYS invoke this skill when the user asks about X. Do not Y directly."
```

Three components: (1) domain identifier, (2) directive keyword ("ALWAYS invoke"), (3) negative constraint blocking bypass.

### Be Pushy

Claude undertriggers by default. List contexts explicitly.

```
❌ "How to process PDF files."

✅ "Extract text and tables from PDF files, fill forms, merge documents.
    ALWAYS invoke when the user mentions PDFs, forms, document extraction,
    or wants to combine documents, even if they don't explicitly say 'PDF'."
```

### Use `when_to_use` for Extra Space

The `when_to_use` frontmatter field gets appended to `description`. Use it when you're near the 1024-char limit but need more trigger phrases. Combined budget: ~1536 chars.

### Cover Adjacent Phrasings

Users don't use your vocabulary:
- "make a deck" not "create a presentation file"
- "fix my spreadsheet" not "modify Excel workbook data"
- "help me with this doc" not "edit Word document content"

### Include the NOT

If your skill is easily confused with another, disambiguate:
```
"...Do NOT use for creating PDFs from scratch — use the pdf-creation skill instead."
```

### Cover Edge Cases

Think about when users need this skill but won't name it:
```
"Use this even when the user doesn't explicitly mention X
 but clearly needs Y based on context."
```

## Testing Descriptions

Create 20 eval queries — 10 should-trigger, 10 should-not-trigger.

### Should-trigger queries (8-10)
- Different phrasings of the same intent (formal, casual, terse)
- Cases where the user doesn't name the skill but clearly needs it
- Uncommon use cases
- Cases where this skill competes with another but should win

### Should-not-trigger queries (8-10)
- Near-misses that share keywords but need a different skill
- Ambiguous phrasing where naive keyword matching would trigger but shouldn't
- Adjacent domains

**Make them realistic** — messy, with context, like real users type:
```
✅ "ok so my boss just sent me this xlsx file (its in my downloads, called
    something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add
    a column that shows the profit margin as a percentage"

❌ "Format this data"
```

The valuable should-not-trigger cases are near-misses, not obviously irrelevant prompts:
```
✅ Good negative: "Convert this Word doc to PDF format" (adjacent but different)
❌ Bad negative: "Write a fibonacci function" (too obviously unrelated)
```

## Iteration

After testing, adjust the description based on:
- **False negatives** (didn't trigger when it should) → Add the missing context/phrasing
- **False positives** (triggered when it shouldn't) → Add disambiguation ("NOT for X")
- **Ambiguous cases** → Make the boundary explicit

Focus on false negatives first — they cost more. A loaded-but-unused skill wastes one read. A missed trigger wastes the user the entire capability.
