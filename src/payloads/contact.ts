import z from "zod";
import { Payload } from ".";

export abstract class ContactPayload {
  static readonly MAX_MESSAGE = 300;
  static readonly sendMessage = z.object({
    fullName: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD).max(this.MAX_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
    email: z.email(Payload.LOCALIZATION.INVALID_EMAIL).max(this.MAX_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
    subject: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD).max(this.MAX_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD).max(this.MAX_MESSAGE, Payload.LOCALIZATION.MAX_CHAR),
  });
}

export namespace ContactPayload {
  export type SendMessage = z.infer<typeof ContactPayload.sendMessage>;
}
