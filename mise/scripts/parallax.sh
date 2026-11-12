#!/bin/bash

# =============================================================================
# Parallax CLI install or update (`mise run parallax:install`)
# Not a mise tool: samhvw8/parallax is private, publishes no releases, and its
# Go module path (github.com/samhv/parallax, in cli/) does not match the repo,
# so neither the github: nor the go: backend can fetch it. This builds the
# checkout at ~/workspace/parallax (cloned with gh when missing) into
# ~/.local/bin/parallax. omp and agy reach Parallax through this binary
# (`parallax call`, the parallax-cli skill); Claude Code uses the claude.ai
# connector instead.
# =============================================================================

set -euo pipefail

repo="${PARALLAX_REPO:-$HOME/workspace/parallax}"

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[0;33m[WARN]\033[0m $1" >&2
}

if [[ ! -d "$repo/.git" ]]; then
    if ! command -v gh >/dev/null 2>&1 || ! gh auth token >/dev/null 2>&1; then
        echo "parallax: $repo is missing and gh is not signed in; run 'gh auth login', then 'mise run parallax:install'" >&2
        exit 1
    fi
    log_info "Cloning samhvw8/parallax into $repo"
    mkdir -p "$(dirname "$repo")"
    gh repo clone samhvw8/parallax "$repo"
else
    # Another agent may be working in the checkout: only fast-forward a clean main.
    branch=$(git -C "$repo" rev-parse --abbrev-ref HEAD)
    if [[ "$branch" == "main" && -z "$(git -C "$repo" status --porcelain --untracked-files=no)" ]]; then
        log_info "Updating $repo (main)"
        git -C "$repo" pull --ff-only --quiet || log_warn "parallax: pull failed; building the current checkout"
    else
        log_warn "parallax: $repo is on '$branch' or has uncommitted changes; building it as it is, without a pull"
    fi
fi

if [[ "$(uname -s)" == "Darwin" ]]; then
    # The Makefile builds, copies to ~/.local/bin and ad-hoc signs the binary.
    mise exec -- make -C "$repo/cli" install
else
    mkdir -p "$HOME/.local/bin"
    (cd "$repo/cli" && mise exec -- go build -o "$HOME/.local/bin/parallax" .)
fi

# `tools` builds the real server in memory, so it fails if the binary is broken.
"$HOME/.local/bin/parallax" tools >/dev/null
log_info "parallax installed: $("$HOME/.local/bin/parallax" tools | grep -m1 -o '^[0-9]* tools')"
