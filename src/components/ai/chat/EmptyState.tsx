import { AI_NAME, OWNER_FIRSTNAME } from "@/config";
import { useTranslations } from "next-intl";
import { RiRobot2Line } from "react-icons/ri";

export const EmptyState = () => {
  const t = useTranslations("AIChat.panel.empty");

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 text-center">
      <div className="w-10 h-10 rounded-2xl bg-foreground/8 border border-foreground/10 flex items-center justify-center">
        <RiRobot2Line className="w-5 h-5 text-foreground/40" />
      </div>
      <div>
        <p className="text-xs font-supply-mono uppercase tracking-wider text-foreground/60">{AI_NAME}</p>
        <p className="text-[0.7rem] font-neue-montreal text-foreground/40 mt-1 leading-relaxed">{t("askMe", { name: OWNER_FIRSTNAME })}</p>
      </div>
    </div>
  );
};
