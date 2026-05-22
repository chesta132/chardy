import { FormLayout } from "@/components/form/FormLayout";
import { Loading } from "@/components/ui/Loading";
import { useAIChat } from "@/contexts/AIChat";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { useForm } from "@/hooks/useForm";
import { AIPayload } from "@/payloads/ai";
import { useTranslations } from "next-intl";
import { FiSend } from "react-icons/fi";

export const ChatInput = () => {
  const t = useTranslations("AIChat.panel.input");
  const { sendMessage, status } = useAIChat();
  const form = useForm({ message: "" }, AIPayload.chat.validator.body);
  const {
    form: [{ message }],
  } = form;
  const { textAreaRef } = useAutosizeTextarea(message);
  const busy = status === "loading" || status === "streaming";

  const handleSubmit = async (_: any, { message }: AIPayload.ChatBody) => {
    const trimmed = message.trim();
    if (!trimmed || busy) return;
    await sendMessage(trimmed);
  };

  return (
    <FormLayout
      form={form}
      onFormSubmit={handleSubmit}
      resetAfterSubmit
      className="flex flex-row items-end gap-2 p-3 border-t border-foreground/10 bg-background/80 backdrop-blur-sm shrink-0"
    >
      <div className="w-full">
        <FormLayout.textarea
          field="message"
          ref={textAreaRef}
          disabled={busy}
          placeholder={busy ? t("waitingResponse") : t("askMe")}
          rows={2}
          style={{ maxHeight: 120, resize: "none", minHeight: 40 }}
          className="flex-1 text-xs font-neue-montreal bg-transparent outline-none placeholder:text-foreground/30 text-foreground leading-relaxed disabled:opacity-50 py-1"
          ignoreError
        />
      </div>
      <button
        disabled={busy || !message.trim()}
        aria-label={busy ? t("waitingResponse") : t("send")}
        className="shrink-0 cursor-pointer w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center hover:bg-secondary transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {busy ? <Loading /> : <FiSend className="w-3.5 h-3.5" />}
      </button>
    </FormLayout>
  );
};
