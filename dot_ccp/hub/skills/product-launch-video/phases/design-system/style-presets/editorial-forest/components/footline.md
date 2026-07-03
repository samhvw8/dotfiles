```html
<!-- Editorial Forest footline: mono caption row spanning the bottom of cover,
     statement, KPI, and summary scenes. Two mono strings (section / byline,
     source / index, etc.) at the left and right edges. Not used on routine
     content scenes — reserve it for the "this feels like a printed page"
     moments. -->
<footer class="ef-footline">
  <span>{LEFT}</span>
  <span>{RIGHT}</span>
</footer>

<style>
  .ef-footline {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--brand-primary);
  }
  /* Surface variants — same contract as ef-topbar:
       .ef-on-green  .ef-footline { color: var(--brand-secondary); }
       .ef-on-pink   .ef-footline { color: var(--ef-green-deep); }
       .ef-on-cream  .ef-footline { color: var(--brand-primary); }  // default */
</style>
```
