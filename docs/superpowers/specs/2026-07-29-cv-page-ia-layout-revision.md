# CV / Resume Page — IA & Layout Revision

> **Revision of** `docs/superpowers/specs/2026-07-29-cv-page-design.md`
> **Problem:** Flat page rhythm, inconsistent container alignment per-section, orphaned elements, weak ending.
> **Goal:** A composed, scrolling narrative — not a checklist of sections.

---

## 1. Core Structural Problems (Diagnosis)

### 1a. Alternating container widths create visual wobble

The page currently toggles between `PageShell` (max-w-[1120px]) and `ReadingColumn` (max-w-[680px], centered) on almost every section:

| Section | Container | Effect |
|---|---|---|
| Hero | PageShell | Wide |
| Snapshot | PageShell | Wide |
| Summary | ReadingColumn | Narrow — text jumps ~220px right |
| Experience | ReadingColumn | Narrow |
| Skills | PageShell | Wide — text jumps back |
| Education | ReadingColumn | Narrow — jumps again |
| Interests | PageShell | Wide |

On desktop this means text blocks shift ~220px left and right as the user scrolls, with no narrative reason. The alternation reads as indecision, not deliberate pacing.

**Fix:** Group sections into narrative acts. Each act establishes one container width and stays in it. Only shift container at act boundaries.

### 1b. Seven flat sections, no narrative arc

Six identical `<hr>` dividers create equal visual weight for everything. Nothing signals "this is the main event" vs "this is supporting context." CV sections are naturally hierarchical:
- **Who you are** (hero + summary) — primary
- **What you've done** (experience) — primary
- **What you can do** (skills + education) — secondary reference
- **Who you are beyond work** (interests) — supplementary

The layout should express this hierarchy through spacing, container shifts, and visual treatment — not just dividers.

### 1c. Orphaned and under-scaled elements

- Download button floats between hero and snapshot with no visual home
- No contact links (email, LinkedIn) on a CV page
- ExecutiveSnapshot is three disconnected sentences with no connective role
- Education is two lines but gets a full-width divider break
- Page ends abruptly on interests grid with no closing statement

---

## 2. Revised Page IA

The page organises into **four acts** with one container shift at the act-2/act-3 boundary:

```
ACT 1 — Introduction (ReadingColumn)
├── Hero header (name, subtitle, contact links, download CV)
└── Professional Summary + Core Strengths strip

ACT 2 — Career Narrative (ReadingColumn)
├── Experience heading
└── Experience Timeline (2 roles)
    └── Design-systems callout (still paced separately)

--- container shift ---

ACT 3 — Reference (PageShell wide)
├── Skills & Tools + Education (side-by-side or adjacent)
└── (both under a shared heading)

ACT 4 — Supplementary (PageShell wide)
├── "Do we have similar interests?" heading + subtitle
└── Interest grid (needs width for image cards)

--- closing transition back to site ---
```

This gives: **narrow (acts 1-2) → wide (acts 3-4).** One shift. The narrow acts are the narrative core — they invite focused reading. The wide acts are reference and supplementary content, using the full width where the content benefits from it (multi-column skills, image grid).

### Act boundaries use spacing (not dividers)

| Between | Treatment |
|---|---|
| Act 1 → Act 2 | No divider — they're the same container and same narrative flow |
| Act 2 → Act 3 | A single `<hr>` divider — the only major break on the page. Signals "narrative over, reference begins" |
| Act 3 → Act 4 | No divider — they share the same wide container |
| After Act 4 | A closing statement + contact CTA before returning to site navigation |

Only one `<hr>` on the entire page. Other sections are separated by `mt-16 md:mt-20` spacing within their act.

---

## 3. Alignment Decisions

### ReadingColumn acts (1-2)
- All content is **left-aligned** within the narrower column
- The column itself is centered in the viewport (existing `mx-auto`)
- This is standard editorial treatment — comfortable reading width, left-aligned text

### PageShell wide acts (3-4)
- Section headings are **left-aligned** to the shell grid
- Multi-column layouts (skills, education pair) align to the same left edge
- The interest grid fills full width naturally

### No centered text
- No `text-center` on any heading or content
- Left-aligned throughout eliminates the ambiguity about what's supposed to align with what

### Vertical rhythm
- Use spacing values that compress between related content (tight) and expand between sections (generous)
- `gap` and `space-y` values: 4px between related lines, 16-24px between grouped items, 48-80px between sections

---

## 4. Revised Layout Specification

### Act 1: Introduction — ReadingColumn

**4a. Hero Header**

Combined name + contact + download in one compact block:

```
Temi Adekunle                          [Download CV (PDF)]
Product designer with a bias toward    [icon]           [icon]
clarity, systems thinking, and work    (email)        (LinkedIn)
that holds up under scrutiny.
```

- Name: h1, `text-[clamp(2rem,5vw,3rem)]`, font-medium
- Subtitle: existing `HeroHeading` subtitle styling
- Contact links: email (`mailto:`), LinkedIn (external), in same row or directly below subtitle
  - Font-sans, text-sm, accent colour
  - Visible and one-click — not hidden behind an icon-only tooltip
- Download button: sits to the right of the name row on desktop, below on mobile
  - Same styling as current implementation (accent border, subtle bg, download icon)
  - `flex sm:flex-row sm:justify-between sm:items-start` layout for the header row

**4b. Professional Summary**

Three-paragraph narrative (existing content), unchanged.

**4c. Core Strengths Strip**

The three ExecutiveSnapshot items (Systems Thinker, Design System Builder, AI-Native Operator) move here, placed **after** the summary paragraphs as a compact accent strip.

Layout: flex row, `gap-6 md:gap-10`, items separated by a subtle vertical rule (`border-r border-[#151515]/10`). Each item: category label in accent + short description.

This positions the strengths as *evidence supporting the summary* rather than a disconnected hero grid.

---

### Act 2: Career Narrative — ReadingColumn

**4d. Experience Timeline**

Unchanged content (two roles + design-systems callout). Still inside ReadingColumn.

To give the timeline slightly more weight within the narrow column, the heading can be `text-[clamp(1.5rem,3vw,2rem)]` — one step larger than other section headings — signalling this is the main event.

---

### Act 3: Reference — PageShell wide

**4e. Skills & Tools + Education (paired)**

A shared section heading: "Skills & Education" or separate headings in the same horizontal space.

Layout: two columns on desktop (`md:grid md:grid-cols-2 md:gap-12`). Skills on the left, Education on the right.

Skills content: unchanged (three existing groups). The 3-column skill groups render as a single column within the left side to avoid overcrowding.

Education content:
```
University of Lagos
Biochemistry — Mar 2023

Google UX Design Certificate
Coursera — Oct 2024
```

On mobile: stacks to single column, Skills above Education.

---

### Act 4: Supplementary — PageShell wide

**4f. Interest Grid**

Unchanged content and layout. Benefits from PageShell wide container for the multi-column image grid.

**4g. Closing CTA**

After the interest grid:

```
---

Interested in working together?
[ temi@example.com ]   [ LinkedIn ]   [ Download CV (PDF) ]
```

Compact, understated. Provides a clear action after the user has consumed the full narrative. Minimal — not a sales pitch, just the next step.

The contact links mirror the ones in the hero, giving the page a sense of closure.

---

## 5. Visual Behaviour

### Scroll animations
- `SectionReveal` animations fire once per section as before
- Within acts, delays are shorter and more staggered (no simultaneous reveals)
- The single `<hr>` divider animates in to give the act break a moment of emphasis

### Responsive
- ReadingColumn: unchanged (centred, max-w-[680px])
- PageShell: unchanged (max-w-[1120px], px-5)
- Skills + Education pair collapses to single column below `md`
- Contact header row stacks below `sm`
- All existing breakpoint behaviour for interest grid preserved

### Accessibility
- Contact links have descriptive aria-labels (e.g. "Email Temi Adekunle")
- Heading hierarchy: h1 (name) → h2 (section headings) → h3 (role titles, skill groups)
- All interactive elements meet 44×44px touch targets
- `prefers-reduced-motion` respected per existing implementation

---

## 6. Summary of Changes from Current Implementation

| Element | Current | Revised |
|---|---|---|
| Dividers | 6 × `<hr>` | 1 × `<hr>` (act 2→3 only) |
| Container strategy | Alternates per section | Acts 1-2: ReadingColumn. Acts 3-4: PageShell |
| Download button | Between hero and snapshot | In hero header row |
| Contact links | None | Email + LinkedIn in header and closing |
| ExecutiveSnapshot | Separate section above summary | Merged into summary area as strength strip |
| Skills & Education | Separate sections, each full-width | Paired side-by-side in wide container |
| Closing statement | None | Brief contact CTA after interests |
| Main heading | Title-only | Title + contact row + download |
| Text alignment | Mixed left + implicit center | Left-aligned throughout |
| Experience heading | Same size as all section headings | One step larger (primary signal) |

---

## 7. Recommended Route

- **Container restructuring** depends on moving the three snapshot items into the summary area and removing the standalone ExecutiveSnapshot placement
- No new components needed — existing `ExecutiveSnapshot` component gets repurposed or its content inlined
- The download button is already implemented, just needs repositioning
- Contact links and closing CTA are new HTML (simple links, no component needed)
