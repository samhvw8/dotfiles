```html
<div class="bn-mesh">
  <div class="bn-mesh-blob bn-mesh-blob-1"></div>
  <div class="bn-mesh-blob bn-mesh-blob-2"></div>
  <div class="bn-mesh-blob bn-mesh-blob-3"></div>
  <div class="bn-mesh-fg">{FOREGROUND_CONTENT}</div>
</div>
<style>
  /* Brand-color blobs blurred behind solid black foreground frame. */
  .bn-mesh {
    position: relative;
    overflow: hidden;
    background: var(--canvas);
    border: var(--border-bold);
    box-shadow: var(--shadow-hard);
    min-height: 320px; /* preview only — drop when used full-bleed in scene */
  }
  .bn-mesh-blob {
    position: absolute;
    width: 60%;
    height: 70%;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
  .bn-mesh-blob-1 {
    background: var(--brand-primary);
    top: -10%;
    left: -10%;
  }
  .bn-mesh-blob-2 {
    background: var(--brand-secondary);
    bottom: -15%;
    right: -10%;
  }
  .bn-mesh-blob-3 {
    background: var(--brand-accent);
    top: 30%;
    left: 35%;
    width: 40%;
    height: 50%;
  }
  .bn-mesh-fg {
    position: relative;
    z-index: 1;
    padding: clamp(48px, 6vw, 96px);
    color: var(--ink);
  }
</style>
```
