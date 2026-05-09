import { routing } from "@/i18n/routing";
import { CreateRouteValidator } from "@/libs/route/types";
import z from "zod";

export abstract class ContactPayload {
  static readonly sendMessage = {
    body: z.object({
      fullName: z.string().min(1, "Full name is required"),
      email: z.email(),
      subject: z.string().min(1, "Subject is required"),
      message: z.string().min(1, "Message is required"),
    }),
    query: z.object({
      lang: z.enum(routing.locales),
    }),
  } satisfies CreateRouteValidator;
}

export namespace ContactPayload {
  export type SendMessageBody = z.infer<typeof ContactPayload.sendMessage.body>;
  export type SendMessageQuery = z.infer<typeof ContactPayload.sendMessage.query>;
}
