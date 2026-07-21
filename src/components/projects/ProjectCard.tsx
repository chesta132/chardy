"use client";

import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRef, useEffect } from "react";
import { FeaturedProject } from "@/types/payload";
import { usePreference } from "@/contexts/Preference";

const MAX_TAGS = 3;

export const ProjectCard = (props: FeaturedProject) => {
  const { project } = props;
  const { motion } = usePreference();

  if (typeof project === "number") return null;
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;

  if (motion === "lite") {
    return <SimpleProjectCard {...props} />;
  }
  return <FullProjectCard {...props} />;
};

/** no motion, fixed */
const SimpleProjectCard = ({ span, project }: FeaturedProject) => {
  // already checked on ProjectCard but have to rewrite to shut ts
  if (typeof project === "number") return null;
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;

  return (
    <Link
      href={`/projects/${project.id}`}
      aria-label={`View project: ${project.title}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-[10px]",
        "col-span-1 h-full min-h-65",
        span === "wide" && "md:col-span-2",
        span === "full" && "md:col-span-3 md:min-h-80",
      )}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src={project.thumbnail.cloudinary.secure_url!}
          alt=""
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex flex-col gap-2 p-5">
        <h3 className="text-text-light font-medium text-lg leading-tight">{project.title}</h3>
        <div
          className="flex flex-wrap gap-1.5"
          aria-label={`Tags: ${project.tags
            .slice(0, MAX_TAGS)
            .map((t) => t.tag)
            .join(", ")}`}
        >
          {project.tags.slice(0, MAX_TAGS).map(({ tag }) => (
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

const FullProjectCard = ({ span, project }: FeaturedProject) => {
  // already checked on ProjectCard but have to rewrite to shut ts
  if (typeof project === "number") return null;
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;

  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // quickTo refs, reused on every mousemove
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleXTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const el = imageRef.current;
    if (!el) return;
    xTo.current = gsap.quickTo(el, "x", { duration: 0.5, ease: "power2.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.5, ease: "power2.out" });
    rotateXTo.current = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
    rotateYTo.current = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
    scaleXTo.current = gsap.quickTo(el, "scaleX", { duration: 0.5, ease: "power2.out" });
    scaleYTo.current = gsap.quickTo(el, "scaleY", { duration: 0.5, ease: "power2.out" });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();

    // normalized -0.5 to 0.5
    const xNorm = (e.clientX - left) / width - 0.5;
    const yNorm = (e.clientY - top) / height - 0.5;

    xTo.current?.(xNorm * 18);
    yTo.current?.(yNorm * 14);
    rotateXTo.current?.(-yNorm * 6);
    rotateYTo.current?.(xNorm * 6);
    scaleXTo.current?.(1.06);
    scaleYTo.current?.(1.06);
  };

  const handleMouseLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
    scaleXTo.current?.(1);
    scaleYTo.current?.(1);
  };

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`View project: ${project.title}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-[10px]",
        "transition-transform duration-500 ease-out hover:scale-[0.985]",
        "col-span-1 h-full min-h-65",
        span === "wide" && "md:col-span-2",
        span === "full" && "md:col-span-3 md:min-h-80",
      )}
    >
      {/* Image container */}
      <div ref={imageRef} className="absolute inset-0 z-0 will-change-transform" aria-hidden="true">
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
      <div className="relative z-10 flex flex-col gap-2 p-5 translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-text-light font-medium text-lg leading-tight">{project.title}</h3>
        <div
          className="flex flex-wrap gap-1.5 lg:opacity-0 lg:translate-y-2 transition-all duration-300 group-hover:opacity-100 translate-y-0 group-hover:translate-y-0"
          aria-label={`Tags: ${project.tags
            .slice(0, MAX_TAGS)
            .map((t) => t.tag)
            .join(", ")}`}
        >
          {project.tags.slice(0, MAX_TAGS).map(({ tag }) => (
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
