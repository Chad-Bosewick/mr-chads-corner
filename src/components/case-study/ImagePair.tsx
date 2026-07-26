import { SectionReveal } from "@/components/sections/SectionReveal";
import { CinematicImage } from "@/components/ui/CinematicImage";

interface ImagePairProps {
  heading?: string;
  images: { src: string; alt: string; caption?: string; width?: number; height?: number }[];
}

export function ImagePair({ heading, images }: ImagePairProps) {
  return (
    <SectionReveal>
      <section>
        {heading && (
          <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">
            {heading}
          </h2>
        )}
        <div
          className={`grid gap-6 ${
            images.length === 2
              ? "md:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {images.map((img, i) => (
            <figure key={i}>
              <CinematicImage
                src={img.src}
                alt={img.alt}
                aspectRatio="auto"
                sizes="(max-width: 768px) 100vw, 680px"
                {...(img.width && img.height ? { width: img.width, height: img.height } : {})}
              />
              {img.caption && (
                <figcaption className="mt-2 font-sans text-sm text-[var(--color-text-muted)]">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
