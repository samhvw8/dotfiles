```html
<div class="ed-stat">
  <div class="ed-stat-num">{NUM}</div>
  <div class="ed-stat-label">{LABEL}</div>
</div>
<style>
  .ed-stat {
    padding: 24px 0;
    border-top: var(--rule-hairline);
  }
  .ed-stat-num {
    font-size: clamp(64px, 9vw, 140px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .ed-stat-label {
    font-size: clamp(24px, 1.6vw, 28px);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-top: 12px;
    color: var(--ink-soft, var(--ink));
  }
</style>
```
