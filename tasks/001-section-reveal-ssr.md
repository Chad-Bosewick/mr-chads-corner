# CODEX IMPLEMENTATION TASK

## Task ID

T-001

## Title

Fix SectionReveal — SSR hidden content (QA Critical)

## Objective

Make `SectionReveal` render content visible in server HTML and apply motion only as progressive enhancement when JavaScript loads.

## Product context

The current `SectionReveal` renders with `opacity-0 translate-x-[8px]` in the server HTML. If JavaScript is disabled, blocked, or slow to hydrate, core page content becomes invisible — an accessibility and SEO blocker.

## User story

As a visitor with JavaScript disabled or a search engine crawler, I need core content to be visible immediately without depending on client-side JavaScript.

## Scope

- Fix `src/components/sections/SectionReveal.tsx` so SSR HTML renders content fully visible
- Motion/transition styles should only activate after hydration confirms JS is available
- All existing `SectionReveal` usages across the site should benefit from the fix

## Out of scope

- Changing the animation style or timing
- Modifying any other component

## Design source

- QA finding: QA-2026-07-18-001, Critical finding #1
- CURRENT BEHAVIOUR: SSR renders `translate-x-[8px] opacity-0` — invisible without JS

## Technical context

- Current component is a `"use client"` component using `useScrollReveal` hook with IntersectionObserver
- Uses `cn()` from `@/lib/utils` for conditional classes
- Current classes: `transition-all duration-[var(--duration-reveal)] ease-[var(--ease-out)]`
- Conditional: `isVisible ? "translate-x-0 opacity-100" : "translate-x-[8px] opacity-0"`

## Approach

Two options — pick the one that best balances DX and reliability:

**Option A: CSS-driven** — Add a `@keyframes` or use a class that `.SectionReveal` only adds after mount. The SSR output has no animation classes; a `useEffect` adds the reveal-trigger class on mount, then IntersectionObserver removes the hidden state.

**Option B: SSR-safe defaults** — Render with full opacity and no transform. Use a `useEffect` to set a `data-reveal` attribute, then let IntersectionObserver control the animation. This guarantees SSR content is always visible.

Key constraint: the solution must work with the existing `useScrollReveal` hook (`src/hooks/useScrollReveal.tsx`) or require only minimal changes to it.

## Functional requirements

1. Server-rendered HTML must NOT contain `opacity-0` or translate transforms on `.SectionReveal` elements
2. Motion (slide + fade) must still trigger on scroll as before when JavaScript is available
3. The reveal timing/delay system (`delay` prop) must continue to work
4. Must work with Transitional/static export (no server-side JS)

## Interaction requirements

1. No visual change for users with JavaScript enabled — animations should play identically
2. No flash-of-hidden-content on initial page load

## Accessibility requirements

1. Content must be readable with JavaScript disabled
2. Motion must still respect reduced-motion preferences (handled by existing `useScrollReveal`)

## Acceptance criteria

- [ ] With JavaScript disabled, all SectionReveal-wrapped content is fully visible (opacity 100%, no transform)
- [ ] With JavaScript enabled, scroll-triggered reveal animations play identically to current behaviour
- [ ] Delay-based staggering (80/160/240ms patterns on pages) still works
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/components/sections/SectionReveal.tsx`
- Possibly modify: `src/hooks/useScrollReveal.ts`

## Required output

Return:

1. implementation summary
2. files changed
3. important technical decisions
4. tests performed
5. confirmation the build, typecheck, lint, and tests pass
