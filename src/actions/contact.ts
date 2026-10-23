"use server";

import { redis } from "@/libs/redis";
import { RateLimitMiddleware } from "@/middlewares/rate-limit";
import { TurnstileMiddleware } from "@/middlewares/turnstile";
import { Payload } from "@/payloads";
import { ContactPayload } from "@/payloads/contact";
import { TurnstilePayload } from "@/payloads/turnstile";
import { ContactService } from "@/services/contact";
import { Ratelimit } from "@upstash/ratelimit";
import { createNectAction } from "nectic/actions";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(ContactService.MAX_SEND_MESSAGE, "1 h"),
});

export const sendMessageAction = createNectAction()
  .validate([TurnstilePayload.validator, ContactPayload.sendMessage, Payload.locale])
  .use(RateLimitMiddleware.action({ ratelimit, key: "contact" }))
  .use(RateLimitMiddleware.action({ ratelimit, key: "contact-email", limitBy: (_, __, { email }, ___) => email }))
  .use(TurnstileMiddleware.action)
  .handle(ContactService.sendMessage);
