"use client";

import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/libs/utils";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ProjectList } from "./ProjectList";
import { Project } from "@/types/payload";
import { Main } from "../layouts/Wrapper";
import { TagInput } from "../ui/TagInput";

export function ProjectListPage({ projects }: { projects: Project[] }) {
  const t = useTranslations("Projects");
  const [activeFilter, setActiveFilter] = useState(new Set<string>());

  // tags to filter, sorted from the most frequently appearing
  const filters = useMemo(() => {
    const tags = projects.flatMap((p) => p.tags.map((t) => t.tag));
    const counts = tags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const sorted = Object.keys(counts).sort((a, b) => {
      return counts[b] - counts[a]; // Sort descending
    });

    return [...new Set(sorted)];
  }, [projects]);

  const filtered = useMemo(() => {
    const valid = projects.filter((p) => typeof p.thumbnail !== "number" && p.thumbnail.cloudinary);
    return activeFilter.size === 0 ? valid : valid.filter((p) => p.tags.some((t) => activeFilter.has(t.tag)));
  }, [projects, activeFilter]);

  return (
    <Main className="flex flex-col min-h-svh px-5 pt-32 pb-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <h2 className="font-supply-mono text-text-dark/60 flex items-center gap-2 uppercase text-xs tracking-widest">
          <Arrow className="rotate-90 fill-text-dark/60" />( {t("projects")} )
          <Arrow className="rotate-90 fill-text-dark/60" />
        </h2>
        <h1 className="font-neue-montreal text-[clamp(1.8rem,5vw,3.75rem)] font-medium uppercase text-center leading-[1.1] tracking-tight whitespace-pre-wrap">
          {t("title")}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6" role="group" aria-label={"Filter projects by tag"}>
        <TagInput options={filters} onChange={(tags) => setActiveFilter(new Set(tags))} value={[...activeFilter]} placeholder="Filter" />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-foreground/10 mb-0" />

      {/* Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Showing ${filtered.length} project${filtered.length !== 1 ? "s" : ""}${activeFilter.size > 0 ? ` tagged ${activeFilter}` : ""}`}
      </div>

      {/* List */}
      <ProjectList projects={filtered} />

      {/* Count */}
      <p className="font-supply-mono text-[10px] text-foreground/35 mt-6 tracking-widest">
        {t("total", { count: String(filtered.length).padStart(2, "0") })}
      </p>
    </Main>
  );
}
