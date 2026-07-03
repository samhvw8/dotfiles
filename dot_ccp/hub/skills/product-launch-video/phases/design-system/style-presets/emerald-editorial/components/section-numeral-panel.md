```html
<!-- Full-bleed inverse panel holding a single oversized Bodoni numeral.
     Section-opener / chapter-divider device. Topbar + footline strings
     sit absolutely in the corners. The numeral is the focal element.
     Pair with right-half canvas content (eyebrow + headline + lede). -->
<div class="ee-section-numeral-panel">
  <div class="ee-section-numeral-panel-top">
    <span>{LEFT}</span>
    <span>{RIGHT}</span>
  </div>
  <div class="ee-section-numeral-panel-numeral">{NUM}</div>
  <div class="ee-section-numeral-panel-bot">
    <span>{LEFT}</span>
    <span>{RIGHT}</span>
  </div>
</div>

<style>
  .ee-section-numeral-panel {
    width: 100%;
    min-height: 720px;
    background: var(--ink);
    color: var(--canvas);
    padding: 70px 90px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--ee-radius);
    box-shadow: none;
    font-family: "Manrope", sans-serif;
  }
  .ee-section-numeral-panel-top,
  .ee-section-numeral-panel-bot {
    position: absolute;
    left: 90px;
    right: 90px;
    display: flex;
    justify-content: space-between;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .ee-section-numeral-panel-top {
    top: 70px;
  }
  .ee-section-numeral-panel-bot {
    bottom: 70px;
  }
  .ee-section-numeral-panel-numeral {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: 460px;
    line-height: 0.9;
    letter-spacing: -0.04em;
    text-align: center;
  }
</style>
```
