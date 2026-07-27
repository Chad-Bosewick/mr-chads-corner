# CODEX IMPLEMENTATION TASK

## Task ID

DRAFTLY-CS-REWRITE-01

## Title

Rewrite Draftly case study content — Phase 1 copy rewrite with asset placeholders

## Objective

Rewrite the `draftly` case-study object in `src/content/case-studies.ts` (lines 625–1014) following the ChatGPT-authored PRD at `docs/qa/draftly-case-study-rewrite-prd-updated.md`. This is a **content-only change** — no component modifications, no design token updates, no new image exports.

## Product context

The Draftly case study needs sharper, more art-directed copy that presents Draftly as one coherent system (product concept, landing page, product previews, brand identity, mascot, Writing Journey cards) rather than a collection of separate features. The Travecs case study (`credlane`, lines 262–603 in the same file) is the reference IA pattern — study its chapter grouping, nav labels, and section rhythm.

## User story

As a portfolio visitor, I need the Draftly case study to tell a coherent story about an AI writing coach system so I understand the product thinking, design decisions, and outcomes without the case study reading as disconnected feature descriptions.

## Scope

- Rewrite all copy within the `draftly` case-study object in `src/content/case-studies.ts`
- Update the `overview` field to present the product system, not just the initial sprint output
- Update `meta.scope` to include Writing Journey card system
- Add `chapter` fields to sections that currently lack them, following Travecs' chapter grouping pattern
- Add `navLabel` fields where appropriate, following Travecs' navigation pattern
- Add explicit placeholder image references for 3 pending assets (see Section 7 of PRD)
- Update section headings where the PRD specifies a title change (e.g., Section 10 → "Visual and Brand System")
- Preserve the existing 18-section order and all non-negotiable facts

## Out of scope

- Component changes (no new section types, no renderer modifications)
- Design token or Tailwind config updates (the Draftly palette values are editorial copy, not implementation tokens)
- New image exports or Figma asset delivery
- Global style changes
- Changes to any case study other than `draftly`
- Changes to `src/content/projects.ts` (homepage card data — handled separately)

## Dependencies

- The PRD document: `docs/qa/draftly-case-study-rewrite-prd-updated.md`
- The Travecs case study as reference IA pattern: `src/content/case-studies.ts` lines 262–603
- The existing Draftly case study source: `src/content/case-studies.ts` lines 625–1014

## Design source

- ChatGPT PRD: `docs/qa/draftly-case-study-rewrite-prd-updated.md` — this is the primary specification
- Travecs case study (same file, lines 262–603) — reference for chapter grouping, nav labels, section rhythm
- Existing source audit: `docs/qa/draftly-case-study-source-for-chatgpt.md`
- The PRD's Figma references are informational for copy accuracy — do not attempt to access Figma

## Technical context

- File: `src/content/case-studies.ts`
- The `draftly` export is a `CaseStudy` object (interface defined at line 81)
- Section types available (from `ContentSection` union at lines 1–17): `text`, `image-pair`, `metrics`, `full-image`, `hero-media`, `snapshot`, `diagram`, `comparison`, `sequence`, `future-state`, `executive-summary`, `what-i-designed`, `results`, `constraints`, `key-decisions`, `carousel`
- Chapter values: `"context" | "process" | "solution" | "results" | "reflection"`
- The Draftly case study currently uses: `executive-summary`, `what-i-designed`, `text`, `full-image`, `image-pair`, `results`, `constraints`, `key-decisions`, `future-state`
- The Travecs case study additionally uses: `carousel`
- Do NOT introduce new section types that aren't already used by Draftly or Travecs

## Functional requirements

1. Read the PRD document (`docs/qa/draftly-case-study-rewrite-prd-updated.md`) in full before writing any code
2. Read the Travecs case study (lines 262–603) to understand chapter grouping, nav labels, and section rhythm
3. Read the existing Draftly case study (lines 625–1014) to understand what exists
4. Rewrite the `overview` field to present Draftly as a product system (not only the initial sprint), while keeping the solo/three-day-sprint context and prototype outcome
5. Update `meta.scope` to: `"Landing page, AI Idea Starter preview, Writing Assistant preview, Writing Journey illustration cards"`
6. Preserve ALL non-negotiable metadata exactly: role ("Design Lead and Sole Designer"), timeline ("3 days"), date ("February 2026"), platform ("Responsive Web"), team ("Solo"), status ("Prototype presented to potential investors and collaborators")
7. Rewrite each of the 18 sections per the PRD's section-by-section specification (Section 6 of the PRD)
8. Add `chapter` fields to sections, following Travecs' pattern:
   - Executive Summary: no chapter (keep as-is)
   - What I Designed: no chapter
   - The Problem: `chapter: "context"`
   - Product Positioning: `chapter: "context"`
   - Landing Page: `chapter: "solution"`
   - AI Idea Starter: `chapter: "solution"`
   - Writing Assistant: `chapter: "solution"`
   - Explain My Mistake: `chapter: "solution"`
   - Use Cases / Writing Journey: `chapter: "solution"`
   - Visual and Brand System: `chapter: "solution"`
   - Pricing: `chapter: "solution"`
   - Trust and Academic Integrity: `chapter: "solution"`
   - Results: `chapter: "results"`
   - Constraints: `chapter: "reflection"`
   - Key Decisions: `chapter: "reflection"`
   - Simulated Review: `chapter: "reflection"`
   - What I Would Improve: `chapter: "reflection"`
   - Closing Reflection: `chapter: "reflection"`
9. Add `navLabel` to key sections (not every section — only those a reader would navigate to):
   - The Problem → `"Problem"`
   - Landing Page → `"Landing page"`
   - Writing Assistant → `"Writing"`
   - Use Cases / Writing Journey → `"Journey"`
   - Visual and Brand System → `"Brand"`
   - Results → `"Results"`
   - Key Decisions → `"Decisions"`
10. Use the specified placeholder format for pending assets (3 slots):
    - `[Awaiting Figma export: Brand system board — logo, mascot, palette, typography]`
    - `[Awaiting Figma export: Writing Journey four-card display]`
    - `[Awaiting Figma export: Art-directed case-study storyboard frame]`
    Place these as alt text on the nearest relevant image, or as a standalone text note if no image slot exists in that section. Do NOT invent file paths.
11. Follow the PRD's copy rules (Section 8): editorial, clear, concise, active voice, no AI hype, no fabricated metrics/research/quotes
12. Do NOT weaken the Constraints section — the three-day timeline, new category, and no student testing add credibility

## Visual requirements

- This task is content-only. No visual changes to components or styles.
- The rewritten copy should fit within the existing section renderer without layout issues.
- If any rewritten body text becomes significantly longer than the original, flag it in the handoff summary.

## Interaction requirements

- None. Content change only.

## Responsive requirements

- None. Content change only. The existing renderer handles responsive behaviour.

## Accessibility requirements

- Maintain the same HTML structure in `body` fields (existing `<strong>` tags for emphasis)
- No new accessibility concerns from content changes

## Performance requirements

- None. Content change only.

## Likely files affected

- `src/content/case-studies.ts` — the `draftly` object (lines 625–1014), this is the only file to modify

## Acceptance criteria

- [ ] The `draftly` case-study object has all 18 sections with rewritten copy per the PRD
- [ ] The `overview` field presents Draftly as a product system, not only a three-day sprint output
- [ ] `meta.scope` includes "Writing Journey illustration cards"
- [ ] All non-negotiable metadata facts are preserved exactly (role, timeline, date, platform, team, status)
- [ ] Chapter fields are added to sections following Travecs' grouping pattern
- [ ] Nav labels are added to key navigation sections
- [ ] Section 2 (What I Designed) includes the Writing Journey card system as a fifth item
- [ ] Section 9 presents the Writing Journey as a four-stage student-centred progression with colour descriptions (from PRD Section 9 table)
- [ ] Section 10 is retitled "Visual and Brand System" and covers the 6 points from PRD Section 10 (visual premise, colour roles, typography, layout language, proof layer, mascot)
- [ ] Section 15 (Key Decisions) includes the new "Make progress visible" decision
- [ ] 3 explicit placeholder markers exist for pending assets (brand system board, Writing Journey cards, storyboard frame)
- [ ] No fabricated metrics, research results, user quotes, adoption claims, or completed roadmap features
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] ESLint passes
- [ ] Build passes (`npm run build`)
- [ ] The existing case study page renders without errors at desktop and mobile widths

## Required tests

- TypeScript compilation clean
- ESLint clean
- Build succeeds
- Manual: run dev server, navigate to `/featured-case-studies/draftly`, verify all 18 sections render, scroll through entire page at desktop and mobile widths

## Required output

Return:

1. **Implementation summary** — what changed, what was preserved, what's placeholder
2. **Files changed** — list with brief description of changes per file
3. **Important decisions** — any copy choices that deviate from the PRD and why
4. **Deviations or assumptions** — anything you couldn't follow from the PRD and why
5. **Placeholders awaiting imagery** — list the 3 placeholder locations with their section numbers
6. **Layout concerns** — any sections where rewritten copy is significantly longer/shorter than original
7. **Known limitations** — anything that might need follow-up
8. **Build verification** — TypeScript, ESLint, build status
