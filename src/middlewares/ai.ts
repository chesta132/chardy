import { isProdEnv } from "@/config";
import { AIService } from "@/services/ai";
import { ActionMiddlewareFunc } from "nectic/actions";
import { AppRouterHandler } from "nectic/route";
import { cookies } from "next/headers";

export abstract class AIMiddleware {
  private static readonly conversationIdKey = "conversation_id";
  private static readonly cookieSettings = { maxAge: AIService.CONVERSATION_EXP_SEC, httpOnly: true, secure: isProdEnv(), sameSite: "lax" } as const;

  static extractConversationId: AppRouterHandler = (req, res, { next }) => {
    const id = req.getCookie(this.conversationIdKey);
    if (!id) {
      const id = crypto.randomUUID();
      req.set(this.conversationIdKey, id);
      res.setCookie(this.conversationIdKey, id, this.cookieSettings);
    } else {
      req.set(this.conversationIdKey, id);
    }
    return next();
  };

  /** Middleware `extractConversationId` for server actions */
  static actionExtractConversationId: ActionMiddlewareFunc<[]> = async ({ next, ...ctx }) => {
    const cookieStore = await cookies();
    const id = cookieStore.get(this.conversationIdKey)?.value;
    if (!id) {
      const id = crypto.randomUUID();
      ctx.set(this.conversationIdKey, id);
      cookieStore.set(this.conversationIdKey, id, this.cookieSettings);
    } else {
      ctx.set(this.conversationIdKey, id);
    }
    return next();
  };

  static getConversationId = (ctx: { get: (name: string) => any }) => ctx.get(this.conversationIdKey) as string | undefined;
}
