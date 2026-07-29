"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { AnimationPauseButton } from "@/components/ui/AnimationPauseButton";

interface AnimationContextValue {
  isAsciiPaused: boolean;
  toggleAsciiPause: () => void;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAsciiPaused, setIsAsciiPaused] = useState(false);
  const value = useMemo(
    () => ({
      isAsciiPaused,
      toggleAsciiPause: () => setIsAsciiPaused((paused) => !paused),
    }),
    [isAsciiPaused],
  );

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export function useAnimationContext() {
  const context = useContext(AnimationContext);
  if (!context) throw new Error("useAnimationContext must be used within AnimationProvider");
  return context;
}

export function GlobalAnimationPauseControl() {
  const { isAsciiPaused, toggleAsciiPause } = useAnimationContext();

  return (
    <AnimationPauseButton
      isPaused={isAsciiPaused}
      onToggle={toggleAsciiPause}
      label="background animation"
      className="fixed bottom-4 right-4 z-20"
    />
  );
}
