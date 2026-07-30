"use server";

import { ActionMiddlewareFunc, createNectAction, OutcomeSendResult } from "nectic/actions";
import { getPayload } from "payload";
import config from "@/payload.config";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { GuestbookPayload } from "@/payloads/guestbook";
import { getGuestbookEntries } from "@/cms/crud/read";
import { AuthPublicUser } from "@/types/auth";
import { captureException } from "@sentry/nextjs";
import { GuestbookEntry } from "@/types/payload";

const authMw: ActionMiddlewareFunc<[unknown]> = async ({ next, outcome, ...ctx }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return outcome.error({ code: "UNAUTHORIZED", message: "Invalid session" }).fail();
  }
  ctx.set("user", session.user satisfies AuthPublicUser);
  return next();
};

export const postGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.postEntry])
  .use(authMw)
  .handle(async ({ outcome, validated: [{ message }], ...ctx }) => {
    const payload = await getPayload({ config });
    const user = ctx.get("user") as AuthPublicUser;

    const entry = await payload.create({
      collection: "guestbook-entry",
      data: {
        isAdmin: user.isAdmin,
        message,
        pinned: false,
        userId: user.id,
      },
    });

    return outcome.success(entry).ok();
  });

export const updateGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.editEntry])
  .use(authMw)
  .handle(async ({ outcome, validated: [{ message, id }], ...ctx }) => {
    const payload = await getPayload({ config });
    const user = ctx.get("user") as AuthPublicUser;

    const entry = await payload.update({
      collection: "guestbook-entry",
      data: {
        message,
      },
      where: { id: { equals: id }, userId: { equals: user.id } },
    });

    if (entry.errors.length) {
      captureException(entry.errors);
      return outcome.error({ code: "NOT_FOUND", message: "Comment not found" }).fail() as OutcomeSendResult<GuestbookEntry | null>;
    }

    return outcome.success<GuestbookEntry | null>(entry.docs[0] || null).ok();
  });

export const getGuestbookEntriesAction = createNectAction().handle(async ({ outcome }, arg: { limit?: number; page?: number } = {}) => {
  const entries = await getGuestbookEntries(arg);
  return outcome.success(entries).ok();
});

export const deleteGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.deleteEntry])
  .use(authMw)
  .handle(async ({ outcome, validated: [{ id }], ...ctx }) => {
    const payload = await getPayload({ config });
    const user = ctx.get("user") as AuthPublicUser;

    const entry = await payload.delete({
      collection: "guestbook-entry",
      where: { id: { equals: id }, userId: { equals: user.id } },
    });

    if (entry.errors.length) {
      captureException(entry.errors);
      return outcome.error({ code: "NOT_FOUND", message: "Comment not found" }).fail() as OutcomeSendResult<GuestbookEntry | null>;
    }

    return outcome.success<GuestbookEntry | null>(entry.docs[0] || null).ok();
  });
