"use client";

import { RefObject, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/* ── Constants ───────────────────────────────────────────────── */

const FRAME_INTERVAL = 1000 / 15;
const MAX_DPR = 2;
const BASE = "#f5f2ee";
const INK = "21, 21, 21";
const ACCENT = "164, 55, 24";
const HEART_START = [222, 110, 50] as const;
const HEART_END = [164, 55, 24] as const;

/* Heavily favour the middle dot for a quiet, ambient texture */
const CHARS = [
  "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·",
  "□", "·", "·", "·", "▢",
  "·", "·", "·", "·", "·",
];

/* ── Types ───────────────────────────────────────────────────── */

interface Particle {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  charIndex: number;
  phase: number;
  grain: number;
  maxDrift: number;
}

interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

interface ShaderState {
  width: number;
  height: number;
  dpr: number;
  cell: number;
  fontSize: number;
  mobile: boolean;
  particles: Particle[];
  mouse: MouseState;
  lastFrame: number;
  rafId: number;
}

interface HeartFrame {
  scale: number;
  boost: number;
  glow: number;
}

/* ── Maths helpers ───────────────────────────────────────────── */

function fract(value: number) {
  return value - Math.floor(value);
}

function hash(x: number, y: number, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(value: number) {
  const t = clamp01(value);
  const inverse = 1 - t;
  return 1 - inverse * inverse * inverse;
}

/* Standard heart curve: (x² + y² - 1)³ - x²·y³ ≤ 0 */
function heartInside(x: number, y: number) {
  const nx = x;
  const ny = -y * 1.12 + 0.18;
  return (nx * nx + ny * ny - 1) ** 3 - nx * nx * ny ** 3 <= 0;
}

function heartCurveDistance(x: number, y: number) {
  const nx = x;
  const ny = -y * 1.12 + 0.18;
  return Math.abs((nx * nx + ny * ny - 1) ** 3 - nx * nx * ny ** 3);
}

function getHeartFrame(time: number, animated: boolean): HeartFrame {
  if (!animated) {
    return { scale: 0.30, boost: 0.01, glow: 0 };
  }

  const phase = time % 3.2;
  let beat = 0;

  /* Sharp attack: 0→0.25s */
  if (phase < 0.25) {
    beat = easeOutCubic(phase / 0.25);
  /* Brief hold then sharp decay for "lub" */
  } else if (phase < 0.35) {
    beat = 1 - (phase - 0.25) / 0.1 * 0.65;
  }

  /* Second "dub" pulse at ~0.55s */
  const secondPulse = phase > 0.45 && phase < 0.72
    ? Math.sin(((phase - 0.45) / 0.27) * Math.PI)
    : 0;
  const shapedBeat = clamp01(beat + secondPulse * secondPulse * 0.18);

  return {
    scale: 0.30 + shapedBeat * 0.70,
    boost: 0.01 + shapedBeat * 0.39,
    glow: shapedBeat,
  };
}

function getHeartGradientColor(x: number, y: number) {
  const amount = clamp01((x + y + 2) / 4);
  const inverse = 1 - amount;
  const r = Math.round(HEART_START[0] * inverse + HEART_END[0] * amount);
  const g = Math.round(HEART_START[1] * inverse + HEART_END[1] * amount);
  const b = Math.round(HEART_START[2] * inverse + HEART_END[2] * amount);

  return `${r}, ${g}, ${b}`;
}

/* ── Particle grid ───────────────────────────────────────────── */

function buildParticles(
  width: number,
  height: number,
  cell: number,
): Particle[] {
  const particles: Particle[] = [];
  for (let y = -cell; y <= height + cell; y += cell) {
    for (let x = -cell; x <= width + cell; x += cell) {
      const gx = Math.round(x / cell);
      const gy = Math.round(y / cell);
      particles.push({
        anchorX: x,
        anchorY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        charIndex: Math.floor(hash(gx, gy, 6) * CHARS.length),
        phase: hash(gx, gy, 14) * Math.PI * 2,
        grain: hash(gx, gy, 27),
        maxDrift: 3 + hash(gx, gy, 42) * 8,
      });
    }
  }
  return particles;
}

/* ── Canvas setup ────────────────────────────────────────────── */

function prepareCanvas(canvas: HTMLCanvasElement, state: ShaderState) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const mobile = width < 768;
  const cell = mobile ? 22 : 16;

  canvas.width = Math.ceil(width * dpr);
  canvas.height = Math.ceil(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  state.width = width;
  state.height = height;
  state.dpr = dpr;
  state.cell = cell;
  state.fontSize = mobile ? 10 : 8;
  state.mobile = mobile;
  state.particles = buildParticles(width, height, cell);
  state.mouse = { x: width / 2, y: height / 2, active: false };
}

/* ── Particle update ─────────────────────────────────────────── */

function updateParticle(
  particle: Particle,
  state: ShaderState,
  time: number,
  dt: number,
) {
  /* ── Slow orbital drift around anchor ── */
  const driftRadius = particle.maxDrift;
  const orbitSpeed = 0.18 + particle.grain * 0.12;
  const targetX =
    particle.anchorX +
    Math.sin(time * orbitSpeed + particle.phase) * driftRadius * 0.6 +
    Math.sin(time * orbitSpeed * 0.5 + particle.phase * 1.7) * driftRadius * 0.4;
  const targetY =
    particle.anchorY +
    Math.cos(time * orbitSpeed * 0.8 + particle.phase * 1.3) * driftRadius * 0.5 +
    Math.cos(time * orbitSpeed * 0.4 + particle.phase * 2.1) * driftRadius * 0.3;

  /* ── Spring toward orbital target ── */
  const springX = targetX - particle.x;
  const springY = targetY - particle.y;
  particle.vx += springX * 0.012 * dt;
  particle.vy += springY * 0.012 * dt;

  /* ── Gentle mouse pull ── */
  const dx = state.mouse.x - particle.x;
  const dy = state.mouse.y - particle.y;
  const dist = Math.hypot(dx, dy) || 1;

  const mouseInfluence = state.mouse.active
    ? 1 - smoothstep(0, state.mobile ? 280 : 420, dist)
    : 0;

  if (mouseInfluence > 0) {
    const pull = 0.035 * mouseInfluence * dt;
    particle.vx += (dx / dist) * pull;
    particle.vy += (dy / dist) * pull * 0.55;

    /* Gentle push-back when very close to prevent crowding */
    if (dist < 28) {
      const repel = (1 - dist / 28) * 0.4 * dt;
      particle.vx -= (dx / dist) * repel;
      particle.vy -= (dy / dist) * repel;
    }
  }

  /* ── Return spring to anchor (keeps particles from wandering) ── */
  const anchorDist = Math.hypot(
    particle.x - particle.anchorX,
    particle.y - particle.anchorY,
  );
  if (anchorDist > particle.maxDrift * 1.6) {
    const pull = (anchorDist - particle.maxDrift * 1.6) * 0.006 * dt;
    particle.vx +=
      ((particle.anchorX - particle.x) / anchorDist) * pull;
    particle.vy +=
      ((particle.anchorY - particle.y) / anchorDist) * pull;
  }

  /* ── Speed limit + damping (floaty, not snappy) ── */
  const speed = Math.hypot(particle.vx, particle.vy);
  const maxSpeed = 0.35 + mouseInfluence * 0.25;
  if (speed > maxSpeed) {
    particle.vx = (particle.vx / speed) * maxSpeed;
    particle.vy = (particle.vy / speed) * maxSpeed;
  }

  particle.x += particle.vx * dt;
  particle.y += particle.vy * dt;
  particle.vx *= 0.94;
  particle.vy *= 0.94;

  return { dist, mouseInfluence };
}

/* ── Draw ────────────────────────────────────────────────────── */

function drawCursorGlow(
  context: CanvasRenderingContext2D,
  state: ShaderState,
  heart: HeartFrame,
) {
  if (state.mobile || !state.mouse.active) return;

  const glowAlpha = 0.06 + heart.glow * 0.10;
  const dotAlpha = 0.05 + heart.glow * 0.18;
  const radius = 24 + heart.glow * 14;

  /* Faint accent halo */
  const gradient = context.createRadialGradient(
    state.mouse.x, state.mouse.y, 0,
    state.mouse.x, state.mouse.y, radius,
  );
  gradient.addColorStop(0, `rgba(164, 55, 24, ${glowAlpha.toFixed(3)})`);
  gradient.addColorStop(0.5, "rgba(164, 55, 24, 0.025)");
  gradient.addColorStop(1, "rgba(164, 55, 24, 0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(state.mouse.x, state.mouse.y, radius, 0, Math.PI * 2);
  context.fill();

  /* Tiny accent dot */
  context.fillStyle = `rgba(164, 55, 24, ${dotAlpha.toFixed(3)})`;
  context.beginPath();
  context.arc(state.mouse.x, state.mouse.y, 2.5, 0, Math.PI * 2);
  context.fill();
}

function draw(
  canvas: HTMLCanvasElement,
  state: ShaderState,
  time: number,
  shouldUpdate: boolean,
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const dt = Math.min(2.4, Math.max(0.6, FRAME_INTERVAL / 16.67));

  context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  context.clearRect(0, 0, state.width, state.height);
  context.fillStyle = BASE;
  context.fillRect(0, 0, state.width, state.height);

  const heartFrame = getHeartFrame(time, shouldUpdate);
  drawCursorGlow(context, state, heartFrame);

  context.font = `${state.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
  context.textBaseline = "middle";
  context.textAlign = "center";

  const heartScale = (state.mobile ? 42 : 56) * heartFrame.scale;

  for (const particle of state.particles) {
    const { dist, mouseInfluence } = shouldUpdate
      ? updateParticle(particle, state, time, dt)
      : {
          dist: Math.hypot(
            state.mouse.x - particle.x,
            state.mouse.y - particle.y,
          ),
          mouseInfluence: 0,
        };

    /* ── Heart silhouette near cursor ── */
    let heart = 0;
    let heartX = 0;
    let heartY = 0;
    if (heartScale > 0) {
      heartX = (particle.x - state.mouse.x) / heartScale;
      heartY = (particle.y - state.mouse.y) / heartScale;
      if (heartInside(heartX, heartY)) {
        const edge = 1 - smoothstep(0.02, 0.28, heartCurveDistance(heartX, heartY));
        heart = 0.68 + edge * 0.32;
      }
    }

    /* ── Character choice ── */
    const isHeartParticle = heart > 0.08;
    const char = isHeartParticle && heartFrame.glow > 0.08
      ? heartFrame.glow > 0.3
        ? "■"
        : "▣"
      : CHARS[particle.charIndex];

    /* ── Opacity ── */
    const breathe = 0.5 + 0.5 * Math.sin(time * 0.4 + particle.phase);
    const nearCursor = state.mouse.active
      ? 1 - smoothstep(0, state.mobile ? 120 : 160, dist)
      : 0;
    const cursorBonus = nearCursor * 0.035;
    const heartBonus = heart * heartFrame.boost;

    const alpha = Math.min(
      heart > 0 ? (heartFrame.glow > 0.5 ? 0.50 : 0.35) : 0.09,
      0.016 +
        breathe * 0.02 +
        cursorBonus +
        heartBonus +
        mouseInfluence * 0.015,
    );

    /* ── Colour ── */
    const useAccent = heart > 0.08 || (nearCursor > 0.4 && particle.grain > 0.92);
    const color = heart > 0.08
      ? getHeartGradientColor(heartX, heartY)
      : useAccent
        ? ACCENT
        : INK;

    context.fillStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
    context.fillText(char, particle.x, particle.y);
  }
}

/* ── Hook ────────────────────────────────────────────────────── */

export function useAsciiShader(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const prefersReducedMotion = useReducedMotion();
  const stateRef = useRef<ShaderState>({
    width: 0,
    height: 0,
    dpr: 1,
    cell: 16,
    fontSize: 8,
    mobile: false,
    particles: [],
    mouse: { x: 0, y: 0, active: false },
    lastFrame: 0,
    rafId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    let disposed = false;

    const resize = () => {
      prepareCanvas(canvas, state);
      draw(canvas, state, 0, false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      state.mouse.x = event.clientX;
      state.mouse.y = event.clientY;
      state.mouse.active = true;
    };

    const handlePointerLeave = () => {
      state.mouse.active = false;
    };

    const tick = (timestamp: number) => {
      if (disposed) return;
      if (timestamp - state.lastFrame >= FRAME_INTERVAL) {
        state.lastFrame = timestamp;
        draw(canvas, state, timestamp / 1000, true);
      }
      state.rafId = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
      });
      state.rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(state.rafId);
    };
  }, [canvasRef, prefersReducedMotion]);
}
