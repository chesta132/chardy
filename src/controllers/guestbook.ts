import { getGuestbookEntries } from "@/cms/crud/read";
import { AuthMiddleware } from "@/middlewares/auth";
import { GuestbookPayload } from "@/payloads/guestbook";
import { GuestbookService } from "@/services/guestbook";
import { GuestbookEntry } from "@/types/payload";
import { ActionFunc } from "nectic/actions";
import { PaginatedDocs } from "payload";

export abstract class GuestbookController {
  static postComment: ActionFunc<[GuestbookPayload.PostEntry], [GuestbookPayload.PostEntry], GuestbookEntry> = async ({
    outcome,
    validated: [{ message }],
    ...ctx
  }) => {
    const user = AuthMiddleware.getPublicUser(ctx);
    const entry = await GuestbookService.postComment({ message, user });
    return outcome.success(entry).ok();
  };

  static getComment: ActionFunc<[GuestbookPayload.GetEntry], [], PaginatedDocs<GuestbookEntry>> = async ({ outcome }, arg) => {
    const entries = await getGuestbookEntries(arg);
    return outcome.success(entries).ok();
  };

  static updateComment: ActionFunc<[GuestbookPayload.EditEntry], [GuestbookPayload.EditEntry], GuestbookEntry | null> = async ({
    outcome,
    validated: [{ id, message }],
    ...ctx
  }) => {
    const user = AuthMiddleware.getPublicUser(ctx);
    const result = await GuestbookService.updateComment({ id, message, user });
    if (!result.success) return outcome.error(result.error).fail();
    return outcome.success(result.data).ok();
  };

  static deleteComment: ActionFunc<[GuestbookPayload.DeleteEntry], [GuestbookPayload.DeleteEntry], GuestbookEntry | null> = async ({
    outcome,
    validated: [{ id }],
    ...ctx
  }) => {
    const user = AuthMiddleware.getPublicUser(ctx);
    const result = await GuestbookService.deleteComment({ id, user });
    if (!result.success) return outcome.error(result.error).fail();
    return outcome.success(result.data).ok();
  };
}
