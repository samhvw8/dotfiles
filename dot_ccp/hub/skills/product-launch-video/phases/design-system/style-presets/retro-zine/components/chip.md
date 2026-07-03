```html
<span class="rz-chip">{LABEL}</span>

<style>
  /*
    Tracked Bebas Neue eyebrow / category label, color = brand-primary (green
    role). Default is text-only — chips are typographic in this system, no
    pill border. The `.solid` variant fills with brand-accent for ledger row
    category tagging.
  */
  .rz-chip {
    display: inline-block;
    font-family: "Bebas Neue", sans-serif;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--brand-primary);
  }
  /* Solid variant — categorical tag inside a ledger row. */
  .rz-chip.solid {
    padding: 4px 10px;
    background: var(--brand-accent);
    color: var(--anchor-cream);
    letter-spacing: 0.06em;
    font-size: 24px;
  }
  .rz-chip.solid.primary {
    background: var(--brand-primary);
  }
  .rz-chip.solid.secondary {
    background: var(--brand-secondary);
  }
</style>
```
