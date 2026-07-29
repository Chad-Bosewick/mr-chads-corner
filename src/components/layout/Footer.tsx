"use client";

import { ContentRail } from "./PageShell";
import { useCallback } from "react";

const QUOTE = "The best designs don't just work — they communicate.";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/temidayoadekunle/",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/ChadBosewick27",
  },
];

export function Footer() {
  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <footer
      className="relative z-10 bg-[#0F0F0F] py-16"
      aria-label="Site footer"
    >
      <ContentRail>
        <blockquote className="max-w-[780px] break-words font-serif italic text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.3] text-white/90">
          &ldquo;{QUOTE}&rdquo;
        </blockquote>

        <p className="mt-4 font-sans text-[14px] text-white/70">
          &mdash; Temi Adekunle
        </p>

        <nav aria-label="Social media links">
          <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[14px] text-white/70 transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={scrollToTop}
          className="mt-8 inline-flex items-center gap-2 font-sans text-[14px] text-white/70 transition-colors duration-[var(--duration-fast)] hover:text-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
          aria-label="Back to top of page"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 10.5V3M2.5 5.5 6 2l3.5 3.5" />
          </svg>
          Back to top
        </button>

        <hr className="mt-16 border-white/10" />

        <p className="mt-6 font-sans text-[12px] text-white/50">
          &copy; {new Date().getFullYear()} Temi Adekunle. Built with Next.js,
          React, and Tailwind CSS.
        </p>
      </ContentRail>
    </footer>
  );
}
