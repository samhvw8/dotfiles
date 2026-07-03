```html
<div class="bn-manifesto">
  <span class="bn-manifesto-num">— MANIFESTO</span>
  <p class="bn-manifesto-text">{HEADLINE_WITH_EM}</p>
</div>
<style>
  /* Big declarative pull-quote. Wrap key words in <em> tags to get the
   inverse-block highlight (black bg + accent color). */
  .bn-manifesto {
    background: var(--brand-accent);
    border: var(--border-bold);
    border-top: var(--border-loud);
    border-bottom: var(--border-loud);
    padding: clamp(40px, 6vw, 80px) clamp(32px, 5vw, 64px);
    display: grid;
    grid-template-columns: 10em 1fr;
    gap: clamp(24px, 4vw, 48px);
    align-items: start;
  }
  .bn-manifesto-num {
    display: inline-block;
    border: var(--border-bold);
    background: var(--canvas);
    padding: 6px 14px;
    font-family: ui-monospace, monospace;
    font-size: 24px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    box-shadow: 4px 4px 0 var(--ink);
  }
  .bn-manifesto-text {
    margin: 0;
    font-weight: 800;
    font-size: clamp(28px, 4vw, 60px);
    line-height: 1.05;
    letter-spacing: -0.025em;
    text-transform: uppercase;
    max-width: 22ch;
  }
  .bn-manifesto-text em {
    font-style: normal;
    background: var(--ink);
    color: var(--brand-accent);
    padding: 0 0.15em;
  }
  @media (max-width: 720px) {
    .bn-manifesto {
      grid-template-columns: 1fr;
    }
  }
</style>
```
