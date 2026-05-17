import { isDevEnv } from "@/config";
import { AIController } from "@/controllers/ai";
import { AIMiddleware } from "@/middlewares/ai";
import { AIPayload } from "@/payloads/ai";
import { createAppRouter } from "nectic/route";

export const { POST } = createAppRouter(
  {
    POST: [AIMiddleware.extractConversationId, AIController.chat],
  },
  { POST: AIPayload.chat, cors: true, debugMode: isDevEnv() },
);
