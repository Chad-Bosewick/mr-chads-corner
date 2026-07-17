"use client";

import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before animation starts */
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[var(--duration-reveal)] ease-[var(--ease-out)]",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[8px] opacity-0",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
