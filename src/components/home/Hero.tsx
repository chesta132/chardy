"use client";
import { useRef } from "react";
import Image from "next/image";
import HeroBg from "@/assets/images/hero-bg.webp";
import HeroFigure from "@/assets/images/hero.webp";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/libs/gsap/register";
import { Arrow } from "../ui/Arrow";
import { Button } from "../ui/Button";
import { useTextReveal } from "@/hooks/useTextReveal";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { OWNER_FIRSTNAME } from "@/config";
import { type Hero as HeroPayload } from "@/types/payload";
import { usePreference } from "@/contexts/Preference";

type Props = { data: HeroPayload };

export const Hero = ({ data }: Props) => {
  const t = useTranslations("HomeHero");
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const lenis = useSmoothScroll();
  const { motion } = usePreference();

  // gsap
  useTextReveal(containerRef);
  useGSAP(
    () => {
      if (motion === "no-motion") return;

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
  useGSAP(
    () => {
      // impossible to get no-motion if no dependencies (on load only)
      // if (motion === "no-motion") return;
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

  return (
    <section className="flex flex-col flex-1 items-center justify-center overflow-x-hidden" aria-label="Hero">
      <div className="h-dvh w-screen p-2 md:p-4">
        <div ref={containerRef} className="relative h-full w-full rounded-2xl overflow-hidden">
          {/* bg — static */}
          <Image className="size-full object-cover" src={HeroBg} alt="" role="presentation" fill priority />

          {/* Text overlay */}
          <div className="absolute inset-0 flex z-10 flex-col xl:justify-center p-8 xl:items-baseline items-center text-center xl:text-left mt-20 xl:mt-0">
            <p className="reveal-text text-[clamp(0.7rem,1vw,0.875rem)] text-neutral-400 mb-4 font-supply-mono uppercase">
              ( {t("hello", { name: OWNER_FIRSTNAME })} )
            </p>
            <h1 className="reveal-text text-[clamp(2rem,5vw,3.75rem)]/[clamp(2.5rem,5.5vw,4.125rem)] text-white mb-4 uppercase font-neue-montreal whitespace-pre-wrap">
              {data.title}
            </h1>
            <p className="reveal-text text-[clamp(0.875rem,1.5vw,1.25rem)]/[clamp(1.1rem,2vw,1.1875rem)] text-neutral-200 max-w-lg font-neue-montreal">
              {data.subtitle}
            </p>
            <Link href={"#featured-projects"} onClick={() => lenis?.scrollTo("#featured-projects", { duration: 1.2 })}>
              <Button className="reveal-text mt-8">{t("viewProjects")}</Button>
            </Link>
          </div>

          <div className="absolute inset-0 xl:flex flex-col hidden xl:justify-end p-8 text-[#d4d4d4]">
            <p className="reveal-text w-fit flex items-center gap-2 font-neue-montreal">
              {t("scrollForMore")} <Arrow fill="#d4d4d4" className="rotate-90" />
            </p>
          </div>

          {/* hero figure — parallax */}
          <div ref={heroRef} className="absolute bottom-0 right-0" aria-hidden="true">
            <Image
              className="w-auto translate-y-[20%] xl:translate-y-[20%] lg:translate-y-[45%] md:translate-y-[40%] sm:translate-y-[30%] scale-125 md:scale-100"
              src={HeroFigure}
              alt=""
              role="presentation"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
