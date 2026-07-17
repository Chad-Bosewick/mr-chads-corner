import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionReveal } from "./SectionReveal";

interface ProjectRowProps {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverSrc: string;
  status: "published" | "coming-soon";
  /** Stagger delay in ms for sequential reveal */
  delay?: number;
}

export function ProjectRow({
  slug,
  title,
  category,
  description,
  coverSrc,
  status,
  delay = 0,
}: ProjectRowProps) {
  const isComingSoon = status === "coming-soon";

  return (
    <SectionReveal delay={delay}>
      <Link
        href={isComingSoon ? "#" : `/featured-case-studies/${slug}`}
        className={cn(
          "group grid gap-6 border-t border-[#151515]/10 py-8 transition-opacity md:grid-cols-[260px_1fr] md:gap-10 md:py-12",
          isComingSoon && "cursor-default"
        )}
        aria-disabled={isComingSoon}
        {...(isComingSoon ? { tabIndex: -1 } : {})}
      >
        {/* Cover image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f0f0] md:aspect-auto md:h-[180px]">
          <Image
            src={coverSrc}
            alt={`${title} project cover`}
            fill
            className="object-cover transition-all duration-[var(--duration-standard)] ease-[var(--ease-out)] group-hover:scale-[1.03] group-hover:shadow-lg"
            sizes="(max-width: 768px) 100vw, 260px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          <p className="font-sans text-xs uppercase tracking-wider text-[#757575]">
            {category}
          </p>

          <h3 className="mt-1 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {title}
          </h3>

          <p className="mt-2 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            {description}
          </p>

          <span
            className={cn(
              "mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-[var(--duration-fast)]",
              isComingSoon
                ? "text-[#757575]"
                : "text-[#A43718] group-hover:text-[#A43718]/70"
            )}
          >
            {isComingSoon ? "Coming soon" : "Read case study"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
            >
              <path
                d="M5.5 3L10.5 8L5.5 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </SectionReveal>
  );
}
