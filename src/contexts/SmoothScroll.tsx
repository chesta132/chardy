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
      autoRaf: true,
    });

    setLenis(lenisInstance);

    const ro = new ResizeObserver(() => lenisInstance.resize());
    ro.observe(document.body);

    return () => {
      lenisInstance.destroy();
      ro.disconnect();
    };
  }, []);

  if (!lenis) return null;

  return <smoothScrollContext.Provider value={lenis}>{children}</smoothScrollContext.Provider>;
}

export const useSmoothScroll = () => {
  const context = useContext(smoothScrollContext);
  if (!context) throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  return context;
};
