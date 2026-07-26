"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Heart SVG path (same gradient as canvas timeline) ───────── */
const HEART_PATH =
  "M60.7292 116.479C44.2717 104.172 11.6667 76.0375 11.6667 50.7187" +
  "C11.6667 33.9839 23.9474 20.4177 40.8334 20.4177" +
  "C49.5834 20.4177 58.3334 23.3344 70.0001 35.0011" +
  "C81.6667 23.3344 90.4167 20.4177 99.1667 20.4177" +
  "C116.052 20.4177 128.333 33.9839 128.333 50.7187" +
  "C128.333 76.0375 95.7286 104.172 79.271 116.479" +
  "C73.7328 120.621 66.2673 120.621 60.7292 116.479Z";

const HEART_SIZE = 22; /* matches canvas timeline mascot size */

/* ── Timing constants — fluid, no pauses ─────────────────────── */
const T = {
  initialDelay: 0.5,
  appear: 0.35,
  fallToLabel: 0.7,
  rollToGap: 0.5,
  fallToTemi: 0.55,
  fallToAdekunle: 0.45,
  rollToA: 0.45,
  fallToTimeline: 0.6,
  fadeOut: 0.5,
};

/* ── Helper: get bounding rect of a character in a heading ──── */
function getCharRect(
  heading: HTMLHeadingElement,
  textNodeIndex: number,
  charOffset: number,
): DOMRect | null {
  const textNodes: Text[] = [];
  heading.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim()) {
      textNodes.push(node as Text);
    }
  });
  const node = textNodes[textNodeIndex];
  if (!node) return null;
  const text = node.textContent!;
  const idx = Math.min(charOffset, text.length - 1);
  const range = document.createRange();
  range.setStart(node, idx);
  range.setEnd(node, Math.min(idx + 1, text.length));
  return range.getBoundingClientRect();
}

/* ── Liquid fall — gentle sway, sine.inOut throughout ────────── */
function liquidFall(
  tl: gsap.core.Timeline,
  heart: HTMLElement,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  totalDur: number,
  rotDir: number,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const m1x = fromX + dx * 0.4;
  const m1y = fromY + dy * 0.4;
  const m2x = fromX + dx * 0.7;
  const m2y = fromY + dy * 0.7;

  tl.to(heart, {
    x: m1x - 5, y: m1y, rotation: rotDir * 12,
    duration: totalDur * 0.35, ease: "sine.inOut",
  })
  .to(heart, {
    x: m2x + 3, y: m2y, rotation: rotDir * -7,
    duration: totalDur * 0.35, ease: "sine.inOut",
  })
  .to(heart, {
    x: toX, y: toY, rotation: rotDir * 1,
    duration: totalDur * 0.3, ease: "sine.inOut",
  });
}

interface EntranceAnimationProps {
  onComplete?: () => void;
}

export function EntranceAnimation({ onComplete }: EntranceAnimationProps) {
  const heartRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const prefersReducedMotion = useReducedMotion();
  const doneRef = useRef(false);

  useEffect(() => {
    const cb = onCompleteRef.current;

    if (prefersReducedMotion || window.innerWidth < 768) {
      doneRef.current = true;
      cb?.();
      return;
    }

    const heart = heartRef.current;
    if (!heart) return;

    /* ── Gather target DOM positions ──────────────────────────── */
    const heading = document.querySelector<HTMLHeadingElement>("h1");
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const label = document.querySelector<HTMLParagraphElement>(
      'p[aria-label="AI NATIVE DESIGNER"]',
    );
    const canvas = document.querySelector<HTMLCanvasElement>(
      'canvas[data-timeline="true"]',
    );
    if (!heading || !nav || !canvas) {
      doneRef.current = true;
      cb?.();
      return;
    }

    const headingRect = heading.getBoundingClientRect();
    const navLink = nav.querySelector("li a");
    const navRect = navLink
      ? navLink.getBoundingClientRect()
      : nav.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const canvasWidth = canvasRect.width;
    const canvasH = canvasWidth < 500 ? 90 : 120;
    const groundY = Math.floor(canvasH * 0.58);

    /* Marker 0 (H1'23) position — where the timeline starts */
    const TIMELINE_PADDING = 28;
    const marker0X = canvasRect.left + TIMELINE_PADDING;
    const marker0Y = canvasRect.top + groundY;

    /* Logo start: left content edge, vertically at nav-link level */
    const logoX = headingRect.left;
    const logoY = navRect.top + navRect.height / 2 - HEART_SIZE / 2;

    /* ── Label positions ─────────────────────────────────────── */
    let labelLandX = headingRect.left + headingRect.width * 0.15;
    let labelLandY = headingRect.top - 30;
    let gapX = headingRect.left + headingRect.width * 0.55;

    const roleTitleSpan = label?.querySelector("span:first-child");
    if (roleTitleSpan) {
      const r = roleTitleSpan.getBoundingClientRect();
      labelLandX = r.left + r.width / 2;
      labelLandY = r.top - HEART_SIZE / 2;
      gapX = r.right + 6;
    }

    /* ── Character positions in the heading ──────────────────── */
    /*  h1 childNodes: [TextNode("Temi"), BR, TextNode("Adekunle")] */

    /* "i" in Temi  (textNode 0, index 3) */
    let temiX = headingRect.left + headingRect.width * 0.28;
    let temiY = headingRect.top - HEART_SIZE / 2;
    const temiIRect = getCharRect(heading, 0, 3);
    if (temiIRect) {
      temiX = temiIRect.left + temiIRect.width / 2;
      temiY = temiIRect.top - HEART_SIZE / 2;
    }

    /* "k" in Adekunle (textNode 1, index 3) */
    let adekKX = headingRect.left + headingRect.width * 0.55;
    let adekKY = headingRect.top + headingRect.height * 0.6 - HEART_SIZE / 2;
    const adekKRect = getCharRect(heading, 1, 3);
    if (adekKRect) {
      adekKX = adekKRect.left + adekKRect.width / 2;
      adekKY = adekKRect.top - HEART_SIZE / 2;
    }

    /* "A" of Adekunle (textNode 1, index 0) — left edge */
    let adekAX = headingRect.left;
    let adekAY = headingRect.top + headingRect.height * 0.6 - HEART_SIZE / 2;
    const adekARect = getCharRect(heading, 1, 0);
    if (adekARect) {
      adekAX = adekARect.left;
      adekAY = adekARect.top - HEART_SIZE / 2;
    }

    /* ── Build GSAP timeline ─────────────────────────────────── */
    const tl = gsap.timeline({
      paused: false,
      onComplete: () => {
        if (!doneRef.current) {
          doneRef.current = true;
          cb?.();
        }
      },
    });

    /* Total rotation counter for fluid accumulative spin */
    let rot = 0;

    gsap.set(heart, {
      x: logoX, y: logoY, scale: 0, opacity: 0, rotation: 0,
    });

    /* ── 1. Appear at logo position ──────────────────────────── */
    tl.to(heart, {
      scale: 1, opacity: 1,
      duration: T.appear, ease: "sine.out",
    }, T.initialDelay);

    rot = 0;

    /* ── 2. Liquid fall onto "AI NATIVE DESIGNER" ────────────── */
    liquidFall(tl, heart, logoX, logoY, labelLandX, labelLandY, T.fallToLabel, 1);
    rot += 12 - 7 + 1; /* accumulated from liquidFall rotations */

    /* ── 3. Roll right to the gap ────────────────────────────── */
    rot += 360;
    tl.to(heart, {
      x: gapX, y: labelLandY, rotation: rot,
      duration: T.rollToGap, ease: "sine.inOut",
    });

    /* ── 4. Liquid drop onto "i" in Temi ─────────────────────── */
    rot *= 1.15; /* carry momentum */
    liquidFall(tl, heart, gapX, labelLandY, temiX, temiY, T.fallToTemi, -1);

    /* ── 5. Liquid drop to "k" in Adekunle ───────────────────── */
    rot += 180;
    liquidFall(tl, heart, temiX, temiY, adekKX, adekKY, T.fallToAdekunle, 1);

    /* ── 6. Roll left to "A" of Adekunle ─────────────────────── */
    rot -= 360;
    tl.to(heart, {
      x: adekAX, y: adekKY, rotation: rot,
      duration: T.rollToA, ease: "sine.inOut",
    });

    /* ── 7. Fall to marker 0 with ease-out and fade ──────────── */
    rot += 180;
    tl.to(heart, {
      x: marker0X, y: marker0Y,
      opacity: 0.04, scale: 0.7, rotation: rot + 30,
      duration: T.fallToTimeline + T.fadeOut,
      ease: "power4.out",
    });

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={heartRef}
      className="fixed left-0 top-0 z-50 pointer-events-none"
      style={{
        willChange: "transform",
        opacity: 0,
        transform: "translate3d(0, 0, 0) scale(0)",
      }}
      aria-hidden="true"
    >
      <svg
        width={HEART_SIZE}
        height={HEART_SIZE}
        viewBox="0 0 140 140"
        fill="none"
        style={{ filter: "drop-shadow(0 0 3px rgba(164, 55, 24, 0.08))" }}
      >
        <defs>
          <linearGradient id="entrance-gradient" x1="11.7" y1="20.4" x2="128.3" y2="120.6">
            <stop stopColor="#A43718" />
            <stop offset="1" stopColor="#E3855B" />
          </linearGradient>
        </defs>
        <path
          d={HEART_PATH}
          fill="url(#entrance-gradient)"
        />
      </svg>
    </div>
  );
}
