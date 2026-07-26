# CODEX IMPLEMENTATION TASK

## Task ID

UI-003

## Title

Fix Letters App dual-phone layout: image swap + side-by-side restructure

## Objective

Fix two visual issues with the Letters App dual-phone composition on the homepage:
1. Replace the front phone image (currently a promotional collage that looks wrong inside a phone bezel) with a proper phone screenshot
2. Restructure the dual-phone layout so both phones are clearly visible in a side-by-side editorial composition, not mostly overlapping

## Product context

The Letters App project card on the homepage uses a `dual-phone` device variant to show two phones in an editorial composition. Currently:
- The front phone image (`letters-app-cover.webp`, 520×565) is a promotional collage showing 4 phones + 1 laptop on a peach background. When forced into a 9:19 phone bezel with `object-cover`, it gets severely cropped and looks wrong.
- The back phone is mostly hidden behind the front phone because the container (`max-w-[330px]`) is too narrow for two phones positioned with `absolute left-0` and `absolute right-0`.

The result looks like one broken phone instead of an intentional editorial composition.

## User story

As a portfolio visitor, I need to see two clearly distinct phones in the Letters App card so that I understand this is an intentional editorial composition showcasing multiple screens of the app.

## Scope

- Swap front phone image path in `projects.ts`
- Restructure dual-phone layout in `DeviceMockup.tsx` for clear side-by-side visibility
- Maintain existing animation, scroll-reveal, reduced-motion, and hover behaviour
- Maintain mobile behaviour (single front phone only)

## Out of scope

- Changing the back phone image (`letters-app-showcase.webp` stays)
- Changing animation keyframes in `globals.css`
- Changing `ProjectRow.tsx` (no prop changes needed)
- Other project cards
- New image exports from Figma
- TODO++ or Draftly device treatments

## Dependencies

- Images already exist in `public/images/case-studies/`:
  - `letters-app-homepage-post-1.webp` (492×1057) — new front phone
  - `letters-app-showcase.webp` (375×812) — existing back phone (keep)

## Design source

- Owner-approved decision: front phone should use `letters-app-homepage-post-1.webp`
- Owner-approved layout: "Side-by-side with overlap" — front phone left-center, back phone right, both clearly visible
- TASTE.md principle: layouts should feel composed rather than forced; visual rhythm through controlled contrast

## Technical context

- Framework: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- Relevant files:
  - `src/content/projects.ts` — content model (line 82: `coverSrc` needs update)
  - `src/components/ui/DeviceMockup.tsx` — component with dual-phone variant (lines 143-180)
  - `src/styles/globals.css` — float keyframes (lines 125-133, no changes needed)
  - `src/components/sections/ProjectRow.tsx` — passes props to DeviceMockup (no changes needed)
- The dual-phone variant uses absolute positioning inside a `relative` container
- Front phone: `absolute left-0 top-0 z-10 max-w-[200px]`
- Back phone: `absolute right-0 top-12 z-0 max-w-[190px]`
- Container: `relative mx-auto hidden h-[470px] w-full max-w-[330px] md:block`

## Functional requirements

1. Change the Letters App `coverSrc` in `projects.ts` from `"/images/case-studies/letters-app-cover.webp"` to `"/images/case-studies/letters-app-homepage-post-1.webp"`
2. Restructure the dual-phone desktop layout so both phones are clearly visible with the front phone sitting left and the back phone sitting right, with controlled overlap (~30-50px, not ~85px)
3. The back phone should be clearly visible — not mostly hidden behind the front phone
4. Maintain the staggered entrance: front phone enters first, back phone follows with 150ms delay
5. Maintain float animation on both phones (front: `device-float`, back: `device-float-secondary`)
6. Maintain reduced-motion behaviour (no float, both phones static)
7. Maintain hover behaviour (animation paused on group hover)
8. Maintain mobile behaviour: only front phone shown below `md`

## Visual requirements

1. Front phone: `letters-app-homepage-post-1.webp` (492×1057) — proper phone screenshot showing Letters App inbox/homepage with posts and navigation tabs. This image has a phone-like aspect ratio and will render correctly inside the 9:19 bezel.
2. Back phone: `letters-app-showcase.webp` (375×812) — unchanged
3. The composition should feel like an editorial layout: two phones arranged with intention, not accidentally overlapping
4. The back phone should sit slightly lower than the front phone (existing `top-12` offset is fine)
5. Both phones should be clearly distinguishable as separate devices

## Interaction requirements

1. Front phone enters first with fade/slide-up
2. Back phone follows with 150ms delay
3. Both phones float subtly (staggered)
4. Float pauses on group hover
5. Float disabled under prefers-reduced-motion

## Responsive requirements

1. Desktop (md+): two phones side-by-side with overlap
2. Mobile (<md): only front phone shown (existing behaviour, no change)

## Accessibility requirements

1. Both phones have appropriate alt text
2. Reduced-motion preference respected
3. No new accessibility concerns introduced

## Likely files affected

- `src/content/projects.ts` — line 82: change `coverSrc` value
- `src/components/ui/DeviceMockup.tsx` — lines 96-108 (front/back phone classes) and lines 154-180 (dual-phone layout container)

## Acceptance criteria

- [ ] `coverSrc` for Letters App points to `letters-app-homepage-post-1.webp`
- [ ] Front phone image renders correctly inside phone bezel (no cropped collage)
- [ ] Back phone is clearly visible, not mostly hidden behind front phone
- [ ] Both phones are distinguishable as separate devices
- [ ] Composition feels editorial and intentional, not accidental
- [ ] Staggered entrance animation preserved
- [ ] Float animation preserved on both phones
- [ ] Reduced-motion: both phones static, no float
- [ ] Mobile: only front phone shown
- [ ] `npx vitest run` passes
- [ ] `npx next build` passes

## Required tests

- `npx vitest run` — existing test suite must pass
- `npx next build` — production build must succeed
- Visual verification at desktop width (1280px+): both phones clearly visible
- Visual verification at mobile width (<768px): only front phone shown
- Reduced-motion check: no float animation

## Required output

Return:

1. Implementation summary
2. Files changed
3. Important technical decisions (e.g., exact positioning values chosen and why)
4. Deviations or assumptions
5. Tests performed
6. Screenshots or preview instructions
7. Known limitations
8. Follow-up recommendations
