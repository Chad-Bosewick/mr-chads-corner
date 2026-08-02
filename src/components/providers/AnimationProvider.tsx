"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimationPauseButton } from "@/components/ui/AnimationPauseButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimationContextValue {
  isAsciiPaused: boolean;
  toggleAsciiPause: () => void;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAsciiPaused, setIsAsciiPaused] = useState(false);
  const value = useMemo(
    () => ({
      isAsciiPaused,
      toggleAsciiPause: () => setIsAsciiPaused((paused) => !paused),
    }),
    [isAsciiPaused],
  );

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export function useAnimationContext() {
  const context = useContext(AnimationContext);
  if (!context) throw new Error("useAnimationContext must be used within AnimationProvider");
  return context;
}

export function computePauseControlVisible(opts: {
  heroInView: boolean;
  footerInView: boolean;
  prefersReducedMotion: boolean;
}): boolean {
  return !opts.prefersReducedMotion && (opts.heroInView || opts.footerInView);
}

export function GlobalAnimationPauseControl() {
  const { isAsciiPaused, toggleAsciiPause } = useAnimationContext();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [heroInView, setHeroInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    setHeroInView(false);
    setFooterInView(false);
    if (prefersReducedMotion) return;

    const hero = document.querySelector("[data-hero-band]");
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) setHeroInView(entry.isIntersecting);
        if (entry.target === footer) setFooterInView(entry.isIntersecting);
      });
    });

    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, [pathname, prefersReducedMotion]);

  if (!computePauseControlVisible({ heroInView, footerInView, prefersReducedMotion })) {
    return null;
  }

  return (
    <AnimationPauseButton
      isPaused={isAsciiPaused}
      onToggle={toggleAsciiPause}
      label="background animation"
      className="fixed bottom-4 right-4 z-20"
    />
  );
}
