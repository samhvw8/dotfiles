```html
<div class="sk-petal-cluster">
  <span class="sk-petal sk-petal-red" style="width: 50%; left: 0; top: 28%;"></span>
  <span class="sk-petal sk-petal-orange" style="width: 38%; left: 14%; top: 50%;"></span>
  <span class="sk-petal sk-petal-blue" style="width: 44%; left: 28%; top: 0;"></span>
  <span class="sk-petal sk-petal-green" style="width: 50%; left: 50%; top: 22%;"></span>
  <span class="sk-petal sk-petal-yellow" style="width: 32%; left: 36%; top: 50%;"></span>
</div>

<style>
  /*
    Petal-blob cluster — 4-5 overlapping perfect circles in mixed rainbow
    colors. The system's signature decorative element. Used as a brand-mark
    anchor in slide corners and on quote spreads. Each petal MUST stay
    perfectly round (aspect-ratio 1/1, border-radius 50%) — ellipses break
    the petal-recognition signal.

    Phase 4b: drive cluster drift via GSAP on the container (sine.inOut,
    period 6-10s, amplitude ±8-16px). Do NOT drift per-petal — the overlap
    geometry depends on relative positions.
  */
  .sk-petal-cluster {
    position: relative;
    width: clamp(220px, 22vw, 380px);
    height: clamp(170px, 17vw, 300px);
    pointer-events: none;
  }
  .sk-petal {
    position: absolute;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }
  .sk-petal-red {
    background: var(--sk-red);
  }
  .sk-petal-pink {
    background: var(--sk-pink);
  }
  .sk-petal-orange {
    background: var(--sk-orange);
  }
  .sk-petal-yellow {
    background: var(--sk-yellow);
  }
  .sk-petal-green {
    background: var(--sk-green);
  }
  .sk-petal-blue {
    background: var(--sk-blue);
  }
</style>
```
