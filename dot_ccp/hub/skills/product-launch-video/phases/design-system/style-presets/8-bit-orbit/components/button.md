```html
<button class="bo-button">{LABEL}</button>

<style>
  .bo-button {
    display: inline-block;
    background: var(--brand-primary);
    color: var(--canvas-navy);
    padding: 16px 36px;
    border: none;
    cursor: pointer;
    font-family: "Tektur", cursive;
    font-size: clamp(24px, 1.4vw, 28px);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    position: relative;
    box-shadow: var(--shadow-pixel-stack-primary);
  }
  /* Accent variant: swap body color to accent + use the secondary shadow stack. */
  .bo-button.accent {
    background: var(--brand-accent);
    box-shadow: var(--shadow-pixel-stack-secondary);
  }
</style>
```
