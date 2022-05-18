alias dotbare="$HOME/.dotbare/dotbare"
export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
. "$HOME/.cargo/env"
eval $(/opt/homebrew/bin/brew shellenv)
if [[ $(uname) == "Darwin" ]]; then
    eval $(/opt/homebrew/bin/brew shellenv)
else
    :
fi
