#!/bin/bash

# =============================================================================
# Store files or directories from ~ in this repository and link them back
# (mise run dot:add <path>...). Each path moves to home/<same path>, is added
# to git, and `mise dot apply` links it.
# =============================================================================

set -euo pipefail

DOTFILES_DIR="$HOME/.dotfiles"

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

if [[ $# -eq 0 ]]; then
    log_error "Usage: mise run dot:add <path>..."
    exit 1
fi

for arg in "$@"; do
    path="$(cd "$(dirname "$arg")" && pwd)/$(basename "$arg")"
    rel="${path#"$HOME"/}"
    dest="$DOTFILES_DIR/home/$rel"

    if [[ "$rel" == "$path" ]]; then
        log_error "$arg is not under $HOME"
        exit 1
    fi
    if [[ ! -e "$path" || -L "$path" ]]; then
        log_error "$arg is missing or already a link"
        exit 1
    fi
    if [[ -e "$dest" ]]; then
        log_error "home/$rel already exists in the repository"
        exit 1
    fi

    mkdir -p "$(dirname "$dest")"
    mv "$path" "$dest"
    git -C "$DOTFILES_DIR" add "home/$rel"
    log_success "Stored ~/$rel as home/$rel"
done

mise dot apply --yes
# Fails when a stored path needs its own [dotfiles] entry.
python3 "$DOTFILES_DIR/mise/scripts/dot-check.py"
