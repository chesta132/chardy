"use server";

import { Payload } from "@/payloads";
import { ContactPayload } from "@/payloads/contact";
import { ContactService } from "@/services/contact";
import { createNectAction } from "nectic/actions";

export const sendMessageAction = createNectAction()
  .validate([ContactPayload.sendMessage, Payload.locale])
  .handle(ContactService.sendMessage);
