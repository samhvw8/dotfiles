```html
<div class="bn-stat">
  <div class="bn-stat-num">{NUM}</div>
  <div class="bn-stat-label">{LABEL}</div>
</div>
<style>
  .bn-stat {
    background: var(--canvas);
    border: var(--border-bold);
    padding: 32px 24px;
    text-align: left;
  }
  .bn-stat-num {
    font-size: clamp(96px, 12vw, 180px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .bn-stat-label {
    font-size: clamp(24px, 1.5vw, 28px);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-top: 12px;
  }
</style>
```
