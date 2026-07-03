```html
<!-- Mark/category pill: strict rectangle, ink fill, canvas-color text.
     Used as a category mark, section tag, or bottom-margin label. -->
<span class="ee-chip">{LABEL}</span>

<style>
  .ee-chip {
    display: inline-block;
    background: var(--ink);
    color: var(--canvas);
    padding: var(--ee-pad-pill-y) var(--ee-pad-pill-x);
    font-family: "Manrope", sans-serif;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: var(--ee-chrome-tracking);
    text-transform: uppercase;
    border-radius: var(--ee-radius);
    white-space: nowrap;
  }
</style>
```
