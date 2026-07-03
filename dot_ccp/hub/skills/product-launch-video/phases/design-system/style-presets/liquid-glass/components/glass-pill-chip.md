```html
<!-- 210×56 status pill. Stack 3-5 in a row for "system state" beats. -->
<div id="glass-pill1" class="glass-panel pill-chip liquid-glass"></div>
<div class="text-overlay pill-text" style="top: 720px; left: 300px;">
  <span class="pill-dot" style="background: var(--brand-accent);"></span>
  <span class="pill-label">{LABEL}</span>
</div>
<style>
  .pill-chip {
    width: 210px;
    height: 56px;
    /* Widget archetype, pill-shape override on corner-radius. */
    --lg-blur: var(--lg-widget-blur);
    --lg-refraction: var(--lg-widget-refraction);
    --lg-corner-radius: 40; /* override: pill shape, not the 28px widget default */
    --lg-z-radius: var(--lg-widget-z-radius);
    --lg-specular: var(--lg-widget-specular);
    --lg-fresnel: var(--lg-widget-fresnel);
    --lg-edge-highlight: var(--lg-widget-edge-highlight);
    --lg-saturation: var(--lg-widget-saturation);
  }
  .pill-text {
    width: 210px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 40px;
    background: linear-gradient(130deg, var(--lg-rim-lo), var(--lg-rim-ghost));
    border: 1px solid var(--lg-rim-mid-soft);
    box-shadow: inset 0 1px 0 var(--lg-rim-hi-soft);
  }
  .pill-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .pill-label {
    font-size: 24px;
    font-weight: 600;
    color: var(--ink-on-glass);
  }
</style>
```
