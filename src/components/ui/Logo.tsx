"use client";

import Logo from "@/assets/images/logo-1k.svg";
import { cn } from "@/libs/utils";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { useState } from "react";

type LogoAnimatedProps = Omit<React.ComponentProps<typeof DotLottieReact>, "src" | "dotLottieRefCallback">;
type LogProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

type ChardyLogoProps<T> = {
  animateOnHover?: T;
} & (T extends true ? LogoAnimatedProps : LogProps);

export const ChardyLogo = <T,>({ className, animateOnHover, ...props }: ChardyLogoProps<T>) => {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  if (animateOnHover) {
    const handleMouseEnter = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (dotLottie) {
        dotLottie.setMode("forward");
        dotLottie.play();
        props.onMouseEnter?.(e as any);
      }
    };
    const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (dotLottie) {
        dotLottie.setMode("reverse");
        dotLottie.play();
        props.onMouseLeave?.(e as any);
      }
    };
    return (
      <DotLottieReact
        src="/assets/lotties/logo-animated.lottie"
        dotLottieRefCallback={setDotLottie}
        className={cn("w-auto h-6", className)}
        {...(props as LogoAnimatedProps)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
  }

  return <Image src={Logo} alt="Chardy logo" className={cn("w-auto h-6", className)} {...(props as LogProps)} />;
};
