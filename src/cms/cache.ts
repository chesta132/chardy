import { revalidatePathsAction, updateTagsAction } from "@/actions/cache";
import { isDevEnv } from "@/config";
import { nectAction } from "nectic/actions";
import { unstable_cache } from "next/cache";

export const withCache = <T>(cb: () => Promise<T>, keyParts?: string[], options?: { revalidate?: number | false; tags?: string[] }) => {
  if (isDevEnv()) {
    return () => cb();
  }
  return unstable_cache(cb, keyParts, options);
};

/** server-side updateTag with multiple action at once */
export const updateTags = nectAction(updateTagsAction);

/** server-side revalidatePath with multiple action at once */
export const revalidatePaths = nectAction(revalidatePathsAction);
