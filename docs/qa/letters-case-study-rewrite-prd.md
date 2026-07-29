# Letters App Case Study Rewrite PRD

> **Primary design source:** [Stage 8 — Submission, node 274:1784](https://www.figma.com/design/dpy3EFCFIbCQKg5RU6y1XN/Stage-8?node-id=274-1784&m=dev&t=W5KNv4rljcXnRrFM-1)  
> **Purpose:** Rewrite the Letters App case study with the same chaptered system used by TODO++ and Draftly.

## Metadata

| Field | Value |
| --- | --- |
| Slug | `letters-app` |
| Title | Letters App |
| Category | Communication |
| Role | Sole product designer — end-to-end product design |
| Platform | Responsive web and iPhone app |
| Hero | `public/images/case-studies/letters-app/letters-app-hero.webp` |
| CoverScroll | `public/images/case-studies/letters-app/letters-app-landing-page-full.webp` |
| Navigation | `prevSlug: todo-app`; `nextSlug: credlane` |

## Product Story Summary

Letters App is a communication product built around reading, writing, and replying to longer-form letters rather than short, interruption-driven messages. The Stage 8 file shows both a responsive web experience and a native mobile flow. Across both, the product treats a letter as an authored object: it has a subject, body, imagery, location context, author information, and a deliberate invitation to reply.

The key design challenge is making longer communication inviting instead of burdensome. The web home surfaces recent and continuing correspondence; the letter-reading experience gives a long story room to unfold; and the mobile writing flow makes composition, image selection, background choice, preview, and posting visible steps. The app also includes onboarding, sent/received letters, and pals—evidence of a social product model, not merely a static letter editor.

The case study should be specific about these designed states and avoid treating product concepts as measured outcomes. The file supports the emotional-design story: slower reading, richer context, and a reply model that makes correspondence feel personal. It does not substantiate the current numerical results.

## Executive Summary

**Problem:** Most communication products optimise for immediacy. That makes it easy to send a message, but leaves little room for a story, a response with context, or a record worth returning to.

**Solution:** Letters App reframes digital correspondence as a composed letter. Its web and mobile experiences support discovery, long-form reading, replying, writing, image and theme choices, preview, and posting.

**Outcome:** A presentation-ready, responsive communication-product concept with complete web home and letter-reading views, a detailed iPhone writing flow, onboarding, sent/received letters, and pals. No business or behavioural metric is claimed.

## What I Designed

- **Web home and discovery** — recent posts, continuing reads, navigation, and search in a spacious letter-first layout.
- **Long-form reading and reply** — a desktop letter view with author, date, imagery, location moments, and a direct reply action.
- **Mobile writing flow** — compose, select or generate imagery, choose a visual treatment, preview, and post.
- **Personal correspondence spaces** — sent and received letters plus a pals view that makes the network of people visible.
- **Onboarding** — a mobile entry screen that introduces the product promise and gives clear sign-in and sign-up actions.

## Section Restructuring

1. `executive-summary` — Problem / Solution / Outcome (no chapter)
2. `what-i-designed` — Feature cards (no chapter)
3. `text` — Communication with room to mean something (`Context`)
4. `key-decisions` — Principles for thoughtful correspondence (`Context`)
5. `full-image` — A web home for returning to letters (`Solution`)
6. `carousel` — Reading and replying on the web (`Solution`)
7. `phone-mockup` — Writing a letter step by step (`Solution`)
8. `phone-mockup` — Letters, pals, and onboarding (`Solution`)
9. `results` — What the concept delivered (`Results`)
10. `constraints` — Evidence and accessibility boundaries (`Reflection`)
11. `key-decisions` — Design decisions (`Reflection`)
12. `text` — Closing reflection (`Reflection`)

## Section-by-Section Specification

### 1. Executive Summary

| Field | Specification |
| --- | --- |
| Type | `executive-summary` |
| Heading | `A digital space for letters worth returning to` |
| Chapter | None |
| Body | Use the Problem, Solution, and Outcome copy above. |
| Media | `letters-app-hero.webp` |

### 2. What I Designed

| Field | Specification |
| --- | --- |
| Type | `what-i-designed` |
| Heading | `What I designed` |
| Chapter | None |
| Body | Use the five feature cards above. |

### 3. Communication With Room to Mean Something

| Field | Specification |
| --- | --- |
| Type | `text` |
| Heading | `Communication with room to mean something` |
| Chapter / navLabel | `Context` / `Context` |
| Body | `<strong>Letters App makes a case for a different pace of communication.</strong> The product is organised around reading, writing, and replying to stories that need more than a few lines. The design gives a letter its own space, preserving its author, date, images, places, and the invitation to respond.` |

### 4. Principles for Thoughtful Correspondence

| Field | Specification |
| --- | --- |
| Type | `key-decisions` |
| Heading | `Designing for reading, reflection, and reply` |
| Chapter | `Context` |
| Body | `- <strong>Let letters read like letters.</strong> Protect generous typography, a clear reading column, and space for images.\n- <strong>Keep the reply close to the story.</strong> Make responding feel like a continuation, not a context switch.\n- <strong>Make authorship visible.</strong> Surface the writer, date, imagery, and place where the letter provides them.\n- <strong>Turn writing into a guided sequence.</strong> Composition, visual treatment, preview, and posting each have a clear state.` |

### 5. A Web Home for Returning to Letters

| Field | Specification |
| --- | --- |
| Type | `full-image` |
| Heading | `A home built for returning to stories` |
| Chapter / navLabel | `Solution` / `Solution` |
| Body | `<strong>The web home prioritises correspondence over a generic social feed.</strong> Continue Reading and Recent Posts give the reader two useful ways back into the product, while search and primary navigation stay available without competing with the letters.` |
| Media | `letters-app-landing-page-full.webp`; use as CoverScroll and retain the complete 1440 × 2388 source frame. |

### 6. Reading and Replying on the Web

| Field | Specification |
| --- | --- |
| Type | `carousel` |
| Heading | `A letter can hold a whole journey` |
| Chapter | `Solution` |
| Body | `Use one wide web state per slide: the web home, the full reading view, the reply modal, and the expanded reply/editor state. <strong>Each slide must keep the long-form letter readable at portfolio scale.</strong>` |
| Captions | `Browse recent and continuing letters.` / `Read a letter with imagery and place context.` / `Reply without leaving the letter.` / `Compose in a focused writing surface.` |

### 7. Writing a Letter Step by Step

| Field | Specification |
| --- | --- |
| Type | `phone-mockup` |
| Heading | `Writing is guided without taking over the author’s voice` |
| Chapter | `Solution` |
| Body | `<strong>The iPhone flow makes the editorial choices visible.</strong> The writer composes a letter, chooses imagery or a visual treatment, previews the result, and posts only when it is ready.` |
| Phone treatment | Side-by-side pair: compose and preview/post. |
| Captions | `Compose a letter and choose its visual treatment.` / `Preview the finished letter before posting.` |
| Media | `phone/letters-app-phone-compose.webp`, `phone/letters-app-phone-preview-post.webp` |

### 8. Letters, Pals, and Onboarding

| Field | Specification |
| --- | --- |
| Type | `phone-mockup` |
| Heading | `A correspondence product needs a clear way in and back` |
| Chapter | `Solution` |
| Body | `The supporting mobile states establish the product beyond one letter: <strong>onboarding introduces its promise, My Letters separates sent and received correspondence, and My Pals makes the people behind the letters discoverable.</strong>` |
| Phone treatment | Up to two phones per row; use two rows if all three states are retained. |
| Captions | `Welcome and sign-in entry point.` / `Sent and received letters.` / `People behind the correspondence.` |
| Media | `phone/letters-app-phone-onboarding.webp`, `phone/letters-app-phone-my-letters.webp`, `phone/letters-app-phone-my-pals.webp` |

### 9. Results

| Field | Specification |
| --- | --- |
| Type | `results` |
| Heading | `What the concept delivered` |
| Chapter / navLabel | `Results` / `Results` |
| Body | `- A responsive web experience for discovery and long-form letter reading.\n- A complete mobile correspondence flow from onboarding through writing, visual choices, preview, posting, sent/received letters, and pals.\n- A coherent interaction model in which a letter carries story, imagery, place, author context, and a direct reply path.\n\n<strong>Do not add engagement, retention, letter-length, or audience figures without a verifiable source.</strong>` |

### 10. Constraints and Accessibility Boundaries

| Field | Specification |
| --- | --- |
| Type | `constraints` |
| Heading | `A slower experience still needs to be easy to use` |
| Chapter | `Reflection` |
| Body | `- Long-form reading requires resilient typography, contrast, focus order, and image alt text.\n- The product concept is evidenced by designed screens, not by a measured accessibility study or live-product outcome.\n- The visual-assistance and image-generation states shown in the flow should be described only as interface concepts; do not claim autonomous writing or generated content quality.` |

### 11. Key Decisions

| Field | Specification |
| --- | --- |
| Type | `key-decisions` |
| Heading | `Key decisions` |
| Chapter | `Reflection` |
| Body | `- <strong>Use the web home as CoverScroll.</strong> It is a true, continuous 1440 × 2388 product frame.\n- <strong>Use wide web states in the carousel.</strong> These are native responsive-web frames, not desktop treatments invented for the portfolio.\n- <strong>Use iPhone exports in phone bezels.</strong> The writing, preview, onboarding, My Letters, and My Pals states are all 375 × 812 mobile frames.\n- <strong>Keep personality or communication analysis only if the final Stage 8 node contains those real artifacts.</strong> They are not needed to explain the primary product flow.` |

### 12. Closing Reflection

| Field | Specification |
| --- | --- |
| Type | `text` |
| Heading | `Designing for a response worth writing` |
| Chapter | `Reflection` |
| Body | `<strong>Letters App treats communication as something people can return to, not simply clear from an inbox.</strong> The work connects the calm of a long reading surface with the practical steps needed to create and send a reply. The next challenge would be validating whether this pace helps people build more meaningful correspondence.` |

## Asset Requirements

Export final top-level Figma frames at **2× WebP**, using original frame bounds. Do not export Figma canvas, selection controls, or browser chrome.

| Placeholder path | Stage 8 source | Treatment / use |
| --- | --- | --- |
| `letters-app/letters-app-hero.webp` | `Web Homepage` (`274:1786`) or the final orange product composition in the Submission canvas | Wide hero; choose the composition that shows both web and mobile without adding a device mockup not in Figma. |
| `letters-app/letters-app-landing-page-full.webp` | `Web Homepage 2` (`274:1818`, 1440 × 2388) | Required CoverScroll. Export the full frame as one continuous image. |
| `letters-app/carousel/letters-app-web-home.webp` | `Web Homepage 2` (`274:1818`) | Wide carousel slide — browse and continue reading. |
| `letters-app/carousel/letters-app-web-letter.webp` | `Reply/Create a letter` web reading frame (`293:3667` or final variant) | Wide carousel slide — long-form reading with imagery and location. |
| `letters-app/carousel/letters-app-web-reply.webp` | Reply modal state in the web letter frames | Wide carousel slide — in-context reply. |
| `letters-app/carousel/letters-app-web-compose.webp` | Web editor frame (`293:3843`) | Wide carousel slide — focused composition. |
| `letters-app/phone/letters-app-phone-compose.webp` | `Write a letter` section: final compose state (for example `274:2651`) | Phone bezel — compose and choose visual treatment. |
| `letters-app/phone/letters-app-phone-preview-post.webp` | `Write a letter` section: `Homepage post 33` (`274:2372`) | Phone bezel — preview and post. |
| `letters-app/phone/letters-app-phone-onboarding.webp` | `onboarding1` (`2001:883`) | Phone bezel — welcome, log in, sign up. |
| `letters-app/phone/letters-app-phone-my-letters.webp` | `My letters 2` (`274:2396`) | Phone bezel — sent and received letters. |
| `letters-app/phone/letters-app-phone-my-pals.webp` | Final My Pals mobile frame in Submission | Phone bezel — correspondence network. |

## Image Migration

| Current path | New path | Used in section |
| --- | --- | --- |
| `letters-app-cover.webp` | Keep as-is | Homepage card |
| `letters-app-homepage-post-1.webp` | `letters-app/phone/letters-app-phone-compose.webp` | Writing flow, pending exact Stage 8 replacement |
| `letters-app-homepage-post-2.webp` | `letters-app/phone/letters-app-phone-preview-post.webp` | Writing flow, pending exact Stage 8 replacement |
| `letters-app-my-letters.webp` | `letters-app/phone/letters-app-phone-my-letters.webp` | Letters, Pals, and Onboarding |
| `letters-app-my-pals.webp` | `letters-app/phone/letters-app-phone-my-pals.webp` | Letters, Pals, and Onboarding |
| `letters-app-persona-details.webp` | Do not migrate by default | Retain only if confirmed as a real Stage 8 artifact |
| `letters-app-personality-analysis.webp` | Do not migrate by default | Retain only if confirmed as a real Stage 8 artifact |
| `letters-app-showcase.webp` | Superseded by final Stage 8 mobile exports | Do not use as a primary visual |

## Chapter Mapping

| Current section | New section | Rationale |
| --- | --- | --- |
| The tension between speed and thoughtfulness | Communication with room to mean something | Grounds the narrative in the actual letter-first interaction model. |
| The inbox experience | A web home for returning to letters | Uses the verified responsive web home and its continuing/recent reading hierarchy. |
| Designing for anticipation | Principles for thoughtful correspondence | Recasts the idea as explicit interaction decisions. |
| Writing and connecting | Writing a Letter Step by Step | Uses the complete Stage 8 mobile flow rather than generic single screenshots. |
| Personality and connection | Letters, Pals, and Onboarding | Keeps the social dimension; personality artifacts are conditional on source verification. |
| Key results | What the concept delivered | Removes fabricated metrics and uses verifiable design scope. |
| Accessibility as a feature | Constraints and Accessibility Boundaries | Keeps the concern without claiming undocumented validation. |
| Showcase | Reading and Replying on the Web | Replaces a single phone screenshot with the stronger web story. |
| Reflections | Closing Reflection | Retains reflection in the chaptered structure. |

## Non-Negotiable Facts

- Category: `Communication`
- Role: `Sole product designer — end-to-end product design`
- Slug: `letters-app`
- `nextSlug`: `credlane`
- `prevSlug`: `todo-app`

## Remove

- `240 words` average letter length, `78%` response rate, `82%` retention, and `12k+` DAU.
- Generic claims that are not visible in Stage 8.
- Persona/personality assets if they cannot be confirmed as final Figma exports.

## Keep

- The core idea of thoughtful, emotionally resonant correspondence.
- The web and mobile product states documented in Stage 8.
- The accessibility concern, expressed as an implementation requirement rather than an unproven outcome.
- Personality or communication analysis only after confirming the final source frame.

## Completion Review

- Stage 8 establishes a real responsive web product and a real iPhone flow, so CoverScroll, carousel, and phone-mockup roles are all source-appropriate.
- All fabricated metrics are excluded from proposed copy.
- Asset paths are under `public/images/case-studies/letters-app/`; the homepage cover remains unchanged.
- The only unresolved asset decision is whether the older persona/personality sheets have matching final Stage 8 frames. Do not migrate them until confirmed.
