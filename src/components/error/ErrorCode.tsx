"use client";

/**
 * Renders a large animated error code with a proper GSAP glitch effect.
 * Two glitch layers: red/cyan chromatic aberration + clip-path slice shifting.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";

interface ErrorCodeProps {
  code: string;
  className?: string;
}

export const ErrorCode = ({ code, className }: ErrorCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRedRef = useRef<HTMLSpanElement>(null);
  const layerCyanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layerRed = layerRedRef.current;
    const layerCyan = layerCyanRef.current;
    if (!container || !layerRed || !layerCyan) return;

    // Random glitch burst — shifts layers + swaps clip-path slices
    const glitchSlices = [
      "polygon(0 0%, 100% 0%, 100% 15%, 0 15%)",
      "polygon(0 20%, 100% 20%, 100% 38%, 0 38%)",
      "polygon(0 50%, 100% 50%, 100% 65%, 0 65%)",
      "polygon(0 70%, 100% 70%, 100% 85%, 0 85%)",
      "polygon(0 88%, 100% 88%, 100% 100%, 0 100%)",
    ];

    const runGlitch = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Reset both layers cleanly after burst
          gsap.set([layerRed, layerCyan], {
            x: 0,
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            opacity: 0,
          });
        },
      });

      const burstCount = gsap.utils.random(3, 7, 1) as number;

      for (let i = 0; i < burstCount; i++) {
        const slice = glitchSlices[Math.floor(Math.random() * glitchSlices.length)];
        const xRed = gsap.utils.random(-8, -2) as number;
        const xCyan = gsap.utils.random(2, 8) as number;
        const duration = gsap.utils.random(0.04, 0.1) as number;

        tl.to(
          layerRed,
          {
            x: xRed,
            clipPath: slice,
            opacity: 1,
            duration,
            ease: "steps(1)",
          },
          i === 0 ? 0 : "+=0",
        )
          .to(
            layerCyan,
            {
              x: xCyan,
              clipPath: slice,
              opacity: 1,
              duration,
              ease: "steps(1)",
            },
            "<",
          )
          .to(
            [layerRed, layerCyan],
            {
              opacity: 0,
              duration: 0.03,
              ease: "steps(1)",
            },
            `+=${duration}`,
          );
      }

      // Schedule next glitch burst randomly between 1.5s – 4s
      const nextDelay = gsap.utils.random(1500, 4000) as number;
      gsap.delayedCall(nextDelay / 1000, runGlitch);
    };

    // Kick off with a small initial delay
    const initialTimer = gsap.delayedCall(0.8, runGlitch);

    return () => {
      initialTimer.kill();
      gsap.killTweensOf([layerRed, layerCyan]);
    };
  }, [code]);

  const baseClass = "font-supply-mono text-[clamp(7rem,20vw,16rem)] font-bold leading-none tracking-tighter absolute inset-0";

  return (
    <div ref={containerRef} className={cn("relative select-none", className)} aria-hidden="true">
      {/* Main visible code */}
      <span className="font-supply-mono text-[clamp(7rem,20vw,16rem)] font-bold leading-none text-foreground/8 tracking-tighter">{code}</span>

      {/* Glitch layer — red channel (shifts left) */}
      <span ref={layerRedRef} className={cn(baseClass, "text-red-500/30 opacity-0")} style={{ mixBlendMode: "screen" }}>
        {code}
      </span>

      {/* Glitch layer — cyan channel (shifts right) */}
      <span ref={layerCyanRef} className={cn(baseClass, "text-cyan-400/30 opacity-0")} style={{ mixBlendMode: "screen" }}>
        {code}
      </span>
    </div>
  );
};
