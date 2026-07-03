```html
<div class="bo-bar-group">
  <span class="bo-bar-value">{NUM}</span>
  <div class="bo-bar-vertical" style="height: 78%;"></div>
  <span class="bo-bar-label">{LABEL}</span>
</div>

<style>
  /*
    Vertical chart bar with the signature three-piece navy L-shadow.
    Default fill is var(--brand-primary). Variants .secondary / .accent
    cycle the fill through the other two brand colors. The value pill
    (Tektur, brand-secondary) sits above; the label (Space Mono, navy
    on light surfaces / white on dark) sits below.

    Inline `style="height: NN%"` is how scene workers parametrize each bar.
    Tween the height from 0% on scene-in with EASE.entry. Never tween width.
  */
  .bo-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 64px;
  }
  .bo-bar-vertical {
    width: 100%;
    background: var(--brand-primary);
    box-shadow: var(--shadow-pixel-l);
    position: relative;
  }
  .bo-bar-vertical.secondary {
    background: var(--brand-secondary);
  }
  .bo-bar-vertical.accent {
    background: var(--brand-accent);
  }
  .bo-bar-value {
    font-family: "Tektur", sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--brand-secondary);
    letter-spacing: 0.02em;
  }
  .bo-bar-label {
    font-family: "Space Mono", monospace;
    font-size: 24px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--canvas-navy);
    text-align: center;
  }
  .bo-bar-vertical.on-dark + .bo-bar-label,
  .on-dark .bo-bar-label {
    color: var(--brand-primary);
  }
</style>
```
