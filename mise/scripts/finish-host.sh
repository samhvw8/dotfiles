#!/bin/bash

# =============================================================================
# Host setup after system packages (mise bootstrap post-packages hook)
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

setup_debget() {
    if command_exists deb-get; then
        return 0
    fi

    if ! curl -sL https://raw.githubusercontent.com/wimpysworld/deb-get/main/deb-get | sudo -E bash -s install deb-get; then
        log_error "Failed to install deb-get"
        return 1
    fi

    log_success "deb-get setup completed successfully"
}

setup_login_shell() {
    local zsh_path
    zsh_path="$(command -v zsh)" || return 0
    [[ "$SHELL" == "$zsh_path" ]] && return 0

    if ! sudo chsh -s "$zsh_path" "$USER"; then
        log_error "Failed to change default shell to zsh"
        return 1
    fi
    log_success "Default shell changed to zsh"
}

main() {
    [[ "$(uname -s)" == "Linux" ]] || return 0
    command_exists apt-get || return 0

    setup_debget
    setup_login_shell
}

main "$@"
