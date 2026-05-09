/**
 * Compact meta strip rendered above the main error headline.
 * Displays the variant tag and the numeric status code side-by-side,
 * mimicking the site's existing Label usage pattern.
 */

import { cn } from "@/libs/utils";
import type { ErrorVariant } from "./types";

interface ErrorMetaProps {
  variant: ErrorVariant;
  code: string;
  className?: string;
}

/** Maps each variant to a short all-caps tag shown in the meta strip */
const variantTag: Record<ErrorVariant, string> = {
  "not-found": "NOT FOUND",
  unexpected: "SERVER ERROR",
  forbidden: "FORBIDDEN",
  custom: "ERROR",
};

export const ErrorMeta = ({ variant, code, className }: ErrorMetaProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-supply-mono text-xs uppercase tracking-widest text-secondary">{variantTag[variant]}</span>
      <span className="w-px h-3 bg-foreground/30" aria-hidden="true" />
      <span className="font-supply-mono text-xs text-foreground/50 tracking-widest">HTTP {code}</span>
      <span className="w-px h-3 bg-foreground/30" aria-hidden="true" />
      <span className="font-supply-mono text-xs text-foreground/50 tracking-widest">{new Date().toLocaleString()}</span>
    </div>
  );
};
