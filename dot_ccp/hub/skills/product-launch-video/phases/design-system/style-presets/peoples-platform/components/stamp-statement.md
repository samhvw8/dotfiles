```html
<div class="pp-stamp-statement">
  <h3 class="pp-stamp-statement-h">
    {HEADLINE} <em class="pp-stamp-statement-em">{SCRIPT_WORD}</em>
  </h3>
  <p class="pp-stamp-statement-sub">{SUBHEAD}</p>
</div>

<style>
  .pp-stamp-statement {
    position: relative;
    padding: 64px 80px;
    background: var(--paper);
    background-image: var(--grain-image);
    background-size: var(--grain-size);
    background-position: var(--grain-offset);
    background-blend-mode: multiply;
    color: var(--ink);
  }
  .pp-stamp-statement-h {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(80px, 10vw, 160px);
    font-weight: 400;
    line-height: 0.86;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    color: var(--blue);
    text-shadow: var(--shadow-triple-md);
    max-width: 16ch;
    overflow-wrap: break-word;
  }
  .pp-stamp-statement-em {
    font-style: normal;
    color: var(--orange);
    text-shadow:
      10px 10px 0 var(--red),
      20px 20px 0 var(--red-deep);
  }
  .pp-stamp-statement-sub {
    margin: 32px 0 0;
    font-family: "Archivo Narrow", sans-serif;
    font-size: clamp(28px, 2.4vw, 40px);
    font-weight: 500;
    line-height: 1.4;
    color: var(--ink);
    max-width: 38ch;
  }
</style>
```
