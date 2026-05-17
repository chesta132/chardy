import { timeInSec } from "@/libs/manipulate/number";
import { redis } from "@/libs/redis";
import { Chat, Conversation } from "@/payloads/ai";
import { Content } from "@google/genai";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAIConfig } from "@/cms/crud/read";
import { runAgentLoop } from "@/libs/ai/gemini";

const redisKey = (id: string) => `ai:conversation:session:${id}`;

export type ChatPayload = {
  id: string;
  message: string;
};

type AppendChatsPayload = {
  id: string;
  /** Typically, first is user and second is model */
  chats: [Chat, Chat];
};

export abstract class AIService {
  static readonly CONVERSATION_EXP_SEC = timeInSec({ day: 3 });

  private static toGemini(conversation: Conversation): Content[] {
    return conversation.map((chat) => ({
      role: chat.role,
      parts: [{ text: chat.content }],
    }));
  }
  private static async appendChats({ chats, id }: AppendChatsPayload) {
    const conversation = await this.getConversation(id);
    const appended: Conversation = [...conversation, ...chats];
    await redis.set(redisKey(id), appended, { ex: this.CONVERSATION_EXP_SEC });
  }

  static async getConversation(id: string): Promise<Conversation> {
    return (await redis.get<Conversation>(redisKey(id))) || [];
  }

  static async chat({ message, id }: ChatPayload) {
    const reqTime = Date.now();
    const conversation = await this.getConversation(id);
    const history = this.toGemini(conversation);

    const payload = await getPayload({ config });
    const aiConfig = await getAIConfig(payload);

    const contents: Content[] = [...history, { role: "user", parts: [{ text: message }] }];
    const { generator } = await runAgentLoop(contents, aiConfig.systemPrompt, aiConfig.model);

    let fullContent = "";
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of generator) {
          const text = chunk.text || "";
          fullContent += text;
          controller.enqueue(text);
        }
        controller.close();

        await AIService.appendChats({
          id,
          chats: [
            { id: crypto.randomUUID(), content: message, createdAt: reqTime, role: "user" },
            { id: crypto.randomUUID(), content: fullContent, createdAt: Date.now(), role: "model" },
          ],
        });
      },
    });

    return { id, stream };
  }
}
