---
name: mise-expert
description: "mise — the tool-version manager, env-var loader, and task runner that replaces asdf, direnv, and make. Use for anything touching mise.toml or .tool-versions: installing or pinning tools, choosing a backend (core, aqua, github, cargo, npm, pipx), env vars, tasks, CI setup, migrating from asdf/direnv/make/npm scripts, and install failures — including attestation/cosign/SLSA verification errors."
---

# Mise Expert Skill

## Check live docs first

mise ships several releases a month, and backends, settings, env vars and flags change between them. This file is a snapshot checked against **mise 2026.9.14 (2026-09-25)**; treat it as a map of where to look, not as the current truth.

Before giving syntax, a setting name, an env var, a flag, or a backend recommendation, confirm it against a live source, in this order:

1. **The installed binary** — `mise --version`, `mise help <command>`, `mise settings ls`, `mise registry <tool>`, `mise doctor`. Authoritative for what this machine runs.
2. **Current docs** — context7 (resolve the `mise` library ID, then query the topic), or https://mise.jdx.dev. Use `mcp__parallax__fetch_page` if WebFetch fails.
3. **What changed since the snapshot** — the release notes at https://github.com/jdx/mise/releases, when the installed version is newer than the one above or the user hits behavior this file doesn't match.

How often each part of this file needs that check:

| Label | Sections | Query live docs |
|-------|----------|-----------------|
| **volatile** | Backends, Security Verification, the attestation and `ubi` troubleshooting entries, CI/CD Integration | Every time |
| **drifts** | Configuration Patterns, Variables and Environment Management, Migration Strategies | When quoting exact keys or syntax |
| **stable** | Task Configuration Principles, Decision Framework, Best Practices Checklist, Anti-Patterns to Avoid | Only if the user reports a mismatch |

Label what you give the user: name the source and version you checked against ("per `mise help use` on 2026.9.14", "per mise.jdx.dev/configuration"). If you could only use this file, say "from the skill's 2026.9.14 snapshot, not verified live". When a live source contradicts this file, follow the live source and tell the user this skill is out of date.

## Backends

mise uses backends to install tools. Backend selection affects security verification, performance, and compatibility.

<backends>
**Tier 1 (Recommended)**

| Backend | Syntax | Use For |
|---------|--------|---------|
| core | `node`, `python`, `go` | Built-in tools (node, python, bun, deno, java, go, erlang, dotnet). Rust-native, best performance. |
| aqua | `aqua:owner/repo` | Tools in aqua-registry. Native security verification (cosign, SLSA, attestations, minisign). |
| github | `github:owner/repo` | GitHub releases. Provenance verification, download progress. Replaced ubi. |

**Tier 2 (Stable)**

| Backend | Syntax | Use For |
|---------|--------|---------|
| cargo | `cargo:crate` | Rust tools from crates.io. Supports cargo-binstall. |
| npm | `npm:package` | Node packages. Supports npm/pnpm/bun/aube as package managers. |
| pipx | `pipx:package` | Python CLI tools in isolated envs. Auto-uses `uvx` if uv is on PATH. |
| go | `go:module` | Go tools via `go install`. |
| gem | `gem:package` | Ruby gems. |
| conda | `conda:package` | Conda packages. Graduated from experimental in v2026.5. |
| vfox | `vfox:plugin` | VersionFox plugins. Embedded Lua in binary for speed. |
| http | `http:url` | Direct HTTP downloads with Tera templating. |
| forgejo | `forgejo:owner/repo` | Forgejo/Gitea forge releases. |
| gitlab | `gitlab:owner/repo` | GitLab releases. |
| asdf | `asdf:plugin` | Legacy plugin system. Discouraged for new tools — runs arbitrary plugin code. |

**Deprecated**

| Backend | Replacement | Migration |
|---------|-------------|-----------|
| ubi | github | Replace `ubi:owner/repo` → `github:owner/repo`. github backend adds provenance verification, progress reports, fewer deps. |

**Resolution order**: Explicit spec → `MISE_BACKENDS_<TOOL>` env var → Registry lookup → Core tools → Fallback.

**Recommendation hierarchy**: core > aqua > github > language-native (npm/pipx/cargo/go/gem) > vfox > asdf

**Backend override example:**
```toml
[tools]
# Default (registry decides backend — usually aqua)
uv = "latest"

# Explicit backend
"aqua:astral-sh/uv" = "latest"
"github:astral-sh/uv" = "latest"
```

```bash
# CLI override
mise use "github:astral-sh/uv@latest"
```
</backends>

## Security Verification

The aqua backend verifies tool integrity via native Rust implementations — no external CLI tools (cosign, slsa-verifier, minisign, gh) needed. All methods enabled by default.

<security_verification>
**Verification Methods**

| Method | Env Var | Settings Key | Default |
|--------|---------|--------------|---------|
| Cosign signatures | `MISE_AQUA_COSIGN` | `aqua.cosign` | true |
| SLSA provenance | `MISE_AQUA_SLSA` | `aqua.slsa` | true |
| GitHub Attestations | `MISE_AQUA_GITHUB_ATTESTATIONS` | `aqua.github_attestations` | true |
| Minisign | `MISE_AQUA_MINISIGN` | `aqua.minisign` | true |
| Checksums | Always on | N/A | Always |

Global toggle across all backends: `MISE_GITHUB_ATTESTATIONS=0`

Extra cosign args: `MISE_AQUA_COSIGN_EXTRA_ARGS="--key /path/to/key.pub"`

**When Attestation Verification Fails**

Common causes: release published manually without GH Actions (no attestations generated), sigstore library incompatibility, GitHub API format changes.

```bash
# Fix 1: Update mise first (many attestation bugs fixed in newer releases)
mise self-update

# Fix 2: Disable only the failing method
export MISE_AQUA_GITHUB_ATTESTATIONS=false
mise install <tool>@<version>

# Fix 3: Settings-based (persistent)
# In mise.toml or ~/.config/mise/config.toml
[settings]
aqua.github_attestations = false

# Fix 4: Debug to identify which method fails
MISE_DEBUG=1 mise install <tool>@<version>
```

**Known per-tool attestation issues:** some releases were published by hand or predate GitHub attestation support, so they carry no attestations — install an adjacent version, or check the tool's aqua-registry entry for a per-version exemption.
</security_verification>

## Operational Guidelines

### Task Configuration Principles

<task_design_principles>
1. **Caching First**: Always define `sources` and `outputs` for cacheable tasks
2. **Parallel by Default**: Use `depends` arrays for parallel execution
3. **Single Responsibility**: Each task should have one clear purpose
4. **Namespacing**: Group related tasks with prefixes (e.g., `db:migrate`, `test:unit`)
5. **Idempotency**: Tasks should be safe to run multiple times
6. **Platform Awareness**: Use `run_windows` for cross-platform compatibility
7. **Watch Mode Ready**: Design tasks compatible with `mise watch`
</task_design_principles>

### Decision Framework

<when_to_use_mise>
**Choose mise for:**
- Multi-language projects requiring version management (Python + Node + Go)
- Projects needing per-directory environment variables
- Cross-platform development teams (Linux/Mac/Windows)
- Replacing complex Makefiles or npm scripts
- Projects with parallel task execution needs
- Teams wanting consistent dev environments (new dev onboarding)
- Replacing multiple tools (asdf + direnv + make) with one
- CI/CD pipelines requiring reproducible builds

**Skip mise for:**
- Single-language projects with simple build steps
- Projects where npm scripts are sufficient
- Teams unfamiliar with TOML and no bandwidth for learning
- Projects with existing, working task systems and no pain points
- Embedded systems or constrained environments
</when_to_use_mise>

### Tool Version Management Patterns

<tool_installation_patterns>
**Project-Specific Tools**
```toml
# mise.toml - Project root configuration
[tools]
# Exact versions for reproducibility (illustrative — look up current ones with `mise latest <tool>`)
node = "<x.y.z>"
python = "<x.y.z>"
go = "<x.y.z>"
terraform = "<x.y.z>"

# Read from version file
ruby = { file = ".ruby-version" }
java = { file = ".java-version" }

# Latest patch version
postgres = "16"
redis = "7"

# Multiple versions (switch with mise use)
# mise use node@18 (temporarily override)
```

**Global Development Tools**
```bash
# Install globally useful CLI tools
mise use -g ripgrep@latest      # Better grep
mise use -g bat@latest          # Better cat
```

**Version File Migration**
```bash
# Migrate from existing version files
echo "20.10.0" > .node-version
echo "3.11.6" > .python-version

# mise.toml
[tools]
node = { file = ".node-version" }
python = { file = ".python-version" }
```
</tool_installation_patterns>

### Project Setup Workflows

<project_setup_patterns>
**New Project Bootstrap**
```toml
# mise.toml
[tools]
node = "20"
python = "3.11"

[env]
PROJECT_ROOT = "{{cwd}}"
LOG_LEVEL = "debug"

[vars]
project_name = "my-app"

[tasks.setup]
description = "Setup development environment"
run = [
  "mise install",
  "npm install",
  "pip install -r requirements.txt",
  "cp .env.example .env"
]

[tasks.dev]
alias = "d"
description = "Start development server"
depends = ["setup"]
env = { NODE_ENV = "development" }
run = "npm run dev"
```

**Monorepo Configuration**
```toml
# Root mise.toml
[tools]
node = "20"
go = "1.21"

[tasks.install]
description = "Install all dependencies"
run = [
  "cd frontend && npm install",
  "cd backend && go mod download"
]

# frontend/mise.toml
[tasks.dev]
dir = "{{cwd}}/frontend"
run = "npm run dev"

# backend/mise.toml
[tools]
go = "1.21"

[tasks.dev]
dir = "{{cwd}}/backend"
run = "go run main.go"
```
</project_setup_patterns>

### Configuration Patterns

<common_patterns>
**Development Workflow**
```toml
[tasks.dev]
alias = "d"
description = "Start development server with hot reload"
env = { NODE_ENV = "development", DEBUG = "true" }
run = "npm run dev"

[tasks.dev-watch]
description = "Watch and rebuild on changes"
run = "mise watch build"
```

**Build Pipeline with Caching**
```toml
[tasks.clean]
description = "Remove build artifacts"
run = "rm -rf dist"

[tasks.build]
alias = "b"
description = "Build production bundle"
depends = ["clean"]
sources = ["src/**/*", "package.json", "tsconfig.json"]
outputs = ["dist/**/*"]
env = { NODE_ENV = "production" }
run = "npm run build"

[tasks.build-watch]
description = "Rebuild on source changes"
run = "mise watch build"
```

**Testing Suite**
```toml
[tasks.test]
alias = "t"
description = "Run all tests"
depends = ["test:unit", "test:integration"]  # Runs in parallel

[tasks."test:unit"]
description = "Run unit tests"
sources = ["src/**/*.ts", "tests/unit/**/*.ts"]
run = "npm test -- --testPathPattern=unit"

[tasks."test:integration"]
description = "Run integration tests"
sources = ["src/**/*.ts", "tests/integration/**/*.ts"]
run = "npm test -- --testPathPattern=integration"

[tasks."test:watch"]
description = "Run tests in watch mode"
run = "npm test -- --watch"

[tasks."test:coverage"]
description = "Generate coverage report"
run = "npm test -- --coverage"

[tasks."test:e2e"]
description = "Run end-to-end tests"
depends = ["build"]
run = "playwright test"
```

**Database Workflow**
```toml
[tasks."db:migrate"]
description = "Run database migrations"
run = "npx prisma migrate deploy"

[tasks."db:seed"]
description = "Seed database with test data"
depends = ["db:migrate"]
run = "npx prisma db seed"

[tasks."db:reset"]
description = "Reset database to clean state"
run = ["npx prisma migrate reset --force", "mise run db:seed"]

[tasks."db:studio"]
description = "Open Prisma Studio"
run = "npx prisma studio"
```

**Linting & Formatting**
```toml
[tasks.lint]
description = "Lint code"
sources = ["src/**/*.ts"]
run = "eslint src"

[tasks.format]
description = "Format code"
sources = ["src/**/*.ts"]
run = "prettier --write src"

[tasks."lint:fix"]
description = "Lint and auto-fix issues"
run = "eslint src --fix"

[tasks.check]
description = "Run all checks"
depends = ["lint", "format", "test"]  # Runs in parallel
```

**Deployment Pipeline**
```toml
[tasks.deploy]
description = "Deploy to production"
usage = '''
arg "environment" description="Target environment" default="staging"
flag "-f --force" description="Skip confirmation"
'''
depends = ["build", "test"]
depends_post = ["notify:slack"]
run = './scripts/deploy.sh {{arg(name="environment")}} {{flag(name="force")}}'

[tasks."deploy:staging"]
description = "Deploy to staging"
depends = ["build", "test"]
run = "./scripts/deploy.sh staging"

[tasks."deploy:production"]
description = "Deploy to production"
depends = ["build", "test"]
run = "./scripts/deploy.sh production"

[tasks."notify:slack"]
hide = true
run = 'curl -X POST $SLACK_WEBHOOK -d "Deployment complete"'
```

**Docker Integration**
```toml
[tasks."docker:build"]
description = "Build Docker image"
sources = ["Dockerfile", "src/**/*"]
run = "docker build -t myapp:latest ."

[tasks."docker:run"]
description = "Run Docker container"
depends = ["docker:build"]
run = "docker run -p 3000:3000 myapp:latest"

[tasks."docker:compose"]
description = "Start services with docker-compose"
run = "docker-compose up -d"
```

**Go Plugin Build System**
```toml
[tasks."build:plugins"]
description = "Build all Go plugins in parallel"
sources = ["plugins/**/*.go"]
outputs = ["plugins/**/main.so"]
run = '''
for plugin in plugins/*/; do
  (cd "$plugin" && go build -buildmode=plugin -o main.so main.go) &
done
wait
'''

[tasks."rebuild:plugins"]
description = "Rebuild plugins when engine changes"
sources = ["engine/**/*.go"]
depends = ["build:engine"]
run = "mise run build:plugins"
```
</common_patterns>

### Variables and Environment Management

<environment_patterns>
**Environment-Specific Variables**
```toml
[vars]
# Default development values
api_url = "http://localhost:3000"
db_host = "localhost"
db_port = "5432"
debug_mode = "true"

# Load additional vars from .env
_.file = ".env"

[env]
# Static environment variables
NODE_ENV = "development"
LOG_LEVEL = "debug"

# Reference variables
API_URL = "{{vars.api_url}}"
DATABASE_URL = "postgres://{{vars.db_host}}:{{vars.db_port}}/myapp"
DEBUG = "{{vars.debug_mode}}"

[tasks.dev]
env = {
  NODE_ENV = "development",
  API_URL = "{{vars.api_url}}"
}
run = "npm run dev"
```

**Multi-Environment Setup**
```toml
# mise.toml (base development config)
[vars]
environment = "development"
api_url = "http://localhost:3000"

[env]
NODE_ENV = "development"

# mise.staging.toml
[vars]
environment = "staging"
api_url = "https://api.staging.example.com"

[env]
NODE_ENV = "staging"

# mise.production.toml
[vars]
environment = "production"
api_url = "https://api.example.com"
debug_mode = "false"

[env]
NODE_ENV = "production"
```

**Secret Management**
```toml
# mise.toml (checked into git)
[vars]
# Non-sensitive defaults
api_url = "http://localhost:3000"

# Load secrets from .env (gitignored)
_.file = ".env"

[env]
# Reference secrets loaded from .env
API_KEY = "{{vars.api_key}}"
DATABASE_PASSWORD = "{{vars.db_password}}"

# .env (NOT in git)
api_key=secret-key-here
db_password=secret-password
```
</environment_patterns>

## Verifying a Configuration

After changing mise config, check it: `mise install` (tools resolve), `mise tasks ls` (tasks register), `mise run <task>` (it runs), and `mise doctor` for diagnostics.

## Migration Strategies

<migration_from_asdf>
**From .tool-versions to mise.toml**

.tool-versions:
```
nodejs 20.10.0
python 3.11.6
golang 1.21.5
terraform 1.6.6
```

mise.toml:
```toml
[tools]
node = "20.10.0"
python = "3.11.6"
go = "1.21.5"
terraform = "1.6.6"
```

Migration command:
```bash
# Mise can read .tool-versions directly
mise install

# Or convert to mise.toml
mise use node@20.10.0 python@3.11.6 go@1.21.5 terraform@1.6.6
```
</migration_from_asdf>

<migration_from_make>
**From Makefile to mise.toml**

Makefile:
```makefile
.PHONY: build test clean deploy

clean:
	rm -rf dist

build: clean
	npm run build

test: build
	npm test

deploy: build test
	./deploy.sh
```

mise.toml:
```toml
[tasks.clean]
description = "Remove build artifacts"
run = "rm -rf dist"

[tasks.build]
alias = "b"
description = "Build production bundle"
depends = ["clean"]
sources = ["src/**/*", "package.json"]
outputs = ["dist/**/*"]
run = "npm run build"

[tasks.test]
alias = "t"
description = "Run tests"
depends = ["build"]
run = "npm test"

[tasks.deploy]
description = "Deploy to production"
depends = ["build", "test"]  # test already depends on build, so these run in order
run = "./deploy.sh"
```

**Advantages:**
- Automatic caching via sources/outputs
- Parallel execution of independent tasks
- Cross-platform compatibility
- Environment variable management
- Tool version management integrated
</migration_from_make>

<migration_from_npm>
**From package.json scripts to mise.toml**

package.json:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development npm start",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src",
    "deploy": "npm run build && npm run test && ./deploy.sh"
  }
}
```

mise.toml:
```toml
[tasks.dev]
alias = "d"
description = "Start development server"
env = { NODE_ENV = "development" }
run = "npm start"

[tasks.build]
alias = "b"
description = "Build production bundle"
sources = ["src/**/*", "webpack.config.js"]
outputs = ["dist/**/*"]
run = "webpack --mode production"

[tasks.test]
alias = "t"
description = "Run tests"
run = "jest"

[tasks.lint]
description = "Lint code"
sources = ["src/**/*.js"]
run = "eslint src"

[tasks.deploy]
description = "Deploy to production"
depends = ["build", "test"]  # Runs in parallel
run = "./deploy.sh"
```

**Advantages:**
- Better dependency management (build + test run in parallel)
- Caching prevents unnecessary rebuilds
- Environment variables in configuration
- Consistent interface across different project types
- Works with any language, not just Node.js
</migration_from_npm>

<migration_from_direnv>
**From .envrc to mise.toml**

.envrc:
```bash
export NODE_ENV=development
export API_URL=http://localhost:3000
export DATABASE_URL=postgres://localhost/myapp
```

mise.toml:
```toml
[env]
NODE_ENV = "development"
API_URL = "http://localhost:3000"
DATABASE_URL = "postgres://localhost/myapp"

# Or use variables for DRY
[vars]
api_host = "localhost"
api_port = "3000"

[env]
API_URL = "http://{{vars.api_host}}:{{vars.api_port}}"
```

**Advantages:**
- TOML format easier to read/edit than bash
- Variables for DRY configuration
- Integrates with task runner and tool versions
- No shell-specific syntax
</migration_from_direnv>

## CI/CD Integration

<ci_integration>
**GitHub Actions**
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup mise
        uses: jdx/mise-action@v2
        with:
          version: latest  # or specific version

      - name: Install tools and dependencies
        run: mise install

      - name: Run tests
        run: mise run test

      - name: Build
        run: mise run build
```

**GitLab CI**
```yaml
image: ubuntu:latest

before_script:
  - curl https://mise.run | sh
  - export PATH="$HOME/.local/bin:$PATH"
  - mise install

test:
  script:
    - mise run test

build:
  script:
    - mise run build
```

**Docker**
```dockerfile
FROM ubuntu:latest

# Install mise
RUN curl https://mise.run | sh
ENV PATH="/root/.local/bin:$PATH"

# Copy project files
COPY . /app
WORKDIR /app

# Install tools and dependencies
RUN mise install

# Run build
RUN mise run build

CMD ["mise", "run", "start"]
```
</ci_integration>

## Troubleshooting Guide

<common_issues>
**Tool Not Found / Wrong Version**
```bash
# Symptom: Command not found or using system version
mise ls                          # List installed tools
mise install                     # Install missing tools
mise use node@20                 # Set specific version
mise doctor                      # Diagnose configuration
which node                       # Verify mise shim
mise reshim                      # Rebuild shims if needed
```

**Task Not Found**
```bash
# Symptom: "Task 'xyz' not found"
mise tasks ls                    # List all tasks
mise config                      # Show active config files
cat mise.toml                    # Verify task definition
mise tasks info <task>           # Get task details
```

**Task Caching Issues**
```toml
# Symptom: Task not re-running when files change
[tasks.build]
sources = ["src/**/*"]           # Check glob patterns are correct
outputs = ["dist/**/*"]          # Verify output paths match actual outputs
run = "npm run build"

# Debug: Remove outputs and re-run
# rm -rf dist && mise run build
```

**Environment Variables Not Loading**
```bash
# Symptom: Environment variables not set in tasks
mise config                      # Verify mise.toml location (project root)
mise run --verbose <task>        # Check env loading with verbose output
mise doctor                      # Diagnostic check
env | grep VAR_NAME              # Check if var is actually set
```

**Cross-Platform Issues**
```toml
# Symptom: Task fails on Windows
[tasks.build]
run = "npm run build"            # Use cross-platform commands
run_windows = "npm.cmd run build"  # Windows-specific override

# Or use mise variables for paths
run = "{{cwd}}/scripts/build.sh"
```

**Parallel Execution Not Working**
```toml
# Symptom: Tasks running sequentially instead of parallel
[tasks.ci]
depends = ["lint", "test", "build"]  # Runs in parallel by default

# For sequential execution, use run array
[tasks.sequential]
run = [
  "mise run step1",
  "mise run step2",
  "mise run step3"
]
```

**Tool Installation Fails**
```bash
# Symptom: mise install fails for a tool
mise doctor                      # Check for system dependencies
mise ls-remote node              # List available versions
mise install node@20 --verbose   # Verbose installation
mise cache clear                 # Clear cache and retry
```

**Attestation / Verification Failures**
```bash
# Symptom: "GitHub artifact attestations verification failed"
# or "Workflow verification failed: expected '...', found certificate: None"

# Step 1: Update mise (most attestation bugs are fixed in newer releases)
mise self-update

# Step 2: If still failing, disable ONLY the method Step 5's debug output names — one of:
export MISE_AQUA_GITHUB_ATTESTATIONS=false   # GitHub attestations
# export MISE_AQUA_COSIGN=false              # Cosign signatures
# export MISE_AQUA_SLSA=false                # SLSA provenance

# Step 3: Try an adjacent version (some releases lack attestations)
mise install <tool>@<other-version>

# Step 4: Switch backend as workaround
mise use "github:owner/repo@version"         # github backend instead of aqua

# Step 5: Debug for details
MISE_DEBUG=1 mise install tool@version
```

**Using Deprecated ubi Backend**
```bash
# Symptom: ubi backend warnings or failures
# Fix: Replace ubi with github backend
# Old: ubi:owner/repo → New: github:owner/repo

# In mise.toml
# Before (deprecated):
# "ubi:goreleaser/goreleaser" = "latest"
# After (recommended):
# "github:goreleaser/goreleaser" = "latest"
```
</common_issues>

## Best Practices Checklist

<best_practices>
**Tool Management:**
- [ ] Pin exact versions in shared and CI projects; a major-version prefix (node = "22") is fine for personal tools
- [ ] Document version choices in comments
- [ ] Use .tool-versions or version files for compatibility
- [ ] Test tool installation on fresh clone

**Task Configuration:**
- [ ] All frequently used tasks have short aliases
- [ ] Build tasks define sources and outputs for caching
- [ ] Related tasks use namespace prefixes (db:, test:, docker:)
- [ ] Complex tasks have clear descriptions
- [ ] Tasks with arguments use usage spec for documentation
- [ ] Hidden internal tasks marked with hide = true

**Environment Management:**
- [ ] Environment variables use mise variables for DRY
- [ ] Secrets loaded from .env (gitignored)
- [ ] Development defaults in mise.toml (version controlled)
- [ ] Production overrides in separate config files

**Performance:**
- [ ] Parallel execution leveraged via depends arrays
- [ ] Caching configured with sources/outputs
- [ ] Watch mode available for iterative development
- [ ] jobs setting optimized for system resources

**Cross-Platform:**
- [ ] Platform-specific commands use run_windows
- [ ] Paths use {{cwd}} instead of hardcoded values
- [ ] Tested on target platforms (Linux/Mac/Windows)

**Team & CI:**
- [ ] mise.toml version controlled
- [ ] README documents mise installation and usage
- [ ] CI/CD uses mise for consistent environments
- [ ] Validated with `mise doctor`
</best_practices>

## Output Standards

When editing an existing mise.toml, change only the sections the request touches. Give user-facing tasks a `description`, and comment only non-obvious configuration.

## Anti-Patterns to Avoid

<anti_patterns>
**Don't:**
- ❌ Use broad version ranges in shared/CI projects (node = "22" drifts between machines)
- ❌ Create tasks without descriptions (hard to maintain)
- ❌ Ignore sources/outputs on build tasks (misses caching benefits)
- ❌ Use sequential run arrays when depends would allow parallel execution
- ❌ Hardcode environment-specific values (use vars instead)
- ❌ Create monolithic tasks (break into smaller, reusable pieces)
- ❌ Skip cross-platform considerations for team projects
- ❌ Forget to version control mise.toml
- ❌ Use mise for trivial single-command projects
- ❌ Commit secrets in mise.toml (use .env)
- ❌ Use `ubi:` backend (deprecated — use `github:` instead)
- ❌ Use `MISE_AQUA_REGISTRY_COSIGN` (wrong env var — use `MISE_AQUA_COSIGN`)
- ❌ Disable all verification globally when only one method fails

**Do:**
- ✅ Pin exact tool versions for reproducibility
- ✅ Use namespacing for related tasks
- ✅ Add aliases for frequently used tasks
- ✅ Define sources/outputs for cacheable tasks
- ✅ Leverage parallel execution with depends
- ✅ Use variables for DRY configuration
- ✅ Document complex task arguments with usage spec
- ✅ Test with `mise doctor` before committing
- ✅ Provide clear descriptions for team members
- ✅ Load secrets from gitignored .env files
- ✅ Prefer `github:` over `ubi:` for GitHub release tools
- ✅ Run `mise self-update` before debugging attestation failures
- ✅ Disable only the specific failing verification method, not all
</anti_patterns>
