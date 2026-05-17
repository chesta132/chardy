import { ServerError } from "@/libs/error/server";
import { AIMiddleware } from "@/middlewares/ai";
import { AIPayload, Conversation } from "@/payloads/ai";
import { AIService } from "@/services/ai";
import { ActionFunc } from "nectic/actions";
import { AppRouterHandler, RouteRequest } from "nectic/route";

export abstract class AIController {
  static chat: AppRouterHandler<RouteRequest<AIPayload.ChatBody, never, AIPayload.ChatQuery>> = async (req, res, { reply, ...ctx }) => {
    const conversationId = AIMiddleware.getConversationId(req)!;
    const { message } = ctx.validated.body;
    const { lang } = ctx.validated.query;
    const { stream } = await AIService.chat({ message, id: conversationId, lang });
    return reply.stream(stream, { contentType: "text/event-stream" });
  };

  static getConversation: ActionFunc<[], [], Conversation> = async ({ outcome, ...ctx }) => {
    const id = AIMiddleware.getConversationId(ctx)!;
    const conversation = await AIService.getConversation(id);
    return outcome.success(conversation).ok();
  };
}
