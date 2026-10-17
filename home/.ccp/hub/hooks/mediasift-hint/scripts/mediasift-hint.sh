#!/bin/bash
# mediasift-hint — UserPromptSubmit
# When a prompt names a video/audio file or a YouTube/Vimeo link, tell the agent to run
# `mediasift see` (and whether a card is cached). Silent otherwise, and silent if mediasift
# is not installed: a hint must never block a prompt. Source: ~/workspace/tools/mediasift (hook.py).
F="$HOME/.local/bin/mediasift"
[ -x "$F" ] || { cat >/dev/null; exit 0; }
exec "$F" hook
