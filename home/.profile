# set PATH so it includes user's private bin if it exists
export PATH=$PATH:$HOME/.local/bin
export PATH=$PATH:$HOME/bin

if [[ $(uname) == "Darwin" ]]; then
  export HOMEBREW_PREFIX=/opt/homebrew
  export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"
else
  :
fi

if [ -f "$HOME/.local/bin/mise" ]; then
  eval "$($HOME/.local/bin/mise activate bash --shims)"
fi
