#!/bin/bash

# =============================================================================
# Simplified Dotfiles Setup Script
# Now uses chezmoi's automatic setup via run_once scripts
# =============================================================================

set -euo pipefail

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
    echo "  -c, --conda       Install Miniconda (not installed by default)"
    echo "  -h, --help        Display this help message"
    echo ""
    echo "This script now uses chezmoi to automatically set up your dotfiles."
    echo "Most setup tasks will run automatically when chezmoi initializes."
    exit 0
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Parse command line arguments
MINIMAL=false
CONDA=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--minimal)
            MINIMAL=true
            shift
            ;;
        -c|--conda)
            CONDA=true
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
    log_info "Starting dotfiles setup with chezmoi..."

    # Install chezmoi if not present
    if ! command_exists chezmoi; then
        log_info "Installing chezmoi..."
        if ! sh -c "$(curl -fsLS get.chezmoi.io)"; then
            log_error "Failed to install chezmoi"
            exit 1
        fi
        # Add chezmoi to PATH for this session
        export PATH="$HOME/bin:$PATH"
    else
        log_info "chezmoi already installed"
    fi

    # Initialize and apply dotfiles from repository
    # Chezmoi will prompt for name/email via .chezmoi.toml.tmpl
    if [[ ! -d "$HOME/.local/share/chezmoi/.git" ]]; then
        log_info "Initializing chezmoi with dotfiles repository..."
        log_info "You will be prompted for your git name and email..."
        log_info "This will automatically install all required tools and dependencies..."
        if ! chezmoi init --apply --promptBool minimal="${MINIMAL}" --promptBool conda="${CONDA}" https://github.com/samhvw8/dotfiles.git; then
            log_error "Failed to initialize chezmoi with dotfiles repository"
            exit 1
        fi
    else
        log_info "Chezmoi already initialized, applying latest configurations..."
        if ! chezmoi apply; then
            log_error "Failed to apply chezmoi configurations"
            exit 1
        fi
    fi

    log_success "Dotfiles setup completed successfully!"
    log_info "Your development environment is now fully configured."
    
    if [[ "$MINIMAL" == "true" ]]; then
        log_info "Minimal installation completed - essential tools only."
    else
        log_info "Full installation completed - all development tools installed."
    fi
    
    log_info "Please restart your shell or run 'source ~/.zshrc' to load the new configuration."
}

# Run main function
main "$@"
