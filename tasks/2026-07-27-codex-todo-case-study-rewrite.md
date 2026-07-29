# Codex Task — TODO++ Case Study Rewrite

## Objective

Rewrite the `todoApp` case-study object in `src/content/case-studies.ts` and build a new `phone-mockup` section type for rendering mobile screenshots inside phone device bezels within case study content.

## Input files to read first

1. `src/content/case-studies.ts` — study the Travecs `credlane` object (lines 267-609) as the structural reference pattern for chapter grouping, nav labels, section rhythm, and data structure
2. `src/components/case-study/CaseStudyLayout.tsx` — the shared template; you'll add a new renderer case
3. `src/components/ui/DeviceMockup.tsx` lines 169-211 — `renderPhoneShell` bezel styling reference for the new `PhoneMockupSection`
4. `src/components/case-study/ImagePair.tsx` — layout precedent for the new component

---

## Part 1: New `phone-mockup` section type

### 1a. Update `ContentSection` type union

In `src/content/case-studies.ts`, add `"phone-mockup"` to the end of the `ContentSection.type` union (after `"carousel"`):

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

### 1b. Add data fields to `ContentSection`

Add this field to the `ContentSection` interface (after the existing fields):

```typescript
// Phone mockup fields (type: "phone-mockup")
phoneMockupImages?: {
  src: string;
  alt: string;
  caption?: string;
}[];  // 1-2 phone screenshots
```

### 1c. Create `PhoneMockupSection` component

New file: `src/components/case-study/PhoneMockupSection.tsx`

**Design spec** (Apple/Stripe quality, matches existing `DeviceMockup` styling at smaller scale):

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
- Respects `prefers-reduced-motion` (use `usePrefersReducedMotion` hook or CSS media query — check existing patterns in the codebase)

**Reference**: Study `DeviceMockup.tsx` lines 169-211 (`renderPhoneShell`) for the exact bezel styling. Key values to adapt:

```tsx
// From DeviceMockup.tsx renderPhoneShell:
<div className="relative overflow-hidden rounded-[22px] bg-[#1a1a1a] p-[1.5px]">
  <div className="absolute left-1/2 top-0 z-10 h-[18px] w-[80px] -translate-x-1/2 rounded-b-[10px] bg-[#1a1a1a]" />
  <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[20px] bg-[#f0f0f0]">
    <Image src={src} alt={alt} fill className="object-cover" />
  </div>
</div>
```

Scale these down for case study context: notch `h-[14px] w-[60px]`, container `max-w-[180px]`, shadow `shadow-[0_8px_30px_rgba(21,21,21,0.08)]`.

Use `next/image` `Image` component for the phone screenshots (matching the existing pattern in `DeviceMockup.tsx`).

### 1d. Integrate in `CaseStudyLayout.tsx`

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

Also add `"phone-mockup"` to the `sectionSpacingClass` function's image/carousel tight-spacing rule (alongside `"image-pair"`, `"carousel"`, `"full-image"`) so phone-mockup sections following a text section get tighter spacing.

---

## Part 2: Rewrite the `todoApp` object

Replace the entire `todoApp` export in `src/content/case-studies.ts` (currently lines 112-189) with the new structure below.

### Top-level fields

```typescript
export const todoApp: CaseStudy = {
  slug: "todo-app",
  title: "TODO++",
  category: "Productivity",
  role: "Product design lead — UX, UI, design system",
  timeline: "2025",
  overview:
    "TODO++ started as a straightforward task management tool that had grown into a feature-heavy checklist application. The product was losing users to simpler alternatives because the core experience had become buried under options. The goal was to redesign the experience from the ground up — preserving power-user capabilities while making the everyday experience feel effortless.",
  subtitle:
    "A calmer task loop across a dedicated device and mobile companion.",
  coverSrc: "/images/case-studies/todo-app-cover.webp",
  heroMedia: {
    src: "/images/case-studies/todo-app/todo-app-hero.webp",
    alt: "TODO++ dedicated task device and companion phone displayed together",
  },
  coverScroll: {
    src: "",
    alt: "",
    sections: [],
  },
  meta: {
    role: "Product design lead — UX, UI, design system",
    timeline: "2025",
    date: "2025",
    platform: "Physical device + mobile app",
    team: "Solo product design",
    scope: "Product concept, UX, UI, design system",
    status: "Presentation-ready concept",
  },
  sections: [
    // ... 13 sections below ...
  ],
  nextSlug: "letters-app",
  prevSlug: "credlane",
};
```

### Section 1: Executive Summary (no chapter)

```typescript
{
  type: "executive-summary",
  heading: "A calmer task loop across a dedicated device and mobile companion",
  executiveSummary: {
    problem: "Task-management products can make a simple daily action—deciding what to do next—feel like administration. TODO++ explores a calmer alternative: a focused physical task device paired with a mobile companion.",
    solution: "The concept brings the essential task loop to the foreground: see the current work, open its details, connect the companion device, and mark work complete. The UI uses deliberate hierarchy and visible state changes to keep the interaction legible.",
    outcome: "A presentation-ready product concept comprising a dedicated task device, companion mobile screens, onboarding/linking, task detail, and task-completion states. No quantitative outcome is claimed because the supplied source set does not verify one.",
  },
},
```

### Section 2: What I Designed (no chapter)

```typescript
{
  type: "what-i-designed",
  heading: "What I designed",
  designedFeatures: [
    {
      name: "Dedicated task device",
      description: "A focused hardware surface for viewing the day's tasks and moving through core controls.",
    },
    {
      name: "Companion mobile home",
      description: "A mobile task-home state that shows the day, task status, navigation, and a clear entry point into the active task.",
    },
    {
      name: "Task detail",
      description: "A deeper mobile view for an active task, with its context and actions available without turning the home state into a dense dashboard.",
    },
    {
      name: "Cross-device linking",
      description: "A mobile setup state that connects the companion app to the physical device.",
    },
    {
      name: "Completion feedback",
      description: "A distinct completed-task state that makes progress visible and gives the task loop a clear endpoint.",
    },
  ],
},
```

### Section 3: The Real Problem (Context)

```typescript
{
  type: "text",
  heading: "Keeping the next task visible",
  chapter: "context",
  navLabel: "Context",
  body: "<strong>TODO++ starts with a smaller question than a typical task dashboard:</strong> what should be visible when someone needs to act now? The concept reduces the daily task loop to a focused device surface and a companion app. Instead of making every organisational option compete for attention, the design foregrounds the current day, the active task, and a small number of clear actions.",
},
```

### Section 4: Research Personas (Context)

```typescript
{
  type: "image-pair",
  heading: "Research personas",
  chapter: "context",
  body: 'The research artifacts frame two complementary needs: <strong>Daniel needs focus and a system that keeps a demanding schedule manageable;</strong> <strong>Amara needs a simple way to capture and return to work without feeling buried by options.</strong> Treat these as the lens for the concept, not as quantitative validation.',
  images: [
    { src: "/images/case-studies/todo-app/todo-app-persona-1.webp", alt: "Daniel Okafor persona — needs clarity, focus, and control without clutter", caption: "Daniel Okafor — needs clarity, focus, and control without clutter.", width: 800, height: 744 },
    { src: "/images/case-studies/todo-app/todo-app-persona-2.webp", alt: "Amara Bello persona — needs a simple system for assignments and personal tasks", caption: "Amara Bello — needs a simple system for assignments and personal tasks.", width: 800, height: 744 },
  ],
},
```

### Section 5: Design Principles (Context)

```typescript
{
  type: "key-decisions",
  heading: "Designing for focus, not configuration",
  chapter: "context",
  body: "1. <strong>Make the next action easy to find.</strong> The home state should give the active task and its status room to breathe. 2. <strong>Keep context available when it is needed.</strong> Task detail belongs behind a deliberate transition, not in every overview. 3. <strong>Make progress tangible.</strong> Linking and completion are explicit states, so the system clearly acknowledges what has changed.",
},
```

### Section 6: The Focused Task Device (Solution)

```typescript
{
  type: "full-image",
  heading: "A dedicated surface for the day's work",
  chapter: "solution",
  navLabel: "Solution",
  body: "<strong>The physical device is the product's most distinctive design decision.</strong> Its display concentrates the task experience into a compact surface while the companion app handles deeper task interaction. The hero should let the reader see the relationship between hardware controls and the on-screen task state.",
  images: [
    { src: "/images/case-studies/todo-app/todo-app-hero.webp", alt: "TODO++ dedicated task device showing the day's tasks and hardware controls", caption: "The dedicated TODO++ device — focused hardware for daily task management", width: 800, height: 600 },
  ],
},
```

### Section 7: Companion Task Flow — Carousel (Solution, conditional)

```typescript
{
  type: "carousel",
  heading: "The product system at a glance",
  chapter: "solution",
  body: "The dedicated device, the companion mobile home, device linking, and task completion — each slide makes one relationship legible.",
  images: [
    { src: "/images/case-studies/todo-app/carousel/todo-app-device-overview.webp", alt: "TODO++ dedicated task device overview", caption: "Dedicated task device", width: 1360, height: 850 },
    { src: "/images/case-studies/todo-app/carousel/todo-app-mobile-home-context.webp", alt: "TODO++ companion mobile home screen", caption: "Companion mobile home", width: 1360, height: 850 },
    { src: "/images/case-studies/todo-app/carousel/todo-app-linking-context.webp", alt: "TODO++ cross-device linking flow", caption: "Cross-device connection", width: 1360, height: 850 },
    { src: "/images/case-studies/todo-app/carousel/todo-app-completion-context.webp", alt: "TODO++ task completion feedback", caption: "Completion feedback", width: 1360, height: 850 },
  ],
},
```

### Section 8: Cross-device Linking — Phone Mockup (Solution)

```typescript
{
  type: "phone-mockup",
  heading: "Linking the companion device",
  chapter: "solution",
  body: "<strong>The linking state makes the relationship between the device and the mobile app explicit.</strong> Keep the interface simple: show the device illustration, the connection instruction, and the primary action.",
  phoneMockupImages: [
    { src: "/images/case-studies/todo-app/phone/todo-app-phone-link-device.webp", alt: "TODO++ companion app linking screen — connect to the dedicated device", caption: "Connect the companion app to the dedicated TODO++ device." },
  ],
},
```

### Section 9: Detail and Completion — Phone Mockup (Solution)

```typescript
{
  type: "phone-mockup",
  heading: "From task context to a clear endpoint",
  chapter: "solution",
  body: "<strong>Task detail holds the information needed to act; completion closes the loop.</strong> Present the two states together so the reader can follow the interaction from an active task to a confirmed result.",
  phoneMockupImages: [
    { src: "/images/case-studies/todo-app/phone/todo-app-phone-task-detail.webp", alt: "TODO++ task detail view — the active task and its context", caption: "Task detail — the active task and its context." },
    { src: "/images/case-studies/todo-app/phone/todo-app-phone-complete-task.webp", alt: "TODO++ completed task state — clear acknowledgement that the task is done", caption: "Completion — a clear acknowledgement that the task is done." },
  ],
},
```

### Section 10: Results (Results)

```typescript
{
  type: "results",
  heading: "What the concept delivered",
  navLabel: "Results",
  chapter: "results",
  outcomeBullets: [
    {
      label: "Coherent product concept",
      description: "A dedicated task device and companion mobile app designed as a focused, linked system.",
    },
    {
      label: "Focused mobile task loop",
      description: "Home, task detail, device linking, and completion states covering the essential interaction arc.",
    },
    {
      label: "Research-led narrative",
      description: "Two personas distinguishing the needs for clarity and focus from the need for simplicity and recovery.",
    },
  ],
},
```

### Section 11: Constraints (Reflection)

```typescript
{
  type: "constraints",
  heading: "What this case study can—and cannot—claim",
  chapter: "reflection",
  outcomeBullets: [
    {
      label: "Concept, not deployment",
      description: "The available case-study assets demonstrate a product concept and interface states; they do not verify business or behavioural outcomes.",
    },
    {
      label: "Personas as narrative lens",
      description: "The persona artifacts support the design narrative, but should be presented with readable takeaways rather than as small-text evidence.",
    },
    {
      label: "Export selection matters",
      description: "Export selection must preserve a single-screen reading experience; do not use dense canvases or composites as carousel slides.",
    },
  ],
},
```

### Section 12: Key Decisions (Reflection)

```typescript
{
  type: "key-decisions",
  heading: "Key decisions",
  navLabel: "Decisions",
  chapter: "reflection",
  outcomeBullets: [
    {
      label: "Use the device-plus-phone composition as the hero",
      description: "It represents TODO++ as a hardware-and-mobile product, rather than a desktop application.",
    },
    {
      label: "Use mobile screens in phone bezels",
      description: "The existing task home, linking, task detail, and completion exports are portrait mobile states.",
    },
    {
      label: "Use a carousel only for source-composed wide frames",
      description: "Do not create desktop exports or place portrait screens in a faux desktop frame.",
    },
    {
      label: "Omit CoverScroll by default",
      description: "It may be used only if the app-flow canvas contains a final, wide, vertically sequenced product-story frame that remains legible in a 16:10 window.",
    },
  ],
},
```

### Section 13: Closing Reflection (Reflection)

```typescript
{
  type: "text",
  heading: "Focus is a product decision",
  chapter: "reflection",
  body: "<strong>TODO++ explores how a task product can become more present without becoming more demanding.</strong> The work's clearest contribution is the relationship between a purposeful physical surface and a mobile companion that retains task context when it is needed. The next step would be validating whether that focused loop helps people return to work with less friction.",
},
```

---

## Non-negotiable

- Slug must remain `"todo-app"`
- `nextSlug` / `prevSlug` must remain `"letters-app"` / `"credlane"`
- Do NOT fabricate metrics, user quotes, or research claims
- Do NOT modify any case study other than `todoApp`
- Do NOT modify `src/content/projects.ts`
- Do NOT create image files — use placeholder paths only

## Placeholder image paths

```
public/images/case-studies/todo-app/
├── todo-app-hero.webp                         # Hero + section 6 full-image
├── todo-app-persona-1.webp                    # Daniel Okafor persona
├── todo-app-persona-2.webp                    # Amara Bello persona
├── carousel/
│   ├── todo-app-device-overview.webp          # Carousel slide 1
│   ├── todo-app-mobile-home-context.webp      # Carousel slide 2
│   ├── todo-app-linking-context.webp          # Carousel slide 3
│   └── todo-app-completion-context.webp       # Carousel slide 4
└── phone/
    ├── todo-app-phone-link-device.webp        # Phone mockup — linking
    ├── todo-app-phone-task-detail.webp        # Phone mockup — detail (left)
    └── todo-app-phone-complete-task.webp      # Phone mockup — completion (right)
```

## Verification

After implementation, run:

1. `npx tsc --noEmit` — must pass
2. `npm run lint` — must pass

## Required output

Return:

1. **Implementation summary** — what changed, what was preserved, what's placeholder
2. **Files changed** — list with brief description of changes per file
3. **PhoneMockupSection decisions** — any design choices that deviate from the spec and why
4. **Deviations or assumptions** — anything you couldn't follow from the spec and why
5. **Placeholders awaiting imagery** — list all placeholder image paths
6. **Build verification** — TypeScript, ESLint status
7. **Known limitations** — anything that might need follow-up
