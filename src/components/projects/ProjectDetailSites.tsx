"use client";

import { Project } from "@/types/payload";
import { useTranslations } from "next-intl";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { cn } from "@/libs/utils";
import { Arrow } from "../ui/Arrow";
import { Button } from "../ui/Button";
import { useState, useRef, useEffect } from "react";
import { gsap } from "@/libs/gsap/register";

export const ProjectDetailSites = ({ project }: { project: Project }) => {
  const t = useTranslations("ProjectDetail");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLAnchorElement[]>([]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP open/close animation
  useEffect(() => {
    const menu = menuRef.current;
    const items = itemsRef.current;

    if (!menu) return;

    if (open) {
      gsap.set(menu, { display: "flex", transformOrigin: "top right" });
      gsap.fromTo(
        menu,
        { opacity: 0, scaleY: 0.7, scaleX: 0.95, y: -8 },
        {
          opacity: 1,
          scaleY: 1,
          scaleX: 1,
          y: 0,
          duration: 0.45,
          ease: "expo.out",
        },
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: -6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "expo.out",
          stagger: 0.05,
          delay: 0.1,
        },
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        scaleY: 0.8,
        y: -6,
        duration: 0.3,
        ease: "expo.in",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
  }, [open]);

  if (!project.sites || project.sites.length === 0) return null;

  return (
    <>
      {project.sites.length === 1 && (
        <div className="flex flex-col gap-1 ml-auto">
          <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">{t("siteLabel", { count: 1 })}</span>
          <a
            href={project.sites[0].site.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.sites[0].site.label} (opens in new tab)`}
            className={cn(
              "flex items-center gap-1.5 font-supply-mono text-[10px] tracking-wider uppercase text-secondary hover:underline underline-offset-4",
              rollingLabelGroupClass,
            )}
          >
            <RollingLabel>{project.sites[0].site.label}</RollingLabel>
            <Arrow className="fill-secondary -rotate-45" aria-hidden="true" />
          </a>
        </div>
      )}

      {project.sites.length > 1 && (
        <div ref={dropdownRef} className="relative flex flex-col gap-1 ml-auto">
          <span className="font-supply-mono text-[9px] tracking-widest uppercase text-foreground/35">
            {t("siteLabel", { count: project.sites.length })}
          </span>

          <Button withoutArrow onClick={() => setOpen((prev) => !prev)}>
            {t("site", { count: project.sites.length })}
          </Button>

          <div
            ref={menuRef}
            style={{ display: "none" }}
            className="absolute top-full right-0 mt-2 z-50 min-w-40 flex-col overflow-hidden rounded-lg border border-foreground/10 bg-primary shadow-lg"
          >
            {project.sites.map((entry, i) => (
              <a
                key={i}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
                href={entry.site.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${entry.site.label} (opens in new tab)`}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center justify-between gap-3 px-4 py-3",
                  "font-supply-mono text-[10px] tracking-wider uppercase text-foreground/70",
                  "hover:bg-secondary hover:text-text-light transition-colors duration-300",
                  "border-b border-foreground/10 last:border-b-0",
                  rollingLabelGroupClass,
                )}
              >
                <RollingLabel>{entry.site.label}</RollingLabel>
                <Arrow className="group-hover:-rotate-45 group-hover:fill-text-light transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
