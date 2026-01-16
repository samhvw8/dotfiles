export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin

if [ -f "$HOME/.local/bin/mise" ]; then 
    eval "$($HOME/.local/bin/mise activate zsh --shims)"
fi

if [[ $(uname) == "Darwin" ]]; then
    eval $(/opt/homebrew/bin/brew shellenv)
else
    :
fi
