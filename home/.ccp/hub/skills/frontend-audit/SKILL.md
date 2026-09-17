---
name: frontend-audit
description: Visual design verification loop for matching a goal PNG to a live render. Use when the user shares a design mock / goal image and asks to match the UI to it, asks to "iterate on this design" or "match this 1:1", or calls out visual drift in a previous UI iteration. Provides histogram color sampling, shape inspection (radius/border/shadow/bg-mode/fill-vs-context), computed-style checking on the live render, snap, and side-by-side diff. After every UI change the assistant MUST snap the live render and Read the snap with the Read tool before reporting the change done — skipping that is the #1 regression vector. Also handles regions auto-generation: the user only drops PNGs into design/, the assistant looks at each PNG and writes a sibling <name>.regions.json.
user_invocable: true
---

# frontend-audit

A reusable design verification loop. The user only needs to:

1. Drop goal PNGs into `design/`
2. Have a dev server running

That's it. The assistant — using this skill — handles every other piece, including authoring the region descriptors.

## When to invoke

- The user shares a goal PNG and asks to match the UI to it ("match this design", "iterate on this mock", "make it look like the goal")
- The user calls out visual drift in a previous UI iteration ("the button is too white", "the leaves are too high")
- The user asks to "validate" or "check" that the implementation matches the design

## Bootstrap — first use in a project

Check whether the current working directory has `.frontend-audit.json`:

```bash
test -f .frontend-audit.json && echo "configured" || echo "needs-bootstrap"
```

**If `needs-bootstrap`:** the whole setup runs eagerly in one shot — the user types `/frontend-audit` once and Claude provisions every dependency. The user should not have to think about Python, OmniParser, Playwright, or any other internal tool.

### Step A — gather config (one AskUserQuestion call, three questions)

Call AskUserQuestion **exactly once with all three of these questions in the same call** — don't infer answers from the project layout, the user wants the choice:

1. **Dev server URL** — first option `http://localhost:3000` labelled `(Recommended)`, with `Other` available for custom values.
2. **Goal-image directory** — first option `design/` labelled `(Recommended)`. Offer `design/`, `mocks/`, `screenshots/` as quick options.
3. **Install everything now?** — first option `Yes, install with <pkg-manager>` labelled `(Recommended)`. Detect the lockfile (`bun.lock` → bun, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, else npm). Mention that "install everything" means JS deps (pngjs, playwright, chromium) **and** the OmniParser ML region detector — about 3GB on disk one-time.

### Step B — install JS dependencies

On `Yes` to install: run `bun add -d pngjs jpeg-js playwright && bunx playwright install chromium` (substituting the detected package manager — `pngjs` decodes PNG, `jpeg-js` decodes JPEG so the user can drop either format into `design/`). On `Skip`: tell the user they'll need to install before continuing and stop.

### Step C — check for Python and offer to install if missing

OmniParser (the ML region detector) requires Python 3.10+. Run:

```bash
command -v python3 >/dev/null 2>&1 && python3 --version
```

If absent OR the reported version is `< 3.10`:

- Call AskUserQuestion: "Python 3.10+ isn't installed. Install it now? (recommended; needed for high-quality region detection — without it, the skill falls back to a simpler edge-detection mode that still works but produces less semantic region names)."
- Quick options: `Yes, install Python` (recommended), `Skip — use the no-Python fallback`.
- On `Yes`: detect OS and run the right command:
  - macOS with brew: `brew install python@3.12`
  - macOS without brew: ask the user to install brew first, or fall back to the python.org installer link
  - Linux Debian/Ubuntu: `sudo apt install -y python3.12 python3.12-venv`
  - Linux Fedora/RHEL: `sudo dnf install -y python3.12`
  - Windows: send the user to `https://www.python.org/downloads/` (Claude can't reliably install Python on Windows from CLI)
- On `Skip`: set `_skipOmniParser: true` in the config so Step D doesn't run, and inform the user that future PNG region authoring will use the `--programmatic` (Sobel + CCL) path.

### Step D — provision OmniParser eagerly

If Python is available and the user didn't skip:

```bash
bun ~/.claude/skills/frontend-audit/scripts/bootstrap-regions.mjs --setup-only
```

This creates the Python venv at `~/.claude/skills/frontend-audit/.venv/` and installs OmniParser's full dep stack (transformers, torch, ultralytics, easyocr, etc.) and triggers the model-weight download. Total ~3GB on disk, one-time. The script prints progress; relay it to the user so they know it's working.

On failure (e.g. pip download blocked, disk full): tell the user the error and offer to retry, OR fall back to `--programmatic` mode for region authoring.

### Step E — write the config and confirm

Write `.frontend-audit.json`:

```json
{
  "devUrl": "http://localhost:3000",
  "designDir": "design"
}
```

Add `design/_debug/` to `.gitignore` (idempotent). Tell the user setup is complete and they can now drop PNGs into `design/` and re-run `/frontend-audit` to start auditing.

**Do not** drop a `regions.json` — regions are per-PNG and the assistant generates them in Step 0 below.

**If `configured`:** read `.frontend-audit.json` so subsequent script invocations use the project's URL and paths. Skip bootstrap entirely.

## The workflow (run in order, every iteration)

### Step 0 — discover which PNGs need regions

```bash
bun ~/.claude/skills/frontend-audit/scripts/discover.mjs
```

`discover.mjs` walks `designDir` (from `.frontend-audit.json`, default `design/`), hashes each PNG with SHA-256, and reports per-PNG status:

- **`new`** — no sibling regions file. Regions must be generated.
- **`stale`** — regions file exists but its `_meta.sourceHash` doesn't match the current PNG bytes. The image was replaced; regions are out of date. Regions must be regenerated.
- **`up-to-date`** — hash matches. Skip.
- **`unhashed`** — regions file exists with no `_meta` block (legacy / hand-authored). Treated as up-to-date but flagged; use `--stamp` to record the hash.

The script always exits `0` on a successful inventory — `new` and `stale` are work items, not failures. Parse the printed table to decide next steps.

**For each `new` or `stale` PNG**, the assistant must do the following:

#### Optional shortcut — auto-bootstrap the regions

Before hand-authoring, the assistant **may** invoke `bootstrap-regions.mjs` to seed the regions file with detected elements. This skips the slowest part of the manual flow (placing 20+ bboxes by eye) but never skips the human-quality pass that follows.

```bash
# Default: ML-based, semantic labels. ~10s per PNG once the venv is warm.
bun ~/.claude/skills/frontend-audit/scripts/bootstrap-regions.mjs --image=design/<name>.png

# Fallback: pure-JS Sobel + connected-components, no Python deps. <1s per PNG.
bun ~/.claude/skills/frontend-audit/scripts/bootstrap-regions.mjs --image=design/<name>.png --programmatic
```

**Default (OmniParser).** Calls `microsoft/OmniParser-v2.0` (YOLOv8 UI-icon detector + Florence-2 captioner + easyocr) via a Python subprocess. First run installs a ~3GB venv at `~/.claude/skills/frontend-audit/.venv/` and downloads ~600MB of model weights to the HF cache; subsequent runs are ~10s each on MPS, ~15–30s on CPU. Returns regions with semantic labels like `your-recent-orders`, `order-4000257090`, `view-all-orders`. License note: icon_detect is AGPL — bounded design-time exposure only, but worth knowing if your project has an AGPL policy.

**Fallback (`--programmatic`).** Pure-JavaScript path using the same Sobel + connected-component primitives the audit gate uses. Runs in <1s, requires no Python, generates regions named by grid position + dimensions (`shape-mid-center-494-427`). The assistant renames them to something semantic in step 1 below.

**When the default fails** (no Python, install errors, model download blocked) the script exits with a clear message pointing at the three fallback paths. There's no auto-fallback to programmatic — the choice is explicit.

**Then, regardless of how the regions arrived in the file:**

1. Use the **Read tool** on the PNG — it renders the image back as visible content because the assistant is multimodal.
2. Identify ~10–25 key visual components in the image. For each, write a region descriptor with fractional coordinates (`x`, `y`, `w`, `h` as fractions of image width/height — 0..1). _If you bootstrapped, the regions already exist; your job in this step is to spot what's MISSING — bootstrap typically catches text and icons but misses card/panel containers, decorative strips, and background surfaces._
3. Name regions semantically by what the element IS, not where. Use kebab-case. _If you bootstrapped, replace generic names like `shape-mid-center-494-427` (programmatic) or imperfect ML labels like `icon-region` with what the element actually is (`card-1-bg`, `status-pill-shipped`)._ Examples of good names:
   - Surfaces: `page-bg`, `main-card`, `sidebar`, `footer-strip`
   - Interactive: `primary-cta`, `secondary-btn`, `ghost-btn`, `submit-pill`
   - Text: `hero-title`, `section-eyebrow`, `body-paragraph`, `subtitle`
   - Decoration: `avatar-bg`, `status-icon`, `badge`
4. Pad rects a few pixels around the element edge so the shape inspector has flat fill to scan (don't size rects tight to text).
5. **Add `locator` fields** for every region that maps to a distinct interactive element (button, pill, chip, list-row, badge). Decorative or text-only regions (`page-bg`, headings) can skip the locator. Locators enable the BLOCKING gate in Step 6 to inspect live computed styles instead of sampling re-rendered pixels.

   A `locator` is one of these shapes:
   - `{ "testid": "ship-now-btn" }` — best when the codebase uses `data-testid` attributes
   - `{ "role": "button", "name": "Ship now" }` — ARIA role + accessible name (works regardless of class names)
   - `{ "text": "Ship now" }` — exact visible text (last semantic resort)
   - `{ "css": "main > div:nth-of-type(2) > button:first-of-type" }` — structural CSS path with NO class names (fallback when nothing semantic is available)

   **Prefer not to author locators by hand — use `bind-selectors.mjs` (Step 0.5 below) to generate them from the live DOM automatically.** Hand-authored class-based selectors are the documented brittleness vector this skill is fighting; the bind step generates locators that survive Tailwind class refactors, Svelte scoped-style mangling, and CSS Modules hash suffixes.

6. Write the result to `design/<name>.regions.json` (sibling to the PNG). The file should look like:
   ```json
   {
     "page-bg": { "x": 0.02, "y": 0.02, "w": 0.02, "h": 0.02 },
     "primary-cta": {
       "x": 0.08, "y": 0.41, "w": 0.1, "h": 0.04,
       "locator": { "role": "button", "name": "Ship now" }
     }
   }
   ```
   You don't need to write the `_meta` block — that gets stamped in the next step. The legacy `selector` field is still accepted and treated equivalently once resolved; new files should use `locator`.

7. **Bind locators to the live DOM:**
   ```bash
   bun ~/.claude/skills/frontend-audit/scripts/bind-selectors.mjs \
       --regions=design/<name>.regions.json --url=<dev-path>
   ```
   This boots Playwright, walks each region that has a `selector` (or `locator`), inspects the live DOM, and rewrites it with the most stable locator shape it can find — preferring testid → role+name → text → structural CSS path. Rect-only regions (with no selector) are skipped by default; pass `--include-rect` to also bind them via `elementsFromPoint` (speculative; review every binding). The script validates every emitted locator resolves to exactly one element before writing.

8. Run `bun ~/.claude/skills/frontend-audit/scripts/discover.mjs --stamp` once after writing all new/regenerated regions. This adds the `_meta.sourceHash` so future `discover` runs detect content changes.

**Region-picking guidance:**

- Always include `page-bg` — a tiny patch near the top-left corner. This anchors the shadow probe.
- For each major card / panel / surface, include a region covering the whole element (radius/border/shadow probes need this).
- For each interactive element (button, pill, chip, toggle), include a region covering the whole element (bg-mode probe needs the surrounding context).
- For each text label / heading / accent eyebrow, include a region around the text.
- For each icon avatar / decorative element with a distinct fill, include a region.

**Verification:** after writing the regions file, run sample-colors with `--debug`:

```bash
bun ~/.claude/skills/frontend-audit/scripts/sample-colors.mjs design/<name>.png --debug
```

This writes `design/_debug/<region>.png` crops for each region. The assistant should Read a few of those crops to verify regions landed on the right glyph. If a region missed (e.g. you placed a button rect on adjacent whitespace), refine the JSON and re-run.

**Handling stale PNGs:** when `discover` reports `stale`, the existing regions file describes a different image. Two options:

- **Replace** (default): regenerate the regions from scratch. The new regions overwrite the old when the assistant writes the file. Common case — the user updated the design.
- **Adapt**: if the image changed only slightly (e.g. minor tweak to a button) and most regions still apply, the assistant can open the old regions file, adjust only the affected coordinates, and re-stamp. Use sparingly — it's easy to leave drift behind.

The user should never have to touch the regions file — but they can if they want to.

### Step 1 — sample dominant colors from the goal

```bash
bun ~/.claude/skills/frontend-audit/scripts/sample-colors.mjs <goal.png> --debug
```

Histogram clustering (5-bit-per-channel quantization + merge by RGB distance) returns the **top-3 dominant clusters per region** with hex, RGB, area %, and saturation.

Why histogram, not "darkest pixel": a swatch over "Delivery by …" contains pill-bg + white text + AA edges. Darkest-1% returns the AA boundary (darker and less saturated than the real fill). Histogram returns the true pill color AND the text color in one pass.

For accent labels with low pixel-area (e.g. a brick-red "NEXT CHARGE DATE" eyebrow): pick the cluster with **highest saturation**, not highest area. The sampler prints both.

### Step 2 — inspect shape tokens (radius, border, bg-mode, shadow)

```bash
bun ~/.claude/skills/frontend-audit/scripts/inspect-shape.mjs <goal.png>
# Or for one region:
bun ~/.claude/skills/frontend-audit/scripts/inspect-shape.mjs <goal.png> --region=<name>
```

Per region:

- **r-tl / r-tr / r-bl / r-br** — corner radius in goal-image pixels. Map to Tailwind: 12 ≈ `rounded-xl`, 16 ≈ `rounded-2xl`.
- **bg-mode** — `ghost (Δ2)` means the rect fill matches its surrounding container → button is transparent in the goal (no `bg-…` class). `filled (Δ40 vs #fbfaf8)` means rect has its own fill. Catches the "white-filled button where goal wants outline" regression.
- **border** — detected hex if ≥40% of edge samples differ from inner fill. Reports confidence % and RGB Δ. Hairline like `border-[#…]/15` reads as low confidence + small Δ; solid border reads ≥90% confidence.
- **shadow↓ / shadow→** — page-bg luma minus strip-just-outside luma. Threshold `*` = 4.

### Step 3 — inspect the live render's computed styles

```bash
bun ~/.claude/skills/frontend-audit/scripts/check.mjs <url-path> --selector='<css>'
```

Boots headless Chromium against the configured `devUrl`, runs `getComputedStyle()` on matched elements, and dumps: color, bg, border, radius, shadow, padding, margin, font, size, weight, letter-spacing, transform, width, height. This is the only reliable way to confirm what your Tailwind classes actually rendered.

### Step 4 — apply Tailwind changes

- Sampled hex codes go in via arbitrary values: `text-[#9d573d]`, `bg-[#e1e0d7]`. Don't reach for `text-emerald-800` or other palette names unless you've confirmed they match the sampled hex.
- Radius/shadow: use the class that makes intent obvious (`rounded-xl`, `rounded-2xl`, `shadow-soft`).

### Step 5 — snap the live render WITH `--goal`, then READ EVERY DIFF

**This step is the whole point of the skill. It is not optional.**

**Always pass `--goal=<path-to-goal.png>`** — `snap.mjs` will then auto-generate **four** diff PNGs: the full side-by-side AND three band zooms (header, middle, footer). Without `--goal`, you'll have only the bare snap, and you cannot reliably remember the goal's structure well enough to catch what's missing.

```bash
# One command: snap + auto-diff (full + 3 band zooms). Always include --goal.
bun ~/.claude/skills/frontend-audit/scripts/snap.mjs <url-path> \
    --selector='<css>' \
    --out=design/_debug/current.png \
    --goal=design/<name>.png
```

This writes:

- `design/_debug/current.png` — the snap
- `design/_debug/diff.png` — full goal-vs-current
- `design/_debug/diff-zoom-header.png` — top 25% only (catches title rules, eyebrow weight, hairline decorations)
- `design/_debug/diff-zoom-mid.png` — middle 45% only (catches card content details)
- `design/_debug/diff-zoom-footer.png` — bottom 30% only (catches footer banner icons, decorations)

**Read all four diff PNGs with the Read tool.** Skipping the band zooms is the silent-detail-loss failure mode: when a full-page diff is displayed at thumb size, 1-2px decorative rules, slight font-weight shifts, and small icons disappear into the noise. The band zooms surface them.

For each band, goal is on the LEFT, current on the RIGHT. Scan for:

- **Missing sections** entirely (whole panels, dividers, footers, badges)
- **Structural drift** (sections that should be separate cards rendered as one block, or vice versa)
- **Decorative rules** — horizontal lines flanking subtitles, divider strokes, section borders. These are 1-2px wide and ONLY visible in the band zooms.
- **Eyebrow / label treatment** — caps-vs-sentence, color, weight
- **Font weight differences** — goal text "thinner" or "heavier" than current. Hard to catch without zoom; do not skip the band-zoom step.
- **Icon presence, placement, and color**
- **Spacing and gutters**

### Step 6 — the audit gate (BLOCKING)

This step is the only one that decides whether the iteration is done. Everything above is preparation for it; the assistant's visual judgment does not override its verdict.

```bash
bun ~/.claude/skills/frontend-audit/scripts/audit.mjs \
    --goal=design/<name>.png \
    --current=design/_debug/current.png \
    --url=<url-path>          # required if regions.json carries selectors
    [--no-structural-gate]    # skip edge-IoU + global structural sweep
```

Standalone diagnostic (when you want the structural metrics without the per-region gate, e.g., to debug why a region is failing edge-IoU):

```bash
bun ~/.claude/skills/frontend-audit/scripts/analyze.mjs \
    --goal=design/<name>.png \
    --current=design/_debug/current.png \
    [--debug]                 # writes edge maps, blob overlays, heatmap PNGs
```

`analyze.mjs` shares its primitives with `audit.mjs` via `_structural.mjs` (Sobel, dilation, edge-IoU, connected-component labelling, template-match shift filter, grid luminance diff). It's purely diagnostic — exit code is always 0; the gate verdict comes from `audit.mjs`.

`audit.mjs` walks every region in `<name>.regions.json` and for each one computes the delta between the goal PNG and the current render across the per-region checks below. After the per-region pass it runs a global structural sweep that catches drift in areas the user didn't author a region for.

**Per-region checks:**

| Check    | Goal source                | Current source                                                    | Tolerance         |
| -------- | -------------------------- | ----------------------------------------------------------------- | ----------------- |
| Fill     | dominant cluster, PNG      | computed `background-color` (with selector) or PNG dominant       | RGB Δ ≤ 16        |
| Radius   | corner-walk on PNG         | computed `border-*-radius` per corner (with selector) or PNG      | per-corner Δ ≤ 4  |
| Border   | edge probe on PNG          | computed `border` width + color (with selector) or PNG            | presence must match; color Δ ≤ 32 when both present |
| Size     | region rect area           | live `getBoundingClientRect` (selector required)                  | ±18% w/h          |
| Edge-IoU | Sobel edge map of PNG rect | Sobel edge map of the same fractional rect on the resized current | IoU ≥ 0.40        |

**Global structural checks (run once after the per-region pass):**

| Check                | What it does                                                                                                                                                  | Tolerance                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Missing blobs        | Connected-component label both edge maps; for each goal blob not matched in current AND not present at any nearby offset (template-match shift filter), fail. | Area ≥ 1500px², not overlapping any authored region    |
| Grid luminance Δ     | 32×32 grid of mean abs luminance Δ per cell; cells outside authored regions that exceed the threshold flag as drift.                                          | Cell mean Δ ≥ 80 (0–255 scale), outside authored regions |

The structural pass is what catches "I forgot to author a region for the new banner the goal added" or "the divider rule between sections is gone in current but no region covered it." The per-region edge-IoU is what catches "this region's fill matches but its content is structurally different" — e.g., a button that has the right background but wrong text, or a card whose outline is missing despite the fill probe passing.

Exit code: **0** iff every region passes AND no structural drift is detected. **1** if any per-region check fails, any region errors, or any structural drift is flagged.

**Disabling structural checks:** pass `--no-structural-gate` to skip both the per-region edge-IoU check and the global structural sweep. Use only while iterating on early WIP that isn't aligned with the goal yet — the structural gate is the script's main weapon against silent regressions in unauthored areas.

**The gate rule, hard-coded:**

> **Do not tell the user the section matches the goal while `audit.mjs` exits non-zero. Re-run it after every code change. If it FAILs, address each line in the "Failure details" output, then re-run.**

This replaces every prior "visually verify each element" instruction. The reason: prose instructions are advisory — the assistant can rationalize a half-check as "close enough" at thumb size. The audit produces measured deltas that cannot be argued with. If the user sees a button that does not match the goal, the audit either flagged it (and the assistant ignored the gate) or the region for that button is missing — both are catchable failures, not subjective.

#### Binding regions to the live DOM (`bind-selectors.mjs`)

For the audit to inspect live computed styles (and therefore catch hex-level color mismatches that PNG sampling on a re-snapped image can blur), each interactive region SHOULD carry a `locator` describing the element semantically rather than by class. Locators are framework-agnostic and survive class refactors that break raw CSS selectors.

**Always prefer `bind-selectors.mjs` over hand-authoring locators.** The script boots Playwright, walks each region with an existing `selector` (or `locator`), inspects the live element via the accessibility tree, and emits the most stable locator shape it can find:

```bash
bun ~/.claude/skills/frontend-audit/scripts/bind-selectors.mjs \
    --regions=design/<name>.regions.json --url=<dev-path>
```

Resolution priority per element:
1. `data-testid` attribute → `{ "testid": "ship-now-btn" }`
2. ARIA role + accessible name → `{ "role": "button", "name": "Ship now" }`
3. Visible text content → `{ "text": "Ship now" }`
4. Structural CSS path (no class names) → `{ "css": "main > div:nth-of-type(2) > button:first-of-type" }`

The CSS-path fallback is deliberately class-free — Tailwind class renames, Svelte scoped suffixes (`svelte-abc123`), CSS Modules hash names, and styled-components hashes all leave this path unaffected. The path uses tag + `nth-of-type` and extends upward until uniqueness is achieved (cap 14 hops).

Useful flags:
- `--dry-run` — print proposed locators without writing
- `--keep-selector` — preserve the legacy `selector` field alongside the new `locator`
- `--include-rect` — also bind rect-only regions via `elementsFromPoint` (speculative — review each binding before trusting)

The script validates every emitted locator resolves to exactly one element on the live page before writing. Unresolvable regions are reported and the script exits non-zero.

#### Why locators, not class-based selectors

Class names are an implementation detail. They change during normal refactors (the developer renames a Tailwind class, or switches from CSS Modules to Tailwind, or wraps the button in a new component). When the class changes, a class-based selector silently stops matching, the audit reports `ERROR (unresolved binding)`, and the gate blocks — but a glancing read of "0 FAIL" can miss it. Worse: in frameworks like Svelte (scoped styles) and CSS Modules (hash suffixes), the runtime class never matches the source class to begin with, so hand-authored selectors are dead on arrival.

Semantics — role, name, testid, text — are driven by UX requirements and are far harder to silently break.

#### Sanity-checking a locator

To verify a locator resolves to exactly one element:

```bash
# Replace with the locator's strongest shape:
bun ~/.claude/skills/frontend-audit/scripts/check.mjs <url> --selector='[data-testid="ship-now-btn"]'
```

`check.mjs` is still selector-only as a quick probe; `bind-selectors.mjs --dry-run` is the more thorough check because it validates each locator the same way the audit does.

#### When the audit cannot run with selectors

If selectors are not yet authored, `audit.mjs` still runs in pixel-only mode (no `--url` needed) — every region is sampled from both PNGs at the same fractional coordinates. This works ONLY when the goal and current snap have similar aspect ratio / framing. If the live element is constrained by a narrower container (e.g. `max-w-3xl` while the goal canvas is full-bleed), the region rects on the current snap will land on whitespace and the audit will produce false PASSes on whitespace-vs-whitespace comparisons.

**Rule of thumb:** if any region in the section maps to a button or pill, author selectors. Pixel-only mode is a fallback for decoration-only checks.

## File layout in a configured project

```
project/
├── .frontend-audit.json                    # config (devUrl, designDir)
├── design/
│   ├── dashboard-home.png                   # goal mock (user drops in)
│   ├── dashboard-home.regions.json          # auto-generated by assistant
│   ├── pricing-page.png
│   ├── pricing-page.regions.json
│   ├── pages/                               # optional: organize by surface
│   │   └── account/
│   │       ├── profile.png
│   │       └── profile.regions.json
│   ├── components/                          # optional: isolated component goals
│   │   ├── membership-card.png
│   │   └── membership-card.regions.json
│   └── _debug/                              # snap + diff + crop scratch (gitignored)
└── ...
```

Subfolders are optional and free-form — name them however the project's surfaces are organized (`pages/`, `components/`, `flows/`, `marketing/`, etc.). `discover.mjs` walks `design/` recursively and skips `_debug/` and any dot-prefixed dirs. Regions files always live alongside their PNG, so nesting doesn't change the sibling-file convention.

The user never touches `.regions.json` — the assistant generates each one by looking at the corresponding PNG. The user can edit them if they want to; the convention is "if it exists and the hash matches, use it; if it's missing or the PNG changed, regenerate."

A regions file looks like:

```json
{
  "_meta": {
    "sourceImage": "dashboard-home.png",
    "sourceHash": "sha256-content-hex",
    "generatedAt": "2026-05-12T..."
  },
  "page-bg": { "x": 0.02, "y": 0.02, "w": 0.02, "h": 0.02 },
  "primary-cta": {
    "x": 0.08, "y": 0.41, "w": 0.1, "h": 0.04,
    "locator": { "role": "button", "name": "Ship now" }
  }
}
```

The `_meta` block is what makes `discover.mjs` detect a stale regions file when the user replaces a PNG. The `locator` field is optional but strongly recommended for interactive elements — it powers the audit gate. The legacy `selector` field (raw CSS) is still accepted for backwards compatibility; new files should use `locator` (generated by `bind-selectors.mjs`).

## What this skill does NOT do

- Pixel-perfect overlay diff: brittle at different scales; side-by-side reads faster.
- Run the dev server: assumes one is already running at the configured URL.
- Snap mobile/responsive: snap uses a fixed viewport (default 1600×1200, override with `--viewport=WxH`).

## Limitations to communicate when relevant

- Color sampler can't read padding, font weight, or letter-spacing from a PNG — those come from `check.mjs` on the live render.
- Shape inspector heuristics: border detection needs ≥40% edge confidence and may miss 1px hairlines on very tight regions. Always cross-check the strongest signal by eye on the goal image.
- For very small accent text (e.g. `text-xs` red labels), the goal PNG may compress the colors. Ask the user for a 2–3× zoom export if the sampled hex looks muted vs the perceived design intent.
