```html
<!-- Editorial Forest stat-counter: oversized 220px serif numeral with optional
     110px unit, mono tag above, serif descriptor below. The KPI moment. Sits
     on a brand-primary (green) surface separated by a 2px pink rule above. -->
<div class="ef-stat-counter">
  <span class="ef-stat-counter-tag">{LABEL}</span>
  <span class="ef-stat-counter-figure">{NUM}<span class="ef-stat-counter-unit">%</span></span>
  <p class="ef-stat-counter-desc">{LEDE}</p>
</div>

<style>
  .ef-stat-counter {
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: var(--canvas);
  }
  .ef-stat-counter-tag {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--brand-secondary);
    font-weight: 500;
  }
  .ef-stat-counter-figure {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 9.2vw;
    line-height: 0.92;
    letter-spacing: -0.03em;
    color: var(--brand-secondary);
    font-weight: 500;
    display: inline-flex;
    align-items: baseline;
  }
  .ef-stat-counter-unit {
    font-size: 4.6vw;
    color: var(--canvas);
    margin-left: 6px;
    font-weight: 500;
  }
  .ef-stat-counter-desc {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 1.4vw;
    line-height: 1.32;
    color: var(--canvas);
    margin: 6px 0 0 0;
    font-weight: 400;
    max-width: 32ch;
  }
</style>
```
