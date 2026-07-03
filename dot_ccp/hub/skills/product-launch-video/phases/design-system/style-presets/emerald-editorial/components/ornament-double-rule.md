```html
<!-- The signature treatment: a centered serif word framed by two stacked
     4px horizontal rules on each side (3px gap). 19th-century playbill
     bracket. Drop this between two display lines around a connector word.
     Swap the literal "of" for the scene's actual connector word
     ("and", "for", "in", etc.) per copy. -->
<div class="ee-ornament-double-rule">
  <span class="ee-ornament-double-rule-lines"></span>
  <span class="ee-ornament-double-rule-word">of</span>
  <span class="ee-ornament-double-rule-lines"></span>
</div>

<style>
  .ee-ornament-double-rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 26px;
    width: 100%;
    color: var(--ink);
  }
  .ee-ornament-double-rule-word {
    font-family: "Bodoni Moda", "Playfair Display", Georgia, serif;
    font-weight: 800;
    font-size: 76px;
    line-height: 1;
    padding: 0 6px;
    letter-spacing: 0.02em;
  }
  .ee-ornament-double-rule-lines {
    flex: 1;
    height: var(--ee-ornament-height);
    position: relative;
  }
  .ee-ornament-double-rule-lines::before,
  .ee-ornament-double-rule-lines::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: var(--ee-ornament-rule-thickness);
    background: var(--ink);
  }
  .ee-ornament-double-rule-lines::before {
    top: 3px;
  }
  .ee-ornament-double-rule-lines::after {
    bottom: 3px;
  }
</style>
```
