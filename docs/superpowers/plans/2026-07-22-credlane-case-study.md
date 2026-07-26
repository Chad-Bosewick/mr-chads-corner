# Credlane Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Credlane placeholder case study page with a premium, editorial product-design case study matching the content specification in `credline-case-study.md`.

**Architecture:** Extend the existing `ContentSection` model with 6 new section types and 3 new top-level case-study fields. Build new components for each section type. Populate the Credlane entry with full content. The existing CaseStudyLayout, ContentSection, ImagePair, MetricBar, ProjectNav, and CinematicImage components are reused where possible.

**Tech Stack:** Next.js 15 App Router, React Server Components, TypeScript, Tailwind CSS v4, motion (framer-motion), next/image

## Global Constraints

- Preserve existing design system: PageShell max-w-[1120px], ReadingColumn max-w-[680px], spacing scale, typography tokens, colour palette (#151515, #757575, #A43718, #f0f0f0), motion durations
- Long-form text measure: 640px–760px (ReadingColumn)
- Wide media containers: 1120px–1360px (break out of ReadingColumn)
- Reuse existing components before creating new ones
- Lazy-load below-the-fold images via next/image
- Semantic HTML, descriptive alt text
- Support desktop, tablet, mobile
- Respect prefers-reduced-motion
- No invented metrics or outcomes beyond what the content doc specifies
- All media placeholder images use `/images/case-studies/credlane-*.webp` naming

---

## Task 1: Extend content model and build core components

**Files:**
- Modify: `src/content/case-studies.ts`
- Create: `src/components/case-study/HeroMedia.tsx`
- Create: `src/components/case-study/ProjectSnapshot.tsx`
- Create: `src/components/case-study/SectionDivider.tsx`
- Create: `src/components/case-study/EditorialCard.tsx`

**Interfaces:**
- Produces: `ContentSection` with new types: `"hero-media"`, `"snapshot"`, `"diagram"`, `"comparison"`, `"sequence"`, `"future-state"`
- Produces: `CaseStudy` with new fields: `heroMedia`, `meta` (role, timeline, date, platform, team, scope, status)
- Produces: `HeroMedia`, `ProjectSnapshot`, `SectionDivider`, `EditorialCard` components

- [ ] **Step 1: Extend the ContentSection type**

Add new section types to `src/content/case-studies.ts`:

```typescript
export interface ContentSection {
  type: "text" | "image-pair" | "metrics" | "full-image" | "hero-media" | "snapshot" | "diagram" | "comparison" | "sequence" | "future-state";
  heading?: string;
  body?: string;
  images?: { src: string; alt: string; caption?: string }[];
  metrics?: { label: string; value: string }[];
  // Diagram fields
  diagramType?: "problem" | "evolution" | "ecosystem" | "change-framework" | "team-workflow";
  diagramData?: DiagramData;
  // Comparison fields
  comparisonItems?: { label: string; content: string }[];
  // Sequence fields
  sequenceItems?: { step: number; label: string; description?: string; src?: string; alt?: string }[];
  // Future state
  futureStateData?: { label: string; description: string }[];
}

export interface CaseStudyMeta {
  role: string;
  timeline: string;
  date: string;
  platform: string;
  team: string;
  scope: string;
  status: string;
}

export interface DiagramData {
  // Problem diagram
  problemDiagram?: {
    leftLabel: string;
    leftStatement: string;
    rightLabel: string;
    rightStatement: string;
    centre: string;
  };
  // Evolution timeline
  evolutionStages?: { stage: string; description: string }[];
  // Ecosystem map
  ecosystemRoles?: { name: string; description: string; permissions: string[] }[];
  // Change framework
  changeRows?: { change: string; systems: string; response: string }[];
  // Team workflow
  workflowSteps?: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  role: string;
  timeline: string;
  overview: string;
  coverSrc: string;
  sections: ContentSection[];
  nextSlug: string | null;
  prevSlug: string | null;
  // New fields
  heroMedia?: { src: string; alt: string };
  meta?: CaseStudyMeta;
}
```

- [ ] **Step 2: Build HeroMedia component**

Create `src/components/case-study/HeroMedia.tsx` — full-width hero image with cinematic reveal, breaks out of ReadingColumn.

```typescript
import { CinematicImage } from "@/components/ui/CinematicImage";

interface HeroMediaProps {
  src: string;
  alt: string;
}

export function HeroMedia({ src, alt }: HeroMediaProps) {
  return (
    <div className="mt-8 md:mt-12">
      <CinematicImage
        src={src}
        alt={alt}
        fill
        aspectRatio="8/5"
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-contain"
      />
    </div>
  );
}
```

- [ ] **Step 3: Build ProjectSnapshot component**

Create `src/components/case-study/ProjectSnapshot.tsx` — a two-column metadata table in ReadingColumn.

```typescript
import { SectionReveal } from "@/components/sections/SectionReveal";
import type { CaseStudyMeta } from "@/content/case-studies";

interface ProjectSnapshotProps {
  meta: CaseStudyMeta;
}

export function ProjectSnapshot({ meta }: ProjectSnapshotProps) {
  const rows = [
    ["Role", meta.role],
    ["Timeline", meta.timeline],
    ["Date", meta.date],
    ["Platform", meta.platform],
    ["Team", meta.team],
    ["Scope", meta.scope],
    ["Status", meta.status],
  ];

  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <span className="font-sans text-sm font-medium text-[#757575]">{label}</span>
              <span className="font-sans text-sm text-[#151515]/70">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Build SectionDivider component**

Create `src/components/case-study/SectionDivider.tsx` — a minimal `<hr>` for editorial separation between major sections.

```typescript
import { SectionReveal } from "@/components/sections/SectionReveal";

export function SectionDivider() {
  return (
    <SectionReveal>
      <hr className="my-12 border-[#151515]/10 md:my-16" />
    </SectionReveal>
  );
}
```

- [ ] **Step 5: Build EditorialCard component**

Create `src/components/case-study/EditorialCard.tsx` — a bordered card for "Future consideration" callouts and similar editorial blocks.

```typescript
import { SectionReveal } from "@/components/sections/SectionReveal";

interface EditorialCardProps {
  label: string;
  heading?: string;
  children: React.ReactNode;
}

export function EditorialCard({ label, heading, children }: EditorialCardProps) {
  return (
    <SectionReveal>
      <div className="my-12 rounded-lg border border-[#151515]/10 bg-[#f8f8f8] p-6 md:my-16 md:p-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#757575]">
          {label}
        </p>
        {heading && (
          <h2 className="mt-2 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="mt-4 space-y-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {children}
        </div>
      </div>
    </SectionReveal>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/content/case-studies.ts src/components/case-study/
git commit -m "feat: extend content model with new section types and core components"
```

---

## Task 2: Build diagram and sequence components

**Files:**
- Create: `src/components/case-study/DiagramSection.tsx`
- Create: `src/components/case-study/ComparisonSection.tsx`
- Create: `src/components/case-study/SequenceSection.tsx`

**Interfaces:**
- Consumes: `DiagramData`, `diagramType`, `comparisonItems`, `sequenceItems` from ContentSection
- Produces: Renders all five diagram types, comparison layouts, and sequence strips

- [ ] **Step 1: Build DiagramSection component**

Create `src/components/case-study/DiagramSection.tsx` — a multi-purpose diagram renderer that switches on `diagramType`. Each diagram is built in accessible HTML/CSS.

The component handles:
1. `problem` — two-column with centre connector (responsive: stacks on mobile)
2. `evolution` — horizontal timeline with 3 stages and arrows
3. `ecosystem` — three cards connected by lines (responsive: stacks on mobile)
4. `change-framework` — three-column table with header row (responsive: stacked cards on mobile)
5. `team-workflow` — six-step horizontal flow with arrows (responsive: wraps on mobile)

Key implementation details:
- Each diagram type is its own internal sub-component for clarity
- All built with Tailwind, no images
- Semantic HTML: `<dl>`, `<figure>`, `<figcaption>`, `<table>` where appropriate
- Accessible: proper heading hierarchy, aria-labels on diagram containers
- Responsive: mobile-first, horizontal-to-stacked transitions

- [ ] **Step 2: Build ComparisonSection component**

Create `src/components/case-study/ComparisonSection.tsx` — renders `comparisonItems` as side-by-side columns on desktop, stacked on mobile. Used for "two-sided Job Ready views" and "open vs assigned assessment" comparisons.

Key details:
- 2-column grid on desktop (`md:grid-cols-2`), stacked on mobile
- Each item gets a label header and body text
- Optional images per item
- Thin divider between columns on desktop

- [ ] **Step 3: Build SequenceSection component**

Create `src/components/case-study/SequenceSection.tsx` — renders `sequenceItems` as a numbered horizontal strip on desktop, scrollable on mobile. Used for assessment flow, talent journey, employer journey, external flows.

Key details:
- Horizontal scroll on mobile (`overflow-x-auto`, `snap-x snap-mandatory`)
- Equal columns on desktop (`grid-cols-N` where N = items.length, capped at 5)
- Each item: step number, label, optional image, optional description
- Snap points on mobile for each card
- Accessible: `role="list"`, `aria-label` on scroll container

- [ ] **Step 4: Commit**

```bash
git add src/components/case-study/
git commit -m "feat: add diagram, comparison, and sequence section components"
```

---

## Task 3: Populate Credlane content and wire CaseStudyLayout

**Files:**
- Modify: `src/content/case-studies.ts` (replace Credlane placeholder)
- Modify: `src/components/case-study/CaseStudyLayout.tsx` (add new section renderers)

**Interfaces:**
- Consumes: All components from Tasks 1-2
- Produces: Full Credlane case study entry with all 19 sections

- [ ] **Step 1: Replace the Credlane placeholder in case-studies.ts**

Replace the existing `credlane` export with the full content from `credline-case-study.md`. Map each section to the correct ContentSection type:

1. Hero media → `{ type: "hero-media", ... }`
2. Project snapshot → `{ type: "snapshot", meta: {...} }`
3. My role → `{ type: "text", body: "..." }` + `{ type: "full-image", ... }`
4. The problem → `{ type: "text", body: "..." }` + `{ type: "diagram", diagramType: "problem", ... }`
5. Original concept → `{ type: "text", body: "..." }`
6. From education to hiring → `{ type: "text", body: "..." }` + `{ type: "diagram", diagramType: "evolution", ... }`
7. Product ecosystem → `{ type: "text", body: "..." }` + `{ type: "diagram", diagramType: "ecosystem", ... }`
8. Research → `{ type: "text", body: "..." }` + `{ type: "full-image", ... }`
9. Defining readiness → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }`
10. Job Ready status → `{ type: "text", body: "..." }` + `{ type: "comparison", ... }`
11. Employability Score → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }`
12. Assessment experience → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }`
13. Open vs assigned → `{ type: "text", body: "..." }` + `{ type: "comparison", ... }`
14. Talent experience → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }`
15. Employer experience → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }` + `{ type: "full-image", ... }`
16. External assessments → `{ type: "text", body: "..." }` + `{ type: "sequence", ... }` × 2
17. External results → `{ type: "text", body: "..." }` + `{ type: "image-pair", ... }`
18. Open-ended assessments → `{ type: "future-state", ... }`
19. Changing requirements → `{ type: "text", body: "..." }` + `{ type: "diagram", diagramType: "change-framework", ... }`
20. Team coordination → `{ type: "text", body: "..." }` + `{ type: "diagram", diagramType: "team-workflow", ... }`
21. Design system → `{ type: "text", body: "..." }` + `{ type: "full-image", ... }`
22. Testing → `{ type: "text", body: "..." }` + `{ type: "full-image", ... }`
23. Outcome → `{ type: "text", body: "..." }` + `{ type: "full-image", ... }`
24. What I learned → multiple `{ type: "text", ... }` sections
25. What I would improve → multiple `{ type: "text", ... }` sections

All image `src` fields use placeholder paths like `/images/case-studies/credlane-hero.webp`.

- [ ] **Step 2: Update CaseStudyLayout.tsx to render new section types**

Add render cases for the new ContentSection types:

```typescript
case "hero-media":
  return <HeroMedia key={index} src={section.heroMediaSrc!} alt={section.heroMediaAlt!} />;
case "snapshot":
  return <ReadingColumn key={index}><ProjectSnapshot meta={caseStudy.meta!} /></ReadingColumn>;
case "diagram":
  return <ReadingColumn key={index}><DiagramSection diagramType={section.diagramType!} data={section.diagramData!} heading={section.heading} /></ReadingColumn>;
case "comparison":
  return <ReadingColumn key={index}><ComparisonSection heading={section.heading} items={section.comparisonItems || []} /></ReadingColumn>;
case "sequence":
  return <ReadingColumn key={index}><SequenceSection heading={section.heading} items={section.sequenceItems || []} /></ReadingColumn>;
case "future-state":
  return <ReadingColumn key={index}><EditorialCard label="Future consideration" heading={section.heading}>{section.futureStateData?.map((item, i) => <p key={i}>{item.description}</p>)}</EditorialCard></ReadingColumn>;
```

Also update `renderSection` to pass `caseStudy` through so `snapshot` can access `meta`.

- [ ] **Step 3: Update the hero section rendering**

Replace the current `CinematicImage` cover rendering with:

```typescript
{/* Hero media */}
{caseStudy.heroMedia && (
  <HeroMedia src={caseStudy.heroMedia.src} alt={caseStudy.heroMedia.alt} />
)}
```

Remove the old cover image block.

- [ ] **Step 4: Commit**

```bash
git add src/content/case-studies.ts src/components/case-study/CaseStudyLayout.tsx
git commit -m "feat: populate Credlane case study content and wire layout rendering"
```

---

## Task 4: Add SectionDivider placement and polish responsive behaviour

**Files:**
- Modify: `src/components/case-study/CaseStudyLayout.tsx`
- Modify: `src/components/case-study/SequenceSection.tsx` (responsive polish)
- Modify: `src/components/case-study/DiagramSection.tsx` (responsive polish)

**Interfaces:**
- Consumes: SectionDivider from Task 1
- Produces: Polished responsive behaviour across all new components

- [ ] **Step 1: Add SectionDivider between major narrative sections**

In `CaseStudyLayout.tsx`, insert `<SectionDivider />` between major story beats:
- After the role section
- After the problem section
- After the product evolution section
- After the ecosystem section
- After the research section
- After the assessment experience section
- After the talent journey section
- After the employer journey section
- After the external assessment section
- After the design system section
- Before the outcome section

Use a helper function to identify divider placement indices.

- [ ] **Step 2: Polish SequenceSection responsive behaviour**

- Mobile: horizontal scroll with snap, each card min-w-[280px]
- Tablet: 2-column grid
- Desktop: N-column grid (capped at 5)
- Each card: step number circle, label, image (if any), description
- Images in sequence cards use `object-contain` and fixed aspect ratio

- [ ] **Step 3: Polish DiagramSection responsive behaviour**

- Problem diagram: 2-column → stacked with centre connector becoming vertical
- Evolution timeline: horizontal with arrows → vertical with line on mobile
- Ecosystem: 3 cards in row → stacked with connecting lines removed
- Change framework: 3-column table → stacked cards with field labels
- Team workflow: 6-step horizontal → 2×3 grid on tablet, stacked on mobile

- [ ] **Step 4: Verify and commit**

```bash
npx next build 2>&1 | tail -20
git add src/components/case-study/
git commit -m "feat: polish Credlane case study responsive behaviour and section dividers"
```

---

## Task 5: Final build verification and navigation links

**Files:**
- Modify: `src/content/case-studies.ts` (verify nav links)
- Modify: `src/content/projects.ts` (verify Credlane slug and description)

**Interfaces:**
- Consumes: Everything from Tasks 1-4
- Produces: Clean build, working navigation, correct metadata

- [ ] **Step 1: Verify Credlane navigation chain**

Ensure `credlane.prevSlug` and `credlane.nextSlug` match the project order:
- prevSlug: `null` (Credlane is first)
- nextSlug: `"todo-app"`

Also update `todoApp.prevSlug` from `null` to `"credlane"`.

- [ ] **Step 2: Verify projects.ts Credlane entry**

Ensure the Credlane project entry has correct metadata matching the content doc:
```typescript
{
  slug: "credlane",
  title: "Credlane",
  category: "Fintech",
  hook: "Making credit accessible through better design.",
  description: "I led the design of Credlane, a responsive talent-assessment and hiring platform connecting job readiness, employer discovery, custom assessments, and candidate evaluation.",
  coverSrc: "/images/case-studies/credlane-cover.webp",
  status: "published",
  device: "laptop",
}
```

- [ ] **Step 3: Update metadata generation**

In `src/app/featured-case-studies/[slug]/page.tsx`, update `generateMetadata` to use the content doc's SEO description for Credlane:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const caseStudy = getCaseStudy(slug);
  if (!project) return {};
  return {
    title: caseStudy?.title || project.title,
    description: slug === "credlane"
      ? "I led the design of Credlane, a responsive talent-assessment and hiring platform connecting job readiness, employer discovery, custom assessments, and candidate evaluation."
      : project.description,
  };
}
```

- [ ] **Step 4: Build verification**

```bash
npx next build
```

Verify:
- Build succeeds with no errors
- `/featured-case-studies/credlane` renders without errors
- Navigation to and from Credlane works
- All section types render correctly

- [ ] **Step 5: Commit**

```bash
git add src/content/case-studies.ts src/content/projects.ts src/app/featured-case-studies/
git commit -m "feat: finalise Credlane case study with nav links and metadata"
```
