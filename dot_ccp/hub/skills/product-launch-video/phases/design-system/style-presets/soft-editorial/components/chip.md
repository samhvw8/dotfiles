```html
<span class="se-chip">{LABEL}</span>
<style>
  /* Status pill — fully rounded (999px), pastel-filled or translucent white.
     Default fills with brand-primary; flip to brand-secondary / brand-accent /
     translucent for variant statuses. Text stays in ink on every fill —
     soft-editorial never inverts to white on pastel. */
  .se-chip {
    display: inline-block;
    padding: 6px 16px;
    border-radius: var(--radius-pill);
    background: var(--brand-primary);
    color: var(--ink);
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-weight: 500;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.3;
    letter-spacing: 0;
  }
  /* "Note" variant — translucent white with a low-opacity ink hairline,
     for soft annotations that aren't carrying status. Apply with .se-chip-note. */
  .se-chip-note {
    background: var(--surface-card);
    border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
    font-style: italic;
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 400;
    color: color-mix(in srgb, var(--ink) 70%, transparent);
  }
</style>
```
