```html
<!-- 520×118 floating toast. Slides in top-right. Pair with .notif-card text overlay. -->
<div id="glass-notif1" class="glass-panel notif-panel liquid-glass"></div>
<div class="text-overlay notif-card" style="top: 60px; left: 1340px;">
  <div class="notif-avatar" style="background: var(--brand-primary);">{INITIAL}</div>
  <div class="notif-body">
    <div class="notif-title">{TITLE}</div>
    <div class="notif-msg">{MESSAGE}</div>
  </div>
</div>
<style>
  .notif-panel {
    width: 520px;
    height: 118px;
    /* Notification archetype — see preset.md §B for tuning. */
    --lg-blur: var(--lg-notif-blur);
    --lg-refraction: var(--lg-notif-refraction);
    --lg-corner-radius: var(--lg-notif-corner-radius);
    --lg-z-radius: var(--lg-notif-z-radius);
    --lg-specular: var(--lg-notif-specular);
    --lg-fresnel: var(--lg-notif-fresnel);
    --lg-edge-highlight: var(--lg-notif-edge-highlight);
    --lg-chrom-aberration: var(--lg-notif-chrom-aberration);
    --lg-saturation: var(--lg-notif-saturation);
    --lg-shadow-opacity: var(--lg-notif-shadow-opacity);
    --lg-shadow-spread: var(--lg-notif-shadow-spread);
    --lg-shadow-offset-y: var(--lg-notif-shadow-offset-y);
  }
  .notif-card {
    width: 520px;
    height: 118px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--ink-on-glass);
    text-shadow: var(--text-shadow-glass);
  }
  .notif-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lg-glint-white);
    font-weight: 800;
    font-size: 24px;
    flex-shrink: 0;
  }
  .notif-body {
    flex: 1;
    min-width: 0;
  }
  .notif-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--ink-on-glass);
  }
  .notif-msg {
    font-size: 24px;
    font-weight: 550;
    color: var(--ink-on-glass-soft);
    margin-top: 2px;
  }
</style>
```
