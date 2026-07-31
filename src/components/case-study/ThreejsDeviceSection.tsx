"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ThreejsDeviceAssets } from "@/components/case-study/ThreejsCanvas";

const ThreejsCanvas = dynamic(() => import("@/components/case-study/ThreejsCanvas"), { ssr: false });

interface ThreejsDeviceSectionProps {
  heading?: string;
  body?: string;
  deviceAssets: ThreejsDeviceAssets & { fallback: string; caption?: string; alt: string };
  /** Anchor id so the sticky section nav can target this section. */
  id?: string;
}

export function ThreejsDeviceSection({ heading, body, deviceAssets, id }: ThreejsDeviceSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [lightPassPlayed, setLightPassPlayed] = useState(false);

  useEffect(() => {
    const updateMedia = () => setIsDesktop(window.matchMedia("(min-width: 769px) and (hover: hover)").matches);
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    setWebglAvailable(Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const canUseWebgl = isInView && isDesktop && webglAvailable && !prefersReducedMotion;

  useEffect(() => {
    if (!canUseWebgl) setCanvasReady(false);
  }, [canUseWebgl]);

  return (
    <section id={id} className={id ? "scroll-mt-16" : undefined}>
      {heading && <h2 className="mb-6 font-sans text-[clamp(1.25rem,3vw,1.5rem)] font-medium text-[#151515]">{heading}</h2>}
      {body && (
        <div className="mb-8 font-sans text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-[#151515]/70">
          <p dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      )}
      <figure>
        <div
          ref={rootRef}
          className="relative aspect-[16/10] w-full max-w-[680px] overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(21,21,21,0.08)]"
        >
          <Image
            src={deviceAssets.fallback}
            alt={deviceAssets.alt}
            fill
            className={`object-contain transition-opacity duration-300 ease-[var(--ease-out)] ${canvasReady ? "pointer-events-none opacity-0" : "opacity-100"}`}
            sizes="(max-width: 768px) 100vw, 680px"
          />
          {canUseWebgl && (
            <div className={`absolute inset-0 transition-[opacity,transform] duration-[800ms] ease-[var(--ease-out)] ${canvasReady ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
              <ThreejsCanvas
                assets={deviceAssets}
                runLightPass={!lightPassPlayed}
                onReady={() => setCanvasReady(true)}
                onLightPassComplete={() => setLightPassPlayed(true)}
              />
            </div>
          )}
        </div>
        {deviceAssets.caption && <figcaption className="mt-2 font-sans text-sm text-[var(--color-text-muted)]">{deviceAssets.caption}</figcaption>}
      </figure>
    </section>
  );
}
