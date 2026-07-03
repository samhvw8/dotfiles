```html
<!--
  Uppercase Barlow Condensed chip. Two registers in one component:
    - Default (rectangular, 22px-radius card mini-tile) = generic label / category.
    - .pill (999px fully-rounded) = matrix-style status pill. Pair with one of
      the status variants below to apply the matrix color convention:
        .pill.yes   → teal-equivalent (brand-accent), bone text
        .pill.part  → mustard-equivalent (brand-secondary), ink text
        .pill.no    → magenta-equivalent (brand-primary), bone text
        .pill.note  → paper, ink text, 1.5px ink border
      Outside the matrix register, color is decorative — drop the status modifier
      and pick any brand variant.
-->
<span class="stn-chip">{LABEL}</span>

<style>
  .stn-chip {
    display: inline-block;
    background: var(--surface-paper);
    color: var(--ink);
    padding: 8px 18px;
    border-radius: var(--radius-card);
    font-family: "Barlow Condensed", sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: var(--track-chrome-loose);
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Pill register — fully rounded. */
  .stn-chip.pill {
    border-radius: var(--radius-pill);
  }

  /* Matrix status convention (apply with .pill). */
  .stn-chip.pill.yes {
    background: var(--brand-accent);
    color: var(--anchor-bone);
  }
  .stn-chip.pill.part {
    background: var(--brand-secondary);
    color: var(--ink);
  }
  .stn-chip.pill.no {
    background: var(--brand-primary);
    color: var(--anchor-bone);
  }
  .stn-chip.pill.note {
    background: var(--surface-paper);
    color: var(--ink);
    border: var(--rule-hairline);
  }

  /* Decorative brand variants (outside matrix). */
  .stn-chip.primary {
    background: var(--brand-primary);
    color: var(--anchor-bone);
  }
  .stn-chip.secondary {
    background: var(--brand-secondary);
    color: var(--ink);
  }
  .stn-chip.accent {
    background: var(--brand-accent);
    color: var(--anchor-bone);
  }
</style>
```
