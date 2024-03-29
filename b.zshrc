### Added by Zinit's installer
if [[ ! -f $HOME/.zinit/bin/zinit.zsh ]]; then
    print -P "%F{33}▓▒░ %F{220}Installing %F{33}DHARMA%F{220} Initiative Plugin Manager (%F{33}zdharma/zinit%F{220})…%f"
    command mkdir -p "$HOME/.zinit" && command chmod g-rwX "$HOME/.zinit"
    command git clone https://github.com/zdharma-continuum/zinit.git ~/.zinit/bin && \
        print -P "%F{33}▓▒░ %F{34}Installation successful.%f%b" || \
        print -P "%F{160}▓▒░ The clone has failed.%f%b"
fi

source "$HOME/.zinit/bin/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

# Load a few important annexes, without Turbo
# (this is currently required for annexes)
zinit light-mode for \
    zdharma-continuum/z-a-meta-plugins \
    zdharma-continuum/z-a-rust \
    zdharma-continuum/z-a-as-monitor \
    zdharma-continuum/z-a-patch-dl \
    zdharma-continuum/z-a-bin-gem-node


if [[ `uname` == "Darwin" ]]; then
    eval "$(zoxide init zsh)"
    zinit snippet OMZP::fzf/fzf.plugin.zsh
else
    zinit ice wait"2" as"command" from"gh-r" lucid \
        mv"zoxide*/zoxide -> zoxide" \
        atclone"./zoxide init zsh > init.zsh" \
        atpull"%atclone" src"init.zsh" nocompile'!'
    zinit light ajeetdsouza/zoxide
    zinit for console-tools
    zinit ice as"command" from"gh-r" mv"delta* -> delta" pick"delta/delta"
    zinit light dandavison/delta
fi

zinit for annexes  ext-git

### End of Zinit's installer chunk

if command -v nvim &> /dev/null
then
    alias vim="nvim"
    export EDITOR='nvim'
    alias nvimo="nvim -u NORC  --noplugin"
    alias vimo="/usr/bin/vim"
fi

export SDKMAN_DIR="$HOME/.sdkman"
zinit ice wait lucid as"program" pick"$HOME/.sdkman/bin/sdk" id-as'sdkman' run-atpull \
    atclone"wget https://get.sdkman.io -O $HOME/.sdkman/scr.sh; bash $HOME/.sdkman/scr.sh" \
    atpull"sdk selfupdate" \
    atinit"source $HOME/.sdkman/bin/sdkman-init.sh"
zinit light zdharma-continuum/null

zinit light zdharma-continuum/zui

zinit snippet OMZ::lib/theme-and-appearance.zsh

zinit ice pick"async.zsh" src"pure.zsh"
zinit light sindresorhus/pure

# zinit light dracula/zsh

zinit snippet OMZ::lib/history.zsh
zinit snippet OMZL::grep.zsh
zinit snippet OMZL::completion.zsh
zinit snippet OMZL::clipboard.zsh
zinit snippet OMZL::termsupport.zsh

zinit snippet OMZ::lib/key-bindings.zsh
zinit snippet OMZ::lib/directories.zsh


zinit ice as"completion"
zinit snippet https://github.com/docker/cli/blob/master/contrib/completion/zsh/_docker

zinit ice as"completion"
zinit snippet https://github.com/docker/compose/tree/master/contrib/completion/zsh/_docker-compose

zinit ice wait lucid
zinit snippet OMZP::git

zinit ice wait lucid
zinit snippet OMZP::git-extras

zinit ice wait lucid
zinit snippet OMZP::encode64

zinit ice wait lucid
zinit snippet OMZP::extract

zinit ice wait lucid
zinit snippet OMZP::urltools

# zinit ice wait lucid
# zinit light tom-auger/cmdtime

zinit ice wait lucid
zinit snippet OMZP::jenv

zinit ice wait lucid
zinit snippet OMZP::nvm

zinit ice wait lucid
zinit light kazhala/dotbare

zplugin ice as"program" pick"bin/git-dsf"
zplugin light zdharma-continuum/zsh-diff-so-fancy

zinit wait lucid for \
 atinit"ZINIT[COMPINIT_OPTS]=-C; zicompinit; zicdreplay" \
    zdharma-continuum/fast-syntax-highlighting \
 blockf \
    zsh-users/zsh-completions \
 atload"!_zsh_autosuggest_start" \
    zsh-users/zsh-autosuggestions

ZSH_AUTOSUGGEST_USE_ASYNC=true

zinit ice wait lucid
zinit snippet "OMZ::lib/completion.zsh"

zinit ice wait lucid
zinit light "MichaelAquilina/zsh-you-should-use"

zinit ice wait lucid
zinit light Aloxaf/fzf-tab

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

export PATH="$HOME/go/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.jenv/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$PATH:$HOME/bin"

if [[ `uname` == "Darwin" ]]; then
    test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"
    source ~/.iterm2_shell_integration.zsh
    export HOMEBREW_NO_INSTALL_CLEANUP=1
    eval "$(perl -I$HOME/perl5/lib/perl5 -Mlocal::lib=$HOME/perl5)"
    export PATH="/usr/local/sbin:$PATH"
    export PATH="/usr/local/opt/icu4c/bin:$PATH"
    export PATH="/usr/local/opt/icu4c/sbin:$PATH"
else
    export PATH=$PATH:/usr/local/go/bin
    alias open=xdg-open
    alias idea=$HOME/idea/idea-IC-203.8084.24/bin/idea.sh
    # Generated for envman. Do not edit.
    [ -s "$HOME/.config/envman/load.sh" ] && source "$HOME/.config/envman/load.sh"
    export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
fi

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

if command -v exa &> /dev/null
then
    alias ls=exa
    alias la=ll -a
fi

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('$HOME/miniconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$HOME/miniconda3/etc/profile.d/conda.sh" ]; then
        . "$HOME/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="$HOME/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

