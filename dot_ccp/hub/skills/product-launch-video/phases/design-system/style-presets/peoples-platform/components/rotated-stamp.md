```html
<div class="pp-rotated-stamp">
  <div class="pp-rotated-stamp-stamp">
    <span class="pp-rotated-stamp-big">{MARK_BIG}</span>
    <span class="pp-rotated-stamp-small">{MARK_SMALL}</span>
  </div>
  <div class="pp-rotated-stamp-cap">
    {CAPTION} <em class="pp-rotated-stamp-em">{SCRIPT_WORD}</em>
  </div>
</div>

<style>
  .pp-rotated-stamp {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    padding: 96px 120px;
    background: var(--paper);
    background-image: var(--grain-image);
    background-size: var(--grain-size);
    background-position: var(--grain-offset);
    background-blend-mode: multiply;
    color: var(--ink);
    min-height: 600px;
    justify-content: center;
    text-align: center;
  }
  .pp-rotated-stamp-stamp {
    width: clamp(280px, 28vw, 400px);
    height: clamp(280px, 28vw, 400px);
    border-radius: 50%;
    background: var(--cream);
    color: var(--blue);
    border: 8px solid var(--orange);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: rotate(var(--tilt-stamp));
    box-shadow: 10px 10px 0 var(--red);
    font-family: "Alfa Slab One", serif;
    font-weight: 400;
    line-height: 1;
  }
  .pp-rotated-stamp-big {
    font-size: clamp(72px, 8vw, 108px);
    line-height: 0.9;
  }
  .pp-rotated-stamp-small {
    font-size: clamp(24px, 2vw, 30px);
    letter-spacing: 0.18em;
    font-family: "DM Mono", monospace;
    margin-top: 12px;
  }
  .pp-rotated-stamp-cap {
    font-family: "Alfa Slab One", serif;
    font-size: clamp(48px, 5vw, 80px);
    font-weight: 400;
    line-height: 0.95;
    text-transform: uppercase;
    color: var(--blue);
    text-shadow: 5px 5px 0 var(--red);
    max-width: 18ch;
  }
  .pp-rotated-stamp-em {
    font-style: normal;
    color: var(--orange);
    text-shadow: 5px 5px 0 var(--red);
  }
</style>
```
