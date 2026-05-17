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
import { AI_NAME } from "@/config";

// ─── Sizes ────────────────────────────────────────────────────────────────────

const DESKTOP_SIZES = {
  normal: { width: 320, height: 480 },
  expanded: { width: 480, height: 600 },
} as const;

// ─── Main panel ───────────────────────────────────────────────────────────────

export const AIChatPanel = () => {
  const { open, setOpen, messages } = useAIChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop(); // reactive — drives GSAP dependency
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Mobile sheet height via touch drag ──
  const sheetHeight = useRef(55); // svh
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(55);
  const MIN_HEIGHT_SVH = 35;
  const MAX_HEIGHT_SVH = 90;

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
          gsap.fromTo(panel, { opacity: 0, x: 40, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" });
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
          gsap.fromTo(panel, { opacity: 0, y: "100%" }, { opacity: 1, y: "0%", duration: 0.5, ease: "power3.out" });
        }
      } else {
        if (isDesktop) {
          gsap.to(panel, {
            opacity: 0,
            x: 40,
            scale: 0.95,
            duration: 0.35,
            ease: "power3.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        } else {
          gsap.to(panel, {
            opacity: 0,
            y: "100%",
            duration: 0.4,
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
    gsap.to(panel, { width: size.width, height: size.height, duration: 0.4, ease: "power3.out" });
  }, [isExpanded]);

  // ── Desktop drag (mouse only) ──
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop) return;
      if (!(e.target as HTMLElement).closest("[data-drag-handle]")) return;
      dragging.current = true;
      const rect = panelRef.current!.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();
    },
    [isDesktop],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !panelRef.current) return;
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      gsap.set(panelRef.current, { left: x, top: y, right: "auto", bottom: "auto" });
    };
    const onMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ── Mobile pill touch — resize sheet height only ──
  const onPillTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartHeight.current = sheetHeight.current;
  }, []);

  const onPillTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    const deltaY = touchStartY.current - e.touches[0].clientY; // up = positive
    const svhUnit = window.innerHeight / 100;
    const newH = Math.min(MAX_HEIGHT_SVH, Math.max(MIN_HEIGHT_SVH, touchStartHeight.current + deltaY / svhUnit));
    sheetHeight.current = newH;
    gsap.set(panel, { height: `${newH}svh` });
  }, []);

  const onPillTouchEnd = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (sheetHeight.current < 42) {
      gsap.to(panel, {
        y: "100%",
        opacity: 0,
        duration: 0.35,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          setOpen(false);
          sheetHeight.current = 55;
        },
      });
    } else {
      const snapped = Math.round(sheetHeight.current / 5) * 5;
      sheetHeight.current = Math.min(MAX_HEIGHT_SVH, Math.max(MIN_HEIGHT_SVH, snapped));
      gsap.to(panel, { height: `${sheetHeight.current}svh`, duration: 0.25, ease: "power3.out" });
    }
  }, [setOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-xs lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

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
        aria-label={AI_NAME}
        aria-modal="true"
      >
        {/* Mobile pill — touch resize only, not mouse */}
        <div
          className="flex justify-center pt-2.5 pb-1 lg:hidden shrink-0 touch-none select-none"
          onTouchStart={onPillTouchStart}
          onTouchMove={onPillTouchMove}
          onTouchEnd={onPillTouchEnd}
        >
          <div className="w-8 h-1 rounded-full bg-foreground/25 active:bg-foreground/50 transition-colors" />
        </div>

        {/* Header — desktop drag handle (mouse only) */}
        <div data-drag-handle className="lg:cursor-grab lg:active:cursor-grabbing shrink-0" onMouseDown={onMouseDown}>
          <ChatHeader onClose={() => setOpen(false)} onToggleSize={handleToggleSize} isExpanded={isExpanded} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 min-h-0" data-lenis-prevent>
          {messages.length === 0 ? <EmptyState /> : messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput />
      </div>
    </>
  );
};
