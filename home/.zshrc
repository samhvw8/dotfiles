# =============================================================================
# ZSH Configuration - Optimized
# =============================================================================

# Keep only the first occurrence of each PATH entry.
typeset -U path PATH

if [ -f "$HOME/.local/bin/mise" ]; then
    eval "$($HOME/.local/bin/mise activate zsh)"
fi

# mise gets its GitHub token from `gh auth token` via
# settings.github.credential_command, only when it calls the GitHub API.

# Basic ZSH Options (SHARE_HISTORY already appends each command as it runs)
setopt SHARE_HISTORY HIST_NO_STORE
setopt appendhistory beep nomatch promptsubst

# XDG Base Directories
export XDG_CONFIG_HOME="${HOME}/.config"
export XDG_CACHE_HOME="${HOME}/.cache"
export XDG_DATA_HOME="${HOME}/.local/share"
export XDG_STATE_HOME="${HOME}/.local/state"
export XDG_RUNTIME_DIR="${HOME}/.local/run"

# ZSH-specific directories
export ZSH_DATA_DIR="${XDG_DATA_HOME}/zsh"
export ZSH_CACHE_DIR="${XDG_CACHE_HOME}/zsh"
export ZSH_COMPDUMP="${ZSH_CACHE_DIR}/zcompdump"

# =============================================================================
# ZI Plugin Manager
# =============================================================================

if [[ ! -f $HOME/.zi/bin/zi.zsh ]]; then
    print -P "%F{33}Installing ZI...%f"
    command mkdir -p "$HOME/.zi" && command chmod go-rwX "$HOME/.zi"
    command git clone -q --depth=1 https://github.com/z-shell/zi "$HOME/.zi/bin" || return 1
fi

# zi ignores $ZSH_COMPDUMP unless told; keep one dump in the XDG cache.
typeset -gA ZI
ZI[ZCOMPDUMP_PATH]=$ZSH_COMPDUMP

source "$HOME/.zi/bin/zi.zsh"
autoload -Uz _zi
(( ${+_comps} )) && _comps[zi]=_zi

# =============================================================================
# Helper Functions
# =============================================================================

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

add_to_path() {
    [[ -d "$1" ]] && export PATH="$1:$PATH"
}

# Source a tool's shell init script from a cache instead of running the tool on
# every shell start. The cache is rebuilt when the tool's resolved binary path
# (which includes its version under mise) or the arguments change.
# Usage: _cached_init <name> <command> [args...]
_cached_init() {
    local name=$1; shift
    local key="# ${commands[$1]:A} $*" cache="$ZSH_CACHE_DIR/init/$name.zsh" first=""
    [[ -r $cache ]] && read -r first < "$cache"
    if [[ $first != "$key" ]]; then
        mkdir -p "${cache:h}"
        if ! { print -r -- "$key"; "$@" } >| "$cache.tmp"; then
            rm -f "$cache.tmp"
            return 1
        fi
        mv -f "$cache.tmp" "$cache"
    fi
    source "$cache"
}

fbd() {
    git for-each-ref --count=30 --sort=-committerdate refs/heads/ --format="%(refname:short)" | \
    fzf --multi | xargs -r git branch -D
}

# =============================================================================
# Prompt - Starship (must be synchronous)
# =============================================================================

command_exists starship && _cached_init starship starship init zsh --print-full-init

# =============================================================================
# Tool Completions (cached)
# =============================================================================

# Generate a tool's completion into a cached fpath dir, like _cached_init: only
# when its resolved binary path (which includes its version under mise) or the
# arguments change. A rewrite drops the compdump so compinit picks it up.
# Usage: _cached_comp <name> <command> [args...]
fpath=("$ZSH_CACHE_DIR/completions" $fpath)
_cached_comp() {
    local name=$1; shift
    (( $+commands[$1] )) || return 0
    local key="${commands[$1]:A} $*" comp="$ZSH_CACHE_DIR/completions/_$name" old=""
    [[ -r $comp.key ]] && old=$(<$comp.key)
    [[ $old == "$key" ]] && return 0
    mkdir -p "${comp:h}"
    "$@" >| "$comp.tmp" 2>/dev/null && [[ -s $comp.tmp ]] || { rm -f "$comp.tmp"; return 1; }
    mv -f "$comp.tmp" "$comp" && print -r -- "$key" >| "$comp.key"
    rm -f "$ZSH_COMPDUMP" "$ZSH_COMPDUMP.zwc"
}
_cached_comp mise     mise completion zsh
_cached_comp kubectl  kubectl completion zsh
_cached_comp uv       uv generate-shell-completion zsh
_cached_comp bat      bat --completion zsh
_cached_comp delta    delta --generate-completion zsh
zicompdef _delta delta      # zsh's _sccs also claims `delta` (the SCCS tool)
_cached_comp atuin    atuin gen-completions --shell zsh
_cached_comp rg       rg --generate complete-zsh
_cached_comp fd       fd --gen-completions zsh
_cached_comp starship starship completions zsh
_cached_comp rustup   rustup completions zsh
_cached_comp cargo    rustup completions zsh cargo

# =============================================================================
# History & completion (the parts of OMZ lib that were in use)
# =============================================================================

HISTFILE=${HISTFILE:-$HOME/.zsh_history}
HISTSIZE=50000
SAVEHIST=50000
setopt extended_history hist_expire_dups_first hist_ignore_dups hist_ignore_space hist_verify
setopt complete_in_word always_to_end
unsetopt flowcontrol        # keep ^S/^Q free for zle
WORDCHARS=''                # ^W / M-b stop at / - . like before

zstyle ':completion:*' matcher-list 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}' 'r:|=*' 'l:|=* r:|=*'
zstyle ':completion:*' use-cache yes
zstyle ':completion:*' cache-path "$ZSH_CACHE_DIR"
zstyle ':completion:*' menu no              # fzf-tab draws the menu
zstyle ':completion:*:descriptions' format '[%d]'
zstyle ':fzf-tab:*' use-fzf-default-opts yes

alias g=git

# =============================================================================
# Aliases
# =============================================================================

alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'

alias ls='ls --color=auto'
# These are the OMZ definitions that were actually in effect (OMZ loaded after
# this file and overrode the old ls -alF / -A / -CF ones).
alias ll='ls -lh'
alias la='ls -lAh'
alias l='ls -lah'

if command_exists kubectl; then
    alias k=kubectl
    alias kaf='kubectl apply -f'
fi

if command_exists nvim; then
    alias vim=nvim
    alias vimo=/usr/bin/vim
    alias nvimo="nvim -u NORC --noplugin"
    export EDITOR=nvim
fi

# =============================================================================
# Additional Tools
# =============================================================================

# FZF integration (fzf, fd and bat are mise tools)
if command_exists fzf; then
    _cached_init fzf fzf --zsh
fi

# Atuin: SQLite-backed history search on Ctrl-R; fzf keeps Ctrl-T and Alt-C.
# Loaded after fzf so it owns Ctrl-R. Remove atuin from mise/config.toml to
# switch it off.
if command_exists atuin; then
    _cached_init atuin atuin init zsh --disable-up-arrow
fi

# Zoxide (installed via mise)
# compdef doesn't exist until compinit runs (turbo, below), so zoxide skips its
# own registration; queue it for zicdreplay instead.
if command_exists zoxide; then
    _cached_init zoxide zoxide init --cmd j zsh
    zicompdef __zoxide_z_complete j
fi

# =============================================================================
# ZSH Enhancements
# =============================================================================

# Completions, fzf-tab, syntax highlighting, autosuggestions (MUST be last).
# TEMP: the three plugins load from the samhvw8 forks' `perf` branches (sources
# in ~/workspace/oss/zsh, documented in its .okf) while the patches are tested
# before the upstream PRs.
# Switch back to Aloxaf/fzf-tab, z-shell/F-Sy-H and zsh-users/... after.
# atuin's init sets its own strategy, which forks `atuin search` per keystroke;
# history is the same data looked up in-process.
ZSH_AUTOSUGGEST_STRATEGY=(history)

# compinit -C never rebuilds an existing dump, so drop it when a completion dir
# changed since it was written, then zcompile it for the next shell.
_compinit_fresh() {
    local d
    for d in $fpath; do
        [[ $d -nt $ZSH_COMPDUMP ]] && { rm -f "$ZSH_COMPDUMP" "$ZSH_COMPDUMP.zwc"; break; }
    done
    ZI[COMPINIT_OPTS]=-C
    zicompinit
    zicdreplay
    [[ $ZSH_COMPDUMP.zwc -nt $ZSH_COMPDUMP ]] || zcompile "$ZSH_COMPDUMP"
}

# fzf-tab loads right after compinit and before the widget-wrapping plugins.
zi wait lucid for \
    atinit"_compinit_fresh" ver"perf" \
        samhvw8/fzf-tab \
    ver"perf" \
        samhvw8/F-Sy-H \
    atload"!_zsh_autosuggest_start" ver"perf" \
        samhvw8/zsh-autosuggestions

# =============================================================================
# PATH Configuration
# =============================================================================

add_to_path "$HOME/.local/bin"
add_to_path "$HOME/bin"

# =============================================================================
# OS-specific Configuration
# =============================================================================

if [[ $OSTYPE == darwin* ]]; then
    [[ -e "${HOME}/.iterm2_shell_integration.zsh" ]] && source "${HOME}/.iterm2_shell_integration.zsh"
    export HOMEBREW_NO_INSTALL_CLEANUP=1
    add_to_path "/usr/local/sbin"
else
    alias open=xdg-open
fi

# =============================================================================
# Environment Variables
# =============================================================================

export DIRENV_LOG_FORMAT=
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export LANGUAGE="en_US.UTF-8"
export BAT_THEME="Dracula"

export FZF_DEFAULT_OPTS='
--color=dark
--color=fg:-1,bg:-1,hl:#5fff87,fg+:-1,bg+:-1,hl+:#ffaf5f
--color=info:#af87ff,prompt:#5fff87,pointer:#ff87d7,marker:#ff87d7,spinner:#ff87d7
'
export FZF_DEFAULT_COMMAND='fd --type file'

# =============================================================================
# Conda / Mamba - Lazy Loaded (only if installed)
# =============================================================================

if [[ -x /opt/homebrew/Caskroom/miniconda/base/bin/conda ]] || [[ -x "$HOME/miniconda3/bin/conda" ]]; then
    conda() {
        unfunction conda mamba 2>/dev/null

        local _conda_base
        if [[ -x /opt/homebrew/Caskroom/miniconda/base/bin/conda ]]; then
            _conda_base=/opt/homebrew/Caskroom/miniconda/base
        else
            _conda_base="$HOME/miniconda3"
        fi

        __conda_setup="$("$_conda_base/bin/conda" 'shell.zsh' 'hook' 2>/dev/null)"
        if [[ $? -eq 0 ]]; then
            eval "$__conda_setup"
        elif [[ -f "$_conda_base/etc/profile.d/conda.sh" ]]; then
            . "$_conda_base/etc/profile.d/conda.sh"
        else
            export PATH="$_conda_base/bin:$PATH"
        fi
        unset __conda_setup

        conda "$@"
    }

    mamba() { conda; mamba "$@"; }
fi

# =============================================================================
# Additional Sources
# =============================================================================

[[ -s "$HOME/.config/envman/load.sh" ]] && source "$HOME/.config/envman/load.sh"
[[ -f "$HOME/.kubecm" ]] && source "$HOME/.kubecm"

# =============================================================================
# Key Bindings
# =============================================================================

set -o emacs
autoload -U edit-command-line
zle -N edit-command-line
bindkey '^X^E' edit-command-line
bindkey "^[[1;5C" forward-word
bindkey "^[[1;5D" backward-word

# =============================================================================
# pnpm
# =============================================================================

export PNPM_HOME="$HOME/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# =============================================================================
# Case Variant Search (rgv - ripgrep with case variants)
# =============================================================================

_to_words() {
    local input="$1"
    echo "$input" | \
        sed -E 's/[-_.]/ /g' | \
        sed -E 's/([a-z])([A-Z])/\1 \2/g' | \
        tr '[:upper:]' '[:lower:]'
}

_case_variants() {
    local input="$1"
    local words=($(_to_words "$input"))

    [[ ${#words[@]} -eq 0 ]] && return 1

    local snake="" camel="" pascal="" upper="" kebab="" dot="" lower=""
    local first=true

    for word in "${words[@]}"; do
        local lower_word="${word:l}"
        local upper_word="${word:u}"
        local cap_word="${(C)word}"

        [[ -n "$snake" ]] && snake+="_"
        snake+="$lower_word"

        if $first; then
            camel+="$lower_word"
        else
            camel+="$cap_word"
        fi

        pascal+="$cap_word"

        [[ -n "$upper" ]] && upper+="_"
        upper+="$upper_word"

        [[ -n "$kebab" ]] && kebab+="-"
        kebab+="$lower_word"

        [[ -n "$dot" ]] && dot+="."
        dot+="$lower_word"

        lower+="$lower_word"

        first=false
    done

    printf '%s\n' "$snake" "$camel" "$pascal" "$upper" "$kebab" "$dot" "$lower" | sort -u
}

rgv() {
    if [[ $# -eq 0 ]]; then
        echo "Usage: rgv <variable_name> [rg_options...]"
        echo "Searches for all case variants: snake_case, camelCase, PascalCase, UPPER_CASE, kebab-case, dot.case"
        echo ""
        echo "Examples:"
        echo "  rgv price_nego           # Search all variants"
        echo "  rgv priceNego -t py      # Search in Python files"
        echo "  rgv PriceNego -l         # List matching files only"
        return 1
    fi

    local pattern="$1"
    shift

    _case_variants "$pattern" | rg -f - "$@"
}

rgv-show() {
    if [[ $# -eq 0 ]]; then
        echo "Usage: rgv-show <variable_name>"
        return 1
    fi
    echo "Case variants for '$1':"
    _case_variants "$1" | while read -r v; do
        echo "  - $v"
    done
}

# =============================================================================
# ccp (Claude Code Profile Manager)
# =============================================================================

if command -v ccp &> /dev/null; then
  claude() {
    if [[ $# -gt 0 && "$1" != -* ]]; then
      if [[ -z "$_CLAUDE_SUBCMDS" || "$_CLAUDE_BIN_MT" != "$(stat -f%m "$(command -v claude)" 2>/dev/null)" ]]; then
        _CLAUDE_BIN_MT="$(stat -f%m "$(command -v claude)" 2>/dev/null)"
        _CLAUDE_SUBCMDS=" $(command claude --help 2>/dev/null | sed -n '/^Commands:/,/^$/p' | sed -n 's/^  \([a-z|_-]*\).*/\1/p' | tr '|' '\n' | xargs) "
      fi
      if [[ "$_CLAUDE_SUBCMDS" == *" $1 "* ]]; then
        command claude "$@"
        return
      fi
    fi
    CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 command claude --thinking-display summarized --add-dir "${CLAUDE_CONFIG_DIR:-$(ccp which --path 2>/dev/null)}" "$@"
  }

  alias claude-reset='unset _CLAUDE_SUBCMDS _CLAUDE_BIN_MT'

  ccp-use() {
    ccp use "$@"
    if command -v mise &> /dev/null && [[ -f mise.toml ]]; then
      eval "$(mise env)"
    fi
  }
else
  alias claude="claude --thinking-display summarized"
fi
