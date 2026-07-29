"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { CoverScroll } from "@/components/case-study/CoverScroll";
import { SectionReveal } from "./SectionReveal";

interface ProjectRowProps {
  slug: string;
  title: string;
  category: string;
  hook: string;
  coverSrc?: string;
  coverSrcSecondary?: string;
  coverScroll?: {
    src: string;
    alt: string;
    sections?: { label: string; start: number }[];
  };
  annotationSet?: "todo-device";
  status: "published" | "coming-soon";
  device: "laptop" | "phone" | "dual-phone";
  delay?: number;
}

export function ProjectRow({
  slug,
  title,
  category,
  hook,
  coverSrc,
  coverSrcSecondary,
  coverScroll,
  annotationSet,
  status,
  device,
  delay = 0,
}: ProjectRowProps) {
  const isPlaceholder = status === "coming-soon";
  const supportsCardInteraction =
    !isPlaceholder && (device === "dual-phone" || annotationSet !== undefined);
  const [isCardInteractionActive, setIsCardInteractionActive] = useState(false);

  const row = (
    <div
      className={cn(
        "group grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center md:gap-12",
        isPlaceholder && "cursor-default"
      )}
    >
      {/* Image — CoverScroll or device mockup */}
      {coverScroll && !isPlaceholder ? (
        <CoverScroll
          src={coverScroll.src}
          alt={coverScroll.alt}
          sections={coverScroll.sections}
          autoScroll
          className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]"
        />
      ) : (
        <DeviceMockup
          type={device}
          src={coverSrc}
          srcSecondary={coverSrcSecondary}
          alt={`${title} project cover`}
          altSecondary={device === "dual-phone" ? `${title} supporting screen` : undefined}
          placeholder={isPlaceholder}
          annotationSet={annotationSet}
          isInteractionActive={supportsCardInteraction && isCardInteractionActive}
          className={cn(
            "transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)]",
            !isPlaceholder && "group-hover:-translate-y-[2px]"
          )}
        />
      )}

      {/* Text block */}
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {category}
        </p>

        <h3 className="font-sans text-[clamp(1.25rem,2.5vw,1.5rem)] font-medium leading-[1.2] text-[#151515] transition-colors duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:text-[#A43718]">
          {title}
        </h3>

        <p className="font-sans text-[clamp(0.875rem,1.5vw,1rem)] leading-relaxed text-[#151515]/70">
          {hook}
        </p>

        {/* Read cue */}
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-2 text-sm font-medium transition-all duration-[var(--duration-fast)]",
            isPlaceholder
              ? "text-[var(--color-text-muted)]"
              : "text-[#A43718] group-hover:gap-3"
          )}
        >
          {isPlaceholder ? "Coming soon" : "Read case study"}
          {!isPlaceholder && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:translate-x-1"
            >
              <path
                d="M5.25 3.75L10.25 8.25L5.25 12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );

  if (isPlaceholder) {
    return <SectionReveal delay={delay}>{row}</SectionReveal>;
  }

  return (
    <SectionReveal delay={delay}>
      <Link
        href={`/featured-case-studies/${slug}`}
        className="block py-8 transition-opacity md:py-12"
        onMouseEnter={() => supportsCardInteraction && setIsCardInteractionActive(true)}
        onMouseLeave={() => supportsCardInteraction && setIsCardInteractionActive(false)}
        onFocus={() => supportsCardInteraction && setIsCardInteractionActive(true)}
        onBlur={() => supportsCardInteraction && setIsCardInteractionActive(false)}
      >
        {row}
      </Link>
    </SectionReveal>
  );
}
