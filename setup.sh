if [[ `uname` == "Darwin" ]] 
then
    echo "Macos"
else
    echo "Linux"
    sudo apt update
    sudo apt-get install --yes tmux vim zsh wget curl net-tools unzip zip apt-transport-https ca-certificates curl software-properties-common build-essential terminator  && \
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

    sudo wget -O "/usr/local/bin/bazel" https://github.com/bazelbuild/bazelisk/releases/download/v1.10.1/bazelisk-linux-arm64 && \

    mkdir "$HOME/tmp" && \

    wget -O "$HOME/tmp/helm.tar.gz" https://get.helm.sh/helm-v2.15.1-linux-amd64.tar.gz && \

    tar -xvf "$HOME/tmp/helm.tar.gz"  --directory $HOME/tmp && \

    chmod +x $HOME/tmp/linux-amd64/helm && \

    chmod +x $HOME/tmp/linux-amd64/tiller && \

    sudo mv $HOME/tmp/linux-amd64/helm /usr/local/bin &&  \

    sudo mv $HOME/tmp/linux-amd64/tiller /usr/local/bin &&  \

    helm init --client-only --stable-repo-url 	https://charts.helm.sh/stable && \

    curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/v1.14.0/skaffold-linux-amd64 && chmod +x skaffold && sudo mv skaffold /usr/local/bin  && \

    wget -O "$HOME/.local/bin/kubectl" "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \

    chmod +x "$HOME/.local/bin/kubectl" && \

    git clone --depth 1 https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm && \

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && \

    curl -s "https://get.sdkman.io" | bash && \

    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y && \

    chsh -s $(which zsh) && \
    
    zsh

fi