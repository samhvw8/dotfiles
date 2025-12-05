# Workflows: Design Analysis & Generation

## Workflow 1: Capture & Analyze Inspiration

**Purpose**: Extract design guidelines from inspiration websites.

### Process Steps

1. **Browse Inspiration Sites**
   - Dribbble, Mobbin, Behance, Awwwards
   - Focus on high-quality, professionally designed examples

2. **Capture Screenshots**
   - Use **chrome-devtools** skill to capture full-screen screenshots (not full page)
   - Capture multiple examples for pattern recognition

3. **Analyze with AI Multimodal**
   - Use **ai-multimodal** skill to analyze screenshots
   - Extract comprehensive design information:
     - Design style (Minimalism, Glassmorphism, Neo-brutalism, etc.)
     - Layout structure & grid systems
     - Typography system & hierarchy
     - **IMPORTANT**: Predict font name (Google Fonts) and font size - don't default to Inter or Poppins
     - Color palette with hex codes
     - Visual hierarchy techniques
     - Component patterns & styling
     - Micro-interactions
     - Accessibility considerations
     - Overall aesthetic quality rating (1-10)

4. **Document Findings**
   - Use project design guidelines templates
   - Create structured documentation for reference

## Workflow 2: Generate & Iterate Design Images

**Purpose**: Create aesthetically pleasing design images through iteration.

### Process Steps

1. **Define Design Prompt**
   - Specify style, colors, typography
   - Define target audience
   - Include animation specifications

2. **Generate Initial Design**
   - Use **ai-multimodal** skill to generate design images with Gemini API
   - Create multiple variations for comparison

3. **Evaluate Aesthetic Quality**
   - Use **ai-multimodal** skill to analyze output images
   - Score aesthetic quality objectively (1-10 scale)
   - Identify specific strengths and weaknesses

4. **Iterate Until Standards Met**
   - If score < 7/10 or fails professional standards:
     - Identify specific weaknesses (color, typography, layout, spacing, hierarchy)
     - Refine prompt with targeted improvements
     - Regenerate with **ai-multimodal**
     - Use **media-processing** skill for refinements (resize, crop, filters, composition)
   - Repeat until aesthetic standards met (score >= 7/10)

5. **Document Final Design**
   - Save final design decisions
   - Document rationale for key choices
   - Create reference documentation using templates

## Quality Standards

- **Minimum Score**: 7/10 for aesthetic quality
- **Professional Standards**: Must meet industry best practices
- **Accessibility**: Must pass WCAG AA standards
- **Consistency**: Must align with overall design system

## Related Skills Integration

- **chrome-devtools**: Browser automation, screenshot capture
- **ai-multimodal**: Image generation and analysis
- **media-processing**: Image refinement and optimization
