"use client";

import { cn } from "@/libs/utils";
import { Arrow } from "../ui/Arrow";
import { Globe, WEST_JAVA } from "../ui/Globe";
import { ChardyLogo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { GithubCalendar } from "../about-me/GithubCalendar";
import { Marquee } from "../about-me/ToolsMarquee";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { useTranslations } from "next-intl";
import { LOCATION, OWNER_FULLNAME } from "@/config";
import { Media, type AboutMe as AboutMePayload } from "@/types/payload";
import { extractUsername } from "@/libs/github";
import { RichText } from "@payloadcms/richtext-lexical/react";

const getStats = (data: AboutMePayload["stats"]) =>
  [
    { t: "yearsOfExperience", value: `${data.yearsOfExperience}+` },
    { t: "projectsCompleted", value: `${data.projectsCompleted}+` },
    { t: "technologiesUsed", value: `${data.technologiesUsed}+` },
  ] as const;

type Tool = { name: string; href?: string; imgUrl: string };

const getTools = (data: AboutMePayload["tools"]) =>
  data
    .map((data) => typeof data.logo !== "number" && { name: data.logo.alt, imgUrl: data.logo.cloudinary?.secure_url })
    .filter((data) => data && data.imgUrl) as Tool[];

export const AboutMe = ({ data, githubUrl }: { data: AboutMePayload; githubUrl: string }) => {
  const t = useTranslations("HomeAbout");
  const lenis = useSmoothScroll();
  const stats = getStats(data.stats);
  const tools = getTools(data.tools);

  return (
    <section id="about-me" className="size-full flex flex-col gap-8 py-16 px-2 md:px-4">
      <div className="bg-foreground text-background rounded-2xl flex flex-col gap-10 p-10 lg:p-16">
        <div>
          <h2 className="font-supply-mono text-background/60 flex items-center gap-2 text-[clamp(0.2rem,3vw,0.8rem)] tracking-widest uppercase">
            ( {t("aboutMe")} ) <Arrow className="rotate-90 fill-background/60" />
          </h2>
        </div>
        <div className="flex flex-col-reverse lg:flex-row justify-between gap-8">
          <div className="flex lg:flex-col gap-3 justify-between lg:justify-start items-stretch overflow-x-auto">
            {stats.map((stat, idx) => (
              <div
                key={stat.t}
                className={cn(
                  "flex-1 lg:flex-none lg:w-full min-w-0 p-px from-background/0 to-primary/60 rounded-lg",
                  idx % 2 === 0 ? "bg-linear-to-tr" : "bg-linear-to-tl",
                )}
                style={{ aspectRatio: "1 / 1" }}
              >
                <div className="p-8 text-center size-full items-center flex flex-col justify-center border border-background/10 rounded-lg bg-foreground">
                  <h3 className="text-[clamp(1rem,5vw,2.25rem)] font-neue-montreal">{stat.value}</h3>
                  <p className="text-[clamp(0.2rem,3vw,0.6rem)] text-background/50 font-inter">{t(stat.t)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col-reverse lg:flex-col gap-5 justify-start items-center lg:items-start w-full">
            <GithubCalendar username={extractUsername(githubUrl)} />
            <div className="flex justify-center flex-col lg:flex-row-reverse gap-2 w-full items-center">
              <div className="text-center lg:text-start">
                <h2 className="font-neue-montreal text-[clamp(1rem,5vw,2.25rem)] lg:leading-10 leading-6.5">
                  {t("basedIn", { location: LOCATION })}
                </h2>
                <h3 className="uppercase font-supply-mono text-text-light/50 text-[clamp(0.2rem,3vw,0.75rem)] mt-2">{t("availableForWorldwide")}</h3>
              </div>
              <Globe markers={[{ location: WEST_JAVA, size: 0.08 }]} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="p-px rounded-xl overflow-hidden bg-linear-to-tl from-background/0 to-background/70">
          <div className="flex flex-col lg:flex-row gap-10 p-4 border border-background/10 rounded-xl bg-foreground">
            <div className="aspect-square w-full h-auto max-w-125 lg:size-125 bg-linear-to-tr from-[#f8a271] to-[#FF652F] rounded-lg">
              <ChardyLogo className="size-full" />
            </div>
            <div className="font-neue-montreal flex flex-col justify-between mb-3 lg:my-10 gap-5">
              <h2 className="text-[clamp(1rem,5vw,2.25rem)]">{OWNER_FULLNAME}</h2>
              <RichText data={data.cardContent} className="rich-text" />
              <Link href={"/#contact-me"} className="w-fit" onClick={() => lenis?.scrollTo("#contact-me", { duration: 1.2 })}>
                <Button className="w-fit">{t("contactMe")}</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="p-px rounded-xl overflow-hidden bg-linear-to-br from-background/0 to-background/70">
          <div className="border px-6 py-10 flex flex-col lg:flex-row items-center gap-6 border-background/10 rounded-xl bg-foreground">
            <div className="shrink-0">
              <h2 className="text-[clamp(0.3rem,5vw,1rem)]">{t("toolsUsed")}</h2>
              <p className="text-[clamp(0.2rem,3vw,0.6rem)] text-background/65">{t("toolsMaster")}</p>
            </div>

            <div className="relative overflow-hidden flex-1 w-full">
              <div className="absolute left-0 top-0 h-full w-26 bg-linear-to-r from-foreground to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-26 bg-linear-to-l from-foreground to-transparent z-10 pointer-events-none" />

              <Marquee speed={20}>
                <div className="flex gap-4 pr-4 pointer-events-none">
                  {tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="flex items-center justify-center size-20 rounded-xl border border-background/10 bg-background/5 shrink-0"
                    >
                      <Image src={tool.imgUrl} alt={tool.name} width={600} height={600} className="size-14 object-contain" />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
