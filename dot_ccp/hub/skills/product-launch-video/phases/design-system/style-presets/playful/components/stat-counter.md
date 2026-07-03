```html
<div class="pf-stat-counter">
  <div class="pf-stat-counter-num">{NUM}</div>
  <div class="pf-stat-counter-label">{LABEL}</div>
</div>

<style>
  /*
    Big-number stat block. Syne 800 numeral with negative tracking + a small
    micro-rotation (±0.5 to ±1deg) reinforces the hand-placed register. Label
    sits below in Space Grotesk 500 sentence case (NOT uppercase — the
    eyebrow chip carries uppercase; stat labels stay conversational).
    No border, no card — the numeral is the visual mass.
  */
  .pf-stat-counter {
    position: relative;
    color: var(--ink);
  }
  .pf-stat-counter-num {
    font-family: "Syne", sans-serif;
    font-weight: 800;
    font-size: clamp(4rem, 8vw, 7rem);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 0 0 1rem;
    transform: rotate(-1deg);
  }
  .pf-stat-counter-label {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ink);
    opacity: 0.8;
    max-width: 22ch;
  }
  /* Brand-primary variant — reserve for the focal stat (one per scene max). */
  .pf-stat-counter.brand .pf-stat-counter-num {
    color: var(--brand-primary);
  }
</style>
```
