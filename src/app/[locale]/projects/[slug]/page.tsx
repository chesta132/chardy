import { Arrow } from "@/components/ui/Arrow";
import { RollingLabel, rollingLabelGroupClass } from "@/components/ui/Label";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type ProjectDetail = {
  name: string;
  year: string;
  tags: string[];
  live?: string;
  thumbnail: string;
  screenshot?: string;
};

// TODO: fetch from Payload CMS
const PROJECT: ProjectDetail = {
  name: "Project One",
  year: "2024",
  tags: ["Web Development", "TypeScript", "Next.js"],
  live: "https://example.com",
  thumbnail: "/placeholder.jpg",
  screenshot: "/placeholder.jpg",
};

export default function ProjectDetailPage() {
  const t = useTranslations("ProjectDetail");

  return (
    <main className="flex flex-col min-h-svh">
      <article className="flex flex-col flex-1 px-5 md:px-10 lg:px-20 pt-32 pb-0 max-w-4xl mx-auto w-full">
        {/* Back link */}
        <Link
          href="/projects"
          className={cn(
            "flex items-center gap-2 w-fit mb-12 text-foreground/40 hover:text-secondary transition-colors duration-300",
            rollingLabelGroupClass,
          )}
        >
          <Arrow className="rotate-180 fill-foreground/40 group-hover:fill-secondary transition-colors duration-300" />
          <RollingLabel className="font-supply-mono text-[10px] tracking-widest uppercase">{t("allProjects")}</RollingLabel>
        </Link>

        {/* ── Header ── */}
        <header className="flex flex-col gap-6 mb-14">
          {/* Name */}
          <h1 className="font-neue-montreal text-[clamp(2rem,6vw,4rem)] font-medium uppercase leading-[1.05] tracking-tight">{PROJECT.name}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-b border-foreground/10 py-4">
            {/* Year */}
            <div className="flex flex-col gap-1">
              <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("year")}</span>
              <span className="font-supply-mono text-xs text-foreground/70">{PROJECT.year}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("tags")}</span>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-supply-mono text-[10px] tracking-wider uppercase text-foreground/55 border border-foreground/20 rounded-full px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Live link — optional */}
            {PROJECT.live && (
              <div className="flex flex-col gap-1 ml-auto">
                <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("live")}</span>
                <a
                  href={PROJECT.live}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "flex items-center gap-1.5 font-supply-mono text-[10px] tracking-wider uppercase text-secondary hover:underline underline-offset-4",
                    rollingLabelGroupClass,
                  )}
                >
                  <RollingLabel>{t("visitSite")}</RollingLabel>
                  <Arrow className="fill-secondary -rotate-45" />
                </a>
              </div>
            )}
          </div>
        </header>

        {/* ── Thumbnail image ── */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-14">
          <Image src={PROJECT.thumbnail} alt={PROJECT.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" priority />
        </div>

        {/* ── Body text ── */}
        {/* TODO: swap <p> with rich text renderer from Payload */}
        <div className="flex flex-col gap-5 mb-14">
          <p className="font-neue-montreal text-base md:text-lg text-foreground/80 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula diam at felis tincidunt, vitae condimentum libero gravida. Donec
            euismod nisl vel nisl faucibus, eget tincidunt justo fermentum. Cras sit amet tristique lorem, a cursus felis.
          </p>
          <p className="font-neue-montreal text-base md:text-lg text-foreground/80 leading-relaxed">
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut venenatis, nisl at facilisis convallis,
            urna nisl cursus libero, ac pretium urna sapien sit amet justo. Vivamus efficitur eros ut ligula sodales, vel vestibulum magna lacinia.
          </p>
          <p className="font-neue-montreal text-base md:text-lg text-foreground/80 leading-relaxed">
            Fusce vel nisi id dui ultricies dapibus. Sed interdum, est vitae fermentum fermentum, sapien lorem suscipit orci, at tristique augue nisl
            in risus. Praesent pharetra sapien vitae ligula pretium, nec suscipit eros cursus.
          </p>
        </div>

        {/* ── Screenshot / extra image — optional ── */}
        {PROJECT.screenshot && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-14">
            <Image
              src={PROJECT.screenshot}
              alt={`${PROJECT.name} screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* ── Prev / Next nav placeholder ── */}
        {/* TODO: project link from Payload */}
        <div className="flex justify-between items-center border-t border-foreground/10 py-8 mb-0">
          <Link
            href="/projects"
            className={cn("flex items-center gap-2 text-foreground/40 hover:text-secondary transition-colors duration-300", rollingLabelGroupClass)}
          >
            <Arrow className="rotate-180 fill-foreground/40 group-hover:fill-secondary transition-colors duration-300" />
            <RollingLabel className="font-supply-mono text-[10px] tracking-widest uppercase">{t("prevProject")}</RollingLabel>
          </Link>

          <Link
            href="/projects"
            className={cn("flex items-center gap-2 text-foreground/40 hover:text-secondary transition-colors duration-300", rollingLabelGroupClass)}
          >
            <RollingLabel className="font-supply-mono text-[10px] tracking-widest uppercase">{t("nextProject")}</RollingLabel>
            <Arrow className="fill-foreground/40 group-hover:fill-secondary transition-colors duration-300" />
          </Link>
        </div>
      </article>
    </main>
  );
}
