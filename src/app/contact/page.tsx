import { SectionReveal } from "@/components/sections/SectionReveal";
import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Metadata } from "next";

const DESCRIPTION =
  "Get in touch with Temi Adekunle. Open to freelance collaborations, product design leadership opportunities, and speaking engagements.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description: DESCRIPTION,
    url: "/contact",
  },
  twitter: {
    title: "Contact",
    description: DESCRIPTION,
  },
};

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

      {/* Ice-breaker form */}
      <SectionReveal delay={80}>
        <ContactForm />
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
