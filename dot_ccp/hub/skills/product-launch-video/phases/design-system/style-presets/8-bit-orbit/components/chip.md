```html
<span class="bo-chip">{LABEL}</span>

<style>
  .bo-chip {
    display: inline-block;
    background: var(--canvas-navy);
    color: var(--brand-secondary);
    padding: 6px 14px;
    font-family: "Space Mono", monospace;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  /* Variants swap text color so the chip stays legible. */
  .bo-chip.primary {
    color: var(--brand-primary);
  }
  .bo-chip.accent {
    color: var(--brand-accent);
  }
</style>
```
