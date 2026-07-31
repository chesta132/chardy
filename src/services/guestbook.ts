import { Locale } from "@/i18n/types";
import { FlattenedServerError, ServerError } from "@/libs/error/server";
import config from "@/payload.config";
import { GuestbookPayload } from "@/payloads/guestbook";
import { AuthPublicUser } from "@/types/auth";
import { GuestbookEntry } from "@/types/payload";
import { captureException } from "@sentry/nextjs";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload as getPayloadRaw } from "payload";

export abstract class GuestbookService {
  private static getPayload() {
    return getPayloadRaw({ config });
  }

  private static async commentNotFound() {
    const t = await getTranslations("Guestbook");
    const locale = (await getLocale()) as Locale;
    return await new ServerError("NOT_FOUND", { item: t("comment") }).withLocale(locale).flatten();
  }

  static async postComment({ user, message }: { user: AuthPublicUser; message: string }) {
    const payload = await this.getPayload();
    const entry = await payload.create({
      collection: "guestbook-entry",
      data: {
        isAdmin: user.isAdmin,
        message,
        pinned: false,
        userId: user.id,
      },
    });
    return entry;
  }

  static async updateComment({
    id,
    message,
    user,
  }: GuestbookPayload.EditEntry & { user: AuthPublicUser }): Promise<Result<GuestbookEntry | null, FlattenedServerError>> {
    const payload = await this.getPayload();
    const entry = await payload.update({
      collection: "guestbook-entry",
      data: {
        message,
      },
      where: { id: { equals: id }, userId: { equals: user.id } },
    });

    if (entry.errors.length) {
      captureException(entry.errors);
      return { success: false, error: await this.commentNotFound() };
    }
    return { success: true, data: entry.docs[0] || null };
  }

  static async deleteComment({
    id,
    user,
  }: GuestbookPayload.DeleteEntry & { user: AuthPublicUser }): Promise<Result<GuestbookEntry | null, FlattenedServerError>> {
    const payload = await this.getPayload();
    const entry = await payload.delete({
      collection: "guestbook-entry",
      where: { id: { equals: id }, userId: { equals: user.id } },
    });

    if (entry.errors.length) {
      captureException(entry.errors);
      return { success: false, error: await this.commentNotFound() };
    }
    return { success: true, data: entry.docs[0] || null };
  }
}
