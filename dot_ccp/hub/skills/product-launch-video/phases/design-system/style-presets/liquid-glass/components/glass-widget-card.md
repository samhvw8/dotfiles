```html
<!-- 220×220 stat card. Use up to 3 in a row. Pair each with a .stat-text overlay. -->
<div id="glass-stat1" class="glass-panel widget-card liquid-glass"></div>
<div class="text-overlay stat-text" style="top: 300px; left: 200px;">
  <span class="stat-label">{LABEL}</span>
  <span class="stat-value">{NUM}</span>
</div>
<style>
  .widget-card {
    width: 220px;
    height: 220px;
    /* Widget archetype — see preset.md §B for tuning. */
    --lg-blur: var(--lg-widget-blur);
    --lg-refraction: var(--lg-widget-refraction);
    --lg-corner-radius: var(--lg-widget-corner-radius);
    --lg-z-radius: var(--lg-widget-z-radius);
    --lg-specular: var(--lg-widget-specular);
    --lg-fresnel: var(--lg-widget-fresnel);
    --lg-edge-highlight: var(--lg-widget-edge-highlight);
    --lg-chrom-aberration: var(--lg-widget-chrom-aberration);
    --lg-saturation: var(--lg-widget-saturation);
    --lg-shadow-opacity: 0;
  }
  .stat-text {
    width: 220px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 22px;
    border-radius: 28px;
    background:
      linear-gradient(150deg, var(--lg-rim-lo), var(--lg-rim-veil) 46%, var(--lg-rim-faint)),
      linear-gradient(180deg, var(--lg-base-veil), var(--lg-rim-dust));
    border: 1px solid var(--lg-rim-mid);
    box-shadow:
      inset 0 1px 0 var(--lg-rim-hi),
      inset 0 -18px 38px var(--lg-rim-mist);
    overflow: hidden;
    text-shadow: var(--text-shadow-glass);
  }
  .stat-label {
    font-size: 24px;
    font-weight: 650;
    color: var(--ink-on-glass);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  .stat-value {
    font-size: 56px;
    font-weight: 700;
    color: var(--ink-on-glass);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
</style>
```
