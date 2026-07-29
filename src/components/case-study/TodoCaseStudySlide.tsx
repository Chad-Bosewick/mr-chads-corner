import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhoneBezelProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * The single mobile shell used throughout the TODO++ case study. Keeping it
 * here prevents wide compositions from drifting away from the case-study
 * phone treatment.
 */
export function PhoneBezel({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 34vw, 180px",
}: PhoneBezelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-[#1a1a1a] p-[1.5px]",
        "shadow-[0_8px_30px_rgba(21,21,21,0.08)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-0 z-10 h-[14px] w-[60px] -translate-x-1/2 rounded-b-[10px] bg-[#1a1a1a]" />
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[20px] bg-[#f0f0f0]">
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
      </div>
    </div>
  );
}

type TodoSlidePresentation = "device" | "annotated-device" | "phone" | "phone-pair";

interface TodoCaseStudySlideProps {
  presentation: TodoSlidePresentation;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  secondarySrc?: string;
  secondaryAlt?: string;
}

function DeviceAnnotations() {
  const annotations = [
    "E-paper task display",
    "Screen control keys",
    "AI emoji display",
    "Push to speak",
  ];

  return (
    <aside
      className="hidden w-[180px] shrink-0 flex-col justify-center gap-4 md:flex"
      aria-hidden="true"
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A43718]">
        Key features
      </p>
      {annotations.map((label) => (
        <div key={label} className="flex items-center gap-2">
          <i className="h-px w-5 shrink-0 bg-[#A43718]/75" />
          <span className="whitespace-nowrap font-sans text-[10px] font-medium uppercase leading-snug tracking-[0.08em] text-[#151515]/75">
            {label}
          </span>
        </div>
      ))}
    </aside>
  );
}

export function TodoCaseStudySlide({
  presentation,
  src,
  alt,
  width = 800,
  height = 458,
  secondarySrc,
  secondaryAlt,
}: TodoCaseStudySlideProps) {
  const isPair = presentation === "phone-pair";
  const isPhone = presentation === "phone";
  const isAnnotated = presentation === "annotated-device";

  return (
    <div className="flex h-full w-full items-center overflow-hidden bg-white px-6 py-7 sm:px-10">
      {isPair ? (
        <div className="flex w-full items-center justify-center gap-4 sm:gap-6">
          <PhoneBezel src={src} alt={alt} className="w-[min(28vw,180px)]" />
          {secondarySrc && (
            <PhoneBezel
              src={secondarySrc}
              alt={secondaryAlt ?? "TODO++ companion mobile screen"}
              className="w-[min(28vw,180px)]"
            />
          )}
        </div>
      ) : isPhone ? (
        <div className="flex w-full justify-center">
          <PhoneBezel src={src} alt={alt} className="w-[min(38vw,180px)]" />
        </div>
      ) : isAnnotated ? (
        <div className="flex h-full w-full items-center justify-center gap-5">
          <div className="h-full max-h-[calc(100%-2.5rem)] shrink">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-full w-auto max-w-full object-contain"
              sizes="(max-width: 768px) 80vw, 550px"
            />
          </div>
          <DeviceAnnotations />
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <div className="w-[min(70%,500px)]">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 70vw, 500px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export type { TodoSlidePresentation };
