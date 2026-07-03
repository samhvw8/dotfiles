```html
<div class="bo-starfield">
  <span class="bo-star" style="left:8%; top:14%;"></span>
  <span class="bo-star bo-star-secondary" style="left:22%; top:62%;"></span>
  <span class="bo-star bo-star-accent" style="left:38%; top:28%;"></span>
  <span class="bo-star" style="left:55%; top:78%;"></span>
  <span class="bo-star bo-star-secondary" style="left:68%; top:18%;"></span>
  <span class="bo-star" style="left:82%; top:46%;"></span>
  <span class="bo-star bo-star-accent" style="left:92%; top:72%;"></span>
  <span class="bo-star" style="left:14%; top:88%;"></span>
  <span class="bo-star bo-star-secondary" style="left:48%; top:52%;"></span>
  <span class="bo-star" style="left:76%; top:84%;"></span>
</div>

<style>
  /*
    Container of small 4-6px colored squares (brand-primary default,
    brand-secondary + brand-accent variants) positioned absolutely.
    Dark surfaces only. Phase 4b: drive the twinkle via GSAP timeline
    instead of CSS @keyframes (CSS animation is forbidden in scene HTML).
    Use sine.inOut on opacity 0.2 → 1.
  */
  .bo-starfield {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  .bo-star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--brand-primary);
    opacity: 0.6;
  }
  .bo-star.bo-star-secondary {
    background: var(--brand-secondary);
    width: 6px;
    height: 6px;
  }
  .bo-star.bo-star-accent {
    background: var(--brand-accent);
    width: 5px;
    height: 5px;
  }
</style>
```
