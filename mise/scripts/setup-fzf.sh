#!/bin/bash

# =============================================================================
# fzf install (mise bootstrap post-repos hook)
# ~/.fzf is cloned by [bootstrap.repos]; this builds the binary and writes
# ~/.fzf.zsh, which ~/.zshrc already loads. --no-update-rc keeps the installer
# from appending to ~/.zshrc, which is a link into this repository.
# =============================================================================

set -euo pipefail

# `mise bootstrap --update` can move the checkout to a newer release, so an
# existing binary only counts when it matches the checkout's version.
wanted="$(sed -n 's/^version=//p' "$HOME/.fzf/install")"
installed="$("$HOME/.fzf/bin/fzf" --version 2>/dev/null | awk '{print $1}')" || installed=""

if [[ "$installed" == "$wanted" && -f "$HOME/.fzf.zsh" ]]; then
    exit 0
fi

"$HOME/.fzf/install" --key-bindings --completion --no-update-rc
