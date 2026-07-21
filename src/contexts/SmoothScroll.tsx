"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import { usePreference } from "./Preference";

const smoothScrollContext = createContext<Lenis | null | undefined>(null);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | undefined>();
  const { motion } = usePreference();

  useLayoutEffect(() => {
    const smooth = motion === "full";
    const lenisInstance = new Lenis({
      duration: smooth ? 1.2 : 0,
      easing: smooth ? (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) : undefined,
      autoRaf: true,
      smoothWheel: smooth,
    });

    setLenis(lenisInstance);

    const ro = new ResizeObserver(() => lenisInstance.resize());
    ro.observe(document.body);

    return () => {
      lenisInstance.destroy();
      ro.disconnect();
    };
  }, [motion]);

  return <smoothScrollContext.Provider value={lenis}>{children}</smoothScrollContext.Provider>;
}

export const useSmoothScroll = () => {
  const context = useContext(smoothScrollContext);
  if (context === null) throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  return context;
};
