# CODEX IMPLEMENTATION TASK

## Task ID

UI-002

## Title

Standardise device bezels and add dual-phone editorial layout for Letters App

## Objective

Make all device bezels on the homepage "Selected Work" section visually consistent at 1.5px stroke thickness, and replace the single-phone Letters App card with a dual-phone editorial composition with a staggered entrance animation.

## Product context

The homepage project cards use two different bezel implementations — CoverScroll (Travecs) has a refined 1.5px stroke, while DeviceMockup (TODO++, Draftly, Letters App) has a heavier 3px stroke. This inconsistency is visible on desktop and breaks the premium detailing standard. The Letters App phone card also wastes horizontal space — the 220px phone sits alone in a 790px column on desktop.

## User story

As a portfolio visitor, I need every project card to feel like part of a cohesive, polished editorial layout — with consistent device framing and intentional visual composition — so that the site communicates professional design craft.

## Scope

### Part 1: Bezel standardisation

- Update `DeviceMockup` laptop bezel to match CoverScroll's thinner styling
- Update `DeviceMockup` phone bezel to match the same refined stroke weight
- Reconcile hover shadow differences between the two components

### Part 2: Letters App dual-phone layout

- Add a new `dualPhone` variant to `DeviceMockup` (or a new component) that renders two phone bezels in an editorial composition
- Front phone: slightly left, slightly higher — shows primary screen
- Back phone: slightly right, slightly lower, partially behind front — shows secondary screen
- Staggered entrance animation when the card enters the viewport
- Subtle continuous float/parallax to keep the composition alive
- Both phones use the same thin 1.5px bezel

### Part 3: Content model update

- Extend the project data model to support `dualPhone` device type with two image sources
- Update `ProjectRow` to handle the new device variant

## Out of scope

- Animations for TODO++ and Draftly cards — those depend on Figma export decisions (follow-up task)
- Changes to CoverScroll component (Travecs reference remains as-is)
- Changes to case study pages — only the homepage project cards are affected
- Testground card (coming-soon, placeholder state unchanged)

## Technical context

- `src/components/ui/DeviceMockup.tsx` — current device frame component
- `src/components/sections/ProjectRow.tsx` — renders each project card
- `src/content/projects.ts` — project data model
- CoverScroll laptop bezel (reference): `p-[1.5px] rounded-[6px]` outer, `rounded-[4px]` inner
- DeviceMockup laptop bezel (current): `p-[3px] rounded-[8px]` outer, `rounded-[5px]` inner

## Design reference

### Bezel standardisation — target properties

| Property | Current (DeviceMockup) | Target (match CoverScroll) |
|---|---|---|
| Laptop outer padding | `p-[3px]` | `p-[1.5px]` |
| Laptop outer radius | `rounded-[8px]` | `rounded-[6px]` |
| Laptop inner radius | `rounded-[5px]` | `rounded-[4px]` |
| Laptop shadow | `shadow-[0_8px_30px_rgba(21,21,21,0.12)]` | Same — no change needed |
| Laptop hover shadow | `shadow-[0_12px_40px_rgba(21,21,21,0.12)]` | `shadow-[0_12px_38px_rgba(21,21,21,0.18)]` (match CoverScroll) |
| Phone outer padding | `p-[3px]` | `p-[1.5px]` |
| Phone body radius | `rounded-[24px]` | `rounded-[22px]` (scale proportionally with thinner stroke) |
| Phone screen radius | `rounded-[21px]` | `rounded-[20px]` |
| Phone notch | `h-[18px] w-[80px]` | Same — no change needed |

### Letters App dual-phone composition

```
Desktop layout (md+):

  ┌──────────────────────────────────┐
  │                                  │
  │    ┌─────────┐                   │
  │    │ Phone 1  │   ┌─────────┐   │
  │    │ (front)  │   │ Phone 2  │   │
  │    │          │   │ (back)   │   │
  │    │          │   │          │   │
  │    └─────────┘   └─────────┘   │
  │                                  │
  └──────────────────────────────────┘

  - Phone 1: z-10, positioned left-center
  - Phone 2: z-0, positioned right-center, offset ~24px right and ~16px down
  - Both phones: max-w-[200px] (slightly smaller than single phone to fit both)
  - Overlap creates depth — back phone peeks out from behind front
```

### Letters App entrance animation

1. Card enters viewport (IntersectionObserver or SectionReveal)
2. Front phone fades in + slides up from below (0ms delay)
3. Back phone fades in + slides up from below (150ms delay)
4. Both settle into a subtle floating animation (very gentle, 2-3px vertical oscillation over ~6s)
5. Hover: both phones shift up 2px together (existing group-hover behaviour)

### Mobile layout

On mobile (`< md`), show only the front phone at full size (single phone, centered). The second phone is hidden to avoid cramped display on small screens.

## Content model change

Current `projects.ts` interface:

```ts
device: "laptop" | "phone";
```

New interface:

```ts
device: "laptop" | "phone" | "dual-phone";
coverSrc?: string;
coverSrcSecondary?: string; // second phone image (only for dual-phone)
```

For Letters App, update the entry:

```ts
{
  slug: "letters-app",
  title: "Letters App",
  category: "Communication",
  hook: "Thoughtful correspondence for the modern world.",
  coverSrc: "/images/case-studies/letters-app-cover.webp",        // front phone
  coverSrcSecondary: "/images/case-studies/letters-app-showcase.webp", // back phone
  status: "published",
  device: "dual-phone",
}
```

**Note:** The secondary image path above is a placeholder. The actual images will be provided by the Owner after Figma export. The task should use the existing images as stand-ins and note which images need replacing.

## Functional requirements

1. All laptop bezels (DeviceMockup) use `p-[1.5px] rounded-[6px]` outer / `rounded-[4px]` inner — matching CoverScroll
2. All phone bezels use `p-[1.5px]` stroke with proportionally adjusted radii
3. Hover shadows are consistent across all device types
4. Letters App renders two phones in the editorial composition described above
5. Front phone animates in first, back phone follows with 150ms delay
6. Both phones have a subtle continuous float animation
7. On mobile, only the front phone is shown
8. The `device: "dual-phone"` type works in ProjectRow without breaking other card types

## Visual requirements

1. Bezel thickness must be indistinguishable between CoverScroll and DeviceMockup on screen
2. The dual-phone composition must feel editorial — not like two random phones placed side by side
3. The overlap must create genuine depth (back phone partially behind front)
4. Float animation must be subtle — no distracting bouncing

## Interaction requirements

1. Hover on the card lifts both phones together (existing group-hover -translate-y-[2px])
2. The float animation pauses on hover (optional — implement if clean to do)
3. Reduced motion: disable float animation, show both phones statically

## Responsive requirements

1. Desktop (md+): dual-phone composition as described
2. Mobile (< md): single phone (front only), centered, standard phone mockup size

## Accessibility requirements

1. Reduced motion preference disables float animation
2. Both phones have appropriate alt text
3. The component is not focusable (it's inside a Link)

## Likely files affected

- `src/components/ui/DeviceMockup.tsx` — bezel standardisation + new dual-phone variant
- `src/components/sections/ProjectRow.tsx` — handle `dual-phone` device type
- `src/content/projects.ts` — update Letters App entry with `device: "dual-phone"` and secondary image

## Acceptance criteria

- [ ] DeviceMockup laptop bezel matches CoverScroll: `p-[1.5px] rounded-[6px]` outer
- [ ] DeviceMockup phone bezel uses `p-[1.5px]` with adjusted radii
- [ ] Hover shadows are consistent across CoverScroll and DeviceMockup
- [ ] Letters App card shows two phones in editorial composition on desktop
- [ ] Front phone animates in first, back phone follows with delay
- [ ] Subtle float animation on both phones
- [ ] On mobile, only front phone shown
- [ ] `device: "dual-phone"` type works without breaking other cards
- [ ] `npx vitest run` passes
- [ ] `npx next build` passes

## Verification steps

1. `npx next build` — must pass
2. `npx vitest run` — must pass
3. Open homepage in browser
4. Compare Travecs laptop bezel with TODO++ laptop bezel — they should look identical in stroke weight
5. Scroll to Letters App — verify two phones appear with staggered animation
6. Verify the back phone is partially behind the front phone (depth effect)
7. Verify float animation is subtle and smooth
8. Resize to mobile — verify only one phone shows
9. Enable `prefers-reduced-motion` — verify float animation is disabled

## Figma export requirements

> **These exports are needed from the Owner before the dual-phone images can be finalised.**

### Letters App — 2 screens needed

| Slot | Purpose | Suggested Figma frame | Export specs |
|---|---|---|---|
| Front phone (primary) | Hero/landing screen — first impression | Main app screen showing the core value prop | 430×932px (iPhone 14 Pro), WebP, 2× for retina |
| Back phone (secondary) | Supporting screen — shows depth of product | Different flow or feature (e.g., inbox, compose, reading view) | 430×932px, WebP, 2× |

### TODO++ — pending decision

The Owner will determine whether to use CoverScroll (long screenshot) or DeviceMockup (static) after reviewing available Figma frames. Export spec TBD.

### Draftly — pending decision

Same as TODO++. Export spec TBD.

## Report requirement

When complete, write your report to `docs/qa/2026-07-26-codex-ui-002-report.md`. Include:
- Bezel property comparison before/after
- Dual-phone implementation details
- Build and test results
- Acceptance criteria checklist
- Note which images are placeholders awaiting Figma exports
