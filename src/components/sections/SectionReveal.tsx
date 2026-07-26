"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";

type RevealVariant =
  | "fade-up"
  | "fade-in"
  | "scale-in"
  | "slide-left"
  | "slide-right";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts */
  delay?: number;
  /** Animation variant */
  variant?: RevealVariant;
  /** Custom duration override (default: var(--duration-reveal)) */
  duration?: string;
}

const variantStyles: Record<RevealVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "translate-y-5 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  "fade-in": {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  "scale-in": {
    hidden: "scale-[0.97] opacity-0",
    visible: "scale-100 opacity-100",
  },
  "slide-left": {
    hidden: "-translate-x-6 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  "slide-right": {
    hidden: "translate-x-6 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
};

export function SectionReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  duration,
}: SectionRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    // Defer animation enable by one frame so IntersectionObserver
    // can settle for elements already in the viewport on page load.
    const frame = requestAnimationFrame(() => {
      setCanAnimate(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Before hydration + first frame: always fully visible (SSR-safe)
  // After animation is enabled: use scroll-reveal animation
  const shouldShow = !canAnimate || isVisible;
  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-[var(--ease-out)]",
        shouldShow ? styles.visible : styles.hidden,
        className,
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform",
        transitionDuration: duration || "var(--duration-reveal)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * StaggerContainer — wraps multiple SectionReveal children and staggers
 * their animations by a configurable interval.
 */
export function StaggerContainer({
  children,
  className,
  staggerMs = 80,
  variant = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
  variant?: RevealVariant;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCanAnimate(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const shouldShow = !canAnimate || isVisible;
  const styles = variantStyles[variant];

  // Clone children with staggered delays
  const staggeredChildren = Array.isArray(children)
    ? children.map((child, i) => {
        if (
          child &&
          typeof child === "object" &&
          "props" in child
        ) {
          return (
            <div
              key={i}
              className={cn(
                "transition-all ease-[var(--ease-out)]",
                shouldShow ? styles.visible : styles.hidden,
              )}
              style={{
                transitionDelay: `${i * staggerMs}ms`,
                transitionProperty: "opacity, transform",
                transitionDuration: "var(--duration-reveal)",
              }}
            >
              {child}
            </div>
          );
        }
        return child;
      })
    : children;

  return (
    <div ref={ref} className={className}>
      {staggeredChildren}
    </div>
  );
}
