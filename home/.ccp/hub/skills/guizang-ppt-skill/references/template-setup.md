# Step 2 · Template Setup

**Based on the style chosen in Step 1, copy the corresponding template** to the target location (typically `project/XXX/ppt/index.html`), and create an `images/` folder at the same level to hold images.

```bash
mkdir -p "项目/XXX/ppt/images"

# Style A · Digital Magazine
cp "<SKILL_ROOT>/assets/template.html" "项目/XXX/ppt/index.html"

# Or Style B · Swiss International Style
cp "<SKILL_ROOT>/assets/template-swiss.html" "项目/XXX/ppt/index.html"
```

Both `template*.html` files are **fully runnable** — CSS, WebGL shader, swipe JS, font/icon CDN are all pre-configured. Only the `<!-- SLIDES_HERE -->` placeholder awaits your slide content.

**Note**: Styles A and B **cannot be mixed**. Classes in layouts.md (like `.h-hero` serif heading, `.display-zh`, etc.) are only defined in template.html; classes in layouts-swiss.md (like `.kpi-hero`, `.accent-block`, `.span-N`, `.dots`, etc.) are only defined in template-swiss.html. A single deck can only use one set.

#### 2.1 · Required Placeholder Replacements (**easy to miss**)

Replace the following placeholders immediately after copying, otherwise the browser tab will display embarrassing text like "[Required] Replace with PPT title":

| Location | Original | Replace With |
|----------|----------|--------------|
| `<title>` | `[必填] 替换为 PPT 标题 · Deck Title` | Actual deck title (e.g., `一种新的工作方式 · Luke Wroblewski`) |

After every template copy, the first thing to do: grep for "[必填]" to confirm everything has been replaced.

#### 2.2 · Select a Theme Color (5 presets · no custom colors allowed)

This skill **only allows choosing from 5 carefully curated presets** — custom hex values are not accepted. A bad color combination instantly ruins the visual; protecting aesthetics matters more than offering freedom.

| # | Theme | Best For |
|---|-------|----------|
| 1 | 🖋 Ink Classic | General purpose / business launches / default when unsure |
| 2 | 🌊 Indigo Porcelain | Tech / research / data / product launches |
| 3 | 🌿 Forest Ink | Nature / sustainability / culture / non-fiction |
| 4 | 🍂 Kraft Paper | Nostalgia / humanities / literature / indie magazine |
| 5 | 🌙 Dune | Art / design / creative / gallery |

**Steps**:
1. Recommend a set based on content theme, or ask the user to choose
2. Open `references/themes.md`, find the corresponding theme's `:root` block
3. **Replace in bulk** the lines marked with "theme color" comments in the `:root{` block at the top of `assets/template.html` (the copied version) (`--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`)
4. All other CSS uses `var(--...)`, no other changes needed

**Hard rules**:
- One deck, one theme — do not switch colors midway
- Do not accept arbitrary hex values from the user — politely decline and show the 5 options
- Do not mix-and-match (e.g., ink from Ink Classic, paper from Dune) — it will look completely off

## Related

- [themes.md](themes.md)
- [themes-swiss.md](themes-swiss.md)
