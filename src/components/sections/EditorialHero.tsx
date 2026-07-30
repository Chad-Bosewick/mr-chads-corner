"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TimelineHero } from "@/components/effects/TimelineHero";
import { EntranceAnimation } from "@/components/effects/EntranceAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Greetings ordered as a narrative arc: familiar → European → global ──
 *  Latin scripts match the label's uppercase presentation for visual rhythm;
 *  non-Latin scripts keep their native form — the shift signals a language
 *  change without needing a label.                                        */
const GREETINGS = [
  "HELLO",
  "HOLA",
  "BONJOUR",
  "你好",
  "こんにちは",
  "مرحبا",
  "नमस्ते",
] as const;

/* Staggered dwell — non-Latin scripts get extra time to visually process */
const DWELL_MS: Record<number, number> = {
  0: 3500,
  1: 3500,
  2: 3500,
  3: 5000,
  4: 5000,
  5: 5000,
  6: 5000,
};

interface EditorialHeroProps {
  name: string;
  tagline: string;
  /** Optional editorial label shown above the name. When omitted, the default
   *  "AI NATIVE DESIGNER · <cycling greeting>" is shown. */
  label?: string;
}

export function EditorialHero({
  name,
  tagline,
  label,
}: EditorialHeroProps) {
  const [showEntrance, setShowEntrance] = useState(true);
  const [timelineReady, setTimelineReady] = useState(false);

  return (
    <section
      className="relative"
      aria-label="Introduction"
    >
      {showEntrance && (
        <EntranceAnimation
          onComplete={() => {
            setShowEntrance(false);
            setTimelineReady(true);
          }}
        />
      )}
      <div>
        {/* Editorial label */}
        {label ? (
          <p
            className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]"
            style={{ fontFeatureSettings: "'ss01' on, 'case' on" }}
          >
            {label}
          </p>
        ) : (
          <AnimatedLabel />
        )}

        {/* Main heading — editorial display */}
        <h1 className="mt-6 font-sans text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#151515]">
          {name.split(" ").length === 2 ? (
            <>
              {name.split(" ")[0]}
              <br />
              {name.split(" ").slice(1).join(" ")}
            </>
          ) : (
            name
          )}
        </h1>

        {/* Career timeline — hover over markers to explore milestones */}
        <TimelineHero animate={timelineReady} />

        {/* Tagline */}
        <p className="mt-6 text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          {tagline}
        </p>
      </div>
    </section>
  );
}

/* ── Animated editorial label ─────────────────────────────────── */

function AnimatedLabel() {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* Measure the widest greeting to prevent layout shift on cycle */
  useEffect(() => {
    const parent = measureRef.current?.parentElement;
    if (!parent || containerWidth > 0) return;
    const temp = parent.cloneNode(false) as HTMLElement;
    temp.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;white-space:nowrap;";
    temp.style.font = getComputedStyle(parent).font;
    temp.style.letterSpacing = getComputedStyle(parent).letterSpacing;
    document.body.appendChild(temp);

    let max = 0;
    for (const g of GREETINGS) {
      temp.textContent = g;
      max = Math.max(max, temp.offsetWidth);
    }
    document.body.removeChild(temp);
    setContainerWidth(max);
  }, [containerWidth]);

  /* Recursive setTimeout for staggered dwell times */
  useEffect(() => {
    if (prefersReducedMotion) {
      setIndex(0);
      return;
    }

    const nextIdx = { current: 0 };
    let timer: number;

    const tick = () => {
      nextIdx.current = (nextIdx.current + 1) % GREETINGS.length;
      setIndex(nextIdx.current);
      timer = window.setTimeout(tick, DWELL_MS[nextIdx.current]);
    };

    const initialDelay = window.setTimeout(tick, 5000);

    return () => {
      window.clearTimeout(initialDelay);
      window.clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  return (
    <p
      aria-label="AI NATIVE DESIGNER"
      aria-live="off"
      className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]"
      style={{ fontFeatureSettings: "'ss01' on, 'case' on" }}
    >
      <span>AI NATIVE DESIGNER</span>
      <span aria-hidden="true"> · </span>
      <span
        aria-hidden="true"
        ref={measureRef}
        className="inline-block align-baseline"
        style={{ width: containerWidth > 0 ? containerWidth : undefined }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={GREETINGS[index]}
            className="block uppercase leading-none"
            initial={{ opacity: 0, y: 2, filter: "blur(4px)", scale: 0.96 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -2, filter: "blur(4px)", scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          >
            {GREETINGS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
