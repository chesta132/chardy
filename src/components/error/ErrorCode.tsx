"use client";

/**
 * Renders a large animated error code with a proper GSAP glitch effect.
 * Two glitch layers: red/cyan chromatic aberration + clip-path slice shifting.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";

interface ErrorCodeProps {
  code: string;
  className?: string;
}

const GLITCH_SLICES = [
  "polygon(0 0%, 100% 0%, 100% 15%, 0 15%)",
  "polygon(0 20%, 100% 20%, 100% 38%, 0 38%)",
  "polygon(0 50%, 100% 50%, 100% 65%, 0 65%)",
  "polygon(0 70%, 100% 70%, 100% 85%, 0 85%)",
  "polygon(0 88%, 100% 88%, 100% 100%, 0 100%)",
];

const FULL_CLIP_PATH = "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)";

const GLITCH_CONFIG = {
  burstCountRange: [3, 7] as const,
  sliceDurationRange: [0.04, 0.1] as const,
  redXRange: [-8, -2] as const,
  cyanXRange: [2, 8] as const,
  fadeOutDuration: 0.03,
  initialDelay: 0.8,
  nextBurstDelayRange: [1.5, 4] as const, // seconds
};

const baseGlitchClass = "font-supply-mono text-[clamp(7rem,20vw,16rem)] font-bold leading-none tracking-tighter absolute inset-0";

export const ErrorCode = ({ code, className }: ErrorCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRedRef = useRef<HTMLSpanElement>(null);
  const layerCyanRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const layerRed = layerRedRef.current;
      const layerCyan = layerCyanRef.current;
      if (!layerRed || !layerCyan) return;

      let pendingCall: gsap.core.Tween | null = null;

      const runGlitchBurst = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set([layerRed, layerCyan], { x: 0, clipPath: FULL_CLIP_PATH, opacity: 0 });
          },
        });

        const burstCount = gsap.utils.random(...GLITCH_CONFIG.burstCountRange, 1);

        for (let i = 0; i < burstCount; i++) {
          const slice = gsap.utils.random(GLITCH_SLICES);
          const xRed = gsap.utils.random(...GLITCH_CONFIG.redXRange);
          const xCyan = gsap.utils.random(...GLITCH_CONFIG.cyanXRange);
          const duration = gsap.utils.random(...GLITCH_CONFIG.sliceDurationRange);

          tl.to(layerRed, { x: xRed, clipPath: slice, opacity: 1, duration, ease: "steps(1)" }, i === 0 ? 0 : "+=0")
            .to(layerCyan, { x: xCyan, clipPath: slice, opacity: 1, duration, ease: "steps(1)" }, "<")
            .to([layerRed, layerCyan], { opacity: 0, duration: GLITCH_CONFIG.fadeOutDuration, ease: "steps(1)" }, `+=${duration}`);
        }

        const nextDelay = gsap.utils.random(...GLITCH_CONFIG.nextBurstDelayRange);
        pendingCall = gsap.delayedCall(nextDelay, runGlitchBurst);
      };

      pendingCall = gsap.delayedCall(GLITCH_CONFIG.initialDelay, runGlitchBurst);

      return () => {
        pendingCall?.kill();
      };
    },
    { scope: containerRef, dependencies: [code], revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className={cn("relative select-none", className)} aria-hidden="true">
      {/* Main visible code */}
      <span className="font-supply-mono text-[clamp(7rem,20vw,16rem)] font-bold leading-none text-foreground/8 tracking-tighter">
        {code}
      </span>

      {/* Glitch layer, red channel (shifts left) */}
      <span ref={layerRedRef} className={cn(baseGlitchClass, "text-red-500/30 opacity-0")} style={{ mixBlendMode: "screen" }}>
        {code}
      </span>

      {/* Glitch layer, cyan channel (shifts right) */}
      <span ref={layerCyanRef} className={cn(baseGlitchClass, "text-cyan-400/30 opacity-0")} style={{ mixBlendMode: "screen" }}>
        {code}
      </span>
    </div>
  );
};
