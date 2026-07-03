```html
<span class="pf-chip">{LABEL}</span>

<style>
  /*
    Eyebrow / section label. Space Grotesk 600 in UPPERCASE with 0.15em tracking.
    No background, no border — the chip reads as a label, not a button. For
    a colored pill use tag-pill (charcoal background, peach text) instead.
  */
  .pf-chip {
    display: inline-block;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink);
    opacity: 0.7;
  }
  /* Solid variant: charcoal text on inverted contexts (filled-block scenes). */
  .pf-chip.invert {
    color: var(--canvas);
    opacity: 0.85;
  }
</style>
```
