# CODEX IMPLEMENTATION TASK

## Task ID

T-007

## Title

Cinematic project cards with scale reveals (WOW factor)

## Objective

Transform the project card rows on the homepage and case-study index into cinematic, visually dramatic entry points. Inspired by the confident image scale of Egregore and the editorial quality of Daily Dispatch.

## Product context

The current `ProjectRow` component shows a small thumbnail (180px height) beside text content. For a premium portfolio, project imagery should feel large, immersive, and cinematic — tempting the visitor to click and explore the case study.

## User story

As a visitor scanning the portfolio, I want project previews to feel visually compelling and cinematic, making me want to click through to see the full case study.

## Scope

- Modify `src/components/sections/ProjectRow.tsx` for more dramatic imagery
- Enhance the hover interaction with cinematic scale/overlay effects
- Increase image size/prominence in the row layout
- Add smooth, purposeful animation on hover (image scale, content transition)

## Out of scope

- Changing the case study detail pages
- Adding new images (use existing coverSrc images)
- Changing the projects content data

## Design sources

### References
- **Both sites**: Use imagery at impactful scale, with confidence
- The current thumbnail + text layout should remain but with dramatically more visual weight on the image

### Current implementation
```tsx
// Image: 260px wide on desktop, 4/3 aspect, 180px height
// Content: category label, title, description, CTA link
```

## Technical context

- Component: `src/components/sections/ProjectRow.tsx`
- Uses `next/image` with `fill` and `object-cover`
- Hover currently: `group-hover:scale-[1.03]` (subtle)
- SectionReveal wraps each row with stagger delay
- Existing cover images in `public/images/`

## Approach

### Image treatment
1. Increase the image's visual weight significantly — consider making it larger relative to text, or giving it a larger allocated space in the grid
2. Add a subtle overlay on hover (dark gradient or accent tint) that reveals more dramatic content
3. More pronounced scale on hover (`scale-105` or `scale-110`)
4. Consider rounded corners or a polaroid/card treatment for editorial feel

### Content interaction
1. Text can shift or transition on hover (existing arrow animation works — can be more pronounced)
2. Category label could have a subtle background treatment on hover
3. "Read case study" link becomes more prominent on hover

### Motion
1. Image scale: subtle but noticeably cinematic (`scale-105` to `scale-110` with ease-out)
2. Content elements stagger slightly on hover (image scales, then text shifts)
3. A subtle shadow/glow enhancement on hover
4. All motion must respect `prefers-reduced-motion`

## Visual requirements

1. Images must feel dramatically more prominent than current (at least 1.5x current visual weight)
2. Hover state must feel cinematic, not just functional
3. The row should feel curated and editorial, not like a list item
4. Images must remain sharp and properly sized (check the `sizes` attribute)

## Responsive requirements

1. Mobile: stack image above content (already does this) with generous proportions
2. Tablet/Desktop: image takes up more horizontal space than current 260px
3. No layout shifts or overflow on hover

## Acceptance criteria

- [ ] Project images have significantly more visual weight in the row layout
- [ ] Hover triggers a cinematic effect (scale + overlay + content transition)
- [ ] Image scale animation is smooth and purposeful (not janky)
- [ ] Arrow/CTA animates on hover (existing behaviour, enhanced)
- [ ] Reduced-motion preference disables all hover motion
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/components/sections/ProjectRow.tsx`

## Required output

Return:

1. implementation summary
2. files changed (including any CSS additions)
3. description of hover/cinematic effect achieved
4. confirmation build, lint pass
