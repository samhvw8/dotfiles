```html
<p class="rz-inline-para">
  {LEFT}
  <span class="rz-inline-highlight">{LABEL}</span>
  {RIGHT}
</p>

<style>
  /*
    Black-on-khaki marker swipe applied inline inside body paragraphs to
    lift a phrase. The print equivalent of a marker pen.

    HARD RULE: ink ground + paper text, NEVER brand-primary ground + cream
    text. Green inline reads as a typo; ink inline reads as marker. The
    template's `.ed-highlight` enforces this contract.
  */
  .rz-inline-para {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(24px, 1.8vw, 28px);
    line-height: 1.7;
    color: var(--ink);
    margin: 0;
  }
  .rz-inline-highlight {
    background: var(--ink);
    color: var(--anchor-paper);
    padding: 2px 8px;
    font-weight: 600;
  }
</style>
```
