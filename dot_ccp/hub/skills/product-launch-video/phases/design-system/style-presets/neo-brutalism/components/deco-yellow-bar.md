```html
<!-- Inline by default; add data-anchor to pin as billboard strip. -->
<div class="bn-deco-yellow-bar">▶ {LABEL}</div>
<style>
  .bn-deco-yellow-bar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 64px;
    background: var(--deco-1);
    border: var(--border-bold);
    box-shadow: 4px 4px 0 var(--ink);
    transform: rotate(-3deg);
    font-family: ui-monospace, monospace;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 5;
  }
  .bn-deco-yellow-bar[data-anchor] {
    position: absolute;
  }
  .bn-deco-yellow-bar[data-anchor="tl"] {
    top: -22px;
    left: 80px;
  }
  .bn-deco-yellow-bar[data-anchor="tr"] {
    top: -22px;
    right: 80px;
  }
  .bn-deco-yellow-bar[data-anchor="bl"] {
    bottom: -22px;
    left: 80px;
  }
  .bn-deco-yellow-bar[data-anchor="br"] {
    bottom: -22px;
    right: 80px;
  }
</style>
```
