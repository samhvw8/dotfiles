#!/bin/bash

# =============================================================================
# Host preparation (mise bootstrap pre-packages hook)
# Runs on every `mise bootstrap`; every step skips work already done.
# =============================================================================

set -euo pipefail

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

setup_folder() {
    local dirs=(
        "$HOME/.local/bin"
        "$HOME/.local/share"
        "$HOME/.local/state"
        "$HOME/.local/run"
        "$HOME/.bin"
        "$HOME/.config"
        "$HOME/bin"
        "$HOME/tmp"
        "$HOME/.cache/zsh/completions"
        "$HOME/.local/share/zsh"
    )

    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]] && ! mkdir -p "$dir"; then
            log_error "Failed to create directory: $dir"
            return 1
        fi
    done

    # Secure permissions for the runtime directory
    if ! chmod 0700 "$HOME/.local/run"; then
        log_error "Failed to set permissions for runtime directory"
        return 1
    fi
}

setup_homebrew() {
    # mise installs brew packages without Homebrew, but ~/.zprofile and
    # ~/.profile still load `brew shellenv`.
    if command_exists brew || [[ -x /opt/homebrew/bin/brew ]]; then
        return 0
    fi

    log_info "Installing Homebrew"
    if ! /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
        log_error "Failed to install Homebrew"
        return 1
    fi
    log_success "Homebrew installed"
}

setup_rosetta() {
    [[ "$(uname -m)" == "arm64" ]] || return 0
    pgrep oahd >/dev/null && return 0

    # Requires root. setup.sh primes the sudo credential up front.
    log_info "Installing Rosetta 2"
    if ! sudo softwareupdate --install-rosetta --agree-to-license; then
        log_error "Failed to install Rosetta 2"
        return 1
    fi
    log_success "Rosetta 2 installed"
}

main() {
    setup_folder

    if [[ "$(uname -s)" == "Darwin" ]]; then
        setup_homebrew
        setup_rosetta
    fi
}

main "$@"
