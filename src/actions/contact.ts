"use server";

import { Payload } from "@/payloads";
import { ContactPayload } from "@/payloads/contact";
import { ContactService } from "@/services/contact";
import { createNectAction } from "nectify-js/actions";

export const sendMessageAction = createNectAction()
  .option({ validator: { args: [ContactPayload.sendMessage, Payload.locale] as const } })
  .handle(ContactService.sendMessage);
