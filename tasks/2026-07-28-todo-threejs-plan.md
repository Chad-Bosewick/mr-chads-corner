# TODO++ — "A Dedicated Surface for the Day's Work" — WebGL 2.5D Signature Moment

## Orchestration: Claude Code

Claude Code orchestrates; ChatGPT produced the separated source assets (Phase 2, complete); Codex implements (Phase 3, this document).

**Assets are already delivered** at `public/images/case-studies/todo-app/threejs/`. This task is ready to implement.

---

## Decision Gate — WebGL (R3F) vs. CSS Transform

### Option A: WebGL via React Three Fiber (Recommended)

**What it is:** A 2.5D presentation — two textured planes (device body + screen layer) with a custom `ShaderMaterial`. The planes can tilt via pointer tracking and receive a masked light pass, but they cannot create real hardware depth. This is the correct quality expectation: a subtle editorial treatment, not volumetric 3D.

**Approach:**
- Scroll-driven opacity + translateY entry
- Mouse-driven `rotationX`/`rotationY` (2-3° clamp) with pointer tracking
- Fragment shader pass that confines the light sweep to the screen-mask region
- Screen brightness boost timed with the light sweep

**Why recommend:** The light-pass effect — traversing a specific region of the image with a shaped mask response — is much cleaner in a shader than CSS. Combining scroll-triggered entry + pointer parallax + a timed light sweep in one render loop avoids layout thrashing and gives consistent timing.

**Performance budget:** Lazy-load R3F via `next/dynamic` only when the section enters the viewport. After implementing, run `next/bundle-analyzer` and report the actual incremental bundle size. Target: under 25KB gzip for the R3F + shader code (excluding Three.js).

**Fallback:** `useReducedMotion()` and `useMediaQuery('(max-width: 768px)')` — show the static `todo-app-dedicated-surface.png` in a standard `<Image>` tag with no WebGL.

### Option B: CSS 3D Transform (Lighter, but limited)

**Approach:** CSS `perspective` + `rotateX`/`rotateY` on pointer move, `@keyframes` for entry, a `::before` pseudo-element with a gradient sweep for the light pass.

**Limitations:**
- The light pass cannot be accurately shaped to the screen mask — it would be a rectangular sweep across the whole image or require complex `clip-path` hacks.
- E-paper brightness response is limited to a CSS `filter: brightness()` on the whole image, not the screen area only.
- Combining scroll entry + pointer tracking + timed light pass in CSS/JS requires imperative JS for timing coordination (recreating a render loop anyway).

### Decision

**Go with Option A (R3F).** The light pass and screen-specific response justify the WebGL layer. Without the light pass, use CSS instead.

---

## Phase 3 — Codex Implementation Task

### Task: TODO++ Dedicated Surface — R3F 2.5D Section

**Objective:** Replace the static carousel for "A dedicated surface for the day's work" with a WebGL-enhanced 2.5D presentation that adds scroll-driven entry, pointer-responsive parallax tilt, and a single masked light pass across the e-paper screen.

### Scope

1. Create a new lazy-loaded component: `ThreejsDeviceSection`
2. Register it as a new section type `"device-showcase"` in the case study content model
3. Wire it into the rendering pipeline in `CaseStudyLayout.tsx`
4. Add fallback rendering for mobile/reduced-motion/no-WebGL
5. Assets already placed at `public/images/case-studies/todo-app/threejs/`

### Out of scope

- Creating or modifying assets
- Animating other case study sections
- Changing the other TODO++ carousels or hero
- The 3 pending corrections from the previous TODO++ implementation (those come after)

### Files to create / modify

| File | Action |
|---|---|
| `src/components/case-study/ThreejsDeviceSection.tsx` | **CREATE** — detection wrapper + cross-fade between fallback and canvas |
| `src/components/case-study/ThreejsCanvas.tsx` | **CREATE** — R3F canvas + scene setup, separated for lazy-load boundary |
| `src/content/case-studies.ts` | **MODIFY** — Add `"device-showcase"` to section type union, update dedicated-surface section |
| `src/components/case-study/CaseStudyLayout.tsx` | **MODIFY** — Add render case for `"device-showcase"` type |

### Architecture

```
ReadingColumn wrapper
└── ThreejsDeviceSection (client component, "use client")
    ├── Renders section heading + body copy above the media
    ├── Renders <Image> static fallback AND <canvas> simultaneously
    ├── Cross-fades from static → canvas after textures + shader are ready
    ├── Detects viewport entry, reduced-motion, mobile via hooks
    ├── If fallback: show <Image> only, never load R3F
    └── If WebGL:
        └── ThreejsCanvas (lazy-loaded via next/dynamic with ssr:false)
            ├── <Canvas frameloop="demand">
            ├── Plane geometry with device-body texture
            ├── Screen plane with screen-content + screen-mask ShaderMaterial
            ├── Pointer tracking → mesh rotation (2-3° max)
            ├── Scroll-driven entry: opacity fade + Y translate
            └── Single light pass on mount
```

### Content rendering contract

The `"device-showcase"` section type renders:

```
<ReadingColumn>
  <section>
    <h2>heading</h2>               ← if section.heading is set
    <p>body</p>                     ← if section.body is set (rendered as HTML)
    <figure>
      ThreejsDeviceSection           ← the interactive/footage media
      <figcaption>caption</figcaption>  ← if image caption is set
    </figure>
  </section>
</ReadingColumn>
```

All within the standard 680px reading column with the same `rounded-xl shadow-[0_8px_30px_rgba(21,21,21,0.08)]` frame treatment as carousel images.

### Component details

**ThreejsDeviceSection.tsx**

The component manages two render tracks:

1. **Static fallback (always shown initially):** A standard `<Image>` with the dedicated-surface image, rendered immediately with no conditional. This prevents layout shifts and blank frames.

2. **WebGL canvas (loaded async):** Once the section is in-view, reduced-motion is false, and the device is desktop width, dynamically import ThreejsCanvas. After `onReady` fires (textures loaded, shader compiled, first frame rendered), cross-fade from the static image to the canvas over 300ms.

States:
- `fallback` (always): static `<Image>` rendered unconditionally
- `showWebgl`: true when the R3F bundle has lazy-loaded and `onReady` has fired
- Cross-fade via CSS transition on opacity when `showWebgl` toggles

Props / data:
```typescript
interface ThreejsDeviceSectionProps {
  deviceAssets: {
    body: string;
    screenContent: string;
    screenMask: string;
    fallback: string;
    caption?: string;
  };
  heading?: string;
  body?: string;
}
```

**ThreejsCanvas.tsx**

```typescript
"use client";
import { Canvas } from "@react-three/fiber";
// No drei dependency — use THREE.TextureLoader directly
```

```
Scene setup:
  - PerspectiveCamera (not Orthographic — subtle perspective helps the 2.5D illusion)
  - frameloop="demand" — only re-renders on animation events
  - Plane at z=0 with device-body.png texture (MeshBasicMaterial)
  - Screen plane at z=0.01 with screen-content.png, masked by screen-mask.png (custom ShaderMaterial)
  - Ambient light

Animation:
  - Entry (on mount): opacity 0→1 over 800ms, translateY 20px→0 with easing
  - Pointer tracking: onPointerMove → rotate mesh 2-3° max around X/Y
  - Light pass: screen brightness sweep triggered once on mount, ~2s duration
    - Diagonal sweep (top-left to bottom-right)
    - Screen material brightness peaks at ~1.15 when light crosses the screen area

Runtime performance:
  - Render only while the section is in the viewport (useInView)
  - Pause (no useFrame updates) after the one-time light pass completes, unless pointer movement occurs
  - frameloop="demand" — do NOT use the default continuous render loop
  - Dispose textures, materials, and geometry on unmount
  - Invalidate the canvas manually when animations complete
```

### Screen placement contract — critical for pixel alignment

**Approach:** Single full-size plane (mapping the 1440×1024 body coordinate system). A custom `ShaderMaterial` composites both textures — the device body is the base, and the screen content is overlaid at the exact screen rect, blended via the screen mask.

**Screen rect in UV coordinates (within the 1440×1024 body texture):**

| Edge | Figma px | UV |
|---|---|---|
| Left | 551.53 | 551.53 / 1440 = **0.383** |
| Top | 221.55 | 221.55 / 1024 = **0.216** |
| Right | 551.53 + 337 = 888.53 | 888.53 / 1440 = **0.617** |
| Bottom | 221.55 + 262 = 483.55 | 483.55 / 1024 = **0.472** |
| Screen width | 337 | 337 / 1440 = **0.234** |
| Screen height | 262 | 262 / 1024 = **0.256** |

Shader uniforms:
- `uBodyTex` (sampler2D) — device-body.png (1440×1024)
- `uScreenTex` (sampler2D) — screen-content.png (328×267)
- `uMaskTex` (sampler2D) — screen-mask.png (328×267)
- `uScreenRect` (vec4) = (0.383, 0.216, 0.234, 0.256) — (x, y, width, height) in UV space
- `uLightProgress` (float) — 0→1 over 2s for the sweep

Shader logic:
```glsl
// Sample body texture at full UV
vec4 bodyColor = texture2D(uBodyTex, vUv);

// Compute UV within the screen rect; clamp to prevent edge bleed
vec2 screenUv = (vUv - uScreenRect.xy) / uScreenRect.zw;
float inScreen = float(
  vUv.x >= uScreenRect.x && vUv.x <= uScreenRect.x + uScreenRect.z &&
  vUv.y >= uScreenRect.y && vUv.y <= uScreenRect.y + uScreenRect.w
);

vec4 screenColor = texture2D(uScreenTex, screenUv);
float mask = texture2D(uMaskTex, screenUv).r;

// Light pass calculation
float lightDist = distance(screenUv, vec2(uLightProgress));
float lightIntensity = (1.0 - smoothstep(0.0, 0.8, lightDist)) * 0.15;
screenColor.rgb *= (1.0 + lightIntensity * mask);

// Composite: screen over body where inScreen > 0
vec4 finalColor = mix(bodyColor, screenColor, inScreen * screenColor.a);
```

**Acceptance criterion:** The first rendered WebGL frame must pixel-match the static fallback composition before any motion begins; the screen overlay must have no visible offset, gap, or edge seam at desktop sizes. Verify by toggling between the static `<Image>` and the canvas before any animation runs.

### Content data change

In `src/content/case-studies.ts`:

1. Add `"device-showcase"` to the `type` union in `ContentSection` (line 2-20)
2. Add optional `deviceAssets` field to `ContentSection`:
```typescript
deviceAssets?: {
  body: string;
  screenContent: string;
  screenMask: string;
  fallback: string;
};
```

3. Replace the dedicated-surface section entry (currently `type: "carousel"` around line 238) with:
```typescript
{
  type: "device-showcase",
  heading: "A dedicated surface for the day's work",
  chapter: "solution",
  navLabel: "Solution",
  body: "<strong>The physical device is the product's most distinctive design decision.</strong> Its display concentrates the task experience into a compact surface while the companion app handles deeper task interaction. The hero should let the reader see the relationship between hardware controls and the on-screen task state.",
  deviceAssets: {
    body: "/images/case-studies/todo-app/threejs/device-body.png",
    screenContent: "/images/case-studies/todo-app/threejs/screen-content.png",
    screenMask: "/images/case-studies/todo-app/threejs/screen-mask.png",
    fallback: "/images/case-studies/todo-app/todo-app-dedicated-surface.png",
  },
}
```

### CaseStudyLayout.tsx changes

Add a new import and render case:

```typescript
import { ThreejsDeviceSection } from "@/components/case-study/ThreejsDeviceSection";

// In the renderSection switch, add:
case "device-showcase":
  return (
    <ReadingColumn key={index} className={spacing}>
      <ThreejsDeviceSection
        heading={section.heading}
        body={section.body}
        deviceAssets={section.deviceAssets!}
      />
    </ReadingColumn>
  );
```

### Motion constraints

- Entry duration: 800ms, eased (spring or cubic-bezier)
- Tilt max: 2.5° on X axis, 2° on Y axis
- Pointer tracking: lerp with 0.15 factor for smoothness
- Light pass: 2s duration, smoothstep interpolation, fires once on section entry
- All motion respects `prefers-reduced-motion`: zero animation, static image, R3F never loads
- All animations use `useFrame` delta or `performance.now()` for frame-rate independence

### Cross-fade behavior (point 5 from review)

1. Render the static fallback `<Image>` unconditionally on first mount
2. Start lazy-loading ThreejsCanvas as soon as the section enters the viewport (IntersectionObserver)
3. ThreejsCanvas calls `onReady()` after its first successful render (textures loaded, shader compiled)
4. The parent ThreejsDeviceSection cross-fades opacity from the static image to the canvas over 300ms
5. After the cross-fade completes, the static `<Image>` remains in the DOM with `opacity: 0` (to prevent layout shifts) and `pointer-events: none`
6. On resize that triggers mobile / reduced-motion change: reverse the cross-fade back to static

### Static fallback rendering

When fallback mode is active (mobile / reduced-motion / no WebGL support / before cross-fade):
- Render the standard `<Image>` with the dedicated surface image
- Normal carousel frame with `rounded-xl shadow-[0_8px_30px_rgba(21,21,21,0.08)]`
- Max width 680px within `ReadingColumn`
- No interaction, no animation

### Accessibility

- `aria-label="TODO++ dedicated device — interactive 3D presentation"` on the canvas
- Keyboard users see the static fallback (pointer tracking is inaccessible by nature)
- `prefers-reduced-motion` forces static fallback, R3F never loads
- Screen readers: the static fallback image alt text is always in the DOM

### Mobile

- Below 768px viewport: static fallback image, R3F never loads
- Touch devices: tilt doesn't apply (no hover/pointer), static fallback
- On viewport resize crossing the threshold: switch rendering tracks gracefully (cross-fade)

### Screen-alignment acceptance criterion

**The first rendered WebGL frame must pixel-match the static fallback composition before any motion begins.** The screen overlay must have no visible offset, gap, or edge seam at desktop sizes. Verify by toggling between the static `<Image>` and the canvas before animation starts. A technically correct shader with a visibly misaligned e-paper layer is a blocker.

### Acceptance criteria

1. Section shows the device with subtle 2.5D depth when scrolled into view on desktop
2. Device settles into place with a smooth opacity + translateY entry
3. Moving the mouse tilts the device 2-3° naturally (smooth lerp, not jumpy)
4. A single light pass sweeps across the device once on section entry (~2s)
5. The e-paper screen area brightens subtly as the light passes over it, bezel unaffected
6. Static fallback image renders immediately; canvas cross-fades in only after ready
7. On mobile (<768px): static image in standard carousel frame
8. With `prefers-reduced-motion`: static image, R3F never loads, no JavaScript animation
9. Canvas renders only while in-viewport, pauses after light-pass completes (no wasted GPU)
10. `frameloop="demand"` — no continuous render loop
11. No continuous animation, rotation, particles, or neon effects
12. Build, type check, and lint pass
13. Bundle: R3F only loads when section enters viewport

### Implementation notes

- Use `next/dynamic` with `{ ssr: false }` for the R3F component
- The ThreejsCanvas component should be the dynamic import boundary
- `import * as THREE from 'three'` only — no `@react-three/drei`. Use `new THREE.TextureLoader()` directly.
- Do NOT install `@react-three/drei` unless you specifically need something it provides that native Three.js cannot do.
- `@types/three`: check if `three` ships its own types (modern versions do). Only install `@types/three` if the compiler requires it.
- The shader should be a simple custom `ShaderMaterial`, not a full post-processing pass
- Performance: use `performance.now()` for the light pass timing
- Memory: call `.dispose()` on all textures, materials, and geometry on unmount / effect cleanup
- Use frameloop invalidation: request a frame only when something changes (entry progress, pointer move, light pass progress)
- CSS: the section wrapper must match the reading column width and carousel frame styling
- Do NOT use `@react-spring/three` — plain `useFrame` with delta-based interpolation is sufficient

### Dependencies to install

```bash
npm install @react-three/fiber three
```

ONLY these. No drei, no react-spring/three, no additional types unless the compiler demands them.

After implementation, run size analysis and report the actual incremental gzip cost.

### Risk assessment

| Risk | Mitigation |
|---|---|
| WebGL not supported | Feature detect via canvas.el.getContext('webgl'), show static fallback |
| Bundle size unknown | Measure with next/bundle-analyzer after implementation, report actual size |
| Performance on mid-range desktop | 2D plane with simple shader is trivially cheap; frameloop="demand" prevents wasted GPU |
| Shader compile error | Canvas component catches errors, bubbles up, parent falls back to static image |
| Texture loading delay | Static fallback image is always shown first; canvas cross-fades in only after ready |
| Motion feels gimmicky | Limit tilt to 2-3°, single light pass, no continuous animation |
