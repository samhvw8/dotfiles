# Dotfiles Setup

A comprehensive dotfiles setup script that configures development environments for both macOS and Linux systems.

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
- `-n, --no-sudo`: Install without sudo privileges
- `-h, --help`: Display help message

Examples:
```bash
# Minimal installation
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- -m

# Installation without sudo
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- -n

# Minimal installation without sudo
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- -m -n
```

## Features

### Core Setup
- XDG base directory structure
- Git configuration
- ZSH as default shell (Linux)
- Homebrew (macOS)
- Rosetta 2 (macOS ARM)

### Tools & Utilities
- [dotbare](https://github.com/kazhala/dotbare) for dotfiles management
- [fzf](https://github.com/junegunn/fzf) for fuzzy finding
- [mise](https://mise.run) for runtime version management
- [tmux](https://github.com/tmux/tmux) with plugin manager (full installation)
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) for Python environment management (full installation)

### Additional Features in Full Installation
- Development tools and build essentials
- Python pip and related packages
- FiraCode Nerd Font (Linux)
- Additional system utilities

## System Requirements
- macOS or Linux (Debian/Ubuntu-based)
- Internet connection
- Git
- curl

## Note
The script automatically detects your operating system and installs the appropriate packages and configurations. Use the minimal installation option (-m) for a lighter setup or the no-sudo option (-n) when you don't have sudo privileges.
