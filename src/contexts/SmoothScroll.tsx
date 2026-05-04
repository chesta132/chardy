"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import Lenis from "lenis";

const smoothScrollContext = createContext<Lenis | null>(null);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useLayoutEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenisInstance.destroy();
  }, []);

  // TODO: change to loading state or create global loading state
  if (!lenis) return null;

  return <smoothScrollContext.Provider value={lenis}>{children}</smoothScrollContext.Provider>;
}

export const useSmoothScroll = () => {
  const context = useContext(smoothScrollContext);
  if (!context) throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  return context;
};
