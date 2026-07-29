# Codex Task — NAV-001: Navigation Enhancement

## Task ID

NAV-001

## Objective

Address navigation gaps found in the site audit — make the global nav persistent, add footer navigation, fix nested route active states, and resolve minor defects — so the site meets portfolio-expected navigation patterns.

## Scope

- Make global nav sticky on scroll (desktop + mobile)
- Add main navigation links to the footer (alongside existing social links)
- Fix active-state detection for nested routes (case study detail pages)
- Optionally add a "Temi Adekunle" brand anchor to the nav bar (home link)
- Fix JSX attribute case bug in `NavMobile.tsx`

## Out of scope

- Adding new pages, routes, or nav items
- Redesigning the nav visual style — preserve existing appearance, hover states, active indicators, and spacing
- Adding new dependencies
- Changing `CaseStudyNav` or `ProjectNav` behaviour

## Input files to read first

1. `src/components/layout/Nav.tsx` — global nav component (desktop + mobile trigger)
2. `src/components/layout/NavMobile.tsx` — mobile overlay
3. `src/components/layout/Footer.tsx` — footer with social links only
4. `src/app/layout.tsx` — root layout rendering Nav, main, Footer

---

## Part 1: Sticky global nav

Currently `Nav.tsx` uses `relative z-10 pt-10` — the nav scrolls away. Change it to:

- `sticky top-0 z-30` (or whatever z-index keeps it above page content without conflicting with `CaseStudyNav`'s `z-30`)
- Add a backdrop (`bg-[#f5f2ee]/80 backdrop-blur-md` or similar semi-transparent background) so content can be read through it
- Add a subtle bottom border (`border-b border-[#151515]/10`) on scroll to indicate stickiness — use a scroll listener or `IntersectionObserver` to toggle a class
- Preserve `pt-10` padding — the sticky header should have the same vertical spacing as the current static nav
- On mobile, the hamburger should remain in the sticky bar

**Sticky trigger detection:** Use an `IntersectionObserver` on a sentinel element (e.g., an invisible div at the top of the page) rather than a scroll listener. When the sentinel is not intersecting (i.e., the user has scrolled past it), add a CSS class that applies the bottom border.

## Part 2: Footer navigation

Currently `Footer.tsx` only renders two social links (LinkedIn, Dribbble). Add the four main site links after the social links section:

- Home
- Featured case studies
- About Temi
- Contact

Style them consistently with the existing social links (same font size, colour, hover state). Group them under a subheading like "Pages" or "Site" with the same uppercase label pattern used elsewhere.

The existing content (quote, attribution, social links, copyright) stays unchanged.

## Part 3: Nested route active state

Currently active-state detection uses `pathname === item.href` in `Nav.tsx:63`. This means `/featured-case-studies/credlane` does NOT mark "Featured case studies" as active.

Change to a `startsWith` comparison with a guard for the root path:

```
const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
```

This ensures:
- "/" is only active when exactly on the homepage
- "/featured-case-studies" is active for any `/featured-case-studies/*` subpath
- "/about-temi" is active (no subpaths, but the guard is consistent)
- "/contact" same

## Part 4: Brand/home anchor

Add a "Temi Adekunle" text link at the left side of the nav bar. This serves as both branding and a Home shortcut — a standard portfolio pattern.

- Position: left-aligned in the nav (desktop), before the hamburger (mobile)
- Text: "Temi Adekunle"
- Link: `/`
- Style: font-sans, font-medium, predictable size, colour `#151515` with hover `#A43718`
- The `ContentRail` currently uses `justify-end` on the desktop `ul` — you'll need to restructure the nav so the brand sits on the left and the nav items on the right (flexbox `justify-between` on the container, or split into two groups)

Do NOT replace the nav items — the brand is additive.

## Part 5: Fix JSX attribute case

In `NavMobile.tsx:91`, the SVG `stroke-width` attribute uses HTML casing. React requires camelCase:

```
stroke-width="1.5" → strokeWidth="1.5"
```

Also check `NavMobile.tsx:92` for the same issue on the `stroke` attribute (it's already `stroke`, which is the same in both HTML and JSX, so no change needed).

## Design notes

- The sticky nav must NOT add visual weight — it should feel like a subtle utility that's there when needed
- The bottom-border-on-scroll approach is preferred over adding a full background/shadow: lighter, less visually heavy
- On mobile, the sticky nav bar with hamburger should be no taller than the current static nav
- All existing animations (underline hover, colour transitions) must be preserved
- The sticky nav should not interfere with the CaseStudyNav mobile bar (`z-30` — make sure the global sticky nav uses `z-40`, or if both are `z-30`, confirm which one stacks on top via DOM order)

## Acceptance criteria

| # | Check | Expected |
|---|---|---|
| 1 | Scroll down any page | Nav stays visible at top, with subtle border appearing after first scroll |
| 2 | Case study detail page | Nav is sticky, "Featured case studies" link shows active state |
| 3 | Mobile sticky nav | Hamburger visible in sticky bar, menu opens/closes correctly |
| 4 | Footer nav links | All 4 nav links appear in footer, functional, hover styles match social links |
| 5 | Brand anchor | "Temi Adekunle" link visible left of nav, navigates to `/` |
| 6 | JSX warning | No React DOM warnings for `stroke-width` |
| 7 | Build | `npx tsc --noEmit` passes, `npm run lint` passes |

## Validation

1. `npm run dev` and verify in browser at desktop (1440px) and mobile (375px)
2. Scroll behaviour: home page, about page, and a case study detail page
3. Check mobile nav opens/closes from sticky bar
4. `npx tsc --noEmit`
5. `npm run lint`
6. `npx next build`

## Files likely affected

| File | Change |
|---|---|
| `src/components/layout/Nav.tsx` | Add sticky positioning, scroll-sentinel, brand anchor, restructure layout, nested route detection |
| `src/components/layout/NavMobile.tsx` | Fix `stroke-width` → `strokeWidth` |
| `src/components/layout/Footer.tsx` | Add main nav links alongside social links |

## Required output

Return a completion report following the Codex Task Output format (AGENTS.md Section 8.2):

1. **Implementation summary** — what was changed and how
2. **Files changed** — list with key line references
3. **Decisions made** — any design/tradeoff choices
4. **Deviations from task** — if any, why
5. **Testing performed** — desktop/mobile/responsive/reduced-motion checks
6. **Validation evidence** — build/type/lint results
7. **Known limitations** — anything not addressed
8. **Preview instructions** — what to verify in the dev server
