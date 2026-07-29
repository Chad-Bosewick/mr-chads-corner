# TODO++ Case Study Rewrite PRD

> **Purpose:** Rewrite the TODO++ portfolio case study using the case-study chapter system established by Draftly.  
> **Primary design sources:** Figma `Stage 7 - Copy`, presentation node `173:3402`; app-flow node `18:64`.  
> **Status:** Ready for implementation after the Figma export checklist in this document is completed.

---

## Metadata

| Field | Value |
| --- | --- |
| Slug | `todo-app` |
| Title | TODO++ |
| Category | Productivity |
| Role | Product design lead — UX, UI, design system |
| Existing project date | 2025 |
| Hero media | `todo-app-hero.webp` |
| CoverScroll media | Omit by default; see Product-Appropriate Media Direction |

## Product Story Summary

TODO++ is a task-management concept designed around a dedicated physical task device and a companion mobile experience. The product’s everyday surface is deliberately narrow: a greeting, a small set of task controls, one current priority, and clear state changes rather than a dense configuration interface. The existing design exports show the same product moving between the device and mobile app through a linked-device flow.

The case study should explain the work as an exercise in making task management more focused and tangible. Its strongest evidence is in the interface itself: a task-home state, a task-detail view, a simple cross-device linking step, and an explicit completion state. Avoid claims about adaptive ranking, machine learning, user behaviour tracking, churn, feature adoption, or business impact unless they are independently documented in the presentation frame.

The research story remains useful when it is presented as context rather than proof of measured outcomes. Daniel Okafor represents a user who needs clarity, focus, and a system that supports a demanding schedule; Amara Bello represents a user who wants a simple, approachable way to keep up with assignments and personal work. Keep the real persona exports, but pair each with a readable takeaway so the reader does not need to decipher small text inside the artifacts.

## Product-Appropriate Media Direction

TODO++ is a mobile app paired with a dedicated hardware device. The available exports contain a hardware-and-phone composition plus portrait mobile states; they do **not** contain a desktop product interface. Do not introduce a laptop, desktop dashboard, or desktop-shaped hero merely to match other case studies.

- **Hero:** use the final Figma composition that shows the dedicated TODO++ device and companion phone together. Choose the composition that most clearly exposes both the hardware controls and the mobile task state.
- **Carousel:** use it only for a deliberately composed, wide product-story sequence from the Figma file—such as device overview, mobile home, device linking, and task completion. It is not a desktop-carousel requirement. If the source frames are only portrait mobile captures, keep them in `phone-mockup` sections instead.
- **CoverScroll:** omit it unless node `18:64` contains one final, wide, vertically sequenced *product-story* frame designed to be read within a 16:10 viewport. A tall mobile screenshot is not a CoverScroll substitute: it would be too small in the component and duplicate the stronger phone-bezel treatment.

## Executive Summary

**Problem:** Task-management products can make a simple daily action—deciding what to do next—feel like administration. TODO++ explores a calmer alternative: a focused physical task device paired with a mobile companion.

**Solution:** The concept brings the essential task loop to the foreground: see the current work, open its details, connect the companion device, and mark work complete. The UI uses deliberate hierarchy and visible state changes to keep the interaction legible.

**Outcome:** A presentation-ready product concept comprising a dedicated task device, companion mobile screens, onboarding/linking, task detail, and task-completion states. No quantitative outcome is claimed because the supplied source set does not verify one.

## What I Designed

- **Dedicated task device** — A focused hardware surface for viewing the day’s tasks and moving through core controls.
- **Companion mobile home** — A mobile task-home state that shows the day, task status, navigation, and a clear entry point into the active task.
- **Task detail** — A deeper mobile view for an active task, with its context and actions available without turning the home state into a dense dashboard.
- **Cross-device linking** — A mobile setup state that connects the companion app to the physical device.
- **Completion feedback** — A distinct completed-task state that makes progress visible and gives the task loop a clear endpoint.

## Section Restructuring

The current ten sections become a chaptered editorial story. The first two sections are unchaptered; chapters then move from context, to product solution, to bounded results, and reflection.

1. `executive-summary` — Problem / Solution / Outcome (no chapter)
2. `what-i-designed` — Feature cards (no chapter)
3. `text` — The real problem (`Context`)
4. `image-pair` — Research personas (`Context`)
5. `key-decisions` — Design principles (`Context`)
6. `full-image` — The focused task device (`Solution`)
7. `carousel` — The product story, only if a wide Figma-composed sequence exists (`Solution`)
8. `phone-mockup` — Cross-device linking (`Solution`)
9. `phone-mockup` — Task detail and completion (`Solution`)
10. `results` — What the concept delivered (`Results`)
11. `constraints` — Scope and evidence boundaries (`Reflection`)
12. `key-decisions` — Decisions and implementation considerations (`Reflection`)
13. `text` — Closing reflection (`Reflection`)

## Section-by-Section Specification

### 1. Executive Summary

| Field | Specification |
| --- | --- |
| Type | `executive-summary` |
| Heading | `A calmer task loop across a dedicated device and mobile companion` |
| Chapter | None |
| Body | Use the Problem, Solution, and Outcome copy in the Executive Summary above. Do not add performance figures. |
| Media | `public/images/case-studies/todo-app/todo-app-hero.webp` |

### 2. What I Designed

| Field | Specification |
| --- | --- |
| Type | `what-i-designed` |
| Heading | `What I designed` |
| Chapter | None |
| Body | Use the five feature cards from What I Designed above. |
| Media | No inline media required; the hero establishes the product composition. |

### 3. The Real Problem

| Field | Specification |
| --- | --- |
| Type | `text` |
| Heading | `Keeping the next task visible` |
| Chapter | `Context` |
| navLabel | `Context` |
| Body | `<strong>TODO++ starts with a smaller question than a typical task dashboard:</strong> what should be visible when someone needs to act now? The concept reduces the daily task loop to a focused device surface and a companion app. Instead of making every organisational option compete for attention, the design foregrounds the current day, the active task, and a small number of clear actions.` |
| Media | None |

### 4. Research Personas

| Field | Specification |
| --- | --- |
| Type | `image-pair` |
| Heading | `Research personas` |
| Chapter | `Context` |
| Body | `The research artifacts frame two complementary needs: <strong>Daniel needs focus and a system that keeps a demanding schedule manageable;</strong> <strong>Amara needs a simple way to capture and return to work without feeling buried by options.</strong> Treat these as the lens for the concept, not as quantitative validation.` |
| Images | `todo-app-persona-1.webp`, `todo-app-persona-2.webp` |
| Captions | `Daniel Okafor — needs clarity, focus, and control without clutter.` / `Amara Bello — needs a simple system for assignments and personal tasks.` |

### 5. Design Principles

| Field | Specification |
| --- | --- |
| Type | `key-decisions` |
| Heading | `Designing for focus, not configuration` |
| Chapter | `Context` |
| Body | `1. <strong>Make the next action easy to find.</strong> The home state should give the active task and its status room to breathe. 2. <strong>Keep context available when it is needed.</strong> Task detail belongs behind a deliberate transition, not in every overview. 3. <strong>Make progress tangible.</strong> Linking and completion are explicit states, so the system clearly acknowledges what has changed.` |
| Media | None |

### 6. The Focused Task Device

| Field | Specification |
| --- | --- |
| Type | `full-image` |
| Heading | `A dedicated surface for the day’s work` |
| Chapter | `Solution` |
| navLabel | `Solution` |
| Body | `<strong>The physical device is the product’s most distinctive design decision.</strong> Its display concentrates the task experience into a compact surface while the companion app handles deeper task interaction. The hero should let the reader see the relationship between hardware controls and the on-screen task state.` |
| Media | `todo-app-hero.webp` |

### 7. Companion Task Flow

| Field | Specification |
| --- | --- |
| Type | `carousel` — conditional |
| Heading | `The product system at a glance` |
| Chapter | `Solution` |
| Body | `Use this section only when the app-flow canvas contains wide, final product-story compositions. Each slide should make one relationship legible: the dedicated device, the companion mobile home, device linking, or a completed task. <strong>Do not export or invent desktop UI for this section.</strong> If no wide compositions exist, omit this section and let the phone-mockup sections carry the flow.` |
| Media | Conditional wide compositions listed in Asset Requirements. |

### 8. Cross-Device Linking

| Field | Specification |
| --- | --- |
| Type | `phone-mockup` |
| Heading | `Linking the companion device` |
| Chapter | `Solution` |
| Body | `<strong>The linking state makes the relationship between the device and the mobile app explicit.</strong> Keep the interface simple: show the device illustration, the connection instruction, and the primary action.` |
| Phone treatment | Single phone |
| Caption | `Connect the companion app to the dedicated TODO++ device.` |
| Media | `phone/todo-app-phone-link-device.webp` |

### 9. Detail and Completion

| Field | Specification |
| --- | --- |
| Type | `phone-mockup` |
| Heading | `From task context to a clear endpoint` |
| Chapter | `Solution` |
| Body | `<strong>Task detail holds the information needed to act; completion closes the loop.</strong> Present the two states together so the reader can follow the interaction from an active task to a confirmed result.` |
| Phone treatment | Side-by-side pair |
| Captions | `Task detail — the active task and its context.` / `Completion — a clear acknowledgement that the task is done.` |
| Media | `phone/todo-app-phone-task-detail.webp`, `phone/todo-app-phone-complete-task.webp` |

### 10. Results

| Field | Specification |
| --- | --- |
| Type | `results` |
| Heading | `What the concept delivered` |
| Chapter | `Results` |
| navLabel | `Results` |
| Body | `- A coherent product concept spanning a dedicated task device and companion mobile app.\n- A focused mobile task loop covering home, task detail, device linking, and completion.\n- A research-led narrative that distinguishes the needs for clarity and focus from the need for simplicity and recovery.\n\n<strong>No operational, retention, completion, discovery, or NPS metric belongs in this section unless a source in the presentation independently substantiates it.</strong>` |
| Media | No CoverScroll by default. A product-story CoverScroll is allowed only under the strict condition below. |

### 11. Constraints and Evidence Boundaries

| Field | Specification |
| --- | --- |
| Type | `constraints` |
| Heading | `What this case study can—and cannot—claim` |
| Chapter | `Reflection` |
| Body | `- The available case-study assets demonstrate a product concept and interface states; they do not verify business or behavioural outcomes.\n- The persona artifacts support the design narrative, but should be presented with readable takeaways rather than as small-text evidence.\n- Export selection must preserve a single-screen reading experience; do not use dense canvases or composites as carousel slides.` |
| Media | None |

### 12. Key Decisions and Implementation Considerations

| Field | Specification |
| --- | --- |
| Type | `key-decisions` |
| Heading | `Key decisions` |
| Chapter | `Reflection` |
| Body | `- <strong>Use the device-plus-phone composition as the hero.</strong> It represents TODO++ as a hardware-and-mobile product, rather than a desktop application.\n- <strong>Use mobile screens in phone bezels.</strong> The existing task home, linking, task detail, and completion exports are portrait mobile states.\n- <strong>Use a carousel only for source-composed wide product-story frames.</strong> Do not create desktop exports or place portrait screens in a faux desktop frame.\n- <strong>Omit CoverScroll by default.</strong> It may be used only if the app-flow canvas contains a final, wide, vertically sequenced product-story frame that remains legible in a 16:10 window.` |
| Media | None |

### 13. Closing Reflection

| Field | Specification |
| --- | --- |
| Type | `text` |
| Heading | `Focus is a product decision` |
| Chapter | `Reflection` |
| Body | `<strong>TODO++ explores how a task product can become more present without becoming more demanding.</strong> The work’s clearest contribution is the relationship between a purposeful physical surface and a mobile companion that retains task context when it is needed. The next step would be validating whether that focused loop helps people return to work with less friction.` |
| Media | None |

## Asset Requirements and Figma Export Checklist

Export **only final top-level frames** from `Stage 7 - Copy`. Use the original frame bounds; do not screenshot the Figma canvas, device chrome, selection outlines, or surrounding frames. Export at **2× scale as WebP**, use transparent backgrounds only where the source frame is transparent, and preserve all readable interface content. Paths are absolute project placeholders.

| Placeholder path | Source and selection | Required export | Use |
| --- | --- | --- | --- |
| `public/images/case-studies/todo-app/todo-app-hero.webp` | App flows `18:64`: final composition showing the TODO++ hardware and companion phone together | 2× WebP; full composition, no canvas | Required hero / section 6 |
| `public/images/case-studies/todo-app/todo-app-product-story-full.webp` | App flows `18:64`: one final, wide, vertically sequenced product-story frame, **only if present** | 2× WebP; entire frame, no seams | Conditional CoverScroll; otherwise do not create or reference this asset |
| `public/images/case-studies/todo-app/carousel/todo-app-device-overview.webp` | App flows `18:64`: final wide device overview composition, **only if present** | 2× WebP; source-composed wide frame | Conditional carousel — `Dedicated task device` |
| `public/images/case-studies/todo-app/carousel/todo-app-mobile-home-context.webp` | App flows `18:64`: final wide composition that gives the mobile home screen enough readable scale, **only if present** | 2× WebP; source-composed wide frame | Conditional carousel — `Companion mobile home` |
| `public/images/case-studies/todo-app/carousel/todo-app-linking-context.webp` | App flows `18:64`: final wide composition for hardware-to-phone linking, **only if present** | 2× WebP; source-composed wide frame | Conditional carousel — `Cross-device connection` |
| `public/images/case-studies/todo-app/carousel/todo-app-completion-context.webp` | App flows `18:64`: final wide composition for task completion, **only if present** | 2× WebP; source-composed wide frame | Conditional carousel — `Completion feedback` |
| `public/images/case-studies/todo-app/phone/todo-app-phone-home.webp` | Existing focused task-home export; verify it corresponds to app flows `18:64` | 2× WebP; portrait mobile frame | Optional supporting phone state |
| `public/images/case-studies/todo-app/phone/todo-app-phone-link-device.webp` | Existing device-linking export; verify it corresponds to app flows `18:64` | 2× WebP; portrait mobile frame | Single phone, linking section |
| `public/images/case-studies/todo-app/phone/todo-app-phone-task-detail.webp` | Existing task-detail export; verify it corresponds to app flows `18:64` | 2× WebP; portrait mobile frame | Left phone, detail/completion pair |
| `public/images/case-studies/todo-app/phone/todo-app-phone-complete-task.webp` | Existing completed-task export; verify it corresponds to app flows `18:64` | 2× WebP; portrait mobile frame | Right phone, detail/completion pair |
| `public/images/case-studies/todo-app/todo-app-persona-1.webp` | Presentation `173:3402`: Daniel Okafor persona | 2× WebP; full persona artifact | Persona pair |
| `public/images/case-studies/todo-app/todo-app-persona-2.webp` | Presentation `173:3402`: Amara Bello persona | 2× WebP; full persona artifact | Persona pair |

### Export selection rules

1. The carousel rows are **not desktop requirements**. Export them only when node `18:64` provides wide, final compositions built for that treatment; otherwise omit the carousel section entirely.
2. The four phone exports are **mobile-only requirements**. Render them inside the existing phone-bezel component; do not reframe them as desktop screens.
3. CoverScroll is exceptional, not a default. If the app-flow node does not contain a single, continuous, wide product-story frame, do not create `todo-app-product-story-full.webp` and do not add `coverScroll` to `todoApp`.
4. The hero is required and must be a final hardware-plus-phone composition. If the node has no such composition, export the strongest dedicated TODO++ device composition and pair it with the real mobile home export only when that pairing already exists in Figma.
5. The existing persona files show Daniel and Amara artifacts and should remain only if they match the final presentation export. Their captions and nearby text carry the insight; the page must not depend on readers zooming into the sheets.

## Chapter Mapping

| Current section | New section | Rationale |
| --- | --- | --- |
| Understanding the problem | The real problem | Removes unsupported adoption/churn claims and focuses on the observable product tension: keeping the next task visible. |
| User research — personas | Research personas | Retains the owner-approved artifacts, now with explicit, readable takeaways. |
| Defining the principles | Designing for focus, not configuration | Promotes principles into decision-oriented content and removes unsupported process claims. |
| Redesigned interface | The focused task device + companion task flow | Uses the distinctive hardware-plus-phone composition as hero and separates wide product-story compositions from portrait mobile screens. |
| The intelligent inbox | The companion task loop | Removes unsupported claims about behavioural learning and prioritisation; describes the verifiable interaction states instead. |
| Onboarding flow | Cross-device linking | Narrows the section to the visible device-linking interaction. |
| Impact | What the concept delivered | Replaces fabricated metrics with concrete design deliverables. |
| Collaboration with engineering | Constraints and key decisions | Retains implementation awareness without claiming undocumented review practices or algorithms. |
| Unheaded completion image | Detail and completion | Gives the completion state a narrative role and pairs it with task detail. |
| What I learned | Closing reflection | Keeps the reflection but grounds it in the concept’s focused device-plus-companion approach. |

## Non-Negotiable Facts

- Category: `Productivity`
- Role: `Product design lead — UX, UI, design system`
- The user-research persona section remains in the case study, subject to the export verification above.
- TODO++ is presented as a product concept. Do not imply that the concept shipped, was tested, or improved a business metric unless the presentation explicitly proves it.

## What to Remove

- Fabricated metrics: `32%` churn reduction, `+28%` task completion, `+45%` feature discovery, and `+18 pts` NPS.
- The unsupported claim that the product learned from user behaviour, ranked priorities from deadlines and dependencies, or ran a transparent recommendation system.
- The unsupported claims about feature engagement, churn trends, weekly engineering reviews, and user migration.
- Generic language that frames the product as a conventional feature-heavy app without evidence from the presentation.

## What to Keep

- The dedicated TODO++ device as the leading visual and product differentiator.
- Focused mobile states: task home, device linking, task detail, and task completion.
- The Daniel Okafor and Amara Bello persona artifacts, with the takeaways specified above.
- The category and role verbatim.

## Completion Review

- The proposed structure uses unchaptered executive summary and design scope, followed by Context, Solution, Results, and Reflection chapters.
- Every image path is under `public/images/case-studies/todo-app/` and each asset has a defined purpose, source node, and format requirement.
- Hardware-plus-mobile hero, conditional wide product-story carousel, phone-bezel, and conditional CoverScroll media are distinguished; none requires invented desktop UI.
- No fabricated performance metric remains in proposed copy.
- **Implementation ambiguity:** the Figma integration did not return renderable content or the section hierarchy for nodes `173:3402` and `18:64` during this review (Figma returned HTTP 504). Before implementation, open those nodes in Figma and verify the exact final section/frame names for the hardware-plus-phone hero, any wide product-story carousel compositions, and any continuous wide product-story frame. This verification is required; do not treat the descriptive export labels above as evidence that a frame exists.
