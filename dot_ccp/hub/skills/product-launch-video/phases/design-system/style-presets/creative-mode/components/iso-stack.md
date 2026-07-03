```html
<!-- iso-stack: a signature decorative-figure from the source deck's slide 4.
     A green panel containing four offset color-blocks with 18px ink shadows.
     Use as a side-panel "system diagram" against a hero headline. -->
<div class="cm-iso-stack">
  <div class="cm-iso-stage">
    <div class="cm-iso-blk cm-iso-b1">
      <span class="cm-iso-tag">LAYER / 01</span>
    </div>
    <div class="cm-iso-blk cm-iso-b2">
      <span class="cm-iso-tag">LAYER / 02</span>
    </div>
    <div class="cm-iso-blk cm-iso-b3">
      <span class="cm-iso-tag">LAYER / 03</span>
    </div>
    <div class="cm-iso-blk cm-iso-b4">
      <span class="cm-iso-tag">LAYER / 04</span>
    </div>
  </div>
</div>

<style>
  .cm-iso-stack {
    position: relative;
    background: var(--brand-primary);
    border: var(--border-structural);
    width: 48vw;
    height: 43.75vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cm-iso-stage {
    position: relative;
    width: 29.2vw;
    height: 29.2vw;
  }
  .cm-iso-blk {
    position: absolute;
    width: 15.6vw;
    height: 6.25vw;
    border: var(--border-structural);
    box-shadow: var(--shadow-hard-md);
  }
  .cm-iso-tag {
    position: absolute;
    left: 0.75vw;
    top: 0.52vw;
    font-family: "JetBrains Mono", monospace;
    font-size: 1.25vw;
    letter-spacing: var(--mono-track-mid);
    text-transform: uppercase;
    color: var(--ink);
  }
  .cm-iso-b1 {
    background: var(--brand-secondary);
    top: 3.1vw;
    left: 6.8vw;
  }
  .cm-iso-b2 {
    background: color-mix(in srgb, var(--brand-accent) 75%, var(--canvas));
    top: 10.4vw;
    left: 3.1vw;
    width: 19.8vw;
  }
  .cm-iso-b3 {
    background: var(--brand-accent);
    top: 17.7vw;
    left: 8.3vw;
  }
  .cm-iso-b4 {
    background: var(--surface-recess);
    top: 24vw;
    left: 4.2vw;
    width: 17.7vw;
  }
</style>
```
