# CODEX IMPLEMENTATION TASK

## Task ID

UI-CLEANUP-002

## Title

Phase A UI cleanup: gallery grid spans, heading levels, stale homepage copy, comparison padding

## Objective

Fix four small, confirmed UI defects in one pass. Each is a low-risk, isolated change. All must pass TypeScript and test checks before handoff.

## Product context

The Travecs case study is at ~95% completion. We are in a Perfect UI cleanup phase — polishing confirmed defects across the existing implementation, not building new features.

## User story

As a portfolio visitor, I experience correct layouts, proper heading hierarchy, accurate copy, and consistent spacing — so the site feels polished and intentional.

## Scope

### Fix 1: Travel gallery grid spans (P1-3)

**File:** `src/app/about-temi/page.tsx`

**Problem:** `md:col-span-2` and `md:col-span-3` are applied to the `<figure>` elements (lines 112 and 140), but `<figure>` is a child of `SectionReveal`, which is the actual grid item. The span classes have no effect on the grid layout — the gallery collapses to one-column images at tablet widths instead of the intended 3-up/2-up layout.

**Fix:** Move the `md:col-span-*` classes from `<figure>` to the `SectionReveal` wrapper on both rows.

- First row (line 111): `SectionReveal` currently has no col-span. Add `md:col-span-2`.
- Second row (line 139): `SectionReveal` currently has no col-span. Add `md:col-span-3`.
- Remove `md:col-span-2` from `<figure>` at line 112.
- Remove `md:col-span-3` from `<figure>` at line 140.

### Fix 2: Heading level skips in diagram/sequence components (P2-8)

**Files:**
- `src/components/case-study/DiagramSection.tsx` (lines 67, 92, 161)
- `src/components/case-study/SequenceSection.tsx` (line 81)

**Problem:** These components use `<h4>` for sub-items, but the parent context is `<h2>` section headings. This skips `<h3>`, weakening document navigation for assistive technology.

**Fix:** Change `<h4>` to `<h3>` in all four locations. Update any associated styling if needed to maintain visual appearance (the tailwind classes may already be identical — check first).

### Fix 3: Stale homepage copy (P2-9)

**File:** `src/app/page.tsx` (line 53)

**Problem:** Homepage intro text says "fintech" but the Credlane case study category was changed to "Talent Platform". The copy no longer reflects the current project categories.

Current text:
```
A curation of recent product design work across productivity,
communication, fintech, and developer tools.
```

**Fix:** Update to reflect current categories. Based on `projects.ts`, the current categories are:
- Talent Platform (Credlane)
- Productivity (Travecs)
- Content Creation (Draftly)
- Developer Tools (Testground)
- Communication (Tidepool)

Suggested replacement:
```
A curation of recent product design work across talent platforms,
productivity, communication, and developer tools.
```

Use your judgment on the exact wording — it should feel natural and match the tone of the site. The key constraint is: "fintech" must be replaced with an accurate category.

### Fix 4: ComparisonSection second-column padding (P2-10)

**File:** `src/components/case-study/ComparisonSection.tsx` (line 32)

**Problem:** The comment on line 33 says "first item gets no extra left padding on desktop; second gets left padding" but both columns apply `md:pr-6` (right padding). The second column should have `md:pl-6` (left padding) to create space from the divider.

Current (line 32): `<div className="py-6 md:py-0 md:pr-6">`

**Fix:** Make the padding conditional based on column index:
- First column (`i === 0`): keep `md:pr-6`
- Second column (`i === 1`): use `md:pl-6`

Or simplify: since both columns have identical padding, apply `md:px-6` to both. But verify this doesn't create double-padding next to the divider. The intent is: each column has padding on the side facing the divider, creating symmetrical spacing.

## Out of scope

- Any other files not listed above.
- New features, new components, new animations.
- Changes to CoverScroll, CarouselImage, or CaseStudyNav.
- Contrast fixes, SEO, accessibility controls, or font mocking (covered in later phases).

## Dependencies

- None. All four fixes are independent of each other.

## Design source

- Owner observation and Codex review findings from `CODEX_REVIEW_DEFERRED.md`.
- No Figma inspection required for these changes.

## Technical context

- Framework: Next.js, React, TypeScript, Tailwind CSS
- All affected files are standard React components.
- No new dependencies required.
- No routing changes.

## Functional requirements

1. Travel gallery renders as a 3-up row (each 2/6 width) in the first row and a 2-up row (each 3/6 width) in the second row at `md` and above.
2. Diagram and sequence sub-items use `<h3>` instead of `<h4>`, maintaining correct heading hierarchy.
3. Homepage intro copy accurately reflects the current project categories (no "fintech").
4. ComparisonSection columns have symmetrical padding relative to the divider.

## Visual requirements

1. Gallery layout at `md`+: first row shows 3 equal-width images, second row shows 2 equal-width images centered.
2. Heading visual appearance should not change (verify `<h4>` → `<h3>` doesn't shift font size/weight; adjust if needed).
3. Comparison section text has equal spacing from the divider on both sides.
4. Homepage copy reads naturally.

## Interaction requirements

None. All four are layout/content fixes.

## Responsive requirements

1. Gallery fix must be verified at `md` (768px+), `lg` (1024px+), and `xl` (1280px+) widths.
2. On mobile (`<md`), gallery items should stack full-width regardless — the fix should not change mobile behavior.
3. Comparison section fix should be verified at `md` and above (below `md` there is no divider).

## Accessibility requirements

1. Heading hierarchy: h1 → h2 → h3 without skipping levels on case study pages.
2. No new accessibility violations introduced.

## Performance requirements

None. These are class-level and text-level changes.

## Likely files affected

- `src/app/about-temi/page.tsx` (grid spans)
- `src/components/case-study/DiagramSection.tsx` (heading levels)
- `src/components/case-study/SequenceSection.tsx` (heading levels)
- `src/app/page.tsx` (homepage copy)
- `src/components/case-study/ComparisonSection.tsx` (column padding)

## Acceptance criteria

- [ ] Travel gallery renders correctly at md/lg/xl: 3-up first row, 2-up second row.
- [ ] Gallery mobile behavior (<md) is unchanged — items stack full-width.
- [ ] DiagramSection and SequenceSection sub-items use `<h3>` with visually identical appearance.
- [ ] Heading hierarchy on case study pages is h1 → h2 → h3 (no skipped levels).
- [ ] Homepage copy no longer references "fintech" — reflects current categories.
- [ ] ComparisonSection columns have symmetrical padding from the divider.
- [ ] TypeScript passes: `npx tsc --noEmit`.
- [ ] Tests pass: `npx vitest run`.
- [ ] Production build passes: `npx next build`.
- [ ] `git diff --check` passes (no trailing whitespace issues).

## Required tests

- All existing tests must continue to pass.
- No new tests required for these fixes (they are layout and content corrections).

## Required output

Return:

1. Implementation summary (one paragraph per fix)
2. Files changed
3. Before/after for each fix
4. Any deviations or assumptions
5. Tests performed (tsc, vitest, build)
6. Screenshots or preview instructions for gallery fix
7. Known limitations
