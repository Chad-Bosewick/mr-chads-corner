# CODEX IMPLEMENTATION TASK

## Task ID

T-008

## Title

Full-bleed case study images with breakout layout (WOW factor)

## Objective

Allow case study images (single full-width images and image pairs) to visually break out of the 680px content container on larger screens, creating dramatic editorial spreads where imagery takes center stage — inspired by the confident image scale of Daily Dispatch and Egregore.

## Product context

Case study pages are currently constrained to `max-w-[680px]` for readability. While body text should stay readable at this width, key project imagery should be able to span wider for visual impact — like a magazine where images stretch across the spread while text stays in the gutter.

## User story

As a visitor reading a case study, I want key images to feel expansive and editorial — breaking out of the text column to give me a proper view of the design work.

## Scope

- Modify `src/components/case-study/CaseStudyLayout.tsx` — add breakout capability for image sections
- The cover image should be full-bleed (wider than 680px)
- Single full-image sections should span wider on desktop (e.g. 860px or 1038px)
- Image pair sections should use more horizontal space
- Body text sections must stay at 680px for readability

## Out of scope

- Changing any case study content data
- Adding motion or scroll effects (handled in other tasks)
- Changing the about page or other page layouts

## Design sources

### References
- **Daily Dispatch**: Confident, expansive imagery that doesn't feel constrained
- **Egregore**: Full-width hero and feature images that dominate the viewport
- The principle: imagery should feel generous, text should feel readable

### Current implementation
`CaseStudyLayout.tsx` wraps everything in `mx-auto max-w-[680px]`. Cover image, text sections, image pairs, and metrics bars all share the same constraint.

## Technical context

- Layout file: `src/components/case-study/CaseStudyLayout.tsx`
- Content sections: `ContentSection` (text), `ImagePair` (images), `MetricBar` (metrics)
- Cover image: `<div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-[#f0f0f0] md:mt-12">` — this is already full-width within the 680px container
- Content types defined in `src/content/case-studies.ts`

## Approach

### Option A (recommended): Image-aware breakout
Instead of changing the article container, allow specific sections (cover, full-image, image-pair) to opt into a wider container:

```tsx
// Article wrapper stays max-w-[680px]
<article className="mx-auto max-w-[680px] ...">

// Image sections break out with negative margins or a wider wrapper
<section className="-mx-4 md:-mx-6 lg:-mx-[calc((1038px-680px)/2)]">
  ...image content...
</section>
```

This keeps text at optimal reading width while letting images breathe.

### Option B: Split layout
Use `grid` with the text column at 680px and images in adjacent columns on wide screens. More complex but more editorial.

## Visual requirements

1. Cover image spans wider than text on desktop (full viewport width or near it)
2. Full-image content sections break out of the 680px constraint
3. Image pairs use more horizontal space for the two-column layout
4. Text sections remain at 680px for comfortable reading
5. The shift between text-width and image-width feels intentional (like a magazine spread)

## Responsive requirements

1. Mobile: everything stays within the content margin (negative margins zero out)
2. Tablet: moderate breakout
3. Desktop (≥1024px): full breakout effect
4. No horizontal overflow — use careful negative margins that zero-out at small viewports

## Accessibility requirements

1. No loss of image content at any viewport
2. Images remain properly captioned

## Acceptance criteria

- [ ] Case study cover image spans wider than text on desktop (at least 860px or full content width)
- [ ] Full-image sections break out of 680px container on desktop
- [ ] Image pair sections use the extra width for better spacing
- [ ] Text sections remain at readable 680px width
- [ ] At 390px mobile, everything stays within standard padding with no overflow
- [ ] `npm run build` passes

## Likely files affected

- Modify: `src/components/case-study/CaseStudyLayout.tsx`
- Possibly modify: `src/components/case-study/ImagePair.tsx` (to accept breakout styling)

## Required output

Return:

1. implementation summary
2. files changed
3. screenshots at mobile and desktop showing the breakout effect
4. confirmation build passes
