```html
<hr class="se-dashed-rule" />
<style>
  /* Soft-editorial's signature divider — 1px DASHED warm ink at low opacity.
     Used inside cards (matrix dividers, column rules, source-line markers) and
     between major sections of a scene. The dashed treatment is the notebook-
     margin feel — solid hairlines belong to the Swiss/editorial preset, not
     here. For a heavier divider (head-row underlines, primary column rules),
     swap class to .se-dashed-rule-solid which uses --rule-solid (1.5px solid). */
  .se-dashed-rule {
    border: none;
    border-top: var(--rule-dashed);
    margin: var(--gap-cards) 0;
    height: 0;
  }
  .se-dashed-rule-solid {
    border: none;
    border-top: var(--rule-solid);
    margin: var(--gap-cards) 0;
    height: 0;
  }
</style>
```
