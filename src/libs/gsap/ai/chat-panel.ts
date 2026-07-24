import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useEffect } from "react";
import { gsap } from "../register";
import { DESKTOP_AI_PANEL_SIZES } from "@/config";
import { useGSAP } from "@gsap/react";
import { useAIChat } from "@/contexts/AIChat";
import { usePreference } from "@/contexts/Preference";
import { withMotionDuration } from "../utils";

type useAIChatPanelGSAPProps = {
  panelRef: React.RefObject<HTMLElement | null>;
  /** svh */
  sheetHeight: React.RefObject<number>;
  isExpanded: boolean;
};

const getDesktopShape = (isExpanded: boolean) => {
  const size = isExpanded ? DESKTOP_AI_PANEL_SIZES.expanded : DESKTOP_AI_PANEL_SIZES.normal;
  return {
    width: size.width,
    height: size.height,
    bottom: "auto",
    left: "auto",
    right: 32,
    top: "auto",
    y: 0,
  };
};

const getMobileShape = (sheetHeightVh: number) => ({
  width: "100%",
  left: 0,
  right: 0,
  bottom: 0,
  top: "auto",
  height: `${sheetHeightVh}svh`,
  x: 0,
  scale: 1,
});

export const useAIChatPanelGSAP = ({ panelRef, sheetHeight, isExpanded }: useAIChatPanelGSAPProps) => {
  const isDesktop = useIsDesktop();
  const { open } = useAIChat();
  const { motion } = usePreference();

  // Clear stale GSAP inline styles when breakpoint flips, so neither
  // desktop nor mobile inherits the other's positioning/sizing.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open) return;

    if (isDesktop) {
      // coming from mobile: clear mobile sheet styles
      gsap.set(panel, {
        clearProps: "bottom,left,right,y,opacity",
        ...getDesktopShape(isExpanded),
        display: "flex",
        x: 0,
        scale: 1,
        opacity: 1,
      });
    } else {
      // coming from desktop: clear desktop drag/size styles
      gsap.set(panel, {
        clearProps: "width,height,left,top,x,scale",
        ...getMobileShape(sheetHeight.current),
        opacity: 1,
        display: "flex",
      });
    }
  }, [isDesktop]);

  // GSAP panel open/close animation
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (!open) {
        const closeVars = isDesktop
          ? { opacity: 0, x: 40, scale: 0.95, duration: withMotionDuration(motion, 0.35) }
          : { opacity: motion === "reduce" ? 1 : 0, y: "100%", duration: withMotionDuration(motion, 0.4) };

        gsap.to(panel, {
          ...closeVars,
          ease: "power3.inOut",
          onComplete: () => gsap.set(panel, { display: "none" }),
        });
        return;
      }

      gsap.set(panel, { display: "flex" });

      if (isDesktop) {
        gsap.set(panel, getDesktopShape(isExpanded));
        gsap.fromTo(
          panel,
          { opacity: 0, x: 40, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: withMotionDuration(motion, 0.5), ease: "power3.out" },
        );
      } else {
        gsap.set(panel, getMobileShape(sheetHeight.current));
        gsap.fromTo(
          panel,
          { opacity: motion === "reduce" ? 1 : 0, y: "100%" },
          { opacity: 1, y: "0%", duration: withMotionDuration(motion, 0.5), ease: "power3.out" },
        );
      }
    },
    { dependencies: [open, isDesktop] },
  );
};
