```html
<p class="rz-drop-cap-para"><span class="rz-drop-cap">A</span>{LEDE}</p>

<style>
  /*
    Editorial drop cap that opens a body column. Oversized Bebas Neue initial
    in brand-primary, line-height 0.8, floated left so body text wraps around.
    The system's editorial fingerprint — reserve for feature-length copy.

    NOTE: the leading letter is a hardcoded literal `A`. Per §8.5 fall-through
    placeholder guidance, {LETTER} is unsafe (not in placeholderFor()). When
    Phase 4b pastes this into a scene, the worker should swap `A` for the
    actual first letter of the lede paragraph it's pairing with. Leave the
    literal in place for the design.html preview.
  */
  .rz-drop-cap-para {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(24px, 1.8vw, 28px);
    line-height: 1.7;
    color: var(--ink);
    margin: 0;
    /* clearfix so the drop cap's float doesn't escape the paragraph */
    overflow: hidden;
  }
  .rz-drop-cap {
    float: left;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(48px, 6vw, 80px);
    font-weight: 400;
    line-height: 0.8;
    letter-spacing: 0.02em;
    color: var(--brand-primary);
    margin-right: 12px;
    margin-top: 6px;
  }
</style>
```
