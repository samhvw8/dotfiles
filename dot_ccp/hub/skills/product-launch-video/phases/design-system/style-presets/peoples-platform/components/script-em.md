```html
<div class="pp-script-em">
  <div class="pp-script-em-line">
    <span>{SCRIPT_BEFORE}</span><span class="pp-script-em-word">{SCRIPT_WORD}</span
    ><span>{SCRIPT_AFTER}</span>
  </div>
</div>

<style>
  .pp-script-em {
    position: relative;
    padding: 80px 96px;
    background: var(--paper);
    background-image: var(--grain-image);
    background-size: var(--grain-size);
    background-position: var(--grain-offset);
    background-blend-mode: multiply;
    color: var(--ink);
    min-height: 600px;
    display: flex;
    align-items: center;
  }
  .pp-script-em-line {
    font-family: "Alfa Slab One", serif;
    font-size: clamp(96px, 11vw, 180px);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: 0.005em;
    text-transform: uppercase;
    color: var(--blue);
    text-shadow: 6px 6px 0 var(--red);
    max-width: 18ch;
  }
  .pp-script-em-word {
    display: inline-block;
    font-family: "Caveat Brush", cursive;
    font-size: 1.05em;
    text-transform: lowercase;
    color: var(--red);
    transform: rotate(var(--tilt-script));
    margin: 0 0.12em;
    text-shadow: none;
  }
</style>
```
