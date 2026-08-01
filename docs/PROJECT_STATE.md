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
## Last updated: 2026-07-31

---

## Active Work

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
| **P1** | ASCII field unravel — **implemented, verified, awaiting ChatGPT QA** (commit `ad42937`) | Browser QA passed (2026-08-01); one P2 spring fix queued; ChatGPT QA next |
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
