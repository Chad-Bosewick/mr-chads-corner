import { CinematicImage } from "@/components/ui/CinematicImage";

interface HeroMediaProps {
  src: string;
  alt: string;
}

export function HeroMedia({ src, alt }: HeroMediaProps) {
  return (
    <div className="mt-8 md:mt-12">
      <CinematicImage
        src={src}
        alt={alt}
        fill
        aspectRatio="8/5"
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-contain"
      />
    </div>
  );
}
