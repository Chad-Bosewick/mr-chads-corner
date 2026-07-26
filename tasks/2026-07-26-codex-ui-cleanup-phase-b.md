# CODEX IMPLEMENTATION TASK

## Task ID

UI-CLEANUP-003

## Title

Phase B: Site-wide muted text contrast audit and fix — replace `#757575` with WCAG AA-compliant alternative

## Objective

Replace every instance of `#757575` (4.13:1 on paper background) with a color that passes WCAG 2.2 AA contrast requirements (minimum 4.5:1 for normal text). Audit all hover states on text elements for contrast compliance. Deliver a single, consistent muted text token across the entire site.

## Product context

The portfolio is in a Perfect UI cleanup phase. The sidebar was already updated from `#757575` to `#6F6F6F` (4.50:1) during the case-study sidebar redesign. The rest of the site still uses the failing `#757575` across 37 instances in 18 files. This task completes the contrast fix site-wide.

## User story

As a portfolio visitor with low vision or in bright ambient lighting, I can read all muted text — labels, captions, descriptions, metadata — without straining, because every text element meets WCAG 2.2 AA contrast standards.

## Scope

### Primary: Replace `#757575` across the codebase

`#757575` on the paper background `#f5f2ee` produces a 4.13:1 contrast ratio. WCAG 2.2 AA requires 4.5:1 for normal text (and 3:1 for large text — 18px+ bold or 24px+ regular).

**Target color:** `#6F6F6F` — produces approximately 4.50:1 on `#f5f2ee`. This is already used in the sidebar and has been verified as visually appropriate. It is dark enough to pass AA while remaining clearly subordinate to primary text (`#151515`).

**If `#6F6F6F` does not produce exactly 4.50:1** when checked against the actual rendered background (accounting for the paper texture image), adjust to the lightest value that achieves ≥ 4.50:1. Do not go darker than `#6B6B6B` — the muted text should remain visually light.

**Approach — two options, choose the cleaner one:**

**Option A (preferred):** Update the CSS custom property `--color-text-muted` in `globals.css` (line 8) from `#757575` to the new value, then replace every hardcoded `#757575` Tailwind class with `text-[var(--color-text-muted)]`. This creates a single source of truth for the muted color token.

**Option B (faster):** Find-and-replace every `#757575` with the new hex value across all files. Simpler, but leaves the color scattered as magic values.

Either approach is acceptable. Option A is better long-term. Option B is acceptable if it gets done cleanly.

### Secondary: Audit hover states for contrast

Check every hover state that transitions text to a lighter or lower-contrast color. The known issue:

**Nav.tsx line 72:** Inactive nav links use `hover:text-[#A43718]/30`. On the paper background, `#A43718` at 30% opacity computes to approximately `#DCBAB2` — a contrast ratio of roughly 1.5:1 against `#f5f2ee`. This fails WCAG AA even for large text.

**Fix direction for Nav hover:** Increase the opacity floor. `hover:text-[#A43718]/60` or higher would likely pass. Alternatively, use a solid color that passes — `hover:text-[#A43718]` (full opacity) is 4.63:1 and passes. Choose the lightest opacity that achieves ≥ 4.5:1.

**Also check:**
- `page.tsx` line 102: `hover:text-[#A43718]/70` — verify this passes (it likely does, but confirm).
- Any other hover transitions on text that reduce contrast below 4.5:1.
- The `NavMobile.tsx` active item uses `#757575` on a dark background (`#0F0F0F`) — this achieves ~4.68:1 and passes. Update it to the new token for consistency, but the contrast is already acceptable.

## Out of scope

- Changing the primary text color (`#151515`).
- Changing the accent color (`#A43718`) at full opacity.
- Changing the sidebar muted color (already `#6F6F6F`).
- Any layout, spacing, typography, or component structure changes.
- New components, new features, new animations.

## Dependencies

- None. This is a self-contained color token replacement.

## Design source

- Codex review finding P1-2 from `CODEX_REVIEW_DEFERRED.md`.
- Sidebar precedent: `#6F6F6F` already approved and in use.
- WCAG 2.2 AA contrast requirements.

## Technical context

- Framework: Next.js, React, TypeScript, Tailwind CSS
- Background: paper texture image over `#f5f2ee` solid color.
- The CSS custom property `--color-text-muted` is defined in `globals.css` line 8 but is not widely referenced — most instances use hardcoded `#757575` in Tailwind classes.
- 37 instances across 18 files need updating.

## Complete file list

Every file containing `#757575`:

| File | Instances | Context |
| --- | --- | --- |
| `src/styles/globals.css` | 1 | CSS custom property `--color-text-muted` |
| `src/app/page.tsx` | 2 | Homepage section labels and intro text |
| `src/app/not-found.tsx` | 1 | 404 page body text |
| `src/app/contact/page.tsx` | 2 | Contact page labels |
| `src/app/about-temi/page.tsx` | 1 | About page travel intro |
| `src/components/sections/HeroHeading.tsx` | 1 | Hero subtitle |
| `src/components/sections/ProjectRow.tsx` | 2 | Category label and hook text |
| `src/components/sections/TestimonialBlock.tsx` | 1 | Testimonial attribution |
| `src/components/sections/EditorialHero.tsx` | 2 | Editorial hero metadata |
| `src/components/layout/NavMobile.tsx` | 1 | Active nav item on dark bg |
| `src/components/case-study/ProjectSnapshot.tsx` | 1 | Snapshot label |
| `src/components/case-study/ImagePair.tsx` | 1 | Image caption |
| `src/components/case-study/MetricBar.tsx` | 2 | Metric labels |
| `src/components/case-study/EditorialCard.tsx` | 1 | Card category label |
| `src/components/case-study/CarouselImage.tsx` | 1 | Slide counter |
| `src/components/case-study/SequenceSection.tsx` | 1 | Step description |
| `src/components/case-study/DiagramSection.tsx` | 10 | Diagram labels, table headers, cell text, descriptions |
| `src/components/case-study/ProjectNav.tsx` | 4 | Nav labels ("Previous", "Next", descriptions) |
| `src/components/case-study/CaseStudyLayout.tsx` | 3 | Case study metadata labels |
| `src/components/effects/TimelineHero.tsx` | 1 | Timeline tooltip label |

**Total: 37 instances across 19 files (including globals.css).**

## Functional requirements

1. Every instance of `#757575` is replaced with the new WCAG AA-compliant muted color.
2. The CSS custom property `--color-text-muted` in `globals.css` is updated to the new value.
3. All hover states on text elements achieve ≥ 4.5:1 contrast ratio against their background.
4. The visual hierarchy is preserved — muted text remains clearly lighter than primary text (`#151515`).
5. No other colors, layout, or spacing are modified.

## Visual requirements

1. Muted text is slightly darker than before — the change should be subtle, not jarring.
2. The sidebar (already `#6F6F6F`) should look consistent with all other muted text after this fix.
3. Nav hover states should feel intentional — not invisible, not louder than the default state.
4. No text becomes harder to read as a result of this change.

## Interaction requirements

None. Purely a color token change.

## Responsive requirements

The color change is breakpoint-independent. Verify at desktop and mobile that the new color reads well on the paper background at all text sizes used (11px uppercase labels through 16px body text).

## Accessibility requirements

1. Every text element using the muted color achieves ≥ 4.5:1 contrast against `#f5f2ee` (or the dark mobile nav background).
2. Hover states achieve ≥ 4.5:1 contrast against the background they appear on.
3. No color-only communication is introduced or broken.
4. WCAG 2.2 AA compliance for all text contrast.

## Performance requirements

None.

## Likely files affected

- `src/styles/globals.css`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/app/contact/page.tsx`
- `src/app/about-temi/page.tsx`
- `src/components/sections/HeroHeading.tsx`
- `src/components/sections/ProjectRow.tsx`
- `src/components/sections/TestimonialBlock.tsx`
- `src/components/sections/EditorialHero.tsx`
- `src/components/layout/NavMobile.tsx`
- `src/components/case-study/ProjectSnapshot.tsx`
- `src/components/case-study/ImagePair.tsx`
- `src/components/case-study/MetricBar.tsx`
- `src/components/case-study/EditorialCard.tsx`
- `src/components/case-study/CarouselImage.tsx`
- `src/components/case-study/SequenceSection.tsx`
- `src/components/case-study/DiagramSection.tsx`
- `src/components/case-study/ProjectNav.tsx`
- `src/components/case-study/CaseStudyLayout.tsx`
- `src/components/effects/TimelineHero.tsx`
- `src/components/layout/Nav.tsx` (hover state fix)

## Acceptance criteria

- [ ] Zero instances of `#757575` remain in `src/` (verified by grep).
- [ ] The CSS custom property `--color-text-muted` is updated to the new value.
- [ ] The new muted color achieves ≥ 4.50:1 contrast ratio against `#f5f2ee` for all text sizes used on the site.
- [ ] Nav inactive link hover state achieves ≥ 4.50:1 contrast against the paper background.
- [ ] Homepage CTA hover (`hover:text-[#A43718]/70`) is verified — passes or adjusted.
- [ ] Sidebar muted text (`#6F6F6F`) is visually consistent with all other muted text.
- [ ] Visual hierarchy preserved — muted text is lighter than primary text, darker than before.
- [ ] TypeScript passes: `npx tsc --noEmit`.
- [ ] Tests pass: `npx vitest run`.
- [ ] Production build passes: `npx next build`.
- [ ] `git diff --check` passes.

## Required tests

- All existing tests must continue to pass.
- No new tests required — this is a color token replacement.

## Contrast verification

Before submitting, verify contrast ratios using any standard tool (WebAIM Contrast Checker, browser DevTools, or manual calculation):

| Element | Background | Minimum ratio required |
| --- | --- | --- |
| All `#6F6F6F` text on paper | `#f5f2ee` | ≥ 4.50:1 |
| Nav hover on paper | `#f5f2ee` | ≥ 4.50:1 |
| `#757575` on dark nav bg | `#0F0F0F` | ≥ 4.50:1 (already passes, update for consistency) |

## Required output

Return:

1. Implementation summary
2. Files changed (all 21 files)
3. Final color value chosen and its measured contrast ratio
4. Hover state audit results (before/after ratios)
5. Grep confirmation: zero `#757575` instances remaining
6. Tests performed (tsc, vitest, build)
7. Any deviations or assumptions
8. Known limitations
