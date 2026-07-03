```html
<div class="sk-ribbon-band">
  <span class="sk-ribbon sk-ribbon-pink" style="top: 18%;"></span>
  <span class="sk-ribbon sk-ribbon-orange" style="top: 30%;"></span>
  <span class="sk-ribbon sk-ribbon-yellow" style="top: 42%;"></span>
  <span class="sk-ribbon sk-ribbon-green" style="top: 54%;"></span>
  <span class="sk-ribbon sk-ribbon-blue" style="top: 66%;"></span>
</div>

<style>
  /*
    Diagonal multi-color ribbon band — 5 stacked solid-color horizontal
    bars rotated -22° to sweep across a region. Anchored to one edge,
    oversized (160% wide) to bleed off the opposite edge. The atmospheric
    layering signature of the cassette-package register. Reserved for
    cover / quote / closing spreads — not a routine slide element.

    Phase 4b: drive parallax on the band container (sine.inOut, period
    8-12s, amplitude ±12-20px on x-axis). Rotate is LOCKED at ±22° — never
    tween rotation.
  */
  .sk-ribbon-band {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 2;
  }
  .sk-ribbon {
    position: absolute;
    left: -20%;
    width: 160%;
    height: var(--ribbon-band-h);
    transform: rotate(var(--ribbon-band-rotate));
    transform-origin: 50% 50%;
  }
  .sk-ribbon-red {
    background: var(--sk-red);
  }
  .sk-ribbon-pink {
    background: var(--sk-pink);
  }
  .sk-ribbon-orange {
    background: var(--sk-orange);
  }
  .sk-ribbon-yellow {
    background: var(--sk-yellow);
  }
  .sk-ribbon-green {
    background: var(--sk-green);
  }
  .sk-ribbon-blue {
    background: var(--sk-blue);
  }
  /* Reverse-sweep variant — used on closing colophon spreads. */
  .sk-ribbon-band.reverse .sk-ribbon {
    transform: rotate(22deg);
  }
</style>
```
