```html
<div class="bo-pixel-particles">
  <span class="bo-particle" style="left:12%; top:24%;"></span>
  <span class="bo-particle bo-particle-accent" style="left:34%; top:68%;"></span>
  <span class="bo-particle bo-particle-secondary" style="left:58%; top:38%;"></span>
  <span class="bo-particle" style="left:74%; top:82%;"></span>
  <span class="bo-particle bo-particle-accent" style="left:88%; top:22%;"></span>
  <span class="bo-particle bo-particle-secondary" style="left:22%; top:92%;"></span>
  <span class="bo-particle" style="left:46%; top:14%;"></span>
  <span class="bo-particle bo-particle-accent" style="left:64%; top:54%;"></span>
</div>

<style>
  /*
    Floating 8px colored squares — decorative ambient layer on hero / CTA beats.
    Dark surfaces only. Phase 4b: drive vertical drift via GSAP timeline (8s float,
    sine.inOut, amplitude ±16-24px). Do not use CSS @keyframes — animation is
    forbidden in scene HTML; the timeline handles it.
  */
  .bo-pixel-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }
  .bo-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--brand-primary);
    opacity: 0.7;
  }
  .bo-particle.bo-particle-accent {
    background: var(--brand-accent);
  }
  .bo-particle.bo-particle-secondary {
    background: var(--brand-secondary);
  }
</style>
```
