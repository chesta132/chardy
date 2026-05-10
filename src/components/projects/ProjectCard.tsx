"use client";

import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";
import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { FeaturedProject } from "@/types/payload";

const MAX_TAGS = 3;

export const ProjectCard = ({ span, project }: FeaturedProject) => {
  if (typeof project === "number") return null;
  if (typeof project.thumbnail === "number" || !project.thumbnail.cloudinary) return null;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    const imageWrap = imageRef.current;
    if (!card || !imageWrap) return;

    const { left, top, width, height } = card.getBoundingClientRect();

    // normalized -0.5 to 0.5
    const xNorm = (e.clientX - left) / width - 0.5;
    const yNorm = (e.clientY - top) / height - 0.5;

    gsap.to(imageWrap, {
      x: xNorm * 18, // translate X max ±9px
      y: yNorm * 14, // translate Y max ±7px
      rotateX: -yNorm * 6, // tilt X max ±3deg
      rotateY: xNorm * 6, // tilt Y max ±3deg
      scale: 1.06,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    const imageWrap = imageRef.current;
    if (!imageWrap) return;

    gsap.to(imageWrap, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
    });
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
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
      </div>

      {/* Info overlay */}
      <div className="relative z-10 flex flex-col gap-2 p-5 translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-text-light font-medium text-lg leading-tight">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 lg:opacity-0 lg:translate-y-2 transition-all duration-300 group-hover:opacity-100 translate-y-0 group-hover:translate-y-0" aria-label={`Tags: ${project.tags.slice(0, MAX_TAGS).map(t => t.tag).join(', ')}`}>
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
