if [[ `uname` == "Darwin" ]] 
then
    echo "Macos"
else
    echo "Linux"

    sudo apt update
    sudo apt-get install --yes tmux vim git zsh wget curl net-tools unzip zip python3-pip aptitude apt-transport-https gnupg ca-certificates curl software-properties-common build-essential terminator  && \
    git clone https://github.com/kazhala/dotbare.git ~/.dotbare  && \

    export PATH=$PATH:$HOME/.dotbare && \

    echo 'alias dotbare="$HOME/.dotbare/dotbare"' | tee -a ~/.profile && \

    dotbare finit -u  https://github.com/samhvw8/dotfiles.git && \

    sudo dbus-uuidgen --ensure && \

    wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local && \

    echo 'export PATH=$PATH:/usr/local/go/bin' | tee -a ~/.profile && \
    echo 'export PATH=$PATH:$HOME/.local/bin' | tee -a ~/.profile && \

    mkdir -p $HOME/.local/bin && \

    source ~/.profile && \

    git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && \

    ~/.fzf/install && \

    mkdir -p $HOME/.fonts && \

    wget -O  "$HOME/.fonts/FiraCode Nerd Font Mono.tff" https://git.io/JznfU  && \

    fc-cache -f -v && \

    mkdir "$HOME/tmp" && \

    git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm && \

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && \

    curl -s "https://get.sdkman.io" | bash && \

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y && \

    curl https://pyenv.run | bash && \

    chsh -s $(which zsh) 
fi
