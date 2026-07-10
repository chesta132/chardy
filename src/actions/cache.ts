"use server";

import { createNectAction } from "nectic/actions";
import { updateTag, revalidatePath, revalidateTag } from "next/cache";

export const updateTagsAction = createNectAction().handle(({ outcome }, ...tags: string[]) => {
  tags.forEach((t) => {
    // idk why updateTag won't work
    // updateTag(t);
    revalidateTag(t, { expire: 0 });
  });
  return outcome.success(undefined as void).ok();
});

type RevalidatePathProps = [originalPath: string, type?: "layout" | "page"];
export const revalidatePathsAction = createNectAction().handle(({ outcome }, ...props: RevalidatePathProps[]) => {
  props.forEach((props) => revalidatePath(...props));
  return outcome.success(undefined as void).ok();
});
