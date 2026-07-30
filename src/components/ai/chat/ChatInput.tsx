import { FormLayout } from "@/components/form/FormLayout";
import { SendButton } from "@/components/ui/Button";
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
  const form = useForm({ message: "" }, AIPayload.sendMessage.validator.body);
  const {
    form: [{ message }],
  } = form;
  const { textAreaRef } = useAutosizeTextarea(message);
  const busy = status === "loading" || status === "streaming";

  const handleSubmit = async (_: any, { message }: AIPayload.SendMessageBody) => {
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
      <SendButton loading={busy} disabled={busy || !message.trim()} aria-label={busy ? t("waitingResponse") : t("send")} />
    </FormLayout>
  );
};
