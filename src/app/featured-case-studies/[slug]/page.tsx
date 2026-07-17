import { notFound } from "next/navigation";
import Link from "next/link";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { getCaseStudy, getNavAdjacent } from "@/content/case-studies";
import { projects } from "@/content/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    if (slug === "enviodeck") {
      return <EnviodeckComingSoon />;
    }
    notFound();
  }

  const { prevProject, nextProject } = getNavAdjacent(slug);

  return (
    <CaseStudyLayout
      caseStudy={caseStudy}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}

function EnviodeckComingSoon() {
  return (
    <div className="mx-auto max-w-[680px] px-4 py-24 text-center md:py-32">
      <p className="font-sans text-sm uppercase tracking-wider text-[#757575]">
        Climate Tech
      </p>
      <h1 className="mt-2 font-sans text-[clamp(2rem,5vw,3rem)] font-medium text-[#151515]">
        Enviodeck
      </h1>
      <p className="mx-auto mt-4 max-w-[480px] font-sans leading-relaxed text-[#757575]">
        Case study is coming soon. This project is currently under development.
      </p>
      <Link
        href="/featured-case-studies"
        className="mt-8 inline-flex font-sans text-sm font-medium text-[#A43718] transition-colors hover:text-[#A43718]/70"
      >
        &larr; All case studies
      </Link>
    </div>
  );
}
