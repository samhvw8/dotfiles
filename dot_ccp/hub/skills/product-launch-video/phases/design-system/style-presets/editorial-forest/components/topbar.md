```html
<!-- Editorial Forest topbar: every scene's editorial spine. Mono label on the
     left, monogram circle (or mono counter / location string) on the right.
     Baseline-aligned; lives at the top edge of every scene. Without it, the
     scene loses its editorial anchor. -->
<header class="ef-topbar">
  <span class="ef-topbar-label">{LABEL}</span>
  <span class="ef-topbar-counter">01 &middot; 08</span>
</header>

<style>
  .ef-topbar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 32px;
    width: 100%;
    color: var(--brand-primary);
  }
  .ef-topbar-label {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: var(--ef-track-label);
    text-transform: uppercase;
    color: inherit;
    white-space: nowrap;
  }
  .ef-topbar-counter {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: var(--ef-track-caption);
    text-transform: uppercase;
    color: inherit;
    white-space: nowrap;
  }
  /* Surface variants — override label/counter color on dark surfaces:
       .ef-on-green  .ef-topbar { color: var(--brand-secondary); }
       .ef-on-pink   .ef-topbar { color: var(--ef-green-deep); }
       .ef-on-cream  .ef-topbar { color: var(--brand-primary); }  // default */
</style>
```
