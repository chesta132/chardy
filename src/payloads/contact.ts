import z from "zod";
import { Payload } from ".";

export abstract class ContactPayload {
  static readonly sendMessage = z.object({
    fullName: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
    email: z.email(Payload.LOCALIZATION.INVALID_EMAIL),
    subject: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
    message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
  });
}

export namespace ContactPayload {
  export type SendMessage = z.infer<typeof ContactPayload.sendMessage>;
}
