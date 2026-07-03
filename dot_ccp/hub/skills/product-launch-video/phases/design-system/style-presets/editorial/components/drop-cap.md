```html
<p class="ed-dropcap"><span class="ed-dropcap-letter">{LETTER}</span>{REST_OF_PARAGRAPH}</p>
<style>
  /* Editorial opener — first letter set 4x body, hanging into the margin.
     Use once per scene at most. */
  .ed-dropcap {
    font-size: clamp(26px, 2vw, 34px);
    line-height: 1.55;
    max-width: var(--measure-narrow);
    color: var(--ink);
  }
  .ed-dropcap-letter {
    float: left;
    font-family: var(--font-display, inherit);
    font-size: 5.2em;
    line-height: 0.92;
    padding: 6px 12px 0 0;
    font-weight: 400;
    font-style: italic;
  }
</style>
```
