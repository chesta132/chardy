import { useGSAP } from "@gsap/react";
import { gsap } from "../register";
import { useAIChat } from "@/contexts/AIChat";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useState } from "react";
import { usePreference } from "@/contexts/Preference";

type useAIChatButtonGSAPProps = {
  buttonRef: React.RefObject<HTMLElement | null>;
};

export const useAIChatButtonGSAP = ({ buttonRef }: useAIChatButtonGSAPProps) => {
  const { open } = useAIChat();
  const direction = useScrollDirection({ threshold: 10 });
  const [initialed, setInitialed] = useState(false);
  const { motion } = usePreference();

  // initial entrance animation
  useGSAP(
    () => {
      const btn = buttonRef.current;
      if (!btn) return;
      gsap.set(btn, { y: "150%", opacity: 0 });
      gsap.to(btn, {
        y: "0%",
        opacity: 1,
        duration: 1.3,
        ease: "power3.inOut",
        delay: 0.3,
        onComplete: () => setInitialed(true),
      });
    },
    { scope: buttonRef, dependencies: [] },
  );

  // hide/show on scroll direction except if motion is lite
  useGSAP(
    () => {
      const btn = buttonRef.current;
      if (!btn || !initialed || open || motion === "lite") return;

      if (direction === "down") {
        gsap.to(btn, { y: "150%", opacity: 0, duration: 0.5, ease: "power3.inOut" });
      } else if (direction === "up") {
        gsap.to(btn, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.inOut" });
      }
    },
    { dependencies: [direction, initialed, open] },
  );

  // also hide the button when panel is open except if motion is lite
  useGSAP(
    () => {
      const btn = buttonRef.current;
      if (!btn || !initialed || motion === "lite") return;

      if (open) {
        gsap.to(btn, { y: "150%", opacity: 0, duration: 0.4, ease: "power3.inOut" });
      } else if (direction !== "down") {
        gsap.to(btn, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 });
      }
    },
    { dependencies: [open, initialed] },
  );
};
