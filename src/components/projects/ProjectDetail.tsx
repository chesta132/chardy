import { Arrow } from "@/components/ui/Arrow";
import { RollingLabel, rollingLabelGroupClass } from "@/components/ui/Label";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Project } from "@/types/payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ErrorLayout, ErrorPageData } from "../error";
import { Main } from "../layouts/Wrapper";
import { ProjectDetailSites } from "./ProjectDetailSites";

export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("ProjectDetail");
  const error: ErrorPageData = {
    code: "500",
    title: t("invalid.title"),
    description: t("invalid.description"),
    actionLabel: t("invalid.action"),
    actionHref: "/projects",
    variant: "custom",
  };
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return <ErrorLayout data={error} />;
  if (project.screenshot && (typeof project.screenshot === "number" || !project.screenshot.cloudinary)) return <ErrorLayout data={error} />;

  return (
    <Main className="flex flex-col min-h-svh">
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
          <h1 className="font-neue-montreal text-[clamp(2rem,6vw,4rem)] font-medium uppercase leading-[1.05] tracking-tight">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-start justify-between gap-x-8 gap-y-3 border-t border-b border-foreground/10 py-4">
            {/* Left: Year + Tags */}
            <div className="flex flex-wrap items-start gap-x-8 gap-y-3 flex-1 min-w-0">
              {/* Year */}
              <div className="flex flex-col gap-1 shrink-0">
                <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("year")}</span>
                <span className="font-supply-mono text-xs text-foreground/70">{project.year}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("tags")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(({ tag }) => (
                    <span
                      key={tag}
                      className="font-supply-mono text-[10px] tracking-wider uppercase text-foreground/55 border border-foreground/20 rounded-full px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live link / Sites — always pinned to the right */}
            <div className="shrink-0">
              <ProjectDetailSites project={project} />
            </div>
          </div>
        </header>

        {/* ── Thumbnail image ── */}
        <div className="rounded-2xl overflow-hidden mb-14">
          <Image
            src={project.thumbnail.cloudinary.secure_url!}
            alt={project.thumbnail.alt}
            width={1280}
            height={720}
            className="size-full"
            priority
          />
        </div>

        {/* ── Body text ── */}
        <div className="flex flex-col gap-5 mb-14 font-neue-montreal">
          <RichText data={project.description} className="rich-text" />
        </div>

        {/* ── Screenshot / extra image — optional ── */}
        {project.screenshot && typeof project.screenshot !== "number" && (
          <div className="relative w-full rounded-2xl overflow-hidden mb-14" style={{ height: "auto" }}>
            <Image
              src={project.screenshot.cloudinary?.secure_url!}
              alt={`Screenshot of ${project.screenshot.alt}`}
              width={1280}
              height={720}
              className="w-full h-auto rounded-2xl"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}
      </article>
    </Main>
  );
}
