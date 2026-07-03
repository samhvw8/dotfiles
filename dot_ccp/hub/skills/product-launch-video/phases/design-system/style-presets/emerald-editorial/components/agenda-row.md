```html
<!-- Three-column agenda / table-of-contents row. Ordinal + name + kind label.
     4px ink rule on top; the last row in a stack adds a matching bottom rule
     (apply via .ee-agenda-row.is-last). Stack 4-6 of these to form the
     full agenda list pattern. -->
<div class="ee-agenda-row">
  <span class="ee-agenda-row-num">01</span>
  <span class="ee-agenda-row-name">{HEADLINE}</span>
  <span class="ee-agenda-row-kind">{LABEL}</span>
</div>

<style>
  .ee-agenda-row {
    display: grid;
    grid-template-columns: 130px 1fr 320px;
    align-items: center;
    padding: var(--ee-gap-row) 0;
    border-top: var(--ee-rule);
    column-gap: 40px;
    color: var(--ink);
  }
  .ee-agenda-row.is-last {
    border-bottom: var(--ee-rule);
  }
  .ee-agenda-row-num {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 64px;
    line-height: 1;
  }
  .ee-agenda-row-name {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 64px;
    line-height: 1;
    letter-spacing: -0.005em;
  }
  .ee-agenda-row-kind {
    font-family: "Manrope", sans-serif;
    font-weight: 700;
    font-size: 26px;
    letter-spacing: var(--ee-chrome-tracking);
    text-transform: uppercase;
    text-align: right;
    white-space: nowrap;
  }
</style>
```
