```html
<button class="rz-button">{LABEL}</button>

<style>
  /*
    Bebas Neue tracked uppercase CTA. Default is brand-primary fill + cream
    text. The `.outline` variant is an ink-bordered button on the khaki
    canvas; the `.ink` variant inverts to an ink ground with khaki text for
    use on cream / brand-primary surfaces.
    No border-radius — every shape in the system is a strict rectangle.
  */
  .rz-button {
    display: inline-block;
    background: var(--brand-primary);
    color: var(--anchor-cream);
    padding: 14px 28px;
    border: var(--border-thick);
    border-color: var(--ink);
    cursor: pointer;
    font-family: "Bebas Neue", sans-serif;
    font-size: 26px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    line-height: 1;
    border-radius: 0;
  }
  .rz-button.outline {
    background: transparent;
    color: var(--ink);
  }
  .rz-button.ink {
    background: var(--ink);
    color: var(--anchor-paper);
    border-color: var(--ink);
  }
</style>
```
