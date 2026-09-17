#!/bin/bash

# =============================================================================
# fzf install (mise bootstrap post-repos hook)
# ~/.fzf is cloned by [bootstrap.repos]; this builds the binary and writes
# ~/.fzf.zsh, which ~/.zshrc already loads. --no-update-rc keeps the installer
# from appending to ~/.zshrc, which is a link into this repository.
# =============================================================================

set -euo pipefail

if [[ -x "$HOME/.fzf/bin/fzf" && -f "$HOME/.fzf.zsh" ]]; then
    exit 0
fi

"$HOME/.fzf/install" --key-bindings --completion --no-update-rc
