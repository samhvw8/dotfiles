```html
<!-- Drop cap — first letter of an opener paragraph floats left at 132px Cormorant
     Garamond medium, line-height 0.85, padding 8px 14px 0 0. The single most
     editorial typographic moment in the system. Use at most once per scene,
     only on long-form opener paragraphs. -->
<p class="se-dropcap">
  <span class="se-dropcap-letter">A</span>
  {LEDE}
</p>
<style>
  .se-dropcap {
    font-family: var(--font-body, "Work Sans", sans-serif);
    font-size: clamp(24px, 1.8vw, 30px);
    line-height: 1.5;
    max-width: var(--measure-body);
    color: var(--ink);
    margin: 0;
  }
  .se-dropcap-letter {
    float: left;
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-size: 5.4em; /* ~130px against a 24px body */
    line-height: 0.85;
    padding: 8px 14px 0 0;
    color: var(--ink);
  }
</style>
```
