```html
<div class="bn-rules">
  <div class="bn-rules-col bn-rules-do">
    <h3>DO.</h3>
    <ul>
      <li>{DO_1}</li>
      <li>{DO_2}</li>
      <li>{DO_3}</li>
    </ul>
  </div>
  <div class="bn-rules-col bn-rules-dont">
    <h3>DON'T.</h3>
    <ul>
      <li>{DONT_1}</li>
      <li>{DONT_2}</li>
      <li>{DONT_3}</li>
    </ul>
  </div>
</div>
<style>
  .bn-rules {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(16px, 2vw, 32px);
  }
  .bn-rules-col {
    border: var(--border-bold);
    box-shadow: var(--shadow-hard);
    padding: clamp(24px, 3vw, 32px);
  }
  .bn-rules-do {
    background: var(--deco-2);
    transform: rotate(var(--tilt-l));
  }
  .bn-rules-dont {
    background: var(--canvas);
    transform: rotate(var(--tilt-r));
  }
  .bn-rules-col h3 {
    font-size: clamp(36px, 5vw, 64px);
    margin: 0 0 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .bn-rules-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .bn-rules-col li {
    display: grid;
    grid-template-columns: 2em 1fr;
    gap: 10px;
    padding: 12px 14px;
    background: var(--canvas);
    border: 3px solid var(--ink);
    box-shadow: 4px 4px 0 var(--ink);
    font-size: 24px;
    line-height: 1.45;
    font-weight: 500;
  }
  .bn-rules-dont li {
    background: var(--brand-primary);
  }
  .bn-rules-col li::before {
    font-size: 28px;
    font-weight: 900;
    align-self: center;
    text-align: center;
    width: 1.6em;
    height: 1.6em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--ink);
  }
  .bn-rules-do li::before {
    content: "✓";
    background: var(--brand-accent);
  }
  .bn-rules-dont li::before {
    content: "✗";
    background: var(--deco-4);
  }
  @media (max-width: 720px) {
    .bn-rules {
      grid-template-columns: 1fr;
    }
  }
</style>
```
