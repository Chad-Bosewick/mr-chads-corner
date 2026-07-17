import Image from "next/image";
import { SectionReveal } from "@/components/sections/SectionReveal";

interface ImagePairProps {
  heading?: string;
  images: { src: string; alt: string; caption?: string }[];
}

export function ImagePair({ heading, images }: ImagePairProps) {
  return (
    <SectionReveal>
      <section className="my-12 md:my-16">
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
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0f0f0]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {img.caption && (
                <figcaption className="mt-2 font-sans text-sm text-[#757575]">
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
