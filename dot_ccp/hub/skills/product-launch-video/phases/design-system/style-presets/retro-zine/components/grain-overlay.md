```html
<div class="rz-grain-overlay"></div>

<style>
  /*
    SVG fractal-noise overlay sitting fixed at full viewport above every
    scene's content (z-index 9999). Tints all surfaces with print grain
    at 0.07 opacity. REQUIRED on every scene — removing the grain breaks
    the printed-paper register immediately.

    Pointer-events disabled. Never animate (a moving grain reads as TV
    static, not paper texture).
  */
  .rz-grain-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: var(--grain-opacity);
    background-image: var(--grain-svg);
    background-size: var(--grain-tile);
  }
</style>
```
