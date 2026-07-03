```html
<div class="bo-stat-block">
  <span class="bo-stat-block-bracket-tl"></span>
  <span class="bo-stat-block-bracket-br"></span>
  <div class="bo-stat-block-num">{NUM}</div>
  <div class="bo-stat-block-label">{LABEL}</div>
</div>

<style>
  /*
    Brand-primary-tinted glass stat tile with L-bracket accents at opposite
    corners. Used on dark surfaces. The stat numeral gets a small pixel-text-shadow.
  */
  .bo-stat-block {
    position: relative;
    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
    border: 2px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
    padding: 32px 16px;
    text-align: center;
  }
  .bo-stat-block-bracket-tl,
  .bo-stat-block-bracket-br {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 4px solid var(--brand-primary);
  }
  .bo-stat-block-bracket-tl {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  .bo-stat-block-bracket-br {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
  .bo-stat-block-num {
    font-family: "Tektur", cursive;
    font-weight: 900;
    font-size: clamp(32px, 4vw, 56px);
    line-height: 1;
    color: var(--brand-primary);
    text-shadow: 3px 3px 0 var(--canvas-navy);
  }
  .bo-stat-block-label {
    font-family: "Space Mono", monospace;
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink);
    opacity: 0.85;
    margin-top: 12px;
  }
</style>
```
