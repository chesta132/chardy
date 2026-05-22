"use server";

import { AIController } from "@/controllers/ai";
import { AIMiddleware } from "@/middlewares/ai";
import { createNectAction } from "nectic/actions";

export const getMessagesAction = createNectAction().use(AIMiddleware.actionExtractConversationId).handle(AIController.getMessages);
