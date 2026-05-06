"use client";

import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  threshold?: number;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollDirection {
  const { threshold = 0 } = options;

  const [direction, setDirection] = useState<ScrollDirection>(null);
  const prevScrollY = useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);
  const prevDirection = useRef<ScrollDirection>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - prevScrollY.current;

      if (Math.abs(diff) < threshold) return;

      const newDirection: ScrollDirection = diff > 0 ? "down" : "up";

      if (newDirection !== prevDirection.current) {
        prevDirection.current = newDirection;
        setDirection(newDirection);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return direction;
}
