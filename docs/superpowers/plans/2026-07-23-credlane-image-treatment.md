# Credlane Image Treatment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix image presentation in the Credlane case study — correct aspect ratios, add width tiers, build carousel for multi-screen sections, remove unused image sections.

**Architecture:** Three width modes for images (text-column 680px, full-bleed 1120px, carousel), native aspect ratios instead of forced 4/3, and selective image removal.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, existing `CinematicImage` component.

## Global Constraints

- All existing design tokens preserved: `#151515`, `#757575`, `#A43718`
- Font stack unchanged (font-sans)
- Max widths: PageShell 1120px, ReadingColumn 680px
- Carousel is "use client" (interactive state)
- All motion respects `prefers-reduced-motion`
- No new dependencies — implement carousel with native React state + CSS
- Image format: WebP at quality 95 (existing)

---

## Task 1: Remove unused image sections from content data

**Files:**
- Modify: `src/content/case-studies.ts` (Credlane sections array)

**Objective:** Remove image sections that no longer apply:
1. Remove the "External assessment creation flow" full-image section (line ~526-534)
2. Remove the "External applicant journey" full-image section (line ~536-544)
3. Remove the "Results detail" image-pair section (line ~660-673)

- [ ] **Step 1:** Remove the three image sections from the `credlane.sections` array
- [ ] **Step 2:** Verify `npx tsc --noEmit` passes
- [ ] **Step 3:** Verify the page renders correctly (no broken references)
- [ ] **Step 4:** Commit

---

## Task 2: Change `full-image` sections to use proper width treatment

**Files:**
- Modify: `src/content/case-studies.ts` (Credlane sections)

**Objective:** Add a `width` field to image sections so the layout can render them at the correct width.

- [ ] **Step 1:** Add optional `width?: "text" | "full-bleed"` field to the `images` items in `ContentSection` (or to the section itself)
- [ ] **Step 2:** Set `width: "full-bleed"` on the "Final product" section
- [ ] **Step 3:** Leave all other image sections as default (`"text"` = 680px)
- [ ] **Step 4:** Verify TypeScript passes
- [ ] **Step 5:** Commit

---

## Task 3: Fix aspect ratio handling in CinematicImage / ImagePair

**Files:**
- Modify: `src/components/case-study/ImagePair.tsx`
- Modify: `src/components/case-study/CinematicImage.tsx` (if exists)

**Objective:** Remove the hardcoded `4/3` aspect ratio. Use native image dimensions or a configurable aspect ratio.

- [ ] **Step 1:** Read current `ImagePair.tsx` to understand the aspect ratio constraint
- [ ] **Step 2:** Add optional `aspectRatio?: string` prop to `ImagePair` (default: auto/native)
- [ ] **Step 3:** When no aspectRatio is set, use `w-full h-auto` on the image instead of `aspect-ratio: 4/3` with `object-contain`
- [ ] **Step 4:** Remove `object-contain` when using native ratios — use `object-cover` or `w-full h-auto`
- [ ] **Step 5:** Verify all existing images render correctly (no layout shift, no letterboxing)
- [ ] **Step 6:** Commit

---

## Task 4: Add full-bleed width mode for Hero + Final product

**Files:**
- Modify: `src/components/case-study/CaseStudyLayout.tsx` (renderSection function)
- Modify: `src/components/case-study/ImagePair.tsx` (or new wrapper)

**Objective:** When a section has `width: "full-bleed"`, the image breaks out of ReadingColumn and spans the full PageShell width (1120px).

- [ ] **Step 1:** In `renderSection`, check `section.width === "full-bleed"` for `full-image` type
- [ ] **Step 2:** When full-bleed, render the image outside ReadingColumn (at PageShell level)
- [ ] **Step 3:** Ensure the image uses native aspect ratio, not 4/3
- [ ] **Step 4:** Verify hero and final product render at full width, all other images stay at 680px
- [ ] **Step 5:** Commit

---

## Task 5: Build CarouselImage component

**Files:**
- Create: `src/components/case-study/CarouselImage.tsx`

**Objective:** A "use client" component that displays multiple images as a horizontal carousel with arrow navigation.

**Requirements:**
- Arrow navigation: left/right chevron buttons
- Desktop: arrows visible on hover or always visible
- Mobile: touch/swipe support + arrows
- Slide counter: "1 / 4" style indicator
- Caption below the active slide
- Respects `prefers-reduced-motion`
- Accessible: `role="region"`, `aria-label`, keyboard navigation (left/right arrows)
- Styled consistently with existing design tokens
- Uses `CinematicImage` or Next.js `Image` for each slide
- Smooth horizontal scroll-snap for native feel

- [ ] **Step 1:** Create the component with state management (current slide index)
- [ ] **Step 2:** Implement arrow navigation buttons
- [ ] **Step 3:** Implement horizontal scroll with CSS scroll-snap
- [ ] **Step 4:** Add slide counter indicator
- [ ] **Step 5:** Add keyboard navigation (left/right arrow keys when focused)
- [ ] **Step 6:** Add touch/swipe support for mobile
- [ ] **Step 7:** Style with existing design tokens
- [ ] **Step 8:** Test with reduced-motion preference
- [ ] **Step 9:** Commit

---

## Task 6: Wire CarouselImage into case study layout

**Files:**
- Modify: `src/content/case-studies.ts` (add carousel section type)
- Modify: `src/components/case-study/CaseStudyLayout.tsx` (renderSection)
- Create: `src/components/case-study/CarouselSection.tsx` (wrapper with heading + SectionReveal)

**Objective:** Add a new `carousel` section type to the content model and render it in the layout.

- [ ] **Step 1:** Add `carousel` to the `ContentSection` union type with fields: `heading`, `images[]` (src, alt, caption)
- [ ] **Step 2:** Create `CarouselSection.tsx` wrapper with heading + SectionReveal + CarouselImage
- [ ] **Step 3:** Add `case "carousel"` to `renderSection` in CaseStudyLayout
- [ ] **Step 4:** Convert Talent experience image section from `full-image` to `carousel` type
- [ ] **Step 5:** Convert Employer experience image section from `full-image` to `carousel` type
- [ ] **Step 6:** Use placeholder images temporarily (existing composites) until carousel exports arrive
- [ ] **Step 7:** Verify TypeScript passes and pages render
- [ ] **Step 8:** Commit

---

## Task 7: Update carousel images when exports arrive

**Files:**
- Modify: `src/content/case-studies.ts` (update image paths)

**Objective:** Replace placeholder image paths with the actual carousel slide exports.

- [ ] **Step 1:** Verify all 8 carousel images exist in `public/images/case-studies/credlane/carousel/`
- [ ] **Step 2:** Update the Talent carousel section to reference `credlane-talent-01-dashboard.webp` through `credlane-talent-04-assessment-complete.webp`
- [ ] **Step 3:** Update the Employer carousel section to reference `credlane-employer-01-overview.webp` through `credlane-employer-04-create-assessment.webp`
- [ ] **Step 4:** Verify TypeScript passes
- [ ] **Step 5:** Verify carousel renders with correct images
- [ ] **Step 6:** Commit

---

## Task 8: Fix Assessment workflow section (duplicate image)

**Files:**
- Modify: `src/content/case-studies.ts`

**Objective:** The "Assessment workflow" section currently uses `credlane-talent-journey.webp` (the same composite as the Talent carousel). This is a duplicate. Decide whether to:
- Option A: Keep as a static full-image at 680px (showing the composite) — simpler
- Option B: Remove the image and make it text-only — cleaner

Recommendation: **Option A** — keep as static image. The composite is a process overview image, not meant to be scrutinized screen-by-screen.

- [ ] **Step 1:** Keep the "Assessment workflow" section as `full-image` type with `credlane-talent-journey.webp`
- [ ] **Step 2:** Verify it renders at 680px text-column width
- [ ] **Step 3:** Commit

---

## Verification

After all tasks:
1. `npx tsc --noEmit` — zero errors
2. `npx next build` — clean build
3. Visit `/featured-case-studies/credlane` and verify:
   - Hero image is full-bleed (1120px)
   - Text sections are centered at 680px
   - Pattern research, Figma overview, candidate review, design system images are at 680px
   - Assessment workflow image is at 680px (static)
   - Talent journey is a 4-slide carousel with arrow navigation
   - Employer journey is a 4-slide carousel with arrow navigation
   - Final product montage is full-bleed (1120px)
   - External creation and external applicant sections are text-only (no images)
   - Results detail pair is removed
   - No letterboxing on any image
   - Carousels work on mobile (swipe) and desktop (arrows)
   - Keyboard navigation works on carousels
   - Reduced motion preference disables carousel animations
   - All images load without errors
