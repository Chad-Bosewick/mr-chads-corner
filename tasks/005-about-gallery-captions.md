# CODEX IMPLEMENTATION TASK

## Task ID

T-005

## Title

Fix about page gallery caption layout (QA Major)

## Objective

Fix the travel gallery captions on the About page so they are readable, unclipped, and visually intentional across mobile, tablet, and desktop.

## Product context

The about page travel gallery places `<figcaption>` elements inside `<figure>` containers that have `overflow-hidden`. At desktop sizes, captions appear visually clipped and too small — they look embedded in the image rather than proper captions.

## User story

As a visitor, I want gallery captions to be clearly readable and positioned as intentional metadata, not accidentally clipped by the image container.

## Scope

- Modify `src/app/about-temi/page.tsx` — restructure figure/caption layout
- Captions must sit outside the `overflow-hidden` image wrapper
- Caption styling must be consistent and legible at all breakpoints

## Out of scope

- Changing the images themselves
- Changing the grid layout or image aspect ratios
- Adding new gallery features

## Design source

- QA finding: QA-2026-07-18-001, Major finding #5
- Current structure: `<figure className="overflow-hidden ...">` → `<div className="relative ...">` (image) → `<figcaption>` (caption inside overflow-hidden figure)

## Technical context

Current gallery structure:
```tsx
<figure className={`overflow-hidden bg-[#f0f0f0] ${i === 1 ? "aspect-[4/5] md:col-span-2" : "aspect-[4/3] md:col-span-2"}`}>
  <div className="relative h-full w-full">
    <Image ... />
  </div>
  <figcaption className="mt-2 font-sans text-sm text-[#757565]">
    {photo.location}
  </figcaption>
</figure>
```

The `overflow-hidden` on the figure clips the caption, and the caption inherits the figure's aspect-ratio constraint context.

## Approach

Move the `overflow-hidden` and aspect-ratio classes from `<figure>` to the image's `<div>` wrapper only. The `<figcaption>` should be outside the overflow-hidden container so it renders as a natural block-level caption below the image.

```tsx
<figure>
  <div className={`overflow-hidden ${i === 1 ? "aspect-[4/5] md:col-span-2" : "aspect-[4/3] md:col-span-2"}`}>
    <div className="relative h-full w-full">
      <Image ... />
    </div>
  </div>
  <figcaption className="mt-2 font-sans text-sm text-[#757565]">
    {photo.location}
  </figcaption>
</figure>
```

Note: the col-span classes should stay on the grid children (the `<figure>` in the grid context). The aspect-ratio and overflow should move to the inner div.

## Acceptance criteria

- [ ] Captions are fully visible (not clipped) at 390px, 768px, 1024px, and 1440px
- [ ] Caption text is a readable size at all breakpoints
- [ ] Image aspect ratios are preserved
- [ ] Grid layout (md:col-span-2, etc.) is preserved
- [ ] `npm run build` passes

## Likely files affected

- Modify: `src/app/about-temi/page.tsx`

## Required output

Return:

1. implementation summary
2. files changed
3. screenshots or description of visual change at 390/768/1024/1440px
4. confirmation build passes
