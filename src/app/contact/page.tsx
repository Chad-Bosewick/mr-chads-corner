import { SectionReveal } from "@/components/sections/SectionReveal";
import { PageShell } from "@/components/layout/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Temi Adekunle. Open to freelance collaborations, product design leadership opportunities, and speaking engagements.",
};

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

export default function ContactPage() {
  return (
    <PageShell>
      {/* Hero */}
      <SectionReveal>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
          Contact
        </h1>
        <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-[var(--color-text-muted)]">
          I&rsquo;m always open to thoughtful conversations about product strategy,
          design systems, and building things that matter.
        </p>
      </SectionReveal>

      {/* Email */}
      <SectionReveal delay={80}>
        <div className="mt-12">
          <p className="font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            Email
          </p>
          <a
            href="mailto:Addtemi270@gmail.com"
            className="mt-2 inline-block font-sans text-[clamp(1rem,2.5vw,1.125rem)] font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
          >
            Addtemi270@gmail.com
          </a>
        </div>
      </SectionReveal>

      {/* Social */}
      <SectionReveal delay={160}>
        <div className="mt-12">
          <p className="font-sans text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            Social
          </p>
          <ul className="mt-3 space-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-[clamp(0.875rem,2vw,1rem)] text-[#151515]/70 transition-colors duration-[var(--duration-fast)] hover:text-[#A43718]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionReveal>

      {/* Availability */}
      <SectionReveal delay={240}>
        <p className="mt-16 max-w-[680px] font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          Currently open to freelance collaborations, product design leadership
          opportunities, and speaking engagements. Based in Lagos, working
          remotely with teams worldwide.
        </p>
      </SectionReveal>
    </PageShell>
  );
}
