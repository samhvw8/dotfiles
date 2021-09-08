if [[ `uname` == "Darwin" ]] 
then
    echo "Macos"
else
    echo "Linux"
    sudo apt-get install --yes zsh unzip apt-transport-https ca-certificates curl software-properties-common build-essential terminator 

    git clone https://github.com/kazhala/dotbare.git ~/.dotbare

    export PATH=$PATH:$HOME/.dotbare

    echo 'alias dotbare="$HOME/.dotbare/dotbare"' | tee -a ~/.profile

    dotbare finit -u  https://github.com/samhvw8/dotfiles.git

    sudo dbus-uuidgen --ensure

    wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local

    echo 'export PATH=$PATH:/usr/local/go/bin' | tee -a ~/.profile

    source ~/.profile

    curl -s "https://get.sdkman.io" | bash

    chsh -s $(which zsh)

fi