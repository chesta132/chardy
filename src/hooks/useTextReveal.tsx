"use client";

import { gsap } from "@/libs/gsap/register";
import { useGSAP } from "@gsap/react";

type UseTextRevealOptions = {
  dependencies?: any[];
  direction?: "left" | "right" | "up" | "down";
};

/** use `reveal-text` class to trigger text reveal animation in scope */
export const useTextReveal = (scope: React.RefObject<HTMLElement | null>, options: UseTextRevealOptions = {}) => {
  const { dependencies = [], direction = "left" } = options;
  const toMap = {
    left: { "--cover-x": "-101%" },
    right: { "--cover-x": "101%" },
    up: { "--cover-y": "-101%" },
    down: { "--cover-y": "101%" },
  };

  useGSAP(
    () => {
      const textElements = scope.current?.querySelectorAll(".reveal-text");
      if (textElements) {
        gsap.to(textElements, {
          ...toMap[direction],
          duration: 1,
          ease: "power3.inOut",
          stagger: 0.15,
        });
      }
    },
    { scope, dependencies },
  );
};
