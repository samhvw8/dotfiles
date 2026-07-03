```html
<!-- Editorial Forest meta-dl: three-column definition list with a 2px green
     top rule. dt = mono uppercase tracked; dd = serif weight 500. Sits at the
     bottom of a two-column slide as a credits / specs / details row. -->
<dl class="ef-meta-dl">
  <div class="ef-meta-dl-entry">
    <dt class="ef-meta-dl-term">{LEFT}</dt>
    <dd class="ef-meta-dl-value">Team Placeholder</dd>
  </div>
  <div class="ef-meta-dl-entry">
    <dt class="ef-meta-dl-term">Timeframe</dt>
    <dd class="ef-meta-dl-value">Q2 &mdash; Q4</dd>
  </div>
  <div class="ef-meta-dl-entry">
    <dt class="ef-meta-dl-term">Status</dt>
    <dd class="ef-meta-dl-value">{RIGHT}</dd>
  </div>
</dl>

<style>
  .ef-meta-dl {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 36px;
    border-top: var(--ef-rule-weight) solid var(--brand-primary);
    padding-top: 28px;
    margin: 0;
  }
  .ef-meta-dl-entry {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ef-meta-dl-term {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: var(--ef-track-caption);
    text-transform: uppercase;
    color: var(--brand-primary);
    font-weight: 500;
    margin: 0;
  }
  .ef-meta-dl-value {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-size: 1.7vw;
    color: var(--ink);
    margin: 0;
    font-weight: 500;
    line-height: 1.1;
  }
</style>
```
