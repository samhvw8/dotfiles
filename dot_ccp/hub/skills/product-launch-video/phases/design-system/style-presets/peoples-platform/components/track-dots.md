```html
<div class="pp-track-dots">
  <h3 class="pp-track-dots-h">{HEADLINE}</h3>
  <div class="pp-track-dots-line"></div>
  <div class="pp-track-dots-nodes">
    <div class="pp-track-dots-node">
      <span class="pp-track-dots-dot"></span><span class="pp-track-dots-when">{LABEL_1}</span>
    </div>
    <div class="pp-track-dots-node pp-track-dots-alt">
      <span class="pp-track-dots-dot"></span><span class="pp-track-dots-when">{LABEL_2}</span>
    </div>
    <div class="pp-track-dots-node">
      <span class="pp-track-dots-dot"></span><span class="pp-track-dots-when">{LABEL_3}</span>
    </div>
    <div class="pp-track-dots-node pp-track-dots-alt">
      <span class="pp-track-dots-dot"></span><span class="pp-track-dots-when">{LABEL_4}</span>
    </div>
  </div>
</div>

<style>
  .pp-track-dots {
    display: flex;
    flex-direction: column;
    gap: 60px;
    padding: 96px 120px;
    background: var(--paper);
    background-image: var(--grain-image);
    background-size: var(--grain-size);
    background-position: var(--grain-offset);
    background-blend-mode: multiply;
    color: var(--ink);
    min-height: 600px;
    justify-content: center;
  }
  .pp-track-dots-h {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(80px, 9vw, 140px);
    font-weight: 400;
    line-height: 0.9;
    text-transform: uppercase;
    color: var(--blue);
    text-shadow: 6px 6px 0 var(--red);
  }
  .pp-track-dots-line {
    width: 100%;
    height: 14px;
    background: var(--ink);
    position: relative;
  }
  .pp-track-dots-nodes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .pp-track-dots-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
  .pp-track-dots-dot {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--orange);
    border: 6px solid var(--ink);
    box-shadow: 6px 6px 0 var(--red);
  }
  .pp-track-dots-alt .pp-track-dots-dot {
    background: var(--blue);
  }
  .pp-track-dots-when {
    font-family: "DM Mono", monospace;
    font-size: 27px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink);
    padding: 8px 16px;
    border: 3px solid var(--ink);
    border-radius: 999px;
  }
</style>
```
