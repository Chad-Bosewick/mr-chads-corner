# Claude Code Task — Career Timeline Hero

## Task ID
CODEX-CAREER-TIMELINE-HERO

## Title
Turn the mini-game into a career/life timeline interaction with the mascot as the moving brand cue

## Objective
Rework the current hero mini-game into a subtle timeline interaction that communicates Temi Adekunle's career and life milestones.

The mascot must remain. Instead of dodging obstacles, it should move along a horizontal timeline. As it passes timeline markers, each marker reveals a short milestone note about a career achievement or meaningful life moment.

The result should feel editorial, authored, and useful to the target audience. It should not feel like a game.

## Product context
The current interaction is playful, but the homepage needs to do more work for the user:

- communicate credibility
- show progression quickly
- give personality without wasting attention
- support scanning on desktop and mobile

The new direction should make the first screen feel more like a living introduction than a novelty.

## Design direction

- Keep the mascot as the recurring visual identity.
- Replace obstacle-dodging with a timeline track and milestone markers.
- Make the motion calm and deliberate, not game-like.
- Use short, legible milestone notes.
- Reveal one milestone at a time as the mascot passes it.
- Avoid score, failure states, timers, or “win/lose” language.

## Required interaction model

1. The mascot moves left to right across a timeline.
2. Timeline markers represent milestones in chronological order.
3. When the mascot reaches a marker, that milestone note becomes visible.
4. The note should appear in place, with a subtle fade or slide.
5. The interaction should be understandable without instructions after one glance.

## Questions you must ask the user before implementing

Ask these questions first, wait for the answers, then implement:

1. Which 3 to 5 milestones should be shown on the homepage timeline?
2. For each milestone, what is the short note text you want displayed?
3. Should the milestones be strictly chronological, or grouped by theme?
4. Do you want the notes to sound factual, personal, or editorial?
5. Are there any dates or years that must appear next to specific markers?

If the user does not already have the milestone content ready, help them define it by asking for:

- early career origin
- first major product/design role
- a notable shipped project
- a leadership or public-facing milestone
- a recent or current focus

## Implementation constraints

- Keep the mascot visible and recognizable.
- Reuse the existing hero area and existing canvas-based interaction if practical.
- Keep the motion subtle and performant.
- Respect `prefers-reduced-motion`.
- Keep the timeline readable on mobile.
- Do not introduce a heavyweight game loop unless it is necessary.
- Do not add scorekeeping, collision punishment, or game-over states.

## Visual requirements

- The timeline should feel like a refined editorial strip.
- Milestone notes should feel like short callouts, not tooltips.
- The mascot should lead attention, but the milestones should carry the meaning.
- The interaction should reward curiosity without demanding effort.

## Acceptance criteria

- [ ] Mascot remains in the hero
- [ ] Obstacles are replaced by timeline markers
- [ ] Passing a marker reveals a milestone note
- [ ] Notes are concise and readable
- [ ] No score or fail state exists
- [ ] `prefers-reduced-motion` is respected
- [ ] Mobile layout remains clean and legible
- [ ] The user is asked for milestone content before implementation

## Likely files affected

- `src/components/sections/EditorialHero.tsx`
- `src/components/effects/MiniGame.tsx`
- `src/hooks/useMiniGame.ts`
- possibly a small new timeline data file if the content needs to be separated cleanly

## Required output

Return:

1. A short summary of the chosen interaction direction
2. The questions asked and the user's answers
3. The files changed
4. A note confirming reduced-motion handling
5. A screenshot or preview URL after implementation
