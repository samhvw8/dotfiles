#!/bin/bash

# =============================================================================
# Pull the latest main from origin (mise run dot:pull). On main, local commits
# from dot:save are rebased on top and uncommitted edits are stashed around the
# pull. On any other branch, main is fast-forwarded without switching to it.
# =============================================================================

set -euo pipefail

DOTFILES_DIR="$HOME/.dotfiles"
BRANCH="main"

current="$(git -C "$DOTFILES_DIR" symbolic-ref --short -q HEAD || true)"
if [ "$current" = "$BRANCH" ]; then
    git -C "$DOTFILES_DIR" pull --rebase --autostash origin "$BRANCH"
else
    # Refuses a non-fast-forward rather than rewriting the local branch.
    git -C "$DOTFILES_DIR" fetch origin "$BRANCH:$BRANCH"
    echo "Updated $BRANCH; still on ${current:-a detached HEAD}."
fi
git -C "$DOTFILES_DIR" log --oneline -1 "$BRANCH"
