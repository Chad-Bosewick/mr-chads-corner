import { SectionReveal } from "@/components/sections/SectionReveal";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { InterestGrid } from "@/components/sections/InterestGrid";
import type { InterestItem } from "@/components/sections/InterestCard";
import { PageShell } from "@/components/layout/PageShell";
import type { Metadata } from "next";
import {
  siFigma,
  siFramer,
  siNotion,
  siLinear,
  siClickup,
  siMiro,
  siClaude,
  siPerplexity,
  siGoogleanalytics,
  siAirtable,
} from "simple-icons";

export const metadata: Metadata = {
  title: "Temi Adekunle | CV / Resume",
  description:
    "Product designer with a bias toward clarity, systems thinking, and work that holds up under scrutiny. Biochemistry background, startup design lead, design system builder, AI-native operator.",
};

const INTERESTS: InterestItem[] = [
  { category: "Education", emoji: "🎓", items: ["University of Lagos", "Google UX Design (Coursera)"], imageSrc: "/images/interests/education.jpg", alt: "Shelves of books in a warmly lit library" },
  { category: "Sports", emoji: "⚽", items: ["Chelsea FC", "Formula 1", "NBA"], imageSrc: "/images/interests/sports.jpg", alt: "Football players contesting a ball on a pitch" },
  { category: "Books", emoji: "📖", items: ["George R.R. Martin"], imageSrc: "/images/interests/books.jpg", alt: "A collection of books on wooden shelves" },
  { category: "Films", emoji: "🎥", items: ["Quentin Tarantino", "James Cameron"], imageSrc: "/images/interests/films.jpg", alt: "Empty cinema seats under dramatic lighting" },
  { category: "Podcasts", emoji: "🎙️", items: ["Steven Bartlett", "The space between"], imageSrc: "/images/interests/podcasts.jpg", alt: "Studio microphone in a dark recording space" },
  { category: "Gaming", emoji: "🎮", items: ["GTA VI", "Red Dead Redemption", "Call of Duty"], imageSrc: "/images/interests/gaming.jpg", alt: "A multi-monitor gaming setup with neon lighting" },
];

const SNAPSHOT_ITEMS = [
  {
    label: "Systems Thinker",
    description:
      "Biochemistry taught me to think in systems, process, and cause and effect. I apply that thinking to information architecture, user journeys, and design systems.",
  },
  {
    label: "Design System Builder",
    description:
      "Built design systems from the ground up: 40+ components across an eight-month Candidote engagement and 50+ components at Enviodeck, each shaped around product needs and team workflows.",
  },
  {
    label: "AI-Native Operator",
    description:
      "Use ChatGPT, Claude, Codex, and Perplexity daily to accelerate design workflows, generate production code, orchestrate multi-agent development, and design AI-assisted experiences.",
  },
];

interface ToolBrand {
  name: string;
  icon?: { path: string };
}

const TOOLS: ToolBrand[] = [
  { name: "Figma", icon: siFigma },
  { name: "Framer", icon: siFramer },
  { name: "Notion", icon: siNotion },
  { name: "Linear", icon: siLinear },
  { name: "ClickUp", icon: siClickup },
  { name: "Miro", icon: siMiro },
  { name: "Canva" },
  { name: "ChatGPT" },
  { name: "Claude", icon: siClaude },
  { name: "Codex" },
  { name: "Perplexity", icon: siPerplexity },
  { name: "Google Analytics", icon: siGoogleanalytics },
  { name: "Slack" },
  { name: "Airtable", icon: siAirtable },
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* ── Introduction ── */}
      <SectionReveal>
        <header>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
            Temi Adekunle
          </h1>
          <p className="mt-6 max-w-[680px] text-lg leading-relaxed text-[var(--color-text-muted)]">
            Product designer with a bias toward clarity, systems thinking, and work that holds up under scrutiny.
          </p>
          <div className="mt-5">
            <a
              href="/downloads/temi-adekunle-cv.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-[#A43718]/30 bg-[#A43718]/5 px-4 py-2.5 font-sans text-sm font-medium text-[#A43718] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[#A43718]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A43718]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1v9.5M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 12v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download CV (PDF)
            </a>
          </div>
        </header>
      </SectionReveal>

      <div className="mt-12 max-w-[680px]">
        <SectionReveal delay={80}>
          <p className="font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            I&rsquo;ve spent the past several years working across early-stage startups and established product teams, leading design for productivity tools, presentation platforms, and digital banking experiences. My work spans the full product design spectrum, from user research and information architecture through to visual design, prototyping, and design-system architecture.
          </p>
        </SectionReveal>
        <SectionReveal delay={160}>
          <p className="mt-5 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            What drives me is the intersection of structure and craft. I believe great products are built on clear thinking before polished pixels, and that the best design decisions make complex systems feel inevitable rather than clever. I work best in close partnership with engineers, where design intent meets implementation constraints, and the result is better for both.
          </p>
        </SectionReveal>
        <SectionReveal delay={240}>
          <p className="mt-5 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
            Before product design, I studied biochemistry, a background that taught me to think in systems, process, and the relationship between cause and effect. Those principles carry through everything I design today, whether it&rsquo;s mapping a user journey or building a design system component.
          </p>
        </SectionReveal>
      </div>

      <SectionReveal delay={320}>
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:gap-8">
          {SNAPSHOT_ITEMS.map((item) => (
            <div key={item.label} className="flex-1">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">
                {item.label}
              </h2>
              <p className="mt-2 font-sans text-[clamp(0.8125rem,1.8vw,0.9375rem)] leading-relaxed text-[#6F6F6F]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* ── Experience ── */}
      <div className="mt-16 md:mt-20">
        <SectionReveal>
          <h2 className="font-sans text-[clamp(1.5rem,3vw,2rem)] font-medium text-[#151515]">Experience</h2>
        </SectionReveal>
        <div className="mt-8"><ExperienceTimeline /></div>
      </div>

      {/* ── Skills & Education ── */}
      <section aria-labelledby="skills-education-heading" className="mt-16 md:mt-20">
        <SectionReveal>
          <h2 id="skills-education-heading" className="font-sans text-[clamp(1.25rem,3vw,1.75rem)] font-medium text-[#151515]">
            Skills &amp; Education
          </h2>
        </SectionReveal>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
          <SectionReveal>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">Skills</h3>
              <div className="mt-6"><SkillsGrid compact /></div>
            </div>
          </SectionReveal>
          <SectionReveal delay={80}>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">Education</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="font-sans text-base font-medium text-[#151515]">University of Lagos</p>
                  <p className="mt-0.5 font-sans text-sm text-[#6F6F6F]">Biochemistry, Mar 2023</p>
                </div>
                <div>
                  <p className="font-sans text-base font-medium text-[#151515]">Google UX Design Certificate</p>
                  <p className="mt-0.5 font-sans text-sm text-[#6F6F6F]">Coursera, Oct 2024</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Tools — full-width below, aligned to page left edge */}
        <SectionReveal delay={160}>
          <div className="mt-12">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#6F6F6F]">Tools</h3>
            <div className="mt-5 grid grid-cols-4 gap-x-6 gap-y-5 sm:grid-cols-5 md:grid-cols-7">
              {TOOLS.map((tool) => (
                <div key={tool.name} className="flex flex-col items-start gap-1.5">
                  {tool.icon ? (
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-[#6F6F6F]/45"
                      fill="currentColor"
                    >
                      <path d={tool.icon.path} />
                    </svg>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#151515]/5 text-[10px] font-semibold text-[#6F6F6F]/40">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                  <span className="font-sans text-[11px] text-[#6F6F6F]/45">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Interests ── */}
      <section aria-labelledby="interests-heading" className="mt-16 md:mt-20">
        <SectionReveal>
          <h2 id="interests-heading" className="font-sans text-[clamp(1.5rem,4vw,2rem)] font-medium text-[#151515]">
            Do we have similar interests?
          </h2>
          <p className="mt-2 max-w-[680px] font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#6F6F6F]">
            A few things I&rsquo;m into beyond the work.
          </p>
        </SectionReveal>
        <div className="mt-8"><InterestGrid interests={INTERESTS} /></div>

      </section>
    </PageShell>
  );
}
