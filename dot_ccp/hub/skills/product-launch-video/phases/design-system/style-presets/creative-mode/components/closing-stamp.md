```html
<!-- closing-stamp: signature rotated square with circular cream inner border.
     Belongs on the closing scene over a brand-primary canvas. -->
<div class="cm-closing-stamp" aria-hidden="true">
  <div class="cm-closing-stamp-inner">
    <div class="cm-closing-stamp-num">{NUM}</div>
    <div class="cm-closing-stamp-lbl">{LABEL}</div>
  </div>
</div>

<style>
  .cm-closing-stamp {
    position: relative;
    width: 17.7vw;
    height: 17.7vw;
    background: var(--brand-secondary);
    border: 4px solid var(--canvas);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(var(--tilt-stamp));
  }
  .cm-closing-stamp-inner {
    width: 14.6vw;
    height: 14.6vw;
    border: 4px solid var(--canvas);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1vw;
    box-sizing: border-box;
    color: var(--canvas);
  }
  .cm-closing-stamp-num {
    font-family: "Archivo Black", "Anton", sans-serif;
    font-size: 3.3vw;
    line-height: 0.9;
    margin-bottom: 0.5vw;
    color: inherit;
  }
  .cm-closing-stamp-lbl {
    font-family: "JetBrains Mono", monospace;
    font-size: 1.25vw;
    letter-spacing: var(--mono-track-mid);
    text-transform: uppercase;
    margin-top: 0.3vw;
    color: inherit;
  }
</style>
```
