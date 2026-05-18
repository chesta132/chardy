"use client";

import { getConversationAction } from "@/actions/ai";
import { Chat, Conversation } from "@/payloads/ai";
import { AiConfig } from "@/types/payload";
import { isOutcomeSuccess, nectAction } from "nectic/actions";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// crypto.randomUUID requires a secure context (HTTPS).
// On mobile over HTTP (dev), it throws. This fallback covers that case.
const uuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122 v4-like fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

type AIChatStatus = "idle" | "loading" | "streaming" | "error";

type AIChatContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: Conversation;
  status: AIChatStatus;
  sendMessage: (message: string) => Promise<void>;
  aiConfig: AiConfig;
};

const AIChatContext = createContext<AIChatContextValue | null>(null);

export const AIChatProvider = ({ children, aiConfig }: { children: React.ReactNode; aiConfig: AiConfig }) => {
  const [open, setOpenState] = useState(false);
  const [messages, setMessages] = useState<Conversation>([]);
  const [status, setStatus] = useState<AIChatStatus>("idle");
  const initialized = useRef(false);
  const t = useTranslations();
  const locale = useLocale();

  // Load existing conversation on mount (cached via cookie on BE)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    nectAction({ action: getConversationAction, fromCSR: true }).then((res) => {
      if (isOutcomeSuccess(res) && res.data.length > 0) {
        setMessages(res.data);
      }
    });
  }, []);

  const setOpen = useCallback((val: boolean) => {
    setOpenState(val);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const userMsg: Chat = {
      id: uuid(),
      role: "user",
      content: message,
      createdAt: Date.now(),
    };
    const modelMsgId = uuid();

    // append user message and model thinking (handled in MessageBubble)
    setMessages((prev) => [...prev, userMsg, { id: modelMsgId, role: "model", content: "", createdAt: Date.now() }]);

    setStatus("loading");
    try {
      const res = await fetch(`/api/ai/chat?lang=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.body) throw new Error(t("Error.AIChat.failedToSend"));
      if (!res.ok) {
        const body = await res.json().catch(() => {
          throw new Error(t("Error.AIChat.failedToSend"));
        });
        if (body?.data?.message) {
          throw new Error(body.data.message);
        }
        throw new Error(t("Error.AIChat.failedToSend"));
      }

      setStatus("streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setMessages((prev) => prev.map((m) => (m.id === modelMsgId ? { ...m, content: fullContent } : m)));
      }

      setStatus("idle");
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== modelMsgId));
      setStatus("error");
    }
  }, []);

  return <AIChatContext.Provider value={{ open, setOpen, messages, status, sendMessage, aiConfig }}>{children}</AIChatContext.Provider>;
};

export const useAIChat = () => {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error("useAIChat must be used within AIChatProvider");
  return ctx;
};
