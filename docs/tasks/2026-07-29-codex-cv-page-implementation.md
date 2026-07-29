# Codex Task: CV/Resume Page Implementation

## ID: CV-PAGE-001
## Type: New feature — page rewrite
## Priority: P1
## Dependencies: None (foundations branch)
## Design reference: `docs/superpowers/specs/2026-07-29-cv-page-design.md`

---

## Objective

Transform the existing About Temi page at `/about-temi` into a website version of Temi's resume/CV. The page should feel authored, editorial, and intentionally composed — not like a flat resume-to-web conversion.

---

## Required Reading Order

1. **`docs/PROJECT_STATE.md`** — current operational context
2. **`docs/superpowers/specs/2026-07-29-cv-page-design.md`** — full design spec
3. **`TASTE.md`** — design philosophy and anti-patterns
4. **`docs/superpowers/plans/2026-07-29-cv-page-implementation.md`** — implementation plan with code
5. This task file

---

## Scope

### In scope

- 6 sections on a single page: Executive Snapshot, Professional Summary, Experience Timeline, Skills & Tools, Education & Certifications, Interests Collage
- 4 new components: `ExecutiveSnapshot`, `ExperienceTimeline`, `SkillsGrid`, `InterestCard` + `InterestGrid`
- Stock images for the 6 interest cards, sourced from Unsplash (free for commercial use, no attribution required)
- All interaction states: default, hover, focus-visible, active/tap, reduced-motion, loading, error
- Responsive layout at 375px, 768px, and 1120px+
- Updated page metadata

### Out of scope

- The travel photos in `public/images/interests/` (christ-the-redeemer.webp, lalibela.webp, etc.) — leave on disk, they're still referenced nowhere but harmless
- Navigation changes — label stays "About Temi", route stays `/about-temi`
- Chat review of this task — Codex delivers, Claude Code orchestrates, ChatGPT QAs

---

## New Components

All go in `src/components/sections/`:

| Component | Type | Props | Notes |
|---|---|---|---|
| `ExecutiveSnapshot` | client | none | 3-column "what I do" grid. Self-contained data. Wraps `SectionReveal`. |
| `ExperienceTimeline` | client | none | Chronological roles (3 entries + design systems context). Uses `SectionReveal` per role. |
| `SkillsGrid` | client | none | 3 skill groups in responsive grid. Self-contained data. |
| `InterestCard` | client | `{ interest: InterestItem, className? }` | Full-bleed stock image + gradient + hover/tap reveal. Must handle loading, error, reduced-motion. |
| `InterestGrid` | client | `{ interests: InterestItem[] }` | Asymmetric 3-col desktop → 2-col tablet → 1-col mobile layout. Wraps in `SectionReveal`. |

Export `InterestItem` interface from `InterestCard.tsx` for use in `page.tsx`.

### InterestItem interface

```tsx
export interface InterestItem {
  category: string;
  emoji: string;
  items: string[];
  imageSrc: string;
  alt: string;
}
```

---

## Interaction States (InterestCard)

| State | Behaviour |
|---|---|
| Default | Full-bleed image visible, dark gradient overlay, category name + emoji in bottom-left |
| Hover (mouse) | Image scales to 105%, overlay deepens, detail chip fades in showing full item list |
| Focus-visible | 2px outline ring `#A43718`, +2px offset |
| Tap/click (touch) | Toggles detail chip open/closed — must persist, not dismiss on mouseout |
| Reduced motion | No scale transform. Details appear via opacity only, toggled on tap/click |
| Loading | `animate-pulse` skeleton with dark `#151515` background |
| Error (image 404) | Fallback dark card with emoji centered, category label still visible |

---

## Component Code (from implementation plan)

### ExecutiveSnapshot

```tsx
"use client";

import { SectionReveal } from "./SectionReveal";

const SNAPSHOT_ITEMS = [
  {
    label: "Systems Thinker",
    description:
      "Biochemistry background that taught me to think in systems, process, and the relationship between cause and effect — applied to information architecture, user journeys, and design-system thinking.",
  },
  {
    label: "Design System Builder",
    description:
      "Built and maintained design systems from the ground up — 40+ components across an 8-month engagement at Candidote, 50+ components at Enviodeck, each tailored to product needs and team workflows.",
  },
  {
    label: "AI-Native Operator",
    description:
      "Daily use of ChatGPT, Claude, Codex, and Perplexity to accelerate design workflows, generate production code, orchestrate multi-agent development, and design AI-assisted product experiences.",
  },
];

export function ExecutiveSnapshot() {
  return (
    <SectionReveal>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {SNAPSHOT_ITEMS.map((item) => (
          <div key={item.label}>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#A43718]">
              {item.label}
            </h2>
            <p className="mt-2 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#6F6F6F]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
```

### ExperienceTimeline

```tsx
"use client";

import { SectionReveal } from "./SectionReveal";

const EXPERIENCE = [
  {
    title: "Product Designer / Founder-Side Operator",
    company: "Candidote",
    period: "Aug 2025 — Mar 2026",
    location: "Fully remote — 3-person team",
    context:
      "Joined as the founding designer for a productivity-focused startup, owning the full product design lifecycle from research through implementation.",
    contributions: [
      "Designed 80+ screens across the core product, covering onboarding, dashboard, workspace management, and settings flows",
      "Built a 40+ component design system from scratch, establishing reusable patterns, variants, and documentation that enabled rapid iteration",
      "Worked directly alongside the founder as the sole designer — defining product strategy, prioritising roadmap items, and shipping design decisions directly to development",
    ],
  },
  {
    title: "Lead Designer / Product Operations Collaborator",
    company: "Enviodeck",
    period: "Mar 2026 — Present",
    location: "Start-up environment",
    context:
      "Leading design for a presentation platform, building the visual language and component system for a new product entering a competitive market.",
    contributions: [
      "Designed 100+ screens spanning the editor, template library, collaboration features, and export pipeline",
      "Built a 50+ component design system establishing the product's visual language, component hierarchy, and interaction patterns",
      "Collaborating on product strategy, user research synthesis, and design operations workflows",
    ],
  },
  {
    title: "Customer Experience / Digital Operations",
    company: "UBA",
    period: "Earlier role",
    location: "Lagos, Nigeria",
    context:
      "Worked within the digital operations team at one of Africa's largest banks, focusing on customer experience and digital service delivery.",
    contributions: [
      "Supported digital operations and customer experience initiatives across retail banking products",
      "Collaborated with cross-functional teams to improve digital service touchpoints",
    ],
  },
];

export function ExperienceTimeline() {
  return (
    <div className="space-y-16">
      {EXPERIENCE.map((role, i) => (
        <SectionReveal key={`${role.company}-${role.period}`} delay={i * 80}>
          <div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-sans text-lg font-semibold text-[#151515]">
                {role.title}{" "}
                <span className="text-[#A43718]">· {role.company}</span>
              </h3>
              <span className="shrink-0 font-sans text-sm text-[#6F6F6F]">
                {role.period}
              </span>
            </div>
            <p className="mt-1 font-sans text-sm text-[#6F6F6F]">{role.location}</p>
            <p className="mt-4 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/80">
              {role.context}
            </p>
            <ul className="mt-3 space-y-2">
              {role.contributions.map((c, j) => (
                <li
                  key={j}
                  className="pl-5 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70"
                  style={{ listStyleType: "disc" }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      ))}
    </div>
  );
}
```

### SkillsGrid

```tsx
"use client";

import { SectionReveal } from "./SectionReveal";

const SKILL_GROUPS = [
  {
    label: "Product Design",
    skills: [
      "UX research",
      "Information architecture",
      "Interaction design",
      "Visual design",
      "Prototyping",
      "Design systems",
    ],
  },
  {
    label: "AI Workflows",
    skills: [
      "Prompt engineering",
      "AI-assisted product design",
      "Code generation workflows",
      "Tool orchestration",
    ],
  },
  {
    label: "Tools",
    skills: [
      "Figma",
      "Framer",
      "Notion",
      "Linear",
      "ClickUp",
      "Miro",
      "Canva",
      "ChatGPT",
      "Claude",
      "Codex",
      "Perplexity",
      "Google Analytics",
      "Slack",
      "Airtable",
    ],
  },
];

export function SkillsGrid() {
  return (
    <SectionReveal>
      <div className="grid gap-8 md:grid-cols-3">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#A43718]">
              {group.label}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
```

### InterestCard

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface InterestItem {
  category: string;
  emoji: string;
  items: string[];
  imageSrc: string;
  alt: string;
}

interface InterestCardProps {
  interest: InterestItem;
  className?: string;
}

export function InterestCard({ interest, className }: InterestCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const prefersReduced = useReducedMotion();

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-[#151515] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
        !imgLoaded && !imgError && "animate-pulse",
        className,
      )}
      style={{ aspectRatio: "4/3" }}
    >
      {/* Image */}
      {!imgError && (
        <Image
          src={interest.imageSrc}
          alt={interest.alt}
          fill
          className={cn(
            "object-cover transition-[transform,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
            !prefersReduced && "group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Default state: category name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="font-sans text-base font-medium text-[#f5f2ee]">
          {interest.emoji} {interest.category}
        </span>
      </div>

      {/* Hover/focus/tap state: details */}
      <button
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute inset-0 flex cursor-pointer items-end p-4 text-left",
          "opacity-0 transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-out)]",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          isOpen && "opacity-100",
        )}
        aria-expanded={isOpen}
        aria-label={`${interest.category}: ${interest.items.join(", ")}`}
      >
        <div className="w-full rounded bg-black/60 p-3 backdrop-blur-sm">
          <p className="font-sans text-sm font-medium text-[#f5f2ee]">
            {interest.emoji} {interest.items.join(" · ")}
          </p>
        </div>
      </button>

      {/* Error fallback */}
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-sans text-4xl">{interest.emoji}</span>
        </div>
      )}
    </div>
  );
}
```

### InterestGrid

```tsx
"use client";

import { SectionReveal } from "./SectionReveal";
import { InterestCard, type InterestItem } from "./InterestCard";

interface InterestGridProps {
  interests: InterestItem[];
}

export function InterestGrid({ interests }: InterestGridProps) {
  return (
    <SectionReveal>
      <div className="grid gap-4 md:gap-6">
        {/* Row 1: Education (wide) + Sports */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <SectionReveal delay={0} className="md:col-span-2">
            <InterestCard interest={interests[0]} />
          </SectionReveal>
          <SectionReveal delay={80}>
            <InterestCard interest={interests[1]} />
          </SectionReveal>
        </div>

        {/* Row 2: Books, Films, Podcasts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {interests.slice(2, 5).map((item, i) => (
            <SectionReveal key={item.category} delay={i * 80}>
              <InterestCard interest={item} />
            </SectionReveal>
          ))}
        </div>

        {/* Row 3: Gaming (full width) */}
        <SectionReveal delay={240}>
          <InterestCard interest={interests[5]} />
        </SectionReveal>
      </div>
    </SectionReveal>
  );
}
```

---

## page.tsx Rewrite

Replace `src/app/about-temi/page.tsx` entirely.

The interests data array defines the 6 categories and their stock images. Use placeholder image paths that match the filenames you download in the next step:

```tsx
import { HeroHeading } from "@/components/sections/HeroHeading";
import { SectionReveal } from "@/components/sections/SectionReveal";
import { TextSection } from "@/components/sections/TextSection";
import { PageShell, ReadingColumn } from "@/components/layout/PageShell";
import { ExecutiveSnapshot } from "@/components/sections/ExecutiveSnapshot";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { InterestGrid } from "@/components/sections/InterestGrid";
import type { InterestItem } from "@/components/sections/InterestCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Temi Adekunle — CV / Resume",
  description:
    "Product designer with a bias toward clarity, systems thinking, and work that holds up under scrutiny. Biochemistry background, startup design lead, design system builder, AI-native operator.",
};

const INTERESTS: InterestItem[] = [
  {
    category: "Education",
    emoji: "🎓",
    items: ["University of Lagos", "Google UX Design (Coursera)"],
    imageSrc: "/images/interests/education.jpg",
    alt: "University library reading hall with arched ceilings",
  },
  {
    category: "Sports",
    emoji: "⚽",
    items: ["Chelsea FC", "Formula 1", "NBA"],
    imageSrc: "/images/interests/sports.jpg",
    alt: "Stadium pitch under floodlights",
  },
  {
    category: "Books",
    emoji: "📖",
    items: ["George R.R. Martin"],
    imageSrc: "/images/interests/books.jpg",
    alt: "Collection of book spines on a shelf",
  },
  {
    category: "Films",
    emoji: "🎥",
    items: ["Quentin Tarantino", "James Cameron"],
    imageSrc: "/images/interests/films.jpg",
    alt: "Cinema interior with dramatic lighting",
  },
  {
    category: "Podcasts",
    emoji: "🎙️",
    items: ["Steven Bartlett", "The space between"],
    imageSrc: "/images/interests/podcasts.jpg",
    alt: "Microphone in warm studio lighting",
  },
  {
    category: "Gaming",
    emoji: "🎮",
    items: ["GTA VI", "Red Dead Redemption", "Call of Duty"],
    imageSrc: "/images/interests/gaming.jpg",
    alt: "Gaming controller against a neon-lit background",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* 1. Executive Snapshot */}
      <ExecutiveSnapshot />

      {/* Divider */}
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>

      {/* 2. Professional Summary */}
      <ReadingColumn>
        <TextSection>
          <SectionReveal delay={80}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              I&rsquo;ve spent the past several years working across early-stage
              startups and established product teams, leading design for
              productivity tools, presentation platforms, and digital banking
              experiences. My work spans the full product design spectrum —
              from user research and information architecture through to visual
              design, prototyping, and design-system architecture.
            </p>
          </SectionReveal>

          <SectionReveal delay={160}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              What drives me is the intersection of structure and craft. I
              believe great products are built on clear thinking before polished
              pixels — and that the best design decisions are the ones that make
              complex systems feel inevitable rather than clever. I work best in
              close partnership with engineers, where design intent meets
              implementation constraints, and the result is better for both.
            </p>
          </SectionReveal>

          <SectionReveal delay={240}>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
              Before product design, I studied biochemistry — a background that
              taught me to think in systems, process, and the relationship
              between cause and effect. Those principles carry through
              everything I design today, whether it&rsquo;s mapping a user
              journey or building a design system component.
            </p>
          </SectionReveal>
        </TextSection>
      </ReadingColumn>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>

      {/* 3. Experience Timeline */}
      <ReadingColumn>
        <SectionReveal>
          <h2 className="font-sans text-[clamp(1.25rem,3vw,1.75rem)] font-medium text-[#151515]">
            Experience
          </h2>
        </SectionReveal>
      </ReadingColumn>
      <ReadingColumn>
        <div className="mt-8">
          <ExperienceTimeline />
        </div>
      </ReadingColumn>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>

      {/* 4. Skills & Tools */}
      <ReadingColumn>
        <SectionReveal>
          <h2 className="font-sans text-[clamp(1.25rem,3vw,1.75rem)] font-medium text-[#151515]">
            Skills &amp; Tools
          </h2>
        </SectionReveal>
      </ReadingColumn>
      <div className="mt-8">
        <SkillsGrid />
      </div>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>

      {/* 5. Education & Certifications */}
      <ReadingColumn>
        <SectionReveal>
          <h2 className="font-sans text-[clamp(1.25rem,3vw,1.75rem)] font-medium text-[#151515]">
            Education
          </h2>
        </SectionReveal>
      </ReadingColumn>
      <ReadingColumn>
        <SectionReveal delay={80}>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-sans text-base font-medium text-[#151515]">
                University of Lagos
              </h3>
              <p className="font-sans text-sm text-[#6F6F6F]">
                Biochemistry
              </p>
            </div>
            <div>
              <h3 className="font-sans text-base font-medium text-[#151515]">
                Google UX Design Certificate
              </h3>
              <p className="font-sans text-sm text-[#6F6F6F]">
                Coursera
              </p>
            </div>
          </div>
        </SectionReveal>
      </ReadingColumn>

      {/* Divider */}
      <SectionReveal>
        <hr className="my-12 border-[#151515]/10 md:my-16" />
      </SectionReveal>

      {/* 6. Interests Collage */}
      <ReadingColumn>
        <SectionReveal>
          <h2 className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium text-[#151515]">
            Do we have similar interests?
          </h2>
          <p className="mt-2 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#6F6F6F]">
            A few things I&rsquo;m into — beyond the work.
          </p>
        </SectionReveal>
      </ReadingColumn>
      <div className="mt-8">
        <InterestGrid interests={INTERESTS} />
      </div>
    </PageShell>
  );
}
```

---

## Stock Image Sourcing

Download 6 images from Unsplash using `curl`. Search terms and suggested filenames:

| File | Search Term | Suggested Unsplash Query |
|---|---|---|
| `public/images/interests/education.jpg` | University library, reading hall | "library interior architecture" |
| `public/images/interests/sports.jpg` | Stadium or pitch | "stadium pitch aerial" |
| `public/images/interests/books.jpg` | Book spines or library | "bookshelf close-up" |
| `public/images/interests/films.jpg` | Cinema or dramatic lighting | "cinema interior seats" |
| `public/images/interests/podcasts.jpg` | Microphone warm tones | "microphone studio warm" |
| `public/images/interests/gaming.jpg` | Neon gaming setup | "gaming controller neon" |

Use the Unsplash Source API pattern: `https://images.unsplash.com/photo-{ID}?w=800&q=80` after finding suitable photo IDs. **Only use images under the Unsplash license** (free for commercial use, no attribution required).

Preferred approach: search Unsplash via web browser, find 6 photos that feel evocative and moody (dark tones = better gradient blending), download with curl, save as jpg.

---

## Design Tokens Reference

| Token | Value | Usage |
|---|---|---|
| Text primary | `#151515` | Headings, body text |
| Text muted | `#6F6F6F` | Secondary text (WCAG AA compliant) |
| Accent | `#A43718` | Labels, company names, focus rings |
| Background | `#f5f2ee` | Page background |
| Footer bg | `#0F0F0F` | Footer section |
| `--duration-standard` | defined in CSS | Standard transitions |
| `--duration-slow` | defined in CSS | Image hover transitions |
| `--duration-reveal` | defined in CSS | Scroll reveal animations |
| `--ease-out` | defined in CSS | Easing curve |

---

## Acceptance Criteria

1. All 6 sections render in order on `/about-temi`
2. ExecutiveSnapshot shows 3 columns on desktop, stacks on mobile
3. ExperienceTimeline shows 3 roles — Candidote (Aug 2025 - Mar 2026), Enviodeck (Mar 2026 - Present), UBA
4. SkillsGrid shows 3 groups — Product Design, AI Workflows, Tools — in responsive grid
5. Interest cards show stock images with gradient overlay, category name
6. Hovering an interest card reveals detail chip (image scales, no scale if reduced-motion)
7. Tab navigation reaches all interest cards with visible focus ring
8. Tap/click on interest card toggles detail chip open (persists)
9. Image loading shows skeleton pulse; image error shows fallback with emoji
10. Responsive: layout works at 375px, 768px, and 1120px+
11. Build, type check pass with no errors
12. Old About Temi content (travel gallery) is replaced, not coexisting

---

## Delivery Format

After implementation, provide:
1. **Summary** of what was implemented and any decisions made
2. **Files changed** (created + modified)
3. **Any notable deviations** from the spec and why
4. **Preview instructions** — how to run and verify
5. **Known limitations** if any
