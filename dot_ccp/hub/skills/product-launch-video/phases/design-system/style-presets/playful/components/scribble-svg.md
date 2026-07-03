```html
<!-- Wavy squiggle scribble. For pen-on motion, tween strokeDashoffset 1 → 0
     over DUR.slow with EASE.drift. Other variants below (star, scribbled
     circle, arrow) follow the same stroke contract: 2px, rounded line-caps,
     ink color. -->
<svg class="pf-scribble-svg" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <path class="pf-scribble-svg-path" d="M10,50 Q30,10 50,50 T90,50 T130,50 T170,50 T190,50" />
  <path class="pf-scribble-svg-path" d="M20,72 Q40,42 60,72 T100,72 T140,72" />
</svg>

<style>
  /*
    Inline 2px-stroke decorative scribble. Placed absolutely in slide corners
    or edges as hand-drawn punctuation. Every scene gets at least one
    scribble mark. Stroke is ink by default; brand variant tints to brand-primary
    for accent moments (one per scene max — see §H brand-color contract).
  */
  .pf-scribble-svg {
    position: absolute;
    width: 200px;
    height: 100px;
    pointer-events: none;
    overflow: visible;
  }
  .pf-scribble-svg-path {
    stroke: var(--ink);
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .pf-scribble-svg.brand .pf-scribble-svg-path {
    stroke: var(--brand-primary);
  }
</style>
```
