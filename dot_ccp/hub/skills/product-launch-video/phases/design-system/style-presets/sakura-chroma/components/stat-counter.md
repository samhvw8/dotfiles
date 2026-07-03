```html
<div class="sk-stat-counter">
  <div class="sk-stat-counter-num">{NUM}<sub class="sk-stat-counter-unit">+</sub></div>
  <div class="sk-stat-counter-label">{LABEL}</div>
  <p class="sk-stat-counter-desc">{LEDE}</p>
</div>

<style>
  /*
    Big Shoulders Display 900 numeral in red — the catalogue's primary hero
    statistic. Inline sub-unit ("K", "%", "+") at 34% the numeral size in
    ink. Phase 4b: animate the numeral with a count-up tween (power3.out,
    DUR.slow). Pair with a secondary stat in --sk-blue if two stats appear.
  */
  .sk-stat-counter {
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 0.8vh, 10px);
  }
  .sk-stat-counter-num {
    font-family: "Big Shoulders Display", sans-serif;
    font-weight: 900;
    font-size: clamp(110px, min(11vw, 18vh), 240px);
    line-height: 0.86;
    letter-spacing: -0.025em;
    color: var(--sk-red);
  }
  .sk-stat-counter-unit {
    font-size: 0.34em;
    vertical-align: baseline;
    color: var(--anchor-ink);
    letter-spacing: 0;
    margin-left: 8px;
  }
  .sk-stat-counter-label {
    font-family: "Albert Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(24px, 1.5vw, 30px);
    line-height: 1.2;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--anchor-ink);
    margin-top: 6px;
  }
  .sk-stat-counter-desc {
    font-family: "Albert Sans", sans-serif;
    font-weight: 400;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.5;
    color: var(--anchor-ink);
    opacity: 0.9;
    max-width: 30ch;
    margin: 6px 0 0;
  }
  /* Paired secondary stat — blue when red is the primary. */
  .sk-stat-counter.secondary .sk-stat-counter-num {
    color: var(--sk-blue);
    font-size: clamp(70px, min(7vw, 11vh), 150px);
  }
</style>
```
