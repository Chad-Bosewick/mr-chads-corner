"use client";

import { useRef } from "react";
import { useAsciiShader } from "@/hooks/useAsciiShader";

export function AsciiShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useAsciiShader(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 block h-screen w-screen"
    />
  );
}
