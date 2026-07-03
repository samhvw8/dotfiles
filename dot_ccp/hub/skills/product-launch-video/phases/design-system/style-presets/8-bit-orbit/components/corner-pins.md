```html
<div class="bo-corner-pins">
  <span class="bo-corner-pins-tl"></span>
  <span class="bo-corner-pins-tr"></span>
  <span class="bo-corner-pins-bl"></span>
  <span class="bo-corner-pins-br"></span>
</div>

<style>
  /*
    Two outward-facing L-shapes per corner (4 corners total). Each pin sits
    8px outside the bracketed region. Default border color is brand-primary;
    secondary and accent variants flip the border to the other brand colors.
  */
  .bo-corner-pins {
    position: absolute;
    inset: -8px;
    pointer-events: none;
  }
  .bo-corner-pins > span {
    position: absolute;
    width: 24px;
    height: 24px;
    border: 4px solid var(--brand-primary);
  }
  .bo-corner-pins-tl {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  .bo-corner-pins-tr {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }
  .bo-corner-pins-bl {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }
  .bo-corner-pins-br {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
  .bo-corner-pins.secondary > span {
    border-color: var(--brand-secondary);
  }
  .bo-corner-pins.accent > span {
    border-color: var(--brand-accent);
  }
</style>
```
