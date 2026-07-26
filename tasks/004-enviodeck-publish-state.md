# CODEX IMPLEMENTATION TASK

## Task ID

T-004

## Title

Resolve Enviodeck inconsistent publication state (QA Major)

## Objective

Make Enviodeck have a single consistent public policy across all routes: either a deliberate coming-soon page (linked consistently) or excluded entirely from static params, sitemap, and navigation.

## Product context

Currently the case-study index (`/featured-case-studies`) disables the Enviodeck row with `tabIndex={-1}` and `href="#"`, but:
- `/featured-case-studies/enviodeck` is still generated as a static route
- It appears in `sitemap.xml`
- It appears as the "next project" navigation from Letters App
This sends mixed signals to users and crawlers.

## User story

As a visitor, I want a consistent experience — a coming-soon project should be clearly signposted everywhere or not listed at all.

## Scope

Choose ONE approach and implement it:

**Option A: Public coming-soon** — Make Enviodeck a genuine coming-soon page with meaningful content (what the product does, what to expect), link to it from the index, include in sitemap as a teaser, include in project nav.

**Option B: Hidden until publishable** — Remove Enviodeck from:
- `generateStaticParams` in `[slug]/page.tsx`
- `sitemap.ts` entries
- `ProjectRow` render (conditional on status)
- `ProjectNav` previous/next chain
- The projects content array or filter by status where consumed

## Out of scope

- Writing the actual Enviodeck case study content
- Changing the TODO++ or Letters App content

## Design source

- QA finding: QA-2026-07-18-001, Major finding #4
- Current state: entry exists in `src/content/projects.ts` with `status: "coming-soon"`

## Technical context

- Projects defined in `src/content/projects.ts`
- ProjectRow in `src/components/sections/ProjectRow.tsx` checks `isComingSoon`
- Case study page in `src/app/featured-case-studies/[slug]/page.tsx` uses `generateStaticParams`
- Sitemap in `src/app/sitemap.ts` lists routes manually
- ProjectNav in `src/components/case-study/ProjectNav.tsx` uses previous/next based on filtered projects

## Acceptance criteria

- [ ] Enviodek has one consistent public state across ALL routes/index/sitemap/nav
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- `src/app/featured-case-studies/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/components/case-study/ProjectNav.tsx`
- `src/components/sections/ProjectRow.tsx`
- `src/content/projects.ts` (possibly — metadata change only)

## Required output

Return:

1. which option was chosen and why
2. implementation summary
3. files changed
4. confirmation build, lint pass
