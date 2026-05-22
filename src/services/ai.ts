import { timeInSec } from "@/libs/manipulate/number";
import { redis } from "@/libs/redis";
import { Chat, Conversation } from "@/payloads/ai";
import { Content } from "@google/genai";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAIConfig } from "@/cms/crud/read";
import { runAgentLoop } from "@/libs/ai/gemini";
import { Locale } from "@/i18n/types";
import { getMessages } from "@/i18n/request";
import { createTranslator } from "next-intl";
import { ServerError } from "@/libs/error/server";

const conversationKey = (id: string) => `ai:conversation:session:${id}`;
const geminiKey = (id: string) => `ai:conversation:gemini:${id}`;

export type ChatPayload = {
  id: string;
  message: string;
  lang: Locale;
};

type AppendChatsPayload = {
  id: string;
  /** Typically, first is user and second is model */
  chats: [Chat, Chat];
};

type AppendGeminiPayload = {
  id: string;
  contents: Content[];
};

export abstract class AIService {
  static readonly CONVERSATION_EXP_SEC = timeInSec({ day: 3 });

  private static async appendChats({ chats, id }: AppendChatsPayload) {
    const conversation = await this.getConversation(id);
    const appended: Conversation = [...conversation, ...chats];
    await redis.set(conversationKey(id), appended, { ex: this.CONVERSATION_EXP_SEC });
  }

  private static async appendGemini({ contents, id }: AppendGeminiPayload) {
    const gemini = await this.getGemini(id);
    const appended: Content[] = [...gemini, ...contents];
    await redis.set(geminiKey(id), appended, { ex: this.CONVERSATION_EXP_SEC });
  }

  static async getConversation(id: string): Promise<Conversation> {
    return (await redis.get<Conversation>(conversationKey(id))) || [];
  }

  static async getGemini(id: string): Promise<Content[]> {
    return (await redis.get<Content[]>(geminiKey(id))) || [];
  }

  static async chat({ message, id, lang }: ChatPayload) {
    const t = createTranslator({ locale: lang, messages: await getMessages(lang), namespace: "Error.AIChat" });
    const reqTime = Date.now();
    const gemini = await this.getGemini(id);

    const payload = await getPayload({ config });
    const aiConfig = await getAIConfig(payload);

    const contents: Content[] = [...gemini, { role: "user", parts: [{ text: message }] }];
    const { generator, finalContents } = await runAgentLoop(contents, aiConfig.systemPrompt, aiConfig.model).catch((err) => {
      if (err?.status === 429) throw new ServerError("TOO_MUCH_REQ", { desc: t("TOO_MUCH_REQ.desc") }).withLocale(lang);
      else throw new ServerError("SERVER_ERROR", { message: err?.message });
    });

    let fullContent = "";
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of generator) {
          const text = chunk.text || "";
          fullContent += text;
          controller.enqueue(text);
        }
        controller.close();
        finalContents.push({ role: "model", parts: [{ text: fullContent }] });

        await Promise.all([
          AIService.appendChats({
            id,
            chats: [
              { id: crypto.randomUUID(), content: message, createdAt: reqTime, role: "user" },
              { id: crypto.randomUUID(), content: fullContent, createdAt: Date.now(), role: "model" },
            ],
          }),
          AIService.appendGemini({
            id,
            contents: finalContents.slice(gemini.length),
          }),
        ]);
      },
    });

    return { id, stream };
  }
}
