set -x;

asdf plugin-add golang https://github.com/kennyp/asdf-golang.git

asdf install golang 1.18.1

asdf global golang 1.18.1

mkdir -p ~/workspace

cd ~/workspace

git clone https://github.com/danhper/asdf-exec.git

cd ~/asdf-exec

go build

cp asdf-exec $HOME/.zi/plugins/asdf-vm---asdf/bin/private

sed -i.bak -e 's|exec $(asdf_dir)/bin/asdf exec|exec $(asdf_dir)/bin/private/asdf-exec|' $HOME/.zi/plugins/asdf-vm---asdf/lib/commands/reshim.bash \ 
&& rm ~/.asdf/shims/* \
&& asdf reshim