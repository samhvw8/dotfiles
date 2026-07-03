# capture - how-to (Phase 1)

Capture a marketing/landing page -> write all artifacts under `./capture/` in the video project root. The design system (Phase 1b) and visual/story phases read capture output directly; there is no separate designlang capture anymore.

## Start

```bash
(cd "$PROJECT_DIR" && npx hyperframes capture "<TARGET_URL>" -o ./capture)
```

Optional flags (normally not needed):

- `--timeout 60000` - give `networkidle2` a longer window when the first viewport of a JS-heavy site has not injected yet
- `--skip-assets` - do not download images / SVGs / fonts (only for schema probing; do not use in the normal pipeline)
- `--max-screenshots 12` - reduce the number of scroll-position screenshots

## Artifacts

```
capture/
├── extracted/
│   ├── tokens.json              # title / desc / cssVariables / fonts / colors / colorStats (brand-color classification signal) / headings / ctas / svgs / page{width,height,viewport} / sections[].{type,rect(x,y,w,h),heading,text,callsToAction,layout,assetUrls(remote),assets(local paths)}
│   ├── design-styles.json       # typography roles / buttons / cards / nav / shadows / radius / spacing
│   ├── animations.json          # CDP + Web Animations + CSS keyframes catalog (includes easing strings)
│   ├── fonts-manifest.json      # family/weight/style reverse lookup from OpenType name-table
│   ├── asset-descriptions.md    # one line per image (DOM position + optional Gemini caption)
│   ├── visible-text.txt         # full plain text dump
│   ├── video-manifest.json      # screenshots + context for each <video> (if any)
│   ├── shaders.json             # WebGL source (if there is canvas)
│   └── page.html                # self-contained full-page reproduction (inline CSS + data-URI images) - fidelity reference for page-card reconstruction, not used in render
├── assets/
│   ├── *.svg / *.jpg / *.png / *.webp / *.mp4
│   ├── fonts/                   # site fonts woff/woff2/otf
│   ├── svgs/                    # inline SVGs written separately
│   ├── videos/previews/         # <video> frame captures
│   └── contact-sheet-*.jpg      # asset contact sheets
├── screenshots/
│   ├── scroll-*.png             # viewport screenshots at scroll positions
│   └── contact-sheet-*.jpg
├── meta.json
└── CLAUDE.md / AGENTS.md / .cursorrules   # agent scaffolding bundled by capture (this skill does not require reading it)
```

## Validation

```bash
[ -s ./capture/extracted/tokens.json ] && \
[ -s ./capture/extracted/design-styles.json ] && \
[ -d ./capture/assets ] && echo ok || echo missing
```

If any item is missing -> report the missing item and stop. If `./capture/BLOCKED.md` exists:

- "Anti-bot protection detected" -> use a different site, or manually provide HTML (not supported yet)
- "Page navigation timed out" -> rerun with `--timeout 60000`

## Report (back to the user)

- Final URL <- prefer `meta.json.id` (if it is a URL); otherwise grep the URL line at the top of `capture/CLAUDE.md`
- Page title <- `tokens.json.title`
- Section candidates: `tokens.json.sections.length` + brief list
- Assets: `ls capture/assets | wc -l`, split by extension
- Fonts: `tokens.json.fonts` list (and alignment with `fonts-manifest.json`)
- Animations / shader / Lottie / video: `animations.json.summary` + `shaders.json` length + whether `assets/lottie/` exists (if any) and `extracted/video-manifest.json`
- Anomalies (timeout / no assets / blank screenshot / anti-bot)

## Write Log

Append to `./context.log` in the video project root:

```
## capture [done <ISO timestamp>]
URL: <final url>
Assets: <count>
Notes: <one line>
```

## Constraints

- Run every command through a `(cd "$PROJECT_DIR" && ...)` subshell; do not run a standalone `cd`.
- Only write `./capture/`; do not touch `./design-system/`.
- Force English: capture already defaults to `Accept-Language: en-US,en;q=0.9`. If `tokens.json.headings` are still in a local language, note an anomaly in the `Notes` line of `context.log` and continue.
