"use client";

import { usePreference } from "@/contexts/Preference";
import { gsap } from "@/libs/gsap/register";
import { useGSAP } from "@gsap/react";

type UseTextRevealOptions = {
  dependencies?: any[];
  direction?: "left" | "right" | "up" | "down";
  on?: "enter-view" | "load";
};

/** use `reveal-text` class to trigger text reveal animation in scope */
export const useTextReveal = (scope: React.RefObject<HTMLElement | null>, options: UseTextRevealOptions = {}) => {
  const { motion } = usePreference();

  const { dependencies = [], direction = "left", on = "load" } = options;
  const toMap = {
    left: { "--cover-x": "-101%" },
    right: { "--cover-x": "101%" },
    up: { "--cover-y": "-101%" },
    down: { "--cover-y": "101%" },
  };

  useGSAP(
    () => {
      const textElements = scope.current?.querySelectorAll(".reveal-text");
      if (!textElements) return;
      if (motion === "lite") {
        gsap.set(textElements, {
          "--cover-bg": "transparent",
        });
        return;
      }

      switch (on) {
        case "load":
        case "enter-view":
          const scrollTrigger = on === "enter-view" && {
            trigger: scope.current,
            start: "top 85%",
          };
          gsap.to(textElements, {
            ...toMap[direction],
            duration: 1,
            ease: "power3.inOut",
            stagger: 0.15,
            scrollTrigger: scrollTrigger || undefined,
            onComplete: () => {
              gsap.set(textElements, {
                "--cover-bg": "transparent",
              });
            },
          });
          break;
      }
    },
    { scope, dependencies: [motion, ...dependencies] },
  );
};
