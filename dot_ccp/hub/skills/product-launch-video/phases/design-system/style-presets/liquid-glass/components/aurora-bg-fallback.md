```html
<!--
  CSS-only aurora fallback. Use ONLY when:
    (a) the runtime does not support WebGPU, or
    (b) you want a still preview thumbnail of the scene.
  When the IIFE runtime IS active, this is invisible (z-index: 0 covers it).
  In the full pipeline, the aurora shader inside <canvas id="three-canvas">
  takes over — see liquid-stage.md for how the canvases stack.
-->
<div class="aurora-bg"></div>
<style>
  .aurora-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 90% 60% at 22% 28%,
        color-mix(in oklab, var(--brand-primary) 70%, transparent),
        transparent 60%
      ),
      radial-gradient(
        ellipse 80% 60% at 82% 78%,
        color-mix(in oklab, var(--brand-secondary) 60%, transparent),
        transparent 60%
      ),
      radial-gradient(
        ellipse 70% 50% at 58% 18%,
        color-mix(in oklab, var(--brand-accent) 50%, transparent),
        transparent 60%
      ),
      var(--liquid-bg-fallback);
    filter: blur(80px) saturate(1.15);
  }
</style>
```
