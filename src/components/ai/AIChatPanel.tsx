"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/libs/gsap/register";
import { useAIChat } from "@/contexts/AIChat";
import { cn } from "@/libs/utils";
import { ChatHeader } from "./chat/ChatHeader";
import { EmptyState } from "./chat/EmptyState";
import { MessageBubble } from "./chat/MessageBubble";
import { ChatInput } from "./chat/ChatInput";
import { usePreference } from "@/contexts/Preference";
import { DESKTOP_AI_PANEL_SIZES } from "@/config";
import { useAIChatPanelGSAP } from "@/libs/gsap/ai/chat-panel";
import { withMotionDuration } from "@/libs/gsap/utils";

export const AIChatPanel = () => {
  const { open, setOpen, messages, aiConfig } = useAIChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { motion } = usePreference();

  const sheetHeight = useRef(55); // svh

  useAIChatPanelGSAP({ isExpanded, panelRef, sheetHeight });

  // auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // desktop toggle size
  const handleToggleSize = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const next = !isExpanded;
    setIsExpanded(next);
    const size = next ? DESKTOP_AI_PANEL_SIZES.expanded : DESKTOP_AI_PANEL_SIZES.normal;
    gsap.to(panel, { width: size.width, height: size.height, duration: withMotionDuration(motion, 0.4), ease: "power3.out" });
  }, [isExpanded, motion]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <div
        ref={panelRef}
        style={{ display: "none" }}
        className={cn(
          "flex flex-col z-50 overflow-hidden",
          "bg-background border border-foreground/15 shadow-2xl shadow-foreground/10",
          // base mobile position — GSAP overrides on open
          "fixed bottom-0 left-0 right-0 rounded-t-2xl",
          // desktop base — GSAP overrides width/height/position
          "lg:bottom-24 lg:right-8 lg:left-auto lg:top-auto lg:rounded-2xl",
        )}
        role="dialog"
        aria-label={aiConfig.aiName}
        aria-modal="true"
      >
        {/* Header */}
        <ChatHeader
          onClose={() => setOpen(false)}
          onToggleSize={handleToggleSize}
          isExpanded={isExpanded}
          aiConfig={aiConfig}
          panelRef={panelRef}
          sheetHeight={sheetHeight}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-0" data-lenis-prevent>
          {messages.length === 0 ? <EmptyState aiConfig={aiConfig} /> : messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput />
      </div>
    </>
  );
};
