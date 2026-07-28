# MR CHAD PORTFOLIO REDESIGN — PROJECT STATE

> **This file is the single source of truth for project status.**
> Every agent (Claude Code, Codex, ChatGPT) must read this before starting work.
> Do not re-investigate completed work. Trust the phase reports in `docs/qa/`.
>
> **Updated by Claude Code** after each sprint or significant milestone.

---

## Current branch: `foundations`
## Deployed: No — awaiting deployment to Netlify
## Last updated: 2026-07-27

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

---

## What's Next (Priority Order)

| Priority | Task | Why |
|---|---|---|
| **UI-003** | ChatGPT QA review of dual-phone composition | Independent review before marking complete. Owner visual confirmation complete (5/5 states pass). |
| **A11Y-PERF-001** | ChatGPT QA review of accessibility/performance batch | Implementation complete, handoff ready. Awaiting independent QA. |
| **P1** | Deploy foundations branch to Netlify | After UI-003 visual confirmation + A11Y-PERF-001 QA approval. |
| ~~**P1**~~ | ~~Remove font mocking system~~ | ~~Done — Phase D (c1b6af6)~~ |
| ~~**P1**~~ | ~~Fix carousel pagination touch targets~~ | ~~Done — already 44×44px~~ |
| ~~**P2**~~ | ~~Add visible animation pause/stop controls (WCAG 2.2.2)~~ | ~~Done — A11Y-PERF-001 (awaiting QA)~~ |
| ~~**P2**~~ | ~~Add screen-reader-accessible career timeline alternative~~ | ~~Done — A11Y-PERF-001 (awaiting QA)~~ |
| **P2** | Test coverage for risky behaviour (carousels, animations, navigation) | Sprint 2. |

---

## UI-003 Key Context (session handoff)

The dual-phone layout went through 3 Codex iterations due to a Tailwind class conflict:

1. **Initial implementation**: `DeviceMockup` rebuilt with dual-phone variant, bezels standardised
2. **Positioning fix**: `relative` + `absolute` conflict in shared phone shell caused vertical stacking. Fixed by removing `relative` from shell helper, assigning position mode per caller.
3. **Left-alignment + wider stage**: Stage widened to 440px, left-aligned to match laptop bezel, phones at 240px/225px with ~25px overlap.

**Final specs:** stage `max-w-[440px] h-[540px]`, front `w-[240px] absolute left-0 top-0`, back `w-[225px] absolute right-0 top-12`. Page-level `coverSrcSecondary` prop wiring fixed in both `page.tsx` and `featured-case-studies/page.tsx`.

**⚠️ Visual confirmation required.** Run dev server, capture desktop and mobile screenshots of Letters App row, compare against acceptance criteria in `docs/qa/2026-07-26-codex-ui-003-left-aligned-bezel-handoff.md`.

**Committed:** `a8edce1` — 15 files changed, 1104 insertions.

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
