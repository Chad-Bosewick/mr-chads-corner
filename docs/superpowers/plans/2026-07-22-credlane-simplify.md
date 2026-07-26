# Credlane Case Study Simplification Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Credlane case study from 53 sections to ~12 scannable sections with in-page navigation, executive summary, bold lead phrases, and clear outcome framing — so a recruiter gets the full story in 5 seconds, 30 seconds, or 2 minutes.

**Architecture:** Add 2 new components (ExecutiveSummary, CaseStudyNav), condense the content array, update CaseStudyLayout to render them, and recalibrate image export specs.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS v4, motion (framer-motion)

## Global Constraints

- Preserve existing design system tokens and spacing
- Reuse existing components (ContentSection, ImagePair, MetricBar, SectionDivider, DiagramSection, SequenceSection, ComparisonSection, EditorialCard, HeroMedia, ProjectSnapshot)
- Long-form text: 640–760px (ReadingColumn)
- Wide media: 1120–1360px
- Respect prefers-reduced-motion
- All image paths remain the same (no filename changes)

## Content Architecture (Target: 12–15 sections)

| # | Section | Type | Content |
|---|---|---|---|
| 1 | Header + Overview | existing | Title, role, one-line summary |
| 2 | Hero media | hero-media | Composite image |
| 3 | Project snapshot | snapshot | Metadata table |
| 4 | Executive summary | NEW | 3 bold-lead bullets: Problem → Solution → Outcome |
| 5 | What I designed | NEW | 4 feature cards (talent, employer, assessments, external) |
| 6 | The problem | text + diagram | Concise problem statement + problem diagram |
| 7 | Product evolution | text + diagram | Short evolution narrative + timeline diagram |
| 8 | Product ecosystem | text + diagram | Three-role map |
| 9 | Research and definition | text + image | Pattern research + collage image |
| 10 | The assessment system | text + comparison + sequence | Job Ready, Employability Score, assessment flow merged |
| 11 | Talent experience | text + sequence | Onboarding → dashboard → jobs → offers |
| 12 | Employer experience | text + sequence + image | Role creation → discovery → pipeline + annotated review |
| 13 | External assessments | text + sequence × 2 | Employer creation + applicant journey |
| 14 | Leading through change | text + diagram | Change framework + team workflow |
| 15 | Design system | text + image | Component sheet |
| 16 | Results | NEW | 4 bold-lead outcome bullets |
| 17 | Constraints | NEW | 3 bold-lead constraint bullets |
| 18 | Key decisions | NEW | 3 bold-lead decision bullets |
| 19 | Reflection | text | What I learned (condensed) |

---

## Task 1: Build ExecutiveSummary and CaseStudyNav components

**Files:**
- Create: `src/components/case-study/ExecutiveSummary.tsx`
- Create: `src/components/case-study/CaseStudyNav.tsx`

**Interfaces:**
- Produces: `ExecutiveSummary` — 3 bold-lead bullet points (problem, solution, outcome)
- Produces: `CaseStudyNav` — horizontal jump-link bar with anchor targets

- [ ] **Step 1: Build ExecutiveSummary**

Create `src/components/case-study/ExecutiveSummary.tsx`:

```typescript
import { SectionReveal } from "@/components/sections/SectionReveal";

interface ExecutiveSummaryProps {
  problem: string;
  solution: string;
  outcome: string;
}

export function ExecutiveSummary({ problem, solution, outcome }: ExecutiveSummaryProps) {
  const items = [
    { label: "Problem", text: problem },
    { label: "Solution", text: solution },
    { label: "Outcome", text: outcome },
  ];

  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        <div className="space-y-4">
          {items.map((item) => (
            <p key={item.label} className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              <strong className="font-medium text-[#151515]">{item.label}.</strong>{" "}
              {item.text}
            </p>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
```

- [ ] **Step 2: Build CaseStudyNav**

Create `src/components/case-study/CaseStudyNav.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  id: string;
}

interface CaseStudyNavProps {
  items: NavItem[];
}

export function CaseStudyNav({ items }: CaseStudyNavProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-0 z-30 border-b border-[#151515]/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] gap-6 overflow-x-auto px-5 py-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-[var(--duration-fast)]",
              activeId === item.id
                ? "text-[#A43718]"
                : "text-[#757575] hover:text-[#151515]"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/case-study/ExecutiveSummary.tsx src/components/case-study/CaseStudyNav.tsx
git commit -m "feat: add ExecutiveSummary and CaseStudyNav components"
```

---

## Task 2: Condense Credlane content and add new sections

**Files:**
- Modify: `src/content/case-studies.ts` (replace Credlane sections array)

**Interfaces:**
- Consumes: All existing component types
- Produces: Condensed sections array (~19 sections instead of 53)

- [ ] **Step 1: Rewrite the Credlane sections array**

Replace the entire `sections` array in the `credlane` export. The new structure uses the target architecture from the plan header. Key changes:

- Add `type: "executive-summary"` section with problem/solution/outcome strings
- Add `type: "what-i-designed"` section with 4 feature cards
- Add `type: "results"` section with 4 outcome bullets
- Add `type: "constraints"` section with 3 constraint bullets
- Add `type: "key-decisions"` section with 3 decision bullets
- Merge redundant sections (e.g., assessment progression + employability score + assessment flow → one combined section)
- Condense text sections to 1–3 paragraphs max
- Add bold lead phrases to all body text (prefix first sentence with `<strong>`)
- Remove redundant diagram sections (keep problem, evolution, ecosystem; merge change-framework and team-workflow)
- Keep image paths unchanged

New section types to add to the ContentSection interface:

```typescript
// In case-studies.ts, extend ContentSection:
| "executive-summary"
| "what-i-designed"
| "results"
| "constraints"
| "key-decisions"

// New fields on ContentSection:
executiveSummary?: { problem: string; solution: string; outcome: string };
designedFeatures?: { name: string; description: string }[];
outcomeBullets?: { label: string; description: string }[];
```

- [ ] **Step 2: Condense text with bold lead phrases**

Every text section's body should follow the pattern:
```
<strong>Bold label.</strong> Rest of the sentence that elaborates on the bold claim.
```

This creates scan points throughout the page. The bold label is 2–5 words that capture the paragraph's essence.

Example transformation:

**Before:**
> Hiring decisions are often based on CVs, self-reported skills, and short interviews. These methods provide useful context, but they do not always offer dependable evidence of what a candidate can do.

**After:**
> **Hiring lacks evidence.** CVs and short interviews provide context, but not dependable proof of what a candidate can do.

- [ ] **Step 3: Commit**

```bash
git add src/content/case-studies.ts
git commit -m "feat: condense Credlane content to scannable structure with bold lead phrases"
```

---

## Task 3: Update CaseStudyLayout to render new section types

**Files:**
- Modify: `src/components/case-study/CaseStudyLayout.tsx`

**Interfaces:**
- Consumes: ExecutiveSummary, CaseStudyNav from Task 1
- Consumes: New section types from Task 2
- Produces: Updated layout with nav, executive summary, and new render cases

- [ ] **Step 1: Add CaseStudyNav rendering**

After the header, render the CaseStudyNav with anchor IDs for each major section:

```typescript
const navItems = [
  { label: "Overview", id: "overview" },
  { label: "Problem", id: "problem" },
  { label: "What I designed", id: "what-i-designed" },
  { label: "Assessment system", id: "assessment-system" },
  { label: "Talent", id: "talent-experience" },
  { label: "Employer", id: "employer-experience" },
  { label: "External", id: "external-assessments" },
  { label: "Results", id: "results" },
  { label: "Decisions", id: "key-decisions" },
];
```

- [ ] **Step 2: Add render cases for new section types**

```typescript
case "executive-summary":
  return (
    <ReadingColumn key={index}>
      <ExecutiveSummary
        problem={section.executiveSummary?.problem ?? ""}
        solution={section.executiveSummary?.solution ?? ""}
        outcome={section.executiveSummary?.outcome ?? ""}
      />
    </ReadingColumn>
  );

case "what-i-designed":
  return (
    <ReadingColumn key={index}>
      <WhatIDesigned features={section.designedFeatures || []} heading={section.heading} />
    </ReadingColumn>
  );

case "results":
  return (
    <ReadingColumn key={index}>
      <OutcomeList items={section.outcomeBullets || []} heading={section.heading} />
    </ReadingColumn>
  );

case "constraints":
  return (
    <ReadingColumn key={index}>
      <OutcomeList items={section.outcomeBullets || []} heading={section.heading} />
    </ReadingColumn>
  );

case "key-decisions":
  return (
    <ReadingColumn key={index}>
      <OutcomeList items={section.outcomeBullets || []} heading={section.heading} />
    </ReadingColumn>
  );
```

- [ ] **Step 3: Build WhatIDesigned and OutcomeList inline components**

Add these as internal components within CaseStudyLayout.tsx (they're small and layout-specific):

```typescript
function WhatIDesigned({ features, heading }: { features: { name: string; description: string }[]; heading?: string }) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16" id="what-i-designed">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.name}>
              <h3 className="font-sans text-sm font-medium text-[#151515]">{f.name}</h3>
              <p className="mt-1 font-sans text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-[#151515]/70">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}

function OutcomeList({ items, heading }: { items: { label: string; description: string }[]; heading?: string }) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.label} className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              <strong className="font-medium text-[#151515]">{item.label}.</strong>{" "}
              {item.description}
            </li>
          ))}
        </ul>
      </section>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Add section IDs to existing render cases**

Add `id` attributes to major section wrappers so the nav anchors work:

```typescript
// For text sections with headings that match nav targets:
case "text":
  const sectionId = section.heading?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return (
    <ReadingColumn key={index}>
      <ContentSection heading={section.heading}>
        <div id={sectionId}>
          {section.body?.split("\n").map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </ContentSection>
    </ReadingColumn>
  );
```

Note: Since body text now contains `<strong>` tags for bold lead phrases, we need to render it as HTML. Switch from `{p}` to `dangerouslySetInnerHTML`.

- [ ] **Step 5: Commit**

```bash
git add src/components/case-study/CaseStudyLayout.tsx
git commit -m "feat: update CaseStudyLayout with nav, executive summary, and new section renderers"
```

---

## Task 4: Update content model types and verify build

**Files:**
- Modify: `src/content/case-studies.ts` (add new ContentSection fields)
- Modify: `credline-image-export-spec.md` (recalibrate for condensed structure)

**Interfaces:**
- Consumes: Everything from Tasks 1-3
- Produces: Clean TypeScript, working build, updated image specs

- [ ] **Step 1: Extend ContentSection type**

Add the new section types and fields:

```typescript
export interface ContentSection {
  type: "text" | "image-pair" | "metrics" | "full-image" | "hero-media" | "snapshot" | "diagram" | "comparison" | "sequence" | "future-state" | "executive-summary" | "what-i-designed" | "results" | "constraints" | "key-decisions";
  heading?: string;
  body?: string;
  images?: { src: string; alt: string; caption?: string }[];
  metrics?: { label: string; value: string }[];
  diagramType?: "problem" | "evolution" | "ecosystem" | "change-framework" | "team-workflow";
  diagramData?: DiagramData;
  comparisonItems?: { label: string; content: string }[];
  sequenceItems?: { step: number; label: string; description?: string; src?: string; alt?: string }[];
  futureStateData?: { label: string; description: string }[];
  // NEW fields
  executiveSummary?: { problem: string; solution: string; outcome: string };
  designedFeatures?: { name: string; description: string }[];
  outcomeBullets?: { label: string; description: string }[];
}
```

- [ ] **Step 2: Recalibrate image export specs**

Update `credline-image-export-spec.md` to reflect the condensed structure. Remove images that are no longer needed (merged sections). The key images that remain:

1. Hero composite (unchanged)
2. Figma overview (unchanged)
3. Research collage (unchanged)
4. Problem diagram (now HTML/CSS, no image needed)
5. Evolution timeline (now HTML/CSS, no image needed)
6. Ecosystem map (now HTML/CSS, no image needed)
7. Assessment comparison (merged — one image instead of separate ones)
8. Talent journey sequence (one composite image)
9. Employer journey sequence (one composite image)
10. Annotated candidate review (unchanged)
11. External creation flow (one composite image)
12. External applicant flow (one composite image)
13. Results dashboard (unchanged)
14. Design system sheet (unchanged)
15. Final montage (unchanged)

Removed: separate Job Ready two-sided, separate Employability Score sequence, separate assessment models, separate assessment flow, change framework diagram (now HTML/CSS), team workflow diagram (now HTML/CSS).

- [ ] **Step 3: Verify TypeScript and build**

```bash
npx tsc --noEmit
npx next build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add src/content/case-studies.ts credline-image-export-spec.md
git commit -m "feat: extend content model types and recalibrate image export specs"
```
