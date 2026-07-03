```html
<div class="rz-ledger">
  <div class="rz-ledger-header">
    <span class="rz-ledger-cell">{EYEBROW}</span>
    <span class="rz-ledger-cell">{LABEL}</span>
    <span class="rz-ledger-cell">{KICKER}</span>
    <span class="rz-ledger-cell">{NUM}</span>
  </div>
  <div class="rz-ledger-row">
    <span class="rz-ledger-cell">{LEFT}</span>
    <span class="rz-ledger-cell">{RIGHT}</span>
    <span class="rz-ledger-cell"><span class="rz-chip solid primary">{LABEL}</span></span>
    <span class="rz-ledger-cell">{NUM}</span>
  </div>
</div>

<style>
  /*
    Horizontal data row pattern: header row + body row with stronger header
    underline (1.5px ink) and hairline body dividers (1px @ 22% ink). Each
    body row may contain a chip tagging its category. Use for "at a glance"
    tabular moments, release notes, sponsor lists.
  */
  .rz-ledger {
    width: 100%;
    font-family: "Space Grotesk", sans-serif;
    color: var(--ink);
  }
  .rz-ledger-header,
  .rz-ledger-row {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr;
    gap: var(--gap-sm);
    align-items: baseline;
    padding: 12px 0;
  }
  .rz-ledger-header {
    border-bottom: var(--border-fine);
    font-family: "Bebas Neue", sans-serif;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--brand-primary);
  }
  .rz-ledger-row {
    border-bottom: var(--border-hairline);
    font-size: clamp(24px, 1.8vw, 28px);
    line-height: 1.5;
  }
  .rz-ledger-cell {
    display: inline-block;
  }
</style>
```
