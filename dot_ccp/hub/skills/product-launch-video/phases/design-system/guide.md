# Design System (Phase 1b)

Compose `design.html` + split it into `chunks/`. This is a two-step deterministic script flow (site DNA reads Phase 1 `capture/` directly). The agent has two decision points: **preset selection** (required, §3) and **brand color adjudication** (only when `inference.json.brand.needs_review=true`, §3b — inspect the screenshot and choose from the candidates).

## 1. Command Template

```bash
mkdir -p design-system

# Step 1 - use the already generated inference.json
#          (Phase 1 capture already deterministically ran --no-emit).
#          Normally the orchestrator has inlined the inference.json body into
#          the dispatch `## Inference decision inputs`, so you do not need to
#          Read it or rerun the command below. Only Read/rerun when dispatch did
#          not inline it, inference.json is missing, or capability auto-install
#          requires candidate revalidation.
#          build-design.mjs defaults to reading <design-system-dir>/../capture/,
#          aligned with Phase 1 hyperframes capture output.
node <SKILL_DIR>/phases/design-system/scripts/build-design.mjs ./design-system --no-emit

# Step 2  - preset decision (§3)
# Step 2b - brand color adjudication (§3b): only when inference.json.brand.needs_review=true

# Step 3 - write design.html with the chosen preset
#          (if adjudicated, add --brand-primary <hex>)
node <SKILL_DIR>/phases/design-system/scripts/build-design.mjs ./design-system --style <chosen> [--brand-primary <hex>]

# Step 4 - split into chunks/
node <SKILL_DIR>/phases/design-system/scripts/emit-chunks.mjs ./design-system
```

> **Captions (automatic, no judgment needed):** if the selected preset has `style-presets/<preset>/caption-skin.html`, `build-design` embeds it into design.html as **§C live preview** (looping), and `emit-chunks` copies it to `chunks/caption-skin.html` (also recording it in `index.json.caption_skin_file`). Step 5.5 `captions.mjs html` then prefers it; otherwise it falls back to registry skins. The agent makes no decision here.

Optional flags:

- `build-design --capture <dir>` - override the default `<design-system-dir>/../capture/` path
- `build-design --out-scores <file>` - change where `inference.json` is written (default `<dir>/inference.json`)
- `build-design --brand-primary <hex>` - override the automatically inferred brand primary color (used after the agent adjudicates from screenshot; see §3b). The hex must come from `inference.json.brand.candidates[]`

## 2. `inference.json` Fields (agent reads these)

```jsonc
{
  "confidence": "high" | "medium" | "low" | "forced",
  "brand": {                      // automatically inferred brand color (for §3b adjudication)
    "primary": "#XXXXXX",
    "secondary": "#XXXXXX",
    "accent": "#XXXXXX",
    "source": "signals" | "agent-override" | "legacy",
    "confidence": "high" | "medium" | "low" | "agent-override" | "legacy",
    "needs_review": true | false, // true = automatic choice is uncertain; agent must inspect screenshot
    "screenshot": "capture/screenshots/scroll-0.png", // relative to PROJECT_DIR
    "candidates": [               // descending by score; --brand-primary must choose from here
      { "hex": "#XXXXXX", "score": 0.X, "bgCount": N, "interactiveBg": N, "on_button": true }
    ]
  },
  "baseline_winner": { "name": "...", "combined": 0.XX },
  "top_candidates": [           // capability-satisfied candidates, descending by combined
    {
      "name": "...",
      "combined": 0.XX,
      "delta_from_winner": 0.XX,
      "matched_signals": [...],
      "best_for": [...],
      "avoid_for": [...],
      "sectionA_excerpt": "..."
    }
  ],
  "site_dna": {
    "material": "flat|paper|glass|...",
    "imagery": "photography|flat-illustration|...",
    "page_intent": "landing|pricing|blog|...",
    "section_role_counts": { "feature-grid": N, ... },
    "voice_tone": "neutral|warm|formal|...",
    "voice_heading_style": "Title Case|UPPERCASE|...",
    "voice_heading_length": "tight|loose"
  },
  "capability_gated_presets": [ // scored 0 because runtime/env capability is missing; can return to top_candidates after capability is installed
    {
      "name": "liquid-glass",
      "combined_pre_capability": 0.42,
      "capabilities_missing": [
        {
          "kind": "block_installed",
          "auto_install": "npx hyperframes add liquid-glass-widgets" // agent may run when non-null
        },
        {
          "kind": "env_var_set",
          "var": "PRODUCER_HEADLESS_SHELL_PATH",
          "auto_install": null // null = cannot be auto-installed
        }
      ]
    }
  ]
}
```

## 3. Decision Rules (Step 2)

Decide by `confidence`:

| confidence       | Action                                 |
| ---------------- | -------------------------------------- |
| `high`           | Run Step 3 with `baseline_winner.name` |
| `medium` / `low` | Enter the override criteria below      |
| `forced`         | `--style` was passed; skip review      |

**Override criteria** (in priority order):

1. **Avoid pitfalls:** if any preset in `top_candidates` has `avoid_for` matching `site_dna` keywords, remove it from consideration.
2. **best_for match:** from the remaining candidates, choose the preset whose `best_for` overlaps the most with `site_dna` keywords.
3. **capability_gated preference:** if a gated preset's `combined_pre_capability` would place it in the top 3 and `site_dna` clearly fits it (typical `material: "glass"` -> liquid-glass), handle `capabilities_missing[]`:
   - `auto_install` non-null -> run that command -> rerun `build-design.mjs --no-emit` to verify it entered `top_candidates` -> select it with `--style`
   - `auto_install: null` -> include in anomaly report and **choose a different preset**
4. **No clear winner** -> keep `baseline_winner`

**Forbidden:** the choice must come from `top_candidates[]` or `capability_gated_presets[]`; do not invent a new name.

## 3b. Brand Color Adjudication (Step 2b - only when `brand.needs_review=true`)

`brand.primary` defaults to a deterministic signal-scored choice (the color used for interactive / repeated fills), and works directly for most sites.
However, for **multicolor brands** and sites where the **brand color is hidden inside a large color block/logo**, CSS statistics cannot distinguish "brand hero" from "section ground". In those cases `needs_review=true`, and you **must inspect the screenshot to adjudicate**:

1. Use Read to open `brand.screenshot` (first viewport screenshot).
2. Compare against `brand.candidates[]`: determine which candidate hex is the **true brand color**, excluding these false positives:
   - background color of the top announcement bar / banner (thin horizontal strip = ground color, not brand)
   - background color of a large section panel / card container (large color block = ground color)
   - pale section background colors (light wash = ground color)
   - brand color usually appears in: **logo, primary CTA button, emphasis elements** (`on_button:true` is a strong signal)
3. After choosing -> rerun Step 3 with `--brand-primary <chosen hex>` (hex **must** be one of the `candidates[].hex` values).
4. If the true brand color visible in the screenshot is **not in** `candidates[]` (typical: brand color only appears in logo SVG, e.g. reddit/gitlab orange) ->
   no valid candidate can be chosen -> record this in anomaly report, keep the automatically selected primary, and do not force an override.

When `needs_review=false` (`confidence=high`), **skip this step** and use `brand.primary` directly.

## 4. Report Template

```
preset review:
  baseline: <name> (combined=<X>, confidence=<...>)
  chosen:   <name>
  reason:   <one sentence citing concrete site_dna / best_for / avoid_for keywords>
  alternates_considered: [<name1>, <name2>]
  capability_actions: [<installed block / missing env var>]  # write none if no action
brand review:
  primary: <hex> (source=<signals|agent-override|legacy>, confidence=<...>)
  reviewed: <yes inspected screenshot and chose X / no automatic high-confidence choice / n/a true brand color not in candidates>
```

Also paste the two stdout sections from build-design and emit-chunks verbatim.

## 5. Hard Contracts

- **`chunks/` and `design.html` must share the same source** - after rerunning Step 3, rerun Step 4, otherwise downstream reads stale chunks.
- **Read scope:** `./design-system/inference.json` + `./design-system/design.html` when verifying the composed result + **`brand.screenshot` (screenshot) when adjudicating brand color**. **Do not read raw JSON under capture extracted/** - `inference.json` already summarizes the key signals as `site_dna`.
- **Do not design palette / typography / fonts / decoration yourself** - build-design writes all of it. Brand color adjudication is only **choosing from `candidates[]`** (`--brand-primary`), not inventing a hex.
- `--style` is a deliberate override; the agent must satisfy capability before running it. In forced mode, build-design no longer gates.

## 6. Troubleshooting

| Symptom                                    | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Captured non-English hero                  | Rerun Phase 1 capture                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Captured blank hero / placeholder text     | Rerun capture with `--timeout 60000`; or check whether capture/BLOCKED.md reports anti-bot protection                                                                                                                                                                                                                                                                                                                                                   |
| Step 4 reports missing anchors             | Rerun Step 3 and confirm design.html contains ROOT-START / MOTION-START / VOICE-START / COMPONENT comments; do not fix emit-chunks                                                                                                                                                                                                                                                                                                                      |
| `chunks/index.json` missing `components[]` | Check build-design stdout `components: N paste-ready`; N=0 is acceptable (downstream degrades to tokens + easings)                                                                                                                                                                                                                                                                                                                                      |
| Inferred brand primary is wrong            | build-design scores brand color from capture `colorStats` signals (the color most often used for interactive/repeated fills = primary; see script comments). Usually this is accurate. If still wrong: 1. brand color appears only in logo SVG -> capture cannot catch it as a fill color yet; 2. multicolor brands have ambiguous primary. In both cases, you may force the preset with `--style`; brand color falls back through design.html handling |
