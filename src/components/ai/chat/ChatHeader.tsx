import { OWNER_FIRSTNAME } from "@/config";
import { useTranslations } from "next-intl";
import { FiX } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import { AiConfig } from "@/types/payload";
import { useCallback, useEffect, useRef } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { gsap } from "@/libs/gsap/register";
import { useAIChat } from "@/contexts/AIChat";

type ChatHeaderProps = {
  onClose: () => void;
  onToggleSize?: () => void;
  isExpanded?: boolean;
  aiConfig: AiConfig;
  panelRef: React.RefObject<HTMLDivElement | null>;
  sheetHeight: React.RefObject<number>;
};

export const ChatHeader = ({ onClose, onToggleSize, isExpanded, aiConfig, panelRef, sheetHeight }: ChatHeaderProps) => {
  const t = useTranslations("AIChat.panel.header");
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDesktop = useIsDesktop();

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

  return (
    <>
      <MobileChatPill panelRef={panelRef} sheetHeight={sheetHeight} />
      <div data-drag-handle className="lg:cursor-grab lg:active:cursor-grabbing shrink-0" onMouseDown={onMouseDown}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center">
              <RiRobot2Line className="w-3.5 h-3.5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-supply-mono uppercase tracking-wider text-foreground leading-none">{aiConfig.aiName}</p>
              <p className="text-[0.6rem] font-supply-mono text-foreground/40 mt-0.5">{t("askMe", { name: OWNER_FIRSTNAME })}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Desktop expand/collapse toggle */}
            {onToggleSize && (
              <button
                onClick={onToggleSize}
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
                className="group hidden lg:flex w-6 h-6 rounded-md items-center justify-center hover:bg-foreground/8 transition-colors duration-300"
              >
                {isExpanded ? <AiOutlineShrink /> : <AiOutlineExpandAlt />}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="group w-6 h-6 rounded-md flex items-center justify-center hover:bg-foreground/8 transition-colors duration-300"
            >
              <FiX className="w-3.5 h-3.5 text-foreground/60 group-hover:text-foreground transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

type MobileChatPillProps = Pick<ChatHeaderProps, "panelRef" | "sheetHeight">;

const MobileChatPill = ({ panelRef, sheetHeight }: MobileChatPillProps) => {
  const MIN_HEIGHT_SVH = 35;
  const MAX_HEIGHT_SVH = 90;
  const { setOpen } = useAIChat();
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(55);

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
    <div
      className="flex justify-center pt-2.5 pb-1 lg:hidden shrink-0 touch-none select-none"
      onTouchStart={onPillTouchStart}
      onTouchMove={onPillTouchMove}
      onTouchEnd={onPillTouchEnd}
    >
      <div className="w-8 h-1 rounded-full bg-foreground/25 active:bg-foreground/50 transition-colors" />
    </div>
  );
};
