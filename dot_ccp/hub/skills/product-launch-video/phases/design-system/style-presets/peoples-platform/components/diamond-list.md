```html
<div class="pp-diamond-list">
  <h3 class="pp-diamond-list-h">{HEADLINE} <em class="pp-diamond-list-em">{SCRIPT_WORD}</em></h3>
  <ul class="pp-diamond-list-items">
    <li>{ITEM_1}</li>
    <li>{ITEM_2}</li>
    <li>{ITEM_3}</li>
  </ul>
</div>

<style>
  .pp-diamond-list {
    display: flex;
    flex-direction: column;
    gap: 40px;
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
  .pp-diamond-list-h {
    margin: 0;
    font-family: "Alfa Slab One", serif;
    font-size: clamp(80px, 9vw, 140px);
    font-weight: 400;
    line-height: 0.9;
    text-transform: uppercase;
    color: var(--blue);
    text-shadow: 6px 6px 0 var(--red);
    max-width: 14ch;
  }
  .pp-diamond-list-em {
    font-style: normal;
    color: var(--orange);
    text-shadow: 6px 6px 0 var(--red);
  }
  .pp-diamond-list-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .pp-diamond-list-items li {
    font-family: "Archivo Narrow", sans-serif;
    font-size: clamp(28px, 2.4vw, 40px);
    font-weight: 500;
    line-height: 1.35;
    color: var(--ink);
    padding-left: 54px;
    position: relative;
    max-width: 32ch;
  }
  .pp-diamond-list-items li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.45em;
    width: var(--bullet-diamond);
    height: var(--bullet-diamond);
    background: var(--red);
    transform: rotate(45deg);
  }
</style>
```
