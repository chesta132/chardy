"use client";

import { cn } from "@/libs/utils";
import { usePreference } from "@/contexts/Preference";
import { FullMarquee, MarqueeProps, SimpleMarquee } from "../ui/Marquee";

export const Marquee = ({ children, speed = 40, className }: MarqueeProps) => {
  const { motion } = usePreference();

  switch (motion) {
    case "no-motion":
      return (
        <div className={cn("overflow-hidden w-full", className)}>
          <div className="flex w-max">{children}</div>
        </div>
      );
    case "reduce":
      return (
        <SimpleMarquee speed={speed} className={className}>
          {children}
        </SimpleMarquee>
      );
    default:
      return (
        <FullMarquee speed={speed} className={className}>
          {children}
        </FullMarquee>
      );
  }
};
