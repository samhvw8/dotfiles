# Agent guide: dotfiles

macOS and Debian/Ubuntu machine setup managed with [mise](https://mise.jdx.dev).
This repository is cloned to `~/.dotfiles`, and its files are linked into `~`.
The default branch is `main`.

## Read first

The knowledge bundle in `.okf/` holds the how and the why. Start at
`.okf/index.md`, then follow links only into what the task touches. If you
change behavior, update the concept that describes it and add an entry to
`.okf/log.md` in the same change. Before finishing, validate the bundle with the
`okf` or `validate` skill.

## Layout

| Path | What it is |
|------|------------|
| `home/` | Dotfiles, linked to the same path under `~` |
| `mise/config.toml` | Full install: tools, dotfiles only full installs get, packages |
| `mise/minimal.toml` | Minimal install (servers) |
| `mise/conf.d/dotfiles.toml` | Links, packages, hooks and `dot:*` tasks shared by both installs |
| `mise/scripts/` | Bootstrap hooks and `dot:*` task scripts |
| `mise/snippets/` | Blocks managed inside files such as `~/.gitconfig` |
| `setup.sh` | New-machine installer, fetched with curl from `main` |
| `migrate-from-chezmoi.sh` | One-time migration for machines still on chezmoi |

## Rules

- **Edit the source in `home/`, not a copy.** A file in `~` is a link to this
  repository, so editing either path changes the same file.
- **A new file must be linked.** A file directly in `home/`, or in a new
  top-level directory under it, needs a `[dotfiles]` entry in
  `mise/conf.d/dotfiles.toml`. `mise run dot:add <path>` moves a file in and
  links it back. The pre-commit hook runs `dot:check`, which fails on anything
  left unlinked.
- **Never commit secrets or per-machine values.** Those go in
  `~/.config/mise/config.local.toml`, which is never committed.
- **Don't let mise manage `~/.claude`.** ccp owns that link.
  `home/.ccp/hub/` holds only the hub items made by hand; items installed from
  a source are fetched by `ccp bootstrap`.
- **Every bootstrap step must be safe to re-run.** Hook scripts skip work that
  is already done.
- **Scripts run on both macOS (BSD) and Linux (GNU).** Avoid flags such as
  `sed -i` that behave differently on the two.

## Tasks

```bash
mise run dot:check         # unlinked files, unsaved ccp hub items
mise run dot:save          # commit everything with an "Update <file>" message (never pushes)
mise run dot:pull          # pull main from origin, rebasing local commits
mise run dot:add <path>    # move a path from ~ into home/ and link it back
mise dot status            # link state
mise bootstrap --dry-run   # preview the whole machine setup
```

Commit and push only when asked.
