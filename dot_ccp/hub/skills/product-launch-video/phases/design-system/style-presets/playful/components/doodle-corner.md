```html
<div class="pf-doodle-corner">
  <span class="pf-doodle-corner-circle"></span>
  <span class="pf-doodle-corner-rect"></span>
</div>

<style>
  /*
    Two plain outlined shapes — a round circle and a tilted rectangle —
    anchored in a scene corner as minimal decorative punctuation. The simpler
    counterpart to scribble-svg / blob-frame: when a scene needs visual breath
    but a blob would feel too organic and a scribble too active. Both shapes
    sit on transparent ground so the warm canvas shows through.
  */
  .pf-doodle-corner {
    position: absolute;
    left: 8%;
    top: 12%;
    width: 200px;
    height: 140px;
    pointer-events: none;
  }
  .pf-doodle-corner-circle {
    position: absolute;
    left: 0;
    top: 0;
    width: 96px;
    height: 96px;
    border: var(--border-stroke);
    border-radius: 50%;
    background: transparent;
    display: block;
  }
  .pf-doodle-corner-rect {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 120px;
    height: 80px;
    border: var(--border-stroke);
    background: transparent;
    display: block;
    transform: rotate(8deg); /* doodle rects allow up to ~10deg per design.md */
  }
  /* Variants — anchor to other corners. */
  .pf-doodle-corner.top-right {
    left: auto;
    right: 8%;
  }
  .pf-doodle-corner.bottom-left {
    top: auto;
    bottom: 12%;
  }
  .pf-doodle-corner.bottom-right {
    left: auto;
    right: 8%;
    top: auto;
    bottom: 12%;
  }
</style>
```
