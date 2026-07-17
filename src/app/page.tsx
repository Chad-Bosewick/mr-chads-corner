import { HeroHeading } from "@/components/sections/HeroHeading";
import { TextSection } from "@/components/sections/TextSection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1038px] px-4 py-12 md:px-6 md:py-16 lg:py-24">
      <HeroHeading
        title="Hello!"
        subtitle="I'm Temi Adekunle — product designer"
      />
      <TextSection>
        <p className="text-base leading-relaxed md:text-base lg:text-base">
          This is the homepage. Content will be added in Phase 2.
        </p>
      </TextSection>
    </div>
  );
}
