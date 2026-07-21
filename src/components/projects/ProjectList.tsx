"use client";

import { Link } from "@/i18n/navigation";
import { Media, Project } from "@/types/payload";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Arrow } from "../ui/Arrow";
import { cn } from "@/libs/utils";
import { gsap } from "@/libs/gsap/register";
import { usePreference } from "@/contexts/Preference";

const MAX_TAGS = 5;

export function ProjectList({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const cursorImgRef = useRef<HTMLDivElement>(null);
  const { motion } = usePreference();

  // quickTo reuses a single tween instead of creating new ones every mousemove
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!cursorImgRef.current) return;
    xTo.current = gsap.quickTo(cursorImgRef.current, "x", { duration: 0.55, ease: "power3.out" });
    yTo.current = gsap.quickTo(cursorImgRef.current, "y", { duration: 0.55, ease: "power3.out" });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (motion === "full") {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    }
  };

  const handleItemEnter = (i: number) => {
    setHoveredIndex(i);
    if (motion === "full") {
      gsap.to(cursorImgRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  };

  const handleItemLeave = () => {
    setHoveredIndex(null);
    if (motion === "full") {
      gsap.to(cursorImgRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.35,
        ease: "power3.in",
      });
    }
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
          {hoveredIndex !== null && motion === "full" && (
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
                  {project.tags.slice(0, MAX_TAGS).map(({ tag }) => (
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
                {hoveredIndex === i && motion === "reduce" && (
                  <div className="relative w-24 h-13.5 hidden md:block overflow-hidden rounded-lg animate-fade-in-right">
                    <Image
                      key={hoveredIndex}
                      src={(projects[hoveredIndex].thumbnail as Media).cloudinary?.secure_url!}
                      alt={(projects[hoveredIndex].thumbnail as Media).alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
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
