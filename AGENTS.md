# MR CHAD PORTFOLIO REDESIGN
## AGENT EXECUTION PLAYBOOK — CODEX & CHATGPT

This file is the execution-side counterpart to `CLAUDE.md`. It tells Codex (implementation) and ChatGPT (independent QA) how to receive work, what to produce, how to communicate back to Claude Code, and what constraints apply to every task.

Do not read this file first. Read `docs/PROJECT_STATE.md` first — it is the single source of truth for current project status. Then use this file for execution guidance.

---

# 1. Purpose, Scope & Precedence

## What CLAUDE.md owns (do not duplicate here)

- Product direction, vision, and project objectives
- Design principles, experience direction, storytelling principles
- Team structure and decision authority
- Quality targets (accessibility, performance, responsive, SEO)
- QA severity classification
- Definition of Done
- Full delivery pipeline (Stages 1–10)
- Required project documentation list (PROJECT_BRIEF.md, TASTE.md, etc.)
- Change control policy

## What AGENTS.md owns

- How Codex and ChatGPT execute their assigned work
- Required formats, steps, and outputs per task type
- Non-negotiable guardrails that apply to every task
- Validation and evidence requirements
- Handoff contracts between agents
- Repository and collaboration protocols
- Escalation path for deviations

## Conflict precedence

1. User instruction (direct request from the project owner)
2. `CLAUDE.md` (product direction, authority, quality bar)
3. `AGENTS.md` (execution rules)
4. Individual task files (scope-specific)
5. Default agent behaviour

If `AGENTS.md` says something different from `CLAUDE.md`, `CLAUDE.md` wins.

---

# 2. Mandatory Start-of-Task Checklist

Both Codex and ChatGPT must complete this checklist before beginning any assigned work.

### 1. Read docs/PROJECT_STATE.md

- Know the current branch, deployed state, what's been completed, and what's next
- Do not re-investigate completed work — trust the phase reports in `docs/qa/`
- Check the "Known Issues" section for deferred items that may affect your task

### 2. Read CLAUDE.md Section 3 (AI Team Structure)

- Understand your role and responsibilities
- Understand decision authority boundaries

### 3. Read the assigned task file

- Identify the task ID, objective, scope, out-of-scope items, and acceptance criteria
- Note the "likely affected files" and "input files to read first" sections

### 4. Read AGENTS.md (this file)

- Refresh on the relevant section for your role (Codex → Section 4; ChatGPT → Section 5)
- Review guardrails (Section 3)
- Check validation and evidence requirements (Section 7)

### 5. Read supporting project documents

Where the task references them:

- `TASTE.md` — design philosophy and anti-patterns (if it does not yet exist, use CLAUDE.md Section 5 as the interim design reference)
- `FIGMA_AUDIT.md` — verified design findings
- `ARCHITECTURE.md` — stack decisions and structure
- `CONTENT_MODEL.md` — data schemas
- `CODEX_REVIEW_DEFERRED.md` — known issues and deferred items
- `tasks/` and `docs/qa/` — phase reports for prior context

### 6. Verify the working tree is known

- Run `git status` before making any changes
- Note any uncommitted work that is not part of your task — preserve it

---

# 3. Non-negotiable Guardrails

These apply to every task regardless of scope or urgency.

### No silent deviations

If implementation reveals that an approved requirement, design intent, or product behaviour cannot be delivered as specified, document the deviation and escalate to Claude Code. Do not silently change scope.

### Preserve unrelated work

If the working tree contains uncommitted changes outside your task scope, leave them untouched. Do not stage, commit, revert, or modify files unrelated to your assigned task unless explicitly instructed.

### No broad rewrites or dependency changes

Do not introduce new dependencies, remove existing dependencies, or perform broad refactoring outside the stated task scope. If a dependency change would improve the implementation, flag it to Claude Code for a separate decision.

### QA approval is not optional

Every substantial feature requires independent QA review before it is considered complete. An explicit Claude Code decision documented in `docs/PROJECT_STATE.md` can waive this, but the default is that ChatGPT signs off.

### Do not re-investigate completed work

Phase reports in `docs/qa/` and entries in `docs/PROJECT_STATE.md` represent verified project state. Do not re-audit completed phases or re-solve resolved problems. If new information contradicts a prior report, flag it to Claude Code.

### All delivery pipeline stages must complete

The Standard Delivery Pipeline (CLAUDE.md Section 14) is the default process. Do not skip stages. If a stage genuinely cannot be completed (e.g., no Figma design exists to verify), document the reason and escalate to Claude Code.

---

# 4. Codex Implementation Playbook

## 4.1 Task intake

Codex receives work via a task file in `tasks/` following the template conventions. Each task includes:

- **Task ID** — unique identifier (e.g., `UI-003`, `A11Y-PERF-001`)
- **Objective** — what the task achieves
- **Scope** — what is included and explicitly what is out of scope
- **Input files to read first** — files providing context before implementation begins
- **Technical context** — relevant file paths, component names, data structures
- **Design reference** — links to Figma, task files, or project docs
- **Acceptance criteria** — measurable pass/fail conditions for each deliverable
- **Validation method** — how to verify the implementation works

## 4.2 Implementation workflow

### Step 1: Start-of-task checklist (Section 2)
### Step 2: Explore the relevant code

- Read the input files specified in the task
- Understand existing patterns before writing new code
- Check `CODEX_REVIEW_DEFERRED.md` for known issues affecting the area

### Step 3: Implement

- Follow the technical principles in CLAUDE.md Section 10
- Respect the design principles in CLAUDE.md Section 8
- Match existing codebase patterns — naming, component structure, styling approach
- Every interactive element needs all states: default, hover, focus, active, disabled (where relevant)
- All motion must respect `prefers-reduced-motion`

### Step 4: Self-validate

Before reporting completion, run:

- `npm run build` or `next build` — must pass with no errors
- `npx tsc --noEmit` — must pass with no type errors
- `npm run lint` — must pass with no errors
- Visual check in dev server — desktop and mobile viewports
- Check that reduced-motion preferences work for any motion you added

Document any lint suppressions or type assertions with their justification.

### Step 5: Report

Submit a completion report following the Codex Task Output format (Section 8.2):

```
## Implementation summary
<what was done, key decisions, deviations>

## Files changed
<list of files modified or created>

## Decisions made
<important implementation choices>

## Deviations from task
<if any, why>

## Testing performed
<what was tested, what was not>

## Validation evidence
<build passes, types pass, lint passes>

## Known limitations
<what is not perfect, what remains risky>

## Preview instructions
<how to verify in the dev server>
```

## 4.3 Completion criteria

- All acceptance criteria from the task are satisfied
- Build, type check, and lint pass
- Desktop and mobile responsive behaviour verified
- Reduced-motion verified where applicable
- Report submitted to Claude Code
- No silent deviations from approved scope

---

# 5. ChatGPT Independent QA Playbook

## 5.1 Review request intake

ChatGPT receives review requests via a QA handoff file in `docs/qa/` following the QA Handoff template. Each request includes:

- **Review ID** — unique identifier (e.g., `A11Y-PERF-001-QA`)
- **Feature** — what is being reviewed
- **Review objective** — the specific decision requested
- **Approved requirement** — what was specified in the task
- **Design source** — Figma file, TASTE.md reference, or other authority
- **Environment** — browser, device, viewport context
- **Routes and states to review** — exact pages and interaction states
- **Acceptance criteria** — the criteria the implementation must meet

## 5.2 Review workflow

### Step 1: Start-of-task checklist (Section 2)
### Step 2: Read the approved requirement

- Read the task file referenced in the review request
- Understand the acceptance criteria before evaluating the implementation

### Step 3: Read supporting design references

- `TASTE.md` for design philosophy and anti-patterns (if it does not yet exist, use CLAUDE.md Section 5 as the interim design reference)
- `FIGMA_AUDIT.md` for verified design decisions
- Task file for the approved requirement

### Step 4: Review against criteria

- Does the implementation satisfy every acceptance criterion?
- Does it match the design intent (from Figma, TASTE.md, or task)?
- Does it respect the quality targets in CLAUDE.md Section 11?
- Test the specified routes, states, and viewport sizes
- Test keyboard navigation and screen-reader behaviour where relevant
- Test reduced-motion where relevant

### Step 5: Classify findings

Use the severity model defined in CLAUDE.md Section 15:

| Severity | Meaning |
|---|---|
| Blocker | Prevents release or core task completion |
| Critical | Serious user, quality, accessibility, performance, or credibility problem |
| Major | Meaningfully reduces quality or causes noticeable inconsistency |
| Minor | Non-blocking polish or consistency issue |
| Observation | Recommendation outside current acceptance criteria |

### Step 6: Report

Submit findings following the QA Findings format (Section 8.3):

```
## Review ID
<assigned review ID>

## Verdict
<Pass / Conditional Pass / Fail>

## Summary
<one-paragraph overview>

## Findings

### [Severity] Finding title
- **Location:** <route, component, state>
- **Expected:** <behaviour from acceptance criteria>
- **Actual:** <observed behaviour>
- **Evidence:** <screenshot reference, console output, WCAG violation>
- **Recommendation:** <specific fix suggestion>

### [Severity] Next finding
...

## Passed criteria
<list of acceptance criteria that are satisfied>

## Screenshots
<reference screenshots or links>
```

### 5.3 Re-review protocol

If Claude Code assigns follow-up tasks for defect resolution:

1. Confirm the defect has been resolved by re-testing
2. Check that the fix did not introduce regressions
3. Update the finding status to `Resolved` or flag remaining issues

## 5.4 Completion criteria

- All blocking and critical findings are documented
- Verdict is clearly stated (Pass / Conditional Pass / Fail)
- Passed criteria are listed alongside failures
- Screenshots or evidence are included where relevant
- Review is returned to Claude Code for triage

---

# 6. Figma Verification and Design-Evidence Protocol

## 6.1 When Figma is the source of truth

When a task states "Design reference: Figma", the Figma design is the primary authority for visual implementation. However:

- Figma findings become implementation authority **only once they are recorded in project documentation** (`FIGMA_AUDIT.md`) or in an approved task definition.
- A raw Figma inspection by ChatGPT is a finding — it becomes an instruction only after Claude Code records it as such.

## 6.2 Who inspects Figma

ChatGPT, through its connected Figma account, performs Figma inspections for:

- Design verification before implementation (Stage 3 of the delivery pipeline)
- Visual fidelity comparison during QA (Stage 7)
- Resolution of design ambiguities encountered during implementation

## 6.3 Codex and Figma

Codex may not have direct Figma access. If a task asks Codex to implement from a Figma design:

- The relevant design decisions must already be documented in the task or in `FIGMA_AUDIT.md`
- If a design ambiguity arises during implementation, Codex must raise it to Claude Code — not guess or invent a solution
- Codex should not inspect Figma directly unless explicitly instructed and authenticated

## 6.4 Evidence chain

```
Figma design
    → ChatGPT inspects and documents findings (FIGMA_AUDIT.md)
    → Claude Code approves and translates to task requirements
    → Codex implements from approved task
    → ChatGPT reviews implementation against design
    → Claude Code reconciles any gaps
```

---

# 7. Validation & Evidence Requirements

Every task output must include validation evidence. The table below shows the minimum requirements per task type.

## 7.1 Required checks

| Check | Codex implementation | ChatGPT review |
|---|---|---|
| `npm run build` / `next build` passes | Required | Verify reported |
| `npx tsc --noEmit` passes | Required | Verify reported |
| `npm run lint` passes | Required | Verify reported |
| Desktop visual check (1440px+) | Required | Required |
| Tablet visual check (768px) | Required | Required |
| Mobile visual check (375px) | Required | Required |
| Keyboard navigation check | Where interactions exist | Where interactions exist |
| Screen reader check | Where meaningful | Where meaningful |
| Reduced-motion check | Where motion added | Where motion changed |
| Hover/focus/active states | Where interactive elements change | Where interactive elements change |

## 7.2 Reporting evidence

- Screenshots should be captured at the relevant viewport width
- Console output from build/typecheck/lint commands should be included in the report
- If a check cannot be performed (e.g., no screen reader available), state this explicitly in the report — do not silently skip it
- For ChatGPT reviews, screenshots of actual (not simulated) browser rendering are preferred

## 7.3 Viewport test guide

The layout should behave intentionally across these categories (see CLAUDE.md Section 11.3 for full details):

- Small mobile (~320–374px)
- Modern mobile (~375–430px)
- Large mobile / phablet (~430–600px)
- Tablet (~600–900px)
- Small laptop (~900–1200px)
- Standard desktop (~1200–1600px)
- Wide desktop (~1600–1920px)
- Very large displays (1920px+)

Test at a minimum: 375px, 768px, 1440px. Add more where the layout has intentional breakpoints.

---

# 8. Task and QA Handoff Contracts

These sections define the exact format agents should follow when submitting work.

## 8.1 Task file format (Claude Code writes; Codex receives)

Task files live in `tasks/` following this naming convention:

```
tasks/YYYY-MM-DD-<task-id-slug>.md
```

Required sections:

```
# Task ID: <identifier>

## Objective

## Scope

## Out of scope

## Input files to read first

## Technical context

## Design reference

## Acceptance criteria

## Validation method
```

Existing examples: `tasks/2026-07-26-codex-ui-002-device-bezels.md`, `tasks/2026-07-27-codex-todo-case-study-rewrite.md`

## 8.2 Codex output format (Codex writes; Claude Code receives)

Codex completion reports should use a structured format within the Claude Code conversation (not a separate file unless specified):

```
## Implementation summary

## Files changed

## Decisions made

## Deviations from task (if any)

## Testing performed

## Validation evidence

## Known limitations

## Preview instructions
```

## 8.3 QA handoff format (Claude Code writes; ChatGPT receives)

QA handoff files live in `docs/qa/` following this naming convention:

```
docs/qa/YYYY-MM-DD-<feature-description>-handoff.md
```

Required sections:

```
# CHATGPT QA REVIEW REQUEST

## Review ID

## Feature

## Review objective

## Approved requirement

## Design source

## Environment

## Routes and states to review

## Acceptance criteria
```

Existing example: `docs/qa/2026-07-26-codex-ui-003-left-aligned-bezel-handoff.md`

## 8.4 QA findings format (ChatGPT writes; Claude Code receives)

ChatGPT findings should be submitted using the QA Handoff template (see `qa-handoff` skill). The response should include:

```
## Review ID

## Verdict (Pass / Conditional Pass / Fail)

## Summary

## Findings (per severity)

## Passed criteria

## Screenshots
```

---

# 9. Shared Repository & Collaboration Protocols

## 9.1 File system map

```
/
├── AGENTS.md                         # This file — agent execution playbook
├── CLAUDE.md                         # Orchestration prompt — product direction, status, authority
├── CODEX_REVIEW_DEFERRED.md          # Known issues and deferred items
├── TASTE.md                          # Design philosophy and anti-patterns
├── FIGMA_AUDIT.md                    # Verified Figma design findings
├── ARCHITECTURE.md                   # Technical architecture decisions
├── CONTENT_MODEL.md                  # Data schemas
│
├── docs/
│   ├── qa/                           # QA handoffs and reviews (ChatGPT outputs)
│   └── superpowers/
│       └── specs/                    # Design specs from brainstorming
│
├── tasks/                            # Implementation task definitions
│
├── public/
│   └── images/
│       └── case-studies/             # Case study images and assets
│
└── src/
    ├── app/                          # Next.js app router pages
    ├── components/                   # React components
    │   ├── case-study/
    │   ├── effects/
    │   ├── sections/
    │   └── ui/
    ├── content/
    │   ├── case-studies.ts
    │   └── projects.ts
    ├── hooks/
    └── styles/
```

## 9.2 Documentation ownership

| File | Owner | Purpose |
|---|---|---|
| `CLAUDE.md` | Claude Code | Project state, product direction, authority |
| `AGENTS.md` | Claude Code | Agent execution rules (this file) |
| `TASTE.md` | Claude Code | Design philosophy |
| `FIGMA_AUDIT.md` | Claude Code | Verified Figma findings (populated from ChatGPT input) |
| `ARCHITECTURE.md` | Claude Code | Technical decisions |
| `CONTENT_MODEL.md` | Claude Code | Data schemas |
| Task files (`tasks/`) | Claude Code writes for Codex | Implementation specs |
| QA handoffs (`docs/qa/`) | Claude Code writes for ChatGPT | Review requests |
| QA findings (`docs/qa/`) | ChatGPT writes | Review results |
| `CODEX_REVIEW_DEFERRED.md` | Claude Code | Deferred issue backlog |

Codex does not own project documentation files. Implementation observations should be reported to Claude Code, who records them in the appropriate document.

## 9.3 Git and branch conventions

### Branch naming

```
<type>/<short-description>
```

Examples: `fix/mobile-menu-a11y`, `feature/dual-phone-layout`, `chore/contrast-tokens`

### Commit conventions

- Each task produces at least one commit when completed
- Commit messages describe the "why", not just the "what"
- Reference the task ID where applicable: `UI-003: fix dual-phone positioning conflict`
- Do not amend published commits

Co-authored commits should include:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Working tree discipline

- Run `git status` before starting work to understand current state
- Stash unrelated changes rather than committing them
- If you must touch an unrelated file (e.g., to resolve a merge conflict), note it in the task report
- Do not use `git add -A` or `git add .` — stage specific files

## 9.4 Operational state updates

Only Claude Code updates `docs/PROJECT_STATE.md`. After completing a task:

- **Codex**: reports results in conversation; Claude Code reflects completion in the operational state
- **ChatGPT**: submits QA findings; Claude Code reflects the verdict in the operational state

## 9.5 Cross-agent messaging

- **Claude Code → Codex**: via task files in `tasks/`
- **Claude Code → ChatGPT**: via QA handoff files in `docs/qa/`
- **Codex → Claude Code**: via completion reports in conversation
- **ChatGPT → Claude Code**: via QA findings returned in conversation

Codex and ChatGPT do not communicate directly. All cross-agent communication passes through Claude Code as the orchestrator.

---

# 10. Escalation, Deviations & Change Control

## 10.1 When to escalate to Claude Code

Codex or ChatGPT must escalate when any of the following occur:

- A task requirement cannot be fulfilled as specified
- Implementation reveals a design ambiguity not covered by the task or design docs
- A guardrail (Section 3) would be violated by completing the task as stated
- New information contradicts a prior phase report in `docs/qa/`
- A dependency change, broad refactor, or scope addition would improve quality but is outside the task
- A task depends on unavailable assets, Figma access, or decision from the project owner

## 10.2 Deviation protocol

When a deviation from the approved task is unavoidable:

1. Document what was approved vs. what is proposed
2. State the reason (technical constraint, performance, accessibility, etc.)
3. Provide the recommended alternative
4. Wait for Claude Code decision before proceeding

Codex may not implement material deviations without Claude Code approval. ChatGPT may not approve deviations from the approved requirement without Claude Code confirming the scope change.

## 10.3 Scope creep protection

If during implementation or review a new idea, enhancement, or tangential fix arises:

1. Note it in the completion report as a future consideration
2. Do not implement it within the current task unless it is genuinely blocking
3. Claude Code will triage it into the backlog

---

# 11. Quick Reference: Key Files and Commands

## Codex: essential commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` / `next build` | Production build verification |
| `npx tsc --noEmit` | TypeScript type check |
| `npm run lint` | Lint check |
| `git status` | Check working tree state |
| `git diff` | Review changes before committing |

## File discovery

| What you need | Where to look |
|---|---|
| Current project status | `docs/PROJECT_STATE.md` |
| Known issues | `CODEX_REVIEW_DEFERRED.md` |
| Design philosophy | `TASTE.md` |
| Verified design decisions | `FIGMA_AUDIT.md` |
| Architecture decisions | `ARCHITECTURE.md` |
| Data schemas | `CONTENT_MODEL.md` |
| Phase reports | `docs/qa/` |
| Implementation tasks | `tasks/` |
| Case study data | `src/content/case-studies.ts` |
| Project data | `src/content/projects.ts` |

## CLAUDE.md cross-reference

| Topic | CLAUDE.md section |
|---|---|
| Design principles | Section 5 (Experience & Design Direction) |
| Technical principles | Section 7 |
| Quality targets | Section 8 (Quality Gates) |
| QA severity classification | Section 11 |
| Definition of Done | Section 12 |
| Full delivery pipeline | Section 10 |
| Team structure and authority | Section 2 |
| Change control policy | Section 14 |
