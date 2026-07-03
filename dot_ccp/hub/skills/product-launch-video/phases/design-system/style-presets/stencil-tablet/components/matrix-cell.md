```html
<!--
  Dense comparison-matrix cell. Three registers in one component:
    - .head-row  → ink fill with bone text, stencil row-head cap.
    - .row-label → row-label cell, uppercase stencil at 26px.
    - default    → standard data cell, Inter body. Drop a stn-chip.pill inside
      for status values.
  Renders inside a parent .stn-matrix-table that supplies the paper-fill,
  rounded-22px frame and the CSS-grid layout. The hairline border
  (--rule-hairline) sits on every cell; the .last variant drops the bottom
  border on the final row.
-->
<div class="stn-matrix-table">
  <div class="stn-matrix-cell head-row">{LABEL}</div>
  <div class="stn-matrix-cell head-row">{LEFT}</div>
  <div class="stn-matrix-cell head-row">{RIGHT}</div>
  <div class="stn-matrix-cell row-label">{HEADLINE}</div>
  <div class="stn-matrix-cell"><span class="stn-chip pill yes">{DO_1}</span></div>
  <div class="stn-matrix-cell last"><span class="stn-chip pill no">{DONT_1}</span></div>
</div>

<style>
  .stn-matrix-table {
    background: var(--surface-paper);
    border-radius: var(--radius-card);
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-auto-rows: 1fr;
    overflow: hidden;
  }
  .stn-matrix-cell {
    padding: 18px 22px;
    display: flex;
    align-items: center;
    font-family: "Inter", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.35;
    color: var(--ink);
    border-bottom: var(--rule-hairline);
    border-right: var(--rule-hairline);
  }
  /* Drop right-border on the last column. Cell-position selectors are kept
     generic; grid template determines column count. */
  .stn-matrix-cell:nth-child(3n) {
    border-right: 0;
  }
  .stn-matrix-cell.last {
    border-bottom: 0;
  }
  .stn-matrix-cell.head-row {
    background: var(--ink);
    color: var(--anchor-bone);
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .stn-matrix-cell.row-label {
    font-family: "Stardos Stencil", serif;
    font-weight: 700;
    font-size: 26px;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    color: var(--ink);
  }

  /* Inline stn-chip overrides used inside cells — keeps the chip component
     visually consistent without re-declaring its rules. */
  .stn-matrix-cell .stn-chip {
    line-height: 1;
  }
</style>
```
