import z from "zod";
import { Payload } from ".";

export abstract class GuestbookPayload {
  static readonly MAX_CHAR_MESSAGE = 500;
  static readonly getEntry = z.object({
    page: z.number().min(1).optional(),
  });

  static readonly postEntry = z.object({
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD).max(this.MAX_CHAR_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
  });

  static readonly editEntry = z.object({
    id: z.number(),
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD).max(this.MAX_CHAR_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
  });

  static readonly deleteEntry = z.object({
    id: z.number(),
  });
}

export namespace GuestbookPayload {
  export type PostEntry = z.output<typeof GuestbookPayload.postEntry>;
  export type EditEntry = z.output<typeof GuestbookPayload.editEntry>;
  export type DeleteEntry = z.output<typeof GuestbookPayload.deleteEntry>;
  export type GetEntry = z.output<typeof GuestbookPayload.getEntry>
}
