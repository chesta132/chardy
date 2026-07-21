import { cn } from "@/libs/utils";
import { Arrow } from "./Arrow";
import { RollingLabel } from "./Label";

export const Button = ({
  children,
  className,
  withoutArrow,
  placeholder,
  ...props
}: React.ComponentProps<"button"> & { withoutArrow?: boolean; placeholder?: React.ReactNode }) => {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 uppercase bg-primary text-text-dark leading-4 text-xs px-4.5 py-3 rounded-lg cursor-pointer hover:scale-95 hover:bg-secondary hover:text-text-light transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <RollingLabel placeholder={placeholder}>{children}</RollingLabel>
      {!withoutArrow && (
        <Arrow className="group-hover:-rotate-45 group-hover:fill-text-light transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]" />
      )}
    </button>
  );
};
