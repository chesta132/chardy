"use client";

import { Link } from "@/i18n/navigation";
import { Media, Project } from "@/types/payload";
import Image from "next/image";
import { useRef, useState } from "react";
import { Arrow } from "../ui/Arrow";
import { cn } from "@/libs/utils";
import { gsap } from "@/libs/gsap/register";

export function ProjectList({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cursorImgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    const el = cursorImgRef.current;
    if (!el) return;
    gsap.to(el, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.55,
      ease: "power3.out",
    });
  };

  const handleItemEnter = (i: number) => {
    setHoveredIndex(i);
    gsap.to(cursorImgRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleItemLeave = () => {
    setHoveredIndex(null);
    gsap.to(cursorImgRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.35,
      ease: "power3.in",
    });
  };

  return (
    <>
      {/* Floating cursor image */}
      <div
        ref={cursorImgRef}
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform"
        style={{ top: 0, left: 0 }}
      >
        <div className="relative w-52 h-36 rounded-xl overflow-hidden">
          {hoveredIndex !== null && (
            <Image
              key={hoveredIndex}
              src={(projects[hoveredIndex].thumbnail as Media).cloudinary?.secure_url!}
              alt={(projects[hoveredIndex].thumbnail as Media).alt}
              fill
              className="object-contain"
              sizes="208px"
            />
          )}
        </div>
      </div>

      {/* List */}
      <ul className="flex flex-col w-full" onMouseMove={handleMouseMove}>
        {projects.map((project, i) => (
          <li
            key={project.id}
            className="border-b border-foreground/10 first:border-t first:border-foreground/10"
            onMouseEnter={() => handleItemEnter(i)}
            onMouseLeave={handleItemLeave}
          >
            <Link href={`/projects/${project.id}`} className="group grid grid-cols-[36px_1fr_auto] items-center gap-5 py-5">
              {/* Index */}
              <span className="font-supply-mono text-[11px] text-foreground/35 transition-colors duration-300 group-hover:text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Name + Tags */}
              <div className="flex flex-col gap-1.5">
                <span className="font-neue-montreal text-lg font-medium text-foreground transition-colors duration-300 group-hover:text-secondary">
                  {project.title}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(({ tag }) => (
                    <span
                      key={tag}
                      className="font-supply-mono text-[10px] tracking-wider uppercase text-foreground/50 border border-foreground/20 rounded-full px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Year + Arrow */}
              <div className="flex items-center gap-4">
                <span className="font-supply-mono text-[11px] text-foreground/35 hidden sm:block">{project.year}</span>
                <Arrow
                  className={cn(
                    "fill-secondary opacity-0 -translate-x-1.5 transition-all duration-300",
                    "group-hover:opacity-100 group-hover:translate-x-0",
                  )}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
