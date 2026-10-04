#!/bin/bash

# =============================================================================
# Push main to origin (mise run dot:push). Runs dot:check, then dot:pull so
# local commits sit on top of origin, lists what will go out, and pushes.
# Uncommitted edits are not pushed; commit them first with dot:save.
# =============================================================================

set -euo pipefail

DOTFILES_DIR="$HOME/.dotfiles"
BRANCH="main"

python3 "$DOTFILES_DIR/mise/scripts/dot-check.py"
bash "$DOTFILES_DIR/mise/scripts/dot-pull.sh"

ahead="$(git -C "$DOTFILES_DIR" log --oneline "origin/$BRANCH..$BRANCH")"
if [ -z "$ahead" ]; then
    echo "Nothing to push: $BRANCH matches origin."
else
    echo "Pushing to origin/$BRANCH:"
    echo "$ahead"
    git -C "$DOTFILES_DIR" push origin "$BRANCH"
fi

if [ -n "$(git -C "$DOTFILES_DIR" status --porcelain)" ]; then
    echo "Uncommitted changes stay local; run mise run dot:save to commit them."
fi
