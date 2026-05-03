# Workflow Rules

## Release Workflow

When asked to "update docs and commit" or similar:
1. Update all relevant docs (CLAUDE.md, docs/ccp-spec.md) in one pass
2. Stage and commit with a descriptive message
3. Create version tag if version was bumped
4. Do NOT push — user pushes manually after reviewing

## Git Rules

- Never force-update tags (`git tag -f` or `git push --tags -f`)
- Always increment version and create a new tag
- Never push without explicit user request

## Testing

- Run `go build -o ccp .` and `go test ./...` after every change
- Use `t.TempDir()` for filesystem tests
- Use `filepath.EvalSymlinks()` when comparing symlink targets on macOS (handles /var → /private/var)
- Coverage targets: profile 60%+, hub 55%+, migration 65%+

## Version Tracking

- CLAUDE.md line 3 has `**Current version: vX.Y.Z**`
- `cmd/root.go` version is set at build time via ldflags (no manual change needed)
- docs/ccp-spec.md has version in frontmatter

## CLI Patterns

- Commands: verb-noun (`profile create`, `hub list`)
- One file per command: `cmd/<parent>_<child>.go`
- Flags: `--long-form` with `-s` short aliases
- Output: tabwriter for tables, fmt for simple
- Errors: return to Cobra, exit 1 on failure
