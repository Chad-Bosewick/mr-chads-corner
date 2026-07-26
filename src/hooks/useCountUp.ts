"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Animates a number once with a fast start and gentle settle. */
export function useCountUp(
  target: number,
  duration: number = 1500,
  delay: number = 0,
): number {
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced || hasAnimated.current) {
      setValue(target);
      return;
    }

    const timer = window.setTimeout(() => {
      hasAnimated.current = true;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [target, duration, delay, prefersReduced]);

  return value;
}
