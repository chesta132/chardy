import { AIMiddleware } from "@/middlewares/ai";
import { AIPayload, Messages } from "@/payloads/ai";
import { AIService } from "@/services/ai";
import { ActionFunc } from "nectic/actions";
import { AppRouterHandler, RouteRequest } from "nectic/route";

export abstract class AIController {
  static sendMessage: AppRouterHandler<RouteRequest<AIPayload.SendMessageBody, never, AIPayload.SendMessageQuery>> = async (req, res, { reply, ...ctx }) => {
    const conversationId = AIMiddleware.getConversationId(req)!;
    const { message } = ctx.validated.body;
    const { lang } = ctx.validated.query;
    const { stream } = await AIService.sendMessage({ message, conversationId, lang });
    return reply.stream(stream, { contentType: "text/event-stream" });
  };

  static getMessages: ActionFunc<[], [], Messages> = async ({ outcome, ...ctx }) => {
    const id = AIMiddleware.getConversationId(ctx)!;
    const messages = await AIService.getMessages(id);
    return outcome.success(messages).ok();
  };
}
