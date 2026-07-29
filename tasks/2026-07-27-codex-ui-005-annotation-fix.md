# UI-005 FIX — Annotation initial state bug

Date: 27 July 2026
Status: fix applied; awaiting Playwright visual retest
Priority: Major (blocks UI-005 visual confirmation)

## Problem

The TODO++ device annotations are not properly hidden in the default state and do not properly reveal on hover/focus. Visual confirmation via Playwright screenshots confirmed:

| State | Result |
|---|---|
| Desktop default | Annotations faintly visible (should be fully hidden) |
| Desktop hover | No clear change in annotation visibility (should reveal) |
| Desktop after-hover | Same as default |

## Root cause

`TodoDeviceAnnotations` in `src/components/ui/DeviceMockup.tsx` (lines 1-106) uses `motion.path`, `motion.circle`, and `motion.span` elements with `animate` props but **no `initial` props**.

Without `initial`, Motion uses the CSS default values as starting points:
- SVG paths/circles: opacity defaults to 1
- Span labels: opacity defaults to 1

When `isVisible` is false on mount, Motion tries to animate from CSS default (opacity: 1) to the target (opacity: 0), but the transition may not complete cleanly because the starting state is not explicitly set.

## Required fix

Add `initial` props to every animated element in `TodoDeviceAnnotations`:

### SVG paths (lines 29-56)

```tsx
// Before
<motion.path
  d="M78 66H142L205 87"
  stroke="rgba(21,21,21,0.3)"
  strokeWidth="1"
  animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
  transition={pathTransition(0)}
/>

// After
<motion.path
  d="M78 66H142L205 87"
  stroke="rgba(21,21,21,0.3)"
  strokeWidth="1"
  initial={{ opacity: 0, pathLength: 0 }}
  animate={{ opacity: isVisible ? 1 : 0, pathLength: isVisible ? 1 : 0 }}
  transition={pathTransition(0)}
/>
```

Apply the same pattern to all 4 `motion.path` elements (lines 29, 36, 43, 50).

### SVG circles (lines 63-72)

```tsx
// Before
<motion.circle
  key={`${cx}-${cy}`}
  cx={cx}
  cy={cy}
  r="2.5"
  fill="#A43718"
  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.4 }}
  transition={labelTransition(index * 0.06)}
  style={{ transformOrigin: `${cx}px ${cy}px` }}
/>

// After
<motion.circle
  key={`${cx}-${cy}`}
  cx={cx}
  cy={cy}
  r="2.5"
  fill="#A43718"
  initial={{ opacity: 0, scale: 0.4 }}
  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.4 }}
  transition={labelTransition(index * 0.06)}
  style={{ transformOrigin: `${cx}px ${cy}px` }}
/>
```

### Label spans (lines 76-103)

For left-aligned labels (lines 76-89):

```tsx
// Before
<motion.span
  className="absolute left-3 top-[18%] font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -5 }}
  transition={labelTransition(0)}
>

// After
<motion.span
  className="absolute left-3 top-[18%] font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-[#151515]/70"
  initial={{ opacity: 0, x: -5 }}
  animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -5 }}
  transition={labelTransition(0)}
>
```

For right-aligned labels (lines 90-103), use `x: 5` instead of `x: -5`:

```tsx
initial={{ opacity: 0, x: 5 }}
```

## Files to modify

- `src/components/ui/DeviceMockup.tsx` — add `initial` props to all animated elements in `TodoDeviceAnnotations`

## Acceptance criteria

1. All 4 SVG paths have `initial={{ opacity: 0, pathLength: 0 }}`
2. All 4 SVG circles have `initial={{ opacity: 0, scale: 0.4 }}`
3. All 4 label spans have appropriate `initial` props (`opacity: 0, x: -5` for left-aligned, `opacity: 0, x: 5` for right-aligned)
4. In default state (no hover), annotations are completely invisible
5. On hover, annotations reveal with staggered timing
6. On mouse leave, annotations hide cleanly
7. Keyboard focus produces the same reveal as hover
8. `npm run typecheck` passes
9. `npm run lint` passes

## Implementation result

Applied 27 July 2026:

- Added the required explicit initial states to all four path declarations, the mapped circle declaration, and all four label declarations in `TodoDeviceAnnotations`.
- `npm run typecheck` passed.
- Targeted ESLint validation for `src/components/ui/DeviceMockup.tsx` passed.
- `git diff --check` passed.

The remaining acceptance criteria are the Playwright default/hover/after-hover/focus captures described below.

## Validation method

1. Run `npm run typecheck` and `npm run lint`
2. Start dev server and navigate to homepage
3. Scroll to TODO++ card
4. Verify annotations are completely invisible in default state
5. Hover over TODO++ card — verify 4 callouts reveal with stagger
6. Move mouse away — verify annotations hide cleanly
7. Tab to TODO++ link — verify same reveal as hover
8. Capture Playwright screenshots for owner visual confirmation

## QA handoff

After implementation, prepare screenshots for owner visual confirmation using the same Playwright script pattern used for UI-003:
- Desktop default (annotations hidden)
- Desktop hover (annotations revealed)
- Desktop after-hover (annotations hidden again)
- Desktop keyboard focus (annotations revealed)
