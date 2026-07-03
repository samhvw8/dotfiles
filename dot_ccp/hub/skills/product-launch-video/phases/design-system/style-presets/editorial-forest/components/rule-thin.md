```html
<!-- Editorial Forest rule-thin: 2px hairline section separator. The system's
     separator language. Always solid, always 2px (never 1px, never 3px+). Color
     follows the region's accent: green on cream, pink on green, green-deep on
     pink. Use above KPI rows, summary grids, meta-dls, and chart axes. -->
<hr class="ef-rule-thin" />

<style>
  .ef-rule-thin {
    border: 0;
    border-top: var(--ef-rule-weight) solid var(--brand-primary);
    margin: 0;
    width: 100%;
    height: 0;
    /* Surface overrides — drop one of these on a wrapper element:
         .ef-on-green  .ef-rule-thin { border-top-color: var(--brand-secondary); }
         .ef-on-pink   .ef-rule-thin { border-top-color: var(--ef-green-deep); }
         .ef-on-cream  .ef-rule-thin { border-top-color: var(--brand-primary); } // default */
  }
</style>
```
