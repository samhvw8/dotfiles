```html
<!-- Editorial Forest topic-tile: 6px-radius rectangular tile holding a mono
     ordinal, a serif title, optional body, and a mono foot string. Background
     rotates through green / pink / green-lite / cream-2-with-green-border.
     A grid of these tiles is the agenda / table-of-contents pattern. -->
<div class="ef-topic-tile">
  <div class="ef-topic-tile-top">
    <div class="ef-topic-tile-num">01</div>
    <h3 class="ef-topic-tile-title">{HEADLINE}</h3>
  </div>
  <div class="ef-topic-tile-foot">{LABEL}</div>
</div>

<style>
  .ef-topic-tile {
    box-sizing: border-box;
    background: var(--brand-primary);
    color: var(--brand-secondary);
    border-radius: var(--ef-radius-tile);
    padding: 36px 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 280px;
    /* Variant fills (apply by adding .ef-topic-tile--pink / --lite / --cream): */
    /*   default: solid green, pink text */
    /*   --pink: solid pink, green-deep text */
    /*   --lite: solid green-lite, pink text */
    /*   --cream: cream-2 fill with 2px green border, green text */
  }
  .ef-topic-tile--pink {
    background: var(--brand-secondary);
    color: var(--ef-green-deep);
  }
  .ef-topic-tile--lite {
    background: var(--ef-green-lite);
    color: var(--brand-secondary);
  }
  .ef-topic-tile--cream {
    background: var(--ef-cream-2);
    color: var(--brand-primary);
    border: var(--ef-rule-weight) solid var(--brand-primary);
  }
  .ef-topic-tile-num {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: var(--ef-track-caption);
    font-weight: 500;
    text-transform: uppercase;
    color: inherit;
  }
  .ef-topic-tile-title {
    font-family: "Source Serif 4", "Source Serif Pro", Georgia, serif;
    font-weight: 500;
    font-size: 2.4vw;
    line-height: 0.98;
    letter-spacing: -0.01em;
    margin: 1.2vw 0 0 0;
    color: inherit;
  }
  .ef-topic-tile-foot {
    font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
    font-size: 1.3vw;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 500;
    margin-top: 16px;
    color: inherit;
  }
</style>
```
