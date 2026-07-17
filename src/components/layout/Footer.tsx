const QUOTE = "The best designs don't just work — they communicate.";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Twitter/X", href: "#" },
];

export function Footer() {
  return (
    <footer
      className="bg-[#0F0F0F] px-4 py-16 md:px-[200px]"
      aria-label="Site footer"
    >
      <blockquote className="font-serif italic text-[36px] leading-[1.3] text-white/90">
        &ldquo;{QUOTE}&rdquo;
      </blockquote>

      <p className="mt-4 font-sans text-[14px] text-white/70">
        &mdash; Temi Adekunle
      </p>

      <nav aria-label="Social media links">
        <ul className="mt-12 flex items-center gap-8">
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
    </footer>
  );
}
