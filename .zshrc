### Added by Zinit's installer
if [[ ! -f $HOME/.zinit/bin/zinit.zsh ]]; then
    print -P "%F{33}▓▒░ %F{220}Installing %F{33}DHARMA%F{220} Initiative Plugin Manager (%F{33}zdharma/zinit%F{220})…%f"
    command mkdir -p "$HOME/.zinit" && command chmod g-rwX "$HOME/.zinit"
    command git clone https://github.com/zdharma/zinit "$HOME/.zinit/bin" && \
        print -P "%F{33}▓▒░ %F{34}Installation successful.%f%b" || \
        print -P "%F{160}▓▒░ The clone has failed.%f%b"
fi

source "$HOME/.zinit/bin/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

# Load a few important annexes, without Turbo
# (this is currently required for annexes)
zinit light-mode for \
    zinit-zsh/z-a-rust \
    zinit-zsh/z-a-as-monitor \
    zinit-zsh/z-a-patch-dl \
    zinit-zsh/z-a-bin-gem-node

### End of Zinit's installer chunk

if command -v nvim &> /dev/null
then
    alias vim="nvim"
    export EDITOR='nvim'
    alias nvimo="nvim -u NORC  --noplugin"
    alias vimo="/usr/bin/vim"
fi

zinit snippet OMZ::lib/theme-and-appearance.zsh

zinit light dracula/zsh

zinit snippet OMZ::lib/history.zsh
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

zinit ice wait lucid
zinit snippet OMZP::nvm

zinit ice wait lucid
zinit light kazhala/dotbare

zinit ice wait lucid
zinit snippet OMZ::lib/completion.zsh


zinit wait lucid for \
 atinit"ZINIT[COMPINIT_OPTS]=-C; zicompinit; zicdreplay" \
    zdharma/fast-syntax-highlighting \
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

#     # z.lua
#     zsh-nvm
#     zsh-better-npm-completion
#     evalcache
#     pyenv
#     dotbare
# 
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export PATH="/usr/local/opt/icu4c/bin:$PATH"
export PATH="/usr/local/opt/icu4c/sbin:$PATH"
# . /usr/local/etc/profile.d/z.sh
export PATH="$HOME/go/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.jenv/bin:$PATH"

# . $(brew --prefix asdf)/asdf.sh
# export NVM_DIR="$HOME/.nvm"
# [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
# [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"


source ~/.iterm2_shell_integration.zsh
export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
--color=dark
--color=fg:-1,bg:-1,hl:#5fff87,fg+:-1,bg+:-1,hl+:#ffaf5f
--color=info:#af87ff,prompt:#5fff87,pointer:#ff87d7,marker:#ff87d7,spinner:#ff87d7
'
export BAT_THEME="Dracula"
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

# if command -v pyenv 1>/dev/null 2>&1; then
#     eval "$(pyenv init -)"
#     export PYENV_INITIALIZED=1
# fi

export HOMEBREW_NO_INSTALL_CLEANUP=1

eval "$(zoxide init zsh)"
export FZF_DEFAULT_COMMAND='fd --type file'

export PATH="$HOME/.poetry/bin:$PATH"

eval "$(perl -I$HOME/perl5/lib/perl5 -Mlocal::lib=$HOME/perl5)"
export PATH="/usr/local/sbin:$PATH"

