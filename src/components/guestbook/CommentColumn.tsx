import { FormLayout } from "@/components/form/FormLayout";
import { SendButton } from "@/components/ui/Button";
import { useGuestbook } from "@/contexts/Guestbook";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { useForm } from "@/hooks/useForm";
import { useSession } from "@/libs/auth-client";
import { GuestbookPayload } from "@/payloads/guestbook";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Pfp } from "./Pfp";

export const CommentColumn = () => {
  const { data } = useSession();
  const formGroup = useForm({ message: "" }, GuestbookPayload.postEntry);
  const {
    form: [form],
  } = formGroup;
  const { textAreaRef } = useAutosizeTextarea(form.message);
  const { postEntry } = useGuestbook();
  const t = useTranslations("Guestbook.form");
  const [loading, setLoading] = useState(false);

  const handlePost = async (_: any, form: GuestbookPayload.PostEntry) => {
    try {
      setLoading(true);
      await postEntry({ message: form.message });
      // error handled in form layout
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="flex justify-between gap-2 border border-foreground/30 rounded-lg p-4">
      <Pfp user={data.user} classname="sm:size-11.5 md:size-12.5 hidden sm:block" />
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Pfp user={data.user} classname="size-9.5 block sm:hidden" />
          <span className="font-semibold flex flex-col gap-1.5 min-w-0 w-full">{data.user.name}</span>
        </div>
        <FormLayout
          resetAfterSubmit
          form={formGroup}
          onFormSubmit={handlePost}
          className="flex flex-row items-end gap-2 rounded-2xl rounded-tl-none p-2 bg-primary"
        >
          <div className="flex-1 min-w-0">
            <FormLayout.textarea
              ref={textAreaRef}
              field="message"
              className="w-full min-h-15 outline-none p-2 text-[clamp(0.3rem,3vw,0.9rem)]"
              placeholder="Leave a comment!"
              ignoreError
            />
          </div>
          <SendButton loading={loading} disabled={loading || !form.message.trim()} aria-label={loading ? t("loading") : t("send")} />
        </FormLayout>
      </div>
    </div>
  );
};
