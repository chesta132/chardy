"use server";

import { AIController } from "@/controllers/ai";
import { redis } from "@/libs/redis";
import { AIMiddleware } from "@/middlewares/ai";
import { RateLimitMiddleware } from "@/middlewares/rate-limit";
import { AIService } from "@/services/ai";
import { Ratelimit } from "@upstash/ratelimit";
import { createNectAction } from "nectic/actions";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(AIService.MAX_MESSAGE, "1 h"),
});

export const getMessagesAction = createNectAction()
  .use(RateLimitMiddleware.action({ ratelimit, key: "ai" }))
  .use(AIMiddleware.actionExtractConversationId)
  .handle(AIController.getMessages);
