# ChatGPT — TODO++ 3D Asset Brief: "A Dedicated Surface for the Day's Work"

## Context

You are the 3D illustration / asset creation specialist on a three-agent team. The TODO++ case study page needs a signature editorial moment: a subtle 3D product presentation of the dedicated task device. A Codex implementation task exists to build a React Three Fiber section once you deliver the source assets below.

The design is in the Figma file **"Portfolio Website Redesign"** by Rosemary Okafor. You have access.

The current Figma frame is `hero(coverimage) 2` (node 4040:1872). The device is a dedicated task-management hardware concept with an e-paper display, four circular navigation keys, an AI emoji display, and a mic button.

## What you are creating

Four source image assets that a WebGL layer will composite into a subtle 3D presentation. The principle: **the device illustration is already premium — we do not rebuild it in 3D.** Instead, we extract component layers so a custom shader can animate them with:

1. Scroll-driven entry (settle into place)
2. Subtle parallax tilt (2-3° on pointer movement)
3. A single soft light pass across the device (like editorial product photography)
4. An e-paper screen that brightens subtly when the light crosses it

## Asset A — Device body render

**Purpose:** The hardware shell that receives the light pass and parallax tilt.

**What it contains:** The complete device shell, bezel, stand, chamfers, navigation keys (Up/Down/Back/Select circles), AI emoji display, mic button, and bottom controls. Essentially everything **except** the e-paper screen contents.

**Critical:** The screen area must be transparent (alpha). This layer uses the screen-alpha to cast the hardware shadow naturally on the canvas below.

**Format:** PNG, lossless, sRGB
**Size:** 1440×1024px (1x), if manageable also provide 2880×2048px (2x retina)
**Naming:** `device-body.png`

## Asset B — Screen content (e-paper display)

**Purpose:** The content that sits behind the screen mask and receives the e-paper brightness boost when the light pass crosses it.

**What it contains:** The full e-paper display content exactly as shown:
- "Todo++" header with Connected indicator (green dot)
- "Good morning, Chad." greeting with date/time
- Quote of the day card ("Do all you can to be the best version of yourself")
- Updates section with checkmark icon and task notification from "Leo"
- The white background of the screen (#FFFFFF)

**Format:** PNG, lossless, sRGB, with flat white background
**Size:** Match the screen bounds from the Figma frame (at 1x: ~337×262px, at 2x: ~674×524px)
**Naming:** `screen-content.png`

This texture is mapped onto a separate plane that sits slightly above the device-body plane in the R3F scene. The shader applies a brightness multiplier that peaks when the light sweep crosses this region.

## Asset C — Screen mask (alpha mask)

**Purpose:** Defines exactly where on the device the e-paper screen sits, so the shader can confine the light effect to only the screen area (not the bezel or buttons).

**What it contains:** A solid white shape exactly matching the e-paper screen's bounds, including the rounded top corners. Everything outside the screen area is fully transparent (alpha 0).

**Format:** PNG, alpha-only (single-channel mask, white = screen, transparent = not screen)
**Size:** Same as Asset B (must pixel-match for the shader UVs to align)
**Naming:** `screen-mask.png`

This is the most technically critical asset. The shader samples this mask and only applies the e-paper glow where mask > 0. If the mask is misaligned, the light effect bleeds onto the bezel or misses part of the screen.

## Asset D — Light-pass reference (optional, but recommended)

**Purpose:** A recorded reference so Codex can match the light behaviour visually.

**What it contains:** A short animation showing:
1. A soft-edged light starting at the top-left of the device
2. Sweeping diagonally to the bottom-right over ~2 seconds
3. The e-paper screen area brightening gently as the light crosses it (like paper catching a reading light)
4. The light is warm-neutral (not cold/blue), soft-edged, not a hard spotlight

**Format options (pick one):**
- A screen recording of you demonstrating the sweep in Figma with a gradient
- A frame sequence exported as PNG frames
- A written description with coordinates is acceptable if animation is not possible

## Color reference from Figma

| Token | Value | Where |
|---|---|---|
| Text primary | `#28261b` | Greeting, quotes, task content |
| Text secondary | `#787a7b` | Date/time, labels |
| Header text | `#3d392a` | "Todo++" brand mark |
| Border | `#d0d0d0` | Card borders on screen |
| Card bg | `#faf9f5` | Quote-of-day background card |
| Indicator | `#34c759` | "Connected" green dot |
| Screen bg | `#FFFFFF` | E-paper display background |

## How the assets are used (for your reference)

A React Three Fiber scene loads Assets A, B, and C as textures onto two overlapping planes:

```
Z-order:
  Front:   Screen plane     → screen-content.png + screen-mask.png (custom ShaderMaterial)
  Back:    Device body      → device-body.png (basic MeshBasicMaterial)
```

The custom fragment shader on the screen plane:
1. Samples `screen-content.png` at `uv`
2. Samples `screen-mask.png` at `uv`
3. Calculates the distance from the current UV to a moving light position (animates from (0,0) to (1,1) over 2s)
4. Applies a brightness multiplier `(1.0 + intensity * maskValue)` to the screen content
5. Where `maskValue` is 0 outside the screen area, and `intensity` peaks when the light passes closest to each pixel

## Delivery

Place all assets in the project at:
```
public/images/case-studies/todo-app/threejs/
```

Naming convention:
- `device-body.png`
- `screen-content.png`
- `screen-mask.png`
- (optional) `light-pass-reference.gif` or `.mp4`

## Design intent (include in your response to confirm)

"We want the device to feel like a premium hardware product being presented in editorial lighting — one soft, warm light pass that reveals the device surface and makes the e-paper screen glow subtly, as if catching a soft reading light. This should feel editorial, not sci-fi. No neon, no particles, no continuous animation."

## Constraints

- No emoji or decorative treatments on the assets themselves — clean, pixel-accurate exports
- The device-body.png screen area MUST be transparent (not white)
- The screen-mask.png MUST match the screen-content.png dimensions exactly
- sRGB color space for all PNGs
- Lossless compression
