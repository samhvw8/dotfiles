# Dotfiles Setup

Dotfiles and machine setup for macOS and Linux, managed with
[mise](https://mise.jdx.dev): one `mise bootstrap` installs system packages,
clones repositories, links dotfiles and installs tools.

## Quick Install

Basic installation:
```bash
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash
```

With command line options:
```bash
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- [OPTIONS]
```

## Installation Options

- `-m, --minimal`: Minimal installation with fewer packages and tools
- `-h, --help`: Display help message

The script asks for your git name and email once and stores them in
`~/.config/mise/config.local.toml`, which is never committed. Set
`DOTFILES_GIT_NAME` and `DOTFILES_GIT_EMAIL` to skip the prompt.

## Layout

| Path | Purpose |
|------|---------|
| `home/` | Dotfiles, linked to the same paths under `~` |
| `mise/config.toml` | Full install: tools, full-only dotfiles, packages, repos and hooks |
| `mise/minimal.toml` | Minimal install: the same, trimmed down |
| `mise/conf.d/dotfiles.toml` | Dotfiles, packages, repos and hooks shared by both installs |
| `mise/scripts/` | Bootstrap hook scripts; they run on every bootstrap and skip finished work |
| `mise/snippets/` | Templated blocks managed inside files such as `~/.gitconfig` |

`~/.config/mise/config.toml` links to `mise/config.toml` or `mise/minimal.toml`,
which is what makes a machine full or minimal.

## Everyday use

```bash
mise dot status            # what is linked, missing or different
mise dot apply             # link new files
mise bootstrap --dry-run   # preview the whole machine setup
mise bootstrap             # packages, repos, dotfiles and tools
```

Edits through `~` land directly in this repository, so commit them with git.
To add a new dotfile, move it into `home/`, `git add` it, then run
`mise dot apply`. Files inside `home/.ccp`, `home/.config` and
`home/.local/bin` are picked up automatically; a file directly in `home/`, or a
new top-level directory, also needs an entry in `mise/conf.d/dotfiles.toml`. If an application replaces a link with a regular file,
`mise dot status` reports it as different; copy the file back into `home/`
and run `mise dot apply --force`.

## Features

### Core Setup
- XDG base directory structure
- Git configuration
- ZSH as default shell (Linux)
- Homebrew (macOS)
- Rosetta 2 (macOS ARM)

### Tools & Utilities
- [mise](https://mise.jdx.dev) for dotfiles, packages and runtime version management
- [fzf](https://github.com/junegunn/fzf) for fuzzy finding
- [tmux](https://github.com/tmux/tmux) with plugin manager (full installation)

### Additional Features in Full Installation
- Development tools and build essentials
- Python pip and related packages
- FiraCode Nerd Font (Linux)
- Additional system utilities

## System Requirements
- macOS or Linux (Debian/Ubuntu-based)
- Internet connection

## Note
The script automatically detects your operating system and installs the appropriate packages and configurations. Use the minimal installation option (-m) for a lighter setup.
