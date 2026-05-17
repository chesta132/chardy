"use client";

import { useRef, useState } from "react";
import { gsap } from "@/libs/gsap/register";
import { useGSAP } from "@gsap/react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAIChat } from "@/contexts/AIChat";
import { RiRobot2Line } from "react-icons/ri";
import { cn } from "@/libs/utils";
import { RollingLabel } from "@/components/ui/Label";
import { useTranslations } from "next-intl";
import { AI_NAME } from "@/config";

export const AIChatButton = () => {
  const t = useTranslations("AIChat.button");
  const { open, setOpen } = useAIChat();
  const direction = useScrollDirection({ threshold: 10 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [initialed, setInitialed] = useState(false);

  // Initial entrance animation
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

  // Hide/show on scroll direction
  useGSAP(
    () => {
      const btn = buttonRef.current;
      if (!btn || !initialed || open) return;

      if (direction === "down") {
        gsap.to(btn, { y: "150%", opacity: 0, duration: 0.5, ease: "power3.inOut" });
      } else if (direction === "up") {
        gsap.to(btn, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.inOut" });
      }
    },
    { dependencies: [direction, initialed, open] },
  );

  // Also hide the button when panel is open
  useGSAP(
    () => {
      const btn = buttonRef.current;
      if (!btn || !initialed) return;

      if (open) {
        gsap.to(btn, { y: "150%", opacity: 0, duration: 0.4, ease: "power3.inOut" });
      } else if (direction !== "down") {
        gsap.to(btn, { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.15 });
      }
    },
    { dependencies: [open, initialed] },
  );

  return (
    <button
      ref={buttonRef}
      onClick={() => setOpen(true)}
      aria-label="Open AI chat"
      className={cn(
        "group fixed bottom-6 right-6 z-40",
        "flex items-center gap-2",
        "px-4.5 py-3 rounded-xl",
        "bg-foreground text-background",
        "text-xs uppercase font-supply-mono",
        "border border-background/10",
        "shadow-lg shadow-foreground/20",
        "hover:bg-secondary hover:scale-95",
        "transition-colors duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]",
        "cursor-pointer",
      )}
    >
      <RiRobot2Line className="w-3.5 h-3.5 shrink-0" aria-hidden />
      <RollingLabel>{t("askAI", { aiName: AI_NAME })}</RollingLabel>
    </button>
  );
};
