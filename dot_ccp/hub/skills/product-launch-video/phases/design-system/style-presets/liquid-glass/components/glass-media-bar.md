```html
<!-- 640×116 horizontal media/now-playing bar. High saturation glass; full-bleed feel. -->
<div id="glass-media" class="glass-panel media-panel liquid-glass"></div>
<div class="text-overlay media-text" style="top: 476px; left: 640px;">
  <div class="album-art" style="background: var(--brand-gradient);"></div>
  <div class="media-info">
    <div class="media-title">{TITLE}</div>
    <div class="media-artist">{SUBTITLE}</div>
  </div>
</div>
<style>
  .media-panel {
    width: 640px;
    height: 116px;
    background: var(--lg-rim-trace);
    /* Notification archetype base, with "punchy" overrides for the now-playing
       register: higher blur/refraction/specular and high-saturation for the
       album-art glow. The other notif-* values still inherit. */
    --lg-blur: 0.42;
    --lg-refraction: 0.92;
    --lg-corner-radius: 44;
    --lg-z-radius: 58;
    --lg-specular: 0.46;
    --lg-fresnel: var(--lg-notif-fresnel);
    --lg-edge-highlight: 0.34;
    --lg-chrom-aberration: var(--lg-widget-chrom-aberration); /* 0.08 — widget's punchier value */
    --lg-saturation: 1.1; /* override: punchy hue lift for album-art glow */
  }
  .media-text {
    width: 640px;
    height: 116px;
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 0 24px;
    text-shadow: var(--text-shadow-glass);
  }
  .album-art {
    width: 78px;
    height: 78px;
    border-radius: 20px;
    flex-shrink: 0;
    box-shadow:
      inset 0 1px 0 var(--lg-rim-lo),
      0 12px 26px var(--lg-base-shadow);
  }
  .media-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--ink-on-glass);
  }
  .media-artist {
    font-size: 24px;
    font-weight: 600;
    color: var(--ink-on-glass-soft);
    margin-top: 2px;
  }
</style>
```
