"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDMARK_ID = "footer-wordmark-dots";
const WORDMARK_A = "Temi Adekunle";
const WORDMARK_B = "Chad Bosewick";

const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 340;
const TEXT_WIDTH = 1092;
const CELL = 6;
const PARTICLE_CAP = 720;

const HOLD_MS = 1600;
const MORPH_MS = 680;
const WAVE_MS = 220;

export interface ParticlePoint {
  x: number;
  y: number;
}

interface WordmarkParticle {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  delayMs: number;
}

function sampleEvenly(points: ParticlePoint[], count: number): ParticlePoint[] {
  if (points.length <= count) return points;
  const step = points.length / count;
  return Array.from({ length: count }, (_, index) => points[Math.floor(index * step)]);
}

/** Pair dots by their reading-order position so each node travels locally. */
export function pairParticleAnchors(
  pointsA: ParticlePoint[],
  pointsB: ParticlePoint[],
  cap = PARTICLE_CAP,
): WordmarkParticle[] {
  if (pointsA.length === 0 || pointsB.length === 0) return [];

  const targetCount = Math.min(cap, Math.max(pointsA.length, pointsB.length));
  const sortReadingOrder = (points: ParticlePoint[]) =>
    [...points].sort((left, right) => left.x - right.x || left.y - right.y);
  const anchorsA = sortReadingOrder(sampleEvenly(pointsA, targetCount));
  const anchorsB = sortReadingOrder(sampleEvenly(pointsB, targetCount));

  return Array.from({ length: targetCount }, (_, index) => {
    const a = anchorsA[Math.floor((index * anchorsA.length) / targetCount)];
    const b = anchorsB[Math.floor((index * anchorsB.length) / targetCount)];
    const leadingX = Math.max(a.x, b.x);

    return {
      ax: a.x,
      ay: a.y,
      bx: b.x,
      by: b.y,
      delayMs: ((VIEWBOX_WIDTH - leadingX) / VIEWBOX_WIDTH) * WAVE_MS,
    };
  });
}

function sampleWord(name: string): ParticlePoint[] {
  const canvas = document.createElement("canvas");
  canvas.width = VIEWBOX_WIDTH;
  canvas.height = VIEWBOX_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return [];

  context.clearRect(0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT);
  context.fillStyle = "#fff";
  context.font = "600 210px Arial, Helvetica, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  const measuredWidth = Math.max(1, context.measureText(name).width);
  context.save();
  context.translate(VIEWBOX_WIDTH / 2, 0);
  context.scale(TEXT_WIDTH / measuredWidth, 1);
  context.fillText(name, 0, 270);
  context.restore();

  const pixels = context.getImageData(0, 0, VIEWBOX_WIDTH, VIEWBOX_HEIGHT).data;
  const points: ParticlePoint[] = [];
  for (let y = CELL / 2; y < VIEWBOX_HEIGHT; y += CELL) {
    for (let x = CELL / 2; x < VIEWBOX_WIDTH; x += CELL) {
      const pixelX = Math.floor(x);
      const pixelY = Math.floor(y);
      if (pixels[(pixelY * VIEWBOX_WIDTH + pixelX) * 4 + 3] > 96) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

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

function ParticleWordmark({
  particles,
  target,
}: {
  particles: WordmarkParticle[];
  target: "a" | "b";
}) {
  const toB = target === "b";

  return (
    <svg
      viewBox="0 0 1120 340"
      className="block w-full text-white/[0.16]"
      role="presentation"
      data-wordmark-target={target}
    >
      {particles.map((particle, index) => {
        const translateX = toB ? particle.bx - particle.ax : 0;
        const translateY = toB ? particle.by - particle.ay : 0;

        return (
          <circle
            key={index}
            data-wordmark-particle
            cx={particle.ax}
            cy={particle.ay}
            r="1.05"
            fill="currentColor"
            style={{
              transform: `translate(${translateX}px, ${translateY}px)`,
              transitionProperty: "transform, opacity",
              transitionDuration: `${MORPH_MS}ms`,
              transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
              transitionDelay: `${particle.delayMs}ms`,
            }}
          />
        );
      })}
    </svg>
  );
}

export function FooterAsciiBrand() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<WordmarkParticle[]>([]);
  const [target, setTarget] = useState<"a" | "b">("a");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setParticles([]);
      setTarget("a");
      return;
    }

    const pointsA = sampleWord(WORDMARK_A);
    const pointsB = sampleWord(WORDMARK_B);
    setParticles(pairParticleAnchors(pointsA, pointsB));
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || particles.length === 0) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let timerId = 0;
    let running = false;

    const scheduleMorph = (nextTarget: "a" | "b") => {
      setTarget(nextTarget);
      timerId = window.setTimeout(
        () => scheduleMorph(nextTarget === "a" ? "b" : "a"),
        MORPH_MS + WAVE_MS + HOLD_MS,
      );
    };

    const start = () => {
      if (running) return;
      running = true;
      setTarget("a");
      timerId = window.setTimeout(() => scheduleMorph("b"), HOLD_MS);
    };

    const stop = () => {
      running = false;
      window.clearTimeout(timerId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const rect = wrapper.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) start();

    return () => {
      stop();
      observer.disconnect();
    };
  }, [particles.length, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden"
      aria-hidden="true"
    >
      {particles.length > 0 && !prefersReducedMotion ? (
        <ParticleWordmark particles={particles} target={target} />
      ) : (
        <StaticWordmark />
      )}
    </div>
  );
}
