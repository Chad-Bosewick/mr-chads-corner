# Codex UI Work Log and Claude Code Handoff

Date: 2026-07-26 (updated)
Repository: `portfolio-website`
Branch: `foundations`
Starting commit: `d948390`
Status: implementation complete, automated verification passing, visual browser QA still required

## Purpose

Use this document as the working-context prompt for the portfolio team. It records exactly what was changed, why those decisions were made, what has been verified, and what still needs review.

Do not reimplement these features from scratch or revert them to the previous versions without first reviewing the current diff and the decisions below. The worktree contains other pre-existing changes, so preserve unrelated owner and agent work.

## Team Roles

| Person or agent | Role | Responsibility in this handoff |
| --- | --- | --- |
| Temi | Owner | Product direction, final visual approval, and priority decisions |
| Claude Code | Technical Product Manager | Validate scope, coordinate technical follow-through, identify conflicts, and manage delivery readiness |
| Codex | Senior UI Design Engineer | Design QA, interaction design, frontend implementation, accessibility, and UI verification |
| ChatGPT | Technical Associate | Supporting investigation, documentation, research, and implementation follow-up |

## Status at a Glance

Three connected workstreams have been implemented:

1. The Travecs `CoverScroll` preview operates in two modes: manual scroll (case study page) and auto-scroll (homepage card).
2. The case-study sidebar has been design-QA'd and revised for hierarchy, responsive behavior, accessibility, navigation semantics, and interaction stability. Alignment fixes were applied for pixel-perfect indicator-to-text alignment.
3. The `CarouselImage` component now supports auto-advance with IntersectionObserver-triggered playback and hover pause.

Automated status:

- TypeScript passes with `npx tsc --noEmit`.
- Full Vitest suite passes: 30 tests across 7 test files.
- Production build passes.
- Changes are not committed.

## Workstream 1: CoverScroll

### Design Direction

The CoverScroll has two independent modes:

- **Manual mode** (case study page): The user scrolls through the landing page screenshot using trackpad/mouse wheel. The frame clips at 16:10 with a 3px thin scrollbar. No auto-scroll, no animation.
- **Auto-scroll mode** (homepage card): Smoothly scrolls through 6 defined sections with 3-second pauses, then loops back to the hero. Starts after a 4-second initial delay. Pauses on hover. Uses liquid easing for harmonic motion.

### Implemented Behavior — Manual Mode

| Area | Implementation |
| --- | --- |
| Frame | 680×425px (aspect-ratio 16/10), overflow-y: auto |
| Scrollbar | 3px wide (webkit + Firefox), semi-transparent, expands to 4px on hover |
| Image | Fits frame width, full natural height, user scrolls vertically |
| Hover zoom | None — manual mode is purely scroll-based |
| Label | "scroll to explore" in aria-label |

### Implemented Behavior — Auto-Scroll Mode

| Area | Implementation |
| --- | --- |
| Initial delay | 4 seconds before first scroll |
| Scroll duration | 1200ms per section transition |
| Pause duration | 3 seconds at each section |
| Easing | Liquid cubic bezier (4t³ / 1-(-2t+2)³/2) |
| Sections | 6: hero → talent → employer → FAQ → CTA → footer |
| Loop | Instant reset to hero after footer, restarts |
| Hover | Pauses auto-scroll, resumes on leave |
| Reduced motion | Static — no animation |
| Scrollbar | None — frame is overflow: hidden |

### CoverScroll Section Labels (Auto-Scroll)

The full landing-page screenshot is mapped to six normalized vertical regions:

1. Meet Travecs (start: 0)
2. Talent experience (start: 0.31)
3. Employer experience (start: 0.49)
4. Frequently asked questions (start: 0.78)
5. Find talent, get hired (start: 0.9)
6. Footer (start: 0.97)

Note: "What our users say" (social proof) and "Verified talent" were removed from the original 7-section list per owner direction.

### CoverScroll Files

- `src/components/case-study/CoverScroll.tsx` (279 lines — rewritten twice)
- `src/components/case-study/CoverScroll.test.tsx` (11 tests)
- `src/components/case-study/CaseStudyLayout.tsx` (uses manual mode)
- `src/components/sections/ProjectRow.tsx` (passes `autoScroll` for homepage)
- `src/content/case-studies.ts` (section labels updated)
- `src/content/projects.ts` (coverScroll data)

## Workstream 2: Case-Study Sidebar Design QA

### Reference Material Reviewed

- `public/images/references/caplane-nav-desktop.png`
- `public/images/references/caplane-nav-progress.png`
- `public/images/references/our-current-nav.png`
- `nav-inspection-prompt.md`

The Caplane reference was treated as a hierarchy and navigation reference, not something to copy literally. The revised component retains the portfolio's typography, paper background, and accent color.

### Problems Found in the Original Sidebar

1. The active state was a tall orange rail rather than the reference's quiet dash marker.
2. Indicator movement depended on `activeIndex * 28`, which would break if row height, font size, wrapping, or spacing changed.
3. Active text changed from regular to semibold, causing visible weight and width movement.
4. Links used `transition-all`, unnecessarily animating every property.
5. Desktop chapter targets were smaller than the recommended 40px minimum.
6. The back control had a small hit area and used `window.history.back()`, which could lead outside the portfolio or do nothing.
7. JavaScript cancelled native anchor navigation, removing shareable hashes and weakening browser history.
8. Section IDs were placed inside the text body, below their headings, so anchor navigation skipped the heading.
9. At `lg`, the desktop sidebar competed with the reading column and full-width media.
10. Below the desktop breakpoint, the complete vertical sidebar appeared above the article and created a long interruption.
11. Inactive `#757575` text measured approximately 4.13:1 against `#f5f2ee`, below the 4.5:1 requirement for 13–14px interface text.
12. A horizontally scrolling mobile chapter list had no guarantee that the active chapter would stay visible.

### Implemented Sidebar Changes

| Before | Current implementation |
| --- | --- |
| Moving 2px vertical rail | A stable 10px × 1px dash is rendered per row; the active dash uses `#A43718` |
| Hard-coded 28px indicator step | No positional calculation; markers live within their own rows |
| Active font-weight change | All chapter labels use `text-sm font-medium`; hierarchy changes through color |
| Inactive `#757575` | Inactive sidebar text uses `#6F6F6F`, approximately 4.50:1 on the paper background |
| `transition-all` over 400ms | Property-specific 150–300ms color, scale, and underline transitions |
| Small desktop targets | Every desktop chapter target is at least 40px high |
| Full vertical mobile list | Compact 44px horizontal chapter navigator |
| Sidebar at `lg` | Sidebar starts at `xl`; smaller and intermediate widths use the horizontal navigator |
| Mobile active item could leave view | Active mobile chapter automatically scrolls into view |
| `window.history.back()` | Deterministic link to `/featured-case-studies` labeled "All case studies" on desktop |
| Cancelled anchor clicks | Native `href="#section-id"` navigation with shareable hashes |
| IDs below headings | IDs moved to semantic section containers, with `scroll-mt-16` |
| Entry-order scroll spy | Chooses the intersecting section closest to the reading line |

### Alignment Fixes (Applied After Sidebar QA)

| Issue | Fix |
| --- | --- |
| Indicator left edge didn't align with chevron tip | Back button `pl-4`, indicator `left-4`, SVG `viewBox="2 2 10 10"` crops dead space |
| Indicator not vertically centered on text | Indicator `top-[5px]` (was `top-0`) |

### Current Responsive Model

Desktop, `xl` and above:

- Sticky vertical chapter sidebar at `top-24`.
- Explicit "All case studies" return link.
- 40px minimum row height.
- Accent dash communicates the current section.
- No font-weight shift when the active section changes.

Below `xl`:

- Sticky horizontal chapter navigation at the top of the case-study article.
- 44px back target and 44px chapter targets.
- Active chapter uses a 2px accent underline.
- Later active chapters are automatically brought into view.
- Scrollbar is visually hidden while native horizontal scrolling remains available.

### Sidebar Files

- `src/components/case-study/CaseStudyNav.tsx` (192 lines)
- `src/components/case-study/CaseStudyNav.test.tsx` (4 tests)
- `src/components/case-study/ContentSection.tsx`
- `src/components/case-study/CaseStudyLayout.tsx`

## Workstream 3: Carousel Auto-Advance

### Implemented Behavior

| Area | Implementation |
| --- | --- |
| Auto-advance | 4000ms interval, triggered by IntersectionObserver (in-view) |
| Hover pause | Pauses when mouse enters the frame, resumes on leave |
| Manual controls | Arrow buttons, dot indicators, keyboard (← →) |
| Frame | 680×425px (aspect-ratio 16/10), same as CoverScroll |
| Image modes | scroll:true = vertical scroll within frame; scroll:false/undefined = object-contain |
| Reduced motion | No auto-advance, native transitions disabled |

### Image Export

A ChatGPT export prompt has been created at `CAROUSEL_IMAGE_EXPORT_PROMPT.md` for re-exporting all 16 carousel images (4 per carousel × 4 carousels) at exactly 1360×850 (2× retina) from the Figma "For chatgpt" section.

### Carousel Files

- `src/components/case-study/CarouselImage.tsx` (304 lines)
- `src/components/case-study/CarouselImage.test.tsx` (5 tests)
- `src/components/case-study/CarouselSection.tsx` (passes `autoAdvanceMs`)
- `CAROUSEL_IMAGE_EXPORT_PROMPT.md` (ChatGPT handoff)

## Infrastructure Fix

### Dev Server 500 on Unknown Slugs

`next.config.ts` had `output: "export"` always active, including in dev mode. With `dynamicParams = false` on the `[slug]` route, the dev server threw a 500 instead of a 404 for unknown slugs (e.g., `/featured-case-studies/testground/`).

**Fix:** Made `output: "export"` conditional — only applied in production builds.

**File:** `next.config.ts`

## Current Worktree Status

```text
 M next.config.ts
 M src/components/case-study/CaseStudyLayout.tsx
 M src/components/case-study/CaseStudyNav.tsx
 M src/components/case-study/CaseStudyNav.test.tsx
 M src/components/case-study/CarouselImage.tsx
 M src/components/case-study/CarouselSection.tsx
 M src/components/case-study/ContentSection.tsx
 M src/components/case-study/CoverScroll.tsx
 M src/components/sections/ProjectRow.tsx
 M src/content/case-studies.ts
 M src/content/projects.ts
?? src/components/case-study/CarouselImage.test.tsx
?? src/components/case-study/CoverScroll.test.tsx
?? CAROUSEL_IMAGE_EXPORT_PROMPT.md
?? docs/qa/2026-07-26-codex-ui-work-log-handoff.md
```

These are not the only changed files in the repository. Treat the worktree as shared and dirty. Do not reset, discard, or rewrite unrelated changes.

## Automated Verification Evidence

Last successful checks:

```text
npx tsc --noEmit
Result: passed

npx vitest run
Result: 7 test files passed, 30 tests passed

npx next build
Result: production build passed

git diff --check
Result: passed
```

The relevant tests cover:

CoverScroll (11 tests):
- Frame rendering, scroll-to-explore label, overflow behavior, scrollbar styles (manual mode)
- Auto-scroll aria-label, non-scrollable frame, will-change transform, image rendering, no scrollbar injection (auto-scroll mode)

CarouselImage (5 tests):
- Native overflow for full-height slides
- Scroll-to-top on slide reactivation
- Direction-aware positioning, transition lock
- Reduced-motion instant swap
- Keyboard arrow navigation

CaseStudyNav (4 tests):
- Stable dash markers, 40px minimum targets
- Active-section observer selection
- Native hash links, explicit return route
- Compact mobile navigation

## Remaining QA and Delivery Work

Claude Code should coordinate the following:

1. Run the current branch in an environment that permits a local browser connection.
2. Capture the Travecs case study at approximately 1440px, 1280px, 1024px, and 390px wide.
3. Verify the desktop sidebar does not collide with full-width media at the `xl` boundary.
4. Verify the mobile chapter bar remains sticky for the full article and does not conflict with the main navigation.
5. Scroll through every chapter and confirm the active dash or underline updates without flicker.
6. Click every chapter link and confirm the heading remains visible after navigation.
7. Verify keyboard focus rings are fully visible on the back link and every chapter link.
8. Test the CoverScroll auto-scroll on the homepage: confirm 4s initial delay, 3s pauses at each section, fluid scroll between sections, loop after footer, pause on hover.
9. Test the CoverScroll manual scroll on the case study page: confirm user can scroll with trackpad, 3px scrollbar visible, no auto-scroll.
10. Test the carousel auto-advance: confirm 4s interval when in-view, pauses on hover, arrow/dot/keyboard navigation works.
11. Test reduced motion and touch-sized viewports.
12. Report visual deviations with screenshots before changing established interaction values.
13. Coordinate the final commit only after owner approval.

## Questions for the Owner

1. Should the desktop return control remain the explicit "All case studies" label, or should it become the arrow-only treatment? Recommendation: keep the explicit label for clarity.
2. Should the desktop sidebar intentionally begin only at `xl` (1280px), or do you want it visible at `lg`? Recommendation: keep `xl` to protect the article layout.
3. Should the horizontal chapter navigator remain sticky on tablet and mobile? Recommendation: keep it sticky.
4. Are the six CoverScroll labels approved as final portfolio copy? Recommendation: approve before the final screenshot pass.
5. Should Claude Code prepare separate commits for each workstream, or one combined commit? Recommendation: separate commits for easier review and rollback.

## Questions for Claude Code as Technical Product Manager

1. Do any of the focused files overlap with other agent work that has not yet been handed off?
2. Is there an existing deployment or preview URL for the remaining browser QA?
3. Should the untracked test files and export prompt be included in the next commit?
4. Who owns final copy approval for the six semantic preview labels?
5. Are visual-regression screenshots part of the acceptance process?

## Handoff Instruction to Claude Code

Start by reading this document and inspecting the current diffs in the listed files. Preserve the implemented interaction values unless visual QA demonstrates a specific issue.

Do not revert to:
- The heart mascot / tooltip / pointer tracking (removed — replaced with two-mode CoverScroll)
- The moving vertical rail, font-weight-changing active state, JavaScript-cancelled anchors, `window.history.back()`, or the full vertical mobile list (sidebar)
- The auto-scroll-on-hover CoverScroll behaviour (replaced with manual scroll on case study page, auto-scroll only on homepage card)

Return to the owner with:
1. Answers to the technical questions above.
2. Desktop and mobile visual QA evidence.
3. Any exact deviations found, with file and line references.
4. A commit plan that separates unrelated work and preserves the shared dirty worktree.
