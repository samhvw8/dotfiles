```html
<!--
  Mandatory wrapper. EVERY liquid-glass scene starts with this. It sets up
  the two canvases the IIFE needs (#three-canvas for aurora, #glass-canvas
  for the refraction pass) and the text-overlay layer. Put your glass panels
  inside #glass-canvas (with class="liquid-glass") and your text inside
  .text-overlay (positioned absolutely to match the panel underneath).

  The sample widget/notification/pill below are PREVIEW SAMPLES — delete
  them when authoring a real scene and replace with the panels you actually
  need. They exist so design.html shows what a populated stage looks like.
-->
<div class="liquid-stage">
  <canvas id="three-canvas" width="1920" height="1080"></canvas>
  <div class="aurora-bg-preview"></div>
  <canvas id="glass-canvas" layoutsubtree width="1920" height="1080">
    <div class="glass-panel widget-card liquid-glass" style="top: 320px; left: 240px;"></div>
    <div class="glass-panel notif-panel liquid-glass" style="top: 200px; left: 1140px;"></div>
    <div class="glass-panel pill-chip liquid-glass" style="top: 760px; left: 340px;"></div>
    <div class="glass-panel pill-chip liquid-glass" style="top: 760px; left: 510px;"></div>
    <div class="glass-panel pill-chip liquid-glass" style="top: 760px; left: 680px;"></div>
  </canvas>
  <div class="text-overlay-root">
    <div class="text-overlay stat-text" style="top: 320px; left: 240px;">
      <span class="stat-label">SAMPLE</span>
      <span class="stat-value">42</span>
    </div>
    <div class="text-overlay notif-card" style="top: 200px; left: 1140px;">
      <div class="notif-avatar" style="background: var(--brand-primary);">H</div>
      <div class="notif-body">
        <div class="notif-title">Glass surfaces</div>
        <div class="notif-msg">Float above the aurora field.</div>
      </div>
    </div>
    <div class="text-overlay pill-text" style="top: 760px; left: 340px;">
      <span class="pill-dot" style="background: var(--brand-accent);"></span>
      <span class="pill-label">Live</span>
    </div>
    <div class="text-overlay pill-text" style="top: 760px; left: 510px;">
      <span class="pill-dot" style="background: var(--brand-secondary);"></span>
      <span class="pill-label">Synced</span>
    </div>
    <div class="text-overlay pill-text" style="top: 760px; left: 680px;">
      <span class="pill-dot" style="background: var(--brand-primary);"></span>
      <span class="pill-label">Ready</span>
    </div>
  </div>
</div>
<style>
  .liquid-stage {
    position: relative;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: var(--liquid-bg-deep);
    /* Preview-only: scale down so the 1920x1080 stage fits inside the
       design.html .comp-preview container. When the stage is used in a real
       scene the parent isn't .comp-preview, so this rule won't apply. */
  }
  .comp-preview .liquid-stage {
    transform: scale(0.32);
    transform-origin: top left;
    margin-bottom: -733px; /* = 1080 * (1 - 0.32) to reclaim space */
    margin-right: -1305px;
  }
  #three-canvas,
  #glass-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 1920px;
    height: 1080px;
  }
  #three-canvas {
    z-index: 0;
  }
  #glass-canvas {
    z-index: 1;
  }
  .text-overlay-root {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }
  /* Preview-only: a CSS aurora to stand in for the Three.js shader that
     paints #three-canvas in production. The real shader gets pasted from
     registry — see §H. */
  .aurora-bg-preview {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 60% 50% at 22% 28%,
        color-mix(in oklab, var(--brand-primary) 65%, transparent),
        transparent 65%
      ),
      radial-gradient(
        ellipse 55% 45% at 78% 72%,
        color-mix(in oklab, var(--brand-secondary) 55%, transparent),
        transparent 65%
      ),
      radial-gradient(
        ellipse 45% 40% at 58% 22%,
        color-mix(in oklab, var(--brand-accent) 45%, transparent),
        transparent 65%
      ),
      var(--liquid-bg-fallback);
    filter: blur(60px) saturate(1.2);
  }
  /*
   * .glass-panel WITH IIFE runtime: the div is overwritten by the
   * liquid-glass.iife.js draw pass — these styles are invisible.
   *
   * WITHOUT runtime (e.g. this design.html preview, or a fallback render):
   * the rules below produce a "frosted-card" approximation so the layout
   * is still legible. Not a true refraction, but readable.
   */
  .glass-panel {
    position: absolute;
    background: var(--lg-rim-veil);
    backdrop-filter: blur(28px) saturate(1.4);
    -webkit-backdrop-filter: blur(28px) saturate(1.4);
    border: 1px solid var(--lg-rim-edge);
    border-radius: 28px;
    box-shadow:
      inset 0 1px 0 var(--lg-rim-mid-soft),
      inset 0 -1px 0 var(--lg-rim-veil),
      0 18px 48px var(--lg-base-shadow-deep);
  }
</style>
```
