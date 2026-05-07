"use client";

import { Arrow } from "@/components/ui/Arrow";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

// TODO: this page still using dummy data
// structure (not UI) may be different after applies payload CMS

type Project = {
  name: string;
  tags: string[];
  href: string;
  year: string;
  image: string | StaticImageData;
  category: "web-dev" | "design" | "mobile";
};

const PROJECTS: Project[] = [
  {
    name: "Project One",
    tags: ["Web Development", "TypeScript"],
    href: "/projects/project-1",
    year: "2024",
    image: "/placeholder.jpg",
    category: "web-dev",
  },
  {
    name: "Project Two",
    tags: ["Web Design", "UI/UX"],
    href: "/projects/project-2",
    year: "2024",
    image: "/placeholder.jpg",
    category: "design",
  },
  {
    name: "Project Three",
    tags: ["Mobile App", "React Native"],
    href: "/projects/project-3",
    year: "2023",
    image: "/placeholder.jpg",
    category: "mobile",
  },
  {
    name: "Project Four",
    tags: ["Brand Identity", "Web Design"],
    href: "/projects/project-4",
    year: "2023",
    image: "/placeholder.jpg",
    category: "design",
  },
  {
    name: "Project Five",
    tags: ["Web Development", "Next.js"],
    href: "/projects/project-5",
    year: "2023",
    image: "/placeholder.jpg",
    category: "web-dev",
  },
];

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Web Dev", value: "web-dev" },
  { label: "Design", value: "design" },
  { label: "Mobile", value: "mobile" },
] as const;

function ProjectList({ projects }: { projects: Project[] }) {
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
              src={projects[hoveredIndex].image}
              alt={projects[hoveredIndex].name}
              fill
              className="object-cover"
              sizes="208px"
            />
          )}
        </div>
      </div>

      {/* List */}
      <ul className="flex flex-col w-full" onMouseMove={handleMouseMove}>
        {projects.map((project, i) => (
          <li
            key={project.href}
            className="border-b border-foreground/10 first:border-t first:border-foreground/10"
            onMouseEnter={() => handleItemEnter(i)}
            onMouseLeave={handleItemLeave}
          >
            <Link href={project.href} className="group grid grid-cols-[36px_1fr_auto] items-center gap-5 py-5">
              {/* Index */}
              <span className="font-supply-mono text-[11px] text-foreground/35 transition-colors duration-300 group-hover:text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Name + Tags */}
              <div className="flex flex-col gap-1.5">
                <span className="font-neue-montreal text-lg font-medium text-foreground transition-colors duration-300 group-hover:text-secondary">
                  {project.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
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

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <main className="flex flex-col min-h-svh px-5 pt-32 pb-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <h2 className="font-supply-mono text-text-dark/60 flex items-center gap-2 uppercase text-xs tracking-widest">
          <Arrow className="rotate-90 fill-text-dark/60" />
          ( Projects )
          <Arrow className="rotate-90 fill-text-dark/60" />
        </h2>
        <h1 className="font-neue-montreal text-[clamp(1.8rem,5vw,3.75rem)] font-medium uppercase text-center leading-[1.1] tracking-tight">
          Every Project
          <br />
          Across Experiences
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "font-supply-mono text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full border transition-all duration-300",
              activeFilter === f.value
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground/60 border-foreground/25 hover:border-foreground/50 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-foreground/10 mb-0" />

      {/* List */}
      <ProjectList projects={filtered} />

      {/* Count */}
      <p className="font-supply-mono text-[10px] text-foreground/35 mt-6 tracking-widest">
        — {String(filtered.length).padStart(2, "0")} projects total
      </p>
    </main>
  );
}
