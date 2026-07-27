# CHATGPT QA REVIEW REQUEST

## Review ID

DRAFTLY-CS-002

## Feature

Draftly case study — full rewrite, homepage card correction, carousel component enhancement

## Review objective

Determine whether the rewritten Draftly case study meets the product's quality bar for: narrative coherence, visual presentation, responsive behaviour, accessibility, design-system consistency, and content accuracy. Approve or identify blocking issues before this ships.

## Approved requirement

The Draftly case study was rewritten from a multi-section placeholder into a consolidated editorial narrative. The homepage project card text was corrected to match the case study's actual positioning. Two new carousel sections were added with custom aspect-ratio and transition-surface support to the shared carousel components.

---

## Section mapping: original 18 → consolidated 9

The original Draftly case study contained 18 content sections. These were consolidated into 9 editorial sections. The consolidation was deliberate — the original structure spread single ideas across separate text + image blocks, resulting in a fragmented reading experience. The rewrite merges related content into tighter narrative beats while preserving every substantive claim. Below is the complete mapping.

### Original sections (18)

| # | Type | Heading | Chapter |
|---|---|---|---|
| 1 | executive-summary | (Problem / Solution / Outcome) | — |
| 2 | what-i-designed | What I designed | — |
| 3 | text | The problem | context |
| 4 | text | Product positioning | — |
| 5 | full-image | Product positioning | — |
| 6 | text | Landing page | solution |
| 7 | full-image | Landing page hero | — |
| 8 | text | AI Idea Starter | — |
| 9 | image-pair | Idea Starter flow | — |
| 10 | text | Writing Assistant | solution |
| 11 | full-image | Writing Assistant | — |
| 12 | text | Explain My Mistake | — |
| 13 | full-image | Explain My Mistake | — |
| 14 | what-i-designed | Use cases | — |
| 15 | text | Integrity checks | — |
| 16 | full-image | Integrity checks | — |
| 17 | text | Pricing | — |
| 18 | text | FAQ | — |

### New sections (9)

| # | Type | Heading | Chapter | What it covers |
|---|---|---|---|---|
| 1 | executive-summary | (Problem / Solution / Outcome) | — | Retained. Copy tightened: outcome now references the Writing Journey, which was absent from the original. |
| 2 | what-i-designed | What I designed | — | Merged original #2 (What I designed) + #14 (Use cases). Four features: Product story, Idea Starter, Writing Assistant, Progress system. |
| 3 | text | A coach, not a generator | context | Merged original #3 (The problem) + #4–5 (Product positioning). The core product decision — teach before automating — now leads the narrative instead of being buried in a separate section. |
| 4 | text | Two learning-first product moments | solution | Merged original #8 (AI Idea Starter) + #10 (Writing Assistant) + #12 (Explain My Mistake). The three product concepts are now two: Idea Starter (brainstorming) and Writing Assistant (revision). "Explain My Mistake" is absorbed into the Writing Assistant description, where it belongs — it was always a feature of that tool, not a separate flow. |
| 5 | carousel | Product demonstrations | — | New. Two Figma-exported frames (Idea Starter + Writing Assistant) replace the original scattered full-image + image-pair treatments (#7, #9, #11, #13). Custom aspect ratio (880/573) and transition surface (#F6F4FE). |
| 6 | text | Make progress visible | — | New content. Describes the Writing Journey (four-stage progression cards) and the visual brand system. The original had no equivalent section — Writing Journey assets were referenced in the overview but never shown or discussed. |
| 7 | carousel | Visual and brand system | — | New. Renders the Draftly Visual & Brand System board at 1920/1080 aspect ratio. See "Single-image carousel" note below. |
| 8 | results | Outcome | results | New. Three outcome bullets replacing the implicit outcome in the original executive summary. Evidence-based: product wedge, investor presentation, system coherence. |
| 9 | text | What I would validate next | reflection | New. Genuine next-step reflection — testing the learning loop with students, not expanding the marketing page. The original had no reflection section. |

### What was removed and why

| Original section | Disposition |
|---|---|
| #6–7 Landing page hero + description | Absorbed into the CoverScroll hero (the landing page is shown in full via CoverScroll, making a separate hero image redundant). |
| #12–13 Explain My Mistake | Absorbed into Writing Assistant description (#4). It was a sub-feature, not a standalone flow. |
| #14 Use cases | Merged into What I designed (#2). The four use cases map directly to the four designed features. |
| #15–16 Integrity checks | Removed. These were placeholder sections with no substantive content — the original body text read "Integrity checks content coming soon." |
| #17 Pricing | Removed. Pricing was a landing-page section shown in the CoverScroll; it is not a design-decision story. |
| #18 FAQ | Removed. FAQ was a landing-page section shown in the CoverScroll; it is not a design-decision story. |

No substantive design reasoning, product decisions, or project outcomes were lost in the consolidation.

---

## Visual evidence

### Image inventory

All images are committed to the repository under `public/images/`.

| File | Purpose | Dimensions | Used in |
|---|---|---|---|
| `draftly/draftly-hero-1440x900.webp` | HeroMedia — landing page hero with product preview | 1440×900 | Case study hero (fallback if CoverScroll absent) |
| `draftly/draftly-landing-page-full.webp` | CoverScroll — full-page landing page screenshot | 1200×2400 | CoverScroll auto-scroll frame |
| `draftly/draftly-idea-starter-feature.webp` | Product demo — Idea Starter feature frame | 880×573 | Product demonstrations carousel (slide 1) |
| `draftly/draftly-writing-assistant-feature.webp` | Product demo — Writing Assistant feature frame | 880×573 | Product demonstrations carousel (slide 2) |
| `draftly/draftly-visual-brand-system.webp` | Brand system — visual identity board from Figma | 1920×1080 | Visual and brand system frame |
| `case-studies/draftly-cover.webp` | Legacy cover — used by homepage card and case-study index | — | Homepage project row, case-study index |

### Alt text

| Image | Alt text |
|---|---|
| `draftly-hero-1440x900.webp` | "Draftly landing page hero showing the AI writing coach positioning and product interface preview" |
| `draftly-landing-page-full.webp` | "Draftly landing page" |
| `draftly-idea-starter-feature.webp` | "Draftly AI Idea Starter product frame from Figma" |
| `draftly-writing-assistant-feature.webp` | "Draftly Writing Assistant product frame from Figma" |
| `draftly-visual-brand-system.webp` | "Draftly visual and brand system board from Figma" |

### Screenshot instructions

To capture the evidence for this review, run the dev server (`npm run dev`) and capture:

1. **Desktop full-page** — `/featured-case-studies/draftly/` at 1440px width, full-page scroll
2. **Desktop carousel close-up** — Product demonstrations carousel (Idea Starter slide visible)
3. **Desktop brand board** — Visual and brand system frame
4. **Mobile** — `/featured-case-studies/draftly/` at 375px width, full-page scroll
5. **Homepage card** — `/` Draftly project row at 1440px width

---

## Single-image carousel: Visual and Brand System frame

The "Visual and brand system" section renders the brand board using the shared `CarouselImage` component with a single slide. This is intentional:

- The `CarouselImage` component already handles single-slide content correctly: when `slides.length <= 1`, the navigation controls (arrows, dots, slide counter) are hidden (line 233: `{slides.length > 1 && ...}`). The result is a static framed image.
- The frame properties are constant and independent of slide count or any animation: `max-w-[680px]`, `rounded-xl`, `shadow-[0_8px_30px_rgba(21,21,21,0.08)]`, hover shadow transition, and the source aspect ratio of `1920/1080`.
- The `carouselAspectRatio` and `carouselBackground` props control only the frame geometry and background colour. They do not affect motion, animation, or navigation behaviour.
- This approach ensures the brand board receives the same visual treatment (frame, shadow, rounded corners, aspect ratio) as multi-slide carousels, maintaining design-system consistency without introducing a separate component variant.

**Do not change the frame properties or replace this with a different component.** The visual output is a static, framed, 16:9 image — exactly as intended.

---

## New design-system work: QA items

The Draftly case study introduces new visual assets that should be assessed for quality and portfolio presentation:

### Draftly pencil-character mascot

- The mascot is referenced in the case study copy ("a visual identity, mascot, and four-stage Writing Journey") and appears within the Visual & Brand System board image.
- **QA check:** Is the mascot visible and legible within the brand board at portfolio scale? Does it feel like a credible brand asset rather than a rough sketch?

### Writing Journey four-stage illustration progression

- The Writing Journey (pre-writing → drafting → revising → polishing) is described in the "Make progress visible" text section and appears within the Visual & Brand System board.
- **QA check:** Is the four-stage colour/illustration progression visible and distinguishable within the brand board? Does the progression feel intentional and visually coherent?

### Visual & Brand System board

- The board is a 1920×1080 Figma export rendered at 680px max-width within the case study.
- **QA check:** At portfolio scale (680px), is the board readable? Can a reviewer identify the colour palette, typography choices, mascot, Writing Journey cards, and overall brand language? Is the board too dense or too sparse at this scale?

---

## Review areas

### Content & Narrative
- Does the executive summary (Problem / Solution / Outcome) accurately capture the project?
- Does the "A coach, not a generator" positioning section clearly articulate the product decision?
- Are the "What I designed" feature descriptions accurate and concise?
- Does the Outcome section feel earned by the narrative?
- Is the "What I would validate next" reflection genuine and specific?
- Is the writing voice consistent throughout — specific, concise, evidence-based, human?
- Does the 18→9 section consolidation preserve all substantive content? (See mapping above.)

### Visual Presentation
- Does the CoverScroll render the Draftly landing page correctly at 16:10?
- Do the section labels on CoverScroll (Meet Draftly, Product, Learning support, etc.) align with visible content?
- Does the Product demonstrations carousel show the Idea Starter and Writing Assistant frames at the correct aspect ratio (880/573)?
- Does the Visual and Brand System frame display at 16:9 with correct shadow and border radius?
- Is the transition surface colour (#F6F4FE) visible during carousel slide transitions?
- Are chapter dividers visually appropriate between context → solution → results → reflection?
- Is the section spacing rhythm comfortable — not too tight, not too loose?
- Is the brand system board readable and portfolio-appropriate at 680px width?

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
- Some legacy Draftly images exist in `public/images/draftly/` that are not referenced by the current case study (from earlier iterations). These are inert and do not affect rendering.

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
