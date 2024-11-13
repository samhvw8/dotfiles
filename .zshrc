# =============================================================================
#                               Core ZSH Settings
# =============================================================================

# History Configuration
setopt SHARE_HISTORY          # Share history between open shells
setopt INC_APPEND_HISTORY     # Append history as commands are entered
setopt HIST_NO_STORE         # Don't save 'history' cmd in history
setopt appendhistory beep nomatch

# XDG Base Directory Specification
export XDG_CONFIG_HOME="${HOME}/.config"
export XDG_CACHE_HOME="${HOME}/.cache"
export XDG_DATA_HOME="${HOME}/.local/share"
export XDG_STATE_HOME="${HOME}/.local/state"
export XDG_RUNTIME_DIR="${HOME}/.local/run"

# Create necessary directories if they don't exist
for dir in "$XDG_CONFIG_HOME" "$XDG_CACHE_HOME" "$XDG_DATA_HOME" "$XDG_STATE_HOME" "$XDG_RUNTIME_DIR"; do
    [[ ! -d "$dir" ]] && mkdir -p "$dir"
done

# ZSH-specific directories
export ZSH_DATA_DIR="${XDG_DATA_HOME}/zsh"
export ZSH_CACHE_DIR="${XDG_CACHE_HOME}/zsh"
export ZSH_COMPDUMP="${ZSH_CACHE_DIR}/zcompdump"

# Ensure ZSH directories exist
for dir in "$ZSH_DATA_DIR" "$ZSH_CACHE_DIR" "$ZSH_CACHE_DIR/completions"; do
    [[ ! -d "$dir" ]] && mkdir -p "$dir"
done

# =============================================================================
#                               ZI Plugin Manager
# =============================================================================

# Install ZI if not present
if [[ ! -f $HOME/.zi/bin/zi.zsh ]]; then
    print -P "%F{33}▓▒░ %F{160}Installing (%F{33}z-shell/zi%F{160})…%f"
    command mkdir -p "$HOME/.zi" && command chmod go-rwX "$HOME/.zi"
    if command git clone -q --depth=1 --branch "main" https://github.com/z-shell/zi "$HOME/.zi/bin"; then
        print -P "%F{33}▓▒░ %F{34}Installation successful.%f%b"
    else
        print -P "%F{160}▓▒░ The clone has failed. Please check your internet connection and git installation.%f%b"
        return 1
    fi
fi

# Source ZI with error handling
if [[ -f "$HOME/.zi/bin/zi.zsh" ]]; then
    source "$HOME/.zi/bin/zi.zsh"
    autoload -Uz _zi
    (( ${+_comps} )) && _comps[zi]=_zi
else
    print -P "%F{160}▓▒░ ZI installation not found. Please check the installation.%f%b"
    return 1
fi

# Load annexes
zi light-mode for z-shell/z-a-meta-plugins @annexes
zicompinit

# =============================================================================
#                               Prompt Configuration
# =============================================================================

export DIRENV_LOG_FORMAT=
setopt promptsubst

# Function to check command existence
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Starship prompt installation based on system architecture
if [[ $(uname) == "Darwin" ]]; then
    zi lucid for \
        as"command" from"gh-r" \
        atinit'export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"' \
        atload'eval "$(starship init zsh)"' \
        bpick'*apple-darwin.tar.gz' \
        starship/starship
elif [[ $(uname -m) == "aarch64" ]]; then
    zi lucid for \
        as"command" from"gh-r" \
        atinit'export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"' \
        atload'eval "$(starship init zsh)"' \
        bpick'*aarch64-unknown-linux*' \
        starship/starship
else
    zi lucid for \
        as"command" from"gh-r" \
        atinit'export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"' \
        atload'eval "$(starship init zsh)"' \
        bpick'*unknown-linux-gnu*' \
        starship/starship
fi

# =============================================================================
#                               Tool Configuration
# =============================================================================
# 
# Mise (formerly rtx) configuration
if [[ -x "$HOME/.local/bin/mise" ]]; then
    if ! eval "$($HOME/.local/bin/mise activate zsh)"; then
        echo "Warning: Failed to activate mise"
    else
        if [[ ! -f "$ZSH_CACHE_DIR/completions/_mise" ]]; then
            mise completion zsh > "$ZSH_CACHE_DIR/completions/_mise" 2>/dev/null
        fi
        zi ice as"completion"
        zi snippet "$ZSH_CACHE_DIR/completions/_mise"
    fi
fi

# Kubernetes tools configuration
if command_exists kubectl; then
    alias k=kubectl
    alias kaf='kubectl apply -f'
    if [[ ! -f "$ZSH_CACHE_DIR/completions/_kubectl" ]]; then
        kubectl completion zsh 2>/dev/null > "$ZSH_CACHE_DIR/completions/_kubectl"
    fi
    [[ -f "$ZSH_CACHE_DIR/completions/_kubectl" ]] && {
        zi ice as"completion"
        zi snippet "$ZSH_CACHE_DIR/completions/_kubectl"
    }
fi

# Helm configuration
if command_exists helm; then
    if [[ ! -f "$ZSH_CACHE_DIR/completions/_helm" ]]; then
        helm completion zsh 2>/dev/null > "$ZSH_CACHE_DIR/completions/_helm"
    fi
    [[ -f "$ZSH_CACHE_DIR/completions/_helm" ]] && {
        zi ice as"completion"
        zi snippet "$ZSH_CACHE_DIR/completions/_helm"
    }
fi

# =============================================================================
#                               Oh-My-Zsh Integration
# =============================================================================

# Load Oh-My-Zsh libraries
zi lucid for OMZL::history.zsh

# Load Oh-My-Zsh plugins with delay
zi wait lucid for \
    OMZL::clipboard.zsh \
    OMZL::compfix.zsh \
    OMZL::completion.zsh \
    OMZL::correction.zsh \
    OMZL::directories.zsh \
    OMZL::git.zsh \
    OMZL::grep.zsh \
    OMZL::spectrum.zsh \
    OMZP::git \
    OMZP::urltools \
    OMZP::extract \
    OMZP::encode64

# Directory navigation aliases
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'

# =============================================================================
#                               Additional Tools
# =============================================================================

# FZF configuration
if [[ -f "$HOME/.fzf.zsh" ]]; then
    zi ice wait"0" lucid
    zi snippet "$HOME/.fzf.zsh"
    zi light Aloxaf/fzf-tab
    zi light wfxr/forgit
fi

# Docker completions
if command_exists docker; then
    zi ice as"completion"
    zi snippet https://github.com/docker/cli/blob/master/contrib/completion/zsh/_docker
    zi snippet https://github.com/docker/compose/blob/v1/contrib/completion/zsh/_docker-compose
fi

# Zoxide configuration
zi ice wait"2" as"command" from"gh-r" lucid \
    mv"*zoxide* -> zoxide" \
    atclone"./zoxide init --cmd j zsh > init.zsh" \
    atpull"%atclone" src"init.zsh" nocompile'!'
zi light ajeetdsouza/zoxide

# Console tools
zi light-mode for z-shell/z-a-meta-plugins @console-tools

# Delta (better diff tool)
zi ice as"command" from"gh-r" mv"delta* -> delta" pick"delta/delta"
zi light dandavison/delta

# =============================================================================
#                               Editor Configuration
# =============================================================================

if command_exists nvim; then
    alias vim="nvim"
    export EDITOR='nvim'
    alias nvimo="nvim -u NORC --noplugin"
    alias vimo="/usr/bin/vim"
fi

# =============================================================================
#                               Development Tools
# =============================================================================

# SDKMAN configuration
zi ice wait lucid as"program" pick"$HOME/.sdkman/bin/sdk" id-as'sdkman' run-atpull \
    atclone"wget https://get.sdkman.io -O $HOME/.sdkman/scr.sh; bash $HOME/.sdkman/scr.sh" \
    atpull"sdk selfupdate" \
    atinit"source $HOME/.sdkman/bin/sdkman-init.sh"
zi light z-shell/null

# Cargo completion
if command_exists cargo; then
    zi ice lucid wait as'completion' blockf
    zi snippet https://github.com/rust-lang/cargo/blob/master/src/etc/_cargo
fi

# Youtube-dl completion
if command_exists youtube-dl; then
    zi ice lucid wait as'completion' blockf mv'youtube-dl.zsh -> _youtube-dl'
    zi snippet https://github.com/ytdl-org/youtube-dl/blob/master/youtube-dl.plugin.zsh
fi

# =============================================================================
#                               ZSH Enhancements
# =============================================================================

# Syntax highlighting and autosuggestions
zi wait lucid for \
    atinit"ZI[COMPINIT_OPTS]=-C; zicompinit; zicdreplay" \
    z-shell/fast-syntax-highlighting \
    blockf \
    zsh-users/zsh-completions \
    atload"!_zsh_autosuggest_start" \
    zsh-users/zsh-autosuggestions

[[ -d "$HOME/.dotbare" ]] && {
    zi ice wait lucid
    zi light "$HOME/.dotbare"
}

zi ice wait lucid
zi light "MichaelAquilina/zsh-you-should-use"

# =============================================================================
#                               Path Configuration
# =============================================================================

# Function to add to PATH if directory exists
add_to_path() {
    [[ -d "$1" ]] && export PATH="$1:$PATH"
}

# Add directories to PATH
add_to_path "$HOME/.local/bin"
add_to_path "$HOME/bin"
add_to_path "${KREW_ROOT:-$HOME/.krew}/bin"

# OS-specific configuration
if [[ $(uname) == "Darwin" ]]; then
    [[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"
    export HOMEBREW_NO_INSTALL_CLEANUP=1
    add_to_path "/usr/local/sbin"
    add_to_path "/usr/local/opt/icu4c/bin"
    add_to_path "/usr/local/opt/icu4c/sbin"
else
    alias open=xdg-open
    [[ -f "$HOME/idea/idea-IC-203.8084.24/bin/idea.sh" ]] && \
        alias idea="$HOME/idea/idea-IC-203.8084.24/bin/idea.sh"
fi

# =============================================================================
#                               Environment Variables
# =============================================================================

# FZF configuration
export FZF_DEFAULT_OPTS='
--color=dark
--color=fg:-1,bg:-1,hl:#5fff87,fg+:-1,bg+:-1,hl+:#ffaf5f
--color=info:#af87ff,prompt:#5fff87,pointer:#ff87d7,marker:#ff87d7,spinner:#ff87d7
'
export FZF_DEFAULT_COMMAND='fd --type file'
export BAT_THEME="Dracula"

# Locale settings
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export LANGUAGE="en_US.UTF-8"

# =============================================================================
#                               Conda Configuration
# =============================================================================

# Determine Conda base directory
if command_exists conda; then
    export _CONDA_BASE=$(dirname $(dirname $(which conda)))
elif [[ $(uname) == "Darwin" ]]; then
    export _CONDA_BASE=/opt/homebrew/Caskroom/miniconda/base
else
    export _CONDA_BASE=$HOME/miniconda3
fi

# Initialize Conda
if [[ -f "$_CONDA_BASE/bin/conda" ]]; then
    __conda_setup="$('$_CONDA_BASE/bin/conda' 'shell.zsh' 'hook' 2>/dev/null)"
    if [ $? -eq 0 ]; then
        eval "$__conda_setup"
    elif [ -f "$_CONDA_BASE/etc/profile.d/conda.sh" ]; then
        . "$_CONDA_BASE/etc/profile.d/conda.sh"
    else
        export PATH="$_CONDA_BASE/bin:$PATH"
    fi
    unset __conda_setup
fi

# =============================================================================
#                               Additional Sources
# =============================================================================

# Envman configuration
[[ -s "$HOME/.config/envman/load.sh" ]] && source "$HOME/.config/envman/load.sh"

# Kubecm configuration
[[ -f "$HOME/.kubecm" ]] && source "$HOME/.kubecm"
