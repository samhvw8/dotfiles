#!/bin/bash

# Exit on error, undefined variables, and pipe failures
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

# Error handler
trap 'log_error "An error occurred on line $LINENO. Exit code: $?"' ERR

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -m, --minimal     Minimal installation (fewer packages and tools)"
    echo "  -n, --no-sudo     Install without sudo privileges"
    echo "  -h, --help        Display this help message"
    exit 0
}

# Check internet connectivity
check_internet() {
    if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        log_error "No internet connection. Please check your network and try again."
        exit 1
    fi
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Parse command line arguments
MINIMAL=false
NO_SUDO=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--minimal)
            MINIMAL=true
            shift
            ;;
        -n|--no-sudo)
            NO_SUDO=true
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
    )

    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            if ! mkdir -p "$dir"; then
                log_error "Failed to create directory: $dir"
                return 1
            fi
        fi
    done

    # Set secure permissions for runtime directory
    if ! chmod 0700 "${HOME}/.local/run"; then
        log_error "Failed to set permissions for runtime directory"
        return 1
    fi

    # Export XDG variables
    export XDG_CONFIG_HOME="${HOME}/.config"
    export XDG_CACHE_HOME="${HOME}/.cache"
    export XDG_DATA_HOME="${HOME}/.local/share"
    export XDG_STATE_HOME="${HOME}/.local/state"
    export XDG_RUNTIME_DIR="${HOME}/.local/run"

    # ZSH specific directories
    export ZSH_DATA_DIR="${XDG_DATA_HOME}/zsh"
    export ZSH_CACHE_DIR="${XDG_CACHE_HOME}/zsh"
    export ZSH_COMPDUMP="${ZSH_CACHE_DIR}/zcompdump"

    if ! mkdir -p "${ZSH_CACHE_DIR}"/completions "${ZSH_DATA_DIR}"; then
        log_error "Failed to create ZSH directories"
        return 1
    fi

    log_success "Folder setup completed successfully"
}

setup_dotbare() {
    if [[ -d "$HOME/.dotbare" ]]; then
        log_info "dotbare already installed, skipping"
        return 0
    fi

    if ! git clone https://github.com/kazhala/dotbare.git ~/.dotbare; then
        log_error "Failed to clone dotbare repository"
        return 1
    fi

    export PATH=$PATH:$HOME/.dotbare
    if ! dotbare finit -u https://github.com/samhvw8/dotfiles.git; then
        log_error "Failed to initialize dotbare"
        return 1
    fi

    if [[ -f "$HOME/.profile" ]]; then
        source "$HOME/.profile"
    else
        log_error "$HOME/.profile not found after dotbare setup"
        return 1
    fi

    log_success "dotbare setup completed successfully"
}

setup_gitconfig() {
    local gitconfig="$HOME/.gitconfig"
    if grep -q "path = ~/.base.gitconfig" "$gitconfig" 2>/dev/null; then
        log_info "Git config already set up, skipping"
        return 0
    fi

    {
        echo '[include]'
        echo 'path = ~/.base.gitconfig'
    } >> "$gitconfig" || {
        log_error "Failed to update git config"
        return 1
    }

    log_success "Git config setup completed successfully"
}

setup_font_linux() {
    local font_path="$HOME/.fonts/FiraCode Nerd Font Mono.ttf"
    if [[ -f "$font_path" ]]; then
        log_info "Fonts already installed, skipping"
        return 0
    fi

    if ! mkdir -p "$HOME/.fonts"; then
        log_error "Failed to create fonts directory"
        return 1
    fi

    if ! wget -O "$font_path" https://github.com/ryanoasis/nerd-fonts/raw/refs/heads/master/patched-fonts/FiraCode/Regular/FiraCodeNerdFont-Regular.ttf; then
        log_error "Failed to download font"
        return 1
    fi

    if ! fc-cache -f -v; then
        log_error "Failed to update font cache"
        return 1
    fi

    log_success "Font setup completed successfully"
}

setup_fzf() {
    if [[ -d "$HOME/.fzf" ]]; then
        log_info "fzf already installed, skipping"
        return 0
    fi

    if ! git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf; then
        log_error "Failed to clone fzf repository"
        return 1
    fi

    if ! ~/.fzf/install --all; then
        log_error "Failed to install fzf"
        return 1
    fi

    log_success "fzf setup completed successfully"
}

setup_tpm() {
    if [[ -d "$HOME/.tmux/plugins/tpm" ]]; then
        log_info "tmux plugin manager already installed, skipping"
        return 0
    fi

    if ! git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm; then
        log_error "Failed to clone tpm repository"
        return 1
    fi

    log_success "tmux plugin manager setup completed successfully"
}

setup_miniconda() {
    if command_exists conda; then
        log_info "Miniconda already installed, skipping"
        return 0
    fi

    if [[ $(uname) == "Darwin" ]]; then
        if ! brew install miniconda; then
            log_error "Failed to install miniconda via brew"
            return 1
        fi
    else
        local miniconda_script="$HOME/miniconda.sh"
        if ! wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O "$miniconda_script"; then
            log_error "Failed to download miniconda installer"
            return 1
        fi

        if ! bash "$miniconda_script" -b -p "$HOME/miniconda3"; then
            log_error "Failed to install miniconda"
            rm -f "$miniconda_script"
        return 1
        fi
        rm -f "$miniconda_script"
    fi

    log_success "Miniconda setup completed successfully"
}

setup_mise() {
    if command_exists mise; then
        log_info "mise already installed, skipping"
        return 0
    fi

    if ! curl -fsSL https://mise.run | sh; then
        log_error "Failed to install mise"
        return 1
    fi

    if ! mise install; then
        log_error "Failed to run mise install"
        return 1
    fi

    log_success "mise setup completed successfully"
}

setup_debget() {
    if command_exists deb-get; then
        log_info "deb-get already installed, skipping"
        return 0
    fi

    if ! curl -sL https://raw.githubusercontent.com/wimpysworld/deb-get/main/deb-get | sudo -E bash -s install deb-get; then
        log_error "Failed to install deb-get"
        return 1
    fi

    log_success "deb-get setup completed successfully"
}

# Main setup
main() {
    log_info "Starting setup process..."
    check_internet

    # macOS setup
    if [[ $(uname) == "Darwin" ]]; then
        log_info "Setting up macOS"
        if ! command_exists brew; then
            if ! /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
                log_error "Failed to install Homebrew"
                exit 1
            fi
        else
            log_info "Homebrew already installed, skipping"
        fi
        eval "$(/opt/homebrew/bin/brew shellenv)"
    # Linux setup
    else
        log_info "Setting up Linux"
        if [[ "$NO_SUDO" == "false" ]]; then
            if ! sudo apt update; then
                log_error "Failed to update apt"
                exit 1
            fi

            local packages=(tmux vim git zsh wget curl net-tools unzip aptitude apt-transport-https)
            if [[ "$MINIMAL" == "false" ]]; then
                packages+=(python3-pip gnupg ca-certificates software-properties-common build-essential terminator zip)
            fi

            if ! sudo apt-get install --yes "${packages[@]}"; then
                log_error "Failed to install required packages"
                exit 1
            fi

            setup_debget
        fi
    fi

    setup_folder
    setup_dotbare

    # Configure based on minimal/full setup
    if [[ "$MINIMAL" == "true" ]]; then
        rm -f "$HOME/.config/mise/config.toml"
        cp "$HOME/.config/mise/config.toml.setup.minimal" "$HOME/.config/mise/config.toml"
        cp "$HOME/.zshrc.setup.minimal" "$HOME/.zshrc"
    else
        rm -f "$HOME/.config/mise/config.toml"
        cp "$HOME/.config/mise/config.toml.setup" "$HOME/.config/mise/config.toml"
        cp "$HOME/.zshrc.setup" "$HOME/.zshrc"
    fi

    # Install packages on macOS
    if [[ $(uname) == "Darwin" ]]; then
        if ! brew bundle install; then
            log_error "Failed to install brew packages"
            exit 1
        fi
    fi

    setup_gitconfig
    setup_mise
    setup_fzf

    # Additional setups for full installation
    if [[ "$MINIMAL" == "false" ]]; then
        setup_miniconda
        setup_tpm
        
        if [[ $(uname) != "Darwin" ]]; then
            setup_font_linux
        fi
    fi

    # Final OS-specific configurations
    if [[ $(uname) == "Darwin" ]]; then
        if [[ $(uname -m) == "arm64" ]]; then
            if ! pgrep oahd >/dev/null; then
                if ! softwareupdate --install-rosetta --agree-to-license; then
                    log_error "Failed to install Rosetta 2"
                    exit 1
                fi
            else
                log_info "Rosetta 2 already installed, skipping"
            fi
        fi
    else
        if [[ "$SHELL" != "$(command -v zsh)" ]]; then
            if [[ "$NO_SUDO" == "false" ]]; then
                if ! sudo chsh -s "$(command -v zsh)" "$USER"; then
                    log_error "Failed to change default shell to zsh"
                    exit 1
                fi
            else
                if ! chsh -s "$(command -v zsh)" "$USER"; then
                    log_error "Failed to change default shell to zsh"
                    exit 1
                fi
            fi
        fi
    fi

    log_success "Setup completed successfully!"
}

# Run main function
main
