"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CoverScrollSection {
  label: string;
  /** Normalized vertical start point within the source image (0–1). */
  start: number;
}

interface CoverScrollProps {
  src: string;
  alt: string;
  maxWidth?: string;
  showLaptopFrame?: boolean;
  sections?: CoverScrollSection[];
  /** When true, automatically scrolls through sections with pauses, then loops. */
  autoScroll?: boolean;
  className?: string;
}

const SCROLL_DURATION = 1200;
const PAUSE_DURATION = 3000;
const INITIAL_DELAY = 1500;
const VIEWPORT_START_THRESHOLD = 0.8;

/** Liquid easing — starts slow, accelerates, decelerates. Harmonic feel. */
const liquidEase = (t: number): number =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - (-2 * t + 2) ** 3 / 2;

const getPrefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * CoverScroll — a fixed-frame viewport into a full-page screenshot.
 *
 * Manual mode (default): user scrolls with trackpad/mouse wheel.
 * Auto-scroll mode: smoothly pauses at each section, then loops.
 */
export function CoverScroll({
  src,
  alt,
  maxWidth = "480px",
  showLaptopFrame = true,
  sections = [],
  autoScroll = false,
  className,
}: CoverScrollProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [imageHeight, setImageHeight] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const [imageSrc, setImageSrc] = useState(src);
  const [imgWidth, setImgWidth] = useState(1200);
  const [imgHeight, setImgHeight] = useState(2400);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);
  const hasStartedRef = useRef(false);

  // Auto-scroll state (refs for rAF)
  const phaseRef = useRef<"idle" | "scrolling" | "pausing">("idle");
  const sectionIndexRef = useRef(0);
  const scrollFromRef = useRef(0);
  const scrollToRef = useRef(0);
  const phaseStartRef = useRef(0);

  const totalScrollDistance = Math.max(0, imageHeight - frameHeight);

  // Scale section starts to pixel offsets within the scrollable range
  const sectionOffsets = sections.map((s) => {
    if (totalScrollDistance <= 0) return 0;
    return Math.min(s.start * (imageHeight / frameHeight) * frameHeight, totalScrollDistance);
  });

  // ── Frame height measurement ──
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setFrameHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Reduced motion preference ──
  useEffect(() => {
    const mediaQuery =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (!mediaQuery) return;
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  // ── Viewport gate for auto-scroll start ──
  useEffect(() => {
    if (!autoScroll || prefersReducedMotion || hasStartedRef.current) return;

    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        if (entry.intersectionRatio >= VIEWPORT_START_THRESHOLD) {
          hasStartedRef.current = true;
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      {
        threshold: [VIEWPORT_START_THRESHOLD],
      },
    );

    observer.observe(frame);

    return () => observer.disconnect();
  }, [autoScroll, prefersReducedMotion]);

  // ── Image load ──
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const containerWidth = img.parentElement?.clientWidth ?? 1200;
      const aspect = img.naturalHeight / img.naturalWidth;
      setImageHeight(containerWidth * aspect);
      setImgWidth(Math.round(containerWidth));
      setImgHeight(Math.round(containerWidth * aspect));
    },
    [],
  );

  const sizesAttr = showLaptopFrame
    ? "(max-width: 768px) 100vw, 480px"
    : `(max-width: 768px) 100vw, ${maxWidth}`;

  // ── Auto-scroll animation loop ──
  useEffect(() => {
    if (
      !autoScroll ||
      prefersReducedMotion ||
      !hasEnteredViewport ||
      totalScrollDistance <= 0 ||
      sections.length < 2
    ) {
      return;
    }

    // Initialize on first frame
    if (phaseRef.current === "idle") {
      phaseRef.current = "idle"; // will be set to "scrolling" below
    }

    let lastNow = 0;
    let idleElapsed = 0;
    let pauseElapsed = 0;
    let initialized = false;

    const animate = (now: number) => {
      if (!lastNow) lastNow = now;
      const dt = now - lastNow;
      lastNow = now;

      const phase = phaseRef.current;

      if (phase === "idle") {
        // Wait for initial delay, then start scrolling to first section
        idleElapsed += dt;
        if (!initialized) {
          initialized = true;
          scrollFromRef.current = 0;
          scrollToRef.current = sectionOffsets[1] ?? 0;
          sectionIndexRef.current = 0;
          phaseStartRef.current = now;
        }
        if (idleElapsed >= INITIAL_DELAY) {
          phaseRef.current = "scrolling";
          phaseStartRef.current = now;
        }
      } else if (phase === "scrolling") {
        const elapsed = now - phaseStartRef.current;
        const t = Math.min(elapsed / SCROLL_DURATION, 1);
        const y = scrollFromRef.current + (scrollToRef.current - scrollFromRef.current) * liquidEase(t);

        if (innerRef.current) {
          innerRef.current.style.transform = `translateY(-${y}px)`;
        }

        if (t >= 1) {
          phaseRef.current = "pausing";
          phaseStartRef.current = now;
        }
      } else if (phase === "pausing") {
        pauseElapsed += dt;

        if (pauseElapsed >= PAUSE_DURATION) {
          pauseElapsed = 0;
          const next = sectionIndexRef.current + 1;

          if (next < sectionOffsets.length) {
            // Advance to next section
            sectionIndexRef.current = next;
            scrollFromRef.current = scrollToRef.current;
            scrollToRef.current = sectionOffsets[next];
            phaseRef.current = "scrolling";
            phaseStartRef.current = now;
          } else {
            // Reached end — instant reset to top, then restart
            sectionIndexRef.current = 0;
            scrollFromRef.current = 0;
            scrollToRef.current = sectionOffsets[1] ?? 0;
            scrollFromRef.current = 0;

            if (innerRef.current) {
              innerRef.current.style.transform = "translateY(0px)";
            }

            phaseRef.current = "idle";
            idleElapsed = 0;
            initialized = false;
            phaseStartRef.current = now;
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Reset state for clean re-entry
      phaseRef.current = "idle";
      sectionIndexRef.current = 0;
      scrollFromRef.current = 0;
      scrollToRef.current = 0;
      idleElapsed = 0;
      pauseElapsed = 0;
      initialized = false;
    };
  }, [autoScroll, hasEnteredViewport, prefersReducedMotion, totalScrollDistance, sections.length, sectionOffsets]);

  // ── Scrollbar styles (manual mode only) ──
  const scrollBarStyles = `
    .cover-scroll-frame { scrollbar-width: thin; scrollbar-color: rgb(21 21 21 / 25%) transparent; }
    .cover-scroll-frame::-webkit-scrollbar { width: 3px; }
    .cover-scroll-frame::-webkit-scrollbar-track { background: transparent; }
    .cover-scroll-frame::-webkit-scrollbar-thumb { background: rgb(21 21 21 / 25%); border-radius: 999px; }
    .cover-scroll-frame::-webkit-scrollbar-thumb:hover { background: rgb(21 21 21 / 40%); width: 4px; }
  `;

  const frameContent = (
    <div
      ref={innerRef}
      className="h-auto w-full"
      style={autoScroll ? { willChange: "transform" } : undefined}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        className={cn("h-auto w-full select-none rounded-none")}
        sizes={sizesAttr}
        onLoad={handleImageLoad}
        draggable={false}
        priority
      />
    </div>
  );

  return (
    <div className={cn("group relative w-full", className)}>
      {!autoScroll && (
        <style dangerouslySetInnerHTML={{ __html: scrollBarStyles }} />
      )}
      <div className="relative w-full" style={{ maxWidth }}>
        {showLaptopFrame ? (
          <>
            <div className="relative overflow-hidden rounded-[6px] bg-[#1a1a1a] p-[1.5px] shadow-[0_8px_30px_rgba(21,21,21,0.12)] transition-[box-shadow] duration-[320ms] ease-[var(--ease-fluid)] group-hover:shadow-[0_12px_38px_rgba(21,21,21,0.18)]">
              <div
                ref={frameRef}
                data-testid="cover-scroll-frame"
                className={cn(
                  "relative w-full overflow-hidden rounded-[4px] bg-[#f0f0f0]",
                  !autoScroll && "cover-scroll-frame overflow-y-auto overflow-x-hidden",
                )}
                style={{ aspectRatio: "16 / 10" }}
                role="group"
                aria-label={autoScroll ? `${alt} preview` : `${alt} preview — scroll to explore`}
              >
                {frameContent}
              </div>
            </div>
            <div className="mx-auto mt-[-1px] h-[10px] w-[55%] rounded-b-[6px] bg-[#e8e8e8] shadow-[0_2px_4px_rgba(21,21,21,0.06)]" />
            <div className="mx-auto h-[4px] w-[40%] rounded-b-[3px] bg-[#f0f0f0]" />
          </>
        ) : (
          <div
            ref={frameRef}
            data-testid="cover-scroll-frame"
            className={cn(
              "relative w-full overflow-hidden rounded-xl bg-[#f0f0f0]",
              "shadow-[0_8px_30px_rgba(21,21,21,0.08)] transition-[box-shadow] duration-[320ms] ease-[var(--ease-fluid)]",
              "hover:shadow-[0_12px_40px_rgba(21,21,21,0.14)]",
              !autoScroll && "cover-scroll-frame overflow-y-auto overflow-x-hidden",
            )}
            style={{ aspectRatio: "16 / 10" }}
            role="group"
            aria-label={autoScroll ? `${alt} preview` : `${alt} preview — scroll to explore`}
          >
            {frameContent}
          </div>
        )}
      </div>
    </div>
  );
}
