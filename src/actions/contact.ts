"use server";

import { TurnstileMiddleware } from "@/middlewares/turnstile";
import { Payload } from "@/payloads";
import { ContactPayload } from "@/payloads/contact";
import { TurnstilePayload } from "@/payloads/turnstile";
import { ContactService } from "@/services/contact";
import { createNectAction } from "nectic/actions";

export const sendMessageAction = createNectAction()
  .validate([TurnstilePayload.validator, ContactPayload.sendMessage, Payload.locale])
  .use(TurnstileMiddleware.action)
  .handle(ContactService.sendMessage);
