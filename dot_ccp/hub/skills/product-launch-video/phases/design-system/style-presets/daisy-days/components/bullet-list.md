```html
<!-- Storybook bullet list: outlined colored discs (not glyphs) sit 4px from
     the top of each line. Default fill is butter-yellow tint of brand-secondary. -->
<ul class="dc-bullet-list">
  <li>{LEFT}</li>
  <li>{RIGHT}</li>
  <li>{LEDE}</li>
</ul>

<style>
  .dc-bullet-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
    margin: 0;
  }
  .dc-bullet-list li {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: clamp(24px, 1.5vw, 28px);
    line-height: 1.5;
    color: var(--ink);
    padding-left: 2.2rem;
    position: relative;
  }
  .dc-bullet-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    background: color-mix(in srgb, var(--brand-secondary) 45%, var(--anchor-butter));
    border: var(--border-thin);
    border-radius: 50%;
  }
  .dc-bullet-list li:nth-child(2)::before {
    background: color-mix(in srgb, var(--brand-primary) 35%, var(--anchor-mint));
  }
  .dc-bullet-list li:nth-child(3)::before {
    background: color-mix(in srgb, var(--brand-accent) 35%, var(--anchor-sky));
  }
</style>
```
