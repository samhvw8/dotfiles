```html
<div class="cm-stat-counter">
  <div class="cm-stat-corner">/01</div>
  <div class="cm-stat-num">{NUM}</div>
  <div class="cm-stat-meta">
    <div class="cm-stat-lbl">{LABEL}</div>
    <div class="cm-stat-desc">{LEDE}</div>
  </div>
</div>

<style>
  .cm-stat-counter {
    position: relative;
    background: var(--brand-primary);
    color: var(--canvas);
    border: var(--border-structural);
    padding: 1.45vw 1.65vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 16vw;
    overflow: hidden;
  }
  .cm-stat-corner {
    position: absolute;
    top: 1.25vw;
    right: 1.45vw;
    font-family: "JetBrains Mono", monospace;
    font-size: 1.25vw;
    letter-spacing: var(--mono-track-mid);
    text-transform: uppercase;
    color: inherit;
    opacity: 0.85;
  }
  .cm-stat-num {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 5vw;
    line-height: 0.9;
    color: inherit;
    margin-top: 1.65vw;
  }
  .cm-stat-meta {
    margin-top: 0.4vw;
  }
  .cm-stat-lbl {
    font-family: "JetBrains Mono", monospace;
    font-size: 1.25vw;
    letter-spacing: var(--mono-track-mid);
    text-transform: uppercase;
    color: inherit;
  }
  .cm-stat-desc {
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.25vw;
    line-height: 1.3;
    margin-top: 0.3vw;
    max-width: 27vw;
    color: inherit;
    opacity: 0.85;
  }
</style>
```
