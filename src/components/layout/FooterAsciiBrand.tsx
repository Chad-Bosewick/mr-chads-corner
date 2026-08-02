"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDMARK_ID = "footer-wordmark-dots";
const WORDMARK_A = "Temi Adekunle";
const WORDMARK_B = "Chad Bosewick";

const CELL = 6;
const FRAME_INTERVAL = 1000 / 15;
const MAX_DPR = 2;
const HOLD_MS = 2500;
const MORPH_MS = 1200;
const CYCLE_MS = 2 * (HOLD_MS + MORPH_MS);
const PARTICLE_CAP = 600;

const FONT_ADVANCE = 0.62;
const TARGET_WIDTH = 0.92;

interface Vec {
  x: number;
  y: number;
}

interface Particle {
  ax: Vec | null;
  bx: Vec | null;
  phase: number;
  driftX: number;
  driftY: number;
}

type Phase = "holdA" | "morphAB" | "holdB" | "morphBA";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function shuffleAnchors(anchors: Vec[], seed: number): Vec[] {
  const shuffled = [...anchors];
  let value = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    value = (value * 1_664_525 + 1_013_904_223) >>> 0;
    const j = value % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Rasterize a name into the set of occupied grid-cell indices. */
function sampleCells(name: string, w: number, h: number): Set<number> {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d");
  if (!octx) return new Set();

  const fontSize = Math.min(h * 0.85, (w * TARGET_WIDTH) / (name.length * FONT_ADVANCE));
  octx.clearRect(0, 0, w, h);
  octx.fillStyle = "#fff";
  octx.font = `600 ${fontSize}px Arial, Helvetica, sans-serif`;
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(name, w / 2, h / 2);

  const data = octx.getImageData(0, 0, w, h).data;
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  const cells = new Set<number>();
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px = Math.min(w - 1, Math.floor(cx * CELL + CELL / 2));
      const py = Math.min(h - 1, Math.floor(cy * CELL + CELL / 2));
      if (data[(py * w + px) * 4 + 3] > 128) cells.add(cy * cols + cx);
    }
  }
  return cells;
}

/** Where a particle should sit, and how visible it is, for the current phase. */
function particleTarget(
  p: Particle,
  phase: Phase,
  t: number,
  now: number,
): { x: number; y: number; alpha: number } | null {
  if (phase === "holdA" || phase === "holdB") {
    const visible = phase === "holdA" ? p.ax : p.bx;
    if (!visible) return null;
    return {
      x: visible.x + Math.sin(now * 0.001 + p.phase * Math.PI * 2) * 1.5,
      y: visible.y + Math.cos(now * 0.0013 + p.phase * Math.PI * 2),
      alpha: 1,
    };
  }

  const movingToB = phase === "morphAB";
  const from = movingToB ? p.ax : p.bx;
  const to = movingToB ? p.bx : p.ax;
  if (!from && !to) return null;

  const progress = easeInOutCubic(
    Math.max(0, Math.min(1, t * 1.3 - p.phase * 0.3)),
  );

  if (from && to) {
    const scramble = Math.sin(progress * Math.PI);
    const wobble = Math.sin(now * 0.015 + p.phase * Math.PI * 2) * 2.5 * progress;
    return {
      x: from.x + (to.x - from.x) * progress + wobble + p.driftX * scramble,
      y: from.y + (to.y - from.y) * progress + p.driftY * scramble,
      alpha: 1,
    };
  }
  if (to) {
    const appear = easeInOutCubic(
      Math.max(0, Math.min(1, (t - 0.45) * 2 - p.phase * 0.2)),
    );
    return { x: to.x, y: to.y, alpha: appear };
  }
  const vanish = easeInOutCubic(
    Math.max(0, Math.min(1, t * 2 + p.phase * 0.2)),
  );
  return { x: from!.x, y: from!.y, alpha: 1 - vanish };
}

/** The static dot-matrix SVG wordmark (reduced motion / no-JS). */
function StaticWordmark() {
  return (
    <svg
      viewBox="0 0 1120 340"
      className="block w-full text-white/[0.16]"
      role="presentation"
    >
      <defs>
        <pattern
          id={WORDMARK_ID}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="0.9" fill="currentColor" />
        </pattern>
        <mask
          id={`${WORDMARK_ID}-mask`}
          x="0"
          y="0"
          width="1120"
          height="340"
          maskUnits="userSpaceOnUse"
        >
          <text
            x="560"
            y="270"
            textAnchor="middle"
            textLength="1092"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="210"
            fontWeight="600"
            letterSpacing="-12"
            fill="white"
          >
            {WORDMARK_A}
          </text>
        </mask>
      </defs>
      <rect
        width="1120"
        height="340"
        fill={`url(#${WORDMARK_ID})`}
        mask={`url(#${WORDMARK_ID}-mask)`}
      />
    </svg>
  );
}

export function FooterAsciiBrand() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const hasDrawnRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const activeWrapper = wrapper;
    const activeCanvas = canvas;
    const activeContext = ctx;

    let particles: Particle[] = [];
    let rafId = 0;
    let lastFrame = 0;
    let disposed = false;
    let inView = false;

    function build(w: number, h: number) {
      const cols = Math.ceil(w / CELL);
      const cellsA = sampleCells(WORDMARK_A, w, h);
      const cellsB = sampleCells(WORDMARK_B, w, h);
      if (cellsA.size === 0 && cellsB.size === 0) return;

      const pointsFor = (cells: Set<number>) =>
        [...cells].map((idx) => ({
          x: (idx % cols) * CELL + CELL / 2,
          y: Math.floor(idx / cols) * CELL + CELL / 2,
        }));
      const allA = pointsFor(cellsA);
      const allB = pointsFor(cellsB);
      const step = Math.max(1, Math.ceil(Math.max(allA.length, allB.length) / PARTICLE_CAP));
      const anchorsA = shuffleAnchors(allA.filter((_, i) => i % step === 0), 17);
      const anchorsB = shuffleAnchors(allB.filter((_, i) => i % step === 0), 53);
      const count = Math.max(anchorsA.length, anchorsB.length);
      particles = [];
      for (let i = 0; i < count; i++) {
        const phase = ((i * 7) % 100) / 100;
        const angle = phase * Math.PI * 2;
        particles.push({
          ax: anchorsA.length ? anchorsA[i % anchorsA.length] : null,
          bx: anchorsB.length ? anchorsB[i % anchorsB.length] : null,
          phase,
          driftX: Math.cos(angle) * (10 + (i % 5) * 3),
          driftY: Math.sin(angle) * (8 + (i % 4) * 3),
        });
      }
    }

    function resize() {
      const rect = activeWrapper.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      activeCanvas.width = Math.ceil(w * dpr);
      activeCanvas.height = Math.ceil(h * dpr);
      activeCanvas.style.width = `${w}px`;
      activeCanvas.style.height = `${h}px`;
      activeContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function draw(now: number) {
      activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      if (!inView || particles.length === 0) return;

      const pos = now % CYCLE_MS;
      let phase: Phase;
      let t = 0;
      if (pos < HOLD_MS) {
        phase = "holdA";
      } else if (pos < HOLD_MS + MORPH_MS) {
        phase = "morphAB";
        t = (pos - HOLD_MS) / MORPH_MS;
      } else if (pos < 2 * HOLD_MS + MORPH_MS) {
        phase = "holdB";
      } else {
        phase = "morphBA";
        t = (pos - (2 * HOLD_MS + MORPH_MS)) / MORPH_MS;
      }

      activeContext.fillStyle = "rgba(245, 242, 238, 1)";
      activeContext.font = "4px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas";
      activeContext.textAlign = "center";
      activeContext.textBaseline = "middle";

      for (const p of particles) {
        const r = particleTarget(p, phase, t, now);
        if (!r) continue;
        activeContext.globalAlpha = 0.16 * r.alpha;
        activeContext.fillText("·", r.x, r.y);
      }
      activeContext.globalAlpha = 1;
      if (!hasDrawnRef.current) {
        hasDrawnRef.current = true;
        setHasDrawn(true);
      }
    }

    function tick(ts: number) {
      if (disposed) return;
      if (ts - lastFrame >= FRAME_INTERVAL) {
        lastFrame = ts;
        draw(ts);
      }
      rafId = requestAnimationFrame(tick);
    }

    function startLoop(now: number) {
      cancelAnimationFrame(rafId);
      lastFrame = now - FRAME_INTERVAL;
      draw(now);
      rafId = requestAnimationFrame(tick);
    }

    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          startLoop(performance.now());
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    io.observe(activeWrapper);

    const initialRect = activeWrapper.getBoundingClientRect();
    inView = initialRect.bottom > 0 && initialRect.top < window.innerHeight;
    if (inView) startLoop(performance.now());

    const ro = new ResizeObserver(() => resize());
    ro.observe(activeWrapper);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, [mounted, prefersReducedMotion]);

  const showCanvas = mounted && !prefersReducedMotion;

  return (
    <div
      className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden"
      aria-hidden="true"
    >
      {showCanvas ? (
        <div ref={wrapperRef} className="relative h-full w-full">
          <div
            data-wordmark-fallback
            className="absolute inset-0 transition-opacity duration-[var(--duration-standard)]"
            style={{ opacity: hasDrawn ? 0 : 1 }}
          >
            <StaticWordmark />
          </div>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full transition-opacity duration-[var(--duration-standard)]"
            style={{ opacity: hasDrawn ? 1 : 0 }}
          />
        </div>
      ) : (
        <StaticWordmark />
      )}
    </div>
  );
}
