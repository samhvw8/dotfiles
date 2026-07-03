```html
<!-- compare-row is a single horizontal strip from the s7 comparison table.
     Drop multiple rows under a shared 4px ink frame at scene-build time. -->
<div class="cm-compare-row">
  <div class="cm-compare-label">{LABEL}</div>
  <div class="cm-compare-cell cm-compare-cell-a">{LEFT}</div>
  <div class="cm-compare-cell cm-compare-cell-b">{RIGHT}</div>
  <div class="cm-compare-cell cm-compare-cell-c">{LEDE}</div>
</div>

<style>
  .cm-compare-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    border-bottom: var(--border-internal);
    background: var(--surface-recess);
  }
  .cm-compare-row > div {
    padding: 0.95vw 1.35vw;
    border-right: var(--border-internal);
    display: flex;
    align-items: center;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.25vw;
    color: var(--ink);
  }
  .cm-compare-row > div:last-child {
    border-right: 0;
  }
  .cm-compare-label {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 1.45vw;
    text-transform: uppercase;
    background: var(--canvas);
    color: var(--ink);
  }
  .cm-compare-cell-a {
    background: var(--brand-secondary);
    color: var(--ink);
  }
  .cm-compare-cell-b {
    background: var(--brand-primary);
    color: var(--canvas);
  }
  .cm-compare-cell-c {
    background: var(--brand-accent);
    color: var(--canvas);
  }
</style>
```
