"use client";

import { cn } from "@/libs/utils";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Loading } from "../ui/Loading";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";

const GitHubCalendar = dynamic(async () => (await import("react-github-calendar")).GitHubCalendar, {
  ssr: false,
  loading: () => <Loading />,
});

export const GithubCalendar = ({ username }: { username: string }) => {
  const availableGhYears = new Array(5).fill(0).map((_, idx) => new Date().getFullYear() - idx);
  const [ghYear, setGhYear] = useState(availableGhYears[0]);

  return (
    <div className="flex flex-col gap-4 w-fit min-w-0 max-w-full">
      <div className="flex justify-between items-center gap-4 sm:gap-8">
        <h3 className="font-neue-montreal text-lg whitespace-nowrap">Contribution Graph</h3>
        <div className="flex overflow-x-auto border rounded-md border-primary/30">
          {availableGhYears.map((year, idx) => (
            <button
              key={year}
              className={cn(
                rollingLabelGroupClass,
                "px-3 py-1 cursor-pointer hover:bg-primary/20 hover:text-text-light border-r border-primary/30",
                year === ghYear && "bg-primary text-text-dark",
                idx === availableGhYears.length - 1 && "border-none",
              )}
              onClick={() => setGhYear(year)}
            >
              <RollingLabel>{year}</RollingLabel>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto min-w-0">
        <GitHubCalendar username={username} year={ghYear} />
      </div>
    </div>
  );
};
