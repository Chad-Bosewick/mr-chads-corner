# CODEX IMPLEMENTATION TASK

## Task ID

T-011

## Title

Fix case study and cover image cropping — ensure images are fully visible

## Objective

Fix the severe cropping on case study images where `object-cover` combined with fixed aspect ratios cuts off critical visual content — especially on tall phone screenshots (492x1057, ratio 0.46) that lose over half their width, and near-square cover images forced into 16:9 frames. Images must be fully readable so visitors can see the actual design work.

## Product context

Case study images have wildly varying aspect ratios:
- **Tall phone screenshots** (ratio ~0.46): 492x1057 — forced into `aspect-[4/3]` with `object-cover` loses ~65% of the image width
- **Cover images** (ratio ~0.92): 520x565 — forced into `aspect-[16/9]` crops top/bottom
- **Wide showcase** (ratio ~1.73): 800x461 — slight cropping in 4:3
- **Personas** (ratio ~1.07): 800x744 — OK in 4:3, minor cropping

The current `object-cover` approach makes case study imagery unreadable — especially phone mockup screenshots where the actual UI content is cropped away.

## User story

As a visitor reading a case study, I need to see the full design work in each image — not a cropped fragment. I should be able to understand what's being shown without guessing.

## Scope

- Fix `src/components/case-study/ImagePair.tsx` — replace `object-cover` with `object-contain` in image containers
- Fix `src/components/case-study/CaseStudyLayout.tsx` — fix the cover image treatment
- The background colour (`bg-[#f0f0f0]`) provides a neutral canvas for letterboxing when using `object-contain`
- All 17 case study images should be fully visible after the fix

## Out of scope

- Changing the images themselves
- Changing the layout grid or content structure
- Adding phone mockup frames (future enhancement)
- Changing non-case-study images (travel gallery, etc.)
- Adding new images to the content data

## Design source

- User feedback: "images are weirdly cropped and you can barely tell what is being shown"
- Current implementation: `object-cover` crops to fill the container aspect ratio, destroying legibility

## Technical context

### ImagePair.tsx (lines 27-28)
```tsx
<div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f0f0]">
  <Image fill className="object-cover" ... />
</div>
```

### CaseStudyLayout.tsx (lines 43-51)
```tsx
<div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-[#f0f0f0] md:mt-12">
  <Image fill className="object-cover" ... />
</div>
```

In both cases, `object-cover` scales the image to fill the container, cropping anything that overflows the aspect ratio. With `object-contain`:
- The full image is visible within the container
- Letterbox bars appear where the aspect ratio doesn't match
- The existing `bg-[#f0f0f0]` provides a clean neutral background for the bars
- No content is ever cropped

## Approach

### Step 1: Fix ImagePair
Change `object-cover` to `object-contain` in the image div. This ensures the full image is always visible within the 4:3 frame.

```tsx
<div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f0f0]">
  <Image fill className="object-contain" ... />
</div>
```

### Step 2: Fix CaseStudyLayout cover
Change `object-cover` to `object-contain` for the cover image. Also consider using `object-contain p-2` or `bg-contain` for a cleaner presentation.

```tsx
<div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-[#f0f0f0] md:mt-12">
  <Image fill className="object-contain" ... />
</div>
```

### Optional enhancement: cover image aspect ratio
Since all three covers are nearly square (520x565, ratio 0.92), consider changing the cover container from `aspect-[16/9]` to `aspect-[5/6]` or `aspect-square` for a more natural fit with less letterboxing. Evaluate this visually.

## Visual requirements

1. Every case study image must show its FULL content — no cropping
2. Letterbox bars must use the existing neutral `bg-[#f0f0f0]` colour
3. Image quality must not degrade (w/noise or artifacts from letterboxing)
4. On mobile, images should still be legible at the smaller width

## Responsive requirements

1. Images must be fully visible at 390px, 768px, 1024px, and 1440px
2. No overflow or layout breaking
3. Image caption layout must not shift

## Acceptance criteria

- [ ] Case study cover images show the full image (no cropping) on all pages
- [ ] ImagePair images show full content (no cropping) on all pages
- [ ] Full-image sections show full content (no cropping) on all pages
- [ ] Tall phone screenshots (492x1057) are fully visible — the UI content must be readable
- [ ] `bg-[#f0f0f0]` provides neutral letterbox background
- [ ] Image captions remain correctly positioned below images
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/components/case-study/ImagePair.tsx`
- Modify: `src/components/case-study/CaseStudyLayout.tsx`

## Required output

Return:

1. implementation summary
2. files changed
3. before/after description of how images render (especially the tall phone screenshots)
4. confirmation build, lint pass
