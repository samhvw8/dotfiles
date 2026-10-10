#!/bin/bash
# framesift-hint — UserPromptSubmit
# When a prompt names a video/audio file or a YouTube/Vimeo link, tell the agent to run
# `framesift see` (and whether a card is cached). Silent otherwise, and silent if framesift
# is not installed: a hint must never block a prompt. Source: ~/workspace/tools/framesift (hook.py).
F="$HOME/.local/bin/framesift"
[ -x "$F" ] || { cat >/dev/null; exit 0; }
exec "$F" hook
