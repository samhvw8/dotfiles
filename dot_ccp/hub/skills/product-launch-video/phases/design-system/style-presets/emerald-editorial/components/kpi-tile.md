```html
<!-- KPI tile: label + jumbo Bodoni numeral + delta pill + descriptor.
     Default fill is ink (canvas-color text); add .is-alt to flip to
     paper-tile (ink text). The delta pill flips colors automatically. -->
<div class="ee-kpi-tile">
  <div class="ee-kpi-tile-lbl">{LABEL}</div>
  <div class="ee-kpi-tile-val">{NUM}<span class="ee-kpi-tile-unit">%</span></div>
  <div class="ee-kpi-tile-delta">+ 12.4%</div>
  <div class="ee-kpi-tile-desc">{LEDE}</div>
</div>

<style>
  .ee-kpi-tile {
    background: var(--ink);
    color: var(--canvas);
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    border-radius: var(--ee-radius);
    box-shadow: none;
    overflow: hidden;
    min-width: 0;
    font-family: "Manrope", sans-serif;
  }
  .ee-kpi-tile.is-alt {
    background: var(--ee-paper);
    color: var(--ink);
  }
  .ee-kpi-tile-lbl {
    font-weight: 800;
    letter-spacing: 0.14em;
    font-size: 24px;
    text-transform: uppercase;
  }
  .ee-kpi-tile-val {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: 144px;
    line-height: 0.9;
    letter-spacing: -0.03em;
    white-space: nowrap;
  }
  .ee-kpi-tile-unit {
    font-size: 60px;
    margin-left: 4px;
    font-weight: 800;
  }
  .ee-kpi-tile-delta {
    display: inline-block;
    font-weight: 800;
    letter-spacing: 0.08em;
    font-size: 24px;
    padding: 6px 16px;
    background: var(--canvas);
    color: var(--ink);
    align-self: flex-start;
    white-space: nowrap;
    text-transform: uppercase;
    border-radius: var(--ee-radius);
  }
  .ee-kpi-tile.is-alt .ee-kpi-tile-delta {
    background: var(--ink);
    color: var(--canvas);
  }
  .ee-kpi-tile-desc {
    font-size: 24px;
    line-height: 1.45;
    font-weight: 500;
  }
</style>
```
