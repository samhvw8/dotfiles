# frontend-audit

A Claude Code skill that checks your live website matches your design mockups, and fixes the CSS until it does.

You give it design screenshots, it tells your code to match them — pixel by pixel, property by property.

---

## How to use it (the simple version)

### Step 1 — Install the skill

Open a terminal and run:

```bash
git clone https://github.com/colbymchenry/frontend-audit-skill.git ~/.claude/skills/frontend-audit
```

Note the target directory name is `frontend-audit` (without the `-skill` suffix). This matches the skill's internal name so Claude Code can find it.

That's it. The skill is now available in every Claude Code session, in every project.

### Step 2 — Drop your designs into a folder

In your project, make a folder called `design/`. Put screenshots of your designs in it. **Give each one a clear name** that describes what page or section it represents:

```
your-project/
├── design/
│   ├── home-page.png
│   ├── checkout-cart.png
│   ├── profile-settings.png
│   ├── dashboard-overview.png
│   └── pricing.png
└── (rest of your code)
```

**Subfolders are fine** if you want a bit of organization — name them however your project's surfaces are structured (`pages/`, `components/`, `flows/`, anything you like). The audit walks `design/` recursively:

```
your-project/
├── design/
│   ├── pages/
│   │   ├── home.png
│   │   └── account/
│   │       └── profile.png
│   └── components/
│       └── membership-card.png
└── (rest of your code)
```

Whether you go flat or nested is up to you — there's no enforced structure. For projects with a handful of PNGs the flat layout is faster to scan; nest once you've got a dozen or more.

**PNG is strongly preferred** because it's lossless — the audit measures pixel colors exactly. JPEG works too (`.jpg` / `.jpeg`), but JPEG's compression introduces tiny color shifts around edges that can trip a few false-positive results in the cluster sampler. If you have a choice, export as PNG.

Tip: Export these from Figma, Photoshop, or whatever design tool you use. They should be the SAME size and layout as what you want the real page to look like.

### Step 3 — Start your website running locally

However you normally run your project locally — `npm run dev`, `bun run dev`, `yarn start`, etc. — start it. Take note of the URL (usually `http://localhost:3000`).

### Step 4 — Run the audit

In Claude Code, just type:

```
/frontend-audit
```

The first time you run it, Claude handles everything:

- Asks 3 short questions (dev server URL, design folder location, "install everything now?")
- Installs the JS dependencies (Playwright, pngjs, headless Chromium) into your project
- Checks whether Python 3.10+ is on your system — if not, offers to install it for you (Homebrew on macOS, apt on Linux, or a link to the installer on Windows)
- Sets up the ML region detector (OmniParser) with its model weights — ~3GB, one-time
- Saves your config so this never has to happen again

After that first setup, Claude:

1. Looks at every PNG in your `design/` folder
2. Opens your live website in a hidden browser
3. Compares each design to the matching live page
4. Tells you EXACTLY what's different — wrong colors, missing borders, incorrect spacing, etc.
5. Fixes the CSS for you, one issue at a time
6. Re-checks until your live site matches the designs

You're done when Claude tells you the audit passed.

The whole point: **you type `/frontend-audit` and nothing else.** No bash commands, no package manager incantations, no Python version juggling.

### What "passing" means

The audit isn't an opinion — it's measurements. It checks things like:

- Are the corner roundings the same?
- Are the colors the exact same hex?
- Are the borders present and the right color?
- Are the right elements in the right places?

If any of those don't match, the audit fails until they do.

---

## Frequently asked questions

**Q: Do I need to know how to code?**
No. You drop PNGs in a folder, you run `/frontend-audit`, Claude does the rest. You only need to know how to start your project locally and how to take screenshots of your designs.

**Q: Do I need a Figma plugin or special export?**
No. Any PNG file works — a screenshot of a design tool, an image from a designer, a mockup someone made. Just make sure the PNG looks the way you want your website to look.

**Q: What if I have 20 different pages?**
Drop 20 PNGs. Name them clearly. Claude audits them one at a time.

**Q: What if my designs aren't perfectly to scale?**
That's fine. The audit cares about colors, borders, and shapes — not exact pixel sizes. As long as the design represents what you want the page to look like, it works.

**Q: Will it edit my code?**
Yes — that's the point. Claude reads the failure messages and edits your CSS/Tailwind/components to match the design. You can review each change before accepting it.

**Q: My audit keeps failing. What do I do?**
Read what Claude tells you. The failures are named: "the card corners are 16/16/3/3 but the design wants 16/16/16/16," or "the row is missing a darker leading column." Tell Claude to fix what it found.

---

## For engineers who want the technical details

Everything below this line is for developers who want to understand or extend how the skill works. You don't need any of it to use the skill.

### Architecture

```
goal.png    ──┐                                ┌──> per-region fill check (Δ ≤ 16)
              ├─> pixel sampling (cluster sig) ├──> per-region compound-bg check
              │   region rect on goal          ├──> per-region radius check (Δ ≤ 4)
live URL ─────┤                                ├──> per-region border presence + color
              ├─> Playwright locator           ├──> per-region edge-IoU (≥ 0.4)
              │   computed styles              │
              │                                ├──> global edge-blob match (missing/extra)
current.png ──┤                                └──> global grid luminance diff (drift sweep)
              └─> pixel sampling
                  (cluster sig + edges)
```

The gate is a four-input convergence: goal PNG, current PNG snap, live computed styles via Playwright, and authored region geometry. Each input covers what the others can't — and the gate fails when any single check disagrees.

### Why measurements beat eyeballing

| Failure mode | Eye | `audit.mjs` |
|---|---|---|
| Wrong corner radius (`16/16/3/3` vs `16/16/16/16`) | Easy to miss | `radius Δ tl=0 tr=0 bl=13 br=13` |
| Hairline border missing in render | Easy to miss | `border presence mismatch (goal=yes, cur=no)` |
| Row's two-tone bg collapsed into one | Easy to miss | `compound bg missing sub-region(s): 25% #f4f0ec` |
| Hex-level fill mismatch (`#e0d4c0` vs `#dac7af`) | Hard to judge at thumb scale | `fill Δ23 > 16 (goal #e0d4c0, cur #dac7af)` |
| Structural drift inside a region | Reads as "looks fine" | `edge-iou 0.22 < 0.4` + `edge-diff-<region>.png` |
| Missing section (badge / divider / banner) | Easy to miss in noisy diff | `Missing blobs ≥1500px²: 1  bbox=(52,1194, 1166×5)` |

### Scripts (all standalone CLIs)

| Script | Role |
|---|---|
| `audit.mjs` | The gate. Compares goal vs current at each region; exits 0 only on full pass. Run this last. |
| `bootstrap-regions.mjs` | Auto-author a `<name>.regions.json` from the goal PNG. Two modes: `--programmatic` (Sobel + connected components, no deps) and OmniParser default (ML, ~3GB venv, semantic labels). Auto-emits sub-regions where internal seams are detected. |
| `bind-selectors.mjs` | Walks each region with a CSS selector and rewrites it with a stable Playwright `locator` (data-testid → role+name → text → class-free CSS path). Run after bootstrap, before audit. |
| `snap.mjs` | Headless-Chromium screenshot of a selector with optional `--goal=<png>` flag that auto-generates four side-by-side diff PNGs (full + three band zooms). |
| `discover.mjs` | Inventories design/*.png and tracks which PNGs have stale or missing regions files via SHA-256 hashing. |
| `inspect-shape.mjs` | Reads radius / border / shadow / bg-mode from the goal PNG by pixel analysis. Useful for setting `expect` values. |
| `sample-colors.mjs` | Histogram-cluster colors per region in the goal PNG with `--debug` crops. |
| `check.mjs` | `getComputedStyle()` dump for any CSS selector on the live page. |
| `analyze.mjs` | Diagnostic-only structural analyzer: edge maps, blob overlay, grid luminance heatmap PNGs. |
| `diff.mjs` | Side-by-side goal/current PNG generator. |

### The locator philosophy

Class names are an implementation detail. They change during normal refactors (someone renames a Tailwind class), get mangled by framework-scoped styles (Svelte's `svelte-abc123` suffix), or are hash-only by design (CSS Modules, styled-components). A class-based selector is dead on arrival in any of those settings.

What's stable across frameworks AND across refactors is **semantics**: ARIA roles, accessible names, `data-testid` attributes, visible text content. `bind-selectors.mjs` extracts those from the live DOM and writes them into your regions file in priority order:

```json
"ship-now-btn": {
  "x": 0.255, "y": 0.395, "w": 0.1, "h": 0.05,
  "locator": { "role": "button", "name": "Ship now" }
}
```

The audit resolves locators via Playwright's locator engine (`page.getByRole`, `page.getByText`, `page.getByTestId`). When a refactor renames a class, the locator still resolves.

### The regions file

Per-PNG sidecar living alongside the image (`design/<name>.regions.json`, or `design/<subdir>/<name>.regions.json` when the PNG is nested — `discover.mjs` walks `design/` recursively and skips `_debug/` plus dot-prefixed dirs):

```json
{
  "_meta": {
    "sourceImage": "coffee-page.png",
    "sourceHash": "sha256-…",
    "generatedAt": "2026-05-12T…"
  },
  "page-bg": { "x": 0.02, "y": 0.02, "w": 0.02, "h": 0.02 },
  "ship-now-btn": {
    "x": 0.08, "y": 0.41, "w": 0.10, "h": 0.04,
    "locator": { "role": "button", "name": "Ship now" },
    "expect": {
      "radius": 8,
      "border": false,
      "fill": "#d11212"
    }
  }
}
```

Coordinates are fractional (0..1) relative to the goal PNG. `expect` overrides what the audit measures on the goal side. `locator` describes how to find the element on the live page.

### Configuration

`.frontend-audit.json` at the project root:

```json
{
  "devUrl": "http://localhost:3000",
  "designDir": "design"
}
```

Override `DEV_URL` in the environment to point scripts at a different server temporarily.

### Troubleshooting

**`GATE BLOCKED — N ERROR (unresolved binding)`** — The DOM changed since the regions file was authored. Re-run `bind-selectors.mjs`.

**Regions all marked `SKIP`** — The current snap was element-cropped but the goal PNG is full-page. The fractional coords don't translate. Snap the same framing as the goal.

**`edge-iou X.XX < 0.4`** — Open `design/_debug/edge-diff-<region>.png`. Red = goal edges, blue = current edges, purple = overlap. Look for missing structural edges.

**`compound bg missing sub-region(s): N% #xxxxxx`** — The goal has a multi-bg layout (e.g. a row with a leading badge column in a different color) that the current render is missing.

**Stale regions after replacing a goal PNG** — `discover.mjs` reports `stale`. Re-author with `bootstrap-regions.mjs --force`, then re-bind.

### Limitations

- Element-cropped snaps + full-page goal mocks: fractional coords don't translate. Only regions with locators stay covered.
- Goal mocks with strong JPEG compression: pixel-cluster sampling can pick up edge-anti-aliasing as a distinct cluster. Use `expect.fill` to override.
- No mobile / responsive snaps: viewport is fixed (`--viewport=WxH`, default 1600×1200).

### Standalone usage

The scripts are standalone Node CLIs — you don't need Claude Code to use this. The skill packaging just makes them assistant-discoverable. If you're integrating into CI, run `audit.mjs` directly and check exit code.
