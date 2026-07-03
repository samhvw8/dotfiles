```html
<div class="bo-crt-overlay">
  <div class="bo-crt-scanlines"></div>
  <div class="bo-crt-grain"></div>
  <div class="bo-crt-vignette"></div>
</div>

<style>
  /*
    Three-layer atmosphere overlay. MUST sit at the top of every scene's
    z-stack (above content). Scanlines + grain on all scenes; vignette only
    on dark surfaces. Without this, the scene reads as broken — the arcade
    context evaporates.
  */
  .bo-crt-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 100;
  }
  .bo-crt-scanlines {
    position: absolute;
    inset: 0;
    background: var(--scanline-overlay);
    mix-blend-mode: multiply;
    z-index: 2;
  }
  .bo-crt-grain {
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    z-index: 1;
  }
  .bo-crt-vignette {
    position: absolute;
    inset: 0;
    background: var(--crt-vignette);
    z-index: 3;
  }
  /* Light surfaces omit the vignette — they're "boot screens", not "in-game". */
  .bo-crt-overlay.light .bo-crt-vignette {
    display: none;
  }
</style>
```
