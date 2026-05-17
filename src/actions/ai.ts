"use server";

import { AIController } from "@/controllers/ai";
import { AIMiddleware } from "@/middlewares/ai";
import { createNectAction } from "nectic/actions";

export const getConversationAction = createNectAction().use(AIMiddleware.actionExtractConversationId).handle(AIController.getConversation);
