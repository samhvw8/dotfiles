```html
<div class="dc-stat">
  <div class="dc-stat-num">{NUM}</div>
  <div class="dc-stat-label">{LABEL}</div>
</div>

<style>
  .dc-stat {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: var(--pad-card-md);
    background: var(--canvas);
    border: var(--border-bold);
    border-radius: var(--radius-card-lg);
    box-shadow: var(--shadow-card);
    text-align: center;
    min-width: 14vw;
  }
  .dc-stat-num {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(3rem, 5.5vw, 5rem);
    line-height: 1;
    color: var(--brand-accent);
    text-shadow: var(--shadow-text-bold);
    margin-bottom: 0.4rem;
  }
  .dc-stat-label {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(24px, 1.6vw, 28px);
    color: color-mix(in srgb, var(--ink) 70%, transparent);
    letter-spacing: 0.02em;
  }
</style>
```
