```html
<!-- Stat figure with uppercase caption — the editorial stat-counter.
     Big Bodoni numeral, no shadow, no border. Caption sits beneath
     in Manrope uppercase with wide tracking. -->
<div class="ee-stat-counter">
  <div class="ee-stat-counter-num">{NUM}<span class="ee-stat-counter-unit">%</span></div>
  <div class="ee-stat-counter-lbl">{LABEL}</div>
</div>

<style>
  .ee-stat-counter {
    display: inline-flex;
    flex-direction: column;
    gap: 12px;
    color: var(--ink);
  }
  .ee-stat-counter-num {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 900;
    font-size: 92px;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .ee-stat-counter-unit {
    font-size: 48px;
    margin-left: 2px;
    font-weight: 900;
  }
  .ee-stat-counter-lbl {
    font-family: "Manrope", sans-serif;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: var(--ee-chrome-tracking);
    text-transform: uppercase;
    line-height: 1.35;
  }
</style>
```
