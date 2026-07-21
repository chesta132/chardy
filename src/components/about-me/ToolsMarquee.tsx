"use client";

import { usePreference } from "@/contexts/Preference";
import { FullMarquee, MarqueeProps, SimpleMarquee } from "../ui/Marquee";

export const Marquee = ({ children, speed = 40, className }: MarqueeProps) => {
  const { motion } = usePreference();

  switch (motion) {
    case "full":
      return (
        <FullMarquee speed={speed} className={className}>
          {children}
        </FullMarquee>
      );
    default:
      return (
        <SimpleMarquee speed={speed} className={className}>
          {children}
        </SimpleMarquee>
      );
  }
};
