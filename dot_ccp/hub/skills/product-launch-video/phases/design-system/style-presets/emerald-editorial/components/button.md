```html
<!-- Primary action element. Editorial buttons read as authoritative pills:
     strict rectangle, ink fill on canvas surfaces, canvas-color text. -->
<button type="button" class="ee-button">{LABEL}</button>

<style>
  .ee-button {
    display: inline-block;
    background: var(--ink);
    color: var(--canvas);
    padding: 18px 38px;
    font-family: "Manrope", sans-serif;
    font-weight: 800;
    font-size: 26px;
    letter-spacing: var(--ee-chrome-tracking);
    text-transform: uppercase;
    border: 0;
    border-radius: var(--ee-radius);
    cursor: pointer;
    white-space: nowrap;
  }
  .ee-button:focus-visible {
    outline: var(--ee-rule);
    outline-offset: 4px;
  }
</style>
```
