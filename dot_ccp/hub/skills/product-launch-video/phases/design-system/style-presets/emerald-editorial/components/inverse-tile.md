```html
<!-- Solid ink container with canvas-color text. The default elevated
     surface — used in tile rotation with paper-tile. Holds an eyebrow +
     headline + body block. Strict rectangle, no shadow, no border-radius. -->
<div class="ee-inverse-tile">
  <div class="ee-inverse-tile-eyebrow">{EYEBROW}</div>
  <h3 class="ee-inverse-tile-title">{HEADLINE}</h3>
  <p class="ee-inverse-tile-body">{LEDE}</p>
</div>

<style>
  .ee-inverse-tile {
    background: var(--ee-inverse-bg);
    color: var(--ee-inverse-fg);
    padding: var(--ee-pad-tile);
    border-radius: var(--ee-radius);
    box-shadow: none;
    font-family: "Manrope", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .ee-inverse-tile-eyebrow {
    font-weight: 800;
    font-size: 24px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .ee-inverse-tile-title {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 48px;
    line-height: 1;
    letter-spacing: -0.005em;
    margin: 0;
    border-top: 4px solid currentColor;
    padding-top: 16px;
  }
  .ee-inverse-tile-body {
    font-size: 24px;
    line-height: 1.45;
    font-weight: 500;
    margin: 0;
  }
</style>
```
