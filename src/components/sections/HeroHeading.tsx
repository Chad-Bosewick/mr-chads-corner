interface HeroHeadingProps {
  title: string;
  subtitle?: string;
}

export function HeroHeading({ title, subtitle }: HeroHeadingProps) {
  return (
    <section className="mb-12">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.5] text-[#151515]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-[#757575]">{subtitle}</p>
      )}
    </section>
  );
}
