---
name: claude-md-architect
description: Initialize, optimize, and enhance CLAUDE.md files for projects. Analyzes codebase context to generate production-ready project instructions following Anthropic best practices. Use when user requests "init claude.md", "create project instructions", "optimize CLAUDE.md", or mentions project setup for Claude Code.
---

# CLAUDE.md Architect Skill

## Purpose

Generate and optimize CLAUDE.md files for software projects by analyzing codebase context and applying Anthropic engineering best practices. Creates concise, maintainable project instructions that maximize Claude Code effectiveness while minimizing token consumption.

## When to Use This Skill

Use this skill when:
- User requests "init CLAUDE.md" or "create project instructions"
- User asks to "optimize" or "improve" existing CLAUDE.md
- User mentions "setup Claude for my project"
- User wants project-specific instructions for Claude Code
- Starting work on a new project that needs documentation
- Existing CLAUDE.md is outdated or ineffective

## Core Principles

1. **Conciseness over Completeness**: Treat CLAUDE.md like frequently-used prompts, not exhaustive documentation
2. **Evidence-Based Context**: Analyze actual codebase before making recommendations
3. **Incremental Refinement**: Start minimal, iterate based on effectiveness
4. **Token Efficiency**: Every line should earn its presence in the context window
5. **Human-Readable Structure**: Use clear organization with XML tags for parsing

## Workflow: Initialize New CLAUDE.md

### Phase 1: Discovery & Analysis

**1. Codebase Exploration**
```
Tasks to complete:
- Identify project type (web app, library, CLI, mobile, etc.)
- Detect languages, frameworks, and key dependencies
- Find existing documentation (README, contributing guides, wiki)
- Locate test infrastructure and conventions
- Identify build/deploy tooling (package.json scripts, Makefile, etc.)
- Map directory structure and architectural patterns
- Check for existing .claude/ directory and settings
```

**2. Context Extraction**
```
Extract from codebase:
- Code style patterns (indentation, naming conventions, file organization)
- Testing approach (unit/integration/e2e frameworks, coverage expectations)
- Common commands (dev server, build, test, deploy)
- Environment setup requirements
- Git workflow conventions
- Performance considerations (if applicable)
- Security requirements (if applicable)
```

**3. Anti-Pattern Detection**
```
Check for problematic patterns that CLAUDE.md should prevent:
- Inconsistent code style across files
- Missing test coverage in critical areas
- Outdated dependencies or insecure practices
- Lack of error handling standards
- Missing documentation for complex logic
```

### Phase 2: Structure Generation

**Template Selection Based on Project Type:**

**For Web Applications:**
```markdown
# [Project Name] - Development Guide

## Project Context
[2-3 sentences: what it does, primary tech stack, target users]

## Core Principles
- [Key architectural pattern, e.g., "Server-side rendering with Next.js"]
- [Important constraint, e.g., "Mobile-first responsive design"]
- [Critical requirement, e.g., "WCAG 2.1 AA accessibility compliance"]

## Development Workflow

### Common Commands
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build with type checking
npm run test         # Run Jest unit tests
npm run test:e2e     # Playwright E2E tests (requires dev server)
npm run lint         # ESLint + Prettier check
```

### Code Style
- TypeScript strict mode enabled
- Functional components with hooks (no class components)
- Tailwind CSS for styling (no CSS-in-JS)
- File naming: `kebab-case.tsx` for components, `camelCase.ts` for utilities

### Testing Requirements
- New features require unit tests (>80% coverage)
- User flows need E2E tests in `tests/e2e/`
- Use Testing Library queries (avoid testids when possible)

### File Organization
```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable UI components
├── lib/          # Business logic and utilities
├── hooks/        # Custom React hooks
└── types/        # TypeScript type definitions
```

## Before Making Changes

1. **Read relevant files first** - Don't jump straight to coding
2. **Check existing patterns** - Match architectural decisions
3. **Run tests after changes** - Verify nothing broke
4. **Consider mobile views** - Test responsive behavior

## Context Loading

Load these files for context when working on:
- **Authentication**: `@src/lib/auth.ts`, `@src/middleware.ts`
- **API routes**: `@src/app/api/`, `@src/lib/db/`
- **UI components**: `@src/components/`, `@tailwind.config.ts`

## MCP Tools Available
- `context7`: Use for official React/Next.js documentation
- `magic`: Use for generating new UI components
```

**For Backend APIs:**
```markdown
# [Project Name] - API Development Guide

## Project Context
[Brief description of API purpose, authentication, primary data models]

## Architecture
- RESTful API with Express.js
- PostgreSQL with Prisma ORM
- JWT authentication with refresh tokens
- Redis caching for frequently accessed data

## Development Commands
```bash
npm run dev          # Nodemon with hot reload (port 3001)
npm run db:migrate   # Apply Prisma migrations
npm run db:seed      # Seed development data
npm run test         # Jest unit + integration tests
npm run test:watch   # Test watcher for TDD
```

## Code Standards

### API Conventions
- RESTful routes: `/api/v1/resource`
- Response format: `{data, error, meta}` structure
- Error codes: Follow RFC 7807 Problem Details
- Versioning: URL-based (v1, v2) for breaking changes

### Database Patterns
- Use Prisma transactions for multi-table operations
- Index foreign keys and frequently queried fields
- Soft deletes for user data (deletedAt field)
- UTC timestamps for all datetime fields

### Security Requirements
- Validate all inputs with Zod schemas
- Rate limiting: 100 req/min per IP on public routes
- SQL injection prevention via Prisma (never raw queries)
- Sensitive data encryption at rest (PII fields)

### Testing Strategy
- Unit tests for business logic (services/)
- Integration tests for API endpoints (controllers/)
- Mock external APIs in tests (use MSW)
- Minimum 85% coverage on critical paths

## Before Implementing Features

1. **Check API design** - RESTful? Idempotent where needed?
2. **Define validation schema** - Zod schema before route handler
3. **Consider caching** - Frequently read, rarely updated?
4. **Plan error handling** - What can fail? User-friendly messages?

## Environment Setup
```bash
cp .env.example .env.local  # Configure DATABASE_URL, JWT_SECRET
npm run db:migrate          # Apply schema
npm run db:seed             # Load test data
```

## Useful Context Files
- **Authentication**: `@src/middleware/auth.ts`, `@src/services/token.service.ts`
- **Database**: `@prisma/schema.prisma`, `@src/lib/db.ts`
- **Validation**: `@src/schemas/`, `@src/middleware/validate.ts`
```

**For CLI Tools:**
```markdown
# [Project Name] - CLI Development Guide

## Project Context
[Brief: CLI purpose, primary commands, target users]

## Architecture
- Node.js CLI with Commander.js
- TypeScript for type safety
- Chalk for colored output, Inquirer for prompts

## Commands
```bash
npm run build        # Compile TypeScript to dist/
npm run dev          # Watch mode for development
npm run test         # Jest tests with coverage
npm link             # Symlink for local testing (use `mycli` globally)
```

## Code Standards

### CLI Conventions
- Commands: Verb-noun pattern (`mycli create project`)
- Flags: Long form `--verbose`, short `-v`
- Output: Use Chalk (green=success, red=error, yellow=warning)
- Errors: Exit code 1 with clear message, never silent failures

### User Experience
- Interactive prompts for missing required args (Inquirer)
- Progress indicators for long operations (Ora spinners)
- Confirmation prompts before destructive actions
- Help text for all commands (`--help` flag)

### File Operations
- Check file existence before reading/writing
- Use fs-extra for cross-platform compatibility
- Respect .gitignore patterns when scanning directories
- Create backups before overwriting user files

## Testing Approach
- Unit tests for core logic (src/lib/)
- Integration tests for command execution (spawn CLI)
- Test stdout/stderr output validation
- Mock file system operations (memfs)

## Before Adding Commands

1. **Check existing commands** - Consistent naming/patterns?
2. **Plan error scenarios** - Network fails, file locked, invalid input?
3. **Design output format** - Human-readable? JSON flag for scripting?
4. **Consider undo/rollback** - How to revert if fails midway?
```

### Phase 3: Intelligent Defaults

**Context Loading Strategy:**
```markdown
## Context Loading Guidelines

### Use @-syntax ONLY for:
- Small, universally relevant files (<100 lines)
- Configuration that affects all changes (tsconfig, .eslintrc)
- Core type definitions used everywhere

### Use On-Demand Loading:
- Specify context conditionally: "When working on X, read @path/to/file"
- Group related files: "For authentication work: @lib/auth.ts, @middleware.ts"

### Avoid:
- Loading entire directories with @src/**
- Adding large files that aren't always needed
- Injecting documentation that duplicates official sources
```

**Workflow Routing (if needed for complex projects):**
```markdown
## Task Routing

When user requests involve:
- **New UI components** → Use `/ui` or magic MCP tool
- **Library documentation** → Use context7 MCP (official docs)
- **Browser testing** → Use Playwright MCP for E2E validation
- **Complex refactoring** → Create plan first, then implement incrementally

Use `/plan` mode for:
- Features requiring >3 files to change
- Architectural changes affecting multiple modules
- When approach is unclear or multiple options exist
```

### Phase 4: Validation & Output

**Quality Checklist:**
```
Before presenting CLAUDE.md:
✓ File is <400 lines (prefer <250)
✓ Commands are accurate (verified against package.json/Makefile)
✓ Code patterns match actual codebase conventions
✓ No redundant information already in README
✓ Context loading is selective, not exhaustive
✓ Structure uses clear sections with headers
✓ Examples are concrete, not generic advice
✓ Security/testing requirements reflect actual needs
```

**Output Format:**
```
1. Present the generated CLAUDE.md content
2. Explain key decisions and customizations
3. Suggest optional additions based on project maturity
4. Provide next steps (where to save, how to iterate)
```

## Workflow: Optimize Existing CLAUDE.md

### Phase 1: Analysis

**1. Read Current CLAUDE.md**
```
Evaluate against best practices:
- Token efficiency: Is content concise or verbose?
- Accuracy: Do commands/patterns match current codebase?
- Relevance: Is information actionable or generic advice?
- Structure: Clear sections or wall of text?
- Scope: Focused on essentials or trying to document everything?
```

**2. Identify Issues**
```
Common anti-patterns to fix:
- Redundant content (repeats README or official docs)
- Outdated commands or deprecated patterns
- Generic advice not specific to this project
- Missing critical context (e.g., testing requirements)
- Over-use of @-syntax (entire directories loaded)
- Verbose explanations where concise instructions suffice
```

**3. Measure Token Usage**
```
Calculate approximate token count:
- Current file size / 4 = rough token estimate
- Identify high token-to-value sections
- Flag content that doesn't guide Claude's actions
```

### Phase 2: Optimization

**Token Reduction Techniques:**

**Before:**
```markdown
When you are implementing new features in this codebase, it's very important that you always make sure to write comprehensive tests for all the functionality you add. We use Jest as our testing framework, and we expect all new code to have at least 80% code coverage. You should write unit tests for individual functions and integration tests for API endpoints.
```

**After:**
```markdown
### Testing Requirements
- New features require tests (Jest, >80% coverage)
- Unit tests: Individual functions in `src/lib/`
- Integration tests: API endpoints with Supertest
```

**Savings:** 70% token reduction, same information

---

**Before:**
```markdown
@src/**/*.ts
@src/**/*.tsx
@tests/**/*.test.ts
@package.json
@tsconfig.json
@README.md
```

**After:**
```markdown
## Context Loading
Load conditionally based on task:
- **API work**: `@src/routes/`, `@src/services/`
- **UI work**: `@src/components/`, `@tailwind.config.ts`
- **Config always**: `@package.json`, `@tsconfig.json`
```

**Savings:** 85% reduction in auto-loaded context

---

**Content Prioritization:**
```
Keep (High Value):
- Project-specific commands and scripts
- Code style conventions unique to this project
- File organization patterns
- Testing requirements and strategies
- Security constraints
- Performance considerations

Remove (Low Value):
- Generic software engineering advice
- Information already in README
- Obvious best practices (DRY, SOLID, etc.)
- Detailed explanations of frameworks (use context7 instead)
- Step-by-step tutorials (link to docs instead)
```

### Phase 3: Structural Improvements

**Apply Clean Architecture:**
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

**XML Integration for Complex Projects:**
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

### Phase 4: Validation & Iteration

**Effectiveness Testing:**
```
After optimization, verify:
1. Token count reduced by >40% (if bloated originally)
2. All critical project info retained
3. Commands are still accurate
4. Structure is more scannable
5. On-demand context replaces auto-loading
```

**Iterative Refinement:**
```
Suggest to user:
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

### From Claude Code Best Practices

**1. Specificity Trumps Verbosity**
```
❌ Bad: "Make sure to follow best practices when writing tests"
✅ Good: "Test edge cases: null inputs, empty arrays, unauthorized access"
```

**2. Iterate on Effectiveness**
```
- Start minimal (core commands + key constraints)
- Add sections as needs become clear
- Remove unused guidance after 1-2 weeks
- Measure: Does this make Claude more effective?
```

**3. Use Visual References**
```
When applicable, include:
- Directory tree structure
- Example command output
- API response format examples
- Error message examples
```

**4. Enable Extended Thinking**
```
For complex projects, add:
"For architectural decisions or complex refactoring, think through:
1. Current implementation analysis
2. Alternative approaches
3. Tradeoff evaluation
4. Selected approach rationale"
```

### From pincc.ai Tips

**1. Core Identity & Mission**
```
Add at top of CLAUDE.md for complex projects:
"You are a [role] for [project type]. Your mission is to [primary goal] while maintaining [key constraint]."

Example:
"You are a backend API developer for a healthcare SaaS platform. Your mission is to implement features that prioritize HIPAA compliance and data security."
```

**2. Workflow Routing Engine**
```
For projects with distinct work types:

<workflow_routing>
Priority 10: If user says "/deploy" → Use deployment workflow
Priority 9: If keywords: "bug", "error", "broken" → Debug workflow
Priority 8: If keywords: "test", "coverage" → Testing workflow
Priority 5: If keywords: "feature", "implement", "add" → Feature workflow
Default: Analyze request, ask for clarification if ambiguous
</workflow_routing>
```

**3. Ultrathink Protocol**
```
For critical operations:

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

**4. Security & Safety Constraints**
```
<constraints>
- NEVER commit secrets, API keys, or credentials
- NEVER run destructive operations without confirmation
- NEVER skip migrations (create new ones instead)
- ALWAYS validate user input in API endpoints
- ALWAYS use parameterized queries (no string concatenation)
- REQUIRE explicit approval for: force push, drop table, delete user data
</constraints>
```

**5. Context Management Strategy**
```
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

## Advanced Features

### Custom Slash Commands Integration

**When to suggest:**
- Project has >3 frequently repeated workflows
- Common task requires >5 manual steps
- Team follows specific process (e.g., PR checklist)

**Example suggestion:**
```
"Your project would benefit from custom slash commands:

Create .claude/commands/test-feature.md:
```
Run all tests for a feature area:
1. Run unit tests matching the feature name
2. Run related integration tests
3. Check test coverage report
4. If coverage <80%, identify untested code paths
```

Usage: `/test-feature authentication`

Would you like me to create these commands?"
```

### MCP Tool Configuration

**Detect opportunities:**
```
Check for:
- React/Vue/Angular imports → Suggest context7 for official docs
- UI component requests → Suggest magic MCP for 21st.dev patterns
- E2E test files → Suggest Playwright MCP for browser automation
- API documentation needs → Suggest context7 for OpenAPI/Swagger
```

**Add to CLAUDE.md:**
```markdown
## MCP Tools Configuration

### context7 (Official Documentation)
Use for:
- React hooks best practices: `/resolve react → /get-docs`
- Next.js routing patterns: `/resolve next.js → /get-docs`
- Prisma schema syntax: `/resolve prisma → /get-docs`

### magic (UI Component Generation)
Use for:
- New component requests: "create a searchable data table"
- Component refinement: "make this form more accessible"
- Design system patterns: "responsive card grid layout"

### Playwright (E2E Testing)
Use for:
- User flow validation: "test checkout process"
- Visual regression: "screenshot comparison on mobile"
- Accessibility audit: "check WCAG compliance"
```

## Output Guidelines

### When Generating New CLAUDE.md

**Presentation format:**
```
1. Display the generated CLAUDE.md content in a code block
2. Explain customizations based on codebase analysis
3. Highlight key decisions (why X over Y)
4. Suggest optional additions
5. Provide installation instructions
```

**Example:**
```
I've analyzed your Next.js project and generated a CLAUDE.md optimized for your stack:

[Show CLAUDE.md content]

Key customizations:
- Added app router-specific file organization
- Included your Prettier/ESLint config patterns
- Detected Playwright tests, added E2E workflow guidance
- Configured context7 for React/Next.js official docs

Optional additions (if needed later):
- Deployment workflow for Vercel
- Database migration process (saw Prisma, but no clear migration docs)
- Storybook component documentation process

Save to: .claude/CLAUDE.md (or project root)

Next step: Try Claude Code on a small task and iterate based on effectiveness.
```

### When Optimizing Existing CLAUDE.md

**Presentation format:**
```
1. Summarize issues found
2. Show before/after comparison for key sections
3. Present optimized full version
4. Quantify improvements (token savings, clarity gains)
5. Suggest iteration approach
```

**Example:**
```
Analysis of your current CLAUDE.md:

Issues identified:
- 847 tokens (could be reduced to ~350)
- Generic advice duplicating README
- Auto-loading entire src/ directory (high token cost)
- Missing workflow routing for common tasks

Token optimization example:

Before (127 tokens):
[Show verbose section]

After (38 tokens):
[Show concise version]

Savings: 70% reduction, same guidance

[Show full optimized CLAUDE.md]

Improvements:
- Token count: 847 → 362 (57% reduction)
- On-demand context loading (saves ~200 tokens per request)
- Added workflow routing for bug fixes, features, tests
- Removed generic content duplicated in README

Suggested iteration:
1. Use this version for 3-5 Claude Code sessions
2. Note any missing context (add to on-demand loading)
3. Remove sections that never get referenced
4. Consider custom slash commands if patterns emerge
```

## Quality Standards

### Mandatory Elements

Every CLAUDE.md must include:
- ✓ Project context (tech stack, purpose)
- ✓ Common commands (dev, build, test)
- ✓ Code style conventions (if project has specific patterns)
- ✓ File organization overview
- ✓ Where to find key files (authentication, config, etc.)

### Prohibited Content

Never include:
- ✗ Generic software engineering principles (user has global PRINCIPLES.md)
- ✗ Framework tutorials (use context7 MCP instead)
- ✗ Extensive copy-paste from README
- ✗ Obvious best practices without project-specific application
- ✗ Auto-loading of large directories (>100 files)

### Token Budget Guidelines

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

## Integration with Global CLAUDE.md

**User has ~/.claude/CLAUDE.md (global):**
- Contains universal principles (SOLID, DRY, YAGNI)
- Contains MCP tool documentation
- Contains preferred communication style

**Project CLAUDE.md should:**
- Focus exclusively on project-specific guidance
- Reference global patterns: "Follow SOLID principles (see global CLAUDE.md)"
- Avoid duplicating MCP tool usage (already documented globally)
- Add project-specific MCP tool applications only

**Example:**
```markdown
# MyProject - Development Guide

> Note: General software engineering principles are in your global CLAUDE.md.
> This guide focuses on project-specific patterns and requirements.

## Project Context
[Specific to this project only]

## Code Standards
[Only patterns unique to this codebase, not universal practices]
```

## Implementation Checklist

Before presenting CLAUDE.md to user:

**Discovery Phase:**
- [ ] Explored project structure (directories, key files)
- [ ] Identified language, framework, testing setup
- [ ] Read package.json/Makefile/docker-compose for commands
- [ ] Checked for existing documentation to avoid duplication
- [ ] Detected code style patterns (naming, organization)

**Generation Phase:**
- [ ] Selected appropriate template (web/API/CLI/library)
- [ ] Customized based on actual codebase patterns
- [ ] Verified commands are accurate
- [ ] Used concise language (removed fluff)
- [ ] Structured with clear sections

**Optimization Phase (if improving existing):**
- [ ] Identified token waste (generic advice, redundancy)
- [ ] Converted auto-loading to on-demand context
- [ ] Removed outdated or inaccurate information
- [ ] Condensed verbose sections
- [ ] Preserved all critical project-specific guidance

**Validation Phase:**
- [ ] Token count is reasonable for project complexity
- [ ] All commands verified against current codebase
- [ ] No generic content duplicating global CLAUDE.md or README
- [ ] Structure is scannable (clear headers, concise bullets)
- [ ] Context loading strategy is selective

**Output Phase:**
- [ ] Presented full CLAUDE.md content
- [ ] Explained key customizations
- [ ] Quantified improvements (if optimization)
- [ ] Suggested next steps and iteration approach
- [ ] Offered optional additions

## Success Metrics

**Effective CLAUDE.md indicators:**
- Claude Code requires fewer clarifying questions
- Code changes match project conventions on first try
- Test coverage maintained/improved consistently
- Commands work without "command not found" errors
- User rarely needs to provide missing context manually

**Ineffective CLAUDE.md indicators:**
- Claude frequently asks "what testing framework?"
- Generated code doesn't match existing style
- User repeatedly provides same context files
- CLAUDE.md contains info never referenced in practice

## Maintenance Strategy

**Suggest to user after creation:**
```
Your CLAUDE.md is ready. Maintenance recommendations:

1. **Immediate (next 1-2 days)**
   - Use Claude Code on 3-5 real tasks
   - Note any missing context or unclear guidance
   - Verify commands work as documented

2. **Short-term (first 2 weeks)**
   - Add on-demand context for files frequently needed
   - Remove sections that never get referenced
   - Update if project patterns evolve

3. **Long-term (monthly)**
   - Review after major dependency updates
   - Prune outdated information
   - Add new conventions if patterns solidify

4. **Signs to update**
   - Framework upgrade (React 17→18, Next 12→14)
   - Architecture change (REST→GraphQL, monolith→microservices)
   - New team conventions adopted
   - Claude consistently missing context you expect it to have
```

## Advanced Scenarios

### Multi-Language Projects

```markdown
# Polyglot Project - Development Guide

## Stack Overview
- **Frontend**: React (TypeScript) + Vite
- **Backend**: Python (FastAPI) + PostgreSQL
- **Mobile**: React Native (TypeScript)

## Context Loading by Area

When working on frontend:
  @frontend/package.json
  @frontend/tsconfig.json
  @frontend/src/components/

When working on backend:
  @backend/pyproject.toml
  @backend/app/main.py
  @backend/app/models/

When working on mobile:
  @mobile/package.json
  @mobile/src/screens/

## Commands by Context
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && poetry run uvicorn app.main:app --reload

# Mobile
cd mobile && npx expo start
```

## Standards Vary by Language
- **TypeScript**: Functional components, Zod validation
- **Python**: Type hints (mypy strict), Pydantic models
- **Shared**: RESTful API conventions, UTC timestamps
```

### Monorepo Projects

```markdown
# Monorepo - Development Guide

## Architecture
```
apps/
├── web/          # Next.js customer portal
├── admin/        # React admin dashboard
└── api/          # Express.js backend

packages/
├── ui/           # Shared component library
├── config/       # ESLint, TypeScript configs
└── types/        # Shared TypeScript types
```

## Workspace Commands
```bash
npm run dev          # All apps concurrently
npm run dev --workspace=web   # Single app
npm run build --workspaces    # All apps
npm run test --workspace=packages/ui
```

## When Making Changes

1. **Shared packages**: Affects all consumers, requires version bump
2. **Apps**: Independent, but check for shared package impacts
3. **Config changes**: Test across all workspaces

## Context Loading
When working on specific app:
  @apps/[app-name]/
  @packages/ui/ (if UI changes)
  @packages/types/ (if type changes)
```

### Legacy Codebase

```markdown
# Legacy System - Modernization Guide

## Current State
- Mixed JavaScript/TypeScript (~60% migrated)
- Class components + hooks (transitioning)
- REST API with inconsistent patterns

## Modernization Strategy

<constraints>
- NEVER break existing APIs (versioning required)
- PREFER refactoring over rewriting
- REQUIRE tests before refactoring (characterization tests)
- ADD new features in TypeScript, modern patterns
</constraints>

## Pattern Decision Tree

When adding features:
1. **New files** → TypeScript, functional components, modern patterns
2. **Modifying existing** → Match existing style (unless explicit refactor task)
3. **Refactoring** → Add tests first, incremental changes, verify with stakeholders

## Before Refactoring

<refactoring_checklist>
- [ ] Characterization tests capture current behavior?
- [ ] Change affects <5 files (small, reversible)?
- [ ] Backward compatibility verified?
- [ ] Team approved scope?
</refactoring_checklist>

## File Organization
```
src/
├── legacy/       # Class components, old patterns (preserve until migrated)
├── modern/       # New TypeScript, functional components
└── shared/       # Utilities (being modernized incrementally)
```
```

## Final Notes

**Philosophy:**
- CLAUDE.md is a living document, not permanent documentation
- Start minimal, add based on actual friction points
- Remove guidance that doesn't improve Claude's output
- Measure effectiveness: fewer clarifying questions = better CLAUDE.md

**When in doubt:**
- Prefer concise over comprehensive
- Prefer specific over generic
- Prefer examples over explanations
- Prefer on-demand over auto-loading

**Remember:**
- User has global principles in ~/.claude/PRINCIPLES.md
- User has MCP documentation in ~/.claude/MCP_*.md
- Project CLAUDE.md should not duplicate these
- Focus exclusively on project-specific patterns and requirements
