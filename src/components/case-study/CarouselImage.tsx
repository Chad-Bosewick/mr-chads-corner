"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TodoCaseStudySlide, type TodoSlidePresentation } from "@/components/case-study/TodoCaseStudySlide";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  scroll?: boolean;
  presentation?: TodoSlidePresentation;
  secondarySrc?: string;
  secondaryAlt?: string;
}

interface CarouselImageProps {
  slides: CarouselSlide[];
  heading?: string;
  /** Auto-advance interval in ms. Set to 0 or undefined to disable. */
  autoAdvanceMs?: number;
  /** Optional source aspect ratio for a carousel whose slides do not use the default 16:10 frame. */
  aspectRatio?: number;
  /** Optional carousel transition surface, matched to the source artwork's edge colour. */
  background?: string;
  maxWidthClass?: string;
  presentation?: "standard" | "hero";
}

const FRAME_WIDTH = 680;
const FRAME_HEIGHT = 425;
const DEFAULT_AUTO_ADVANCE_MS = 4000;
/* Dot indicator track — each dot button is 24px wide with an 8px gap (gap-2). */
const DOT_SPACING = 32;   // center-to-center distance between dots
const DOT_PILL_OFFSET = 2; // keeps the 20px pill centered on the 24px dot button

/**
 * CarouselImage — a fixed-frame carousel for case study sections.
 *
 * - Fixed 680×425px frame (aspect-ratio 16/10)
 * - Images with scroll:true scroll vertically within the frame
 * - Images without scroll fit the frame via object-contain
 * - Auto-advances when in-view, pauses on hover or when scrolled away
 * - Arrow controls + dot indicators + keyboard navigation
 */
export function CarouselImage({
  slides,
  heading,
  autoAdvanceMs,
  aspectRatio = FRAME_WIDTH / FRAME_HEIGHT,
  background = "#f0f0f0",
  maxWidthClass = "max-w-[680px]",
  presentation = "standard",
}: CarouselImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const enableAutoAdvance =
    autoAdvanceMs !== undefined && autoAdvanceMs > 0 && !prefersReducedMotion;
  const interval = autoAdvanceMs ?? DEFAULT_AUTO_ADVANCE_MS;

  // ── IntersectionObserver: track visibility ──
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Auto-advance via rAF (pauses on hover) ──
  useEffect(() => {
    if (!enableAutoAdvance || !isInView || isHovered) {
      lastTickRef.current = 0;
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === 0) lastTickRef.current = now;
      if (now - lastTickRef.current >= interval) {
        lastTickRef.current = now;
        setDirection("next");
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enableAutoAdvance, isInView, isHovered, interval, slides.length]);

  // ── Navigation ──
  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (isAnimating) return;
      const targetIndex = (index + slides.length) % slides.length;
      if (targetIndex === activeIndex) return;
      const targetSlide = slideRefs.current[targetIndex];
      if (targetSlide) targetSlide.scrollTop = 0;
      setDirection(dir);
      setActiveIndex(targetIndex);
      lastTickRef.current = 0; // reset auto-advance timer
      if (!prefersReducedMotion) {
        setIsAnimating(true);
        window.setTimeout(() => setIsAnimating(false), 600);
      }
    },
    [activeIndex, isAnimating, prefersReducedMotion, slides.length],
  );

  const goNext = useCallback(
    () => goTo(activeIndex + 1, "next"),
    [activeIndex, goTo],
  );
  const goPrev = useCallback(
    () => goTo(activeIndex - 1, "prev"),
    [activeIndex, goTo],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  if (slides.length === 0) return null;

  return (
    <div
      className="flex flex-col items-center"
      role="region"
      aria-label={heading ? `${heading} — image carousel` : "Image carousel"}
      aria-roledescription="carousel"
    >
      {/* Fixed frame — 680×425, aspect-ratio 16/10 */}
      <div
        ref={frameRef}
        className={cn(
          "relative w-full overflow-hidden",
          maxWidthClass,
          presentation === "standard" && "rounded-xl shadow-[0_8px_30px_rgba(21,21,21,0.08)] transition-shadow duration-[var(--duration-standard)] ease-[var(--ease-out)] hover:shadow-[0_12px_40px_rgba(21,21,21,0.12)] motion-reduce:duration-0",
        )}
        style={{ aspectRatio: String(aspectRatio), backgroundColor: background }}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {slides.map((slide, i) => {
          const isScrollable = Boolean(
            slide.scroll && slide.width && slide.height,
          );

          return (
            <div
              key={i}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              className={cn(
                "absolute inset-0 transition-transform ease-[var(--ease-fluid)]",
                prefersReducedMotion ? "duration-0" : "duration-[600ms]",
                isScrollable
                  ? "case-study-slide-scroll touch-pan-y overflow-y-auto"
                  : "overflow-hidden",
                i === activeIndex
                  ? "z-10 translate-x-0 opacity-100"
                  : direction === "next"
                    ? i < activeIndex
                      ? "z-0 -translate-x-full opacity-0"
                      : "z-0 translate-x-full opacity-0"
                    : i > activeIndex
                      ? "z-0 translate-x-full opacity-0"
                      : "z-0 -translate-x-full opacity-0",
              )}
              tabIndex={i === activeIndex ? 0 : -1}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${slides.length}: ${slide.alt}`}
              aria-hidden={i !== activeIndex}
            >
              {slide.presentation ? (
                <TodoCaseStudySlide
                  presentation={slide.presentation}
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  secondarySrc={slide.secondarySrc}
                  secondaryAlt={slide.secondaryAlt}
                />
              ) : isScrollable ? (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  className="block h-auto w-full max-w-none select-none"
                  sizes="(max-width: 768px) 100vw, 680px"
                  draggable={false}
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 680px"
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>

      {slides[activeIndex]?.caption && (
        <p
          className={cn("mt-3 w-full font-sans text-sm leading-relaxed text-[#151515]/70", maxWidthClass)}
          aria-live="polite"
        >
          {slides[activeIndex].caption}
        </p>
      )}

      {/* Controls — below frame */}
      {slides.length > 1 && (
        <div className="mt-4 flex items-center gap-4">
          {/* Prev arrow */}
          <button
            onClick={goPrev}
            className={cn(
              "flex items-center justify-center",
              "h-11 w-11 rounded-full",
              "bg-white border border-[#151515]/10",
              "text-[#151515] shadow-sm",
              "transition-all duration-[var(--duration-fast)]",
              "hover:bg-[#151515] hover:text-white hover:shadow-md",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
            )}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8L10 4" />
            </svg>
          </button>

          {/* Dot indicators — a single pill slides between equal dots */}
          <div
            className="relative flex"
            style={{ width: `${slides.length * DOT_SPACING}px` }}
          >
            <div className="flex items-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i >= activeIndex ? "next" : "prev")}
                  className="group flex h-11 w-6 items-center justify-center rounded-sm"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                >
                  <span
                    className="h-2 w-2 rounded-full bg-[#151515]/20 transition-colors duration-[var(--duration-fast)] group-hover:bg-[#151515]/40"
                  />
                </button>
              ))}
            </div>
            <span
              aria-hidden="true"
              className={cn(
                "carousel-pill pointer-events-none absolute top-1/2 h-2 w-5 rounded-full bg-[#151515]",
                prefersReducedMotion
                  ? "transition-none"
                  : "transition-transform duration-[500ms] ease-[var(--ease-fluid)]",
              )}
              style={{
                transform: `translateY(-50%) translateX(${activeIndex * DOT_SPACING + DOT_PILL_OFFSET}px)`,
              }}
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={goNext}
            className={cn(
              "flex items-center justify-center",
              "h-11 w-11 rounded-full",
              "bg-white border border-[#151515]/10",
              "text-[#151515] shadow-sm",
              "transition-all duration-[var(--duration-fast)]",
              "hover:bg-[#151515] hover:text-white hover:shadow-md",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
            )}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4L10 8L6 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <span
          className="mt-2 font-sans text-xs tabular-nums text-[var(--color-text-muted)]"
          aria-live="polite"
        >
          {activeIndex + 1} / {slides.length}
        </span>
      )}
    </div>
  );
}
