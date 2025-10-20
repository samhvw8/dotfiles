# Mise - Polyglot Tool Version Manager & Task Runner

Unified development environment manager combining asdf, direnv, and make functionality.

<capabilities>
- Tool version management (node, python, go, etc.)
- Environment variable management per-directory
- Task runner replacing make/npm scripts
- Cross-platform command execution
</capabilities>

## Command Reference

<task_execution>
```bash
mise run <task>              # Execute task
mise r <task>                # Short form
mise <task>                  # Direct execution (no command conflicts)
mise watch <task>            # Re-run on file changes
mise w <task>                # Watch short form
mise tasks ls                # List available tasks
mise tasks info <task>       # Show task details
mise tasks deps <task>       # Display dependency tree
```
</task_execution>

<tool_management>
```bash
mise use node@20             # Set project tool version
mise use -g python@3.11      # Set global tool version
mise install                 # Install all configured tools
mise ls                      # List installed tools
mise outdated                # Check for updates
mise up                      # Upgrade tools
mise doctor                  # Diagnose configuration issues
```
</tool_management>

## Task Configuration Patterns

<task_types>
**Simple Task**
```toml
[tasks.build]
run = "cargo build"
```

**Sequential Dependencies**
```toml
[tasks.test]
depends = ["build"]
run = "cargo test"
```

**Parallel Execution** (default for depends array)
```toml
[tasks.ci]
depends = ["lint", "test", "build"]
```

**Multi-Command**
```toml
[tasks.deploy]
run = ["npm run build", "npm test", "npm run deploy"]
```

**Cached Execution** (skip if sources unchanged)
```toml
[tasks.compile]
sources = ["src/**/*.rs"]
outputs = ["target/debug/app"]
run = "cargo build"
```

**Environment Variables**
```toml
[tasks.dev]
env = { NODE_ENV = "development", DEBUG = "true" }
run = "npm start"
```

**Cross-Platform**
```toml
[tasks.build]
run = "build.sh"
run_windows = "build.bat"
```

**Custom Working Directory**
```toml
[tasks.frontend]
dir = "{{cwd}}/frontend"
run = "npm run dev"
```

**Hidden Tasks** (not in task listings)
```toml
[tasks.internal]
hide = true
run = "echo internal"
```

**Task Arguments**
```toml
[tasks.deploy]
usage = '''
arg "environment" description="Target environment" default="staging"
flag "-f --force" description="Force deployment"
'''
run = 'deploy.sh {{arg(name="environment")}} {{flag(name="force")}}'
```

**Post-Execution Dependencies**
```toml
[tasks.release]
depends = ["build"]           # Runs before
depends_post = ["notify"]     # Runs after
```

**Task Aliases**
```toml
[tasks.build]
alias = "b"
run = "npm run build"
```
</task_types>

## Variables & Environment

<variable_management>
```toml
# Define reusable variables
[vars]
build_dir = "./dist"
api_url = "http://localhost:3000"

# Reference in tasks
[tasks.build]
run = "webpack --output-path {{vars.build_dir}}"

# Load from file
[vars]
_.file = ".env"

# Global environment variables
[env]
NODE_ENV = "production"
DATABASE_URL = "postgres://localhost/myapp"
```
</variable_management>

## Project Configuration

<configuration_structure>
```toml
# mise.toml
[tools]
node = "20"
python = "3.11"
go = "1.21"

[env]
DATABASE_URL = "postgres://localhost/myapp"
API_KEY = "{{vars.api_key}}"

[vars]
api_key = "dev-key-123"

[settings]
jobs = 8  # Parallel job limit

[tasks.dev]
alias = "d"
env = { NODE_ENV = "development" }
run = "npm run dev"
```
</configuration_structure>

## Common Workflows

<workflow_patterns>
**Development Server**
```toml
[tasks.dev]
alias = "d"
env = { NODE_ENV = "development" }
run = "npm run dev"
```

**Testing Suite**
```toml
[tasks.test]
alias = "t"
run = "npm test"

[tasks.test-watch]
run = "npm test -- --watch"

[tasks.test-coverage]
run = "npm test -- --coverage"
```

**Build Pipeline**
```toml
[tasks.build]
alias = "b"
sources = ["src/**/*", "package.json"]
outputs = ["dist/**/*"]
run = "npm run build"

[tasks.watch]
alias = "w"
run = "mise watch build"
```

**Go Plugin System**
```toml
[tasks.build-plugins]
run = '''
for plugin in plugins/*/; do
  (cd "$plugin" && go build -buildmode=plugin -o main.so main.go) &
done
wait
'''

[tasks.rebuild-plugins]
sources = ["engine/**/*.go"]
depends = ["build-engine"]
run = "mise run build-plugins"
```
</workflow_patterns>

## Best Practices

<guidelines>
**Task Organization**
- Use namespaced task names: `db:migrate`, `db:seed`, `api:start`
- Add aliases for frequently used tasks
- Hide internal tasks with `hide = true`
- Document complex tasks with `usage` spec

**Performance**
- Define `sources` and `outputs` to enable caching
- Leverage parallel execution (default for `depends`)
- Set `jobs` limit based on system resources
- Use `mise watch` for hot-reload workflows

**Cross-Platform**
- Use `run_windows` for platform-specific commands
- Prefer `{{cwd}}` over hardcoded paths
- Use mise variables instead of shell-specific syntax

**Maintainability**
- Keep mise.toml in version control
- Comment complex task configurations
- Use variables for repeated values (DRY principle)
- Document task arguments with `usage` field
</guidelines>

## CI/CD Integration

<ci_integration>
```yaml
# GitHub Actions
- name: Setup mise
  uses: jdx/mise-action@v2

- name: Install dependencies
  run: mise install

- name: Run tests
  run: mise run test

- name: Build
  run: mise run build
```
</ci_integration>

## Quick Decision Matrix

<decision_matrix>
| Scenario | Use Mise When | Alternative |
|----------|---------------|-------------|
| Task runner | Replacing make/npm scripts | Simple projects → npm scripts |
| Version management | Multiple languages in project | Single language → nvm/pyenv |
| Environment variables | Per-directory env switching | Static env → .env files |
| Cross-platform | Need Linux + Windows support | Single platform → shell scripts |
</decision_matrix>

<troubleshooting>
**Common Issues**
- Task not found: Run `mise tasks ls` to verify task names
- Wrong tool version: Check `mise ls` and `mise config`
- Environment not loading: Verify `mise.toml` location (project root)
- Tasks not caching: Ensure `sources` and `outputs` paths are correct
- Diagnostic tool: `mise doctor` for configuration validation
</troubleshooting>
