# QA Review - Case Study Alignment, Spacing, Dividers, and Vector Lines

Date: 2026-07-22  
Reviewer stance: Senior technical product manager / design engineer  
Scope: Shared case-study layout and all real case studies

## Executive Summary

The case-study pages use a strong editorial left rail, but the system does not fully exploit the empty right side of the layout. On wide screens, the reading column can feel accidentally left-heavy. The best improvement is not centered text. The best improvement is a centered reading column with left-aligned text, paired with full-width media where needed.

The current spacing and divider system is also too mechanical in some places and too inconsistent in others. Most section components use the same vertical spacing, regardless of whether the section is text, image, diagram, metric, or chapter break. Divider placement is controlled by exact heading strings, which makes the rhythm inconsistent across case studies.

## Center Alignment Verdict

Do not center-align body copy.

Center-aligned long-form text harms readability because every line starts at a different x-position. Case studies are reading experiences, so paragraphs should remain left-aligned.

Do center the content column.

The recommended layout is:

- Center the reading column within the page shell.
- Keep paragraph text left-aligned.
- Let major media use the full content rail.
- Align image headings and captions either to the reading column or the media edge intentionally.
- Use dividers only for major chapter transitions.

## Current Alignment Model

Files:

- `src/components/layout/PageShell.tsx`
- `src/components/case-study/CaseStudyLayout.tsx`

Current state:

- Page shell is centered at `max-w-[1120px]`.
- Reading column is `max-w-[680px]`.
- Reading column is not centered because it lacks `mx-auto`.
- This creates a left-rail editorial layout.

Impact:

- Left alignment works for readability.
- On wide screens, the unused right area can feel accidental.
- Images and text alternate between full rail and narrow rail without a strong alignment rule.

Recommended action:

- Update `ReadingColumn` for case-study pages to use `mx-auto`.
- Keep text left-aligned.
- If other pages depend on left-rail alignment, create a variant:
  - `ReadingColumn align="center"`
  - `ReadingColumn align="start"`

Acceptance criteria:

- Case-study body text is left-aligned.
- Reading content sits centered in the page shell on desktop.
- Full-width media still spans the intended content width.
- Mobile layout remains unchanged except for consistent margins.

## Findings

### 1. Sticky case-study nav is misaligned with the page grid

Severity: High  
File: `src/components/case-study/CaseStudyNav.tsx`

Current state:

- `PageShell` already applies page padding.
- `CaseStudyNav` adds its own `px-5 sm:px-6 lg:px-8`.
- Because nav is rendered inside `PageShell`, this creates double horizontal inset.

Impact:

- Nav labels do not align with header, reading column, or media edges.
- The sticky bar feels like a separate grid system.

Recommended action:

- Remove duplicate horizontal padding from the nav inner container.
- Let nav align to the same shell it is rendered within.
- If the nav should bleed full width, move it outside `PageShell` or use a deliberate full-bleed wrapper.

Acceptance criteria:

- Nav start edge aligns intentionally with either page shell or reading column.
- No accidental double padding.
- Horizontal scroll still works on mobile.

### 2. Divider placement is heading-string dependent

Severity: High  
File: `src/components/case-study/CaseStudyLayout.tsx`

Current state:

- Divider logic checks exact headings such as `"the problem"` and `"product evolution"`.
- Credlane gets several dividers.
- Draftly gets one.
- TODO++ and Letters App get none.

Impact:

- Page rhythm varies accidentally between case studies.
- Renaming a heading can remove a divider without obvious warning.

Recommended action:

- Move divider intent into content data.
- Add optional section fields:
  - `breakBefore?: boolean`
  - `breakAfter?: boolean`
  - `chapter?: "context" | "process" | "solution" | "results" | "reflection"`
- Render dividers from those explicit fields, not heading text.

Acceptance criteria:

- Divider placement is intentional and content-driven.
- Renaming headings does not change divider behavior.
- All real case studies follow a consistent chapter rhythm.

### 3. Section spacing is too uniform across different content types

Severity: Medium  
Files:

- `src/components/case-study/ContentSection.tsx`
- `src/components/case-study/ImagePair.tsx`
- `src/components/case-study/DiagramSection.tsx`
- `src/components/case-study/MetricBar.tsx`
- `src/components/case-study/EditorialCard.tsx`

Current state:

- Most sections use `my-12 md:my-16`.
- Section types with different cognitive weight get the same spacing.

Impact:

- Long case studies feel mechanically paced.
- Image sections sometimes feel disconnected from the text they support.
- Chapter transitions are not visually distinct enough.

Recommended spacing model:

| Section Type | Suggested Spacing |
| --- | --- |
| Text following text | `mt-10 md:mt-12` |
| Text followed by supporting image | image `mt-6 md:mt-8` |
| Major media after chapter intro | `mt-8 md:mt-10` |
| New chapter break | `my-20 md:my-28` |
| Compact diagrams/comparisons | `my-10 md:my-14` |
| Results / key decisions | `my-16 md:my-20` |

Recommended action:

- Introduce section spacing variants instead of hardcoding `my-12 md:my-16` everywhere.
- Keep related text and image closer together.
- Use larger spacing only when the narrative changes chapter.

Acceptance criteria:

- Supporting images feel attached to the section they support.
- Major narrative breaks feel more intentional.
- Page rhythm feels consistent across Credlane, Draftly, TODO++, and Letters App.

### 4. Full-image sections force every image into a 4/3 container

Severity: Medium  
File: `src/components/case-study/ImagePair.tsx`

Current state:

- Every image uses `aspectRatio="4/3"`.
- Several real assets are wide, tall, or montage-oriented.

Impact:

- Wide images get excess vertical dead space.
- Some UI screenshots become smaller than necessary.
- Page spacing feels heavier than it needs to.

Recommended action:

- Allow image-level or section-level aspect ratio.
- Add optional content field:
  - `aspectRatio?: "4/3" | "16/10" | "16/9" | "3/2" | "auto"`
- Use the actual asset intent:
  - Product UI screenshot: `16/10` or `16/9`
  - Phone screen: `3/4` or contained device mockup
  - Research artifact: `4/3`
  - Montage: native ratio or `16/10`

Acceptance criteria:

- Images use containers that match their visual format.
- No major image has large empty container space unless intentional.
- Layout remains stable with no image layout shift.

### 5. Vector and connector lines are sometimes decorative rather than explanatory

Severity: Medium  
File: `src/components/case-study/DiagramSection.tsx`

Current state:

- Diagram lines use simple `h-px` blocks.
- Some lines imply relationships but do not connect clearly.
- Mobile and desktop line orientation is not always structurally accurate.

Impact:

- Some diagrams feel like styled cards rather than clear product thinking tools.
- Connector lines can add noise without improving comprehension.

Recommended action:

- Use connector lines only when they clarify sequence, dependency, or relationship.
- For mobile, use vertical connectors in vertical flows.
- For desktop, use horizontal connectors only when items are actually in a horizontal sequence.
- Remove connector lines from diagrams where spacing/card grouping already communicates structure.

Acceptance criteria:

- Every visible vector/connector line has a clear explanatory purpose.
- No connector line visually runs behind content in a confusing way.
- Mobile diagrams do not use horizontal connectors for vertical flows.

### 6. Project navigation right-aligns too early

Severity: Low  
File: `src/components/case-study/ProjectNav.tsx`

Current state:

- Next project link uses `text-right` when both previous and next exist.
- This applies before the desktop breakpoint.

Impact:

- On mobile, right-aligned navigation can be harder to scan.

Recommended action:

- Change `text-right` to `md:text-right`.

Acceptance criteria:

- Mobile previous/next navigation is left-aligned.
- Desktop can preserve opposing previous/next alignment.

## Recommended Layout Direction

Use a hybrid editorial layout:

| Element | Recommended Alignment |
| --- | --- |
| Header metadata/title/overview | Centered reading column, left-aligned text |
| Long-form body copy | Centered reading column, left-aligned text |
| Executive summary | Centered reading column |
| Project snapshot | Centered reading column |
| Major visuals | Full page content rail |
| Image captions | Align to image edge or reading column, consistently |
| Diagrams/tables | Reading column unless they need extra width |
| Sticky section nav | Align to page shell or reading column, not double padded |
| Dividers | Explicit chapter breaks, not heading-string matches |

## Implementation Plan

### P0

- Fix `CaseStudyNav` alignment and dead anchor generation.
- Make divider placement explicit in content data rather than heading-string dependent.

### P1

- Add centered reading column support for case-study pages.
- Keep paragraph text left-aligned.
- Add section spacing variants.

### P2

- Add configurable image aspect ratios.
- Simplify vector/connector lines in diagrams.
- Adjust `ProjectNav` mobile alignment.

## Acceptance Criteria for Final Layout System

- Case-study text remains left-aligned.
- Reading column is centered on desktop for better balance.
- Full-width media uses the page rail intentionally.
- Sticky nav aligns to the same grid as the page.
- No nav item links to a missing ID.
- Divider placement is consistent across case studies.
- Spacing distinguishes related content from chapter transitions.
- Vector lines are used only when they improve comprehension.
- Mobile spacing and alignment remain clean at 360px+ viewport width.

