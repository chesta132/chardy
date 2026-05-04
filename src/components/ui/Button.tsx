import { cn } from "@/libs/utils";
import { Arrow } from "./Arrow";

export const Button = ({ children, className }: React.ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 uppercase bg-primary text-text-dark leading-4 text-xs px-4.5 py-3 rounded-lg cursor-pointer hover:scale-95 hover:bg-secondary hover:text-text-light transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]",
        className,
      )}
    >
      <span className="relative overflow-hidden flex">
        <span className="translate-y-0 group-hover:-translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] font-supply-mono">
          {children}
        </span>
        <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] font-supply-mono">
          {children}
        </span>
      </span>
      <Arrow className="group-hover:-rotate-45 group-hover:fill-text-light transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" />
    </button>
  );
};
