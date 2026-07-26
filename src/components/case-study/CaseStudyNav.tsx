"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  id: string;
}

interface CaseStudyNavProps {
  items: NavItem[];
  variant?: "sidebar" | "mobile";
  className?: string;
}

export function CaseStudyNav({
  items,
  variant = "sidebar",
  className,
}: CaseStudyNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const mobileListRef = useRef<HTMLUListElement>(null);

  const observeSections = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top) -
              Math.abs(second.boundingClientRect.top),
          )[0];

        if (visibleEntry) setActiveId(visibleEntry.target.id);
      },
      { rootMargin: "-18% 0px -72% 0px" },
    );

    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => observeSections(), [observeSections]);

  useEffect(() => {
    if (variant !== "mobile") return;
    const list = mobileListRef.current;
    const activeLink = list?.querySelector<HTMLAnchorElement>(
      `a[href="#${activeId}"]`,
    );
    if (!list || !activeLink || typeof list.scrollTo !== "function") return;

    list.scrollTo({
      left:
        activeLink.offsetLeft -
        (list.clientWidth - activeLink.clientWidth) / 2,
      behavior: "auto",
    });
  }, [activeId, variant]);

  if (items.length === 0) return null;

  if (variant === "mobile") {
    return (
      <nav
        aria-label="Case study sections"
        className={cn(
          "flex min-w-0 items-stretch border-y border-[#151515]/10 bg-[#f5f2ee]/95 backdrop-blur-md",
          className,
        )}
      >
        <Link
          href="/featured-case-studies"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center border-r border-[#151515]/10 text-[#6F6F6F]",
            "transition-[color,scale] duration-[var(--duration-fast)] hover:text-[#151515] active:scale-[0.96]",
            "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A43718]",
          )}
          aria-label="Back to all case studies"
        >
          <BackIcon />
        </Link>

        <ul
          ref={mobileListRef}
          className="flex min-w-0 flex-1 list-none items-stretch overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative flex h-11 items-center px-3 font-sans text-[13px] font-medium whitespace-nowrap",
                    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                    "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-center after:bg-[#A43718]",
                    "after:transition-transform after:duration-[var(--duration-standard)] after:ease-[var(--ease-fluid)]",
                    "hover:text-[#151515] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A43718]",
                    isActive
                      ? "text-[#151515] after:scale-x-100"
                      : "text-[#6F6F6F] after:scale-x-0",
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Case study sections"
      className={cn("sticky top-24 z-30", className)}
    >
      <Link
        href="/featured-case-studies"
        className={cn(
          "mb-3 flex min-h-10 w-fit items-center gap-2 rounded-sm pr-2 font-sans text-sm font-medium text-[#6F6F6F]",
          "transition-[color,scale] duration-[var(--duration-fast)] hover:text-[#151515] active:scale-[0.96]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
        )}
      >
        <BackIcon />
        <span>All case studies</span>
      </Link>

      <ul className="list-none space-y-0.5" role="list">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "group flex min-h-10 items-center gap-3 rounded-sm pr-2 font-sans text-sm font-medium",
                  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  "hover:text-[#151515] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
                  isActive ? "text-[#151515]" : "text-[#6F6F6F]",
                )}
                aria-current={isActive ? "location" : undefined}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-2.5 shrink-0 rounded-full transition-colors duration-[var(--duration-fast)]",
                    isActive
                      ? "bg-[#A43718]"
                      : "bg-[#151515]/20 group-hover:bg-[#151515]/45",
                  )}
                />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M10.5 3.5L6 8l4.5 4.5" />
    </svg>
  );
}
