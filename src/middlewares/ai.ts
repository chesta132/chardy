import { isProdEnv } from "@/config";
import { AIService } from "@/services/ai";
import { ActionMiddlewareFunc } from "nectic/actions";
import { AppRouterHandler } from "nectic/route";
import { cookies } from "next/headers";

export abstract class AIMiddleware {
  private static readonly UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  private static readonly conversationIdKey = "conversation_id";
  private static readonly cookieSettings = {
    maxAge: AIService.CONVERSATION_EXP_SEC,
    httpOnly: true,
    secure: isProdEnv(),
    sameSite: "lax",
  } as const;

  private static resolveId(raw: string | undefined) {
    return raw && this.UUID_RE.test(raw) ? { id: raw, isNew: false } : { id: crypto.randomUUID(), isNew: true };
  }

  static extractConversationId: AppRouterHandler = (req, res, { next }) => {
    const { id, isNew } = this.resolveId(req.getCookie(this.conversationIdKey));
    req.set(this.conversationIdKey, id);
    if (isNew) res.setCookie(this.conversationIdKey, id, this.cookieSettings);
    return next();
  };

  /** Middleware `extractConversationId` for server actions */
  static actionExtractConversationId: ActionMiddlewareFunc<[]> = async ({ next, ...ctx }) => {
    const cookieStore = await cookies();
    const { id, isNew } = this.resolveId(cookieStore.get(this.conversationIdKey)?.value);
    ctx.set(this.conversationIdKey, id);
    if (isNew) cookieStore.set(this.conversationIdKey, id, this.cookieSettings);
    return next();
  };

  static getConversationId = (ctx: { get: (name: string) => any }) => ctx.get(this.conversationIdKey) as string | undefined;
}
