"use client";

import { ContentRail } from "./PageShell";
import { useCallback } from "react";
import { FooterAsciiBrand } from "./FooterAsciiBrand";

const QUOTE = "The best designs don't just work. They communicate";

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: "mailto:Addtemi270@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/temidayoadekunle/",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/ChadBosewick27",
  },
  {
    label: "Download CV",
    href: "/downloads/temi-adekunle-cv.pdf",
    download: true,
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
      <div className="footer-dot-texture" aria-hidden="true" />
      <div className="relative z-[1]">
        <ContentRail>
          {/* Quote — hero statement */}
          <blockquote className="max-w-[780px] break-words font-serif italic text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.3] text-white/90">
            &ldquo;{QUOTE}&rdquo;
            <span className="ml-2 whitespace-nowrap font-sans text-[0.42em] font-normal not-italic tracking-normal text-white/65">
              - Temi Adekunle
            </span>
          </blockquote>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
            <nav aria-label="Elsewhere">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      download={link.download}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-sans text-[14px] text-white/70 transition-colors duration-[var(--duration-fast)] hover:text-[#A43718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="inline-flex items-center gap-2 font-sans text-[14px] text-white/80 md:justify-self-end">
              <span
                className="animate-availability-breathe size-2 rounded-full bg-[#48B36A] shadow-[0_0_0_4px_rgba(72,179,106,0.12)]"
                aria-hidden="true"
              />
              Available to work
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-[12px] text-white/50">
              &copy; {new Date().getFullYear()} Temi Adekunle. All rights reserved.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex min-h-11 items-center gap-2 self-start font-sans text-[14px] text-white/70 transition-[color,transform] duration-[var(--duration-fast)] hover:text-[#A43718] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718] sm:self-auto"
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
          </div>
        </ContentRail>

        <div className="relative left-1/2 w-screen -translate-x-1/2 lg:left-auto lg:w-full lg:max-w-[1120px] lg:translate-x-0 lg:mx-auto lg:px-8">
          <FooterAsciiBrand />
        </div>
      </div>
    </footer>
  );
}
