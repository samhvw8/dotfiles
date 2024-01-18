export XDG_CONFIG_HOME="${HOME}/.config"
export XDG_CACHE_HOME="${HOME}/.cache"
export XDG_DATA_HOME="${HOME}/.local/share"
export XDG_STATE_HOME="${HOME}/.local/state"
export XDG_RUNTIME_DIR="${HOME}/.local/run"


export ZSH_DATA_DIR="${XDG_DATA_HOME}/zsh"
export ZSH_CACHE_DIR="${XDG_CACHE_HOME}/zsh"
export ZSH_COMPDUMP="${ZSH_CACHE_DIR}/zcompdump"

if [[ ! -f $HOME/.zi/bin/zi.zsh ]]; then
    print -P "%F{33}▓▒░ %F{160}Installing (%F{33}z-shell/zi%F{160})…%f"
    command mkdir -p "$HOME/.zi" && command chmod go-rwX "$HOME/.zi"
    command git clone -q --depth=1 --branch "main" https://github.com/z-shell/zi "$HOME/.zi/bin" && \
    print -P "%F{33}▓▒░ %F{34}Installation successful.%f%b" || \
    print -P "%F{160}▓▒░ The clone has failed.%f%b"
fi
source "$HOME/.zi/bin/zi.zsh"
autoload -Uz _zi

(( ${+_comps} )) && _comps[zi]=_zi
# examples here -> https://wiki.zshell.dev/ecosystem/category/-annexes
zicompinit # <- https://wiki.zshell.dev/docs/guides/commands
zi light-mode for \
z-shell/z-a-meta-plugins \
@annexes # <- https://wiki.zshell.dev/ecosystem/category/-annexes
# examples here -> https://wiki.zshell.dev/community/gallery/collection
zicompinit # <- https://wiki.zshell.dev/docs/guides/commands

export DIRENV_LOG_FORMAT=

#####################
# PROMPT            #
#####################
if [[ `uname` == "Darwin" ]]; then
    zi lucid for \
    as"command" from"gh-r" atinit'export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"' atload'eval "$(starship init zsh)"' bpick'*apple-darwin.tar.gz' \
    starship/starship
else
    zi lucid for \
    as"command" from"gh-r" atinit'export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"' atload'eval "$(starship init zsh)"' bpick'*unknown-linux-gnu*' \
    starship/starship
fi

##########################
# OMZ Libs and Plugins   #
##########################

# IMPORTANT:
# Ohmyzsh plugins and libs are loaded first as some these sets some defaults which are required later on.
# Otherwise something will look messed up
# ie. some settings help zsh-autosuggestions to clear after tab completion

setopt promptsubst

if [ -f $HOME/.local/bin/mise ]; then
    eval "$($HOME/.local/bin/mise activate zsh)"
    
    if [[ ! -f "$ZSH_CACHE_DIR/completions/_mise" ]]; then
        mise completion zsh  > $ZSH_CACHE_DIR/completions/_mise
    fi

    zi ice as"completion"
    zi snippet $ZSH_CACHE_DIR/completions/_mise
fi

if mise which kubectl &>/dev/null ; then
    alias k=kubectl
    alias kaf='kubectl apply -f'
    if [[ ! -f "$ZSH_CACHE_DIR/completions/_kubectl" ]]; then
        kubectl completion zsh 2> /dev/null >| "$ZSH_CACHE_DIR/completions/_kubectl"
    fi
    zi ice as"completion"
    zi snippet $ZSH_CACHE_DIR/completions/_kubectl
fi

if mise which helm &>/dev/null ; then
    
    if [[ ! -f "$ZSH_CACHE_DIR/completions/_helm" ]]; then
        helm completion zsh 2> /dev/null >| "$ZSH_CACHE_DIR/completions/_helm"
    fi
    zi ice as"completion"
    zi snippet $ZSH_CACHE_DIR/completions/_helm
fi

# if [ -f $HOME/.asdf/asdf.sh ]; then
#     zi ice pick="asdf.sh"
#     zi load $HOME/.asdf
#   if [[ -f  "${XDG_CONFIG_HOME:-$HOME/.config}/asdf-direnv/zshrc" ]]; then
#     source "${XDG_CONFIG_HOME:-$HOME/.config}/asdf-direnv/zshrc"
#   fi
#     asdf-tool-version-plugin(){
#         cut -d' ' -f1 ~/.tool-versions| xargs -I{} asdf plugin add {}
#     }
# fi

zi lucid for \
OMZL::history.zsh
zi wait lucid for \
OMZL::clipboard.zsh \
OMZL::compfix.zsh \
OMZL::completion.zsh \
OMZL::correction.zsh  \
atload"\
alias ..='cd ..' \
alias ...='cd ../..' \
alias ....='cd ../../..' \
alias .....='cd ../../../..'" \
OMZL::directories.zsh \
OMZL::git.zsh \
OMZL::grep.zsh \
OMZL::spectrum.zsh \
OMZP::git \
OMZP::urltools \
OMZP::extract \
OMZP::encode64


zi snippet OMZ::lib/key-bindings.zsh

zi load z-shell/zui
zi load z-shell/zi-console

if [ -f ~/.fzf.zsh ]; then
    zi ice wait"0" lucid
    zi snippet $HOME/.fzf.zsh
    
    zi light Aloxaf/fzf-tab
    zi light wfxr/forgit
fi


# zi ice depth=1
# zi light jeffreytse/zsh-vi-mode

zi ice as"completion"
zi snippet https://github.com/docker/cli/blob/master/contrib/completion/zsh/_docker

zi ice as"completion"
zi snippet https://github.com/docker/compose/blob/v1/contrib/completion/zsh/_docker-compose


zi snippet OMZ::lib/theme-and-appearance.zsh


zi ice wait"2" as"command" from"gh-r" lucid \
mv"*zoxide* -> zoxide" \
atclone"./zoxide init --cmd j zsh > init.zsh" \
atpull"%atclone" src"init.zsh" nocompile'!'
zi light ajeetdsouza/zoxide

zi light-mode for \
z-shell/z-a-meta-plugins \
@console-tools

zi ice as"command" from"gh-r" mv"delta* -> delta" pick"delta/delta"
zi light dandavison/delta

if command -v nvim &> /dev/null
then
    alias vim="nvim"
    export EDITOR='nvim'
    alias nvimo="nvim -u NORC  --noplugin"
    alias vimo="/usr/bin/vim"
fi

export SDKMAN_DIR="$HOME/.sdkman"
zi ice wait lucid as"program" pick"$HOME/.sdkman/bin/sdk" id-as'sdkman' run-atpull \
atclone"wget https://get.sdkman.io -O $HOME/.sdkman/scr.sh; bash $HOME/.sdkman/scr.sh" \
atpull"sdk selfupdate" \
atinit"source $HOME/.sdkman/bin/sdkman-init.sh"
zi light z-shell/null

zi ice lucid wait as'completion' blockf has'cargo'
zi snippet https://github.com/rust-lang/cargo/blob/master/src/etc/_cargo

zi ice lucid wait as'completion' blockf has'rg'
zi snippet https://github.com/BurntSushi/ripgrep/blob/master/complete/_rg

zi ice lucid wait as'completion' blockf has'youtube-dl' mv'youtube-dl.zsh -> _youtube-dl'
zi snippet https://github.com/ytdl-org/youtube-dl/blob/master/youtube-dl.plugin.zsh

zi wait lucid for \
atinit"ZI[COMPINIT_OPTS]=-C; zicompinit; zicdreplay" \
z-shell/fast-syntax-highlighting \
blockf \
zsh-users/zsh-completions \
atload"!_zsh_autosuggest_start" \
zsh-users/zsh-autosuggestions

zi ice wait lucid
zi light $HOME/.dotbare

zi ice wait lucid
zi light "MichaelAquilina/zsh-you-should-use"


export PATH="$HOME/go/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.jenv/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$PATH:$HOME/bin"

if [[ `uname` == "Darwin" ]]; then
    test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"
    source ~/.iterm2_shell_integration.zsh
    export HOMEBREW_NO_INSTALL_CLEANUP=1
    export PATH="/usr/local/sbin:$PATH"
    export PATH="/usr/local/opt/icu4c/bin:$PATH"
    export PATH="/usr/local/opt/icu4c/sbin:$PATH"
else
    alias open=xdg-open
    alias idea=$HOME/idea/idea-IC-203.8084.24/bin/idea.sh
fi

export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
--color=dark
--color=fg:-1,bg:-1,hl:#5fff87,fg+:-1,bg+:-1,hl+:#ffaf5f
--color=info:#af87ff,prompt:#5fff87,pointer:#ff87d7,marker:#ff87d7,spinner:#ff87d7
'
export BAT_THEME="Dracula"

export FZF_DEFAULT_COMMAND='fd --type file'

export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export LANGUAGE="en_US.UTF-8"


# >>> conda initialize >>>

if mise which conda &>/dev/null ; then
    export _CONDA_BASE=$(dirname $(dirname $(mise which conda)))
elif [[ `uname` == "Darwin" ]]; then
    export _CONDA_BASE=/opt/homebrew/Caskroom/miniconda/base
else
    export _CONDA_BASE=$HOME/miniconda3
fi

__conda_setup="$('$_CONDA_BASE/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$_CONDA_BASE/etc/profile.d/conda.sh" ]; then
        . "$_CONDA_BASE/etc/profile.d/conda.sh"
    else
        export PATH="$_CONDA_BASE/bin:$PATH"
    fi
fi
unset __conda_setup

# Generated for envman. Do not edit.
[ -s "$HOME/.config/envman/load.sh" ] && source "$HOME/.config/envman/load.sh"

[[ ! -f ~/.kubecm ]] || source ~/.kubecm