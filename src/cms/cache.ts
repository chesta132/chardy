import { isDevEnv } from "@/config";
import { unstable_cache } from "next/cache";

export const withCache = <T>(cb: () => Promise<T>, keyParts?: string[], options?: { revalidate?: number | false; tags?: string[] }) => {
  if (isDevEnv()) {
    return () => cb();
  }
  return unstable_cache(cb, keyParts, options);
};
