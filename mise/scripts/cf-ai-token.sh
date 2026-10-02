#!/bin/sh
# Print a valid Cloudflare bearer for Workers AI from the `cf` CLI's OAuth login, for
# CLOUDFLARE_AI_TOKEN in config.local.toml. `cf auth whoami` refreshes the token when it has
# expired. Direct install paths, never mise shims: a shim re-enters mise, which runs this again.
M="$HOME/.local/share/mise/installs"
CF="$M/npm-cf/latest/node_modules/.bin/cf"
for d in "$M"/node/*/bin; do [ -x "$d/node" ] && NODE_BIN="$d"; done
[ -x "$CF" ] && [ -n "$NODE_BIN" ] || exit 1
PATH="$NODE_BIN:/usr/bin:/bin" "$CF" auth whoami -q >/dev/null 2>&1 || exit 1
exec /usr/bin/python3 -c 'import json, os; print(json.load(open(os.path.expanduser("~/.config/cloudflare/config/default.json")))["oauth_token"])'
