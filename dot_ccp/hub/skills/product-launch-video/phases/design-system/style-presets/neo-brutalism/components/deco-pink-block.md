```html
<!-- Default (no data-anchor): renders inline; preview-friendly.
     With data-anchor="tl|tr|bl|br": becomes absolute-positioned sticker.
     Drop into any container with position: relative when using anchor. -->
<div class="bn-deco-pink-block"></div>
<style>
  .bn-deco-pink-block {
    width: 110px;
    height: 110px;
    background: var(--deco-4);
    border: var(--border-bold);
    box-shadow: 4px 4px 0 var(--ink);
    transform: rotate(11deg);
    display: inline-block;
  }
  .bn-deco-pink-block[data-anchor] {
    position: absolute;
  }
  .bn-deco-pink-block[data-anchor="tl"] {
    top: -34px;
    left: 80px;
  }
  .bn-deco-pink-block[data-anchor="tr"] {
    top: -34px;
    right: 80px;
  }
  .bn-deco-pink-block[data-anchor="bl"] {
    bottom: -34px;
    left: 80px;
  }
  .bn-deco-pink-block[data-anchor="br"] {
    bottom: -34px;
    right: 80px;
  }
</style>
```
