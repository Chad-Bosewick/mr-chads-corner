# CODEX IMPLEMENTATION TASK

## Task ID

T-002

## Title

Mobile menu — focus trap, focus restoration, and touch targets (QA Critical)

## Objective

Complete the mobile navigation modal accessibility: add focus trapping, restore focus on close, ensure Escape handling is robust, and increase touch targets to 44x44px minimum.

## Product context

The current `NavMobile` modal opens with `role="dialog"` and `aria-modal="true"` but has no focus trap, no focus restoration when closed, and open/close buttons are only 24x24px — below the recommended 44x44px touch target.

## User story

As a keyboard or touch user, I need the mobile menu to trap focus while open, return focus to the button that opened it on close, and have buttons large enough to tap reliably.

## Scope

- Modify `src/components/layout/Nav.tsx` — increase hamburger button hit area, store focus reference
- Modify `src/components/layout/NavMobile.tsx` — add focus trapping logic, increase close button hit area
- Both buttons must meet 44x44px minimum touch target (including padding)

## Out of scope

- Changing the menu animation, layout, or visual style
- Desktop navigation changes
- Adding new nav features

## Design source

- QA finding: QA-2026-07-18-001, Critical finding #2
- WCAG 2.2 — Focus management for modals
- Apple HIG / Material Design: minimum 44x48px / 48x48px touch targets

## Technical context

- `Nav.tsx` uses `const [isMobileOpen, setIsMobileOpen] = useState(false)`
- `NavMobile.tsx` currently focuses the first link on mount via `useEffect`
- Escape key is handled in `Nav.tsx` via `onKeyDown={handleKeyDown}` on the `<nav>` element — this may not catch Escape when focus is inside the modal
- Close button in NavMobile uses inline SVG, 24x24 viewBox

## Approach

### Focus trapping
Add a lightweight focus trap to `NavMobile.tsx`:
1. Query all focusable elements within the overlay (`a[href]`, `button`, `input`, `textarea`, `select`, `[tabindex]:not([tabindex="-1"])`)
2. On `Tab` (no Shift): if focus is on the last element, move to the first
3. On `Shift+Tab`: if focus is on the first element, move to the last
4. Listen on `keydown` within the overlay

### Focus restoration
In `Nav.tsx`:
1. Store a ref to the hamburger button (`useRef`)
2. Before opening, save `document.activeElement` or use the ref
3. Pass a callback or use the ref in `NavMobile`'s cleanup to restore focus on unmount

### Touch targets
Use `p-3` (12px padding on each side) or equivalent to increase the clickable area while keeping the icon visually 24x24. Since the current button is 24x24, adding `p-3` gives a ~48x48px effective hit area.

### Escape handling
Move or duplicate Escape handling inside `NavMobile.tsx` so it catches the key regardless of where focus is.

## Functional requirements

1. When modal opens, focus moves to the first interactive element inside it
2. Tab and Shift+Tab cycle through focusable elements within the modal (focus trap)
3. Escape key closes the modal from any focused element inside
4. When modal closes, focus returns to the hamburger button that opened it
5. Hamburger button hit area is at least 44x44px (use padding + invisible extension)
6. Close button hit area is at least 44x44px

## Accessibility requirements

1. `aria-expanded` on the hamburger button must reflect modal state (already implemented)
2. All interactive elements must have visible focus styles
3. Focus must not escape the modal while open

## Acceptance criteria

- [ ] Tab cycles through all modal links and back to the first
- [ ] Shift+Tab cycles in reverse
- [ ] Escape closes the modal from any focus position inside
- [ ] Closing the modal returns focus to the hamburger button
- [ ] Hamburger and close buttons have ≥44x44px hit areas
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Likely files affected

- Modify: `src/components/layout/Nav.tsx`
- Modify: `src/components/layout/NavMobile.tsx`

## Required output

Return:

1. implementation summary
2. files changed
3. important technical decisions
4. tests performed
5. confirmation the build, typecheck, lint, and tests pass
