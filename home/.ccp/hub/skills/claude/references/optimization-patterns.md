# Optimization Patterns

Techniques for reducing token usage and improving CLAUDE.md effectiveness.

## Analysis Process

### 1. Read Current CLAUDE.md

Evaluate against best practices:
- Token efficiency: Is content concise or verbose?
- Accuracy: Do commands/patterns match current codebase?
- Relevance: Is information actionable or generic advice?
- Structure: Clear sections or wall of text?
- Scope: Focused on essentials or trying to document everything?

### 2. Identify Issues

Common anti-patterns to fix:
- Redundant content (repeats README or official docs)
- Outdated commands or deprecated patterns
- Generic advice not specific to this project
- Missing critical context (e.g., testing requirements)
- Over-use of @-syntax (entire directories loaded)
- Verbose explanations where concise instructions suffice

### 3. Measure Token Usage

Calculate approximate token count:
- Current file size / 4 = rough token estimate
- Identify high token-to-value sections
- Flag content that doesn't guide Claude's actions

## Token Reduction Techniques

### Example 1: Verbose to Concise

**Before (180 tokens):**
```markdown
When you are implementing new features in this codebase, it's very important that you always make sure to write comprehensive tests for all the functionality you add. We use Jest as our testing framework, and we expect all new code to have at least 80% code coverage. You should write unit tests for individual functions and integration tests for API endpoints.
```

**After (54 tokens):**
```markdown
### Testing Requirements
- New features require tests (Jest, >80% coverage)
- Unit tests: Individual functions in `src/lib/`
- Integration tests: API endpoints with Supertest
```

**Savings:** 70% token reduction, same information

### Example 2: Context Loading Optimization

**Before (200+ tokens per request):**
```markdown
@src/**/*.ts
@src/**/*.tsx
@tests/**/*.test.ts
@package.json
@tsconfig.json
@README.md
```

**After (30 tokens):**
```markdown
## Context Loading
Load conditionally based on task:
- **API work**: `@src/routes/`, `@src/services/`
- **UI work**: `@src/components/`, `@tailwind.config.ts`
- **Config always**: `@package.json`, `@tsconfig.json`
```

**Savings:** 85% reduction in auto-loaded context

## Content Prioritization

### Keep (High Value)
- Project-specific commands and scripts
- Code style conventions unique to this project
- File organization patterns
- Testing requirements and strategies
- Security constraints
- Performance considerations

### Remove (Low Value)
- Generic software engineering advice
- Information already in README
- Obvious best practices (DRY, SOLID, etc.)
- Detailed explanations of frameworks (use context7 instead)
- Step-by-step tutorials (link to docs instead)

## Structural Improvements

### Apply Clean Architecture

```markdown
# Project Name

## Quick Reference
[Most frequently needed commands and patterns]

## Project Context
[2-3 sentences: tech stack, purpose, key constraints]

## Development Workflow
[Commands, setup, common tasks]

## Code Standards
[Conventions specific to this project]

## Before Making Changes
[Pre-flight checklist for Claude]

## Context Loading
[Selective file references]

## MCP Tools
[Available tools and when to use them]
```

### XML Integration for Complex Projects

```markdown
<workflow_routing>
When user request matches:
- "add test" → Read test files, match existing patterns
- "implement API" → Load @src/routes/, @src/services/, validate schemas first
- "fix bug" → Reproduce issue, read related files, apply minimal fix
</workflow_routing>

<constraints>
- Never modify database migrations (create new ones)
- Preserve backward compatibility in public APIs
- Require code review for authentication changes
</constraints>
```

## Effectiveness Testing

After optimization, verify:
1. Token count reduced by >40% (if bloated originally)
2. All critical project info retained
3. Commands are still accurate
4. Structure is more scannable
5. On-demand context replaces auto-loading

## Iterative Refinement

Suggest to user:
```
"I've optimized your CLAUDE.md from ~X tokens to ~Y tokens (Z% reduction).

Key changes:
- Removed generic advice duplicated in your README
- Converted auto-loading (@src/**) to on-demand context
- Condensed verbose explanations to concise checklists
- Added workflow routing for common tasks

Next steps:
1. Save this version to .claude/CLAUDE.md (or project root)
2. Use Claude Code on your project for 1-2 days
3. Note any missing context or unclear instructions
4. Iterate based on actual usage patterns

Would you like me to:
- Add specific sections (e.g., deployment, debugging)?
- Create custom slash commands for frequent workflows?
- Set up MCP tool integration?"
```

## Best Practices from Anthropic Engineering

### 1. Specificity Trumps Verbosity

```
❌ Bad: "Make sure to follow best practices when writing tests"
✅ Good: "Test edge cases: null inputs, empty arrays, unauthorized access"
```

### 2. Iterate on Effectiveness

- Start minimal (core commands + key constraints)
- Add sections as needs become clear
- Remove unused guidance after 1-2 weeks
- Measure: Does this make Claude more effective?

### 3. Use Visual References

When applicable, include:
- Directory tree structure
- Example command output
- API response format examples
- Error message examples

### 4. Enable Extended Thinking

For complex projects, add:
```
"For architectural decisions or complex refactoring, think through:
1. Current implementation analysis
2. Alternative approaches
3. Tradeoff evaluation
4. Selected approach rationale"
```

## Advanced Patterns from pincc.ai

### 1. Core Identity & Mission

Add at top of CLAUDE.md for complex projects:
```markdown
"You are a [role] for [project type]. Your mission is to [primary goal] while maintaining [key constraint]."

Example:
"You are a backend API developer for a healthcare SaaS platform. Your mission is to implement features that prioritize HIPAA compliance and data security."
```

### 2. Workflow Routing Engine

For projects with distinct work types:

```markdown
<workflow_routing>
Priority 10: If user says "/deploy" → Use deployment workflow
Priority 9: If keywords: "bug", "error", "broken" → Debug workflow
Priority 8: If keywords: "test", "coverage" → Testing workflow
Priority 5: If keywords: "feature", "implement", "add" → Feature workflow
Default: Analyze request, ask for clarification if ambiguous
</workflow_routing>
```

### 3. Ultrathink Protocol

For critical operations:

```markdown
<ultrathink_triggers>
Engage deep thinking before:
- Database schema changes
- Authentication/authorization modifications
- Breaking API changes
- Deployment configuration updates
- Dependency upgrades (major versions)

Process:
1. Clarify objective with user
2. Analyze implications (data loss risk, backward compat, security)
3. Present options with tradeoffs
4. Get explicit approval
5. Implement with rollback plan
</ultrathink_triggers>
```

### 4. Security & Safety Constraints

```markdown
<constraints>
- NEVER commit secrets, API keys, or credentials
- NEVER run destructive operations without confirmation
- NEVER skip migrations (create new ones instead)
- ALWAYS validate user input in API endpoints
- ALWAYS use parameterized queries (no string concatenation)
- REQUIRE explicit approval for: force push, drop table, delete user data
</constraints>
```

### 5. Context Management Strategy

```markdown
# Context Loading Strategy

## Always Load (Global Context)
@package.json
@tsconfig.json
@.env.example

## Conditional Loading (On-Demand)
When working on authentication:
  @src/lib/auth.ts
  @src/middleware/authenticate.ts
  @prisma/schema.prisma (User model)

When working on API routes:
  @src/schemas/validation.ts
  @src/lib/api-response.ts

When working on UI components:
  @src/components/
  @tailwind.config.ts
  @src/styles/globals.css

## Never Load
- node_modules/
- dist/, build/ (generated files)
- .next/, .cache/ (framework internals)
```

## Token Budget Guidelines

Target sizes by project complexity:
- **Simple (single-purpose tool):** 100-200 tokens
- **Medium (standard web app):** 200-400 tokens
- **Complex (multi-service platform):** 400-800 tokens
- **Maximum (exception only):** 1000 tokens

If approaching max, split into:
- `.claude/CLAUDE.md` (essentials)
- `.claude/ARCHITECTURE.md` (reference, not auto-loaded)
- `.claude/commands/*.md` (workflows as slash commands)

## Error Prevention

### Common Mistakes to Avoid

**1. Over-Documentation**
```
Problem: Trying to document every possible scenario
Solution: Document project-specific decisions only
```

**2. Stale Information**
```
Problem: Commands/patterns no longer match codebase
Solution: Verify against current package.json, actual files
```

**3. Redundant Context**
```
Problem: README says "React SPA", CLAUDE.md repeats it extensively
Solution: Link to README, add only project-specific React patterns
```

**4. Token Waste**
```
Problem: Auto-loading entire src/ directory
Solution: On-demand context by functional area
```

**5. Generic Fluff**
```
Problem: "Make sure code is maintainable and follows best practices"
Solution: "Match existing patterns: functional components, Zod validation, Prisma transactions"
```
