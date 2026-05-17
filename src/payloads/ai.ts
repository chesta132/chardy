import { AppRouterHandler, HandlerOption } from "nectic/route";
import z from "zod";
import { Payload } from ".";

export abstract class AIPayload {
  static readonly chat = {
    validator: {
      body: z.object({
        message: z.string().min(1, Payload.LOCALIZATION.REQUIRED_FIELD),
      }),
    },
  } satisfies HandlerOption<AppRouterHandler>;

  static readonly MODELS = {
    chat: z.object({
      id: z.uuidv4(),
      role: z.enum(["user", "model"]),
      content: z.string(),
      createdAt: z.number(),
    }),
    conversation: z.array(
      z.object({
        id: z.uuidv4(),
        role: z.enum(["user", "model"]),
        content: z.string(),
        createdAt: z.number(),
      }),
    ),
  };
}

export namespace AIPayload {
  export type ChatBody = z.infer<typeof AIPayload.chat.validator.body>;
}

export type Chat = z.infer<typeof AIPayload.MODELS.chat>;
export type Conversation = z.infer<typeof AIPayload.MODELS.conversation>;
