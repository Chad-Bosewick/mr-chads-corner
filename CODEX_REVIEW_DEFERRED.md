# CODEX REVIEW — DEFERRED FINDINGS

**Status:** To be addressed once Credlane case study is 100% satisfactory
**Review date:** 2025-07-24
**Reviewed by:** Codex (OpenAI) — independent second opinion
**Gate:** FAIL (6 critical findings)
**Total findings:** 17 (6 P1 critical, 11 P2 advisory)
**Commit:** `9a9ddfe` (foundations branch)

---

## Trigger for activation

Revisit this file after:
- Credlane case study passes ChatGPT QA review
- Credlane responsive behaviour is verified at all breakpoints
- Credlane content and interactions are finalised
- Credlane is deployed and confirmed working in production

Then convert these findings into implementation tasks for Codex.

---

## P1 — Critical

### P1-1. Font mocking ships Arial/Georgia instead of brand fonts (macOS-only)

**File:** `scripts/google-font-mocks.cjs` (line 7), `scripts/with-font-mocks.cjs` (line 14)
**Impact:** Production builds bundle 1.15 MB of macOS system TTFs (Arial/Georgia) disguised as Plus Jakarta Sans/Lora. Linux CI will not have those paths. Mac builds render wrong typography.
**Fix direction:** Remove the macOS-specific font mock. Use proper Google Fonts loading or self-host the actual brand fonts.
**Priority:** High — affects every page's visual identity

### P1-2. Muted text fails WCAG 2.2 AA contrast

**File:** `src/styles/globals.css` (line 8)
**Details:** `#757575` on `#f5f2ee` = 4.13:1 contrast ratio. Normal text requires 4.5:1 minimum. Used for 11-14px labels, captions, navigation, body copy.
**Also:** Hover colors in `Nav.tsx` (line 69) and `page.tsx` (line 102) drop to 1.61:1 and 3.39:1.
**Fix direction:** Darken the muted token to at least `#6b6b6b` (4.6:1). Audit all hover states for minimum 4.5:1.
**Priority:** High — blocks WCAG compliance site-wide
**Status:** ✅ Fixed 2026-07-26 — Phase B cleanup (TASKS/2026-07-26-codex-ui-cleanup-phase-b.md). All 37 instances replaced with `#6F6F6F` token. Hover states fixed. Zero `#757575` remaining.

### P1-3. Travel gallery collapses to unintended one-sixth-width cards

**File:** `src/app/about-temi/page.tsx` (line 110)
**Issue:** `SectionReveal` is the grid item, but `md:col-span-2` and `md:col-span-3` are placed on the nested `<figure>`. At `md` widths each wrapper occupies one of six columns, producing tiny images instead of the intended 3-up/2-up layout.
**Fix direction:** Move the grid span classes from `<figure>` to the `SectionReveal` wrapper (the actual grid child).
**Priority:** High — breaks the about page gallery at tablet+
**Status:** ✅ Fixed 2026-07-26 — Phase A cleanup (TASKS/2026-07-26-codex-ui-cleanup-phase-a.md)

### P1-4. Animations lack keyboard-accessible pause/stop control

**Files:**
- `src/hooks/useTimelineHero.ts` (line 400) — timeline loops
- `src/hooks/useAsciiShader.ts` (line 432) — global ASCII canvas loops
- `src/components/case-study/CoverScroll.tsx` (line 88) — cover screenshot loops

**Issue:** CoverScroll only pauses on mouse hover. Reduced-motion support exists but does not provide the visible pause/stop mechanism required by WCAG 2.2.2 for users who have not enabled that OS preference.
**Fix direction:** Add visible play/pause toggle controls for each looping animation. The control must be keyboard-focusable and announced to screen readers.
**Priority:** High — WCAG 2.2.2 violation

### P1-5. Career timeline content inaccessible to screen readers

**File:** `src/components/effects/TimelineHero.tsx` (line 85)
**Issue:** The canvas is hidden from assistive tech. Only the currently animated milestone exists as a transient tooltip. The group's generic label does not expose the five years and descriptions. Screen-reader users cannot review the complete career history.
**Fix direction:** Provide a static accessible list or description alongside the canvas that exposes all milestones. Use `aria-live` or a visually-hidden but screen-reader-readable alternative.
**Priority:** High — entire career section is invisible to screen readers

### P1-6. Carousel pagination controls fail WCAG target-size requirements

**File:** `src/components/case-study/CarouselImage.tsx` (line 177)
**Issue:** Buttons are only 6px high with 6px gaps. Do not meet WCAG 2.5.8's 24x24px minimum target size. Arrow buttons hidden on mobile makes this worse.
**Fix direction:** Increase button size to at least 24x24px (ideally 44x44px for mobile). Ensure adequate spacing between controls.
**Priority:** High — carousel navigation unusable on touch devices
**Status:** ✅ Fixed — current code shows `h-11 w-11` (44×44px) arrow buttons and `h-11 w-6` (44×24px) dot indicators in `CarouselImage.tsx` lines 234, 256, 276. Verified 2026-07-26.

---

## P2 — Advisory

### P2-1. Next.js version mismatch (documented as 15, may be confused with 16)

**File:** `package.json` (line 16)
**Detail:** Resolves to Next 15.5.20 and eslint-config-next 15.5.20. Not a bug per se, but the `next lint` script will break when upgrading to Next 16.
**Action:** Verify intended version. Update documentation if needed.

### P2-2. Global animation creates sustained CPU/battery cost on every route

**Files:** `src/app/layout.tsx` (line 50), `src/hooks/useAsciiShader.ts` (line 329)
**Detail:** Full-viewport canvas mounted globally. Every 15fps frame iterates thousands of particles and calls `fillText`. Homepage additionally ships both GSAP and Motion for separate effects.
**Action:** Consider removing the global canvas from the root layout, or pausing it when offscreen. Audit whether both GSAP and Motion are needed.

### P2-3. Offscreen carousel images are force-preloaded

**File:** `src/components/case-study/CarouselImage.tsx` (line 108)
**Detail:** First image in every carousel marked `priority`. Credlane has three carousels, so generated HTML preloads three deeply offscreen images plus the 462 KB cover image.
**Action:** Remove `priority` from carousel images. Only the cover/hero image should use priority loading.

### P2-4. CoverScroll incorrect responsive geometry and broken pause-resume

**File:** `src/components/case-study/CoverScroll.tsx` (lines 39, 105, 197)
**Detail:** Compares image height against a fixed 600px frame despite `aspect-[16/10]`. At 480px card width, ~110px of screenshot is unseen. Lines 105 and 197 treat pixel translation as timestamp offset, causing jump after hover resume.
**Action:** Replace fixed 600px with dynamic frame measurement. Fix the pause-resume offset calculation.

### P2-5. Case-study content model lacks type safety

**File:** `src/content/case-studies.ts` (line 1), `src/components/case-study/CaseStudyLayout.tsx` (line 232)
**Detail:** Every payload field optional instead of using a discriminated union. Forces non-null assertions. Invalid content compiles and can render blank sections or crash. Line 170 injects HTML strings directly — currently static but XSS hazard if content comes from a CMS.
**Action:** Define a discriminated union for section types. Add runtime validation or Zod schemas. Sanitize HTML injection.

### P2-6. Case-study navigation has brittle behavior

**File:** `src/components/case-study/CaseStudyNav.tsx` (line 51, 85)
**Detail:** `window.history.back()` sends direct visitors off-site. JavaScript smooth scrolling ignores reduced-motion preferences. Section IDs placed below headings in `CaseStudyLayout.tsx` (line 167) scroll titles out of view.
**Action:** Replace `history.back()` with a deterministic link to the case study index. Use CSS `scroll-behavior` with `prefers-reduced-motion` media query. Move IDs to heading elements.
**Status:** ✅ Fixed 2026-07-26 — Sidebar rewrite (workstream 2). 2026-07-31 — additional TOC anchors added to Letters App (`a-home-built-for-returning-to-stories`) and TODO++ (`a-dedicated-surface-for-the-days-work`); sections now carry `scroll-mt-16` so anchor jumps clear the sticky nav.

### P2-7. SEO metadata incomplete and deployment-sensitive

**Files:** `src/app/layout.tsx` (line 23), `src/app/sitemap.ts` (line 7)
**Detail:** No `metadataBase`, canonical URLs, Open Graph, or Twitter metadata. Sitemap falls back to Netlify hostname and assigns `new Date()` to every page on every build.
**Action:** Add `metadataBase` to layout metadata. Add OG/Twitter tags. Fix sitemap to use build-time dates or content dates, not `new Date()`.
**Status:** ✅ Fixed 2026-07-31 — per-route `openGraph`/`twitter`/`alternates.canonical` added to `/`, `/about-temi`, `/contact`, `/featured-case-studies`, and per-slug case-study routes (dynamic per case study). All canonical/`og:url` resolve to `https://mrchadsite.netlify.app/…` with trailing slashes. No visual change.

### P2-8. Heading structure inconsistent

**Files:** `src/components/sections/ProjectRow.tsx` (line 67), diagram/sequence components
**Detail:** Case-study listing has `<h1>` followed by `<h3>` elements. Diagram/sequence components jump from `<h2>` to `<h4>`. Weakens document navigation for assistive technology.
**Action:** Ensure heading levels are sequential and nested correctly. `<h1>` → `<h2>` → `<h3>` without skipping levels.
**Status:** ✅ Fixed 2026-07-26 — Phase A cleanup (TASKS/2026-07-26-codex-ui-cleanup-phase-a.md)

### P2-9. Stale project/index copy

**Files:** `src/content/projects.ts` (line 41), homepage
**Detail:** Projects.ts describes Draftly as a tool for visual-thinking writers but its case study is an AI writing coach for high-school students. Homepage still claims portfolio covers fintech despite Credlane's category changing to Talent Platform.
**Action:** Update project descriptions to match case study content. Update homepage copy to reflect current category focus.
**Status:** ✅ Fixed 2026-07-26 — Phase A cleanup (homepage copy updated, Draftly description verified accurate)

### P2-10. Minor visual implementation defects

**Files:** `src/components/case-study/CarouselImage.tsx` (line 121), `src/components/case-study/ComparisonSection.tsx` (line 32)
**Detail:** WebKit scrollbar rule targets `.carousel-scroll` which is never applied. ComparisonSection documents left padding for second column but applies right padding to both, placing text against the divider.
**Action:** Add `.carousel-scroll` class to carousel container, or remove the dead CSS rule. Fix ComparisonSection padding to match documentation.
**Status:** ✅ Fixed 2026-07-26 — Phase A cleanup (ComparisonSection padding corrected; dead .carousel-scroll rule already removed)

### P2-11. Test coverage does not cover risky behaviour

**Detail:** Eight existing assertions cover only `cn`, basic visually-hidden styles, and hook initialization. Navigation focus, responsive galleries, carousels, reduced motion, animation cleanup, content rendering, and static routes are untested.
**Action:** Add test coverage for: carousel navigation, responsive gallery layout, animation cleanup on unmount, reduced-motion behaviour, case-study content rendering, and route generation.

---

## Notes

- TypeScript and ESLint both pass at time of review
- Findings are from an independent AI review (Codex) and should be verified before implementation
- Some findings may overlap with other QA processes — deduplicate before creating tasks
- Prioritise P1 items before any P2 work
- This file is a backlog source, not an implementation spec — convert to Codex tasks when ready
