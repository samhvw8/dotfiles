```html
<div class="bn-frame">
  <span class="bn-corner bn-tl"></span>
  <span class="bn-corner bn-tr"></span>
  <span class="bn-corner bn-bl"></span>
  <span class="bn-corner bn-br"></span>
  <!-- content goes here -->
</div>
<style>
  .bn-frame {
    position: relative;
    padding: 32px;
  }
  .bn-corner {
    position: absolute;
    width: 24px;
    height: 24px;
    background: var(--ink);
  }
  .bn-tl {
    top: 0;
    left: 0;
  }
  .bn-tr {
    top: 0;
    right: 0;
  }
  .bn-bl {
    bottom: 0;
    left: 0;
  }
  .bn-br {
    bottom: 0;
    right: 0;
  }
</style>
```
