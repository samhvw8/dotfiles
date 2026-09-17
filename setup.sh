#!/bin/bash

# =============================================================================
# Dotfiles Setup Script
# Installs mise, clones this repository to ~/.dotfiles, links the mise config
# and runs `mise bootstrap`, which installs packages, links dotfiles and
# installs tools.
# =============================================================================

set -euo pipefail

REPO_URL="https://github.com/samhvw8/dotfiles.git"
DOTFILES_DIR="$HOME/.dotfiles"
MISE_CONFIG_DIR="$HOME/.config/mise"

# Log functions
log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -m, --minimal     Minimal installation (fewer packages and tools)"
    echo "  -h, --help        Display this help message"
    echo ""
    echo "Set DOTFILES_GIT_NAME and DOTFILES_GIT_EMAIL to skip the identity prompt."
    exit 0
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# This script is usually run as `curl -fsSL .../setup.sh | bash`, which means
# stdin is the script text -- not the user. Anything that needs a human answer
# has to talk to the terminal device directly.
tty_available() {
    [[ -r /dev/tty && -w /dev/tty ]]
}

wait_for_user() {
    log_info "$1"
    if ! tty_available; then
        log_info "No terminal attached; continuing without waiting."
        return 0
    fi
    read -r -p "    Press Enter when done (Ctrl-C to abort)... " _ </dev/tty || true
}

# -----------------------------------------------------------------------------
# sudo handling
#
# Several steps below the surface need root: Homebrew's installer, apt, Rosetta,
# and the Command Line Tools package. Rather than letting a password prompt
# ambush the user 10 minutes into a package install, ask once up front and then
# refresh the credential in the background so it never expires mid-run.
# -----------------------------------------------------------------------------
SUDO_KEEPALIVE_PID=""

start_sudo_keepalive() {
    [[ -z "$SUDO_KEEPALIVE_PID" ]] || return 0
    # sudo's timestamp defaults to 5 minutes; refresh well inside that.
    while true; do
        sudo -n true 2>/dev/null || break
        sleep 60
        kill -0 "$$" 2>/dev/null || break
    done &
    SUDO_KEEPALIVE_PID=$!
}

stop_sudo_keepalive() {
    [[ -n "$SUDO_KEEPALIVE_PID" ]] || return 0
    kill "$SUDO_KEEPALIVE_PID" 2>/dev/null || true
    SUDO_KEEPALIVE_PID=""
}

trap stop_sudo_keepalive EXIT

# Returns non-zero (without exiting) when elevation is impossible, so callers
# can decide whether that is fatal for their particular step.
ensure_sudo() {
    if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
        return 0
    fi

    if ! command_exists sudo; then
        log_error "sudo is not installed; cannot elevate privileges."
        return 1
    fi

    # Already have a live credential (or NOPASSWD) -- nothing to ask.
    if sudo -n true 2>/dev/null; then
        start_sudo_keepalive
        return 0
    fi

    if ! tty_available; then
        log_error "Administrator access is needed, but there is no terminal to read a password from."
        log_error "Re-run interactively instead of piping, e.g.:"
        log_error "  bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh)\""
        return 1
    fi

    log_info "Administrator access is required for parts of this setup"
    log_info "  (Homebrew, system packages, Command Line Tools, Rosetta 2)."
    log_info "You will be asked for your password once. It is not stored anywhere."

    # sudo reads its own prompt from /dev/tty, so this works under `curl | bash`.
    if ! sudo -v; then
        log_error "Could not obtain administrator access."
        return 1
    fi

    log_success "Administrator access granted; caching it for the rest of the run."
    start_sudo_keepalive
}

# -----------------------------------------------------------------------------
# Xcode Command Line Tools (macOS)
#
# Homebrew, git and anything that compiles depend on these. macOS ships stub
# binaries at /usr/bin/git etc. that merely pop a GUI dialog when the tools are
# absent, so `command_exists git` is not a usable test -- probe the active
# developer directory and ask xcrun to resolve a real tool instead.
# -----------------------------------------------------------------------------
clt_installed() {
    local dev_dir
    dev_dir="$(/usr/bin/xcode-select -p 2>/dev/null)" || return 1
    [[ -n "$dev_dir" && -d "$dev_dir" ]] || return 1
    /usr/bin/xcrun --find git >/dev/null 2>&1
}

install_clt_headless() {
    local marker="/tmp/.com.apple.dt.CLT.installondemand"
    local label=""

    ensure_sudo || return 1

    # The marker file makes the CLT package visible to softwareupdate, which
    # avoids the click-through dialog entirely.
    touch "$marker" 2>/dev/null || true
    label="$(softwareupdate -l 2>/dev/null \
        | grep -E '^ *\* *Label: .*Command Line Tools' \
        | sed -E 's/^ *\* *Label: *//' \
        | tail -1)" || label=""
    rm -f "$marker" 2>/dev/null || true

    if [[ -z "$label" ]]; then
        log_info "softwareupdate did not offer a Command Line Tools package."
        return 1
    fi

    log_info "Installing '$label' (this takes a few minutes)..."
    sudo softwareupdate -i "$label" --verbose || return 1
    clt_installed
}

install_clt_interactive() {
    log_info "Opening the graphical Command Line Tools installer..."
    /usr/bin/xcode-select --install >/dev/null 2>&1 || true
    wait_for_user "Complete the 'Install Command Line Tools' dialog that just appeared."

    local waited=0
    local timeout=1800
    while ! clt_installed; do
        if (( waited >= timeout )); then
            log_error "Gave up after $((timeout / 60)) minutes waiting for Command Line Tools."
            log_error "Install them manually with 'xcode-select --install', then re-run this script."
            return 1
        fi
        sleep 10
        waited=$((waited + 10))
        if (( waited % 60 == 0 )); then
            log_info "Still waiting for Command Line Tools... (${waited}s elapsed)"
        fi
    done
}

setup_clt() {
    if clt_installed; then
        log_info "Xcode Command Line Tools already installed"
        return 0
    fi

    log_info "Xcode Command Line Tools are missing; they are required to continue."

    if install_clt_headless || install_clt_interactive; then
        log_success "Xcode Command Line Tools installed"
        return 0
    fi

    log_error "Failed to install the Xcode Command Line Tools."
    log_error "If they look installed but are broken, try: sudo xcode-select --reset"
    exit 1
}

# git and curl are needed to fetch mise and this repository. On macOS the
# Command Line Tools provide git; a bare Debian/Ubuntu may have neither.
setup_linux_prerequisites() {
    command_exists git && command_exists curl && return 0

    log_info "Installing git and curl..."
    if ! sudo apt-get update || ! sudo apt-get install --yes git curl; then
        log_error "Failed to install git and curl"
        exit 1
    fi
}

setup_mise() {
    export PATH="$HOME/.local/bin:$PATH"
    if command_exists mise; then
        log_info "mise already installed"
        return 0
    fi

    log_info "Installing mise..."
    if ! curl -fsSL https://mise.run | sh; then
        log_error "Failed to install mise"
        exit 1
    fi
}

clone_dotfiles() {
    if [[ -d "$DOTFILES_DIR/.git" ]]; then
        log_info "Dotfiles repository already present at $DOTFILES_DIR"
        return 0
    fi

    log_info "Cloning dotfiles repository into $DOTFILES_DIR..."
    if ! git clone "$REPO_URL" "$DOTFILES_DIR"; then
        log_error "Failed to clone $REPO_URL"
        exit 1
    fi
}

toml_string() {
    local value=${1//\\/\\\\}
    printf '"%s"' "${value//\"/\\\"}"
}

# The git identity is machine-local: it goes into config.local.toml, which is
# never committed, and is rendered into ~/.gitconfig by mise.
setup_git_identity() {
    local local_config="$MISE_CONFIG_DIR/config.local.toml"
    local name="${DOTFILES_GIT_NAME:-}"
    local email="${DOTFILES_GIT_EMAIL:-}"

    if [[ -f "$local_config" ]] && grep -qE '^git_name *=' "$local_config"; then
        log_info "Git identity already set in $local_config"
        return 0
    fi
    if [[ -f "$local_config" ]] && grep -qE '^\[vars\]' "$local_config"; then
        log_error "$local_config already has a [vars] table; add git_name and git_email to it, then re-run."
        exit 1
    fi

    if [[ -z "$name" || -z "$email" ]]; then
        if ! tty_available; then
            log_error "No terminal to ask for the git identity; set DOTFILES_GIT_NAME and DOTFILES_GIT_EMAIL."
            exit 1
        fi
        [[ -n "$name" ]] || read -r -p "Git user name: " name </dev/tty
        [[ -n "$email" ]] || read -r -p "Git email address: " email </dev/tty
    fi

    mkdir -p "$MISE_CONFIG_DIR"
    printf '\n[vars]\ngit_name = %s\ngit_email = %s\n' "$(toml_string "$name")" "$(toml_string "$email")" >>"$local_config"
    log_success "Git identity saved to $local_config"
}

# Link one path to the repository, moving anything else that is in the way.
link_path() {
    local source=$1 target=$2
    if [[ -L "$target" && "$(readlink "$target")" == "$source" ]]; then
        return 0
    fi
    if [[ -e "$target" || -L "$target" ]]; then
        mv "$target" "$target.bak-$(date +%Y%m%d-%H%M%S)"
    fi
    ln -s "$source" "$target"
}

# ~/.config/mise/config.toml selects the installation: the full or minimal
# config, each of which declares its own dotfiles, packages and tools.
link_mise_config() {
    local config="$DOTFILES_DIR/mise/config.toml"
    [[ "$MINIMAL" == "true" ]] && config="$DOTFILES_DIR/mise/minimal.toml"

    mkdir -p "$MISE_CONFIG_DIR/conf.d"
    link_path "$config" "$MISE_CONFIG_DIR/config.toml"
    link_path "$DOTFILES_DIR/mise/conf.d/dotfiles.toml" "$MISE_CONFIG_DIR/conf.d/dotfiles.toml"
}

# Copy aside every existing file that bootstrap is about to replace with a link.
# mise refuses to replace real files unless --force-dotfiles is passed, which
# this script does, so this is the safety net.
backup_existing_targets() {
    local backup_dir rel target count=0
    backup_dir="$HOME/.dotfiles-backup-$(date +%Y%m%d-%H%M%S)"

    while IFS= read -r rel; do
        rel="${rel#home/}"
        target="$HOME/$rel"
        [[ -e "$target" || -L "$target" ]] || continue
        [[ -L "$target" && "$(readlink "$target")" == "$DOTFILES_DIR/home/$rel" ]] && continue
        mkdir -p "$backup_dir/$(dirname "$rel")"
        cp -a "$target" "$backup_dir/$rel"
        count=$((count + 1))
    done < <(git -C "$DOTFILES_DIR" ls-files home; echo .gitconfig)

    if [[ $count -eq 0 ]]; then
        log_info "No existing dotfiles to back up."
        return
    fi

    log_success "Backed up $count existing file(s) to $backup_dir"
    log_info "Restore one with: cp -a \"$backup_dir/<relative/path>\" \"\$HOME/<relative/path>\""
}

# Parse command line arguments
MINIMAL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--minimal)
            MINIMAL=true
            shift
            ;;
        -h|--help)
            print_usage
            ;;
        *)
            log_error "Unknown option: $1"
            print_usage
            ;;
    esac
done

# Main setup
main() {
    log_info "Starting dotfiles setup with mise..."

    # Prerequisites that must be in place before git, mise, or the bootstrap
    # hooks can do anything useful.
    if [[ "$(uname -s)" == "Darwin" ]]; then
        setup_clt
    fi

    # Ask for the password now, while the user is still watching, so the long
    # unattended stretch below (Homebrew / apt / Rosetta) does not stall
    # waiting on a prompt nobody is there to answer.
    if ! ensure_sudo; then
        log_info "Continuing without cached administrator access."
        log_info "Individual steps may prompt for your password later."
    fi

    if [[ "$(uname -s)" == "Linux" ]]; then
        setup_linux_prerequisites
    fi

    setup_mise
    clone_dotfiles
    setup_git_identity
    link_mise_config
    backup_existing_targets

    log_info "Running mise bootstrap (packages, repositories, dotfiles, tools)..."
    if ! mise bootstrap --update --yes --force-dotfiles; then
        log_error "mise bootstrap failed; fix the reported step and re-run: mise bootstrap"
        exit 1
    fi

    log_success "Dotfiles setup completed successfully!"

    if [[ "$MINIMAL" == "true" ]]; then
        log_info "Minimal installation completed - essential tools only."
    else
        log_info "Full installation completed - all development tools installed."
    fi

    log_info "Please restart your shell or run 'source ~/.zshrc' to load the new configuration."
}

# Run main function
main "$@"
