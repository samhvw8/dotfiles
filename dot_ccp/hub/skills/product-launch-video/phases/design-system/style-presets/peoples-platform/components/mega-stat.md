```html
<div class="pp-mega-stat">
  <div class="pp-mega-stat-big">
    <span class="pp-mega-stat-num">{NUM}</span><sup class="pp-mega-stat-unit">{STAT_UNIT}</sup>
  </div>
  <div class="pp-mega-stat-desc">
    <h4 class="pp-mega-stat-caption">{CAPTION}</h4>
    <p class="pp-mega-stat-lede">{LEDE}</p>
    <span class="pp-mega-stat-src">{STAT_SOURCE}</span>
  </div>
</div>

<style>
  .pp-mega-stat {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 80px;
    padding: 96px 120px;
    background: var(--blue);
    color: var(--cream);
    min-height: 600px;
  }
  .pp-mega-stat-big {
    font-family: "Alfa Slab One", serif;
    font-size: clamp(280px, 32vw, 520px);
    font-weight: 400;
    line-height: 0.82;
    letter-spacing: -0.02em;
    color: var(--orange);
    text-shadow:
      12px 12px 0 var(--red),
      24px 24px 0 var(--red-deep);
  }
  .pp-mega-stat-unit {
    font-size: 0.28em;
    color: var(--cream);
    text-shadow: 6px 6px 0 var(--red);
    vertical-align: top;
    line-height: 1;
  }
  .pp-mega-stat-desc {
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: var(--cream);
  }
  .pp-mega-stat-caption {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(48px, 5vw, 72px);
    font-weight: 400;
    line-height: 0.95;
    text-transform: uppercase;
    color: var(--cream);
  }
  .pp-mega-stat-lede {
    margin: 0;
    font-family: "Archivo Narrow", sans-serif;
    font-size: clamp(28px, 2.4vw, 40px);
    font-weight: 500;
    line-height: 1.4;
    color: color-mix(in srgb, var(--cream) 90%, transparent);
    max-width: 30ch;
  }
  .pp-mega-stat-src {
    align-self: flex-start;
    padding: 10px 18px;
    border-top: 3px solid var(--cream);
    font-family: "DM Mono", monospace;
    font-size: 27px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--orange);
  }
</style>
```
