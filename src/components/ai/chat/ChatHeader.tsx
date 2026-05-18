import { OWNER_FIRSTNAME } from "@/config";
import { useTranslations } from "next-intl";
import { FiX } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import { AiConfig } from "@/types/payload";

export const ChatHeader = ({
  onClose,
  onToggleSize,
  isExpanded,
  aiConfig,
}: {
  onClose: () => void;
  onToggleSize?: () => void;
  isExpanded?: boolean;
  aiConfig: AiConfig;
}) => {
  const t = useTranslations("AIChat.panel.header");

  return (
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
  );
};
