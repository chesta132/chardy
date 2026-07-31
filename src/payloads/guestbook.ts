import z from "zod";
import { Payload } from ".";

export abstract class GuestbookPayload {
  static readonly postEntry = z.object({
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
  });

  static readonly editEntry = z.object({
    id: z.number(),
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
  });

  static readonly deleteEntry = z.object({
    id: z.number(),
  });
}

export namespace GuestbookPayload {
  export type PostEntry = z.output<typeof GuestbookPayload.postEntry>;
  export type EditEntry = z.output<typeof GuestbookPayload.editEntry>;
  export type DeleteEntry = z.output<typeof GuestbookPayload.deleteEntry>;
  export type GetEntry = { limit?: number; page?: number };
}
