```html
<!--
  640×76 horizontal slider panel. Use for: progress / volume / scrub / any
  single-value continuous control. The fill (.slider-fill width) is the
  scene-worker's animated property — tween it from 0% to N% over the scene
  with `EASE.emphasis` (power3.inOut) for a viscous fill.

  Pair the panel with a .slider-text overlay carrying an optional leading
  icon, the track, and the percentage readout. Icon is plain SVG (white at
  88% opacity) — never a colored brand glyph; the slider sits in chrome.
-->
<div id="glass-slider" class="glass-panel slider-panel liquid-glass"></div>
<div class="text-overlay slider-text" style="top: 616px; left: 640px;">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 12h12M15 8l4 4-4 4" />
  </svg>
  <div class="slider-track"><div class="slider-fill" style="width: 34%;"></div></div>
  <span class="slider-pct">{LABEL}</span>
</div>
<style>
  .slider-panel {
    width: 640px;
    height: 76px;
    /* Notification archetype (640px wide, needs cast shadow), corner override
       for the tighter slider rail. */
    --lg-blur: var(--lg-notif-blur);
    --lg-refraction: var(--lg-notif-refraction);
    --lg-corner-radius: 28; /* override: tighter than the 36 notif default */
    --lg-z-radius: var(--lg-notif-z-radius);
    --lg-specular: var(--lg-notif-specular);
    --lg-fresnel: var(--lg-notif-fresnel);
    --lg-edge-highlight: var(--lg-notif-edge-highlight);
    --lg-chrom-aberration: var(--lg-notif-chrom-aberration);
    --lg-saturation: var(--lg-notif-saturation);
    --lg-shadow-opacity: var(--lg-notif-shadow-opacity);
    --lg-shadow-spread: var(--lg-notif-shadow-spread);
    --lg-shadow-offset-y: var(--lg-notif-shadow-offset-y);
  }
  .slider-text {
    width: 640px;
    height: 76px;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 0 28px;
  }
  .slider-text svg {
    width: 26px;
    height: 26px;
    stroke: var(--lg-glint-glow);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex-shrink: 0;
  }
  .slider-track {
    flex: 1;
    height: 8px;
    background: var(--lg-rim-track);
    border-radius: 4px;
    position: relative;
  }
  .slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--lg-glint-white);
    border-radius: 3px;
    box-shadow: 0 0 14px var(--lg-glint-halo);
  }
  .slider-pct {
    font-size: 24px;
    font-weight: 600;
    color: var(--ink-on-glass);
    font-variant-numeric: tabular-nums;
    width: 64px;
    text-align: right;
    text-shadow: var(--text-shadow-glass);
  }
</style>
```
