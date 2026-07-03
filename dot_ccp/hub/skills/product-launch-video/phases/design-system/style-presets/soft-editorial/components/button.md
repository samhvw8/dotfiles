```html
<button class="se-button">{LABEL} <span class="se-button-arrow">→</span></button>
<style>
  /* Subtle text-link button — Cormorant Garamond italic, dashed-underline on
     hover, no fill, no border, no shadow. Soft-editorial does not commit to a
     "loud" CTA — the action is a quiet invitation, not a sales pitch.
     For a stronger CTA, use the action-bar component instead. */
  .se-button {
    background: transparent;
    color: var(--ink);
    border: none;
    border-bottom: 1.5px dashed color-mix(in srgb, var(--ink) 35%, transparent);
    padding: 8px 0;
    font-family: var(--font-display, "Cormorant Garamond", serif);
    font-weight: 500;
    font-style: italic;
    font-size: clamp(26px, 1.8vw, 32px);
    line-height: 1.2;
    cursor: pointer;
    letter-spacing: -0.005em;
  }
  .se-button:hover {
    border-bottom-color: var(--brand-primary);
  }
  .se-button-arrow {
    display: inline-block;
    margin-left: 10px;
    font-style: normal;
    transition: transform 0.5s ease;
  }
  .se-button:hover .se-button-arrow {
    transform: translateX(6px);
  }
</style>
```
