"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  id: string;
}

interface CaseStudyNavProps {
  items: NavItem[];
}

export function CaseStudyNav({ items }: CaseStudyNavProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-0 z-30 border-b border-[#151515]/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] gap-6 overflow-x-auto px-5 py-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-[var(--duration-fast)]",
              activeId === item.id
                ? "text-[#A43718]"
                : "text-[#757575] hover:text-[#151515]"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
