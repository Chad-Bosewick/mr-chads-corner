"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionReveal } from "@/components/sections/SectionReveal";
import Image from "next/image";
import type { UIComponentCard } from "@/content/ui-components";

interface UIScrollStripProps {
  cards: UIComponentCard[];
  heading?: string;
}

function VideoCard({ card }: { card: UIComponentCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked — silent fallback
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="relative w-full aspect-[4/3] bg-[#f0f0f0]">
      <video
        ref={videoRef}
        src={card.src}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={card.alt}
      />
    </div>
  );
}

function StripCard({
  card,
  duplicate = false,
}: {
  card: UIComponentCard;
  duplicate?: boolean;
}) {
  return (
    <figure
      aria-hidden={duplicate || undefined}
      className={cn(
        "relative flex-shrink-0 overflow-hidden rounded-xl",
        card.frame === "widescreen"
          ? "w-[280px] aspect-video sm:w-[320px] md:w-[360px]"
          : card.frame === "landing-hero"
            ? "w-[220px] aspect-[45/32] sm:w-[260px] md:w-[280px]"
            : "w-[220px] aspect-[4/3] sm:w-[260px] md:w-[280px]",
        "shadow-[0_6px_24px_rgba(21,21,21,0.06)]",
      )}
    >
      {card.type === "video" ? (
        <VideoCard card={card} />
      ) : (
        <Image
          src={card.src}
          alt={duplicate ? "" : card.alt}
          fill
          className={cn(
            "object-cover",
            card.frame === "portrait-hero" && "object-top",
          )}
          sizes={
            card.frame === "widescreen"
              ? "(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
              : "(max-width: 640px) 220px, (max-width: 768px) 260px, 280px"
          }
        />
      )}
    </figure>
  );
}

export function UIScrollStrip({
  cards,
  heading = "UI components & explorations",
}: UIScrollStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstTrackRef = useRef<HTMLDivElement>(null);
  const autoScrollPositionRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const hoveringRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const pauseAutoScroll = useCallback((duration = 1600) => {
    const loopWidth = firstTrackRef.current?.getBoundingClientRect().width ?? 0;
    const currentPosition = scrollRef.current?.scrollLeft ?? 0;
    autoScrollPositionRef.current = loopWidth > 0 ? currentPosition % loopWidth : currentPosition;
    pauseUntilRef.current = performance.now() + duration;
  }, []);

  const updateMobileControls = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(query.matches);

    updateViewport();
    query.addEventListener("change", updateViewport);
    return () => query.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const el = scrollRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(updateMobileControls);

    updateMobileControls();
    el.addEventListener("scroll", updateMobileControls, { passive: true });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateMobileControls);
      resizeObserver.disconnect();
    };
  }, [isMobile, updateMobileControls]);

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>("figure");
    if (!el || !card) return;

    const gap = Number.parseFloat(getComputedStyle(el.firstElementChild!).gap) || 16;
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let previousTime = performance.now();
    autoScrollPositionRef.current = el.scrollLeft;

    const tick = (now: number) => {
      const elapsed = Math.min(now - previousTime, 100);
      previousTime = now;
      const loopWidth = firstTrackRef.current?.getBoundingClientRect().width ?? 0;

      if (
        !isMobile &&
        !reducedMotion.matches &&
        !hoveringRef.current &&
        now >= pauseUntilRef.current &&
        loopWidth > 0
      ) {
        const next = autoScrollPositionRef.current + (elapsed / 1000) * 16;
        autoScrollPositionRef.current = next >= loopWidth ? next - loopWidth : next;
        el.scrollLeft = autoScrollPositionRef.current;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [isMobile, pauseAutoScroll]);

  if (cards.length === 0) return null;

  return (
    <SectionReveal>
      <section className="mt-16 md:mt-20">
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div className="relative overflow-hidden">
          {/* Scrollable card strip */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => {
              hoveringRef.current = true;
            }}
            onMouseLeave={() => {
              hoveringRef.current = false;
              pauseAutoScroll(800);
            }}
            onFocusCapture={() => pauseAutoScroll(2400)}
            onPointerDown={() => pauseAutoScroll(2400)}
            onWheel={() => pauseAutoScroll(2400)}
            onKeyDown={() => pauseAutoScroll(2400)}
          >
            <div ref={firstTrackRef} className="flex flex-none gap-4 pr-4">
              {cards.map((card) => (
                <StripCard key={card.id} card={card} />
              ))}
            </div>
            {!isMobile && (
              <div className="flex flex-none gap-4 pr-4" aria-hidden="true">
                {cards.map((card) => (
                  <StripCard key={`duplicate-${card.id}`} card={card} duplicate />
                ))}
              </div>
            )}
          </div>

          {isMobile && canScrollLeft && (
            <button
              type="button"
              aria-label="Show previous UI component"
              onClick={() => scrollByCard(-1)}
              className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5f2ee]/90 text-[#151515] shadow-[0_4px_16px_rgba(21,21,21,0.12)] backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="m10.5 4.5-4.5 4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {isMobile && canScrollRight && (
            <button
              type="button"
              aria-label="Show next UI component"
              onClick={() => scrollByCard(1)}
              className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5f2ee]/90 text-[#151515] shadow-[0_4px_16px_rgba(21,21,21,0.12)] backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="m7.5 4.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </section>
    </SectionReveal>
  );
}
