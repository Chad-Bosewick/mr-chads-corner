import { HeroHeading } from "@/components/sections/HeroHeading";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return known slugs once content is added
  return [{ slug: "todo-app" }, { slug: "letters-app" }, { slug: "enviodeck" }];
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading title={slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />
    </div>
  );
}
