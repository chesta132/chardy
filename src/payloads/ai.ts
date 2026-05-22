import { AppRouterHandler, HandlerOption } from "nectic/route";
import z from "zod";
import { Payload } from ".";

export abstract class AIPayload {
  static readonly sendMessage = {
    validator: {
      body: z.object({
        message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
      }),
      query: z.object({
        lang: Payload.locale,
      }),
    },
  } satisfies HandlerOption<AppRouterHandler>;

  private static readonly INTERNAL_MODELS = {
    message: z.object({
      id: z.uuidv4(),
      role: z.enum(["user", "model"]),
      content: z.string(),
      createdAt: z.number(),
    }),
  };

  static readonly MODELS = {
    message: this.INTERNAL_MODELS.message,
    messages: z.array(this.INTERNAL_MODELS.message),
  };
}

export namespace AIPayload {
  export type SendMessageBody = z.infer<typeof AIPayload.sendMessage.validator.body>;
  export type SendMessageQuery = z.infer<typeof AIPayload.sendMessage.validator.query>;
}

export type Message = z.infer<typeof AIPayload.MODELS.message>;
export type Messages = z.infer<typeof AIPayload.MODELS.messages>;
