import type { ErrorVariant } from "./types";

/**
 * Static config for each error variant.
 *
 * `namespace` must match the keys defined in the messages/*.json files
 * so the translation hook can resolve the right strings.
 */
export const errorConfig: Record<
  ErrorVariant,
  {
    namespace: string;
    /** Fallback code rendered when the translation layer is unavailable */
    defaultCode: string;
  }
> = {
  "not-found": {
    namespace: "Error.Pages.NotFound",
    defaultCode: "404",
  },
  unexpected: {
    namespace: "Error.Pages.Unexpected",
    defaultCode: "500",
  },
  forbidden: {
    namespace: "Error.Pages.Forbidden",
    defaultCode: "403",
  },
  custom: {
    namespace: "Error.Pages.Custom",
    defaultCode: "???",
  },
};
