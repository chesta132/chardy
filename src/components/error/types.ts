/**
 * Variants of error pages the app can render.
 * Extend this union whenever a new error scenario is needed.
 */
export type ErrorVariant = "not-found" | "unexpected" | "forbidden" | "custom";

/**
 * Data contract consumed by the error page components.
 * `code` and `description` come from the translation layer,
 * while `variant` drives which visual treatment is applied.
 */
export interface ErrorPageData {
  variant: ErrorVariant;
  /** Short HTTP-like status code shown prominently, e.g. "404" */
  code: string;
  /** Human-readable headline */
  title: string;
  /** One-liner that gives context about what went wrong */
  description: string;
  /** Optional action label — falls back to a sensible default when omitted */
  actionLabel?: string;
  /** Optional href the action button points to — defaults to "/" */
  actionHref?: string;
}
