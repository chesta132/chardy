import { Arrow } from "@/components/ui/Arrow";
import { RollingLabel, rollingLabelGroupClass } from "@/components/ui/Label";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Media, Project } from "@/types/payload";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";

export function ProjectDetail({ project, nextId, prevId }: { project: Project; prevId: number | null; nextId: number | null }) {
  const t = useTranslations("ProjectDetail");
  // TODO: proper error page
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return notFound();
  if (project.screenshot && (typeof project.screenshot === "number" || !project.screenshot.cloudinary)) return notFound();

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
          <h1 className="font-neue-montreal text-[clamp(2rem,6vw,4rem)] font-medium uppercase leading-[1.05] tracking-tight">{project.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-b border-foreground/10 py-4">
            {/* Year */}
            <div className="flex flex-col gap-1">
              <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("year")}</span>
              <span className="font-supply-mono text-xs text-foreground/70">{project.year}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
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

            {/* Live link — optional */}
            {project.liveSite && (
              <div className="flex flex-col gap-1 ml-auto">
                <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("live")}</span>
                <a
                  href={project.liveSite}
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
          <Image
            src={project.thumbnail.cloudinary.secure_url!}
            alt={project.thumbnail.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>

        {/* ── Body text ── */}
        {/* TODO: swap <p> with rich text renderer from Payload */}
        <div className="flex flex-col gap-5 mb-14 font-neue-montreal">
          <RichText data={project.description} />
        </div>

        {/* ── Screenshot / extra image — optional ── */}
        {project.screenshot && (
          <div className="relative w-full rounded-2xl overflow-hidden mb-14" style={{ height: "auto" }}>
            <Image
              src={(project.screenshot as Media).cloudinary?.secure_url!}
              alt={`Screenshot of ${(project.screenshot as Media).alt}`}
              width={1280}
              height={720}
              className="w-full h-auto rounded-2xl"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* ── Prev / Next nav placeholder ── */}
        <div className="flex justify-between items-center border-t border-foreground/10 py-8 mb-0">
          {prevId !== null ? (
            <Link
              href={`/projects/${prevId}`}
              className={cn("flex items-center gap-2 text-foreground/40 hover:text-secondary transition-colors duration-300", rollingLabelGroupClass)}
            >
              <Arrow className="rotate-180 fill-foreground/40 group-hover:fill-secondary transition-colors duration-300" />
              <RollingLabel className="font-supply-mono text-[10px] tracking-widest uppercase">{t("prevProject")}</RollingLabel>
            </Link>
          ) : (
            // justify between trigger
            <div></div>
          )}

          {nextId !== null ? (
            <Link
              href={`/projects/${nextId}`}
              className={cn("flex items-center gap-2 text-foreground/40 hover:text-secondary transition-colors duration-300", rollingLabelGroupClass)}
            >
              <RollingLabel className="font-supply-mono text-[10px] tracking-widest uppercase">{t("nextProject")}</RollingLabel>
              <Arrow className="fill-foreground/40 group-hover:fill-secondary transition-colors duration-300" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </article>
    </main>
  );
}
