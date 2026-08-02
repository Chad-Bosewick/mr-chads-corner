"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationContext } from "@/components/providers/AnimationProvider";
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
const GATHER_MS = 900;
const CONSTELLATION_OPACITY = 0.45;
const DISPERSED_MAX_DRIFT = 5;

export interface ParticlePoint {
  x: number;
  y: number;
}

interface WordmarkParticle {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  dx: number;
  dy: number;
  delayMs: number;
}

type Target = "dispersed" | "a" | "b";
type Phase = "dispersed" | "gather" | "dwellA" | "morphAtoB" | "dwellB" | "morphBToA";

interface SchedulerController {
  setPaused: (paused: boolean) => void;
  setVisible: (visible: boolean) => void;
}

function sampleEvenly(points: ParticlePoint[], count: number): ParticlePoint[] {
  if (points.length <= count) return points;
  const step = points.length / count;
  return Array.from({ length: count }, (_, index) => points[Math.floor(index * step)]);
}

function seededJitter(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const unit = value - Math.floor(value);
  return (unit * 2 - 1) * DISPERSED_MAX_DRIFT;
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
      dx: a.x + seededJitter(index * 2 + 1),
      dy: a.y + seededJitter(index * 2 + 2),
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

function targetForPhase(phase: Phase): Target {
  if (phase === "dispersed") return "dispersed";
  if (phase === "morphAtoB" || phase === "dwellB") return "b";
  return "a";
}

function ParticleWordmark({
  particles,
  phase,
  paused,
}: {
  particles: WordmarkParticle[];
  phase: Phase;
  paused: boolean;
}) {
  const target = targetForPhase(phase);
  const isGathering = phase === "gather";
  const isMorphing = phase === "morphAtoB" || phase === "morphBToA";

  return (
    <svg
      viewBox="0 0 1120 340"
      className="block w-full text-white/[0.16]"
      role="presentation"
      data-wordmark-target={target}
      data-wordmark-phase={phase}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes footer-shared-constellation {
            0%, 100% { opacity: 1; }
            50% { opacity: ${CONSTELLATION_OPACITY}; }
          }
        }
      `}</style>
      {particles.map((particle, index) => {
        const translateX =
          target === "dispersed"
            ? particle.dx - particle.ax
            : target === "b"
              ? particle.bx - particle.ax
              : 0;
        const translateY =
          target === "dispersed"
            ? particle.dy - particle.ay
            : target === "b"
              ? particle.by - particle.ay
              : 0;
        const transitionDuration = isGathering ? GATHER_MS : isMorphing ? MORPH_MS : 0;
        const transitionDelay = isMorphing ? particle.delayMs : 0;

        return (
          <circle
            key={index}
            data-wordmark-particle
            cx={particle.ax}
            cy={particle.ay}
            r="1.05"
            fill="currentColor"
            style={{
              opacity: target === "dispersed" ? 0 : 1,
              transform: `translate(${translateX}px, ${translateY}px)`,
              transitionProperty: "transform, opacity",
              transitionDuration: `${transitionDuration}ms`,
              transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
              transitionDelay: `${transitionDelay}ms`,
              animationName: isMorphing ? "footer-shared-constellation" : "none",
              animationDuration: `${MORPH_MS}ms`,
              animationTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
              animationDelay: `${transitionDelay}ms`,
              animationFillMode: "both",
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        );
      })}
    </svg>
  );
}

function AnimatedWordmark() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SchedulerController | null>(null);
  const hasGatheredRef = useRef(false);
  const isAsciiPausedRef = useRef(false);
  const [particles, setParticles] = useState<WordmarkParticle[]>([]);
  const [phase, setPhase] = useState<Phase>("dispersed");
  const { isAsciiPaused } = useAnimationContext();
  isAsciiPausedRef.current = isAsciiPaused;

  useEffect(() => {
    const pointsA = sampleWord(WORDMARK_A);
    const pointsB = sampleWord(WORDMARK_B);
    setParticles(pairParticleAnchors(pointsA, pointsB));
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let timerId = 0;
    let phaseStartedAt = 0;
    let remainingMs = 0;
    let visible = false;
    let paused = isAsciiPausedRef.current;
    let currentPhase: Phase = "dispersed";

    const setParticleAnimationsPaused = (shouldPause: boolean) => {
      wrapper.querySelectorAll<SVGCircleElement>("[data-wordmark-particle]").forEach((circle) => {
        if (typeof circle.getAnimations !== "function") return;
        circle.getAnimations().forEach((animation) => {
          if (shouldPause) animation.pause();
          else animation.play();
        });
      });
    };

    const clearTimer = (captureRemaining: boolean) => {
      if (timerId === 0) return;
      if (captureRemaining) {
        remainingMs = Math.max(0, remainingMs - (performance.now() - phaseStartedAt));
      }
      window.clearTimeout(timerId);
      timerId = 0;
    };

    const advancePhase = () => {
      if (currentPhase === "gather") enterPhase("dwellA", HOLD_MS);
      else if (currentPhase === "dwellA") enterPhase("morphAtoB", MORPH_MS + WAVE_MS);
      else if (currentPhase === "morphAtoB") enterPhase("dwellB", HOLD_MS);
      else if (currentPhase === "dwellB") enterPhase("morphBToA", MORPH_MS + WAVE_MS);
      else enterPhase("dwellA", HOLD_MS);
    };

    const scheduleRemaining = () => {
      if (!visible || paused || remainingMs <= 0) return;
      setParticleAnimationsPaused(false);
      phaseStartedAt = performance.now();
      timerId = window.setTimeout(() => {
        timerId = 0;
        remainingMs = 0;
        advancePhase();
      }, remainingMs);
    };

    function enterPhase(nextPhase: Phase, duration: number) {
      clearTimer(false);
      currentPhase = nextPhase;
      remainingMs = duration;
      setPhase(nextPhase);
      scheduleRemaining();
    }

    const stop = () => {
      clearTimer(true);
      setParticleAnimationsPaused(true);
    };

    const resume = () => {
      if (!visible) return;
      if (!hasGatheredRef.current) {
        hasGatheredRef.current = true;
        if (paused) {
          enterPhase("dwellA", HOLD_MS);
          setParticleAnimationsPaused(true);
          return;
        }
        enterPhase("gather", GATHER_MS);
        return;
      }
      if (paused) {
        setParticleAnimationsPaused(true);
        return;
      }
      scheduleRemaining();
    };

    const controller: SchedulerController = {
      setPaused(nextPaused) {
        if (paused === nextPaused) return;
        paused = nextPaused;
        if (paused) stop();
        else resume();
      },
      setVisible(nextVisible) {
        if (visible === nextVisible) return;
        visible = nextVisible;
        if (visible) resume();
        else stop();
      },
    };
    controllerRef.current = controller;

    const observer = new IntersectionObserver(
      ([entry]) => controller.setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const rect = wrapper.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      controller.setVisible(true);
    }

    return () => {
      clearTimer(false);
      observer.disconnect();
      controllerRef.current = null;
    };
  }, [particles.length]);

  useEffect(() => {
    controllerRef.current?.setPaused(isAsciiPaused);
  }, [isAsciiPaused]);

  return (
    <div ref={wrapperRef} className="h-full w-full">
      {particles.length > 0 ? (
        <ParticleWordmark particles={particles} phase={phase} paused={isAsciiPaused} />
      ) : (
        <StaticWordmark />
      )}
    </div>
  );
}

export function FooterAsciiBrand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden"
      aria-hidden="true"
    >
      {prefersReducedMotion ? <StaticWordmark /> : <AnimatedWordmark />}
    </div>
  );
}
