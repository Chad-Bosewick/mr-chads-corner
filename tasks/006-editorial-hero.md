# CODEX IMPLEMENTATION TASK

## Task ID

T-006

## Title

Editorial hero with large-scale imagery (WOW factor)

## Objective

Transform the homepage hero from a text-led heading into an editorial, visually confident hero section with large-scale background imagery, bold typography treatment, and a magazine-grade date/context element — inspired by the editorial quality of Daily Dispatch and the full-width confidence of Egregore.

## Product context

The current hero reads "Hello! I'm Temi Adekunle — product designer who thinks in systems..." in a plain centered heading. For a premium portfolio, the hero should feel like a spread in a design annual: visually arresting, confident, and memorable. This is the first thing visitors see — it needs to communicate quality immediately.

## User story

As a visitor landing on the portfolio, I want to immediately feel I'm on a premium, authored experience — not a template — so I trust the quality of the work before I even scroll.

## Scope

- Redesign `src/app/page.tsx` hero section (first ~80 lines, keeping existing content below)
- Modify or replace the `HeroHeading` component usage on the homepage only
- Add a large-scale background image or treatment (use existing paper-texture.webp or a new hero image)
- Bold, editorial display typography for "Hello!" or the tagline
- Add a subtle date or context element (like Daily Dispatch's "17 JUL '26" date treatment) to anchor the editorial feel
- Must retain the same below-hero content (intro paragraphs, case studies, testimonial, CTA)

## Out of scope

- Changing other pages' hero sections (about, contact use different headers)
- Adding motion/parallax (that's Task T-008)
- Changing the navigation

## Design sources

### References
- **Daily Dispatch** (`dailydispatch.app`): Large date treatment broken across lines, magazine-grade temporal anchoring, confident full-width layout
- **Egregore** (`egregore.xyz`): Full-width hero image, bold typography over background, confident visual hierarchy

### Current implementation
```tsx
<SectionReveal>
  <HeroHeading
    title="Hello!"
    subtitle="I'm Temi Adekunle — product designer who thinks in systems and delivers polished, intentional digital experiences."
  />
</SectionReveal>
```

## Technical context

- Page uses `mx-auto max-w-[1038px]` container — hero can visually break out of this
- Paper texture background: `public/paper-texture.webp` (currently used as body background)
- `HeroHeading` component lives at `src/components/sections/HeroHeading.tsx`
- Font stack: Plus Jakarta Sans (body) + Lora Italic (accent, via next/font/google)
- Colors: text-primary #151515, accent #A43718, text-muted #757575

## Approach

### Hero layout (editorial two-column or full-width)
- Use a full-width hero section that sits above the `max-w-[1038px]` content container
- Left or top: editorial display text (large, confident)
- Right or background: a treatment of the paper texture or a new hero visual
- Add a date/context element in the style of Daily Dispatch: large, editorial, set as a design detail

### Typography treatment
- Main greeting: very large (`clamp(3rem, 8vw, 5rem)`), light or medium weight, confident
- Subtitle: editorial size, narrower measure (max-width ~50ch), accent color or muted
- Small date/context element above or beside the title: something like "PORTFOLIO '26" or a subtle editorial label

### Visual hierarchy
```
┌─────────────────────────────────────────┐
│  PORTFOLIO '26          [paper texture]  │
│                                         │
│  Temi Adekunle                           │
│  Product designer who                    │
│  thinks in systems                       │
│                                         │
│  ↓ scroll                                │
└─────────────────────────────────────────┘
```

(Not literal — explore the composition. The key is editorial confidence and visual scale.)

## Visual requirements

1. Hero must feel visually distinct from the content below it — like a magazine cover
2. Background should use the existing paper texture or an enhanced version of it
3. Display text should be the primary visual element
4. A small editorial date/meta element adds credibility and design personality

## Responsive requirements

1. Mobile: text scales down but still feels intentional (not just smaller — composed differently if needed)
2. Tablet: transitional layout
3. Desktop: full editorial spread feel
4. No horizontal overflow at any breakpoint

## Functional requirements

1. Hero content must remain semantic HTML (proper h1, landmark)
2. All existing content below the hero remains unchanged
3. `SectionReveal` must still apply on scroll for sections below

## Accessibility requirements

1. Heading hierarchy: still a single `<h1>` with the primary name/role
2. Background images: decorative only, `aria-hidden` or `role="presentation"`
3. Sufficient color contrast on all text over background
4. Date/editorial elements: use semantic `<time>` or `<small>` as appropriate

## Acceptance criteria

- [ ] Hero feels editorially confident and premium (subjective — but should evoke "wow" when compared to current)
- [ ] Large-scale display typography with at least one element at `clamp(3rem, 8vw, 5rem)` or larger
- [ ] Editorial date/context element present (small, designed, intentional)
- [ ] Background uses existing paper texture or visual treatment
- [ ] Semantic `<h1>` preserved
- [ ] No horizontal overflow at 390/768/1024/1440px
- [ ] All content below hero is unchanged
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/HeroHeading.tsx` (or replace usage)
- Possibly create: `src/components/sections/EditorialHero.tsx`

## Required output

Return:

1. implementation summary with design rationale
2. files changed
3. screenshots at mobile and desktop
4. confirmation build, lint, typecheck pass
