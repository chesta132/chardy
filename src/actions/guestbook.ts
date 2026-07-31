"use server";

import { GuestbookController } from "@/controllers/guestbook";
import { AuthMiddleware } from "@/middlewares/auth";
import { GuestbookPayload } from "@/payloads/guestbook";
import { createNectAction } from "nectic/actions";

export const postGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.postEntry])
  .use(AuthMiddleware.protectPublicUser)
  .handle(GuestbookController.postComment);

export const getGuestbookEntriesAction = createNectAction().handle(GuestbookController.getComment);

export const updateGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.editEntry])
  .use(AuthMiddleware.protectPublicUser)
  .handle(GuestbookController.updateComment);

export const deleteGuestbookEntryAction = createNectAction()
  .validate([GuestbookPayload.deleteEntry])
  .use(AuthMiddleware.protectPublicUser)
  .handle(GuestbookController.deleteComment);
