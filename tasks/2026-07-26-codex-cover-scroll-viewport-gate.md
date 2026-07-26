# CODEX IMPLEMENTATION TASK

## Task ID

UI-001

## Title

Fix CoverScroll animation starting before the card enters the viewport

## Objective

Make the CoverScroll auto-scroll animation on the homepage only begin after the project card is visible to the user, and make the initial transition smoother so the landing page screenshot registers before scrolling begins.

## Product context

On the homepage, the Travecs case study card uses a CoverScroll component that auto-scrolls through the landing page screenshot. The animation starts on page mount — before the user scrolls down to the "Selected Work" section. By the time the user sees the card, the animation has already scrolled past the hero/landing page view. This defeats the purpose of showcasing the landing page.

## User story

As a portfolio visitor, I need the project preview animation to start when I can actually see it, so that I experience the full landing page showcase from the beginning instead of catching it mid-scroll.

## Scope

- Add viewport detection to CoverScroll so auto-scroll only begins when the component is visible
- Reduce the initial delay so the screenshot is visible before scrolling starts
- Keep the existing animation behaviour (liquid easing, section pauses, loop) unchanged
- No changes to the ProjectRow component or homepage layout

## Out of scope

- Changing the animation timing curves or scroll speeds
- Modifying which sections are shown or their order
- Adding pause/play controls (that's a sprint 2 accessibility task)
- Changing the CoverScroll for non-autoScroll (manual) mode

## Technical context

- Component: `src/components/case-study/CoverScroll.tsx`
- Used by: `src/components/sections/ProjectRow.tsx` (line 51 passes `autoScroll`)
- Homepage: `src/app/page.tsx` renders ProjectRow for each published project
- The auto-scroll useEffect (lines 103-202) runs on mount regardless of viewport visibility
- `INITIAL_DELAY = 4000` (line 26) counts from mount, not from visibility
- The component already has a `frameRef` on the outer container that can be used for IntersectionObserver

## Functional requirements

1. The auto-scroll animation loop must NOT start until the CoverScroll element has entered the viewport (use IntersectionObserver on `frameRef` or a wrapper ref)
2. Once started, the animation continues even if the element scrolls out of view (don't restart on re-entry)
3. The initial delay before the first scroll should be reduced — the user should see the landing page hero for about 1-2 seconds before it starts scrolling, not 4 seconds
4. If the user scrolls down and the card is already past when the page loads, the animation should start from the beginning (hero view) when it first becomes visible
5. The existing animation behaviour after the initial start must remain unchanged: liquid easing, section-to-section pauses, loop back to top

## Visual requirements

1. The Travecs landing page hero should be fully visible for a brief moment before any scrolling begins
2. The transition from hero to the next section should feel smooth and intentional
3. No visual glitch or jump when the animation starts

## Interaction requirements

1. The animation should not interfere with the SectionReveal fade-up that wraps the ProjectRow
2. The SectionReveal entrance and the CoverScroll animation should feel coordinated — reveal first, then animate

## Responsive requirements

1. Viewport gating must work on all screen sizes
2. On mobile, the card may already be partially visible on page load — the animation should still wait for full visibility

## Accessibility requirements

1. Respect `prefers-reduced-motion` — if the user has reduced motion enabled, the auto-scroll should not run (this is already partially handled but verify)
2. The animation must not cause layout shift

## Likely files affected

- `src/components/case-study/CoverScroll.tsx` — add IntersectionObserver, gate animation start, reduce initial delay

## Acceptance criteria

- [ ] CoverScroll animation does NOT start until the element is in the viewport
- [ ] Once started, the animation continues without restarting on scroll
- [ ] Initial delay reduced to ~1-2 seconds (from current 4 seconds)
- [ ] Landing page hero is visible before scrolling begins
- [ ] Existing animation timing, easing, and loop behaviour unchanged
- [ ] `npx vitest run` passes
- [ ] `npx next build` passes
- [ ] Reduced motion preference is respected
- [ ] No visual jump or glitch when animation starts

## Verification steps

1. `npx next build` — must pass
2. `npx vitest run` — must pass
3. Open the homepage in a browser
4. Scroll down to the "Selected Work" section
5. Verify the Travecs landing page hero is visible for ~1-2 seconds before scrolling begins
6. Verify the scroll animation transitions smoothly between sections
7. Verify the animation loops back to the top after reaching the end
8. Enable `prefers-reduced-motion` in browser dev tools and verify the animation does not auto-scroll

## Report requirement

When complete, write your report to `docs/qa/2026-07-26-codex-ui-001-report.md` using the same format as `docs/qa/2026-07-26-codex-phase-d-report.md`. Include:
- What was changed and why
- Before/after of animation timing
- Build and test results
- Acceptance criteria checklist
- Any deviations or issues encountered
