# Codex Directive — TODO++ Case Study Rewrite

## Objective

Rewrite the `todoApp` case-study object in `src/content/case-studies.ts` and build a new `phone-mockup` section type for rendering mobile screenshots inside phone device bezels within case study content. This follows the same pattern as the Draftly case study rewrite (`tasks/2026-07-26-codex-draftly-case-study-rewrite-phase1.md`) but includes a component addition.

## Input

**Primary specification**: `docs/qa/todo-case-study-rewrite-prd.md` (produced by ChatGPT from Figma inspection)

**Structural reference pattern**: The Travecs case study in the same file (`src/content/case-studies.ts`, lines 262–609) — study its chapter grouping, nav labels, section rhythm, and data structure.

**Draftly rewrite exemplar**: `tasks/2026-07-26-codex-draftly-case-study-rewrite-phase1.md` — follow this task format for your implementation summary.

## Scope

### Content changes (data-only)

Rewrite the `todoApp` object in `src/content/case-studies.ts`:

1. **Add `subtitle`** — one-line positioning hook from the PRD
2. **Add `heroMedia`** — placeholder path from the PRD asset spec
3. **Add `coverScroll`** — placeholder structure only (empty `src`, empty `sections` array). The PRD states "omit by default" unless Figma node `18:64` contains a wide product-story frame. Add the field so the structure is in place; the user decides after Figma export whether to populate it. Do NOT invent section labels for CoverScroll.
4. **Add `meta`** — role, timeline, date, platform, team, scope, status (values from the PRD)
5. **Restructure `sections`** — replace the current 10 sections with the new editorial structure from the PRD, using the section types specified per section
6. **Add `chapter` fields** — context/solution/results/reflection grouping as specified in the PRD
7. **Add `navLabel` fields** — to key navigation sections as specified in the PRD
8. **Rewrite all body copy** — per the PRD's section-by-section specification
9. **Remove fabricated metrics** — the current "Impact" section with 32% churn reduction, etc. is to be removed entirely
10. **Keep personas** — if the PRD specifies keeping the user research personas section, preserve it with the image paths specified in the PRD

### Component changes (new `phone-mockup` section type)

Build a new section type for displaying mobile screenshots inside phone device bezels within the case study reading column.

#### 1. Update `ContentSection` type union

In `src/content/case-studies.ts`, add `"phone-mockup"` to the `ContentSection.type` union:

```typescript
type:
  | "text"
  | "image-pair"
  | "metrics"
  | "full-image"
  | "hero-media"
  | "snapshot"
  | "diagram"
  | "comparison"
  | "sequence"
  | "future-state"
  | "executive-summary"
  | "what-i-designed"
  | "results"
  | "constraints"
  | "key-decisions"
  | "carousel"
  | "phone-mockup";  // ← NEW
```

#### 2. Add data fields to `ContentSection`

```typescript
// Phone mockup fields (type: "phone-mockup")
phoneMockupImages?: {
  src: string;
  alt: string;
  caption?: string;
}[];  // 1-2 phone screenshots
```

#### 3. Create `PhoneMockupSection` component

New file: `src/components/case-study/PhoneMockupSection.tsx`

**Design spec** (Apple/Stripe quality, matches existing `DeviceMockup` styling):

```
Bezel:      bg-[#1a1a1a], rounded-[22px], p-[1.5px]
Notch:      h-[14px] w-[60px] (scaled down from homepage h-[18px] w-[80px])
Screen:     rounded-[20px], bg-[#f0f0f0], aspect-[9/19]
Shadow:     shadow-[0_8px_30px_rgba(21,21,21,0.08)]
Container:  max-w-[180px] per phone (vs. 240px on homepage)
Gap:        gap-4 (16px) between two phones
```

**Behaviour**:
- 1 phone image → centered in the reading column
- 2 phone images → side-by-side with 16px gap
- Optional caption below each phone in existing caption style (`font-sans text-sm text-[var(--color-text-muted)]`)
- Wrapped in `SectionReveal` for scroll-triggered fade-in
- Respects `prefers-reduced-motion`

**Reference**: Study `DeviceMockup.tsx` lines 169-211 (`renderPhoneShell`) for the exact bezel styling. Adapt those values at the smaller scale specified above.

#### 4. Integrate in `CaseStudyLayout.tsx`

Add a `case "phone-mockup"` to the `renderSection` switch in `src/components/case-study/CaseStudyLayout.tsx`:

```typescript
case "phone-mockup":
  return (
    <ReadingColumn key={index} className={spacing}>
      <PhoneMockupSection
        heading={section.heading}
        images={section.phoneMockupImages || []}
      />
    </ReadingColumn>
  );
```

Import `PhoneMockupSection` at the top of the file.

## Files affected

| File | Change |
|---|---|
| `src/content/case-studies.ts` | Rewrite `todoApp` object + add `phone-mockup` to `ContentSection` type + add `phoneMockupImages` field |
| `src/components/case-study/PhoneMockupSection.tsx` | New component |
| `src/components/case-study/CaseStudyLayout.tsx` | Add `phone-mockup` case to `renderSection` switch + import |

## Placeholder image paths

Use the paths specified in the ChatGPT PRD. The expected directory structure:

```
public/images/case-studies/todo-app/
├── todo-app-landing-page-full.webp    # CoverScroll
├── todo-app-hero.webp                 # Hero media
├── carousel/
│   └── todo-app-*.webp                # Desktop product frames
└── phone/
    └── todo-app-phone-*.webp          # Mobile product frames
```

Do NOT create the image files. Use the placeholder paths as specified in the PRD. The user will export real images from Figma after implementation.

For the homepage card cover (`todo-app-cover.webp`), keep the existing path unless the PRD specifies a replacement.

## Verification

1. `npx tsc --noEmit` passes
2. `npm run lint` passes
3. Dev server starts and renders the TODO++ case study page at `/featured-case-studies/todo-app/`
4. All sections render without errors
5. `PhoneMockupSection` renders correctly: single phone centered, dual phones side-by-side
6. Phone bezels match the existing `DeviceMockup` styling (border radius, shadow, notch) at the smaller scale
7. Scroll reveal works on phone mockup sections
8. `prefers-reduced-motion` disables phone mockup animation
9. Chapter dividers appear between context → solution → results → reflection
10. Sidebar navigation shows the nav labels specified in the PRD
11. All placeholder image paths are syntactically valid (actual images come later)

## Non-negotiable

- The `slug` must remain `"todo-app"`
- The `nextSlug` / `prevSlug` values must remain unchanged
- Do NOT fabricate metrics, user quotes, or research claims
- Do NOT modify any case study other than `todoApp`
- Do NOT modify `src/content/projects.ts` (homepage card data)

## Required output

Return:

1. **Implementation summary** — what changed, what was preserved, what's placeholder
2. **Files changed** — list with brief description of changes per file
3. **PhoneMockupSection decisions** — any design choices that deviate from the spec and why
4. **Deviations or assumptions** — anything you couldn't follow from the PRD and why
5. **Placeholders awaiting imagery** — list all placeholder image paths
6. **Build verification** — TypeScript, ESLint, build status
7. **Known limitations** — anything that might need follow-up
