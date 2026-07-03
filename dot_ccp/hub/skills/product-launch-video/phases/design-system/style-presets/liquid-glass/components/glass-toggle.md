```html
<!--
  640×64 segmented control with a sliding active pill. Three segments by
  default — tween `.toggle-active-pill { transform: translateX(...) }` to
  move the highlight between options. Active segment's text stays pure white
  (--lg-glint-white); inactive segments are 96% opacity white (--ink-on-glass).

  Suggested motion: pill slides between positions with EASE.emphasis
  (power3.inOut) over DUR.snap. Trigger at the same time as the corresponding
  scene focus shift.
-->
<div id="glass-toggle" class="glass-panel toggle-panel liquid-glass"></div>
<div class="text-overlay toggle-text" style="top: 390px; left: 640px;">
  <div class="toggle-active-pill"></div>
  <div class="toggle-item active">{ITEM_1}</div>
  <div class="toggle-item">{ITEM_2}</div>
  <div class="toggle-item">{ITEM_3}</div>
</div>
<style>
  .toggle-panel {
    width: 640px;
    height: 64px;
    /* Notification archetype, pill-radius corner override for the full-pill shape. */
    --lg-blur: var(--lg-notif-blur);
    --lg-refraction: var(--lg-notif-refraction);
    --lg-corner-radius: 44; /* override: pill, not the 36 notif default */
    --lg-z-radius: var(--lg-notif-z-radius);
    --lg-specular: var(--lg-notif-specular);
    --lg-fresnel: var(--lg-notif-fresnel);
    --lg-edge-highlight: var(--lg-notif-edge-highlight);
    --lg-chrom-aberration: var(--lg-notif-chrom-aberration);
    --lg-saturation: var(--lg-notif-saturation);
    --lg-shadow-opacity: var(--lg-notif-shadow-opacity);
    --lg-shadow-spread: var(--lg-notif-shadow-spread);
    --lg-shadow-offset-y: var(--lg-notif-shadow-offset-y);
  }
  .toggle-text {
    width: 640px;
    height: 64px;
    position: relative;
    display: flex;
    align-items: stretch;
    padding: 6px;
    border-radius: 44px;
  }
  .toggle-active-pill {
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 0;
    width: calc((100% - 12px) / 3);
    height: calc(100% - 12px);
    border-radius: 999px;
    background:
      radial-gradient(circle at 28% 18%, var(--lg-rim-glow), transparent 42%), var(--lg-rim-glint);
    box-shadow:
      inset 0 1px 0 var(--lg-rim-glow),
      inset 0 -1px 0 var(--lg-rim-haze);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .toggle-item {
    flex: 1;
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink-on-glass);
    line-height: 52px;
    text-shadow: var(--text-shadow-glass);
  }
  .toggle-item.active {
    color: var(--lg-glint-white);
  }
</style>
```
