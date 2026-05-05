import Link from "next/link";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { cn } from "@/libs/utils";
import { ProjectCard, FeaturedProject } from "../projects/ProjectCard";

// TODO: fetch real data from Payload CMS
const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    name: "Project 1",
    tags: ["Web Development", "TypeScript"],
    href: "/projects/project-1",
    image: "/placeholder.jpg",
    span: "wide",
  },
  {
    name: "Project 2",
    tags: ["Web Design & Development", "UI/UX"],
    href: "/projects/project-2",
    image: "/placeholder.jpg",
    span: "normal",
  },
  {
    name: "Project 5",
    tags: ["Brand Identity", "Web Design & Development"],
    href: "/projects/project-5",
    image: "/placeholder.jpg",
    span: "full",
  },
  {
    name: "Project 3",
    tags: ["Mobile App", "React Native"],
    href: "/projects/project-3",
    image: "/placeholder.jpg",
    span: "normal",
  },
  {
    name: "Project 4",
    tags: ["Web Development", "TypeScript"],
    href: "/projects/project-4",
    image: "/placeholder.jpg",
    span: "wide",
  },
];

export const FeaturedProjects = () => {
  return (
    <section className="flex flex-col gap-8 py-16 px-2 md:px-4 w-full">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        <h2 className="text-[clamp(2rem,5vw,3.75rem)] leading-[1.1] font-neue-montreal">Featured Projects</h2>
        <Link href="/projects" className={cn("text-foreground hover:text-secondary", rollingLabelGroupClass)}>
          <RollingLabel>View All</RollingLabel>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[360px_360px_520px] auto-rows-[260px] gap-4 w-full">
        {FEATURED_PROJECTS.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
};
