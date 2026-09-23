#!/bin/bash

# =============================================================================
# Commit every change in this repository (mise run dot:save). Edits made
# through the links in ~ land here uncommitted; this records them with a
# chezmoi-style message such as "Update .zshrc Add .config/foo/config.toml".
# =============================================================================

set -euo pipefail

DOTFILES_DIR="$HOME/.dotfiles"

python3 "$DOTFILES_DIR/mise/scripts/dot-check.py"

git -C "$DOTFILES_DIR" add -A
if git -C "$DOTFILES_DIR" diff --cached --quiet; then
    echo "Nothing to save."
    exit 0
fi

message="$(git -C "$DOTFILES_DIR" diff --cached --name-status | awk '
    { path = $NF; sub(/^home\//, "", path) }
    $1 ~ /^A/ { printf "%sAdd %s", sep, path; sep = " "; next }
    $1 ~ /^D/ { printf "%sRemove %s", sep, path; sep = " "; next }
    $1 ~ /^R/ { printf "%sRename %s", sep, path; sep = " "; next }
    { printf "%sUpdate %s", sep, path; sep = " " }
')"

# The pre-commit hook would only repeat the check above.
git -C "$DOTFILES_DIR" commit -q --no-verify -m "$message"
git -C "$DOTFILES_DIR" log --oneline -1
