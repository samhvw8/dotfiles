```html
<!-- "button" maps to the s2 featured marker block — a hard-offset CTA slab.
     The :after pseudo paints the orange hard-shadow registration layer. -->
<div class="cm-button">{LABEL}</div>

<style>
  .cm-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--brand-secondary);
    color: var(--ink);
    border: var(--border-structural);
    padding: 1.55vw 2.4vw;
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 2.4vw;
    letter-spacing: var(--display-track);
    text-transform: uppercase;
    line-height: 1;
    isolation: isolate;
  }
  .cm-button::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translate(1.25vw, 1.25vw);
    background: var(--brand-accent);
    border: var(--border-structural);
    z-index: -1;
  }
</style>
```
