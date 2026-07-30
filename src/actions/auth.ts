"use server";

import { db } from "@/libs/db";
import { AuthPublicUserSafe } from "@/types/auth";
import { createNectAction } from "nectic/actions";

export const getPublicUsersAction = createNectAction().handle(async ({ outcome }, ids: string[]) => {
  const users = await db.query.users.findMany({
    where: (users, { inArray }) => inArray(users.id, ids),
    columns: { image: true, name: true, id: true },
  });
  return outcome.success(users satisfies AuthPublicUserSafe[]).ok();
});
