import { usePreference } from "@/contexts/Preference";
import { useGSAP } from "@gsap/react";
import { gsap } from "../register";

type useHeroGSAPProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  heroRef: React.RefObject<HTMLElement | null>;
};

export const useHeroGSAP = ({ containerRef, heroRef }: useHeroGSAPProps) => {
  const { motion } = usePreference();
  
  // hero parallax effect except on lite
  useGSAP(
    () => {
      if (motion === "lite") return;

      gsap.to(heroRef.current, {
        yPercent: 15, // down
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: containerRef, dependencies: [motion], revertOnUpdate: true },
  );

  // hero init animation
  useGSAP(
    () => {
      // impossible to get lite if no dependencies (on load only)
      // if (motion === "lite") return;
      gsap.fromTo(
        heroRef.current,
        {
          yPercent: 10,
          xPercent: 5,
          ease: "none",
        },
        {
          yPercent: 0,
          xPercent: 0,
          ease: "power1.inOut",
          duration: 1.3,
        },
      );
    },
    { scope: containerRef },
  );
};
