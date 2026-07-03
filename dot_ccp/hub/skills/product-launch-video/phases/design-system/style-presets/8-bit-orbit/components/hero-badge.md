```html
<div class="bo-hero-badges">
  <span class="bo-hero-badge">{LABEL}</span>
  <span class="bo-hero-badge">{LABEL}</span>
  <span class="bo-hero-badge">{LABEL}</span>
</div>

<style>
  /*
    Outline-only badge used in CLUSTERS under hero headlines (not a chip).
    Differs from `chip` (which is filled navy with neon text): hero-badge
    has only a 2px brand-secondary border + matching text, no fill — a
    lighter accent register that reads as a feature/spec tag rather than
    a section label. Cluster them 2-4 abreast under hero text on the
    "intro" / "cover" beat.

    Scene workers: do NOT mix hero-badge with chip in the same cluster.
    Pick one register per scene.
  */
  .bo-hero-badges {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 32px;
  }
  .bo-hero-badge {
    font-family: "Space Mono", monospace;
    font-size: 24px;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 8px 16px;
    border: 2px solid var(--brand-secondary);
    color: var(--brand-secondary);
    background: transparent;
  }
  .bo-hero-badge.accent {
    border-color: var(--brand-accent);
    color: var(--brand-accent);
  }
</style>
```
