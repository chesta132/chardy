"use client";

import { getConversationAction } from "@/actions/ai";
import { Chat, Conversation } from "@/payloads/ai";
import { isOutcomeSuccess, nectAction } from "nectic/actions";
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
};

const AIChatContext = createContext<AIChatContextValue | null>(null);

export const AIChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpenState] = useState(false);
  const [messages, setMessages] = useState<Conversation>([]);
  const [status, setStatus] = useState<AIChatStatus>("idle");
  const initialized = useRef(false);

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

    setMessages((prev) => [...prev, userMsg]);
    setStatus("loading");

    const modelMsgId = uuid();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to send message");

      setStatus("streaming");

      // Append placeholder model message
      setMessages((prev) => [...prev, { id: modelMsgId, role: "model", content: "", createdAt: Date.now() }]);

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

  return <AIChatContext.Provider value={{ open, setOpen, messages, status, sendMessage }}>{children}</AIChatContext.Provider>;
};

export const useAIChat = () => {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error("useAIChat must be used within AIChatProvider");
  return ctx;
};
