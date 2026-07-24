"use client";

import { useRef } from "react";
import { useAIChat } from "@/contexts/AIChat";
import { RiRobot2Line } from "react-icons/ri";
import { cn } from "@/libs/utils";
import { RollingLabel } from "@/components/ui/Label";
import { useTranslations } from "next-intl";
import { useAIChatButtonGSAP } from "@/libs/gsap/ai/chat-button";

export const AIChatButton = () => {
  const t = useTranslations("AIChat.button");
  const { setOpen, aiConfig } = useAIChat();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useAIChatButtonGSAP({ buttonRef });

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
      <RollingLabel>{t("askAI", { aiName: aiConfig.aiName })}</RollingLabel>
    </button>
  );
};
