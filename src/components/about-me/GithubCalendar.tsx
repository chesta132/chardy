"use client";

import { cn } from "@/libs/utils";
import { useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Button } from "../ui/Button";

export const GithubCalendar = ({ username }: { username: string }) => {
  const availableGhYears = new Array(5).fill(0).map((_, idx) => new Date().getFullYear() - idx);
  const [ghYear, setGhYear] = useState(availableGhYears[0]);

  return (
    <div className="flex flex-col xl:flex-row gap-2 items-center w-full">
      <div className="w-full overflow-x-auto">
        <GitHubCalendar username={username} year={ghYear} />
      </div>
      <div className="flex flex-wrap gap-5">
        {availableGhYears.map((year) => (
          <Button key={year} className={cn(year === ghYear && "bg-secondary")} onClick={() => setGhYear(year)}>
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};
