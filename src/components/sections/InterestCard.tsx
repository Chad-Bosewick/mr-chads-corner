"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface InterestItem {
  category: string;
  emoji: string;
  items: string[];
  imageSrc: string;
  alt: string;
}

interface InterestCardProps {
  interest: InterestItem;
  className?: string;
}

const HEART_PATH =
  "M12 20.3s-7.3-4.6-9.3-9.4C1.3 7.4 3.4 4.3 6.6 4.3c2 0 3.6 1.1 4.4 2.6.8-1.5 2.4-2.6 4.4-2.6 3.2 0 5.3 3.1 3.9 6.6-2 4.8-9.3 9.4-9.3 9.4z";

export function InterestCard({ interest, className }: InterestCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const gradId = `interest-heart-${interest.category.toLowerCase().replace(/\s+/g, "-")}`;
  const label = `${interest.category}: ${interest.items.join(", ")}`;

  return (
    <div className={cn("relative", className)}>
      {/* Card body — expands the item popover */}
      <button
        type="button"
        className={cn(
          "group relative block w-full overflow-hidden rounded-2xl bg-[#151515] text-left ring-1 ring-black/10",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
          "active:scale-[0.96] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          !imageLoaded && !imageError && "animate-pulse",
        )}
        style={{ aspectRatio: "4 / 3" }}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={label}
      >
        {!imageError && (
          <Image
            src={interest.imageSrc}
            alt={interest.alt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={cn(
              "object-cover",
              prefersReducedMotion
                ? "transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-out)]"
                : "transition-[transform,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/90",
            "transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-out)]",
            !prefersReducedMotion && "group-hover:opacity-100",
          )}
        />

        {imageError && (
          <span className="absolute inset-0 flex items-center justify-center text-5xl" aria-hidden="true">
            {interest.emoji}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 p-4 font-sans text-base font-medium text-[#f5f2ee]">
          {interest.emoji} {interest.category}
        </span>

        <span
          className={cn(
            "pointer-events-none absolute inset-x-4 bottom-4 z-[3] rounded-xl bg-black/65 p-3 text-sm font-medium text-[#f5f2ee] backdrop-blur-sm",
            "transition-[opacity,transform] duration-[var(--duration-standard)] ease-[var(--ease-out)]",
            "translate-y-1 opacity-0",
            isOpen && "translate-y-0 opacity-100",
            !isOpen && !prefersReducedMotion && "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          {interest.emoji} {interest.items.join(" · ")}
        </span>
      </button>

      {/* Like heart — sibling of the card button, never opens the popover */}
      <button
        type="button"
        onClick={() => setLiked((value) => !value)}
        aria-pressed={liked}
        aria-label={`Like this interest: ${interest.items.join(", ")}`}
        className={cn(
          "absolute right-2 top-2 z-[2] flex h-11 w-11 items-center justify-center rounded-full",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]",
          "transition-colors duration-[var(--duration-fast)]",
          liked ? "text-[#A43718]" : "text-[#f5f2ee]",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill={liked ? `url(#${gradId})` : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("transition-transform", liked && !prefersReducedMotion && "animate-heart-pop")}
        >
          <path d={HEART_PATH} />
        </svg>
      </button>

      {/* Gradient fill for the liked state — unique id per card */}
      <svg className="absolute size-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A43718" />
            <stop offset="100%" stopColor="#E3855B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
