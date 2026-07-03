```html
<!--
  390×506 vertical menu, light-tinted glass (text reads dark). For dense
  popovers — context menus, settings panes, command palettes.
-->
<div id="glass-menu" class="glass-panel menu-panel liquid-glass"></div>
<div class="text-overlay menu-text" style="top: 270px; left: 800px;">
  <div class="menu-item"><span>{ITEM_1}</span><span class="menu-kbd">{KBD_1}</span></div>
  <div class="menu-item"><span>{ITEM_2}</span><span class="menu-kbd">{KBD_2}</span></div>
  <div class="menu-sep"></div>
  <div class="menu-item"><span>{ITEM_3}</span><span class="menu-kbd">{KBD_3}</span></div>
</div>
<style>
  .menu-panel {
    width: 390px;
    height: 506px;
    background: var(--lg-glass-tint-menu);
    /* Menu archetype — see preset.md §B for tuning. */
    --lg-blur: var(--lg-menu-blur);
    --lg-refraction: var(--lg-menu-refraction);
    --lg-corner-radius: var(--lg-menu-corner-radius);
    --lg-z-radius: var(--lg-menu-z-radius);
    --lg-specular: var(--lg-menu-specular);
    --lg-fresnel: var(--lg-menu-fresnel);
    --lg-edge-highlight: var(--lg-menu-edge-highlight);
    --lg-chrom-aberration: var(--lg-menu-chrom-aberration);
    --lg-tint: var(--lg-menu-tint);
    --lg-brightness: var(--lg-menu-brightness);
    --lg-saturation: var(--lg-menu-saturation);
  }
  .menu-text {
    width: 390px;
    height: 506px;
    display: flex;
    flex-direction: column;
    padding: 18px 0;
    border-radius: 30px;
    overflow: hidden;
  }
  .menu-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 28px;
    font-size: 26px;
    font-weight: 650;
    color: var(--ink-on-light-glass);
    text-shadow: 0 1px 0 var(--lg-light-emboss);
  }
  .menu-kbd {
    margin-left: auto;
    font-size: 24px;
    font-weight: 650;
    color: var(--lg-kbd-ink);
    font-variant-numeric: tabular-nums;
  }
  .menu-sep {
    height: 1px;
    margin: 10px 28px;
    background: linear-gradient(90deg, transparent, var(--lg-rim-track), transparent);
  }
</style>
```
