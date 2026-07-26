import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { getCaseStudy, getNavAdjacent } from "@/content/case-studies";
import { projects } from "@/content/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects
    .filter((p) => p.status === "published")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const caseStudy = getCaseStudy(slug);

  if (!project) return {};

  return {
    title: caseStudy?.title || project.title,
    description:
      slug === "credlane"
        ? "I led the design of Travecs, a responsive talent-assessment and hiring platform connecting job readiness, employer discovery, custom assessments, and candidate evaluation."
        : project.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) notFound();

  const { prevProject, nextProject } = getNavAdjacent(slug);

  return (
    <CaseStudyLayout
      caseStudy={caseStudy}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
