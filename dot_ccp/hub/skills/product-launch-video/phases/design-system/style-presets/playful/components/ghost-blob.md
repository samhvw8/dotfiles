```html
<div class="pf-ghost-blob"></div>

<style>
  /*
    Oversized organic blob at 0.08 opacity, placed absolutely as atmospheric
    wallpaper. Anchored to a corner the primary content does not occupy. Max
    one per scene. Phase 4b: drive a slow drift via GSAP timeline (12-20s
    sine.inOut, amplitude ±20px translate + ±1deg rotate). Do not use CSS
    @keyframes — animation is forbidden in scene HTML.
  */
  .pf-ghost-blob {
    position: absolute;
    width: 360px;
    height: 360px;
    right: 5%;
    bottom: 10%;
    background: var(--ink);
    border-radius: var(--radius-blob-organic);
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
  }
  /* Variants — anchor to other corners. Use one per scene. */
  .pf-ghost-blob.top-left {
    left: 5%;
    top: 10%;
    right: auto;
    bottom: auto;
  }
  .pf-ghost-blob.top-right {
    right: 5%;
    top: 10%;
    bottom: auto;
  }
  .pf-ghost-blob.bottom-left {
    left: 5%;
    bottom: 10%;
    right: auto;
  }
</style>
```
