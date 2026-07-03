```html
<div class="pp-framed-stamp">
  <span class="pp-framed-stamp-pill">{KICKER}</span>
  <h3 class="pp-framed-stamp-h">{HEADLINE}</h3>
  <p class="pp-framed-stamp-sub">{SUBHEAD}</p>
</div>

<style>
  .pp-framed-stamp {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding: 120px;
    background: var(--blue);
    color: var(--cream);
    align-items: flex-start;
    min-height: 600px;
  }
  .pp-framed-stamp::after {
    content: "";
    position: absolute;
    inset: var(--frame-inset);
    border: var(--frame-cream);
    pointer-events: none;
    z-index: 0;
  }
  .pp-framed-stamp > * {
    position: relative;
    z-index: 1;
  }
  .pp-framed-stamp-pill {
    align-self: flex-start;
    padding: 10px 22px;
    border: 3px solid var(--cream);
    background: var(--blue);
    color: var(--cream);
    font-family: "DM Mono", monospace;
    font-size: 27px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border-radius: 999px;
  }
  .pp-framed-stamp-h {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(96px, 11vw, 180px);
    font-weight: 400;
    line-height: 0.86;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    color: var(--orange);
    text-shadow:
      8px 8px 0 var(--red),
      16px 16px 0 var(--red-deep);
    max-width: 14ch;
    overflow-wrap: break-word;
  }
  .pp-framed-stamp-sub {
    margin: 0;
    font-family: "Archivo Narrow", sans-serif;
    font-size: clamp(28px, 2.4vw, 40px);
    font-weight: 500;
    line-height: 1.4;
    color: color-mix(in srgb, var(--cream) 90%, transparent);
    max-width: 32ch;
  }
</style>
```
