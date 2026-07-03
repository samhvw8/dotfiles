```html
<!-- Editorial Forest monogram-circle: 130px outlined round mark holding a 2-3
     char JetBrains Mono monogram. The system's identity stamp; lives in the
     top-right of cover / summary scenes. The only fully round shape in the
     system besides the legend swatch corners.

     Substitute the brand's 2–3 char monogram at paste time. -->
<div class="ef-monogram-circle">AC</div>

<style>
  .ef-monogram-circle {
    width: var(--ef-monogram-size);
    height: var(--ef-monogram-size);
    border-radius: 50%;
    border: var(--ef-rule-weight) solid var(--brand-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.5vw;
    letter-spacing: 0.1em;
    font-weight: 500;
    color: var(--brand-secondary);
    box-sizing: border-box;
    /* Border color follows region: pink on green, green on cream, green-deep on pink.
       The default above is pink-on-green (cover surface). On a cream surface, override
       via a wrapper: .ef-on-cream .ef-monogram-circle { border-color: var(--brand-primary); color: var(--brand-primary); } */
  }
</style>
```
