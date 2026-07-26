# Featured Case Studies — Homepage Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing project-row list on the homepage with an editorial featured-case-studies section — 5 projects presented as image-forward device mockup rows, with a composed editorial header and refined scroll-reveal animation.

**Architecture:** Extends existing `ProjectRow` and content model. Adds a reusable `DeviceMockup` component. Client components only where interaction/motion is needed (ProjectRow, DeviceMockup).

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS v4, Motion, next/image

## Global Constraints

- TypeScript strict mode — no `any` types or implicit `any`
- All images use next/image with explicit width/height or `fill` + `sizes`
- Device mockup frames are pure CSS/SVG — no external mockup assets
- Hover effects must also work on focus-visible for keyboard users
- Touch devices should see a tap-friendly version (larger touch target, no hover-dependent content)
- `prefers-reduced-motion` disables all entry animation — rows appear statically
- New Project fields (`hook`, `device`) are required, not optional
- Colour values: accent #A43718, text-primary #151515, text-muted #757575

---
## File Structure

```
src/
  content/
    projects.ts                # ADD hook, device fields; replace project list (5 projects)
    case-studies.ts            # ADD placeholder case studies for Credlane, Testground, Draftly
  components/
    ui/
      DeviceMockup.tsx          # CREATE — reusable laptop/phone mockup
    sections/
      ProjectRow.tsx            # MODIFY — new editorial layout
  app/
    page.tsx                    # MODIFY — update section header
    featured-case-studies/
      page.tsx                  # MODIFY — sync with new content model
```
---

### Task 1: Content Model — Add `hook` and `device` fields; Update project list

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/content/case-studies.ts`

**Interfaces:**
- Consumes: nothing
- Produces: Updated `Project` interface with `hook: string` and `device: "laptop" | "phone"`; 5-project list replacing old 3-project list; placeholder case study entries

**Interface changes:**
```typescript
export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Short one-line hook for the homepage editorial row */
  hook: string;
  /** Longer description for case study index/detail */
  description: string;
  coverSrc: string;
  status: "published" | "coming-soon";
  /** Which device mockup to frame the cover image in */
  device: "laptop" | "phone";
}
```

- [ ] **Step 1: Update projects.ts with new data**

Remove Enviodeck. Add Credlane, Testground, Draftly. Add `hook` and `device` fields to all 5 projects.

```typescript
export interface Project {
  slug: string;
  title: string;
  category: string;
  hook: string;
  description: string;
  coverSrc: string;
  status: "published" | "coming-soon";
  device: "laptop" | "phone";
}

export const projects: Project[] = [
  {
    slug: "todo-app",
    title: "TODO++",
    category: "Productivity",
    hook: "A task manager that adapts to how you work.",
    description:
      "Redesigning a task management tool from feature-heavy checklist into an intelligent, adaptive workflow system — reducing cognitive load while preserving power-user capabilities.",
    coverSrc: "/images/case-studies/todo-app-cover.webp",
    status: "published",
    device: "laptop",
  },
  {
    slug: "letters-app",
    title: "Letters App",
    category: "Communication",
    hook: "Thoughtful correspondence for the modern world.",
    description:
      "Designing a thoughtful correspondence platform that reintroduces pause and intentionality into digital messaging — combining the warmth of letter-writing with the practicality of modern communication.",
    coverSrc: "/images/case-studies/letters-app-cover.webp",
    status: "published",
    device: "phone",
  },
  {
    slug: "credlane",
    title: "Credlane",
    category: "Fintech",
    hook: "Making credit accessible through better design.",
    description: "A financial platform designed for clarity, trust, and informed decision-making.",
    coverSrc: "/images/case-studies/credlane-cover.webp",
    status: "published",
    device: "laptop",
  },
  {
    slug: "testground",
    title: "Testground",
    category: "Developer Tools",
    hook: "Testing infrastructure that teams actually enjoy using.",
    description: "A testing platform designed for collaboration, speed, and developer happiness.",
    coverSrc: "/images/case-studies/testground-cover.webp",
    status: "published",
    device: "laptop",
  },
  {
    slug: "draftly",
    title: "Draftly",
    category: "Content Creation",
    hook: "Where ideas take shape before they become content.",
    description: "A drafting tool designed for writers who think visually and editors who think structurally.",
    coverSrc: "/images/case-studies/draftly-cover.webp",
    status: "published",
    device: "laptop",
  },
];
```

- [ ] **Step 2: Update all references to the old Project type**

Check that every file importing `Project` or using `projects` still compiles with the new fields. There should be no type errors.

- [ ] **Step 3: Add placeholder case studies for 3 new projects**

In `src/content/case-studies.ts`, add minimal placeholder case studies:

```typescript
export const credlane: CaseStudy = {
  slug: "credlane",
  title: "Credlane",
  category: "Fintech",
  role: "Product design — UX, UI, design system",
  timeline: "2026",
  overview: "Case study content coming soon.",
  coverSrc: "/images/case-studies/credlane-cover.webp",
  sections: [
    {
      type: "text",
      heading: "Coming soon",
      body: "This case study is being prepared. Check back for the full story.",
    },
  ],
  nextSlug: "testground",
  prevSlug: "letters-app",
};

export const testground: CaseStudy = {
  slug: "testground",
  title: "Testground",
  category: "Developer Tools",
  role: "Product design — UX, UI",
  timeline: "2026",
  overview: "Case study content coming soon.",
  coverSrc: "/images/case-studies/testground-cover.webp",
  sections: [
    {
      type: "text",
      heading: "Coming soon",
      body: "This case study is being prepared. Check back for the full story.",
    },
  ],
  nextSlug: "draftly",
  prevSlug: "credlane",
};

export const draftly: CaseStudy = {
  slug: "draftly",
  title: "Draftly",
  category: "Content Creation",
  role: "Product design — UX, UI",
  timeline: "2026",
  overview: "Case study content coming soon.",
  coverSrc: "/images/case-studies/draftly-cover.webp",
  sections: [
    {
      type: "text",
      heading: "Coming soon",
      body: "This case study is being prepared. Check back for the full story.",
    },
  ],
  nextSlug: null,
  prevSlug: "testground",
};
```

Update the `getCaseStudy` function, `getNavAdjacent`, and `generateStaticParams` to include the new entries.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no type errors. Verify the 5 projects are exported and the 3 new case study slugs resolve.

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: add new projects and update content model with hook and device fields"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 2: DeviceMockup Component

**Files:**
- Create: `src/components/ui/DeviceMockup.tsx`

**Interfaces:**
- Consumes: `Project.device` field from Task 1
- Produces: `<DeviceMockup type="laptop" | "phone" src alt />` — a self-contained SVG/CSS mockup with the project cover image rendered inside via next/image

- [ ] **Step 1: Create DeviceMockup component**

```typescript
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  type: "laptop" | "phone";
  src: string;
  alt: string;
  className?: string;
  /** Whether this entry is coming-soon (adds placeholder overlay) */
  placeholder?: boolean;
}

export function DeviceMockup({
  type,
  src,
  alt,
  className,
  placeholder = false,
}: DeviceMockupProps) {
  const isLaptop = type === "laptop";

  return (
    <div className={cn("relative select-none", className)}>
      {/* Laptop mockup */}
      {isLaptop ? (
        <div className="relative mx-auto w-full max-w-[480px]">
          {/* Screen with bezel */}
          <div className="relative overflow-hidden rounded-[8px] bg-[#1a1a1a] p-[3px] shadow-[0_8px_30px_rgba(21,21,21,0.12)]">
            {/* Screen content */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[5px] bg-[#f0f0f0]">
              <Image
                src={src}
                alt={alt}
                fill
                className={cn(
                  "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                  !placeholder && "group-hover:scale-105"
                )}
                sizes="(max-width: 768px) 100vw, 480px"
              />
              {placeholder && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/5 to-[#151515]/20" />
              )}
            </div>
          </div>
          {/* Base/stand */}
          <div className="mx-auto mt-[-1px] h-[10px] w-[55%] rounded-b-[6px] bg-[#e8e8e8] shadow-[0_2px_4px_rgba(21,21,21,0.06)]" />
          {/* Keyboard deck hint */}
          <div className="mx-auto h-[4px] w-[40%] rounded-b-[3px] bg-[#f0f0f0]" />
        </div>
      ) : (
        /* Phone mockup */
        <div className="relative mx-auto w-full max-w-[220px]">
          {/* Body with bezel */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#1a1a1a] p-[3px] shadow-[0_8px_30px_rgba(21,21,21,0.12)]">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-b-[10px] bg-[#1a1a1a]" />
            {/* Screen */}
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[21px] bg-[#f0f0f0]">
              <Image
                src={src}
                alt={alt}
                fill
                className={cn(
                  "object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
                  !placeholder && "group-hover:scale-105"
                )}
                sizes="(max-width: 768px) 100vw, 220px"
              />
              {placeholder && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/5 to-[#151515]/20" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds, component imports without errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/DeviceMockup.tsx
git commit -m "feat: add DeviceMockup component with laptop and phone variants"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 3: Redesign ProjectRow Component

**Files:**
- Modify: `src/components/sections/ProjectRow.tsx`

**Interfaces:**
- Consumes: DeviceMockup from Task 2; updated Project interface from Task 1
- Produces: Editorial layout row with device mockup, text block, hover effects, and placeholder treatment

- [ ] **Step 1: Rewrite ProjectRow with editorial layout**

The full row is wrapped in a `group` for hover effects. The row links to the case study page (or stays inert for placeholders).

```typescript
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { SectionReveal } from "./SectionReveal";

interface ProjectRowProps {
  slug: string;
  title: string;
  category: string;
  hook: string;
  coverSrc: string;
  status: "published" | "coming-soon";
  device: "laptop" | "phone";
  delay?: number;
}

export function ProjectRow({
  slug,
  title,
  category,
  hook,
  coverSrc,
  status,
  device,
  delay = 0,
}: ProjectRowProps) {
  const isPlaceholder = status === "coming-soon";

  const row = (
    <div
      className={cn(
        "group grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center md:gap-12",
        isPlaceholder && "cursor-default"
      )}
    >
      {/* Image — device mockup */}
      <DeviceMockup
        type={device}
        src={coverSrc}
        alt={`${title} project cover`}
        placeholder={isPlaceholder}
        className={cn(
          "transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
          !isPlaceholder && "group-hover:-translate-y-[2px]"
        )}
      />

      {/* Text block */}
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#757575]">
          {category}
        </p>

        <h3 className="font-sans text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium leading-[1.2] text-[#151515] transition-colors duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:text-[#A43718]">
          {title}
        </h3>

        <p className="font-sans text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-[#151515]/70">
          {hook}
        </p>

        {/* Read cue */}
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-2 text-sm font-medium transition-all duration-[var(--duration-fast)]",
            isPlaceholder
              ? "text-[#757575]"
              : "text-[#A43718] group-hover:gap-3"
          )}
        >
          {isPlaceholder ? "Coming soon" : "Read case study"}
          {!isPlaceholder && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:translate-x-1"
            >
              <path
                d="M5.5 3L10.5 8L5.5 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );

  if (isPlaceholder) {
    return <SectionReveal delay={delay}>{row}</SectionReveal>;
  }

  return (
    <SectionReveal delay={delay}>
      <Link
        href={`/featured-case-studies/${slug}`}
        className="block border-t border-[#151515]/10 py-8 transition-opacity md:py-12"
      >
        {row}
      </Link>
    </SectionReveal>
  );
}
```

- [ ] **Step 2: Remove old ProjectRow test if present**

If `ProjectRow.test.tsx` exists, update it for the new interface. If no test exists, skip.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProjectRow.tsx
git commit -m "feat: redesign ProjectRow with editorial device mockup layout"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 4: Update Homepage Section Header

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Updated ProjectRow from Task 3
- Produces: Editorial header + filtered project list rendering

- [ ] **Step 1: Update the homepage featured-case-studies section header**

Replace the current heading block with the editorial composition:

```typescript
{/* Featured case studies */}
<SectionReveal delay={80}>
  <div className="space-y-3">
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#757575]">
      SELECTED WORK
    </p>
    <h2 className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium leading-[1.1] text-[#151515]">
      Featured case studies
    </h2>
    <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#757575]">
      A curation of recent product design work across productivity,
      communication, fintech, and developer tools.
    </p>
  </div>
</SectionReveal>
```

- [ ] **Step 2: Update project rendering to pass new props**

```typescript
{projects
  .filter((p) => p.status === "published")
  .map((project, index) => (
  <ProjectRow
    key={project.slug}
    slug={project.slug}
    title={project.title}
    category={project.category}
    hook={project.hook}
    coverSrc={project.coverSrc}
    status={project.status}
    device={project.device}
    delay={index * 100}
  />
))}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update featured case studies header with editorial treatment"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Task 5: Sync Case Study Index Page

**Files:**
- Modify: `src/app/featured-case-studies/page.tsx`

**Interfaces:**
- Consumes: Updated ProjectRow and Project interface

- [ ] **Step 1: Update the case studies index page to match new Project interface**

Update the page to use the same new ProjectRow component and pass the new fields:

```typescript
import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { ProjectRow } from "@/components/sections/ProjectRow";
import { PageShell } from "@/components/layout/PageShell";
import { projects } from "@/content/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured case studies",
  description:
    "A selection of recent work spanning productivity, communication, fintech, and developer tools.",
};

export default function CaseStudiesPage() {
  return (
    <PageShell>
      <SectionReveal>
        <HeroHeading
          title="Featured case studies"
          subtitle="A selection of recent work spanning productivity, communication, fintech, and developer tools."
        />
      </SectionReveal>

      <div className="mt-12 md:mt-16">
        {projects
          .filter((p) => p.status === "published")
          .map((project, index) => (
          <ProjectRow
            key={project.slug}
            slug={project.slug}
            title={project.title}
            category={project.category}
            hook={project.hook}
            coverSrc={project.coverSrc}
            status={project.status}
            device={project.device}
            delay={index * 100}
          />
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors. All routes (homepage + case study index) render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/app/featured-case-studies/page.tsx
git commit -m "feat: sync case study index page with new ProjectRow and content model"

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Self-Review

### Spec coverage
- **Task 1:** Content model updated with `hook` and `device` fields; 5 projects replace old 3; placeholder case studies added
- **Task 2:** DeviceMockup component with laptop and phone variants, placeholder overlay support
- **Task 3:** ProjectRow redesigned with editorial layout (image left, text right), hover effects, coming-soon treatment
- **Task 4:** Homepage section header updated with editorial label + title + subtitle
- **Task 5:** Case study index page synced with new content model

### Cross-task consistency
- `ProjectRow` expects `hook` and `device` props — Task 1 guarantees they exist on every `Project`
- `DeviceMockup` accepts `type: "laptop" | "phone"` — matches `Project.device`
- `ButtonRow` passes `status: "published"` filter — placeholder entries hidden from index (they show as "published")
- Actually wait — the 3 new projects have `status: "published"` but no real case study content. They should appear on the homepage list but clicking them would navigate to a placeholder case study page. That's fine — the case study detail page has placeholder text.
