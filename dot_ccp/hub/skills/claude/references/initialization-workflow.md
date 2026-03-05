# Initialization Workflow

Complete guide for creating new CLAUDE.md files from scratch.

## Phase 1: Discovery & Analysis

### 1. Codebase Exploration

Tasks to complete:
- Identify project type (web app, library, CLI, mobile, etc.)
- Detect languages, frameworks, and key dependencies
- Find existing documentation (README, contributing guides, wiki)
- Locate test infrastructure and conventions
- Identify build/deploy tooling (package.json scripts, Makefile, etc.)
- Map directory structure and architectural patterns
- Check for existing .claude/ directory and settings

### 2. Context Extraction

Extract from codebase:
- Code style patterns (indentation, naming conventions, file organization)
- Testing approach (unit/integration/e2e frameworks, coverage expectations)
- Common commands (dev server, build, test, deploy)
- Environment setup requirements
- Git workflow conventions
- Performance considerations (if applicable)
- Security requirements (if applicable)

### 3. Anti-Pattern Detection

Check for problematic patterns that CLAUDE.md should prevent:
- Inconsistent code style across files
- Missing test coverage in critical areas
- Outdated dependencies or insecure practices
- Lack of error handling standards
- Missing documentation for complex logic

## Phase 2: Structure Generation

### Template Selection Based on Project Type

#### For Web Applications

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

#### For Backend APIs

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

#### For CLI Tools

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

## Phase 3: Intelligent Defaults

### Context Loading Strategy

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

### Workflow Routing (if needed for complex projects)

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

## Phase 4: Validation & Output

### Quality Checklist

Before presenting CLAUDE.md:
- ✓ File is <400 lines (prefer <250)
- ✓ Commands are accurate (verified against package.json/Makefile)
- ✓ Code patterns match actual codebase conventions
- ✓ No redundant information already in README
- ✓ Context loading is selective, not exhaustive
- ✓ Structure uses clear sections with headers
- ✓ Examples are concrete, not generic advice
- ✓ Security/testing requirements reflect actual needs

### Output Format

1. Present the generated CLAUDE.md content
2. Explain key decisions and customizations
3. Suggest optional additions based on project maturity
4. Provide next steps (where to save, how to iterate)

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
