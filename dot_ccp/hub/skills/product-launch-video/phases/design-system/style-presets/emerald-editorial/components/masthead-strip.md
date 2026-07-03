```html
<!-- Magazine masthead/footline strip — two uppercase Manrope strings on
     opposite sides. Place this absolutely at top: 56px / bottom: 56px,
     side inset 80px when used as scene chrome on cover and closing scenes. -->
<div class="ee-masthead-strip">
  <span class="ee-masthead-strip-l">{LEFT}</span>
  <span class="ee-masthead-strip-r">{RIGHT}</span>
</div>

<style>
  .ee-masthead-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-family: "Manrope", sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: var(--ee-chrome-tracking-tight);
    text-transform: uppercase;
    color: var(--ink);
    white-space: nowrap;
  }
</style>
```
