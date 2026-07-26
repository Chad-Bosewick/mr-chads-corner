# CODEX IMPLEMENTATION TASK

## Task ID

T-009

## Title

Scroll-triggered cinematic image reveals (WOW factor)

## Objective

Add scroll-triggered cinematic scale/zoom reveals to key images across the site — cover images, case study imagery, and project cards. Images should subtly scale up or zoom as they enter the viewport, creating a premium, cinematic sense of pacing and discovery.

## Product context

The current site uses `SectionReveal` for fade+slide text reveals but images appear statically. Adding cinematic scroll reveals to imagery will dramatically elevate the perceived quality and make browsing the portfolio feel like watching a carefully paced visual story.

## User story

As a visitor scrolling through the portfolio, I want images to reveal themselves with a subtle cinematic quality — zooming or scaling gently into view — so the experience feels curated and premium.

## Scope

- Create a new `CinematicImage` component that wraps `next/image` with scroll-triggered scale/zoom
- Use it for: case study cover images, case study full-image sections, image pair images
- The effect: image enters the viewport slightly larger (scale 1.05-1.1) and gently scales to 1.0 as it becomes visible, with a subtle parallax or zoom effect
- Must work within the existing `SectionReveal` system or complement it
- Must respect reduced-motion preferences

## Out of scope

- Adding the feature to non-image elements (text, metrics bars)
- Adding complex parallax (keep it simple — scale reveal is enough)
- Changing the about page travel gallery (separate existing component)

## Design sources

### References
- **Both reference sites**: Images that feel alive and present, not static content blocks
- The effect should be subtle — barely noticeable on repeat visits, but contributing to a sense of quality on first browse

### Current approach
- Images currently use `SectionReveal` wrapping for fade+slide of the container
- Image itself has `object-cover` and optional `group-hover:scale-105` on project rows
- No scroll-driven animation on images themselves

## Technical context

- Existing reveal system: `useScrollReveal` hook with IntersectionObserver
- Images use `next/image` with `fill` and `className="object-cover"`
- Existing images throughout the site are wrapped in `overflow-hidden` containers
- Motion library available for animation (project dependency: `"motion": "^11.0.0"`)

## Approach

### The effect
When an image scrolls into view:
1. The image starts at ~scale(1.08) within its overflow-hidden container
2. As the element enters the viewport (0% → 100% visible), the image scales from 1.08 → 1.0
3. Optional: a very subtle brightness/contrast shift as it reveals
4. Duration: linked to scroll position, not a fixed time — or use a generous 600-800ms transition

### Implementation options

**Option A (recommended): IntersectionObserver + CSS transition**
Use the existing `useScrollReveal` pattern or a new variant. When the element enters the threshold, apply a `scale-100` class that transitions from `scale-105`. Simple, reliable, works with static export.

**Option B: CSS `@scroll-timeline`** — Too new, not broadly supported. Skip.

**Option C: Motion's `useScroll`/`useTransform`** — More complex, uses `framer-motion`/`motion` library. Only if Option A doesn't achieve the desired quality.

## Visual requirements

1. Effect must be subtle — barely noticeable but contributing to a premium feel
2. Images should feel like they're settling into place, not jumping
3. The effect should be unified across all image types (cover, full, pairs)
4. No layout shift or image distortion during animation

## Interaction requirements

1. Only triggers once per image (on first scroll into view)
2. Works regardless of scroll speed
3. Smooth at 60fps

## Responsive requirements

1. Effect works at all viewport sizes
2. Performance acceptable on mobile (no heavy GPU work)

## Accessibility requirements

1. Effect disabled when `prefers-reduced-motion: reduce` is active
2. No content is hidden or dependent on the animation

## Acceptance criteria

- [ ] Case study cover images gently scale-zoom on scroll reveal
- [ ] Full-image sections in case studies have the same treatment
- [ ] Image pair images reveal with subtle scale
- [ ] Effect works on mobile, tablet, desktop
- [ ] With reduced-motion: images simply appear (no animation)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Create: `src/components/ui/CinematicImage.tsx`
- Modify: `src/components/case-study/CaseStudyLayout.tsx` (use new component)
- Modify: `src/components/case-study/ImagePair.tsx` (use new component)

## Required output

Return:

1. implementation summary
2. files changed
3. description of the reveal effect achieved
4. confirmation build, lint pass
