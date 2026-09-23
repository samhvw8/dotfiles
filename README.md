# Dotfiles

Dotfiles and machine setup for macOS and Linux, managed with
[mise](https://mise.jdx.dev). One `mise bootstrap` installs system packages,
clones repositories, links dotfiles and installs tools.

## Install

```bash
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash
```

For a minimal install (servers), pass `--minimal`:

```bash
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- --minimal
```

`setup.sh`:

1. Installs the Xcode Command Line Tools on macOS, or git and curl on
   Debian/Ubuntu, asking for your password once.
2. Installs mise, clones this repository to `~/.dotfiles`, and enables its
   pre-commit hook.
3. Asks for your git name and email and saves them in
   `~/.config/mise/config.local.toml`. Set `DOTFILES_GIT_NAME` and
   `DOTFILES_GIT_EMAIL` to skip the prompt.
4. Links `~/.config/mise/config.toml` to the full or minimal config.
5. Copies every existing file it is about to replace into
   `~/.dotfiles-backup-<timestamp>/`.
6. Runs `mise bootstrap`.

Then open a new shell. On a full install, run `ccp bootstrap` to fetch the
Claude Code skills installed from ccp sources; only the ccp hub items created
by hand are stored here.

## Layout

| Path | Purpose |
|------|---------|
| `home/` | Dotfiles, linked to the same paths under `~` |
| `mise/config.toml` | Full install: tools, full-only dotfiles, packages, repos and hooks |
| `mise/minimal.toml` | Minimal install: a smaller tool set and the minimal `.zshrc` |
| `mise/conf.d/dotfiles.toml` | Dotfiles, packages, repos and hooks shared by both installs |
| `mise/scripts/` | Bootstrap hook scripts |
| `mise/snippets/` | Templated blocks managed inside files such as `~/.gitconfig` |

`~/.config/mise/config.toml` links to `mise/config.toml` or `mise/minimal.toml`,
which is what makes a machine full or minimal. `mise/conf.d/dotfiles.toml` is
linked into `~/.config/mise/conf.d/` on both.

## How it works

`mise bootstrap` runs these steps in order. Each one skips work that is already
done, so it is safe to run again at any time:

1. `prepare-host.sh`: XDG directories, Homebrew and Rosetta 2 on macOS.
2. System packages: `brew` and `brew-cask` on macOS, `apt` on Linux.
3. `finish-host.sh`: deb-get and zsh as the login shell on Linux.
4. Repositories: `~/.fzf` and, on full installs, `~/.tmux/plugins/tpm`;
   then `setup-fzf.sh` builds fzf.
5. Dotfiles: links and managed blocks.
6. Tools from the mise config.
7. Full installs only: the `~/.claude` link (see below), Claude Code MCP
   servers, and FiraCode Nerd Font on Linux.

Dotfiles are linked like this:

- Files under `home/.ccp`, `home/.config` and `home/.local/bin` are linked one
  by one. Other files in those directories on the machine are left alone.
- Each file directly in `home/` has its own entry in `mise/conf.d/dotfiles.toml`.
- `~/.zshrc` links to `.zshrc` on full installs and `.zshrc_minimal` on minimal
  ones.
- `~/.claude` belongs to ccp, which repoints it on `ccp use -g <profile>`, so
  mise does not manage it. Bootstrap only creates it, with
  `ccp use -g default`, when it does not exist. An existing `~/.claude`
  directory is left alone; `ccp init` moves it into ccp.
- `~/.gitconfig` is not linked, because git and `gh` write to it. mise manages
  two marked blocks inside it: your identity from `config.local.toml`, and an
  include of `~/.base.gitconfig`.

## Everyday use

```bash
mise dot status            # linked, missing or different files
mise dot apply             # link files added to the repository
mise run dot:save          # commit every change in ~/.dotfiles
mise run dot:add <path>    # store a file or directory from ~ and link it
mise run dot:check         # find unlinked files and unsaved ccp hub items
mise bootstrap --dry-run   # preview the whole machine setup
mise bootstrap             # packages, repos, dotfiles and tools
```

### Change a dotfile

Edit it where it lives. Because it is a link, the change is already in
`~/.dotfiles`. Nothing is committed automatically; `dot:save` commits
everything with a message such as `Update .zshrc`:

```bash
mise run dot:save
git -C ~/.dotfiles push
```

### Add a dotfile

`dot:add` moves the path into `home/` at the same location, adds it to git,
and links it back:

```bash
mise run dot:add ~/.config/foo/config.toml
mise run dot:save
```

Files inside `home/.ccp`, `home/.config` and `home/.local/bin` are picked up
automatically. A file directly in `home/`, or a new top-level directory, also
needs an entry in `mise/conf.d/dotfiles.toml`; `dot:add` and the pre-commit
hook fail until it has one.

### Add a tool or package

- Tool: `mise use -g <tool>` writes to `mise/config.toml` through the link.
- Package: add `"brew:<name>" = { os = "macos" }` or `"apt:<name>" = "latest"`
  to `mise/conf.d/dotfiles.toml` for both installs, or to `mise/config.toml`
  for full installs only, then run `mise bootstrap packages apply`.

### Machine-local settings

`~/.config/mise/config.local.toml` is never committed. It holds the git identity
(`[vars]`) and private environment variables such as API keys (`[env]`). Apart
from the identity that `setup.sh` asks for, recreate it by hand on a new machine.

### Update another machine

```bash
git -C ~/.dotfiles pull
mise bootstrap
```

### ccp hub items

The ccp hub and profiles live in `home/.ccp`. Skills installed from ccp sources
are not stored here; `ccp bootstrap` fetches them. A hub item you create by
hand is only on that machine until you store it; `dot:check` lists such items:

```bash
mise run dot:add ~/.ccp/hub/skills/my-skill
```

`ccp bootstrap --push` wrote to chezmoi, which is no longer used; `dot:add`
replaces it.

## Troubleshooting

- **`mise dot status` shows a file as different.** An application replaced the
  link with a regular file. Copy that file into `home/` if its changes should be
  kept, then run `mise dot apply --force`.
- **A bootstrap step fails.** Fix the reported problem and run `mise bootstrap`
  again. Steps that already finished are skipped.
- **Not sure what a command will change.** Add `--dry-run`.

## Requirements

- macOS on Apple silicon, or Debian/Ubuntu Linux
- Internet connection

## History

Until September 2026 this repository was managed with chezmoi. The last chezmoi
layout is tagged `chezmoi-final-20260917`.
