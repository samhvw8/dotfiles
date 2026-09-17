# Step 1 · Requirements Clarification

**mandatory before starting**

**If the user already provided a complete outline + images**, skip ahead to Step 2.

**If the user only gave a topic or a vague idea**, align on these 6 questions before starting. Do not begin writing slides based on guesses — once the structure is wrong, rework costs are high:

#### Runtime Environment Adaptation

- **In Codex**: Ask the user directly in normal conversation. Do not invoke Claude Code's `ask question` / `ask_question` mechanism, and do not assume those tools are available. Ask at most 1-3 critical questions at a time; if information gaps don't block progress, make reasonable assumptions and state them in your reply.
- **In Claude Code**: Continue using the standard `ask question` interaction to clarify items one by one.

#### 7-Question Clarification Checklist

| # | Question | Why Ask |
|---|----------|---------|
| 1 | **Style A or B?** (Digital Magazine / Swiss International Style) | **Must ask first** — determines which template + layouts + themes files to use |
| 2 | **Who is the audience? What's the setting?** (internal industry / business launch / demo day / private gathering) | Determines tone and depth |
| 3 | **How long is the presentation?** | 15 min ≈ 10 pages, 30 min ≈ 20 pages, 45 min ≈ 25-30 pages |
| 4 | **Any source material?** (documents / data / old PPT / article links) | If yes, build from it; if not, help scaffold |
| 5 | **Any images? Where are they?** | See "Image Conventions" below |
| 6 | **Which theme color set?** | Magazine style has 5 sets (`themes.md`) / Swiss style has 4 sets (`themes-swiss.md`) — pick one |
| 7 | **Any hard constraints?** (must include XX data / must not mention YY) | Avoid rework |

#### Style Selection Guide (Question 1)

| If the user says... | Recommended Style |
|---|---|
| "magazine feel" / "humanities" / "Monocle style" / unspecified | **A · Digital Magazine** |
| "Swiss style" / "Swiss Style" / "Helvetica" / "minimal" / "grid" / "infographic" / "data-driven" | **B · Swiss International Style** |
| Content is AI products / tech / engineering / data reports | B is a better fit |
| Content is industry insights / humanities / stories / culture | A is a better fit |
| User provided lots of KPI numbers / roadmaps / workflows | B is a better fit (`Data Hero` layout is Swiss style's forte) |
| User provided lots of documentary photos / humanities imagery | A is a better fit (image grid, left-text-right-image are magazine style's forte) |
| User needs GPT Image 2 to generate screenshots for redesign / infographics / evidence walls | B also works well (P23/P24 are Swiss style's dedicated image layouts) |

#### Outline Assistance (if the user doesn't have an outline)

Use the "narrative arc" template to build the skeleton, then fill in content:

```
Hook              → 1 page  : Throw out a contrast / question / hard data to stop the audience
Context           → 1-2 pages: Explain background / who you are / why this topic
Core              → 3-5 pages: Core content, intersperse with Layout 4/5/6/9/10
Shift             → 1 page  : Break expectations / present a new perspective
Takeaway          → 1-2 pages: Quotable line / suspense question / call to action
```

Narrative arc + page count plan + theme rhythm table (see `layouts.md`) — **align all three tables** before moving to Step 2.

It's recommended to save the outline as `project-notes.md` or `outline-v1.md` for future iterations.

#### Image Conventions (inform the user)

Explain these to the user before starting:

- **Folder location**: Under `project/XXX/ppt/images/` (same level as `index.html`)
- **Naming convention**: `{page-number}-{semantic}.{ext}`, e.g., `01-cover.jpg` / `03-figma.jpg` / `05-dashboard.png`
  - Zero-pad page numbers for sorting
  - Use English for the semantic part — short, specific, matching the content
- **Specs**:
  - Single image ≥ 1600px wide (avoid blur on large screens)
  - JPG for photos/screenshots, PNG for transparent UI/charts
  - Keep total size under 10MB (affects swipe fluidity)
- **How to replace**: **Same-name overwrite** is the safest approach (no path changes needed in HTML); if the filename changes, do a global search for `images/old-name` and replace with the new name
- **No images?**: Align with the user — you can generate the structure with placeholder color blocks first and add images later; but inform them that image-text layouts like layout 4/5/10 can't be visually verified without images

#### Codex Image Generation (Optional)

If the current runtime is **Codex**, after completing the deck draft, proactively ask the user whether they want to use GPT Image 2 to generate images and insert them into the PPT. Do not generate by default.

Recommended phrasing:

> Want to generate some images for this PPT? Options include documentary-style photos, magazine-style infographics, process/comparison/system diagrams, or redesigning screenshots into a unified magazine visual style.

If the user confirms, ask which image type or style they want; if the user has no preference, recommend 1-3 images worth generating based on page content.

When generating images, follow these rules:

- Keep prompts short — only frame the subject, purpose, style, and aspect ratio. Do not write lengthy photography direction
- Image style must match the current deck style: Style A uses "Digital Magazine × E-Ink"; Style B uses "Swiss International Style / Swiss Style"
- Text in infographics, charts, and screenshot redesigns must match the user's language; Chinese deck uses Chinese, English deck uses English
- First check `references/image-prompts.md` for image types and base prompts
- Image aspect ratio must match the final placement: hero visual 16:9, left-text-right-image 16:10 / 4:3, infographic 16:9 / 16:10, screenshot redesign 16:10, mixed image-text small image 3:2 / 3:4, grid images with uniform height cropping
- Place generated images under `images/`, following the `{page-number}-{semantic}.{ext}` naming convention

## Related

- [themes.md](themes.md)
- [themes-swiss.md](themes-swiss.md)
- [image-prompts.md](image-prompts.md)
