"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { TIMELINE_MILESTONES, getTimelineMarkerPositions, TIMELINE_PADDING } from "@/content/timeline";
import { useReducedMotion } from "./useReducedMotion";

/* ── Constants ───────────────────────────────────────────────── */

const FRAME_INTERVAL = 1000 / 18;
const MAX_DPR = 2;

/* Heart — SVG path from heart mascot (Favicon).svg */
const HEART_SVG_PATH =
  "M60.7292 116.479C44.2717 104.172 11.6667 76.0375 11.6667 50.7187" +
  "C11.6667 33.9839 23.9474 20.4177 40.8334 20.4177" +
  "C49.5834 20.4177 58.3334 23.3344 70.0001 35.0011" +
  "C81.6667 23.3344 90.4167 20.4177 99.1667 20.4177" +
  "C116.052 20.4177 128.333 33.9839 128.333 50.7187" +
  "C128.333 76.0375 95.7286 104.172 79.271 116.479" +
  "C73.7328 120.621 66.2673 120.621 60.7292 116.479Z";

const HEART_SIZE = 22; // visual height in px
let heartPath: Path2D | null = null;

/* Timeline */
const SEGMENT_MS = 4500;
const PAUSE_MS = 2800;
const RESTART_MS = 1700; // time for the heart to slide in from the left restart point
const INITIAL_PAUSE_MS = 1200; // shorter gap after entrance animation lands the heart
const DOT_RADIUS = 3;
const ACTIVE_DOT_RADIUS = 4;

/* ── Maths ────────────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeTravel(t: number) {
  return lerp(t, easeInOutCubic(t), 0.35);
}

/* ── Heart glyph (SVG path) ─────────────────────────────────── */

function drawHeartGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  opacity = 1,
  scaleMultiplier = 1,
  blur = 0,
) {
  ctx.save();

  const scale = (HEART_SIZE / 100) * scaleMultiplier; // SVG heart is ~100 units tall
  ctx.globalAlpha = opacity;
  ctx.filter = blur > 0 ? `blur(${blur}px)` : "none";
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(-70, -70); // center SVG (70, 70) → the draw point

  heartPath ??= new Path2D(HEART_SVG_PATH);

  const gradient = ctx.createLinearGradient(11.7, 20.4, 128.3, 120.6);
  gradient.addColorStop(0, "#A43718");
  gradient.addColorStop(1, "#E3855B");
  ctx.fillStyle = gradient;

  ctx.shadowColor = "rgba(164, 55, 24, 0.08)";
  ctx.shadowBlur = 3;
  ctx.fill(heartPath);

  ctx.restore();
}

function drawMotionTrail(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  heartX: number,
  heartY: number,
  opacity = 1,
) {
  const distance = heartX - fromX;
  if (Math.abs(distance) < 6 || opacity <= 0) return;

  const direction = distance >= 0 ? 1 : -1;
  const trailSpan = Math.min(110, Math.max(30, Math.abs(distance) * 0.40));

  /* ── Trailing ghost hearts ────────────────────────────────── */

  const ghosts = [
    { t: 0.22, opacity: 0.18, blur: 2, scale: 0.88, drop: 1.5 },
    { t: 0.50, opacity: 0.09, blur: 4, scale: 0.74, drop: 3.2 },
    { t: 0.78, opacity: 0.04, blur: 6, scale: 0.58, drop: 5.0 },
  ];

  for (const g of ghosts) {
    const gx = heartX - direction * trailSpan * g.t;
    const gy = heartY + g.drop;
    drawHeartGlyph(ctx, gx, gy, g.opacity * opacity, g.scale, g.blur);
  }
}

/* ── Types ────────────────────────────────────────────────────── */

interface ProgressResult {
  fromIndex: number;
  toIndex: number;
  t: number;
  isPausing: boolean;
  isRestarting: boolean;
  restartT: number;
  focusedIndex: number | null;
}

interface TimelineState {
  width: number;
  height: number;
  dpr: number;
  groundY: number;
  elapsed: number;
  activeIndex: number | null;
  lastFrame: number;
  rafId: number;
}

/* ── Compute progress ─────────────────────────────────────────── */

function computeProgress(
  elapsed: number,
  count: number,
): ProgressResult {
  const unit = SEGMENT_MS + PAUSE_MS;
  const travelCount = Math.max(0, count - 1);
  const travelWindowMs = travelCount * unit;
  const cycleMs = INITIAL_PAUSE_MS + travelWindowMs + RESTART_MS;
  const pos = elapsed % cycleMs;

  if (pos < INITIAL_PAUSE_MS) {
    /* Delay the first tooltip by 1s — lets the mascot visually settle
     * before the milestone note appears. */
    const showTooltip = pos > 1000;
    return {
      fromIndex: 0,
      toIndex: 0,
      t: 0,
      isPausing: true,
      isRestarting: false,
      restartT: 0,
      focusedIndex: showTooltip ? 0 : null,
    };
  }

  const afterInitialPause = pos - INITIAL_PAUSE_MS;

  /* Restart phase — the old run resolves, then the heart re-enters from the left. */
  if (afterInitialPause >= travelWindowMs) {
    const restartT = Math.min(1, (afterInitialPause - travelWindowMs) / RESTART_MS);
    return {
      fromIndex: 0,
      toIndex: 0,
      t: 0,
      isPausing: false,
      isRestarting: true,
      restartT,
      focusedIndex: restartT >= 0.68 ? 0 : null,
    };
  }

  const segment = Math.min(travelCount - 1, Math.floor(afterInitialPause / unit));
  const within = afterInitialPause - segment * unit;
  const isPausing = within >= SEGMENT_MS;
  const t = isPausing ? 1 : Math.min(1, within / SEGMENT_MS);
  const focusedIndex = isPausing
    ? Math.min(segment + 1, count - 1)
    : segment;

  return {
    fromIndex: segment,
    toIndex: Math.min(segment + 1, count - 1),
    t,
    isPausing,
    isRestarting: false,
    restartT: 0,
    focusedIndex,
  };
}

/* ── Draw ─────────────────────────────────────────────────────── */

function draw(canvas: HTMLCanvasElement, state: TimelineState) {
  if (state.width === 0) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { dpr, width, height, groundY, elapsed, activeIndex } = state;
  const count = TIMELINE_MILESTONES.length;

  const markers = getTimelineMarkerPositions(width, count, TIMELINE_PADDING);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  /* ── Ground line — constrained to the page content width ── */
  ctx.strokeStyle = "rgba(21, 21, 21, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  /* ── Heart position ── */
  const { fromIndex, toIndex, t, isPausing, isRestarting, restartT } = computeProgress(elapsed, count);

  /* Compound idle bob — two frequencies for organic breath */
  const bob1 = Math.sin((elapsed * 3.2) / 1000) * 0.8;
  const bob2 = Math.sin((elapsed * 5.1) / 1000) * 0.3;
  const idleBob = bob1 + bob2;

  let heartX: number;
  let drawY: number;
  let heartOpacity = 1;
  let heartScale = 1;
  let heartBlur = 0;
  let trailFromX = markers[fromIndex] ?? markers[0];
  let shouldDrawMotionTrail = false;

  if (isRestarting) {
    const fromX = -HEART_SIZE * 2;
    const toX = markers[0];
    const easedT = easeOutCubic(restartT);
    const liquidT = easeInOutCubic(Math.min(1, restartT * 1.15));

    heartX = lerp(fromX, toX, easedT);
    drawY = groundY - HEART_SIZE / 2 + idleBob + (1 - easedT) * 2;
    heartOpacity = liquidT;
    heartScale = 0.94 + liquidT * 0.06;
    heartBlur = (1 - liquidT) * 1.2;
    trailFromX = fromX;
    shouldDrawMotionTrail = restartT > 0.08 && restartT < 0.96;
  } else {
    /* Forward travel with cubic ease-out for damped arrival */
    if (count <= 1) {
      heartX = markers[0];
    } else {
      const from = markers[fromIndex];
      const to = markers[toIndex];
      heartX = isPausing ? to : lerp(from, to, easeTravel(t));
      trailFromX = from;
      shouldDrawMotionTrail = !isPausing && fromIndex !== toIndex;
    }

    drawY = groundY - HEART_SIZE / 2 + idleBob;
  }

  /* ── Trail ── */
  if (!isRestarting) {
    ctx.strokeStyle = "rgba(164, 55, 24, 0.11)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(markers[0], groundY);
    ctx.lineTo(heartX, groundY);
    ctx.stroke();
  }

  /* ── Subtle glow ── */
  const glow = ctx.createRadialGradient(heartX, groundY, 0, heartX, groundY, 28);
  glow.addColorStop(0, `rgba(164, 55, 24, ${0.035 * heartOpacity})`);
  glow.addColorStop(1, "rgba(164, 55, 24, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(heartX, groundY, 28, 0, Math.PI * 2);
  ctx.fill();

  if (shouldDrawMotionTrail) {
    drawMotionTrail(ctx, trailFromX, heartX, drawY, heartOpacity);
  }

  /* ── Marker dots ── */
  for (let i = 0; i < count; i++) {
    const x = markers[i];
    const isActive = i === activeIndex;

    if (isActive) {
      ctx.beginPath();
      ctx.arc(x, groundY, ACTIVE_DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#A43718";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, groundY, ACTIVE_DOT_RADIUS + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(164, 55, 24, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, groundY, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(21, 21, 21, 0.25)";
      ctx.fill();
    }
  }

  /* ── Year labels (10px for legibility on mobile) ── */
  ctx.font =
    '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
  ctx.textBaseline = "top";
  ctx.textAlign = "center";

  for (let i = 0; i < count; i++) {
    const x = markers[i];
    ctx.fillStyle =
      i === activeIndex ? "rgba(164, 55, 24, 0.7)" : "rgba(21, 21, 21, 0.3)";
    ctx.fillText(TIMELINE_MILESTONES[i].year, x, groundY + 12);
  }

  drawHeartGlyph(ctx, heartX, drawY, heartOpacity, heartScale, heartBlur);
}

/* ── Hook ─────────────────────────────────────────────────────── */

export function useTimelineHero(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  animate?: boolean,
  isPaused = false,
): number | null {
  const prefersReducedMotion = useReducedMotion();
  const stateRef = useRef<TimelineState>({
    width: 0,
    height: 0,
    dpr: 1,
    groundY: 0,
    elapsed: 0,
    activeIndex: null,
    lastFrame: 0,
    rafId: 0,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    let disposed = false;

    function setup(cvs: HTMLCanvasElement) {
      const parent = cvs.parentElement;
      if (!parent) return;

      const w = Math.floor(parent.clientWidth);
      const mobile = w < 500;
      const h = mobile ? 90 : 120;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const canvasWidth = Math.ceil(w * dpr);
      const canvasHeight = Math.ceil(h * dpr);
      const sizeChanged =
        state.width !== w ||
        state.height !== h ||
        state.dpr !== dpr ||
        cvs.width !== canvasWidth ||
        cvs.height !== canvasHeight;

      state.width = w;
      state.height = h;
      state.dpr = dpr;
      state.groundY = Math.floor(h * 0.58);

      if (sizeChanged) {
        cvs.width = canvasWidth;
        cvs.height = canvasHeight;
        cvs.style.width = `${w}px`;
        cvs.style.height = `${h}px`;
        cvs.style.marginLeft = "";
      }

      if (prefersReducedMotion) {
        state.activeIndex = 0;
        setActiveIndex(0);
        drawStatic(cvs, state);
      } else if (sizeChanged) {
        drawStatic(cvs, state);
      }
    }

    setup(canvas);

    const resizeObserver = new ResizeObserver(() => setup(canvas));
    resizeObserver.observe(canvas.parentElement!);

    /* Only start the RAF loop when motion is allowed and not visitor-paused. */
    if (animate && !prefersReducedMotion && !isPaused) {
      state.lastFrame = performance.now();
      if (state.activeIndex === null) {
        state.activeIndex = 0;
        setActiveIndex(0);
      }

      function tick(ts: number) {
        if (disposed) return;

        if (ts - state.lastFrame >= FRAME_INTERVAL) {
          const dt = Math.min(3, (ts - state.lastFrame) / FRAME_INTERVAL);
          state.lastFrame = ts;
          state.elapsed += FRAME_INTERVAL * dt;

          const { focusedIndex } = computeProgress(
            state.elapsed,
            TIMELINE_MILESTONES.length,
          );

          if (focusedIndex !== state.activeIndex) {
            state.activeIndex = focusedIndex;
            setActiveIndex(focusedIndex);
          }

          draw(canvas!, state);
        }

        state.rafId = requestAnimationFrame(tick);
      }

      state.rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(state.rafId);
      resizeObserver?.disconnect();
    };
  }, [canvasRef, prefersReducedMotion, animate, isPaused]);

  return activeIndex;
}

/* ── Static draw (no heart, used before animation starts) ────── */
function drawStatic(canvas: HTMLCanvasElement, state: TimelineState) {
  if (state.width === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { dpr, width, height, groundY } = state;
  const count = TIMELINE_MILESTONES.length;
  const markers = getTimelineMarkerPositions(width, count, TIMELINE_PADDING);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  /* Ground line */
  ctx.strokeStyle = "rgba(21, 21, 21, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  /* Marker dots — all inactive */
  for (let i = 0; i < count; i++) {
    const x = markers[i];
    ctx.beginPath();
    ctx.arc(x, groundY, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(21, 21, 21, 0.25)";
    ctx.fill();
  }

  /* Year labels */
  ctx.font =
    '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = "rgba(21, 21, 21, 0.3)";
    ctx.fillText(TIMELINE_MILESTONES[i].year, markers[i], groundY + 12);
  }
}
