import { ContentRail } from "./PageShell";

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

        <hr className="mt-16 border-white/10" />

        <p className="mt-6 font-sans text-[12px] text-white/50">
          &copy; {new Date().getFullYear()} Temi Adekunle. Built with Next.js,
          React, and Tailwind CSS.
        </p>
      </ContentRail>
    </footer>
  );
}
