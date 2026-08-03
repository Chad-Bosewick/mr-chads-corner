"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationContext } from "@/components/providers/AnimationProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDMARK_A = "Temi Adekunle";
const WORDMARK_B = "Chad Bosewick";
const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 340;
const TEXT_WIDTH = 1092;
const SEGMENT_COUNT = 13;
const DWELL_MS = 2200;
const SEGMENT_STAGGER_MS = 44;
const EXIT_DURATION_MS = 120;
const REPLACEMENT_GAP_MS = 36;
const ENTER_DURATION_MS = 160;

function WordMask({ id, name }: { id: string; name: string }) {
  return (
    <mask id={id} x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} maskUnits="userSpaceOnUse">
      <text
        x="560"
        y="270"
        textAnchor="middle"
        textLength={TEXT_WIDTH}
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="210"
        fontWeight="600"
        letterSpacing="-12"
        fill="white"
      >
        {name}
      </text>
    </mask>
  );
}

function StaticWordmark() {
  return (
    <svg viewBox="0 0 1120 340" className="block w-full text-white/[0.16]" role="presentation">
      <defs>
        <pattern id="footer-wordmark-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.9" fill="currentColor" />
        </pattern>
        <WordMask id="footer-wordmark-static-mask" name={WORDMARK_A} />
      </defs>
      <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#footer-wordmark-dots)" mask="url(#footer-wordmark-static-mask)" />
    </svg>
  );
}

function SequencedWordmark() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showChad, setShowChad] = useState(false);
  const { isAsciiPaused } = useAnimationContext();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || isAsciiPaused) return;
    const timer = window.setTimeout(() => setShowChad((current) => !current), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [visible, isAsciiPaused, showChad]);

  const segmentWidth = VIEWBOX_WIDTH / SEGMENT_COUNT;
  const renderName = (name: string, maskId: string, active: boolean) =>
    Array.from({ length: SEGMENT_COUNT }, (_, index) => {
      const delay = index * SEGMENT_STAGGER_MS + (active ? EXIT_DURATION_MS + REPLACEMENT_GAP_MS : 0);
      return (
        <rect
          key={`${name}-${index}`}
          x={index * segmentWidth}
          y="0"
          width={segmentWidth + 1}
          height={VIEWBOX_HEIGHT}
          fill="url(#footer-wordmark-sequence-dots)"
          mask={`url(#${maskId})`}
          style={{
            opacity: active ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: `${active ? ENTER_DURATION_MS : EXIT_DURATION_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            transitionDelay: `${delay}ms`,
          }}
        />
      );
    });

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <svg viewBox="0 0 1120 340" className="block w-full text-white/[0.16]" role="presentation">
        <defs>
          <pattern id="footer-wordmark-sequence-dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.9" fill="currentColor" />
          </pattern>
          <WordMask id="footer-wordmark-temi-mask" name={WORDMARK_A} />
          <WordMask id="footer-wordmark-chad-mask" name={WORDMARK_B} />
        </defs>
        {renderName(WORDMARK_A, "footer-wordmark-temi-mask", !showChad)}
        {renderName(WORDMARK_B, "footer-wordmark-chad-mask", showChad)}
      </svg>
    </div>
  );
}

export function FooterAsciiBrand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mt-14 h-[clamp(6.5rem,21vw,15rem)] overflow-hidden" aria-hidden="true">
      {prefersReducedMotion ? <StaticWordmark /> : <SequencedWordmark />}
    </div>
  );
}
