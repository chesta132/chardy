"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/libs/gsap/register";
import { useGSAP } from "@gsap/react";
import { useAIChat } from "@/contexts/AIChat";
import { cn } from "@/libs/utils";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { ChatHeader } from "./chat/ChatHeader";
import { EmptyState } from "./chat/EmptyState";
import { MessageBubble } from "./chat/MessageBubble";
import { ChatInput } from "./chat/ChatInput";
import { usePreference } from "@/contexts/Preference";

// ─── Sizes ────────────────────────────────────────────────────────────────────

const DESKTOP_SIZES = {
  normal: { width: 320, height: 480 },
  expanded: { width: 480, height: 600 },
} as const;

// ─── Main panel ───────────────────────────────────────────────────────────────

export const AIChatPanel = () => {
  const { open, setOpen, messages, aiConfig } = useAIChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop(); // reactive — drives GSAP dependency
  const [isExpanded, setIsExpanded] = useState(false);
  const { motion } = usePreference();

  const sheetHeight = useRef(55); // svh

  // Clear stale GSAP inline styles when breakpoint flips, so neither
  // desktop nor mobile inherits the other's positioning/sizing.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open) return;

    if (isDesktop) {
      // coming from mobile: clear mobile sheet styles
      const size = isExpanded ? DESKTOP_SIZES.expanded : DESKTOP_SIZES.normal;
      gsap.set(panel, {
        clearProps: "bottom,left,right,y,opacity",
        width: size.width,
        height: size.height,
        display: "flex",
        x: 0,
        scale: 1,
        opacity: 1,
      });
    } else {
      // coming from desktop: clear desktop drag/size styles
      gsap.set(panel, {
        clearProps: "width,height,left,top,x,scale",
        bottom: 0,
        right: "auto",
        left: 0,
        height: `${sheetHeight.current}svh`,
        y: "0%",
        opacity: 1,
        display: "flex",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── GSAP panel open/close animation ──
  // isDesktop is in the dependency array so it always has the fresh value
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (open) {
        gsap.set(panel, { display: "flex" });
        if (isDesktop) {
          const size = isExpanded ? DESKTOP_SIZES.expanded : DESKTOP_SIZES.normal;
          gsap.set(panel, {
            width: size.width,
            height: size.height,
            bottom: "auto",
            left: "auto", // let CSS right/bottom handle it
            right: 32,
            top: "auto",
            y: 0,
          });
          if (motion === "no-motion") {
            gsap.set(panel, { opacity: 1, x: 0, scale: 1 });
          } else {
            gsap.fromTo(panel, { opacity: 0, x: 40, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" });
          }
        } else {
          gsap.set(panel, {
            width: "100%",
            left: 0,
            right: 0,
            bottom: 0,
            top: "auto",
            height: `${sheetHeight.current}svh`,
            x: 0,
            scale: 1,
          });
          if (motion === "no-motion") {
            gsap.set(panel, { opacity: 1, y: "0%" });
          } else {
            gsap.fromTo(
              panel,
              { opacity: motion === "reduce" ? 1 : 0, y: "100%" },
              { opacity: 1, y: "0%", duration: 0.5, ease: "power3.out" },
            );
          }
        }
      } else {
        if (isDesktop) {
          gsap.to(panel, {
            opacity: 0,
            x: 40,
            scale: 0.95,
            duration: motion === "no-motion" ? 0 : 0.35,
            ease: "power3.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        } else {
          gsap.to(panel, {
            opacity: motion === "reduce" ? 1 : 0,
            y: "100%",
            duration: motion === "no-motion" ? 0 : 0.4,
            ease: "power3.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        }
      }
    },
    { dependencies: [open, isDesktop] },
  );

  // ── Desktop toggle size ──
  const handleToggleSize = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const next = !isExpanded;
    setIsExpanded(next);
    const size = next ? DESKTOP_SIZES.expanded : DESKTOP_SIZES.normal;
    gsap.to(panel, { width: size.width, height: size.height, duration: motion === "no-motion" ? 0 : 0.4, ease: "power3.out" });
  }, [isExpanded]);

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
