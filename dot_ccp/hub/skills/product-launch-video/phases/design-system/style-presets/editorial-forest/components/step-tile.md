```html
<!-- Editorial Forest step-tile: vertical card (8px radius, 2.5px border) carrying
     a mono ordinal, a serif title (~68px), a body paragraph, and a mono marker
     row separated by a top rule. A row of 3-4 of these is the framework /
     process pattern. Default fill is cream-with-green-border; alt fills are
     solid green (.ef-step-tile--fill) and solid pink (.ef-step-tile--pink). -->
<div class="ef-step-tile">
  <div class="ef-step-tile-num">Step 01</div>
  <h3 class="ef-step-tile-title">{HEADLINE}</h3>
  <p class="ef-step-tile-body">{LEDE}</p>
  <div class="ef-step-tile-marker">
    <span>Phase 01</span>
    <span>Owner</span>
  </div>
</div>

<style>
  .ef-step-tile {
    box-sizing: border-box;
    border-radius: var(--ef-radius-step);
    padding: 32px 28px 28px;
    display: flex;
    flex-direction: column;
    min-height: 340px;
    border: var(--ef-rule-weight-card) solid var(--brand-primary);
    background: var(--canvas);
    color: var(--brand-primary);
  }
  .ef-step-tile--fill {
    background: var(--brand-primary);
    color: var(--brand-secondary);
    border-color: var(--brand-primary);
  }
  .ef-step-tile--pink {
    background: var(--brand-secondary);
    color: var(--ef-green-deep);
    border-color: var(--ef-pink-deep);
  }
  .ef-step-tile-num {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 500;
    color: inherit;
  }
  .ef-step-tile-title {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 2.8vw;
    line-height: 0.96;
    letter-spacing: -0.01em;
    font-weight: 500;
    margin: 18px 0 18px 0;
    color: inherit;
  }
  .ef-step-tile-body {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 1.3vw;
    line-height: 1.34;
    margin: 0;
    font-weight: 400;
    color: inherit;
  }
  .ef-step-tile-marker {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 20px;
    border-top: var(--ef-rule-weight) solid currentColor;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 500;
    color: inherit;
  }
</style>
```
