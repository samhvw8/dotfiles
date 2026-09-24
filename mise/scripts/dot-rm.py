#!/usr/bin/env python3
"""Stop managing dotfiles (mise run dot:rm, dot:destroy).

dot:rm <path>...       Replace each link in ~ with a real copy of the file and
                       remove it from home/, like `chezmoi forget`.
dot:destroy <path>...  Remove the links from ~ and the files from home/, like
                       `chezmoi destroy`. Asks first unless --yes.

A path may be given as it lives in ~ or in home/. Files in ~ that are not links
into this repository are never touched, and a [dotfiles] entry naming the path
is removed from mise/conf.d/dotfiles.toml. The deletion is staged in git but not
committed; `mise run dot:save` records it.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tomllib

HOME = os.path.expanduser("~")
REPO = os.path.join(HOME, ".dotfiles")
REPO_HOME = os.path.join(REPO, "home")
SHARED = "mise/conf.d/dotfiles.toml"
PER_INSTALL = ["mise/config.toml", "mise/minimal.toml"]


def fail(message):
    print(f"\033[0;31m[ERROR]\033[0m {message}", file=sys.stderr)
    sys.exit(1)


def entry_keys(config):
    with open(os.path.join(REPO, config), "rb") as f:
        return tomllib.load(f).get("dotfiles", {})


def to_rel(arg):
    """Return the path relative to ~ for an argument given in ~ or in home/."""
    path = os.path.abspath(os.path.expanduser(arg))  # keeps links unresolved
    for root in (REPO_HOME, HOME):
        if path.startswith(root + os.sep):
            rel = path[len(root) + 1:]
            if root == HOME and rel.split(os.sep)[0] == ".dotfiles":
                fail(f"{arg} is inside ~/.dotfiles but not under home/")
            return rel
    fail(f"{arg} is not under {HOME}")


def check(rel):
    source = os.path.join(REPO_HOME, rel)
    if not os.path.lexists(source):
        fail(f"home/{rel} is not in the repository")
    for config in PER_INSTALL:
        if f"~/{rel}" in entry_keys(config):
            fail(f"~/{rel} is declared per install in {config}; edit both configs by hand")
    for key, entry in entry_keys(SHARED).items():
        if isinstance(entry, dict) and entry.get("mode") == "symlink-each" and key == f"~/{rel}":
            fail(f"~/{rel} is a whole linked directory; remove its files one by one")
    return source


def managed_links(rel):
    """Links under ~/rel that point into home/rel, with the file each points to."""
    target = os.path.join(HOME, rel)
    source = os.path.join(REPO_HOME, rel)
    candidates = []
    if os.path.islink(target):
        candidates.append(target)
    elif os.path.isdir(target):
        for dirpath, dirnames, filenames in os.walk(target):
            for name in dirnames + filenames:
                full = os.path.join(dirpath, name)
                if os.path.islink(full):
                    candidates.append(full)
    links = []
    for link in candidates:
        resolved = os.path.realpath(link)
        if resolved == os.path.realpath(source) or resolved.startswith(os.path.realpath(source) + os.sep):
            links.append((link, resolved))
    return links


def prune_empty_dirs(top):
    if not os.path.isdir(top) or os.path.islink(top):
        return
    for dirpath, _, _ in sorted(os.walk(top), key=lambda w: -len(w[0])):
        if not os.listdir(dirpath):
            os.rmdir(dirpath)


def remove_entry(rel, dry_run):
    path = os.path.join(REPO, SHARED)
    with open(path) as f:
        lines = f.readlines()
    prefix = f'"~/{rel}" ='
    kept = [line for line in lines if not line.startswith(prefix)]
    if len(kept) != len(lines):
        print(f"  remove the [dotfiles] entry for ~/{rel} from {SHARED}")
        if not dry_run:
            with open(path, "w") as f:
                f.writelines(kept)
        return True
    return False


def main():
    parser = argparse.ArgumentParser(prog="dot:rm")
    parser.add_argument("paths", nargs="+")
    parser.add_argument("--destroy", action="store_true", help="also delete the files from ~")
    parser.add_argument("-n", "--dry-run", action="store_true")
    parser.add_argument("-y", "--yes", action="store_true")
    args = parser.parse_args()

    plans = []
    for arg in args.paths:
        rel = to_rel(arg)
        plans.append((rel, check(rel), managed_links(rel)))

    for rel, _, links in plans:
        verb = "delete" if args.destroy else "replace with a copy"
        for link, _ in links:
            print(f"  {verb}: ~/{os.path.relpath(link, HOME)}")
        print(f"  remove from the repository: home/{rel}")

    if args.dry_run:
        for rel, _, _ in plans:
            remove_entry(rel, True)
        return
    if args.destroy and not args.yes:
        if not sys.stdin.isatty():
            fail("dot:destroy needs --yes when not run from a terminal")
        if input("Delete these files from ~ and the repository? [y/N] ").strip().lower() != "y":
            print("Nothing changed.")
            return

    changed_entry = False
    for rel, source, links in plans:
        for link, resolved in links:
            os.unlink(link)
            if not args.destroy:
                if os.path.isdir(resolved):
                    shutil.copytree(resolved, link, symlinks=True)
                else:
                    shutil.copy2(resolved, link)
        if args.destroy:
            prune_empty_dirs(os.path.join(HOME, rel))
        if os.path.isdir(source) and not os.path.islink(source):
            shutil.rmtree(source)
        else:
            os.unlink(source)
        parent = os.path.dirname(source)
        while parent != REPO_HOME and not os.listdir(parent):
            os.rmdir(parent)
            parent = os.path.dirname(parent)
        subprocess.run(["git", "-C", REPO, "add", "-A", "--", f"home/{rel}"], check=True)
        changed_entry |= remove_entry(rel, False)
        done = "Deleted" if args.destroy else "Stopped managing"
        print(f"\033[0;32m[SUCCESS]\033[0m {done} ~/{rel}")
    if changed_entry:
        subprocess.run(["git", "-C", REPO, "add", "--", SHARED], check=True)


main()
