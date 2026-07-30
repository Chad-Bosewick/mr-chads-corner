"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Constants ───────────────────────────────────────────────── */

const FRAME_INTERVAL = 1000 / 15;

/* Denser grid for a more textile-like feel */
const CELL = 6;
const FONT_SIZE = 4;

/* Heavily weighted toward fine dots for an ambient woven texture */
const CHARS = [
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "·", "·", "·", "·", "·", "·", "·", "·",
  "⋮",  "·", "·", "·", "·", "·", "·", "·",
  "·",  "·", "·", "·", "·", "·", "·", "·",
  "·",  "·", "·", "·", "·", "·", "·", "·",
  "·",  "·", "·", "·", "·", "·", "·", "·",
  "·",  "·", "·", "·", "·", "·", "·", "·",
];

/* ── Types ───────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  vx: number;
  vy: number;
  charIndex: number;
  phase: number;
  grain: number;
  baseDrift: number;
}

/* ── Component ──────────────────────────────────────────────── */

export function FooterAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let particles: Particle[] = [];
    let rafId = 0;
    let lastFrame = 0;
    let disposed = false;

    function buildParticles(w: number, h: number) {
      const cols = Math.floor(w / CELL) + 2;
      const rows = Math.floor(h / CELL) + 2;
      particles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;
          const seed = c * 31 + r * 17;
          const phase = fract(Math.sin(seed * 7.3)) * Math.PI * 2;
          const grain = fract(Math.sin(seed * 13.7));
          particles.push({
            x, y, anchorX: x, anchorY: y,
            vx: 0, vy: 0,
            charIndex: Math.floor(grain * CHARS.length),
            phase, grain,
            baseDrift: 2 + grain * 5,
          });
        }
      }
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      canvas!.width = w;
      canvas!.height = h;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      buildParticles(w, h);
    }

    function update(dt: number, time: number) {
      for (const p of particles) {
        const speed = 0.12 + p.grain * 0.08;
        const tx =
          p.anchorX +
          Math.sin(time * speed + p.phase) * p.baseDrift * 0.6 +
          Math.sin(time * speed * 0.6 + p.phase * 1.4) * p.baseDrift * 0.4;
        const ty =
          p.anchorY +
          Math.cos(time * speed * 0.7 + p.phase * 1.2) * p.baseDrift * 0.5 +
          Math.cos(time * speed * 0.4 + p.phase * 1.8) * p.baseDrift * 0.3;

        const sx = tx - p.x;
        const sy = ty - p.y;
        p.vx += sx * 0.015 * dt;
        p.vy += sy * 0.015 * dt;

        const speed2 = Math.hypot(p.vx, p.vy);
        if (speed2 > 0.3) {
          p.vx = (p.vx / speed2) * 0.3;
          p.vy = (p.vy / speed2) * 0.3;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;
      }
    }

    function draw(time: number) {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      const dt = Math.min(2.4, Math.max(0.6, FRAME_INTERVAL / 16.67));

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      update(dt, time);

      for (const p of particles) {
        const breathe = 0.5 + 0.5 * Math.sin(time * 0.35 + p.phase);
        const alpha = 0.018 + breathe * 0.035;
        ctx.fillStyle = `rgba(245, 242, 238, ${alpha.toFixed(4)})`;
        ctx.fillText(CHARS[p.charIndex], p.x, p.y);
      }
    }

    resize();

    function tick(ts: number) {
      if (disposed) return;
      if (ts - lastFrame >= FRAME_INTERVAL) {
        lastFrame = ts;
        draw(ts / 1000);
      }
      rafId = requestAnimationFrame(tick);
    }

    if (!prefersReducedMotion) {
      lastFrame = performance.now();
      rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

function fract(value: number) {
  return value - Math.floor(value);
}
