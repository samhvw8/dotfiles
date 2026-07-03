```html
<div class="pp-end-stamp">
  <span class="pp-end-stamp-pre">{SCRIPT_BEFORE}</span>
  <h3 class="pp-end-stamp-h">{HEADLINE}</h3>
  <div class="pp-end-stamp-row">
    <span class="pp-end-stamp-credit">{CREDIT}</span>
    <span class="pp-end-stamp-mark">
      <span class="pp-end-stamp-mark-big">{MARK_BIG}</span>
      <span class="pp-end-stamp-mark-small">{MARK_SMALL}</span>
    </span>
  </div>
</div>

<style>
  .pp-end-stamp {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 36px;
    padding: 120px;
    align-items: flex-start;
    min-height: 600px;
    background: var(--blue);
    color: var(--cream);
  }
  .pp-end-stamp::after {
    content: "";
    position: absolute;
    inset: var(--frame-inset);
    border: var(--frame-cream);
    pointer-events: none;
    z-index: 0;
  }
  .pp-end-stamp > * {
    z-index: 1;
    position: relative;
  }
  .pp-end-stamp-pre {
    font-family: "Caveat Brush", cursive;
    font-size: clamp(56px, 6vw, 96px);
    font-weight: 400;
    line-height: 1;
    color: var(--orange);
    transform: rotate(var(--tilt-script));
    display: inline-block;
  }
  .pp-end-stamp-h {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(80px, 10vw, 160px);
    font-weight: 400;
    line-height: 0.86;
    text-transform: uppercase;
    color: var(--orange);
    text-shadow:
      8px 8px 0 var(--red),
      16px 16px 0 var(--red-deep);
    max-width: 14ch;
    overflow-wrap: break-word;
  }
  .pp-end-stamp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 30px;
    margin-top: auto;
  }
  .pp-end-stamp-credit {
    font-family: "DM Mono", monospace;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream);
  }
  .pp-end-stamp-mark {
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: var(--cream);
    color: var(--blue);
    border: 6px solid var(--orange);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: rotate(var(--tilt-stamp));
    box-shadow: 8px 8px 0 var(--red);
    font-family: "Alfa Slab One", serif;
    font-size: 56px;
    font-weight: 400;
    line-height: 1;
  }
  .pp-end-stamp-mark-small {
    font-size: 24px;
    letter-spacing: 0.18em;
    font-family: "DM Mono", monospace;
    margin-top: 8px;
  }
</style>
```
