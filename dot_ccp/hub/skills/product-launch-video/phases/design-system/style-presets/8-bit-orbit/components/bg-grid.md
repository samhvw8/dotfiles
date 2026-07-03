```html
<div class="bo-bg-grid"></div>

<style>
  /*
    40px grid wallpaper. Default is brand-primary lines etched onto canvas-void
    at low opacity (dark scenes). Variants flip to brand-color ground with
    low-opacity navy grid lines (light scenes). One of these MUST be present
    on every scene — the grid is what makes the canvas read as "in-game"
    instead of generic web.
  */
  .bo-bg-grid {
    position: absolute;
    inset: 0;
    background-color: var(--canvas-void);
    background-image:
      linear-gradient(
        color-mix(in srgb, var(--brand-primary) 8%, transparent) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--brand-primary) 8%, transparent) 1px,
        transparent 1px
      );
    background-size: var(--bg-grid-size);
    z-index: 0;
    pointer-events: none;
  }
  .bo-bg-grid.primary {
    background-color: var(--brand-primary);
    background-image:
      linear-gradient(color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px, transparent 1px),
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px,
        transparent 1px
      );
  }
  .bo-bg-grid.secondary {
    background-color: var(--brand-secondary);
    background-image:
      linear-gradient(color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px, transparent 1px),
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px,
        transparent 1px
      );
  }
  .bo-bg-grid.accent {
    background-color: var(--brand-accent);
    background-image:
      linear-gradient(color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px, transparent 1px),
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--canvas-navy) 12%, transparent) 1px,
        transparent 1px
      );
  }
</style>
```
