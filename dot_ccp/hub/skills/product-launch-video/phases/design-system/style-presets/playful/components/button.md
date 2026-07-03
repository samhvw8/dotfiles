```html
<button class="pf-button">{LABEL}</button>

<style>
  /*
    Outlined CTA carrying the signature double-stroke offset border. The ::before
    pseudo-element draws a second 2-3px border offset 8px down-right with no fill —
    the canvas shows through. This IS the system's elevation device; never add
    box-shadow. Background falls to transparent so the warm surface shows
    through; text is ink. Filled variant flips to charcoal ground + peach text.
  */
  .pf-button {
    display: inline-block;
    position: relative;
    background: transparent;
    color: var(--ink);
    border: var(--border-stroke);
    padding: 1rem 2rem;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.02em;
    cursor: pointer;
    transform: rotate(-0.5deg);
  }
  .pf-button::before {
    content: "";
    position: absolute;
    top: var(--offset-ghost-lg);
    left: var(--offset-ghost-lg);
    right: calc(-1 * var(--offset-ghost-lg));
    bottom: calc(-1 * var(--offset-ghost-lg));
    border: var(--border-stroke);
    z-index: -1;
    pointer-events: none;
  }
  /* Filled variant: inverted card, peach text on charcoal. Used as the focal CTA. */
  .pf-button.filled {
    background: var(--ink);
    color: var(--anchor-peach);
    transform: rotate(0.8deg);
  }
</style>
```
