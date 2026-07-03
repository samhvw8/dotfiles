```html
<div class="ed-mesh">
  <div class="ed-mesh-blob ed-mesh-blob-1"></div>
  <div class="ed-mesh-blob ed-mesh-blob-2"></div>
  <div class="ed-mesh-blob ed-mesh-blob-3"></div>
  <div class="ed-mesh-veil"></div>
  <div class="ed-mesh-fg">{FOREGROUND_CONTENT}</div>
</div>
<style>
  /* Soft brand-color blobs heavily blurred. A near-white veil keeps the
   foreground text legible by knocking down chroma intensity. */
  .ed-mesh {
    position: relative;
    overflow: hidden;
    background: var(--canvas);
    border-radius: 4px;
    min-height: 320px; /* preview only — drop when used full-bleed in scene */
  }
  .ed-mesh-blob {
    position: absolute;
    width: 65%;
    height: 75%;
    border-radius: 50%;
    filter: blur(140px);
    pointer-events: none;
    opacity: 0.85;
  }
  .ed-mesh-blob-1 {
    background: var(--brand-primary);
    top: -15%;
    left: -10%;
  }
  .ed-mesh-blob-2 {
    background: var(--brand-secondary);
    bottom: -20%;
    right: -10%;
  }
  .ed-mesh-blob-3 {
    background: var(--brand-accent);
    top: 25%;
    left: 30%;
    width: 45%;
    height: 55%;
    opacity: 0.55;
  }
  .ed-mesh-veil {
    position: absolute;
    inset: 0;
    background: var(--canvas);
    opacity: 0.55; /* tune 0.4-0.7 to balance brand presence vs legibility */
    pointer-events: none;
  }
  .ed-mesh-fg {
    position: relative;
    z-index: 1;
    padding: var(--gap-quiet);
    color: var(--ink);
    max-width: var(--measure-wide);
  }
</style>
```
