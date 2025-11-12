---
name: ui-design-system
description: Complete modern UI development stack combining TailwindCSS (utility-first styling), Radix UI (accessible primitives), and shadcn/ui (beautiful components). Use for building responsive, accessible React applications with design systems, component libraries, dark mode, forms, and enterprise UI patterns.
license: MIT
version: 1.0.0
---

# Modern UI Design System Stack

Production-ready UI development with **TailwindCSS + Radix UI + shadcn/ui**.

## Stack Architecture

### The Three Pillars

**Layer 1: TailwindCSS (Styling Foundation)**
- Utility-first CSS framework with build-time generation
- Zero runtime overhead, minimal production bundles
- Design tokens: colors, spacing, typography, breakpoints
- Responsive utilities and dark mode support

**Layer 2: Radix UI (Behavior & Accessibility)**
- Unstyled, accessible component primitives
- WAI-ARIA compliant with keyboard navigation
- Focus management and screen reader support
- Unopinionated - full styling control

**Layer 3: shadcn/ui (Beautiful Components)**
- Pre-built components = Radix primitives + Tailwind styling
- Copy-paste distribution (you own the code)
- Built-in React Hook Form + Zod validation
- Customizable variants with type safety

### Architecture Hierarchy

```
Application Layer
    ↓
shadcn/ui Components (Beautiful defaults, ready-to-use)
    ↓
Radix UI Primitives (Accessible behavior, unstyled)
    ↓
TailwindCSS Utilities (Design system, styling)
```

**Key Principle:** Each layer enhances the one below. Start with Tailwind for styling, add Radix for accessible behavior, use shadcn/ui for complete components.

## When to Use Each Layer

### Use TailwindCSS Directly When:
- Building custom layouts and spacing
- Styling static content and containers
- Rapid prototyping without complex interactions
- Non-interactive UI elements

**Example scenarios:** Hero sections, grid layouts, cards without interaction, text styling

### Use Radix UI Primitives When:
- Building custom component libraries
- Need accessibility but require custom design
- shadcn/ui doesn't have the component you need
- Full control over component structure required

**Example scenarios:** Custom date picker, unique navigation pattern, specialized modal behavior

### Use shadcn/ui Components When:
- Building standard UI components quickly
- Need beautiful defaults with customization options
- Enterprise application development
- Form-heavy applications with validation

**Example scenarios:** Admin dashboards, CRUD applications, settings pages, data tables

## Critical Design Principles

### 1. Progressive Enhancement
Start simple, enhance as needed:
1. Tailwind utilities for basic styling
2. Add Radix primitives for interaction
3. Use shadcn/ui for complete solutions
4. Customize components in your codebase

### 2. Composition Over Complexity
Build complex UIs from simple, reusable components:
- Small, focused components (single responsibility)
- Compose primitives rather than creating monoliths
- Leverage component slots and children patterns

### 3. Accessibility First
Radix UI handles accessibility automatically:
- ARIA attributes applied correctly
- Keyboard navigation built-in
- Focus management and trapping
- Screen reader compatibility

**Never override accessibility features** - enhance them.

### 4. Design Token Consistency
Use Tailwind's design system consistently:
- Stick to spacing scale (4, 8, 16, 24px)
- Use color palette (50-950 shades)
- Apply typography scale systematically
- Avoid arbitrary values unless necessary

### 5. Mobile-First Responsive
Always design mobile-first, scale up:
- Base styles for mobile
- Use breakpoints (sm, md, lg, xl, 2xl) to enhance
- Test on actual devices, not just browser resize

## Setup Strategy

### Installation Order
1. **TailwindCSS** - Foundation
2. **shadcn/ui CLI** - Includes Radix dependencies
3. **Add components** - Install only what you need
4. **Configure theme** - CSS variables + Tailwind config
5. **Setup dark mode** - Theme provider + toggle

### Configuration Best Practices

**Tailwind Config:**
- Use `content` paths correctly (scan all component files)
- Extend theme with CSS variables, not hardcoded values
- Enable dark mode with `class` strategy
- Install `tailwindcss-animate` plugin

**CSS Variables (Three-Tier System):**
```css
:root {
  /* Tier 1: Primitives (immutable) */
  --gray-50: 250 250 250;
  --gray-900: 24 24 27;
  --blue-500: oklch(0.55 0.22 264);

  /* Tier 2: Semantics (theme-aware) */
  --background: var(--gray-50);
  --foreground: var(--gray-900);
  --primary: var(--blue-500);

  /* Tier 3: Components */
  --button-height: 2.5rem;
  --card-padding: 1.5rem;
}

.dark {
  /* Only semantic tokens change */
  --background: var(--gray-900);
  --foreground: var(--gray-50);
}
```

**Color Space Recommendation:**
- **Modern**: Use OKLCH for perceptual uniformity
- **Legacy support**: Use HSL with fallbacks
- **Avoid**: RGB/HEX for design tokens (not human-readable)

**Token Storage:**
- Store in JSON for platform-agnostic distribution
- Transform to CSS variables, Swift, XML using Style Dictionary
- Version control tokens separately from component code

**Path Aliases:**
- Configure `@/components` and `@/lib` in tsconfig
- Ensure consistency between Next.js and TypeScript configs
- Use aliases in imports for cleaner code

## Integration Patterns

### Pattern 1: shadcn/ui + Custom Tailwind
Use shadcn/ui components as base, customize with Tailwind classes:
- Apply custom spacing, colors via className prop
- Override default styles with Tailwind utilities
- Maintain component accessibility

### Pattern 2: Radix Primitives + Tailwind
Build custom components from scratch:
- Use Radix for behavior (Dialog, Dropdown, etc.)
- Style completely with Tailwind utilities
- Full control over structure and appearance

### Pattern 3: Hybrid Approach
Modify shadcn/ui components in your codebase:
- Edit component files in `components/ui/`
- Add new variants, sizes, or styles
- Maintain type safety with CVA (Class Variance Authority)

### Pattern 4: Component Composition
Combine multiple primitives for complex UIs:
- Popover + Select for searchable dropdown
- Dialog + Form for modal forms
- Tabs + Cards for multi-section interfaces

## Design Token Architecture

### Three-Tier Token System (Industry Standard)

Based on USWDS, IBM Carbon, and Shopify Polaris patterns:

**Tier 1: Primitive Tokens** (Foundation Layer)
- Raw design values without context
- Examples: `gray-50`, `gray-900`, `spacing-4`, `font-sans`
- Purpose: "The most basic form of tokens, reducing infinite possibilities to a select few"
- Never reference other tokens
- Immutable across themes

**Tier 2: Semantic Tokens** (Context Layer)
- Carry meaning about usage
- Examples: `background-primary`, `text-error`, `border-interactive`
- Purpose: Describe function, not appearance
- Reference primitive tokens
- Change between themes (light/dark)

**Tier 3: Component Tokens** (Application Layer)
- Specific to UI components
- Examples: `button-height`, `card-padding`, `input-border-radius`
- Reference semantic or primitive tokens
- Enable component-level theming

**Token Hierarchy Benefits:**
- Single source of truth
- Update one token → cascades everywhere
- Dark mode: Change semantic layer only
- Rebrand: Update primitive layer only

### OKLCH Color Space (Modern Standard)

**Why OKLCH over HSL:**
- **Perceptually uniform**: Equal lightness steps look equal to human eyes
- **Consistent brightness**: Yellow/cyan don't appear lighter than blue/red
- **Algorithmic palettes**: Generate entire color systems from formulas
- **Better gradients**: Smooth transitions without lightness jumps
- **Accessibility**: Easier to calculate contrast ratios

**Browser Support:** 93%+ (2024) - All modern browsers
**Adoption:** TailwindCSS v4 uses OKLCH by default

**Format:** `oklch(L C H)`
- L: Lightness (0-1 or 0%-100%)
- C: Chroma/saturation (0-0.4)
- H: Hue (0-360 degrees)

**HSL vs OKLCH Example:**
- HSL: `hsl(210, 100%, 50%)` - Unpredictable perceived brightness
- OKLCH: `oklch(0.55 0.22 264)` - Perceptually consistent

### Token Naming Conventions

**Best Practices from Smashing Magazine & Design Systems Collective:**

**Structure Pattern:**
```
[category]-[property]-[variant]-[state]
```

**✅ Purpose-Driven Names:**
- `background-primary` (semantic)
- `text-error` (semantic)
- `button-primary-hover` (component + state)

**❌ Avoid Appearance-Based:**
- `blue-500` (no context)
- `dark-blue-bg` (ties to visual)
- `header-color-1` (meaningless)

**Color Naming:**
- Primitives: `[family]-[brightness]` → `gray-50` to `gray-900`
- Semantic: `[purpose]-[role]` → `background-primary`, `text-on-primary`
- Component: `[component]-[property]` → `button-background-primary`

**Key Characteristics:**
- **Logical**: Consistent patterns team understands
- **Scalable**: Accommodates growth without restructuring
- **Searchable**: Easy filtering in design tools
- **Short**: Balance descriptiveness with brevity

### Multi-Theme Support
Support multiple brands/themes:
- Define theme objects with token values
- Inject CSS variables dynamically with JavaScript
- Semantic tokens adapt per theme
- Primitive tokens can vary by brand

## Responsive Design Strategy

### Breakpoint Philosophy
Mobile-first breakpoints:
- **Base:** 0-639px (mobile)
- **sm:** 640px+ (large phones, small tablets)
- **md:** 768px+ (tablets)
- **lg:** 1024px+ (laptops, desktops)
- **xl:** 1280px+ (large desktops)
- **2xl:** 1536px+ (ultra-wide)

### Responsive Component Patterns
Build components that adapt to screen size:
- **Layout shifts:** Column to row, stacked to grid
- **Component switching:** Dialog on desktop, Drawer on mobile
- **Content visibility:** Hide/show elements per breakpoint
- **Typography scaling:** Responsive font sizes

### Container Queries
Use for component-based responsiveness:
- Components respond to parent width, not viewport
- Better for modular, reusable components
- Use `@container` queries with Tailwind

## Form Architecture

**Validation Strategy:** React Hook Form + Zod
- Schema-first validation with type inference
- Unified error handling and display
- Accessible error messages

**Reusable Patterns:**
- Field wrappers for consistency
- Required indicators
- Multi-step forms with progress tracking

## Performance Best Practices

**Code Splitting:** Lazy load heavy components (tables, charts) with React.lazy + Suspense

**Tailwind Optimization:** Configure `content` paths accurately | Remove unused plugins | Avoid broad globs

**Virtualization:** Use @tanstack/react-virtual for long lists (render only visible items)

**Dynamic Classes:** ❌ `text-${color}-500` won't work | ✅ Use conditionals or safelist

## Component Customization Strategies

### 1. Direct Modification
shadcn/ui components live in your codebase:
- Edit files in `components/ui/` directly
- Add new variants with CVA
- Modify default styles
- You own the code - full control

### 2. Variant Extension
Use Class Variance Authority (CVA):
- Define variant options (default, secondary, etc.)
- Add size variants (sm, md, lg)
- Create compound variants (variant + size combinations)
- Type-safe component props

### 3. Wrapper Components
Create higher-level components:
- Wrap shadcn/ui components with custom logic
- Add default props and behaviors
- Enforce design system constraints

### 4. Theme Customization
Modify design tokens:
- Change colors, spacing, typography in CSS variables
- Affects all components automatically
- Maintain consistency across application

## Dark Mode Implementation

### Setup Requirements
1. **ThemeProvider:** Wrap app with next-themes provider
2. **Class strategy:** Use `class` dark mode (not media query)
3. **Hydration fix:** Add `suppressHydrationWarning` to `<html>`
4. **CSS variables:** Define dark mode tokens in `.dark` class

### Design Considerations
- Test all components in both modes
- Ensure sufficient contrast (WCAG AA minimum)
- Use semantic tokens (background, foreground) not color names
- Transition smoothly with CSS transitions

### Toggle Component
Provide accessible theme switcher:
- Show current theme state (sun/moon icon)
- Keyboard accessible
- Visible focus indicator
- System preference detection

## Accessibility Standards

### Radix UI Built-In Guarantees
- ✅ ARIA attributes applied correctly
- ✅ Keyboard navigation functional
- ✅ Focus management and trapping automatic
- ✅ Screen reader compatible

### WCAG Contrast Requirements (Critical)

**WCAG 2.1 Level AA (Legal Minimum):**
- Normal text: **4.5:1** minimum contrast ratio
- Large text (18pt/14pt bold+): **3:1** minimum
- UI components/graphics: **3:1** minimum
- **Industry standard**: Most legal requirements specify AA

**WCAG Level AAA (Enhanced):**
- Normal text: **7:1** contrast ratio
- Large text: **4.5:1** contrast ratio
- **Best practice**: Aim for AAA when design constraints allow

**Measurement:**
- Contrast ratio range: 1:1 (white on white) to 21:1 (black on white)
- Use tools: WebAIM Color Contrast Checker, browser DevTools
- Test during design phase, not after implementation

**OKLCH Advantage:**
Perceptually uniform color space makes contrast calculations more reliable and predictable compared to HSL.

### Implementation Checklist
- ✅ All text meets 4.5:1 minimum (AA standard)
- ✅ Interactive elements meet 3:1 minimum
- ✅ Provide descriptive labels (`aria-label`, `<label>`)
- ✅ Test complete keyboard navigation flow
- ✅ Verify visible focus indicators (not just browser default)
- ✅ Test with screen readers (NVDA, JAWS, VoiceOver)
- ✅ Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- ✅ Provide alternative text for images and icons
- ✅ Ensure dark mode maintains contrast standards

### Testing Strategy
1. **Automated**: Use contrast checkers during design
2. **Manual**: Tab through entire interface
3. **Screen readers**: Test with at least one screen reader
4. **Real users**: Include users with disabilities in testing

## Common Pitfalls

### 1. Dynamic Class Generation
**Problem:** Tailwind doesn't generate classes at runtime
**Solution:** Use conditional logic or safelist

### 2. Content Configuration
**Problem:** Styles not applied, CSS purged incorrectly
**Solution:** Verify `content` paths include all component files

### 3. Import Path Issues
**Problem:** Component imports fail
**Solution:** Check path aliases in tsconfig.json and components.json

### 4. Dark Mode Not Working
**Problem:** Styles don't change in dark mode
**Solution:** Verify ThemeProvider setup, CSS variables defined

### 5. Accessibility Override
**Problem:** Breaking Radix accessibility features
**Solution:** Never remove ARIA attributes, use `asChild` prop correctly

## Resources

### Official Documentation
- **TailwindCSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives
- **shadcn/ui:** https://ui.shadcn.com | https://ui.shadcn.com/llms.txt

### Authoritative Design System Sources
- **USWDS Design Tokens:** https://designsystem.digital.gov/design-tokens/
- **Smashing Magazine Naming:** https://www.smashingmagazine.com/2024/05/naming-best-practices/
- **OKLCH Color Space:** https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- **WCAG Contrast:** https://webaim.org/articles/contrast/

### Reference Files (Code Examples & Patterns)
- **[TAILWIND_REFERENCE.md](references/TAILWIND_REFERENCE.md)** - Complete utilities
- **[RADIX_REFERENCE.md](references/RADIX_REFERENCE.md)** - Primitives with code
- **[SHADCN_REFERENCE.md](references/SHADCN_REFERENCE.md)** - Components with install
- **[INTEGRATION_PATTERNS.md](references/INTEGRATION_PATTERNS.md)** - Advanced patterns

## Implementation Checklist

### Setup (Foundation)
- [ ] Install TailwindCSS + `npx shadcn@latest init`
- [ ] Configure three-tier token system (primitive → semantic → component)
- [ ] Set up OKLCH color space (modern browsers)
- [ ] Configure dark mode with ThemeProvider
- [ ] Create `cn()` utility helper

### Development (Build)
- [ ] Install shadcn/ui components as needed
- [ ] Apply mobile-first responsive design
- [ ] Implement dark mode for all components
- [ ] Test keyboard navigation + screen readers
- [ ] Verify WCAG AA contrast (4.5:1 text, 3:1 UI)

### Production (Deploy)
- [ ] Verify Tailwind CSS purging works
- [ ] Test all states (hover, focus, active, disabled)
- [ ] Validate WCAG 2.1 AA compliance
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Performance audit (Lighthouse)

## Best Practices

**Design Tokens:** Use three-tier system (primitive → semantic → component) | OKLCH color space | Purpose-driven naming

**Accessibility:** WCAG AA minimum (4.5:1 text, 3:1 UI) | Test keyboard navigation | Screen reader compatible

**Performance:** Code split heavy components | Virtualize long lists | Optimize Tailwind bundle

**Maintenance:** Modular components | Document modifications | Version control tokens

---

**Skill Version:** 2.0.0
**Last Updated:** 2025-11-12
**Enhanced With:** USWDS, IBM Carbon, Shopify Polaris patterns
**Authoritative Sources:** WCAG 2.1, OKLCH color science, industry naming conventions
**Progressive Disclosure:** Reference files for code examples ✅
