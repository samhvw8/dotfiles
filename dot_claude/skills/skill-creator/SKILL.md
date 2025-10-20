---
name: skill-creator
description: Guide for creating effective Anthropic skills that extend Claude's capabilities with specialized knowledge, workflows, or tool integrations. Use when user requests "create a skill", "new skill", "build a skill", "make a skill", "skill for", "add a skill", or mentions skill creation, skill development, SKILL.md, skill packaging, or extending Claude's capabilities.
---

# Skill Creator

Guide for creating modular, self-contained skills that extend Claude's capabilities.

## About Skills

Skills are specialized capability packages providing domain expertise, workflows, and tools. They transform Claude from general-purpose to domain-expert by supplying procedural knowledge no model inherently possesses.

### What Skills Provide

1. **Specialized Workflows** - Multi-step procedures for specific domains
2. **Tool Integrations** - Instructions for file formats, APIs, systems
3. **Domain Expertise** - Company knowledge, schemas, business logic
4. **Bundled Resources** - Scripts, references, assets for complex/repetitive tasks

### Anatomy of a Skill

Every skill requires SKILL.md and may include optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded as needed
    └── assets/           - Files used in output (templates, icons, etc.)
```

#### SKILL.md (required)

**Metadata Quality:** The `name` and `description` in YAML frontmatter determine skill triggering. Be specific about purpose and use cases. Use third-person voice (e.g., "This skill should be used when..." not "Use this skill when...").

**Writing Style:** Use imperative/infinitive form (verb-first instructions), not second person. Write objectively: "To accomplish X, do Y" rather than "You should do X".

#### Bundled Resources (optional)

##### Scripts (`scripts/`)

Executable code for deterministic tasks or repeatedly rewritten logic.

- **When to include**: Code rewritten repeatedly or requiring deterministic reliability
- **Example**: `scripts/rotate_pdf.py` for PDF rotation
- **Benefits**: Token efficient, deterministic, executable without context loading
- **Note**: May need reading for patching or environment adjustments

##### References (`references/`)

Documentation loaded into context as needed to inform Claude's process.

- **When to include**: Reference material needed during execution
- **Examples**: `references/finance.md` (schemas), `references/api_docs.md` (API specs), `references/policies.md` (company policies)
- **Use cases**: Database schemas, API docs, domain knowledge, workflows
- **Benefits**: Keeps SKILL.md lean, loaded only when needed
- **Best practice**: For large files (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information lives in SKILL.md OR references, not both. Prefer references for detailed content; keep only essential procedural instructions in SKILL.md

##### Assets (`assets/`)

Files used in output, not loaded into context.

- **When to include**: Files needed in final output
- **Examples**: `assets/logo.png` (brand assets), `assets/slides.pptx` (templates), `assets/frontend-template/` (boilerplate)
- **Use cases**: Templates, images, icons, boilerplate, fonts, sample documents
- **Benefits**: Separates output resources from documentation

### Progressive Disclosure Design

Skills use three-level loading for context efficiency:

1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (unlimited*)

*Scripts executable without context window consumption.

## Skill Creation Process

<approach>
Follow this systematic process, skipping steps only when clearly inapplicable:

**Step 1: Understand with Concrete Examples**

Skip only if usage patterns are already clear.

Gather concrete examples of skill usage through:
- User-provided examples
- Generated examples validated by user

Key questions:
- "What functionality should this skill support?"
- "Can you provide examples of how this skill would be used?"
- "What would a user say to trigger this skill?"

Avoid overwhelming users—ask essential questions first, follow up as needed.

**Conclude when:** Clear understanding of required functionality exists.

**Step 2: Plan Reusable Skill Contents**

Analyze each concrete example by:
1. Considering execution from scratch
2. Identifying helpful scripts, references, and assets

Examples:

*PDF Editor Skill:*
- Query: "Rotate this PDF"
- Analysis: Requires same code repeatedly
- Resource: `scripts/rotate_pdf.py`

*Frontend Builder Skill:*
- Query: "Build a todo app"
- Analysis: Same boilerplate HTML/React each time
- Resource: `assets/hello-world/` template

*BigQuery Skill:*
- Query: "How many users logged in today?"
- Analysis: Requires re-discovering schemas
- Resource: `references/schema.md`

**Conclude when:** List of reusable resources (scripts/references/assets) identified.

**Step 3: Initialize the Skill**

Skip if skill already exists; proceed to Step 4.

Run the initialization script:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

Script creates:
- Skill directory at specified path
- SKILL.md template with frontmatter and TODOs
- Example directories: `scripts/`, `references/`, `assets/`
- Example files for customization or deletion

**Step 4: Edit the Skill**

Write for another Claude instance. Focus on non-obvious, beneficial information.

**4a. Create Reusable Skill Contents**

Implement identified resources: scripts, references, assets.
- May require user input (brand assets, documentation, etc.)
- Delete unused example files from initialization

**4b. Update SKILL.md**

Answer these questions in SKILL.md:

1. What is the skill's purpose? (few sentences)
2. When should the skill be used?
3. How should Claude use the skill in practice?
   - Reference all reusable contents
   - Provide usage instructions
   - Include workflow guidance

**Step 5: Package the Skill**

Create distributable zip file with automatic validation:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory:
```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

Script performs:

1. **Validation** - Checks:
   - YAML frontmatter format and required fields
   - Naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Packaging** - If validation passes:
   - Creates zip file named after skill (e.g., `my-skill.zip`)
   - Includes all files with proper structure

If validation fails, fix errors and re-run packaging.

**Step 6: Iterate**

After testing with real tasks:

1. Use skill on concrete tasks
2. Notice struggles or inefficiencies
3. Identify needed updates to SKILL.md or resources
4. Implement changes and test again
5. Re-package if distributing

</approach>

## Quality Checklist

<requirements>
**SKILL.md Requirements:**
- Clear, specific description in frontmatter
- Imperative/infinitive writing style (not second person)
- Purpose stated in few sentences
- Clear trigger conditions specified
- All bundled resources referenced with usage instructions
- Under 5k words (prefer references for detailed content)

**Resource Organization:**
- Scripts for deterministic/repeated code
- References for documentation and schemas
- Assets for output files (templates, images)
- No duplication between SKILL.md and references
- Example files deleted if not needed

**Validation:**
- Proper YAML frontmatter format
- Skill naming conventions followed
- Directory structure correct
- All referenced resources exist
</requirements>

## Best Practices

<guidelines>
**Metadata:**
- Name: kebab-case, descriptive, specific
- Description: Explains what skill does and when to use it

**SKILL.md:**
- Keep lean (<5k words)
- Move detailed content to references
- Include grep patterns for large reference files
- Use concrete examples where helpful

**Scripts:**
- Include for repeatedly rewritten code
- Document dependencies and usage
- Make executable and well-tested

**References:**
- Organize by topic/domain
- Use descriptive filenames
- Keep focused and searchable

**Assets:**
- Only include files used in output
- Organize by type/purpose
- Use relative paths in instructions
</guidelines>
