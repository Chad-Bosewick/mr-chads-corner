# MR CHAD PORTFOLIO REDESIGN — PROJECT STATE

> **This file is the single source of truth for project status.**
> Every agent (Claude Code, Codex, ChatGPT) must read this before starting work.
> Do not re-investigate completed work. Trust the phase reports in `docs/qa/`.
>
> **Updated by Claude Code** after each sprint or significant milestone.

---

## Current branch: `foundations`
## Deployed: Yes — live at https://mrchadsite.netlify.app/
## Remote: https://github.com/Chad-Bosewick/mr-chads-corner
## Last updated: 2026-08-02

---

## Active Work

**UI polish batch (7 items)** (started 2026-08-01)
- Spec: `docs/superpowers/specs/2026-08-01-ui-polish-batch-design.md` — approved (commits `599803e`, `9db0b01`)
- Plan: `docs/superpowers/plans/2026-08-01-ui-polish-batch.md` — implementation-ready, 6 tasks (commit `8160d3a`)
- Task: `tasks/2026-08-01-codex-ui-polish-batch.md` (UI-POLISH-001) — **handed to Codex for implementation**
- Items: (1) H2 2023 timeline note copy; (2) carousel active-pill **slides** between dots; (3) footer availability dot **breathes** ~2.8s; (4) footer email link label → "Email"; (5) interest-card **like hearts** (session-only); (6) contact page **mailto ice-breaker form** (Email/Social links removed, none under the form); (7) footer **wordmark ASCII scribble** "Temi Adekunle" ↔ "Chad Bosewick" (static "Temi Adekunle" under reduced motion / no-JS).
- **Implementation: complete** by Codex — 6 commits `da16c39`→`3831904`. Claude Code orchestration review (2026-08-01): **passed** — diffs match plan/spec; 16 focused tests pass; typecheck + lint clean; working-tree guardrail held.
- **Pre-existing (not from this batch):** `CoverScroll.test.tsx` has 2 failing assertions (`expect(...transform).toBe("")` gets `translateY(0px)`). Reproduced identically at the pre-Codex commit `1507d7b` in a throwaway worktree; not caused by the UI polish batch. Open a separate fix task.
- **Browser QA (Claude Code, 2026-08-01): passed** — all 7 items verified at 1440px and 375px (no horizontal overflow, touch targets ≥44px, form fits 335px). Reduced-motion verified deterministically via source guards + 12 unit tests covering both branches (browse tool has no reduced-motion emulation). Mailto verified via 4 unit tests (headless blocks external protocols). Evidence: `docs/qa/2026-08-01-ui-polish-batch-claude-qa-report.md`. Suite: 50/52 (only the 2 pre-existing `CoverScroll` failures).
- **Post-QA regression found & fixed (2026-08-02):** item 7 (footer wordmark) never animated after reload — effect ran before the canvas mounted and never re-ran (`mounted` missing from deps at `FooterAsciiBrand.tsx:176/299`). Fixed + regression test added; suite now **51/53**. Re-verified at 1440px and 375px (canvas sized and live-drawing; the 375px viewport that originally showed the blank canvas).
- **Codex iteration on the wordmark fix (commit `5122ed3`, 2026-08-02):** static SVG retained beneath the canvas until first draw (no blank gap), footer already in view draws immediately, particle anchors shuffled for a genuine scramble morph. **Orchestration review passed** — diffs match scope, focused tests 4/4, full suite **52/54**, typecheck + lint clean, browser re-verified at 1440px and 375px. This is the corrected state under review.
- **Shared-constellation footer (commit `1a62fbf`, 2026-08-02):** footer wordmark evolved from a mechanical name-swap into a narrative signature — one-shot **gather-on-arrival** (900ms, dispersed→Temi), then the Temi↔Chad morph passes through a **shared-constellation instant** (45% opacity dip via `footer-shared-constellation` keyframes under `prefers-reduced-motion: no-preference`), dwell 1600ms, cycling forever. **Global pause now freezes the wordmark** (was a WCAG 2.2.2 gap — hero paused but footer didn't). Re-entry resumes mid-cycle without re-gathering. Deterministic seeded jitter (±5px) keeps the dispersed field stable across pause/resume. Task: `tasks/2026-08-02-codex-footer-shared-constellation.md`.
- **Carousel indicator morph (commit `6b184d5`, 2026-08-02):** Travecs carousel indicator changed from a sliding overlay pill to an **in-place morph** — the selected dot (structurally 20×8) expands `scale-x-100` while the previous contracts to `scale-x-[0.4]` (8×8 circle); reduced-motion switches states instantly (`transition-none`). 44px targets, `aria-current`, focus, interaction lock unchanged. **NOTE — this reverses item 2 of the UI polish batch spec (approved pill-slide); user-directed pivot.** Orchestration review **passed** — scope held to 2 files; carousel suite **7/7**, full suite **55/57** (only pre-existing `CoverScroll` failures), typecheck + lint + build clean. Browser QA (Claude Code): **passed** — 15 indicators live, `.carousel-pill` overlay absent, computed classes confirm active indicator holds `scale-x-100` and inactive `scale-x-[0.4]` after advancing.
- **Orchestration review of `1a62fbf` (2026-08-02): passed.** Diff matches spec — scope held to 2 files (component + test), no new deps, static reduced-motion fallback byte-for-byte unchanged. Footer suite **7/7**, full suite **55/57** (only the 2 pre-existing `CoverScroll` failures), typecheck + lint clean, **production build passes** (Codex's Google-Fonts network caveat does not reproduce locally). Browser QA (Claude Code, headless Chromium): **passed** — live state machine observed `dispersed → gather(720 particles) → dwellA` at 1440px and 375px; constellation keyframes present in the animated SVG `<style>` (50%/0.45, media-gated); pause click froze the phase mid-gather (`aria-pressed=true`, phase stable 1.2s past the window); no horizontal overflow at 375px; wordmark width exactly 375px. Reduced-motion verified via source guard + unit tests (browse cannot emulate it).
- **Next:** hand to **ChatGPT** for independent QA (pipeline stage 7).
- Scope guardrail: six touched files + two new components + new tests; no new dependencies. Do not stage `tsconfig.tsbuildinfo`, `next-env.d.ts`, `.superpowers/`, `*.mjs` QA scripts, `temi's cvs/`, `tasks/2026-07-30-codex-feedback-round-1.md`, or `ascii wordmark footer sample.jpg` (pre-existing untracked).

**UI polish batch 2 — 4 items** (tasked 2026-08-02, from localhost QA review)
- Task: `tasks/2026-08-02-codex-ui-polish-batch-2.md` (UI-POLISH-002) — **implemented by Codex** (4 commits `ec3c3e5`, `c324117`, `4c07a0a`, `b4e5173`; 10 files, 210+/10-).
- Items: (1) **pause control rescope** — global pause button renders only while the hero ASCII field (`[data-hero-band]`, home) or the footer wordmark is in viewport; unmounted otherwise; paused state persists; hidden under reduced motion; (2) **interest heart affordance** — 24px icon in the 44px like button + `group-hover:scale-110` (reduced-motion-safe); (3) **contact message-field padding** — `py-3` on the message textarea only (single-line inputs untouched); (4) **CTA system** — shared `buttonVariants` class map: primary solid pill (Contact Send message), secondary tonal pill (About Download CV, converted from `rounded-lg`), tertiary accent text link (Home Get in touch, gains focus-visible outline). Hierarchy from fill, not radius.
- **Orchestration review + browser QA (Claude Code, 2026-08-02): 3 of 4 items PASS; item 1 has a Critical defect on the home page.** Evidence: `docs/qa/2026-08-02-ui-polish-batch-2-claude-qa-report.md`. Items 2 (heart 24px + compiled `group-hover:scale-110`), 3 (message field `py-3`=12px, single-line inputs untouched), and 4 (all three CTAs on shared variants; Send message + Download CV render 44px pills, Get in touch text link) verified in-browser. Item 1: `querySelector("footer")` matches the **testimonial attribution footer** (`TestimonialBlock.tsx:20`, 24px) instead of the site footer (`Footer.tsx:42`, 723px, wordmark) — the pause button is absent at the bottom of the home page while the wordmark it governs is in view. Non-home pages (single footer) pass. Suite 61/63 (2 pre-existing `CoverScroll` failures).
- **Fix task queued:** `tasks/2026-08-02-codex-ui-polish-2-pause-footer-selector-fix.md` (UI-POLISH-002-FIX-1) — change selector to `footer[aria-label="Site footer"]` + test fixture update.
- **Item-1 fix implemented & verified (commit `b855c75`, 2026-08-02):** selector changed to `footer[aria-label="Site footer"]` (one line, `AnimationProvider.tsx:55`) + test fixture updated to mirror real site structure. Orchestration review passed — diff matches the fix task, scope held to 2 files, suite **61/63** (only the 2 pre-existing `CoverScroll` failures), tsc + lint clean. Browser re-verified (Claude Code): at the exact defect window (scrollY 3787, bottom of home page) the site footer is in view (top −3) with the wordmark visible and the **pause button present** — previously absent. Product owner confirmed the fix works on localhost. **Item 1 now PASS — batch is 4/4.**
- **CV black-and-white (commit `4c0cbcb`, 2026-08-02):** downloadable CV re-rendered in pure black and white — `public/cv/cv.html` all brand colors (`#A43718`, `#151515`, muted grays) → `#000`; PDF regenerated (147604 → 160655 bytes). Orchestration review passed — scope held to 2 files, no duplicate template, `out/` build artifact synced, both Download CV links target the regenerated PDF; PDF visually verified renders B&W. `temi's cvs/` working copy remains the pre-change colored PDF (untracked, outside repo).
- **Next:** hand the whole batch to **ChatGPT** for independent QA (pipeline stage 7) — batch now 4/4 PASS after the fix.

**ASCII field unravel** (started 2026-07-31)
- Spec: `docs/superpowers/specs/2026-07-31-ascii-unravel-design.md` — approved (commit `3bde563`)
- Plan: `docs/superpowers/plans/2026-07-31-ascii-unravel.md` — implementation-ready (commit `7a6f6eb`)
- Implementation: **complete** by Codex (commit `ad42937`, `feat: unravel ascii field below the hero`)
- Claude Code orchestration review (2026-08-01): **passed**. Browser QA at 1440×900 and 375×812 verified — field recession to flat by ~1.15 viewports, hero-only heart dissolving at the band edge, mobile no-idle-heart + tap-to-beat, interactive-tap rejection, no-hero pages field-only, pause-freeze (same gate as reduced motion). 9/9 helper tests pass.
- **Next:** hand to **ChatGPT** for independent QA (pipeline stage 7).
- **Known deviation (P2):** anchor-return spring at `useAsciiShader.ts:299-304` uses `particle.maxDrift * 1.6` instead of the plan-required `driftRadius * 1.6`, damping the unravel's spread to ~2/3 of intended. Imperceptible at the field's 1–4% alpha; one-line fix. See `tasks/2026-08-01-codex-ascii-unravel-spring-fix.md`.
- Scope guardrail: only `useAsciiShader.ts` and `EditorialHero.tsx` changed; one new test file; no new dependencies. Do not stage `tsconfig.tsbuildinfo` or the repo's existing untracked files.

---

## What's Done

| Phase | Scope | Report |
|---|---|---|
| Core architecture | Navigation, footer, pages, case study system, content model, styling, motion | Commit history on `foundations` branch |
| Phase A | Travel gallery grid, heading hierarchy, homepage copy, comparison section spacing | `docs/qa/2026-07-26-codex-ui-cleanup-phase-a-report.md` |
| Phase B | Accessibility contrast tokens — all `#757575` replaced with WCAG AA-compliant `#6F6F6F` | `docs/qa/2026-07-26-codex-ui-cleanup-phase-b-report.md` |
| Phase C | Root metadata (`metadataBase`, OG, Twitter), social preview image, stable sitemap dates, case-study index copy fix | `docs/qa/2026-07-26-codex-ui-cleanup-phase-c-report.md` |
| Phase D | Font mocking removal — real Plus Jakarta Sans + Lora now self-hosted | `docs/qa/2026-07-26-codex-phase-d-report.md` |
| Content fixes | Bio: architecture → biochemistry (UoL). Location: London → Lagos | Verified in source |
| UI-001 | CoverScroll viewport-gated animation start | `tasks/2026-07-26-codex-cover-scroll-viewport-gate.md` |
| UI-002 | Bezel standardisation — all device mockups now use `p-[1.5px]` stroke, matching CoverScroll | `docs/qa/2026-07-26-codex-ui-002-report.md` |
| UI-003 | Letters App dual-phone layout — 3 Codex iterations (positioning fix, left-alignment, 440px stage) | `docs/qa/2026-07-26-codex-ui-003-left-aligned-bezel-handoff.md` |
| A11Y-PERF-001 | Animation pause controls (WCAG 2.2.2), timeline SR alternative, carousel preload verification, CoverScroll geometry/pause-resume fix | `docs/qa/2026-07-27-a11y-perfection-chatgpt-review.md` |
| CV/Resume page | `/about-temi` — hero, summary, experience timeline, skills & education, full-width tools with brand icons, interest collage | `6320d64` |
| Contact page layout | `/contact` — single left-aligned layout matching CV page, mailto email, social links | `6320d64` |
| PDF generation | CV downloadable PDF with phone, email; updated CV HTML template | `6320d64` |
| CV content rectification | **CV (`temi-adekunle-cv.pdf`) is source of truth for company/product descriptions** — Candidote = recruitment platform, Enviodeck = logistics platform. `/about-temi` Experience timeline + intro summary rectified to match the CV; `temi's cvs/` folder reduced to the single true CV | 2026-07-31 |
| CV revision (1 page, ATS) | LinkedIn & Dribbble removed from CV (contact is phone + email only); condensed to one page; single-paragraph ATS-optimized summary; experience bullets end with periods; recruitment/logistics content preserved; re-rendered PDF deployed to `public/downloads/` and `temi's cvs/` | 2026-07-31 |
| CV black-and-white | Downloadable CV re-rendered in pure black & white — `public/cv/cv.html` all brand colors → `#000`, PDF regenerated (160655 bytes), both Download CV links target the regenerated PDF | `4c0cbcb` (2026-08-02) |
| Usability fix batch (Codex audit) | Pause button click isolation (no navigation from inside card links); TOC anchor IDs on Letters App/TODO++ + `scroll-mt-16`; certificate date aligned to timeline (Oct 2023) in CV + `/about-temi`; route-specific OG/Twitter/canonical metadata; heading skip fixed on case-studies index (project titles now `h2`); tool label contrast → `#6F6F6F`; `aria-controls`/`id` wired on mobile menu | 2026-07-31 |
| Phone-carousel clipping fix | `PhoneBezel` sizes from available frame height (`fitHeight`) so 9:19 phones fully fit the fixed 8:5 hero and 16:10 section carousels on TODO++ & Letters App at all breakpoints — verified at 390px and 1440px; standalone `PhoneMockupSection` untouched (no regression) | 2026-07-31 |
| Social link sync | LinkedIn & Dribbble links added to all locations (footer, contact page, CV page hero and closing CTA) | `6320d64` |
| Deployment | Site pushed to GitHub (`mr-chads-corner`) and deployed to Netlify | https://mrchadsite.netlify.app/ |

---

## What's Next (Priority Order)

| Priority | Task | Why |
|---|---|---|
| ~~**UI-003**~~ | ~~ChatGPT QA review of dual-phone composition~~ | ~~Done — deployed.~~ |
| ~~**A11Y-PERF-001**~~ | ~~ChatGPT QA review of accessibility/performance batch~~ | ~~Done — deployed.~~ |
| ~~**P1**~~ | ~~Deploy foundations branch to Netlify~~ | ~~Live at https://mrchadsite.netlify.app/~~ |
| **P1** | **UI polish batch 2 (4 items) + CV B&W** — **implemented, orchestration review + browser QA passed 4/4** (commits `ec3c3e5`, `c324117`, `4c07a0a`, `b4e5173`, `4c0cbcb`, `b855c75`) | Item-1 pause-footer defect fixed and browser-verified (2026-08-02); awaiting **ChatGPT independent QA** (stage 7) |
| **P1** | **UI polish batch (7 items)** — **implemented, orchestration review passed, browser QA passed** (commits `da16c39`→`3831904`) | Browser QA complete (2026-08-01); awaiting **ChatGPT independent QA** (stage 7) |
| **P1** | ASCII field unravel — **implemented, verified, awaiting ChatGPT QA** (commit `ad42937`) | Browser QA passed (2026-08-01); one P2 spring fix queued; ChatGPT QA next |
| **P2** | `CoverScroll.test.tsx` — 2 pre-existing failing assertions (transform `""` vs `translateY(0px)`) | Reproduced at pre-batch commit `1507d7b`; not caused by UI polish batch |
| **P2** | Custom domain setup (Netlify) | If desired — replace mrchadsite.netlify.app with a branded URL |
| **P2** | Test coverage for risky behaviour (carousels, animations, navigation) | Sprint 2 |
| **P2** | Merge `foundations` into `main` | Clean up branch history |

---

## Known Issues

Full backlog of all P1 and P2 issues: `CODEX_REVIEW_DEFERRED.md`
Already-fixed items are marked with status in that file.

---

## How to update this file

Only Claude Code updates this file. After each sprint or milestone:

1. Update **What's Done** — move completed items from What's Next or add new phase entries
2. Update **What's Next** — reorder priorities, strikethrough completed items, add new tasks
3. Update **Last updated** date
4. Remove or archive stale session-handoff context (UI-003 style notes) when no longer actionable
5. Update **Known Issues** or link to `CODEX_REVIEW_DEFERRED.md`
