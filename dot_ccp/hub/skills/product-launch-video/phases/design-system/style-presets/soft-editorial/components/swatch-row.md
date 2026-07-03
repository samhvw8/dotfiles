```html
<!-- Cover swatch row — three pastel discs at 56px each, rotating the brand's
     three colors. The visual signature of the deck's color philosophy.
     Lives at top-right of cover scenes; can also anchor a palette / system
     scene as a centered horizontal row. -->
<div class="se-swatch-row" aria-hidden="true">
  <i class="se-swatch-dot se-swatch-dot-1"></i>
  <i class="se-swatch-dot se-swatch-dot-2"></i>
  <i class="se-swatch-dot se-swatch-dot-3"></i>
</div>
<style>
  .se-swatch-row {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .se-swatch-dot {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-pill);
    display: block;
  }
  .se-swatch-dot-1 {
    background: var(--brand-primary);
  }
  .se-swatch-dot-2 {
    background: var(--brand-secondary);
  }
  .se-swatch-dot-3 {
    background: var(--brand-accent);
  }
</style>
```
