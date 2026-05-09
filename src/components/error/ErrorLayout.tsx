/**
 * The main layout shell for every error page variant.
 * Accepts a fully-resolved ErrorPageData object so the rendering
 * layer stays decoupled from translation concerns.
 */

import { ErrorCode } from "./ErrorCode";
import { ErrorMeta } from "./ErrorMeta";
import { ErrorAction } from "./ErrorAction";
import type { ErrorPageData } from "./types";

interface ErrorLayoutProps {
  data: ErrorPageData;
}

export const ErrorLayout = ({ data }: ErrorLayoutProps) => {
  const { variant, code, title, description, actionLabel, actionHref = "/" } = data;

  return (
    <section className="relative min-h-dvh flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
      {/* Background code watermark — purely decorative */}
      <ErrorCode code={code} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[10%] pointer-events-none" />

      <div className="relative z-10 max-w-xl flex flex-col gap-8">
        {/* Variant + status code strip */}
        <ErrorMeta variant={variant} code={code} />

        {/* Main content */}
        <div className="flex flex-col gap-4">
          <h1 className="font-neue-montreal text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05] text-foreground tracking-tight">{title}</h1>
          <p className="font-inter text-base text-foreground/60 leading-relaxed max-w-sm">{description}</p>
        </div>

        {/* CTA */}
        {actionLabel && <ErrorAction label={actionLabel} href={actionHref} />}
      </div>

      {/* Subtle horizontal rule anchored to the bottom edge */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-foreground/10" />
    </section>
  );
};
