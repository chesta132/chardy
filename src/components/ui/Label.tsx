import { cn } from "@/libs/utils";

export const rollingLabelGroupClass = "group duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]";
export const RollingLabel = ({
  children,
  className,
  idleSpan,
  activeSpan,
  placeholder,
  ...props
}: React.ComponentProps<"span"> & {
  idleSpan?: React.ComponentProps<"span">;
  activeSpan?: React.ComponentProps<"span">;
  placeholder?: React.ReactNode;
}) => {
  return (
    <span className={cn("relative overflow-hidden flex", className)} {...props}>
      <span
        {...idleSpan}
        className={cn(
          "translate-y-0 group-hover:-translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] font-supply-mono",
          idleSpan?.className,
        )}
      >
        {placeholder || children}
      </span>
      <span
        {...activeSpan}
        className={cn(
          "absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] font-supply-mono",
          activeSpan?.className,
        )}
      >
        {children}
      </span>
    </span>
  );
};
