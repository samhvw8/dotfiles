```html
<!-- Alt-surface tile (brand-accent fill) with ink text. Rotates with
     inverse-tile across a row of tiles to break the monotony of all-ink
     fills. Strict rectangle, no shadow, no border-radius. The internal
     rule uses currentColor (= ink on paper). -->
<div class="ee-paper-tile">
  <div class="ee-paper-tile-eyebrow">{EYEBROW}</div>
  <h3 class="ee-paper-tile-title">{HEADLINE}</h3>
  <p class="ee-paper-tile-body">{LEDE}</p>
</div>

<style>
  .ee-paper-tile {
    background: var(--ee-paper);
    color: var(--ink);
    padding: var(--ee-pad-tile);
    border-radius: var(--ee-radius);
    box-shadow: none;
    font-family: "Manrope", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .ee-paper-tile-eyebrow {
    font-weight: 800;
    font-size: 24px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .ee-paper-tile-title {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 48px;
    line-height: 1;
    letter-spacing: -0.005em;
    margin: 0;
    border-top: 4px solid currentColor;
    padding-top: 16px;
  }
  .ee-paper-tile-body {
    font-size: 24px;
    line-height: 1.45;
    font-weight: 500;
    margin: 0;
  }
</style>
```
