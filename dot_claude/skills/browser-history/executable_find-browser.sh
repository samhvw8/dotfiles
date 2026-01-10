#!/bin/bash
#
# find-browser.sh - Detect all browsers and their history databases
#
# Output format (tab-separated, sorted by most recent first):
#   PATH<tab>TYPE<tab>BROWSER_NAME<tab>MTIME_HUMAN
#
# TYPE is either "firefox" or "chromium" (determines SQL syntax)
# Exit code 1 if no browser found

set -e

case "$(uname -s)" in
    Darwin)
        FIREFOX_BASE="$HOME/Library/Application Support"
        CHROMIUM_BASE="$HOME/Library/Application Support"
        stat_mtime() { stat -f "%m" "$1"; }
        format_date() { date -r "$1" "+%Y-%m-%d %H:%M"; }
        ;;
    Linux)
        FIREFOX_BASE="$HOME"
        CHROMIUM_BASE="$HOME/.config"
        stat_mtime() { stat -c "%Y" "$1"; }
        format_date() { date -d "@$1" "+%Y-%m-%d %H:%M"; }
        ;;
    MINGW*|MSYS*|CYGWIN*)
        FIREFOX_BASE="$APPDATA"
        CHROMIUM_BASE="$LOCALAPPDATA"
        stat_mtime() { stat -c "%Y" "$1"; }
        format_date() { date -d "@$1" "+%Y-%m-%d %H:%M"; }
        ;;
    *)
        echo "Unsupported OS" >&2
        exit 1
        ;;
esac

# Browser definitions: name|type|subpath (relative to base)
# Use F: prefix for Firefox base, C: for Chromium base
case "$(uname -s)" in
    Darwin) BROWSERS="
Zen|firefox|F:zen/Profiles
Firefox|firefox|F:Firefox/Profiles
LibreWolf|firefox|F:LibreWolf/Profiles
Waterfox|firefox|F:Waterfox/Profiles
Chrome|chromium|C:Google/Chrome
Chromium|chromium|C:Chromium
Brave|chromium|C:BraveSoftware/Brave-Browser
Edge|chromium|C:Microsoft Edge
Arc|chromium|C:Arc/User Data
Vivaldi|chromium|C:Vivaldi
Opera|chromium|C:com.operasoftware.Opera
" ;;
    Linux) BROWSERS="
Zen|firefox|F:.zen
Firefox|firefox|F:.mozilla/firefox
LibreWolf|firefox|F:.librewolf
Waterfox|firefox|F:.waterfox
Chrome|chromium|C:google-chrome
Chromium|chromium|C:chromium
Brave|chromium|C:BraveSoftware/Brave-Browser
Edge|chromium|C:microsoft-edge
Vivaldi|chromium|C:vivaldi
Opera|chromium|C:opera
" ;;
    MINGW*|MSYS*|CYGWIN*) BROWSERS="
Firefox|firefox|F:Mozilla/Firefox/Profiles
LibreWolf|firefox|F:LibreWolf/Profiles
Waterfox|firefox|F:Waterfox/Profiles
Chrome|chromium|C:Google/Chrome/User Data
Chromium|chromium|C:Chromium/User Data
Brave|chromium|C:BraveSoftware/Brave-Browser/User Data
Edge|chromium|C:Microsoft/Edge/User Data
Vivaldi|chromium|C:Vivaldi/User Data
Opera|chromium|C:Opera Software/Opera Stable
" ;;
esac

output_file() {
    local file="$1" type="$2" name="$3"
    local mtime mtime_human
    mtime=$(stat_mtime "$file")
    mtime_human=$(format_date "$mtime")
    printf "%s\t%s\t%s\t%s\t%s\n" "$mtime" "$file" "$type" "$name" "$mtime_human"
}

results=$(mktemp)
trap "rm -f $results" EXIT

echo "$BROWSERS" | while IFS='|' read -r name type path_spec; do
    [[ -z "$name" ]] && continue

    # Parse base prefix and subpath
    base_type="${path_spec%%:*}"
    subpath="${path_spec#*:}"

    [[ "$base_type" == "F" ]] && base="$FIREFOX_BASE" || base="$CHROMIUM_BASE"
    full_base="$base/$subpath"

    [[ -d "$full_base" ]] || continue

    # Firefox stores history in places.sqlite, Chromium in History
    [[ "$type" == "firefox" ]] && filename="places.sqlite" || filename="History"

    find "$full_base" -maxdepth 2 -name "$filename" -type f 2>/dev/null | while read -r file; do
        output_file "$file" "$type" "$name"
    done
done | sort -t$'\t' -k1 -rn | cut -f2- > "$results"

if [[ -s "$results" ]]; then
    cat "$results"
else
    echo "No browser history found" >&2
    exit 1
fi
