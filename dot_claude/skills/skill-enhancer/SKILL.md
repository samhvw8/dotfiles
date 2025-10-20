---
name: skill-enhancer
description: Transform existing skills into production-ready, optimally structured capabilities. Use when user requests "improve skill", "enhance skill", "optimize skill", "refactor skill", or mentions SKILL.md quality, skill optimization.
---

# Skill Enhancer

## Purpose

Transform existing Anthropic skills into enhanced, production-ready versions that are concise, well-structured, and optimally organized for Claude's progressive disclosure system.

## When to Use This Skill

Use this skill when:
- User explicitly asks to improve, enhance, or optimize a skill
- Skill has quality issues (verbose, unclear structure, poor organization)
- User wants to upgrade legacy skills to current standards
- User mentions better skill effectiveness or token efficiency
- Skill files contain TODOs, second-person voice, or unused examples

## Core Principles

1. **Conciseness**: Reduce SKILL.md to <5k words, move details to references/
2. **Structure**: Use clear patterns (workflow/task/reference/capabilities)
3. **XML Integration**: Mix natural text with XML tags for constraints, examples, requirements
4. **Direct Instructions**: Use imperative/infinitive voice (NOT second person)
5. **Clean Output**: Return enhanced skill ready for immediate use
6. **Resource Optimization**: Proper scripts/references/assets separation

## Enhancement Process

### Input Analysis
- Read complete skill (SKILL.md + all resources)
- Identify quality issues across dimensions:
  - Metadata quality (name, description, triggers)
  - Structural clarity (pattern, organization, flow)
  - Writing style (voice, conciseness, examples)
  - Resource organization (scripts, references, assets)
  - Size efficiency (token usage, progressive disclosure)

### Core Enhancement Techniques

**Metadata Enhancement**
- Ensure kebab-case naming
- Write comprehensive description (30-60 words)
- Use third-person voice: "This skill should be used when..."
- Add specific triggers (file types, keywords, scenarios)

**Voice Correction**
- Eliminate second-person: "you should/can/will"
- Convert to imperative/infinitive: "Use X to...", "Process files by..."
- Remove filler words: "simply", "just", "basically", "obviously"
- Use active voice and direct instructions

**Structural Optimization**
Apply appropriate pattern:
- **Workflow-based**: Sequential processes with decision trees
- **Task-based**: Multiple discrete operations
- **Reference-based**: Standards, guidelines, specifications
- **Capabilities-based**: Integrated systems with features

**Content Refinement**
- Add concrete examples (before/after transformations)
- Include XML tags for: constraints, requirements, examples, format, guidelines
- Keep main instructions as natural language
- Reference bundled resources with usage instructions

**Resource Organization**
- `scripts/` - Executable code for repeated operations
- `references/` - Detailed documentation (schemas, APIs, workflows)
- `assets/` - Output templates, boilerplate, images
- Delete unused example files
- Eliminate duplication between SKILL.md and references

**Size Reduction**
- Move comprehensive docs to references/
- Add grep patterns for large reference files
- Implement progressive disclosure
- Target <5k words in SKILL.md

### Output Format

Return the enhanced skill with:
- Updated SKILL.md with all improvements applied
- Reorganized resources (created/moved/deleted as needed)
- No meta-commentary about changes
- No TODO items remaining
- Immediately usable structure

## Example Transformations

### Example 1: Metadata Enhancement

**Before:**
```yaml
description: Helps with PDFs
```

**After:**
```yaml
description: Comprehensive PDF manipulation and analysis toolkit. This skill should be used when reading, creating, editing, merging, splitting, or extracting content from PDF files. Triggers include .pdf file paths, document manipulation requests, or form field operations.
```

---

### Example 2: Voice Correction

**Before:**
```markdown
You should use this function when you need to rotate a PDF.
When you're working with large files, you can optimize memory.
```

**After:**
```markdown
Rotate PDFs using this function.
Optimize memory for large files.
```

---

### Example 3: Structure with XML Integration

**Before:**
```markdown
This skill helps analyze data. Use it for data analysis tasks.
It can handle various formats and provides insights.
```

**After:**
```markdown
Analyze datasets and identify key insights, trends, and patterns.

<requirements>
- Highlight statistically significant findings
- Identify temporal trends and correlations
- Note anomalies or outliers
</requirements>

<format>
- Executive summary of findings
- Data visualizations as needed
- Detailed pattern analysis
- Actionable recommendations
</format>
```

---

### Example 4: Resource Reorganization

**Before:**
```
skill-folder/
├── SKILL.md (8000 words with API docs, schemas, examples)
├── scripts/example.py (unused)
├── references/api_reference.md (empty)
└── assets/example_asset.txt (unused)
```

**After:**
```
skill-folder/
├── SKILL.md (2000 words, references resources)
├── scripts/
│   └── data_processor.py (actual utility)
└── references/
    ├── api_docs.md (detailed API reference)
    └── schemas.md (complete schemas)
```

---

### Example 5: Progressive Disclosure

**Before (all in SKILL.md):**
```markdown
# BigQuery Skill

## Complete API Reference
[2000 words of API documentation...]

## Database Schemas
[3000 words of schema details...]

## Query Examples
[2000 words of examples...]
```

**After (SKILL.md + references):**
```markdown
# BigQuery Skill

## Purpose
Execute and analyze BigQuery queries with proper schema awareness.

## Quick Start
[300 words of essential patterns]

## Resources
<references>
Complete API documentation: references/api_docs.md
Database schemas: references/schemas.md

To find specific schema:
grep -i "table_name" references/schemas.md
</references>
```

## Quality Standards

<requirements>
### Metadata
- Name: kebab-case, specific, descriptive
- Description: 30-60 words, explains WHAT and WHEN
- Voice: Third-person ("This skill should be used when...")
- Triggers: Specific scenarios, file types, keywords

### SKILL.md
- Size: <5k words (move details to references/)
- Voice: Imperative/infinitive (NOT second person)
- Structure: Clear pattern applied consistently
- Examples: Concrete, realistic scenarios
- Resources: All referenced with usage instructions

### Writing Style
- Verb-first instructions
- No "you should/can/will" phrases
- Active voice preferred
- Specific over generic
- No filler words

### Resource Organization
- scripts/ for executable automation
- references/ for detailed documentation
- assets/ for output templates/files
- No duplication with SKILL.md
- All example files deleted if unused
</requirements>

## Enhancement Checklist

Before completing enhancement:

<checklist>
**Metadata:**
- [ ] Name is kebab-case
- [ ] Description is comprehensive (30-60 words)
- [ ] Third-person voice
- [ ] Specific triggers included

**Structure:**
- [ ] Appropriate pattern selected
- [ ] Logical section organization
- [ ] Purpose stated clearly
- [ ] Progressive disclosure applied

**Content:**
- [ ] SKILL.md <5k words
- [ ] Imperative/infinitive voice throughout
- [ ] No second-person phrases
- [ ] Concrete examples included
- [ ] XML tags for constraints/requirements

**Resources:**
- [ ] Scripts for repeated code
- [ ] Docs moved to references/
- [ ] Assets organized properly
- [ ] No duplication
- [ ] Examples deleted

**Quality:**
- [ ] Clear and concise
- [ ] Immediately actionable
- [ ] No TODOs remaining
- [ ] Ready for immediate use
</checklist>

## Common Enhancement Patterns

**Pattern: Too Verbose**
- Problem: SKILL.md >5k words
- Solution: Move detailed docs to references/, add grep patterns

**Pattern: Second Person**
- Problem: "You should use this when you want..."
- Solution: "Use this to..." or "Process files by..."

**Pattern: Missing Examples**
- Problem: Abstract descriptions only
- Solution: Add concrete before/after examples

**Pattern: Poor Resource Organization**
- Problem: Mixed scripts/docs/assets, unused files
- Solution: Separate by purpose, delete examples

**Pattern: Vague Metadata**
- Problem: "Helps with documents"
- Solution: Specify exact triggers and use cases

**Pattern: No Structure**
- Problem: Wall of text, unclear organization
- Solution: Apply workflow/task/reference/capabilities pattern

## XML Tag Usage Guidelines

<guidelines>
**Use XML tags for:**
- `<requirements>` - Specific criteria to meet
- `<constraints>` - Limitations and boundaries
- `<examples>` - Sample inputs/outputs
- `<format>` - Output structure requirements
- `<guidelines>` - Best practices to follow
- `<approach>` - Step-by-step methodology
- `<references>` - External resource pointers
- `<checklist>` - Validation items

**Do NOT use XML for:**
- Primary mission statement
- Main task descriptions
- Core instructions
</guidelines>

## Implementation Notes

When enhancing skills:
1. Read entire skill first (all files)
2. Identify all quality issues systematically
3. Apply enhancements across all dimensions
4. Validate against checklist
5. Output enhanced skill ready for immediate use
6. No meta-commentary about what was changed

The enhanced skill should be demonstrably better, immediately usable, and require no additional modifications.
