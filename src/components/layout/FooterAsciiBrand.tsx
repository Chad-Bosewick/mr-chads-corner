"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDMARK_ID = "footer-wordmark-dots";
const WORDMARK_A = "Temi Adekunle";
const WORDMARK_B = "Chad Bosewick";
const SCRAMBLE_GLYPHS = "#%&*+.:=?@";

const FRAME_INTERVAL = 1000 / 15;
const HOLD_MS = 2500;
const MORPH_MS = 1200;
const CYCLE_MS = 2 * (HOLD_MS + MORPH_MS);

const REVEAL_ORDER = [0.08, 0.76, 0.31, 0.92, 0, 0.54, 0.15, 0.84, 0.38, 0.69, 0.23, 1, 0.46];

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Resolve one fixed-length name into another without ever producing a blank frame. */
export function scrambleWord(
  from: string,
  to: string,
  progress: number,
  frame: number,
): string {
  const amount = clamp01(progress);
  if (amount === 0) return from;
  if (amount === 1) return to;

  const length = Math.max(from.length, to.length);
  return Array.from({ length }, (_, index) => {
    const fromCharacter = from[index] ?? " ";
    const toCharacter = to[index] ?? " ";
    if (fromCharacter === " " && toCharacter === " ") return " ";

    const order = REVEAL_ORDER[index % REVEAL_ORDER.length];
    const scrambleAt = 0.08 + order * 0.18;
    const revealAt = 0.52 + order * 0.42;

    if (amount <= scrambleAt) return fromCharacter;
    if (amount >= revealAt) return toCharacter;

    return SCRAMBLE_GLYPHS[(frame + index * 3) % SCRAMBLE_GLYPHS.length];
  }).join("");
}

function DotMatrixWordmark({ word }: { word: string }) {
  return (
    <svg
      viewBox="0 0 1120 340"
      className="block h-full w-full text-white/[0.16]"
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
            {word}
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
  const [word, setWord] = useState(WORDMARK_A);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setWord(WORDMARK_A);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId = 0;
    let cycleStartedAt = 0;
    let lastFrameAt = 0;
    let running = false;

    const renderFrame = (now: number) => {
      const elapsed = (now - cycleStartedAt) % CYCLE_MS;
      const frame = Math.floor((now - cycleStartedAt) / FRAME_INTERVAL);

      if (elapsed < HOLD_MS) {
        setWord(WORDMARK_A);
      } else if (elapsed < HOLD_MS + MORPH_MS) {
        setWord(
          scrambleWord(
            WORDMARK_A,
            WORDMARK_B,
            (elapsed - HOLD_MS) / MORPH_MS,
            frame,
          ),
        );
      } else if (elapsed < 2 * HOLD_MS + MORPH_MS) {
        setWord(WORDMARK_B);
      } else {
        setWord(
          scrambleWord(
            WORDMARK_B,
            WORDMARK_A,
            (elapsed - (2 * HOLD_MS + MORPH_MS)) / MORPH_MS,
            frame,
          ),
        );
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      if (now - lastFrameAt >= FRAME_INTERVAL) {
        lastFrameAt = now;
        renderFrame(now);
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = (now: number) => {
      if (running) return;
      running = true;
      cycleStartedAt = now;
      lastFrameAt = now - FRAME_INTERVAL;
      renderFrame(now);
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start(performance.now());
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const rect = wrapper.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      start(performance.now());
    }

    return () => {
      stop();
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden"
      aria-hidden="true"
    >
      <DotMatrixWordmark word={word} />
    </div>
  );
}
