---
name: claude-ecosystem
description: "ALWAYS invoke this skill when the user asks about Claude Code features, configuration, extensibility, or project setup. ALWAYS invoke when the user wants to create, improve, or refine a Claude Agent Skill — including 'make this a skill', 'turn this into a skill', 'create a skill for X', or asks about SKILL.md authoring, frontmatter, description optimization, progressive disclosure, or triggering strategy. Modules: CLI tool (setup, slash commands, MCP servers, hooks, plugins, CI/CD), extensibility (agents, skills, output styles), CLAUDE.md (project instructions, optimization). Keywords: Claude Code, skill, SKILL.md, agent, hook, plugin, MCP, CLAUDE.md, skill architecture, description optimization, progressive disclosure. For skill body content quality (soul, tensions, mental models), also invoke prompt-architect. Do NOT use for general prompt engineering without a Claude Code context."
---

# Claude Ecosystem

Comprehensive guide for Claude Code CLI tool, extensibility (agents/skills/output styles), and CLAUDE.md architecture.

## Module Selection

| Need | Module | Reference |
|------|--------|-----------|
| **Setup/Configuration** | CLI | `references/getting-started.md`, `references/configuration.md` |
| **Slash Commands** | CLI | `references/slash-commands.md` |
| **MCP Servers** | CLI | `references/mcp-integration.md` |
| **Hooks & Plugins** | CLI | `references/hooks-and-plugins.md` |
| **Create Agents** | Extensibility | `references/agent-development.md` |
| **Create/Refine Skills** | Extensibility | `references/skill-creation-workflow.md`, `references/skill-writing-guide.md`, `references/skill-description-guide.md` |
| **Output Styles** | Extensibility | `references/skill-development.md` |
| **Init CLAUDE.md** | Architecture | `references/initialization-workflow.md` |
| **Optimize CLAUDE.md** | Architecture | `references/optimization-patterns.md` |
| **Enterprise/CI-CD** | CLI | `references/enterprise-features.md`, `references/cicd-integration.md` |
| **Troubleshooting** | CLI | `references/troubleshooting.md` |

---

## Quick Reference

### Extension Types

| Type | Invocation | Purpose | Location |
|------|------------|---------|----------|
| **Agents** | Task tool | Specialized sub-processes | `.claude/agents/` |
| **Skills** | Model-invoked | Domain knowledge | `.claude/skills/{name}/` |
| **Output Styles** | `/output-style` | Modify main agent | `.claude/output-styles/` |

### Model Selection (Agents)

| Model | Use When | Target Time |
|-------|----------|-------------|
| `haiku` | Fast tasks, exploration | < 3s |
| `sonnet` | Balanced, most use cases | < 10s |
| `opus` | Complex reasoning | < 30s |

### CLAUDE.md Token Budget

| Complexity | Target Tokens |
|-----------|---------------|
| Simple | 100-200 |
| Medium | 200-400 |
| Complex | 400-800 |
| Maximum | 1000 |

---

## Extensibility Principles

### Core Truths

| Truth | Meaning |
|-------|---------|
| **Expertise Transfer** | Make Claude *think* like expert, not follow steps |
| **Flow, Not Friction** | Produce output, not intermediate work |
| **Voice Matches Domain** | Sound like practitioner, not documentation |
| **Focused Beats Comprehensive** | Constrain ruthlessly |

### Decision Heuristics

| Rule | Guidance |
|------|----------|
| **3-File Rule** | 3+ files → agent. Enhances YOUR work → skill. |
| **Delegation Test** | Runs independently? Agent. Guides you? Skill. |
| **Activation Breadth** | Trigger on 80% of relevant requests |
| **Tool Constraint** | Start with 2-3 essential tools |

### Activation Keywords

**The description field is your activation gate.** Include:
1. Task verbs: create, build, debug, fix, deploy
2. Problem descriptions: slow, broken, failing
3. Artifact types: component, API, database
4. Casual synonyms: "make it faster" → optimize

---

## Common Workflows

### Create Agent

For the agent's prompt content (soul, tensions, mental models, thinking approaches), invoke `Skill("prompt-architect")` — it handles expertise transfer and dialectic design. This skill handles structure and frontmatter.

```yaml
---
name: agent-name
description: "Use when [use case]. PROACTIVELY for [triggers].\n\nExamples:\n<example>\nContext: [situation]\nuser: [request]\nassistant: [response]\n</example>"
tools: Grep, Glob, Read, Bash
model: haiku
---

# Agent Name

Mission statement.

## Strategy
[Approach]

## Does NOT Do
- [boundary] (use X instead)
```

### Create Skill

Each skill is a context engineering problem: what information does Claude need, when should it load, and how much freedom should the instructions leave?

For body content (soul, tensions, mental models, anti-patterns), invoke `Skill("prompt-architect")` — it handles expertise transfer and dialectic design.

#### Key Principles

1. **Claude is smart** — only add what Claude doesn't already know
2. **Explain WHY** — reasoning beats commands; reframe ALWAYS/NEVER as consequences
3. **Be pushy in descriptions** — Claude undertriggers by default; use directive language ("ALWAYS invoke")
4. **Match freedom to fragility** — exact scripts for dangerous ops, principles for judgment tasks
5. **Generalize from examples** — skills run millions of times; don't overfit

#### Architecture

```
skill-name/
├── SKILL.md          # Required: YAML frontmatter + instructions (<500 lines)
├── scripts/          # Optional: deterministic operations (execute without loading)
├── references/       # Optional: domain docs loaded as needed
└── assets/           # Optional: templates, fonts, icons for output
```

#### Creation Workflow

1. **Capture Intent** — mine conversation for workflow, tools, corrections before asking questions
2. **Research Domain** — best practices, failure modes, decision heuristics, similar skills
3. **Draft SKILL.md** — quick orientation → core workflow → patterns → edge cases → reference routing → frontmatter (LAST)
4. **Review** — token audit, freedom calibration, generalization, trigger check, "Rationalizations to Reject", "When NOT to Use"
5. **Test Cases** — 2-3 realistic messy prompts as users actually type
6. **Iterate** — generalize from feedback, keep lean, reframe don't restrict

**Detailed workflow:** `references/skill-creation-workflow.md`
**Writing principles:** `references/skill-writing-guide.md`
**Description optimization:** `references/skill-description-guide.md`

#### Deliverables

1. Complete SKILL.md with frontmatter and body
2. Directory structure with any bundled scripts/references/assets
3. 2-3 test prompts — realistic, messy, user-style
4. Description rationale — brief triggering strategy explanation

### Initialize CLAUDE.md

1. Analyze codebase (language, framework, structure)
2. Extract code style, commands, patterns
3. Generate with template, customize
4. Validate commands, check token count
5. Target <400 lines, prefer <250

**Detailed:** `references/initialization-workflow.md`

### Optimize CLAUDE.md

1. Evaluate token efficiency
2. Find redundancy, outdated info
3. Apply token reduction techniques
4. Target 40%+ reduction
5. Verify critical info retained

**Detailed:** `references/optimization-patterns.md`

---

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| **Kitchen Sink Agent** | 10+ tools, handles "everything" | Constrain to 3-5 tools |
| **Echo Skill** | Restates docs without insight | Add expert layer |
| **Invisible Trigger** | Description uses only formal terms | Include user language |
| **Procedure Manual** | Step 1, 2, 3... | Teach patterns, not steps |
| **Over-Documentation** | CLAUDE.md > 400 lines | Document project-specific only |

---

## Quality Signals

### Good Signs
- Frontmatter reads like "when to use" guide
- First 10 lines provide actionable guidance
- Expert would nod "yes, that's how I think"
- Explicit constraints on what it does NOT handle

### Warning Signs
- >50% reference tables or field definitions
- No mention of "when NOT to use"
- Generic language for any domain
- Body exceeds 600 lines

---

## References

### CLI Tool
- `references/getting-started.md` - Installation, setup, auth
- `references/slash-commands.md` - Complete command catalog
- `references/mcp-integration.md` - MCP server configuration
- `references/hooks-and-plugins.md` - Hook types, plugin structure
- `references/configuration.md` - Settings hierarchy
- `references/enterprise-features.md` - IAM, SSO, sandboxing
- `references/cicd-integration.md` - GitHub Actions, GitLab CI
- `references/ide-integration.md` - VS Code, JetBrains
- `references/advanced-features.md` - Extended thinking, caching
- `references/troubleshooting.md` - Common issues
- `references/api-reference.md` - Admin, Messages, Skills APIs
- `references/best-practices.md` - Project organization, security
- `references/agent-skills.md` - Creating skills via CLI

### Extensibility
- `references/agent-development.md` - Full YAML structure, system prompts
- `references/skill-development.md` - Structure, triggers, hooks
- `references/skill-creation-workflow.md` - End-to-end skill creation process
- `references/skill-writing-guide.md` - Writing principles and mental models
- `references/skill-description-guide.md` - Description optimization and triggers

### CLAUDE.md
- `references/initialization-workflow.md` - Creating new CLAUDE.md
- `references/optimization-patterns.md` - Token reduction techniques
- `references/integration-strategies.md` - Global config, MCP tools
- `references/output-templates.md` - Standard output formats

---

## Skill Routing

| Task | Where | What it handles |
|------|-------|-----------------|
| Skill/agent **prompt content** (soul, tensions, mental models, anti-patterns) | `Skill("prompt-architect")` | Content quality, dialectic design, freedom calibration |
| Skill **structure** (frontmatter, directory, progressive disclosure, description) | This skill | Architecture, triggering strategy, token budgeting |
| CLAUDE.md creation/optimization | This skill | Initialization workflow, token reduction |

When creating or editing skills/agents: this skill for structure → `prompt-architect` for body content.

---

**Documentation:**
- llms.txt: https://context7.com/websites/claude_en_claude-code/llms.txt?tokens=10000
- Main docs: https://docs.claude.com/en/docs/claude-code/
- GitHub: https://github.com/anthropics/claude-code
