---
name: mise-expert
description: "mise — the tool-version manager, env-var loader, and task runner that replaces asdf, direnv, and make. Use for anything touching mise.toml or .tool-versions: installing or pinning tools, choosing a backend (core, packslip, aqua, github, cargo, npm, pypi/pipx), env vars, tasks, lockfiles, trust prompts, auto-updates, CI setup, migrating from asdf/direnv/make/npm scripts or off ubi, and install failures — including attestation/cosign/SLSA verification errors."
---

# Mise Expert Skill

## Check live docs first

mise ships several releases a month, and backends, settings, env vars and flags change between them. This file is a snapshot checked against **mise 2026.10.11 (2026-10-15)** release notes and docs, with settings and backends confirmed on a 2026.10.10 binary; treat it as a map of where to look, not as the current truth.

Before giving syntax, a setting name, an env var, a flag, or a backend recommendation, confirm it against a live source, in this order:

1. **The installed binary** — `mise --version`, `mise help <command>`, `mise settings ls`, `mise registry <tool>`, `mise doctor`. Authoritative for what this machine runs.
2. **Current docs** — context7 (resolve the `mise` library ID, then query the topic), or https://mise.jdx.dev. Use `mcp__parallax__fetch_page` if WebFetch fails.
3. **What changed since the snapshot** — the release notes at https://github.com/jdx/mise/releases, when the installed version is newer than the one above or the user hits behavior this file doesn't match.

How often each part of this file needs that check:

| Label | Sections | Query live docs |
|-------|----------|-----------------|
| **volatile** | Backends, Security Verification, Trust, the attestation and `ubi` troubleshooting entries, CI/CD Integration | Every time |
| **drifts** | Recent Features, Configuration Patterns, Variables and Environment Management, Migration Strategies | When quoting exact keys or syntax |
| **stable** | Task Configuration Principles, Decision Framework, Best Practices Checklist, Anti-Patterns to Avoid | Only if the user reports a mismatch |

Label what you give the user: name the source and version you checked against ("per `mise help use` on 2026.10.11", "per mise.jdx.dev/configuration"). If you could only use this file, say "from the skill's 2026.10.11 snapshot, not verified live". When a live source contradicts this file, follow the live source and tell the user this skill is out of date.

## Backends

mise uses backends to install tools. Backend selection affects security verification, performance, and compatibility.

<backends>
`mise backends ls` lists what the installed binary supports. Start with the registry short name (`mise registry <tool>` shows its backend list in order). When you pick a backend yourself, the docs' order is: prefer the publisher's own signed or prebuilt release.

**Preferred (prebuilt releases)**

| Backend | Syntax | Use For |
|---------|--------|---------|
| core | `node`, `python`, `go` (`core:node`) | Built-in tools (node, python, bun, deno, java, go, rust, erlang, ...). |
| packslip | `packslip:github.com/owner/repo` (`packslip:owner/repo` for GitHub) | Publisher-signed release manifests. mise checks the signer and every artifact digest. Ships completions, man pages and agent skills. Registry already prefers it for hk, usage, fnox, pitchfork, aube, helmfile, timoni, dagu, worktrunk. Option `workflow = [...]` pins the signing workflow. |
| aqua | `aqua:owner/repo` | Tools in the aqua registry. Native verification (cosign, SLSA, attestations, minisign). Per-tool `libc = "musl"` option. |
| github / gitlab / forgejo | `github:owner/repo` | Forge release assets. Provenance verification. Replaced ubi. |
| http / s3 | `http:name` + `url`, `s3:name` + `url = "s3://..."` | Archives you host. `http` takes `headers` for auth; `s3` uses the AWS credential chain. |

**Language packages (when the tool only ships as a package, or needs package options)**

| Backend | Syntax | Use For |
|---------|--------|---------|
| cargo | `cargo:crate` | Rust tools from crates.io. Supports cargo-binstall. |
| go | `go:module` | Go tools via `go install`. |
| npm | `npm:package`, `npm:github:owner/repo@ref` | Node packages, also from git. Supports npm/pnpm/bun/aube. |
| pypi (alias `pipx:`) | `pypi:package`, `pypi:owner/repo`, `pypi:git+https://...#subdirectory=x` | Python CLI apps in isolated envs. Uses uv, or pipx if uv is missing. Builds on mise's Python when mise manages one. `pipx:x` and `pypi:x` are the same tool. |
| gem | `gem:package` | Ruby gems. `source = "<url>"` for a private registry. |
| dotnet | `dotnet:Package.Name` | .NET tools from NuGet. |
| spm | `spm:owner/repo` | Swift package executables. Needs Swift. |
| conda | `conda:package` | Conda packages and their dependencies. |

**Plugins and the rest**

| Backend | Syntax | Use For |
|---------|--------|---------|
| vfox | `vfox:owner/plugin` | Lua plugins, only when install needs custom logic. |
| spinel | `spinel:owner/repo` | Experimental. Ruby programs AOT-compiled to native. Needs `experimental = true` and the `spinel` compiler. |
| asdf | `asdf:plugin` | Legacy. Runs arbitrary shell plugin code, no Windows. Avoid for new tools. |

**Deprecated**

| Backend | Replacement | Migration |
|---------|-------------|-----------|
| ubi | github / gitlab / http | Warns since 2026.4.0, **removed in mise 2027.1.0**. `ubi:owner/repo` → `github:owner/repo`; `provider = "gitlab"` → `gitlab:`; direct URL → `http:` with `url`. `exe` is usually not needed; `rename_exe` becomes `rename_exe = { "gh" = "gh-cli" }`. Then `mise lock` and `mise uninstall --all ubi:owner/repo`. |

**Resolution order for a short name** (an explicit `backend:` prefix always wins): `MISE_BACKENDS_<TOOL>` env var → `[tool_alias]` entry naming a backend (e.g. `node = "core:node"`) → `[plugins]` URL → backend recorded in `mise.lock` (if it serves the version) → installed plugin of the same name → first registry backend that runs here, isn't in `disable_backends`, and serves the version. Check with `mise tool <name> --backend`. `mise backends switch` moves lock entries when the registry changes a tool's backend.

**Recommendation hierarchy**: core > packslip > aqua > github/gitlab/forgejo > http/s3 > language packages (cargo/go/npm/pypi/gem/dotnet) > vfox > asdf

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

Global toggle across all backends: `MISE_GITHUB_ATTESTATIONS=0` (setting `github_attestations`). The github backend has its own `github.github_attestations`.

Extra cosign args: `MISE_AQUA_COSIGN_EXTRA_ARGS="--key /path/to/key.pub"`

**Signer identity is now enforced (2026.9.16 – 2026.10.0)**
- SLSA provenance must come from the expected signer. Set `slsa_signer_identity` + `slsa_signer_issuer` as tool options on `github:` and `aqua:` tools whose registry entry has none (e.g. `aqua:google/osv-scanner`). Without both, mise skips the SLSA check and uses other methods.
- Keyless cosign bundles must match the registry's pinned `--certificate-identity`/`--certificate-oidc-issuer`. Key-based (`--key`) is unchanged.
- GitHub attestation `signer_workflow` matches whole path segments, not a substring.

**Release-age cutoff**: `minimum_release_age` (default `24h`) holds back new releases for tools and for `mise self-update`. Set `0s` per tool with `--tool-option minimum_release_age=0s` to get the newest now. `minimum_release_age_excludes` lists exempt tools.

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

## Trust

mise skips or refuses config it doesn't trust. These forms now need `mise trust` before they load:

- Tool keys with inline options (`"github:o/r[api_url=...]"`), in `mise.toml` and in `.tool-versions` — an untrusted file could send `GITHUB_TOKEN` to another host.
- `path:` tool versions — they put a directory first on `PATH`.
- `{ ... }` option tables, Tera templates, and remote task files whose `#MISE` headers contain templates.

Plain keys such as `node = "24"` still load untrusted. An untrusted project config no longer breaks `mise activate`: it is skipped with a warning, while `mise run` and `mise x` still error. Paranoid mode: `--yes`/CI auto-confirm does not grant trust. `MISE_SAFE=1` ignores project `[bootstrap]`, `[dotfiles]` and includes.

## Recent Features

Added between 2026.9.15 and 2026.10.11. Check `min_version` before using one in a shared config.

<recent_features>
**Config**
- `include = ["./local.toml", "git::<url>//mise.toml?ref=main", "oci::ghcr.io/org/cfg@sha256:..."]` merges shared `[tools]`, `[env]`, `[vars]`, `[hooks]`, `[bootstrap]` and similar below the including file. No tasks or `[settings]` in an include.
- **Precedence change (2026.10.5):** in one directory, highest first: `mise.<env>.local.toml` > `mise.local.toml` > `mise.<env>.toml` > `mise.toml`.
- `[vars.<name>]` with `prompt` plus `default` or `required` asks once per machine (`mise vars prompt`) and stores the answer in `$MISE_STATE_DIR/vars.toml`.
- `~/.config/mise/miserc.local.toml` picks an environment on one machine (`env = ["work"]`).
- `settings.write_targets` sends new global `[tools]` entries to a `conf.d` file.

**Tools**
- `auto_update = true | "6h"` on a global tool, or `[settings] tool_update.global_auto = "12h"` for all global tools. Exact pins never move; nothing runs in CI, offline or with `locked`.
- mise's own updates moved to `self_update.auto` / `self_update.check_duration` (old `auto_update` key still works).
- `postinstall = { run = "...", when = "always" }` runs on every `mise install`.
- `mise upgrade --global` / `mise outdated --global` touch only global config.
- `java@21`, `java@lts`, `java@latest` now install **Temurin** (`java.shorthand_vendor`). Old lock entries need `mise lock --bump java` or `java.shorthand_vendor = "openjdk"`.
- `install_layout = "identity"` (experimental; on by default on Windows with `experimental = true`) stores installs by content hash. `mise installs ls|select|migrate`.
- Each tool's install dir has a `global` symlink to the global version — point IDEs there.
- `mise env --paths` prints only the PATH entries mise adds.
- Public GitHub metadata (release lists, tags, attestations) now comes from mise-versions (`use_versions_host = true`), so tokenless users rarely hit rate limits.

**Lockfile**
- New lockfiles are `lockfile_version = 3`; older mise rejects them. Upgrade an old file with `mise lock --upgrade` once every user is on 2026.9.16+.
- The docs now recommend committing `mise.lock` and installing with `mise install --locked`. `mise lock --platform linux-x64,linux-arm64,macos-arm64` writes entries for every runner.
- `lockfile_auto_prune = false` keeps entries for tools missing from the active config.

**Tasks**
- `skip_if = "test -f .initialized"` skips the task when the command exits 0. `mise run --force` ignores it.
- `confirm = { message = "...", yes = "Deploy", no = "Cancel", default = "no" }`.
- `secrets = ["DEPLOY_KEY"]` on a task (experimental, fnox 1.39+, `[secrets.fnox]`): only that task gets the values, redacted from output. `mise run --secrets KEY task`.
- `mise run --affected` is no longer experimental and also counts uncommitted and untracked files. Use `--affected-committed` for the old behavior.
- `mise tasks validate` now fails on an unparseable `usage` spec.
- `[monorepo.path_aliases]` gives deep config roots short names (`mise run //123:build`).
</recent_features>

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
      - uses: actions/checkout@v7

      # Installs mise and the repo's tools. With a committed mise.lock it runs
      # `mise install --locked` itself. Pin mise with `version:` if needed.
      - uses: jdx/mise-action@v5

      - name: Run tests
        run: mise run test

      - name: Build
        run: mise run build
```

mise-action v5 does not export the GitHub token to later steps. Pass one to steps that install tools. `mise generate github-action --write --task=ci` writes a starter workflow.

**Cache downloads, not installs** (with a committed `mise.lock`). mise re-hashes each cached download against the lockfile, so a poisoned cache can't change what gets installed. A restored *install* cache is trusted as is.

```yaml
      - uses: actions/checkout@v7
      - uses: actions/cache@v6
        with:
          path: ~/.cache/mise/downloads-cas   # macOS: ~/Library/Caches/mise/downloads-cas
          key: mise-downloads-${{ runner.os }}-${{ hashFiles('mise.lock') }}
      - uses: jdx/mise-action@v5
        with:
          cache: false
```

**GitLab CI**
```yaml
image: ubuntu:latest

before_script:
  - curl https://mise.run | sh            # set MISE_VERSION=<x> for a reproducible mise
  - export PATH="$HOME/.local/bin:$PATH"
  - mise install --locked

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

# Install tools from the committed lockfile
RUN mise install --locked

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

**SLSA "no signer_identity and signer_issuer"**
```toml
# Symptom: a locked or SLSA-checked aqua/github tool fails with no expected signer.
# Fix: refresh the entry with `mise lock`, or set both signer options:
[tools]
"aqua:google/osv-scanner" = { version = "latest", slsa_signer_identity = "<cert URI>", slsa_signer_issuer = "https://token.actions.githubusercontent.com" }
```

**"is not trusted" for a config that used to load**
```bash
# Symptom: inline tool options ("tool[opt=x]") or path: versions are skipped.
mise trust            # in the project directory, after reading the file
```

**Using Deprecated ubi Backend**
```bash
# Symptom: ubi backend warnings or failures (ubi is removed in 2027.1.0)
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
- ❌ Cache installed tools in CI when a lockfile exists (cache `downloads-cas` instead)
- ❌ Run `mise trust` on a repo you haven't read — trust now gates `path:` versions and inline tool options

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
- ✅ Commit `mise.lock` and install with `--locked` in CI and Docker
- ✅ Prefer `packslip:` when the publisher signs packslip manifests
</anti_patterns>
