```html
<div class="se-stat">
  <div class="se-stat-num">{NUM}</div>
  <div class="se-stat-label">{LABEL}</div>
</div>
<style>
  /* Pastel-filled stat card with a Cormorant Garamond display numeral.
     Defaults to brand-primary fill; swap to brand-secondary / brand-accent for
     variety across a stat-grid scene. Text (numeral + label) stays in ink —
     soft-editorial never inverts on pastel. The italic <em> drop applies to
     the numeral fragment, e.g. "<em>4</em>M". */
  .se-stat {
    background: var(--brand-primary);
    border-radius: var(--radius-card-lg);
    padding: 42px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
    min-height: 280px;
  }
  .se-stat-num {
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: clamp(96px, 13vw, 200px);
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }
  .se-stat-num em {
    font-weight: 400;
    font-style: italic;
  }
  .se-stat-label {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.4;
    color: var(--ink);
    max-width: 28ch;
  }
</style>
```
