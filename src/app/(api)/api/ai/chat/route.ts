import { isDevEnv } from "@/config";
import { AIController } from "@/controllers/ai";
import { ServerErrorRecover, statusMap } from "@/libs/error/server/recover";
import { AIMiddleware } from "@/middlewares/ai";
import { AIPayload } from "@/payloads/ai";
import { createAppRouter } from "nectic/route";

export const { POST } = createAppRouter(
  {
    POST: [AIMiddleware.extractConversationId, AIController.sendMessage],
  },
  { POST: AIPayload.sendMessage, cors: true, debugMode: isDevEnv(), recover: ServerErrorRecover, statusMap },
);
