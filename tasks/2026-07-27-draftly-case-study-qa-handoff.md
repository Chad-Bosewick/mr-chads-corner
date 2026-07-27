# CHATGPT QA REVIEW REQUEST

## Review ID

DRAFTLY-CS-001

## Feature

Draftly case study — full rewrite and homepage card correction

## Review objective

Determine whether the rewritten Draftly case study meets the product's quality bar for: narrative coherence, visual presentation, responsive behaviour, accessibility, design-system consistency, and content accuracy. Approve or identify blocking issues before this ships.

## Approved requirement

The Draftly case study was rewritten from a placeholder into a full editorial narrative across 9 sections. Two new carousel sections were added with custom aspect-ratio and transition-surface support. The homepage project card text was corrected to match the case study's actual positioning (AI writing coach for high-school students, not a professional drafting tool).

## Design source

- Figma file: Draftly project files (product frames exported as webp)
- Relevant frames: Landing page full screenshot, Idea Starter feature frame, Writing Assistant feature frame, Visual & Brand System board
- TASTE.md principles: editorial storytelling, calm restraint, premium without corporate, human without casual, no generic design language
- Relevant acceptance criteria:
  - Case study reads as a coherent narrative, not a collection of disconnected sections
  - All images render without broken references
  - Carousels transition smoothly and are keyboard-accessible
  - CoverScroll displays the landing page at 16:10 with section labels
  - Chapter dividers separate context → solution → results → reflection
  - Sidebar navigation reflects the section structure
  - Mobile layout is readable and carousels are touch-friendly
  - No accessibility regressions (contrast, focus states, alt text, reduced motion)

## Environment

- Preview URL: http://localhost:3000
- Route: `/featured-case-studies/draftly/`
- Homepage card: `/` (Draftly project row)
- Device sizes to test: 375px (mobile), 768px (tablet), 1280px (laptop), 1440px+ (desktop)
- Browser: Chrome/Safari latest

## Evidence provided

- Page renders at 200 across all routes (verified via HTTP)
- All 6 referenced images exist in public directory
- Production build passes clean
- Structural review: no TypeScript type mismatches, all props threaded correctly
- Owner visual confirmation: desktop and mobile confirmed good

## Review areas

### Content & Narrative
- Does the executive summary (Problem / Solution / Outcome) accurately capture the project?
- Does the "A coach, not a generator" positioning section clearly articulate the product decision?
- Are the "What I designed" feature descriptions accurate and concise?
- Does the Outcome section feel earned by the narrative?
- Is the "What I would validate next" reflection genuine and specific?
- Is the writing voice consistent throughout — specific, concise, evidence-based, human?

### Visual Presentation
- Does the CoverScroll render the Draftly landing page correctly at 16:10?
- Do the section labels on CoverScroll (Meet Draftly, Product, Learning support, etc.) align with visible content?
- Does the Product demonstrations carousel show the Idea Starter and Writing Assistant frames at the correct aspect ratio (880/573)?
- Does the Visual and Brand System carousel display at 16:9?
- Is the transition surface color (#F6F4FE) visible during carousel slide transitions?
- Are chapter dividers visually appropriate between context → solution → results → reflection?
- Is the section spacing rhythm comfortable — not too tight, not too loose?

### Responsive Behaviour
- Does the sidebar navigation collapse to a horizontal scrollable bar on mobile?
- Are carousels touch-swipeable on mobile?
- Is the CoverScroll usable on mobile (manual scroll)?
- Does typography scale appropriately across breakpoints?
- Do images maintain their aspect ratios without layout shift?

### Accessibility
- Are carousel controls (arrows, dots) keyboard-accessible with visible focus states?
- Do carousel slides have appropriate `aria-roledescription="slide"` and `aria-label`?
- Is the CoverScroll scrollable region keyboard-accessible?
- Are all images accompanied by meaningful alt text?
- Do contrast ratios meet WCAG AA (text on #f5f2ee background)?
- Does the page respect `prefers-reduced-motion`?
- Is the sidebar navigation screen-reader-accessible with `aria-current="location"`?

### Design System Consistency
- Does the Draftly case study follow the same component patterns as Travecs and Letters App?
- Are the carousel component changes (aspectRatio, background props) backward-compatible with existing case studies?
- Does the ExecutiveSummary component match the site's typography and spacing conventions?
- Is the section heading hierarchy consistent with other case studies?

### Homepage Card
- Does the Draftly project row display the corrected text: "An AI writing coach that teaches through explanation, not automation"?
- Does the description match: "A learning-first writing tool for high-school students that helps them brainstorm, revise, and understand their work — turning every correction into a teaching moment"?
- Is the old incorrect text ("writers who think visually and editors who think structurally") completely gone?

## Known constraints

- Draftly is a concept/prototype, not a shipped product — the case study describes design work, not engineering outcomes
- The Writing Journey illustration cards mentioned in the overview are not shown as separate sections — they are described in the "Make progress visible" text section
- The brand system carousel contains a single image (the Figma brand board), not multiple slides
- Some legacy Draftly images exist in `public/images/draftly/` that are not referenced by the current case study (from earlier iterations)

## Known issues

- None identified during structural review
- Visual confirmation done by owner on desktop and mobile

## Required response

Return:

1. pass, conditional pass, or fail
2. findings classified by severity (blocker / critical / major / minor / observation)
3. evidence and rationale
4. required corrections
5. optional improvements
6. retest criteria
7. release recommendation
