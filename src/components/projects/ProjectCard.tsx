"use client";

import { cn } from "@/libs/utils";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { FeaturedProject } from "@/types/payload";
import { usePreference } from "@/contexts/Preference";
import { useTiltEffect } from "@/hooks/useTiltEffect";

const MAX_TAGS = 3;

type ValidProject = Extract<FeaturedProject["project"], { id: unknown }>;

type ProjectCardBaseProps = {
  span: FeaturedProject["span"];
  project: ValidProject;
  animated: boolean;
};

export const ProjectCard = (props: FeaturedProject) => {
  const { project } = props;
  const { motion } = usePreference();

  if (typeof project === "number") return null;
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;

  return <ProjectCardBase span={props.span} project={project} animated={motion !== "lite"} />;
};

const ProjectCardBase = ({ span, project, animated }: ProjectCardBaseProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { onMouseMove, onMouseLeave } = useTiltEffect(imageRef);

  // thumbnail already validated by ProjectCard, but narrow again to shut ts
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;

  const tags = project.tags.slice(0, MAX_TAGS);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.id}`}
      aria-label={`View project: ${project.title}`}
      onMouseMove={animated ? (e) => onMouseMove(e, cardRef) : undefined}
      onMouseLeave={animated ? onMouseLeave : undefined}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-[10px]",
        "col-span-1 h-full min-h-65",
        animated && "transition-transform duration-500 ease-out hover:scale-[0.985]",
        span === "wide" && "md:col-span-2",
        span === "full" && "md:col-span-3 md:min-h-80",
      )}
    >
      {/* Image container */}
      <div ref={imageRef} className={cn("absolute inset-0 z-0", animated && "will-change-transform")} aria-hidden="true">
        <Image
          src={project.thumbnail.cloudinary.secure_url!}
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
      </div>

      {/* Info overlay */}
      <div
        className={cn(
          "relative z-10 flex flex-col gap-2 p-5",
          animated && "translate-y-1 transition-transform duration-300 group-hover:translate-y-0",
        )}
      >
        <h3 className="text-text-light font-medium text-lg leading-tight">{project.title}</h3>
        <div
          className={cn(
            "flex flex-wrap gap-1.5",
            animated &&
              "lg:opacity-0 lg:translate-y-2 transition-all duration-300 group-hover:opacity-100 translate-y-0 group-hover:translate-y-0",
          )}
          aria-label={`Tags: ${tags.map((t) => t.tag).join(", ")}`}
        >
          {tags.map(({ tag }) => (
            <span
              key={tag}
              className="text-[11px] text-text-light/90 bg-background/15 backdrop-blur-sm border border-background/10 rounded-md px-2.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
