# CHATGPT FIGMA INSPECTION REQUEST

## Review ID

FIGMA-001

## Objective

Inspect the Figma design file named **"Portfolio"** connected to this ChatGPT account and document every aspect needed to implement the redesign of mrchad.netlify.app.

The output of this review will be recorded in FIGMA_AUDIT.md and TASTE.md as the verified design source of truth for the redesign.

---

## Instructions for ChatGPT

Open the Figma file named **"Portfolio"** and inspect it thoroughly. For each section below, identify and describe what exists. Be specific — reference actual frame names, layer names, text styles, color values, spacing values, component names, and variant states.

Where something is absent, missing, or unclear, note that explicitly. Do not fill in gaps with assumptions or design recommendations.

---

## 1. File Overview

- What is the exact Figma file name and project owner?
- How many pages does the file contain? List their names.
- How many frames / artboards exist per page?
- What is the overall file structure (folders, sections, organization)?
- Are there any version history notes, recent updates, or comments?

---

## 2. Design Direction

- What is the overall visual direction? (describe in 2-3 sentences)
- What is the typographic direction?
- What is the color palette direction?
- What mood or emotional character does the design communicate?
- Does the design feel editorial, experimental, minimal, premium, or something else?
- Are there any mood boards, inspiration boards, or reference images included?

---

## 3. Homepage Structure

List every section on the homepage frame, in order from top to bottom. For each section, identify:

- Frame or section name
- Layout structure (single column, grid, asymmetric, overlapping, etc.)
- Content type (heading, body text, image, video, interactive element, etc.)
- Background treatment (solid color, gradient, image, video, none)
- Approximate height / visual weight
- Any hover or interaction states shown
- Responsive variants (mobile, tablet, desktop) if they exist

---

## 4. Navigation

- Navigation style (top bar, sidebar, hamburger, hybrid, custom, etc.)
- Navigation items and their labels
- Active state, hover state, mobile state
- Does the nav include a logo, name, or mark?
- Scroll behaviour (fixed, sticky, hides on scroll, etc.)
- Mobile navigation pattern (drawer, sheet, full-screen overlay, etc.)
- Any overlay, backdrop, or transition details for mobile nav

---

## 5. Project Card System

- How are projects presented on listing pages?
- Card layout (image size, text placement, hover state, overlay, etc.)
- What information does each card show? (title, role, tags, description, metrics, etc.)
- Number of columns and breakpoint behaviour
- Image treatment (ratio, border radius, shadow, filter, mockup style)
- Are there different card variants for featured vs. standard projects?
- Any animation or transition on hover, load, or scroll?

---

## 6. Project / Case Study Pages

- Template structure for individual project pages
- Hero section layout
- Content sections and their patterns (text, image, full-bleed, split, etc.)
- How is project imagery presented? (screenshots, mockups, art-directed compositions, galleries, carousels)
- Is there a consistent case-study narrative structure?
- Typography system for long-form reading
- Navigation between projects (previous/next, back to index)
- Any sidebar, table of contents, or progress indicator?

---

## 7. Typography

Extract the complete typography system:

- **Headings:** Typeface, weights, sizes (px/rem), line heights, letter-spacing, case for each level (H1–H6)
- **Body text:** Typeface, weight, size, line height, paragraph spacing
- **Display text:** Any large, expressive, or hero typography
- **UI text:** Navigation, buttons, labels, captions, meta — sizes and treatments
- **Font loading:** Typefaces used (Google Fonts, Adobe Fonts, self-hosted, variable fonts)
- **Pairing:** How display and body typefaces relate

---

## 8. Colour Palette

Extract the complete color system:

- **Primary palette:** Hex/rgb/hsl values for each color
- **Semantic colors:** Success, warning, error, info
- **Neutral palette:** Backgrounds, surfaces, borders, text (dark, light, grey scale)
- **Accent colors:** Any accent, highlight, or brand accent
- **Dark mode colors** (if dark mode exists)
- **Gradients** (if used) — direction, stops, usage context
- **Opacity usage:** Any semi-transparent overlays, surfaces, or text treatments

---

## 9. Spacing and Grid

- Grid system (columns, gutter width, margin, max content width)
- Vertical spacing rhythm / baseline grid
- Padding and margin patterns for sections, cards, containers
- Responsive breakpoints and how spacing changes across them

---

## 10. Components and Variants

List every UI component in the file. For each:

- Component name
- Variants (size, state, color, orientation)
- Default state
- Hover state
- Active / pressed state
- Focus state
- Disabled state
- Loading state (if applicable)
- Mobile treatment (if different)
- Any auto-layout properties (padding, gap, alignment, sizing)

**Components to check for (plus any others found):**
- Buttons (primary, secondary, tertiary, ghost, icon)
- Links (inline, nav, card, footer)
- Form inputs (text, textarea, select, checkbox, radio)
- Tags / badges / chips
- Dividers
- Cards
- Image components
- Avatars / logos
- Icons (style, set, sizing)
- Overlays / modals / dialogs

---

## 11. Responsive Design

- Which breakpoints exist in the Figma file? (mobile, tablet, laptop, desktop, wide)
- Which frames have responsive variants?
- How does the layout change across breakpoints?
- How does typography scale?
- How does navigation adapt?
- How do images and project cards adapt?
- How does the homepage reflow?
- Are there any interactive prototypes showing responsive behaviour?

---

## 12. Interaction States (Beyond Hover)

- Any micro-interactions shown (button clicks, toggles, menu opens, form interactions)
- Any animated transitions between states or pages
- Any scroll-triggered interactions (reveal, parallax, sticky, progress)
- Any cursor effects
- Any loading or skeleton states
- Any error or empty states
- Any swipe or gesture-based interactions

---

## 13. Animation and Motion Cues

- Any motion specs (duration, easing, stagger, delay)
- Page transition ideas
- Scroll-triggered reveals
- Hover animation details
- Micro-animation details
- Are motion values documented or implied through prototypes?

---

## 14. Imagery and Asset Treatment

- How are images framed? (browser mockup, device mockup, full-bleed, contained, masked, etc.)
- Image ratios used (16:9, 4:3, 3:2, 1:1, custom)
- Border radii, shadows, filters on images
- Background textures or patterns
- Video or motion content placeholders
- Icon style (filled, outlined, custom illustration, imported set)

---

## 15. Missing States

Flag anything that is **not** designed but would be needed in production:

- 404 page
- Loading states for any component
- Empty states (no projects, no results, empty form)
- Error states (form errors, network errors, broken images)
- Focus-visible styles for keyboard navigation
- Print styles
- Reduced-motion alternatives
- Any other gap between what's designed and what would ship

---

## 16. Inconsistencies

Note any:

- Inconsistent spacing between similar components
- Inconsistent color usage for the same UI element
- Inconsistent typography (same semantic level using different sizes)
- Missing variants on components that need them
- Mismatch between design intent and technical feasibility
- Discrepancies between different pages or frames

---

## 17. Differences From Live Site

Compare the Figma design to the current live site (mrchad.netlify.app):

- What is being carried over?
- What is being removed?
- What is being added?
- What is changing most significantly?
- Are there any structural or content differences between the Figma design and the current site?

---

## 18. Implementation Risks

Identify anything in the design that may be:

- Technically complex or expensive to implement
- Likely to perform poorly on mobile or low-powered devices
- Difficult to make accessible
- Dependent on third-party services or assets
- Likely to create build or deployment complexity
- Difficult to maintain or update

---

## 19. Unresolved Design Decisions

Note any:

- Placeholder content that needs to be written
- Undefined interaction behaviour
- Missing responsive behaviour
- Undefined breakpoints
- Vague motion or animation specifications
- Undefined error or edge-case states
- Decisions deferred with "TBD" or blank frames

---

## Required Output Format

Return your findings organized by the section numbers above. For each finding, include:

- **Section:** The area this belongs to
- **Finding:** What you observed
- **Detail:** Specific values, names, or reference identifiers
- **Gap?** (yes/no) — Whether this is missing, incomplete, or unclear
- **Severity for gap:** (blocker | critical | major | minor | observation)

---

## Next Steps After This Review

Once you return the findings, they will be:
1. Recorded in FIGMA_AUDIT.md as the verified design reference
2. Used to populate TASTE.md with design principles and rules
3. Used to define the product vision, information architecture, and technical direction
4. Used to create implementation-ready tasks for Codex

---

## Review ID

FIGMA-001
