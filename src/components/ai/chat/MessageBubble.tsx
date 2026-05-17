import { Loading } from "@/components/ui/Loading";
import { cn } from "@/libs/utils";
import { Chat } from "@/payloads/ai";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { RiRobot2Line } from "react-icons/ri";

export const MessageBubble = memo(({ msg }: { msg: Chat }) => {
  const isUser = msg.role === "user";
  const isEmpty = !msg.content && msg.role === "model";
  const t = useTranslations("AIChat.panel.bubble");

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center mr-2 mt-1">
          <RiRobot2Line className="w-3.5 h-3.5 text-foreground/60" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs font-neue-montreal leading-relaxed whitespace-pre-wrap wrap-break-word",
          isUser ? "bg-foreground text-background rounded-tr-sm" : "bg-foreground/8 text-foreground rounded-tl-sm border border-foreground/10",
        )}
      >
        {isEmpty ? (
          <span className="flex items-center gap-1.5 text-foreground/40 italic text-[0.7rem]">
            <Loading className="w-3.5 h-3.5" />
            {t("thinking")}
          </span>
        ) : (
          msg.content
        )}
      </div>
    </div>
  );
});
