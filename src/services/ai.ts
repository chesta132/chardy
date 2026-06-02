import { timeInSec } from "@/libs/manipulate/number";
import { redis } from "@/libs/redis";
import { Message, Messages } from "@/payloads/ai";
import { Content } from "@google/genai";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAIConfig } from "@/cms/crud/read";
import { runAgentLoop } from "@/libs/ai/gemini";
import { Locale } from "@/i18n/types";
import { getMessages as getLocaleMessages } from "@/i18n/request";
import { createTranslator } from "next-intl";
import { ServerError } from "@/libs/error/server";

const messagesKey = (id: string) => `ai:conversation:${id}:messages`;
const geminiKey = (id: string) => `ai:conversation:${id}:gemini`;

export type SendMessagePayload = {
  conversationId: string;
  message: string;
  lang: Locale;
};

type AppendMessagesPayload = {
  conversationId: string;
  /** Typically, first is user and second is model */
  messages: [Message, Message];
};

type AppendGeminiPayload = {
  conversationId: string;
  contents: Content[];
};

export abstract class AIService {
  static readonly CONVERSATION_EXP_SEC = timeInSec({ day: 3 });

  private static async appendMessages({ messages, conversationId }: AppendMessagesPayload) {
    const conversation = await this.getMessages(conversationId);
    const appended: Messages = [...conversation, ...messages];
    await redis.set(messagesKey(conversationId), appended, { ex: this.CONVERSATION_EXP_SEC });
  }

  private static async appendGemini({ contents, conversationId }: AppendGeminiPayload) {
    const gemini = await this.getGemini(conversationId);
    const appended: Content[] = [...gemini, ...contents];
    await redis.set(geminiKey(conversationId), appended, { ex: this.CONVERSATION_EXP_SEC });
  }

  static async getMessages(id: string): Promise<Messages> {
    return (await redis.get<Messages>(messagesKey(id))) || [];
  }

  static async getGemini(id: string): Promise<Content[]> {
    return (await redis.get<Content[]>(geminiKey(id))) || [];
  }

  static async sendMessage({ message, conversationId, lang }: SendMessagePayload) {
    const t = createTranslator({ locale: lang, messages: await getLocaleMessages(lang), namespace: "Error" });
    const reqTime = Date.now();
    const gemini = await this.getGemini(conversationId);

    const payload = await getPayload({ config });
    const aiConfig = await getAIConfig(payload);

    const contents: Content[] = [...gemini, { role: "user", parts: [{ text: message }] }];
    const { generator, finalContents } = await runAgentLoop(contents, aiConfig.systemPrompt, aiConfig.model).catch((err) => {
      if (err?.status === 429) throw new ServerError("TOO_MUCH_REQ", { desc: t("AIChat.TOO_MUCH_REQ.desc") }).withLocale(lang);
      else throw new ServerError("SERVER_ERROR", { message: t("Common.UNKNOWN.message"), debug: err }).withLocale(lang);
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
          AIService.appendMessages({
            conversationId,
            messages: [
              { id: crypto.randomUUID(), content: message, createdAt: reqTime, role: "user" },
              { id: crypto.randomUUID(), content: fullContent, createdAt: Date.now(), role: "model" },
            ],
          }),
          AIService.appendGemini({
            conversationId,
            contents: finalContents.slice(gemini.length),
          }),
        ]);
      },
    });

    return { conversationId, stream };
  }
}
