"use client";

import { useRef } from "react";
import { useAsciiShader } from "@/hooks/useAsciiShader";
import { useAnimationContext } from "@/components/providers/AnimationProvider";

export function AsciiShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isAsciiPaused } = useAnimationContext();

  useAsciiShader(canvasRef, isAsciiPaused);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 block h-screen w-screen"
    />
  );
}
