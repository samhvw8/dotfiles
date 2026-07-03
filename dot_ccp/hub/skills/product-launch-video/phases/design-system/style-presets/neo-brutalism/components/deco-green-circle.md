```html
<!-- Inline by default; add data-anchor to pin as corner accent. -->
<div class="bn-deco-green-circle"></div>
<style>
  .bn-deco-green-circle {
    display: inline-block;
    width: 68px;
    height: 68px;
    background: var(--deco-2);
    border: var(--border-bold);
    border-radius: 50%;
  }
  .bn-deco-green-circle[data-anchor] {
    position: absolute;
  }
  .bn-deco-green-circle[data-anchor="tl"] {
    top: 60px;
    left: 110px;
  }
  .bn-deco-green-circle[data-anchor="tr"] {
    top: 60px;
    right: 110px;
  }
  .bn-deco-green-circle[data-anchor="bl"] {
    bottom: 60px;
    left: 110px;
  }
  .bn-deco-green-circle[data-anchor="br"] {
    bottom: 60px;
    right: 110px;
  }
</style>
```
