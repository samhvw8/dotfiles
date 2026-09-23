#!/usr/bin/env python3
"""Check that every dotfile in home/ is linked, and list ccp hub items that
exist only on this machine.

Errors (exit 1): a file committed under home/ that no [dotfiles] entry links,
so `mise dot apply` would silently ignore it.
Warnings: ccp hub items that are neither installed from a ccp source nor
stored in this repository; `mise run dot:add <path>` stores one.
"""
import os
import subprocess
import sys
import tomllib

HOME = os.path.expanduser("~")
REPO = os.path.join(HOME, ".dotfiles")
CONFIGS = ["mise/conf.d/dotfiles.toml", "mise/config.toml", "mise/minimal.toml"]
REPO_HOME = "~/.dotfiles/home/"


def linked_sources():
    """Return (directory sources, file sources) relative to home/."""
    dirs, files = set(), set()
    for config in CONFIGS:
        with open(os.path.join(REPO, config), "rb") as f:
            entries = tomllib.load(f).get("dotfiles", {})
        for entry in entries.values():
            source = entry.get("source", "") if isinstance(entry, dict) else entry
            if not source.startswith(REPO_HOME):
                continue
            rel = source[len(REPO_HOME):]
            if isinstance(entry, dict) and entry.get("mode") == "symlink-each":
                dirs.add(rel)
            else:
                files.add(rel)
    return dirs, files


def unlinked_files():
    dirs, files = linked_sources()
    tracked = subprocess.run(
        ["git", "-C", REPO, "ls-files", "home"],
        capture_output=True, text=True, check=True,
    ).stdout.splitlines()
    missing = []
    for path in tracked:
        rel = path[len("home/"):]
        if rel in files or any(rel.startswith(d + "/") for d in dirs):
            continue
        missing.append(rel)
    return missing


def local_only_hub_items():
    hub = os.path.join(HOME, ".ccp", "hub")
    ccp_toml = os.path.join(HOME, ".ccp", "ccp.toml")
    if not os.path.isdir(hub) or not os.path.isfile(ccp_toml):
        return []
    with open(ccp_toml, "rb") as f:
        sources = tomllib.load(f).get("sources", {})
    installed = {item for s in sources.values() for item in s.get("installed", [])}
    repo_hub = os.path.join(REPO, "home", ".ccp", "hub")
    items = []
    for kind in sorted(os.listdir(hub)):
        kind_dir = os.path.join(hub, kind)
        if kind.startswith(".") or not os.path.isdir(kind_dir):
            continue
        for name in sorted(os.listdir(kind_dir)):
            rel = f"{kind}/{name}"
            path = os.path.join(kind_dir, name)
            if name.startswith(".") or os.path.islink(path) or rel in installed:
                continue
            if not os.path.exists(os.path.join(repo_hub, rel)):
                items.append(rel)
    return items


def main():
    missing = unlinked_files()
    for rel in missing:
        print(f"error: home/{rel} is committed but no [dotfiles] entry links it; "
              f"add an entry to mise/conf.d/dotfiles.toml", file=sys.stderr)
    for rel in local_only_hub_items():
        print(f"warning: ~/.ccp/hub/{rel} exists only on this machine; "
              f"store it with: mise run dot:add ~/.ccp/hub/{rel}", file=sys.stderr)
    sys.exit(1 if missing else 0)


main()
