#!/usr/bin/env python3
"""Show what needs attention (mise run dot:status), like `chezmoi status`:
dotfiles not in their applied state, then uncommitted changes in the repository.
Prints nothing for either part when it is clean."""
import json
import os
import subprocess

REPO = os.path.expanduser("~/.dotfiles")

status = json.loads(subprocess.run(
    ["mise", "dot", "status", "--json"], capture_output=True, text=True, check=True,
).stdout)
for item in status.get("files", []):
    if item["state"] != "applied":
        print(f"{item['state']:<15} {item['target']}")
for item in status.get("edits", []):
    if item["state"] != "applied":
        print(f"{item['state']:<15} {item['path']} ({item['edit']})")

subprocess.run(["git", "-C", REPO, "status", "--short"], check=True)
