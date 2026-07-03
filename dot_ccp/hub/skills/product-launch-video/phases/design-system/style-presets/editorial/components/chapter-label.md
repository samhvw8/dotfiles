```html
<div class="ed-chapter">
  <span class="ed-chapter-num">{NUM}</span>
  <span class="ed-chapter-rule"></span>
  <span class="ed-chapter-name">{NAME}</span>
</div>
<style>
  /* "01 — Foundations" — used as a scene anchor or section opener.
     Snaps to baseline; full hairline rule fills the remaining track. */
  .ed-chapter {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    font-size: clamp(24px, 1.6vw, 28px);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-soft, var(--ink));
  }
  .ed-chapter-num {
    font-variant-numeric: tabular-nums;
  }
  .ed-chapter-rule {
    height: 1px;
    background: var(--ink);
    opacity: 0.5;
  }
</style>
```
