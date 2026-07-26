"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { useRef, useEffect, useState } from "react";

interface CinematicImageProps extends Omit<ImageProps, "onLoad" | "ref"> {
  /** Aspect ratio for the container, e.g. "16/9", "4/3", "auto" */
  aspectRatio?: string;
  /** Additional classes for the outer wrapper */
  containerClassName?: string;
  /** Enable subtle parallax effect on scroll */
  parallax?: boolean;
  /** Parallax intensity (0-1, default 0.15) */
  parallaxIntensity?: number;
}

/**
 * CinematicImage — a premium next/image wrapper with:
 * - Scroll-triggered scale reveal (subtle zoom from 1.04 → 1.0)
 * - Optional parallax effect (image moves slightly slower than scroll)
 * - Respects prefers-reduced-motion
 */
export function CinematicImage({
  aspectRatio = "16/9",
  containerClassName,
  className,
  alt,
  fill,
  parallax = false,
  parallaxIntensity = 0.15,
  ...imageProps
}: CinematicImageProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const isAuto = aspectRatio === "auto";

  // Parallax scroll tracking
  useEffect(() => {
    if (!parallax || !containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Calculate how far through the viewport the element is (0 = top, 1 = bottom)
      const progress = 1 - (rect.top + rect.height) / (viewportHeight + rect.height);
      setScrollOffset(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallax]);

  const parallaxTranslate = parallax
    ? (scrollOffset - 0.5) * parallaxIntensity * 100
    : 0;

  return (
    <div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn("overflow-hidden bg-[#f0f0f0]", containerClassName)}
      style={isAuto ? undefined : { aspectRatio }}
    >
      <div
        className={cn(
          "transition-all duration-[var(--duration-reveal)] ease-[var(--ease-out)]",
          "motion-safe:duration-[var(--duration-reveal)] motion-reduce:transition-none",
          isAuto ? "w-full" : "relative h-full w-full",
          isVisible
            ? "scale-100 opacity-100"
            : "scale-[1.04] opacity-0",
        )}
        style={
          parallax
            ? {
                transform: `scale(${isVisible ? 1 : 1.04}) translateY(${parallaxTranslate}%)`,
                transition: "transform 0.1s linear, opacity var(--duration-reveal) var(--ease-out)",
              }
            : undefined
        }
      >
        <Image
          alt={alt}
          className={cn(
            isAuto ? "w-full h-auto" : "object-cover",
            "transition-transform duration-[var(--duration-reveal)] ease-[var(--ease-out)]",
            parallax && "motion-reduce:transition-none",
          )}
          style={
            parallax
              ? {
                  transform: `translateY(${-parallaxTranslate * 0.5}%)`,
                  transition: "transform 0.1s linear",
                }
              : undefined
          }
          fill={isAuto ? false : fill}
          {...imageProps}
        />
      </div>
    </div>
  );
}
