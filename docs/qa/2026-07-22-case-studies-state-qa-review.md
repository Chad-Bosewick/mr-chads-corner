# QA Review - Case Studies Current State

Date: 2026-07-22  
Reviewer stance: Senior technical product manager / design engineer  
Scope: Published case studies and shared case-study rendering system

## Executive Summary

The case-study system is technically close to stable, but the product quality is uneven. Credlane and Draftly are mature enough to represent the portfolio direction. TODO++ and Letters App are readable but feel like older summaries. Testground should not be published in its current state because it is placeholder content and has a missing cover image on the featured case-study index.

The biggest implementation issues are:

- Testground is marked as published while its detail page is "coming soon".
- Testground references a missing cover image.
- The in-page case-study navigation is hardcoded and does not match many rendered section IDs.
- Credlane's featured card hook is factually wrong for the current case-study story.
- Case-study depth and structure are inconsistent across the portfolio.

## Case Study Readiness

| Case Study | Readiness | Current Assessment |
| --- | ---: | --- |
| Credlane | 85% | Strongest case study. Needs nav ID fix and featured-card hook correction. |
| Draftly | 80% | Strong narrative and visuals. Needs case-specific nav and minor image readability improvements. |
| TODO++ | 55% | Understandable but thin. Needs modern structure: snapshot, problem, decisions, constraints, result proof. |
| Letters App | 55% | Good concept but reads like a summary. Needs stronger structure and clearer evidence. |
| Testground | 10% | Placeholder. Should be unpublished or completed before public presentation. |

## Findings

### 1. Testground is published but incomplete

Severity: Blocker  
Files:

- `src/content/projects.ts`
- `src/content/case-studies.ts`

Current state:

- `testground` has `status: "published"`.
- `testground` detail content says "Case study content coming soon."
- `testground` references `/images/case-studies/testground-cover.webp`, which does not exist.

Impact:

- Creates a broken image on the featured case-study index.
- Creates a low-trust placeholder detail page.
- Weakens the credibility of the entire case-study collection.

Recommended action:

- Change Testground status to `coming-soon`, or remove it from published case-study routing until real content and assets exist.
- If keeping it visible as coming soon, ensure `ProjectRow` renders a placeholder visual instead of requesting a missing image.

Acceptance criteria:

- Testground no longer appears as a clickable published case study unless complete.
- `/images/case-studies/testground-cover.webp` is not requested unless the file exists.
- `npm run build` passes.
- Featured case-study index has zero missing image requests.

### 2. Hardcoded in-page navigation does not match rendered section IDs

Severity: High  
Files:

- `src/components/case-study/CaseStudyLayout.tsx`
- `src/components/case-study/CaseStudyNav.tsx`

Current state:

- `caseStudyNavItems` is hardcoded to IDs such as `problem`, `assessment-system`, and `results`.
- Text section IDs are generated from actual headings with `sectionId()`.
- Example: "The problem" renders as `the-problem`, but the nav points to `problem`.

Impact:

- Many nav links silently do nothing.
- Active section state is unreliable.
- Case studies with different structures get irrelevant nav items.

Recommended action:

- Generate nav items from the actual rendered sections for each case study.
- Add optional explicit section IDs to content data where canonical IDs are needed.
- Only render nav links for sections that exist on the current case study.

Acceptance criteria:

- Every visible case-study nav link targets an existing element ID.
- Credlane, Draftly, TODO++, and Letters App all show only relevant nav items.
- Active nav state works for every rendered link.
- No dead anchors such as `#problem` when no matching `id="problem"` exists.

### 3. Credlane featured-card hook is inaccurate

Severity: High  
File: `src/content/projects.ts`

Current state:

- Credlane hook says: "Making credit accessible through better design."
- Current Credlane story is about talent assessment, hiring, employer discovery, and candidate evaluation.

Impact:

- The card sets the wrong expectation.
- Users may think Credlane is a fintech/credit product before opening the case study.

Recommended action:

Replace the Credlane hook with a sentence aligned to the actual case-study story.

Suggested copy:

> Designing a hiring platform where talent can prove readiness and employers can evaluate candidates with stronger evidence.

Acceptance criteria:

- Featured case-study card accurately describes Credlane as a talent/hiring platform.
- Metadata and page description remain consistent with the case-study content.

### 4. Case-study depth is inconsistent

Severity: Medium  
Files:

- `src/content/case-studies.ts`

Current state:

- Credlane and Draftly include mature sections such as executive summary, what I designed, constraints, key decisions, and reflection.
- TODO++ and Letters App use older, lighter structures.
- Testground is placeholder content.

Impact:

- The portfolio feels uneven.
- Hiring managers may interpret older case studies as weaker work even if the projects were strong.

Recommended action:

Normalize all real case studies to a shared editorial structure:

1. Project snapshot
2. Executive summary
3. Problem
4. Role and scope
5. Process or system decisions
6. Final experience
7. Results
8. Constraints
9. Key decisions
10. Reflection

Acceptance criteria:

- TODO++ and Letters App include at least snapshot, executive summary, constraints, and key decisions.
- All real case studies expose comparable proof of role, process, outcome, and reflection.
- Section count does not need to match exactly, but narrative completeness should feel consistent.

## Verification Performed

- Published project inventory reviewed.
- Case-study data structure reviewed.
- Exported detail pages checked for image references.
- Featured case-study index checked for image references.
- `npm run lint` passed with one unrelated warning in `SequenceSection.tsx`.
- `npm run typecheck` passed.
- `npm run build` passed.

## Priority Implementation Plan

### P0

- Unpublish or complete Testground.
- Fix missing Testground cover image request.
- Fix case-study nav generation so no dead links render.

### P1

- Correct Credlane featured-card hook.
- Bring TODO++ and Letters App up to the newer case-study structure.

### P2

- Replace raw `img` in `SequenceSection.tsx` with `next/image` or the local `CinematicImage` pattern.
- Add automated content QA checks for:
  - Published project has case-study content.
  - Published project cover exists.
  - Rendered nav links target existing IDs.
  - Every image src exists under `public`.

